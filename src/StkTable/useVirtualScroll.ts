import { Ref, ShallowRef, computed, shallowRef, triggerRef } from 'vue';
import { DEFAULT_ROW_HEIGHT, DEFAULT_TABLE_HEIGHT, DEFAULT_TABLE_WIDTH } from './const';
import { MergeCellsCache } from './mergeCellsCache';
import { AutoRowHeightConfig, PrivateRowDT, PrivateStkTableColumn, RowKeyGen, StkTableColumn, UniqKey } from './types';
import { ScrollbarOptions } from './useScrollbar';
import { binarySearch } from './utils';
import { getCalculatedColWidth } from './utils/constRefUtils';
import { RowHeightFenwickTree } from './utils/rowHeightFenwickTree';

/** 暂存纵向虚拟滚动的数据 */
export type VirtualScrollStore = {
    /** 容器高度 */
    containerHeight: number;
    /** 一页的大小 */
    pageSize: number;
    /** 数组开始位置 */
    startIndex: number;
    /** 数组结束位置 */
    endIndex: number;
    /** 行高 */
    rowHeight: number;
    /** 表格定位上边距 */
    offsetTop: number;
    /** 纵向滚动条位置，用于判断是横向滚动还是纵向 */
    scrollTop: number;
    /** 总滚动高度 */
    scrollHeight: number;
    translateY: number;
    /** 视口实际起始行索引（rowspan 修正前的原始值，用于区分 above-viewport 行） */
    viewportStartIndex: number;
    /** 视口实际结束行索引（rowspan 修正前的原始值，用于区分 below-viewport 行） */
    viewportEndIndex: number;
};
/** 暂存横向虚拟滚动的数据 */
export type VirtualScrollXStore = {
    /** 父容器宽度 */
    containerWidth: number;
    /** 滚动容器的宽度 */
    scrollWidth: number;
    /** 开始位置 */
    startIndex: number;
    /** 结束始位置 */
    endIndex: number;
    /** 表格定位左边距 */
    offsetLeft: number;
    /** 横向滚动位置，用于判断是横向滚动还是纵向 */
    scrollLeft: number;
};

/** 列宽缓存项 */
type ColWidthCacheItem = { index: number; cumWidth: number };
/** 左侧固定列缓存项 */
type LeftFixedColCacheItem = { index: number; width: number };
/** 列宽缓存 */
type ColWidthCache<T> = { cols: T[] | null; nonFixedCols: ColWidthCacheItem[]; leftFixedCols: LeftFixedColCacheItem[] };

/** 横向虚拟滚动列宽缓存，避免每次滚动都 O(n) 构建 */
function useColWidthCache<T extends { fixed?: StkTableColumn<PrivateRowDT>['fixed'] }>(getColWidth: (col: T) => number) {
    let colWidthCache: ColWidthCache<T> = { cols: null, nonFixedCols: [], leftFixedCols: [] };

    function build(cols: T[]): ColWidthCache<T> {
        const nonFixedCols: ColWidthCacheItem[] = [];
        const leftFixedCols: LeftFixedColCacheItem[] = [];
        let cumWidth = 0;
        for (let i = 0; i < cols.length; i++) {
            const col = cols[i];
            const w = getColWidth(col);
            if (col.fixed === 'left') {
                leftFixedCols.push({ index: i, width: w });
                continue;
            }
            cumWidth += w;
            nonFixedCols.push({ index: i, cumWidth });
        }
        colWidthCache = { cols, nonFixedCols, leftFixedCols };
        return colWidthCache;
    }

    function get(cols: T[]): ColWidthCache<T> {
        if (colWidthCache.cols === cols) return colWidthCache;
        return build(cols);
    }

    function clear() {
        colWidthCache.cols = null;
    }

    return [get, clear] as const;
}

/** vue2 优化滚动回收延时 */
const VUE2_SCROLL_TIMEOUT_MS = 200;

/**
 * 合并单元格可视范围修正的最大迭代次数。
 * 合法（不重叠）的合并配置最多 2 轮即收敛（1 轮扩展 + 1 轮验证）；
 * 此上限仅针对重叠合并区域等病态配置兜底，防止修正循环过长。
 */
const MAX_MERGE_RANGE_EXPAND_ITERATIONS = 8;

/**
 * virtual scroll
 * @returns
 */
export function useVirtualScroll(
    props: any,
    tableContainerRef: Ref<HTMLElement | undefined>,
    trRef: Ref<HTMLTableRowElement[] | undefined>,
    dataSourceCopy: ShallowRef<PrivateRowDT[]>,
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>,
    tableHeaders: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>,
    rowKeyGen: RowKeyGen,
    maxRowSpan: Map<UniqKey, number>,
    /** 全局最大 rowspan（限定跨界修正扫描范围用） */
    getMaxRowSpanValue: () => number,
    scrollbarOptions: Ref<Required<ScrollbarOptions>>,
    isExperimentalScrollY: Ref<boolean | undefined>,
    /** mergeCells 结果共享缓存（与 useMergeCells 共用，避免重复调用用户回调） */
    mergeCellsCache: MergeCellsCache,
) {
    const tableHeaderHeight = computed(() => props.headerRowHeight * tableHeaders.value.length);

    const virtualScroll = shallowRef<VirtualScrollStore>({
        containerHeight: 0,
        rowHeight: props.rowHeight,
        pageSize: 0,
        startIndex: 0,
        endIndex: 0,
        offsetTop: 0,
        scrollTop: 0,
        scrollHeight: 0,
        translateY: 0,
        viewportStartIndex: 0,
        viewportEndIndex: 0,
    });

    // TODO: init pageSize

    const virtualScrollX = shallowRef<VirtualScrollXStore>({
        containerWidth: 0,
        scrollWidth: 0,
        startIndex: 0,
        endIndex: 0,
        offsetLeft: 0,
        scrollLeft: 0,
    });

    const [getColWidthCache, clearColWidthCache] = useColWidthCache<PrivateStkTableColumn<PrivateRowDT>>(getCalculatedColWidth);

    const hasExpandCol = computed(() => {
        return tableHeaderLast.value.some(col => col.type === 'expand');
    });

    /** 是否虚拟滚动标志 */
    const virtual_on = computed(() => {
        return props.virtual && dataSourceCopy.value.length > virtualScroll.value.pageSize;
    });

    const virtual_dataSourcePart = computed(() => {
        if (!virtual_on.value) return dataSourceCopy.value;
        const { startIndex, endIndex } = virtualScroll.value;
        return dataSourceCopy.value.slice(startIndex, endIndex + 1);
    });

    const virtual_offsetBottom = computed(() => {
        if (!virtual_on.value) return 0;
        const { startIndex, endIndex } = virtualScroll.value;
        const dataSourceCopyValue = dataSourceCopy.value;
        const rowHeight = getRowHeightFn.value();
        if (props.autoRowHeight) {
            // 由行高 Fenwick 树 O(log n) 推导：总高 − 含 endIndex 的累计高，避免尾部逐行累加
            const { tree } = getRowHeightTreeCache(dataSourceCopyValue);
            const offsetBottom = tree.total - tree.query(endIndex + 1);
            return offsetBottom > 0 ? offsetBottom : 0;
        }

        return (dataSourceCopyValue.length - startIndex - virtual_dataSourcePart.value.length) * rowHeight;
    });

    const virtualX_on = computed(() => {
        return (
            props.virtualX &&
            tableHeaderLast.value.reduce((sum, col) => (sum += getCalculatedColWidth(col)), 0) > virtualScrollX.value.containerWidth + 100
        );
    });

    /** 是否多级表头 */
    const isMultiLevelHeader = computed(() => tableHeaders.value.length > 1);

    /**
     * 需要参与可视范围修正的合并列集合。仅依赖 tableHeaderLast（columns 变化），
     * 缓存后避免在数据更新、纵向滚动换窗等高频调用 buildColMergeRange 时重复收集。
     * 无需修正时返回 null。
     */
    const virtualX_mergeColsInfo = computed(() => {
        const headers = tableHeaderLast.value;
        const headerLength = headers.length;
        // 右固定列始终渲染在可视区末尾，不参与主可视区合并修正
        let maxColIndex = headerLength;
        const mergeCols: { col: PrivateStkTableColumn<PrivateRowDT>; index: number }[] = [];
        for (let i = 0; i < headerLength; i++) {
            const col = headers[i];
            if (maxColIndex === headerLength && col.fixed === 'right') maxColIndex = i;
            // 固定列始终渲染，不需要修正可视范围
            if (col.mergeCells && !col.fixed) mergeCols.push({ col, index: i });
        }
        if (!mergeCols.length || !maxColIndex) return null;
        return { headerLength, maxColIndex, mergeCols };
    });

    /**
     * 收集行集合中的列合并（colspan）区间
     * @param rows 行数据
     * @param rowIndexBase mergeCells 入参 rowIndex 的起始值
     * @return { leftReach, rightEnd }  合并区间
     */
    function buildColMergeRange(rows: PrivateRowDT[], rowIndexBase: number) {
        const mergeColsInfo = virtualX_mergeColsInfo.value;
        if (!mergeColsInfo) return null;
        const { headerLength, maxColIndex, mergeCols } = mergeColsInfo;

        const leftReach = new Int32Array(headerLength).fill(-1);
        const rightEnd = new Int32Array(headerLength);
        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            for (let m = 0; m < mergeCols.length; m++) {
                const { col, index } = mergeCols[m];
                if (index >= maxColIndex) break;
                // 走共享缓存：与 buildHiddenCellMap / 渲染期的 mergeCells 调用复用同一份结果
                const { colspan } = mergeCellsCache.getMergeCellsResult(row, col, rowIndexBase + r, index);
                if (colspan > 1) {
                    const end = Math.min(index + colspan, maxColIndex);
                    for (let c = index; c < end; c++) {
                        if (leftReach[c] === -1 || index < leftReach[c]) leftReach[c] = index;
                        if (end > rightEnd[c]) rightEnd[c] = end;
                    }
                }
            }
        }
        return { leftReach, rightEnd };
    }

    /**
     * 全量数据的列合并覆盖信息（懒计算）。
     * 仅在 Y 虚拟滚动未开启（可视行即全量数据）且被消费时才遍历全量数据；
     * 依赖 dataSourceCopy 与 columns，数据/列变化时自动重算。
     * virtual + virtualX 模式下消费方走可视行分支，本 computed 直接返回 null，
     * 避免 O(rows × mergeCols) 的全量 mergeCells 调用浪费。
     */
    const virtualX_colMergeRangeFull = computed(() => {
        if (!virtualX_on.value || virtual_on.value) return null;
        return buildColMergeRange(dataSourceCopy.value, 0);
    });

    /**
     * virtual-x 列合并覆盖信息。
     * Y 虚拟滚动开启时仅计算可视行（rowIndex 传入绝对行索引，与渲染时 mergeCells 入参保持一致）；
     * 否则使用全量数据懒计算缓存（此时可视行即全量数据）。
     */
    const virtualX_colMergeRange = computed(() => {
        if (!virtualX_on.value) return null;
        if (virtual_on.value) {
            return buildColMergeRange(virtual_dataSourcePart.value, virtualScroll.value.startIndex);
        }
        return virtualX_colMergeRangeFull.value;
    });

    /**
     * 经列合并修正后的可视列范围。
     * 合并单元格的锚点列可能已滚出可视区（但合并区域仍覆盖可视列），
     * 也可能合并区域超出可视区右边界，需要将范围扩展到能完整渲染合并单元格。
     */
    const virtualX_colRange = computed(() => {
        let { startIndex, endIndex } = virtualScrollX.value;
        const mergeRange = virtualX_colMergeRange.value;
        if (mergeRange) {
            const { leftReach, rightEnd } = mergeRange;
            const len = leftReach.length;
            // 扩展后的范围可能引入新的合并单元格，迭代直到稳定（合法配置最多 2 轮，上限兜底病态配置）
            for (let k = 0; k < MAX_MERGE_RANGE_EXPAND_ITERATIONS; k++) {
                let newStart = startIndex;
                let newEnd = endIndex;
                const loopEnd = Math.min(endIndex, len);
                for (let i = Math.max(0, startIndex); i < loopEnd; i++) {
                    const reach = leftReach[i];
                    if (reach > -1 && reach < newStart) newStart = reach;
                    if (rightEnd[i] > newEnd) newEnd = rightEnd[i];
                }
                if (newStart === startIndex && newEnd === endIndex) break;
                startIndex = newStart;
                endIndex = newEnd;
            }
        }
        return { startIndex, endIndex };
    });

    /**
     * 多级表头横向虚拟滚动参数：以顶层列组为单位计算开始/结束位置。
     * - 只有整个顶层组完全滚出视口时才移除（避免 colSpan 变化导致抖动）。
     * - 单级表头时退化为与 tbody 相同的参数。
     * - 范围基于列合并修正后的 virtualX_colRange，保证合并单元格完整渲染。
     */
    const theadVirtualX = computed(() => {
        if (!virtualX_on.value) {
            const { startIndex, endIndex, offsetLeft } = virtualScrollX.value;
            return { startIndex, endIndex, offsetLeft };
        }

        const { startIndex, endIndex } = virtualX_colRange.value;

        if (!isMultiLevelHeader.value) {
            // 单级表头：offsetLeft 为起始列之前所有非固定列宽度之和
            const { nonFixedCols } = getColWidthCache(tableHeaderLast.value);
            const found = binarySearch(nonFixedCols, mid => (nonFixedCols[mid].index < startIndex ? -1 : 1));
            const offsetLeft = found > 0 ? nonFixedCols[found - 1].cumWidth : 0;
            return { startIndex, endIndex, offsetLeft };
        }

        // 多级表头：保留与修正后可视范围有交集的顶层列组
        const topLevelCols = tableHeaders.value[0];
        const totalLeafCount = tableHeaderLast.value.length;

        let theadStartIndex = totalLeafCount;
        let theadEndIndex = totalLeafCount;
        let theadOffsetLeft = 0;
        let cumLeft = 0;
        let foundStart = false;

        for (let i = 0, len = topLevelCols.length; i < len; i++) {
            const col = topLevelCols[i];
            if (col.fixed === 'left' || col.fixed === 'right') continue;

            const groupStart = col.__LF_S__ ?? 0;
            const groupEnd = col.__LF_E__ ?? groupStart + 1;
            const groupWidth = col.__W__ || getCalculatedColWidth(col);

            if (!foundStart && groupEnd > startIndex) {
                foundStart = true;
                theadStartIndex = groupStart;
                theadOffsetLeft = cumLeft;
            }
            if (foundStart) {
                if (groupStart >= endIndex) break;
                theadEndIndex = groupEnd;
            }
            cumLeft += groupWidth;
        }

        if (!foundStart) {
            theadOffsetLeft = cumLeft;
        }

        return { startIndex: theadStartIndex, endIndex: theadEndIndex, offsetLeft: theadOffsetLeft };
    });

    const virtualX_columnPart = computed(() => {
        const tableHeaderLastValue = tableHeaderLast.value;
        if (virtualX_on.value) {
            // 使用列合并修正后的可视范围
            const { startIndex, endIndex } = virtualX_colRange.value;
            // 将索引钳制到列数组范围内，防止列数减少时越界
            const maxIndex = tableHeaderLastValue.length;
            const validEndIndex = Math.min(endIndex, maxIndex);
            const validStartIndex = Math.min(startIndex, maxIndex);

            // 多级表头：分离左/右固定列，插入 spacer 标记实现对齐
            if (isMultiLevelHeader.value) {
                const leftFixedCols: PrivateStkTableColumn<PrivateRowDT>[] = [];
                const rightFixedCols: PrivateStkTableColumn<PrivateRowDT>[] = [];
                const visibleCols: PrivateStkTableColumn<PrivateRowDT>[] = [];
                for (let i = 0; i < tableHeaderLastValue.length; i++) {
                    const col = tableHeaderLastValue[i];
                    if (col.fixed === 'right') {
                        rightFixedCols.push(col);
                    } else if (col.fixed === 'left') {
                        leftFixedCols.push(col);
                    } else if (i >= validStartIndex && i < validEndIndex) {
                        visibleCols.push(col);
                    }
                }

                const result: PrivateStkTableColumn<PrivateRowDT>[] = [];
                result.push(...leftFixedCols);

                // left spacer：theadStart ~ tbodyStart 之间非 fixed:left 的叶子列数
                const theadStart = theadVirtualX.value.startIndex;
                const leftSpacerColspan = Math.max(0, startIndex - theadStart);
                if (leftSpacerColspan) {
                    result.push({ __VT_C_SP__: leftSpacerColspan } as PrivateStkTableColumn<PrivateRowDT>);
                }

                result.push(...visibleCols);

                // right spacer：tbodyEnd ~ theadEnd 之间的非 fixed:right 列数
                const rightSpacerColspan = Math.max(0, theadVirtualX.value.endIndex - endIndex);
                if (rightSpacerColspan) {
                    result.push({ __VT_C_SP__: rightSpacerColspan } as PrivateStkTableColumn<PrivateRowDT>);
                }
                result.push(...rightFixedCols);

                return result;
            }

            // 单级表头：保持原有重排逻辑（向后兼容）
            const leftCols: PrivateStkTableColumn<PrivateRowDT>[] = [];
            const rightCols: PrivateStkTableColumn<PrivateRowDT>[] = [];

            // 左侧固定列，如果在左边不可见区。则需要拿出来放在前面
            for (let i = 0; i < validStartIndex; i++) {
                const col = tableHeaderLastValue[i];
                if (col?.fixed === 'left') leftCols.push(col);
            }
            // 右侧固定列，如果在右边不可见区。则需要拿出来放在后面
            for (let i = validEndIndex; i < tableHeaderLastValue.length; i++) {
                const col = tableHeaderLastValue[i];
                if (col?.fixed === 'right') rightCols.push(col);
            }

            const mainColumns = tableHeaderLastValue.slice(validStartIndex, validEndIndex);
            return leftCols.concat(mainColumns).concat(rightCols);
        }
        return tableHeaderLastValue;
    });

    /**
     * tbody 行渲染的列分段（超长 colspan 优化）。
     * 修正扩展出的区域都在原始可视视口之外，非锚点单元格无需真实渲染：
     * - leftExpand（原始视口左侧扩展区）：由调用方逐行处理——锚点/被覆盖单元格保留原行为，
     *   其余连续普通单元格合并为单个 colspan 占位 td（占位相同列槽位，保持对齐）；
     * - 右侧扩展区：完全不渲染（不影响可视单元格对齐，区域在屏幕外）。
     * thead 仍保持完整修正范围（锚点 colspan 需要真实列槽位），仅 tbody 收缩。
     * 多级表头含 spacer/分组逻辑，暂不分段（返回 null 回退完整列列表）。
     */
    const virtualX_expandColSegments = computed(() => {
        if (!virtualX_on.value || isMultiLevelHeader.value) return null;
        const { startIndex: xStart, endIndex: xEnd } = virtualScrollX.value;
        const { startIndex: cStart, endIndex: cEnd } = virtualX_colRange.value;
        // 无修正扩展时无需分段
        if (cStart >= xStart && cEnd <= xEnd) return null;

        const headers = tableHeaderLast.value;
        const maxIndex = headers.length;
        const vs = Math.min(cStart, maxIndex);
        const ve = Math.min(cEnd, maxIndex);

        const prefix: PrivateStkTableColumn<PrivateRowDT>[] = [];
        const suffix: PrivateStkTableColumn<PrivateRowDT>[] = [];
        for (let i = 0; i < headers.length; i++) {
            const col = headers[i];
            if (i < vs && col.fixed === 'left') prefix.push(col);
            else if (i >= ve && col.fixed === 'right') suffix.push(col);
        }

        return {
            prefix,
            leftExpand: headers.slice(vs, Math.min(xStart, ve)),
            // 可视区取原始视口范围；[xEnd, cEnd) 为右扩展区，不进入 tbody 行列表
            viewport: headers.slice(Math.min(xStart, ve), Math.min(xEnd, ve)),
            suffix,
            /** leftExpand 起始的绝对叶子列索引（mergeCells 缓存键用） */
            leftExpandStart: vs,
        };
    });

    /**
     * 表头横向虚拟滚动：
     * - 单级表头：最后一行使用 virtualX_columnPart，其他行原样返回。
     * - 多级表头：按顶层组粒度过滤（整个组滚出才移除），保持 colSpan 稳定。
     */
    const virtualX_tableHeaders = computed(() => {
        if (!virtualX_on.value) return tableHeaders.value;
        if (isMultiLevelHeader.value) {
            const { startIndex, endIndex } = theadVirtualX.value;
            return tableHeaders.value.map(row => {
                return row.filter(col => {
                    if (col.fixed === 'left' || col.fixed === 'right') return true;
                    const leafStart = col.__LF_S__ ?? 0;
                    const leafEnd = col.__LF_E__ ?? leafStart + 1;
                    return leafEnd > startIndex && leafStart < endIndex;
                });
            });
        }
        // 单级：最后一行用 virtualX_columnPart
        const headers = tableHeaders.value;
        return headers.map((row, i) => (i === headers.length - 1 ? virtualX_columnPart.value : row));
    });

    /** 展开行 colspan：虚拟滚动时等于所有 td 元素数量（含 spacer）之和 */
    const expandRowColspan = computed(() => {
        if (!virtualX_on.value) return tableHeaderLast.value.length;
        const spacers = virtualX_columnPart.value.filter(c => c.__VT_C_SP__);
        // 2 = vt-x-left + vt-x-right
        // 每个 spacer 项占 1 个位置，colspan > 1 时额外增加 (colspan - 1)
        return 2 + virtualX_columnPart.value.length + spacers.reduce((sum, s) => sum + Math.max(0, (s.__VT_C_SP__ ?? 0) - 1), 0);
    });

    const virtualX_offsetRight = computed(() => {
        if (!virtualX_on.value) return 0;
        // 多级表头使用 theadEndIndex，单级使用列合并修正后的 endIndex
        const endIndex = isMultiLevelHeader.value ? theadVirtualX.value.endIndex : virtualX_colRange.value.endIndex;
        let width = 0;
        const tableHeaderLastValue = tableHeaderLast.value;
        for (let i = endIndex; i < tableHeaderLastValue.length; i++) {
            const col = tableHeaderLastValue[i];
            if (col.fixed !== 'right') {
                width += getCalculatedColWidth(col);
            }
        }
        return width;
    });

    const getRowHeightFn = computed(() => {
        const rowHeight = props.rowHeight || DEFAULT_ROW_HEIGHT;
        let rowHeightFn: (row?: PrivateRowDT) => number = () => rowHeight;
        if (props.autoRowHeight) {
            const tempRowHeightFn = rowHeightFn;
            rowHeightFn = (row?: PrivateRowDT) => getAutoRowHeight(row) || tempRowHeightFn(row);
        }
        if (hasExpandCol.value) {
            const expandedRowHeight = props.expandConfig?.height;
            const tempRowHeightFn = rowHeightFn;
            rowHeightFn = (row?: PrivateRowDT) => (row && row.__EXP_R__ && expandedRowHeight) || tempRowHeightFn(row);
        }
        return rowHeightFn;
    });

    /**
     * 初始化虚拟滚动参数
     * @param {number} [height] 虚拟滚动的高度
     */
    function initVirtualScroll(height?: number) {
        initVirtualScrollY(height);
        initVirtualScrollX();
    }

    /**
     * 浅合并 patch 到 shallowRef store，且仅当任一属性值实际变化时才 triggerRef。
     * shallowRef 内部属性变更不会触发响应式，必须手动 triggerRef；但无条件触发会让
     * 「值未变」的调用也强制整表重渲染（每帧滚动多付 1~5ms 渲染成本）。
     * 本函数恢复 Vue 深响应式 ref 的 hasChanged 语义，滚动重算回到 0.02ms 级。
     */
    function assignVs<T extends object>(ref: ShallowRef<T>, patch: Partial<T>) {
        const store = ref.value;
        let changed = false;
        for (const key in patch) {
            const k = key as keyof T;
            if (store[k] !== patch[k]) {
                store[k] = patch[k] as T[keyof T];
                changed = true;
            }
        }
        if (changed) triggerRef(ref);
    }

    /**
     * 初始化Y虚拟滚动参数
     * @param {number} [height] 虚拟滚动的高度
     */
    function initVirtualScrollY(height?: number) {
        if (height !== void 0 && typeof height !== 'number') {
            console.warn('initVirtualScrollY: height must be a number');
            height = 0;
        }
        const { clientHeight, scrollHeight } = tableContainerRef.value || {};
        // 当 isExperimentalScrollY 为 true 时，DOM 的 scrollTop 始终为 0（纵向滚动通过 transform 模拟）
        // 此时应该使用 virtualScroll 中保存的 scrollTop 值
        let scrollTop = isExperimentalScrollY.value ? virtualScroll.value.scrollTop : tableContainerRef.value?.scrollTop || 0;

        const rowHeight = getRowHeightFn.value();
        const containerHeight = height || clientHeight || DEFAULT_TABLE_HEIGHT;
        const { headless } = props;
        let pageSize = Math.ceil(containerHeight / rowHeight);
        if (!headless) {
            /** 表头高度占几行表体高度数 */
            const headerToBodyRowHeightCount = Math.floor(tableHeaderHeight.value / rowHeight);
            pageSize -= headerToBodyRowHeightCount; //减去表头行数
        }
        // 变高模式下用行高 Fenwick 树的真实总高钳制（与 updateVirtualScrollY 的 scrollHeight 语义一致）
        const totalRowsHeight =
            props.autoRowHeight || hasExpandCol.value
                ? getRowHeightTreeCache(dataSourceCopy.value).tree.total
                : dataSourceCopy.value.length * rowHeight;
        const maxScrollTop = Math.max(0, totalRowsHeight + tableHeaderHeight.value - containerHeight);
        if (scrollTop > maxScrollTop) {
            /** fix： 滚动条不在顶部时，表格数据变少，导致滚动条位置有误 */
            scrollTop = maxScrollTop;
        }
        assignVs(virtualScroll, { containerHeight, pageSize, scrollHeight });
        updateVirtualScrollY(scrollTop);
    }

    function initVirtualScrollX() {
        const { clientWidth, scrollLeft, scrollWidth } = tableContainerRef.value || {};
        assignVs(virtualScrollX, {
            containerWidth: clientWidth || DEFAULT_TABLE_WIDTH,
            scrollWidth: scrollWidth || DEFAULT_TABLE_WIDTH,
        });
        updateVirtualScrollX(scrollLeft);
    }

    let vue2ScrollYTimeout: null | number = null;

    /**
     * every row actual height.
     * 不在当前数据中的行键条目会在行高 Fenwick 树缓存重建时被修剪（见 getRowHeightTreeCache），不会无限残留。
     */
    const autoRowHeightMap = new Map<string, number>();

    /** 行高 Fenwick 树缓存：以 dataSourceCopy 数组引用与行高函数为缓存键，任一变化时懒重建（仿 useColWidthCache 模式） */
    let rowHeightTreeCache: {
        data: PrivateRowDT[] | null;
        tree: RowHeightFenwickTree;
        keyIndex: Map<string, number>;
        heightFn: ((row?: PrivateRowDT) => number) | null;
    } = {
        data: null,
        tree: new RowHeightFenwickTree(0),
        keyIndex: new Map(),
        heightFn: null,
    };

    /**
     * 获取行高 Fenwick 树缓存。dataSourceCopy 引用或行高函数变化（如 rowHeight / expectedHeight prop 变更）时 O(n) 重建：
     * 各行高度取 getRowHeightFn(row) 当前值（实测/setAutoHeight 值 → expectedHeight → 默认行高），
     * 并顺带修剪 autoRowHeightMap（删除不在新数据中的行键，防止内存无限残留）。
     */
    function getRowHeightTreeCache(data: PrivateRowDT[]) {
        const heightFn = getRowHeightFn.value;
        if (rowHeightTreeCache.data === data && rowHeightTreeCache.heightFn === heightFn) return rowHeightTreeCache;
        const len = data.length;
        const heights = new Float64Array(len);
        const keyIndex = new Map<string, number>();
        for (let i = 0; i < len; i++) {
            const row = data[i];
            keyIndex.set(String(rowKeyGen(row)), i);
            heights[i] = heightFn(row);
        }
        const tree = new RowHeightFenwickTree(len);
        tree.build(heights);
        // 修剪：不在新数据中的行键的行高（仅发生在数据变化的低频时刻）
        for (const key of autoRowHeightMap.keys()) {
            if (!keyIndex.has(key)) autoRowHeightMap.delete(key);
        }
        rowHeightTreeCache = { data, tree, keyIndex, heightFn };
        return rowHeightTreeCache;
    }

    /** 内部诊断：行高缓存状态（不暴露为组件实例方法，测试用） */
    function getRowHeightCacheInfo() {
        return {
            mapSize: autoRowHeightMap.size,
            mapKeys: [...autoRowHeightMap.keys()],
            cacheSize: rowHeightTreeCache.keyIndex.size,
            total: rowHeightTreeCache.tree.total,
        };
    }

    /** 如果行高度有变化，则要调用此方法清除保存的行高 */
    function setAutoHeight(rowKey: UniqKey, height?: number | null) {
        const key = String(rowKey);
        // 行在当前数据中则对树做单点更新，使定位/总高立即生效；行键不在当前数据中时仅更新 Map
        const cache = rowHeightTreeCache;
        const idx = cache.data === dataSourceCopy.value ? cache.keyIndex.get(key) : void 0;
        const row = idx === void 0 || !cache.data ? void 0 : cache.data[idx];
        const oldHeight = row ? getRowHeightFn.value(row) : 0;
        if (!height) {
            autoRowHeightMap.delete(key);
        } else {
            autoRowHeightMap.set(key, height);
        }
        if (row) cache.tree.add(idx as number, getRowHeightFn.value(row) - oldHeight);
    }

    function clearAllAutoHeight() {
        autoRowHeightMap.clear();
        // 失效树缓存：下次访问时按估算高度重建
        rowHeightTreeCache.data = null;
    }

    /**
     * 前 count 行的累计高度（即第 count 行（0 起始）顶部的偏移量）。
     * 固定行高直接相乘；变高/展开行逐行累加（实测/setAutoHeight 值 → expectedHeight → rowHeight）。
     */
    function getRowsHeight(count: number) {
        const data = dataSourceCopy.value;
        const end = Math.min(count, data.length);
        if (end <= 0) return 0;
        const heightFn = getRowHeightFn.value;
        if (!props.autoRowHeight && !hasExpandCol.value) return end * heightFn();
        let sum = 0;
        for (let i = 0; i < end; i++) {
            sum += heightFn(data[i]);
        }
        return sum;
    }

    function getAutoRowHeight(row?: PrivateRowDT) {
        if (!row) return;
        const rowKey = rowKeyGen(row);
        const storedHeight = autoRowHeightMap.get(String(rowKey));
        if (storedHeight) {
            return storedHeight;
        }
        const expectedHeight: AutoRowHeightConfig<PrivateRowDT>['expectedHeight'] = props.autoRowHeight?.expectedHeight;
        if (expectedHeight) {
            if (typeof expectedHeight === 'function') {
                return expectedHeight(row);
            } else {
                return expectedHeight;
            }
        }
    }

    /** 通过滚动条位置，计算虚拟滚动的参数 */
    function updateVirtualScrollY(sTop = 0) {
        const { pageSize, scrollTop, startIndex: oldStartIndex, endIndex: oldEndIndex, containerHeight } = virtualScroll.value;
        // 先更新滚动条位置记录，其他地方有依赖。(stripe 时ArrowUp/Down滚动依赖)

        const dataSourceCopyTemp = dataSourceCopy.value;
        const dataLength = dataSourceCopyTemp.length;
        const rowHeight = getRowHeightFn.value();

        const vsValue: any = {};
        // 变高模式取行高 Fenwick 树的真实累计高度（实测优先，未测量行按估算高度），替代「行数 × 默认行高」的粗略估算
        const totalRowsHeight =
            props.autoRowHeight || hasExpandCol.value ? getRowHeightTreeCache(dataSourceCopyTemp).tree.total : dataLength * rowHeight;
        const scrollHeight = totalRowsHeight + tableHeaderHeight.value;
        const { enabled: scrollbarEnable } = scrollbarOptions.value;
        if (scrollbarEnable) {
            vsValue.scrollHeight = scrollHeight;
            if (isExperimentalScrollY.value) {
                let maxTop: number;
                sTop = sTop < 0 ? 0 : sTop < (maxTop = scrollHeight - containerHeight) ? sTop : maxTop;
                vsValue.translateY = props.scrollRowByRow ? 0 : -(sTop % rowHeight);
            }
        }
        vsValue.scrollTop = sTop;

        assignVs(virtualScroll, vsValue);

        if (!virtual_on.value) {
            // github #34 init
            assignVs(virtualScroll, {
                startIndex: 0,
                endIndex: 0,
                offsetTop: 0,
                viewportStartIndex: 0,
                viewportEndIndex: 0,
            });
            return;
        }

        const { autoRowHeight, stripe, optimizeVue2Scroll } = props;
        // const dataLength = dataSourceCopyTemp.length;

        let startIndex = 0;
        let endIndex = dataLength;
        let autoRowHeightTop = 0;
        if (autoRowHeight || hasExpandCol.value) {
            const treeCache = getRowHeightTreeCache(dataSourceCopyTemp);
            if (autoRowHeight && trRef.value) {
                // Batch DOM measurements for better performance
                const trElements = trRef.value;
                const { tree, keyIndex } = treeCache;
                const heightFn = getRowHeightFn.value;
                for (let i = 0, len = trElements.length; i < len; i++) {
                    const tr = trElements[i];
                    const rowKey = tr.dataset.rowKey;
                    if (!rowKey || autoRowHeightMap.has(rowKey)) continue;
                    const idx = keyIndex.get(rowKey);
                    const row = idx === void 0 ? void 0 : dataSourceCopyTemp[idx];
                    // 本次测量前树中记录的高度（实测/setAutoHeight 值或估算值）
                    const oldHeight = row ? heightFn(row) : 0;
                    autoRowHeightMap.set(rowKey, tr.offsetHeight);
                    // 实测高度为 0 时有效高度不变（getAutoRowHeight 忽略 0 值），跳过树更新
                    if (idx !== void 0 && tr.offsetHeight) tree.add(idx, tr.offsetHeight - oldHeight);
                }
            }
            // calculate startIndex：树上二分，累计高度（含本行）首次 >= sTop 的行，O(log n)
            const tree = treeCache.tree;
            startIndex = tree.findFirstPrefixGE(sTop);
            if (startIndex >= dataLength) {
                // sTop 超过总高：与旧逐行累加语义保持一致（startIndex 停留 0，offsetTop 为总高）
                startIndex = 0;
                autoRowHeightTop = tree.total;
            } else {
                autoRowHeightTop = tree.query(startIndex);
            }
            // calculate endIndex：树上二分，自 startIndex 之后累计高度首次 >= containerHeight 的行，O(log n)
            const found = tree.findFirstPrefixGE(tree.query(startIndex + 1) + containerHeight);
            endIndex = Math.max(found, Math.min(startIndex + 1, dataLength));
        } else {
            startIndex = Math.floor(sTop / rowHeight);
            endIndex = startIndex + pageSize;
            if (startIndex === oldStartIndex && endIndex === oldEndIndex) {
                // Not change: still update viewportStartIndex/viewportEndIndex for above/below-viewport tracking
                const vs = virtualScroll.value;
                if (vs.viewportStartIndex !== startIndex || vs.viewportEndIndex !== endIndex) {
                    vs.viewportStartIndex = startIndex;
                    vs.viewportEndIndex = endIndex;
                    triggerRef(virtualScroll);
                }
                // Not change: not update
                return;
            }
        }

        // Save viewportStartIndex/viewportEndIndex before rowspan/stripe correction
        const viewportStartIndex = startIndex;
        const viewportEndIndex = endIndex;

        if (maxRowSpan.size) {
            // fix startIndex：查找是否有合并行跨越当前startIndex
            let correctedStartIndex = startIndex;
            let correctedEndIndex = endIndex;

            // 跨越 startIndex 的锚点行必然位于 [startIndex - maxSpan + 1, startIndex - 1]，
            // 在此范围内反向扫描即可（保留最早锚点语义：循环不提前 break，最终留下最小 i），
            // 避免原实现从 0 起 O(startIndex) 全量扫描——大数据量滚动到深处时每帧开销巨大。
            const scanFrom = Math.max(0, startIndex - getMaxRowSpanValue() + 1);
            for (let i = startIndex - 1; i >= scanFrom; i--) {
                const row = dataSourceCopyTemp[i];
                if (!row) continue;
                const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
                if (spanEndIndex > startIndex) {
                    // 找到跨越startIndex的合并行，将startIndex修正为合并行的起始索引
                    correctedStartIndex = i;
                    if (spanEndIndex > endIndex) {
                        // 合并行跨越了整个可视区
                        // spanEndIndex 是开区间末端（最后一行+1），endIndex 需要的是闭区间最后一行，
                        // 否则会把合并区域外的下一行也算进视口下方，导致下方占位 tr 多 1 行高，
                        // 跨视口底部的 rowspan 单元格可视高度被撑大 1 行（滚动时居中文字抖动）。
                        correctedEndIndex = spanEndIndex - 1;
                    }
                }
            }

            // fix endIndex：查找是否有合并行跨越当前endIndex
            for (let i = correctedStartIndex; i < endIndex; i++) {
                const row = dataSourceCopyTemp[i];
                if (!row) continue;
                const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
                if (spanEndIndex > correctedEndIndex) {
                    // 找到跨越endIndex的合并行，将endIndex修正为合并行的结束索引（闭区间最后一行）。
                    // spanEndIndex 为开区间末端，需 -1，避免把合并区域外的一行并入视口下方占位 tr。
                    correctedEndIndex = Math.max(spanEndIndex - 1, correctedEndIndex);
                }
            }

            startIndex = correctedStartIndex;
            endIndex = correctedEndIndex;
        }

        if (stripe && !isExperimentalScrollY.value && startIndex > 0 && startIndex % 2) {
            // 斑马纹情况下，每滚动偶数行才加载。防止斑马纹错位。
            startIndex -= 1; // 奇数-1变成偶数
            if (autoRowHeight || hasExpandCol.value) {
                const height = getRowHeightFn.value(dataSourceCopyTemp[startIndex]);
                autoRowHeightTop -= height;
            }
        }

        startIndex = Math.max(0, startIndex);
        endIndex = Math.min(endIndex, dataLength);

        if (startIndex >= endIndex) {
            // fallback
            startIndex = endIndex - pageSize;
        }

        if (vue2ScrollYTimeout) {
            window.clearTimeout(vue2ScrollYTimeout);
        }

        let offsetTop = 0;
        if (autoRowHeight || hasExpandCol.value) {
            offsetTop = autoRowHeightTop;
        } else {
            offsetTop = startIndex * rowHeight;
        }

        /**
         * en:  If scroll faster than one page, roll back
         */
        if (!optimizeVue2Scroll || sTop <= scrollTop || Math.abs(oldStartIndex - startIndex) >= pageSize) {
            // scroll up
            assignVs(virtualScroll, { startIndex, endIndex, offsetTop, viewportStartIndex, viewportEndIndex });
        } else {
            // vue2 scroll down optimize
            assignVs(virtualScroll, { endIndex, viewportStartIndex, viewportEndIndex });
            vue2ScrollYTimeout = window.setTimeout(() => {
                assignVs(virtualScroll, { startIndex, offsetTop, viewportStartIndex, viewportEndIndex });
            }, VUE2_SCROLL_TIMEOUT_MS);
        }
    }

    let vue2ScrollXTimeout: null | number = null;

    /**
     * Calculate virtual scroll parameters based on horizontal scroll bar position
     */
    function updateVirtualScrollX(sLeft = 0) {
        if (!props.virtualX) return;
        const tableHeaderLastValue = tableHeaderLast.value;
        const headerLength = tableHeaderLastValue?.length;
        if (!headerLength) return;

        const { scrollLeft, containerWidth } = virtualScrollX.value;
        let startIndex = 0;
        let offsetLeft = 0;
        /** 横向滚动时，第一列的剩余宽度 */
        let leftFirstColRestWidth = 0;

        // 使用缓存的累计宽度数组，列配置不变时直接复用
        const { nonFixedCols, leftFixedCols } = getColWidthCache(tableHeaderLastValue);

        if (nonFixedCols.length > 0 && sLeft > 0) {
            // 二分查找：找到第一个累计宽度 > sLeft 的非固定列
            // 使用 <= 确保当列右边缘恰好等于 sLeft 时（列完全滚出视口），不再将其作为起始列
            const found = binarySearch(nonFixedCols, mid => {
                return nonFixedCols[mid].cumWidth <= sLeft ? -1 : 1;
            });
            const idx = Math.min(found, nonFixedCols.length - 1);
            startIndex = nonFixedCols[idx].index;
            offsetLeft = idx > 0 ? nonFixedCols[idx - 1].cumWidth : 0;
            leftFirstColRestWidth = nonFixedCols[idx].cumWidth - sLeft;
        } else if (nonFixedCols.length > 0) {
            startIndex = nonFixedCols[0].index;
        }
        // -----
        // 根据 startIndex 快速计算实际在可视区域内的左侧固定列宽度
        let actualLeftColWidthSum = 0;
        for (const leftCol of leftFixedCols) {
            if (leftCol.index >= startIndex) break;
            actualLeftColWidthSum += leftCol.width;
        }
        const containerW = containerWidth - actualLeftColWidthSum;
        let endIndex = headerLength;
        let endColWidthSum = leftFirstColRestWidth;

        /**
         * 这里根据 leftFirstColRestWidth 如果为0 说明开始位置恰好在单元格边界，则计算endIndex 需要从当前单元格开始。
         * 如果有值，则说明开始位置的单元格已经切了一半，需要从下一个单元格开始计算 因此startIndex + 1。
         */
        for (let colIndex = leftFirstColRestWidth ? startIndex + 1 : startIndex; colIndex < headerLength; colIndex++) {
            const col = tableHeaderLastValue[colIndex];
            endColWidthSum += getCalculatedColWidth(col);
            // 列宽大于容器宽度则停止
            if (endColWidthSum >= containerW) {
                endIndex = colIndex + 1; // slice endIndex + 1
                break;
            }
        }

        endIndex = Math.min(endIndex, headerLength);

        if (vue2ScrollXTimeout) {
            window.clearTimeout(vue2ScrollXTimeout);
        }

        // <= 等于是因为初始化时要赋值
        if (!props.optimizeVue2Scroll || sLeft <= scrollLeft) {
            // 向左滚动
            assignVs(virtualScrollX, { startIndex, endIndex, offsetLeft, scrollLeft: sLeft });
        } else {
            // vue2 向右滚动优化
            assignVs(virtualScrollX, { endIndex, scrollLeft: sLeft });
            vue2ScrollXTimeout = window.setTimeout(() => {
                assignVs(virtualScrollX, { startIndex, offsetLeft });
            }, VUE2_SCROLL_TIMEOUT_MS);
        }
    }

    return [
        virtualScroll,
        virtualScrollX,
        virtual_on,
        virtual_dataSourcePart,
        virtual_offsetBottom,
        virtualX_on,
        virtualX_offsetRight,
        tableHeaderHeight,
        initVirtualScroll,
        initVirtualScrollY,
        initVirtualScrollX,
        updateVirtualScrollY,
        updateVirtualScrollX,
        setAutoHeight,
        clearAllAutoHeight,
        getRowsHeight,
        clearColWidthCache,
        virtualX_tableHeaders,
        expandRowColspan,
        theadVirtualX,
        virtualX_columnPart,
        virtualX_expandColSegments,
        getRowHeightCacheInfo,
    ] as const;
}
