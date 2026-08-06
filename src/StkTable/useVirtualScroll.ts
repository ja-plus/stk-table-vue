import { Ref, ShallowRef, computed, ref } from 'vue';
import { DEFAULT_ROW_HEIGHT, DEFAULT_TABLE_HEIGHT, DEFAULT_TABLE_WIDTH } from './const';
import { AutoRowHeightConfig, PrivateRowDT, PrivateStkTableColumn, RowKeyGen, StkTableColumn, UniqKey } from './types';
import { ScrollbarOptions } from './useScrollbar';
import { binarySearch } from './utils';
import { getCalculatedColWidth } from './utils/constRefUtils';

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
    scrollbarOptions: Ref<Required<ScrollbarOptions>>,
    isExperimentalScrollY: Ref<boolean | undefined>,
) {
    const tableHeaderHeight = computed(() => props.headerRowHeight * tableHeaders.value.length);

    const virtualScroll = ref<VirtualScrollStore>({
        containerHeight: 0,
        rowHeight: props.rowHeight,
        pageSize: 0,
        startIndex: 0,
        endIndex: 0,
        offsetTop: 0,
        scrollTop: 0,
        scrollHeight: 0,
        translateY: 0,
    });

    // TODO: init pageSize

    const virtualScrollX = ref<VirtualScrollXStore>({
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
            let offsetBottom = 0;
            for (let i = endIndex + 1; i < dataSourceCopyValue.length; i++) {
                const rowHeight = getRowHeightFn.value(dataSourceCopyValue[i]);
                offsetBottom += rowHeight;
            }
            return offsetBottom;
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
     * 列合并覆盖信息（全量数据预计算缓存，virtual-x 下用于修正可视列范围）
     * - colMergeLeftReach[i]: 覆盖第 i 列的合并单元格锚点列索引，-1 表示无覆盖
     * - colMergeRightEnd[i]: 覆盖第 i 列的合并单元格结束列索引（不含）
     */
    let colMergeLeftReach: Int32Array | null = null;
    let colMergeRightEnd: Int32Array | null = null;

    /**
     * 收集行集合中的列合并（colspan）区间
     * @param rows 行数据
     * @param rowIndexBase mergeCells 入参 rowIndex 的起始值
     */
    function buildColMergeRange(rows: PrivateRowDT[], rowIndexBase: number) {
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

        const leftReach = new Int32Array(headerLength).fill(-1);
        const rightEnd = new Int32Array(headerLength);
        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            for (let m = 0; m < mergeCols.length; m++) {
                const { col, index } = mergeCols[m];
                if (index >= maxColIndex) break;
                const { colspan = 1 } = col.mergeCells!({ row, col, rowIndex: rowIndexBase + r, colIndex: index }) || {};
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

    /** 数据/列变化时重新计算全量列合并覆盖信息（仅 virtualX 开启时需要） */
    function updateVirtualXColMerge() {
        if (!props.virtualX) {
            colMergeLeftReach = null;
            colMergeRightEnd = null;
            return;
        }
        const result = buildColMergeRange(dataSourceCopy.value, 0);
        colMergeLeftReach = result?.leftReach ?? null;
        colMergeRightEnd = result?.rightEnd ?? null;
    }

    /**
     * virtual-x 列合并覆盖信息。
     * Y 虚拟滚动开启时仅计算可视行（rowIndex 与渲染时 mergeCells 入参保持一致）；
     * 否则使用全量数据预计算缓存（此时可视行即全量数据）。
     */
    const virtualX_colMergeRange = computed(() => {
        if (!virtualX_on.value) return null;
        if (virtual_on.value) {
            return buildColMergeRange(virtual_dataSourcePart.value, 0);
        }
        if (!colMergeLeftReach || !colMergeRightEnd) return null;
        return { leftReach: colMergeLeftReach, rightEnd: colMergeRightEnd };
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
        const maxScrollTop = Math.max(0, dataSourceCopy.value.length * rowHeight + tableHeaderHeight.value - containerHeight);
        if (scrollTop > maxScrollTop) {
            /** fix： 滚动条不在顶部时，表格数据变少，导致滚动条位置有误 */
            scrollTop = maxScrollTop;
        }
        Object.assign(virtualScroll.value, { containerHeight, pageSize, scrollHeight });
        updateVirtualScrollY(scrollTop);
    }

    function initVirtualScrollX() {
        const { clientWidth, scrollLeft, scrollWidth } = tableContainerRef.value || {};
        virtualScrollX.value.containerWidth = clientWidth || DEFAULT_TABLE_WIDTH;
        virtualScrollX.value.scrollWidth = scrollWidth || DEFAULT_TABLE_WIDTH;
        updateVirtualScrollX(scrollLeft);
    }

    let vue2ScrollYTimeout: null | number = null;

    /**
     * every row actual height.
     * FIXME: use a weak map instead of a plain map
     */
    const autoRowHeightMap = new Map<string, number>();
    /** 如果行高度有变化，则要调用此方法清除保存的行高 */
    function setAutoHeight(rowKey: UniqKey, height?: number | null) {
        const key = String(rowKey);
        if (!height) {
            autoRowHeightMap.delete(key);
        } else {
            autoRowHeightMap.set(key, height);
        }
    }

    function clearAllAutoHeight() {
        autoRowHeightMap.clear();
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
        const scrollHeight = dataLength * rowHeight + tableHeaderHeight.value;
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

        Object.assign(virtualScroll.value, vsValue);

        if (!virtual_on.value) {
            // github #34 init
            Object.assign(virtualScroll.value, { startIndex: 0, endIndex: 0, offsetTop: 0 });
            return;
        }

        const { autoRowHeight, stripe, optimizeVue2Scroll } = props;
        // const dataLength = dataSourceCopyTemp.length;

        let startIndex = 0;
        let endIndex = dataLength;
        let autoRowHeightTop = 0;
        if (autoRowHeight || hasExpandCol.value) {
            if (autoRowHeight && trRef.value) {
                // Batch DOM measurements for better performance
                const trElements = trRef.value;
                for (let i = 0, len = trElements.length; i < len; i++) {
                    const tr = trElements[i];
                    const rowKey = tr.dataset.rowKey;
                    if (!rowKey || autoRowHeightMap.has(rowKey)) continue;
                    autoRowHeightMap.set(rowKey, tr.offsetHeight);
                }
            }
            // calculate startIndex
            for (let i = 0; i < dataLength; i++) {
                const height = getRowHeightFn.value(dataSourceCopyTemp[i]);
                autoRowHeightTop += height;
                if (autoRowHeightTop >= sTop) {
                    startIndex = i;
                    autoRowHeightTop -= height;
                    break;
                }
            }
            // calculate endIndex
            let containerHeightSum = 0;
            for (let i = startIndex + 1; i < dataLength; i++) {
                containerHeightSum += getRowHeightFn.value(dataSourceCopyTemp[i]);
                if (containerHeightSum >= containerHeight) {
                    endIndex = i;
                    break;
                }
            }
        } else {
            startIndex = Math.floor(sTop / rowHeight);
            endIndex = startIndex + pageSize;
            if (startIndex === oldStartIndex && endIndex === oldEndIndex) {
                // Not change: not update
                return;
            }
        }

        if (maxRowSpan.size) {
            // fix startIndex：查找是否有合并行跨越当前startIndex
            let correctedStartIndex = startIndex;
            let correctedEndIndex = endIndex;

            for (let i = 0; i < startIndex; i++) {
                const row = dataSourceCopyTemp[i];
                if (!row) continue;
                const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
                if (spanEndIndex > startIndex) {
                    // 找到跨越startIndex的合并行，将startIndex修正为合并行的起始索引
                    correctedStartIndex = i;
                    if (spanEndIndex > endIndex) {
                        // 合并行跨越了整个可视区
                        correctedEndIndex = spanEndIndex;
                    }
                    break;
                }
            }

            // fix endIndex：查找是否有合并行跨越当前endIndex
            for (let i = correctedStartIndex; i < endIndex; i++) {
                const row = dataSourceCopyTemp[i];
                if (!row) continue;
                const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
                if (spanEndIndex > correctedEndIndex) {
                    // 找到跨越endIndex的合并行，将endIndex修正为合并行的结束索引
                    correctedEndIndex = Math.max(spanEndIndex, correctedEndIndex);
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
            Object.assign(virtualScroll.value, { startIndex, endIndex, offsetTop });
        } else {
            // vue2 scroll down optimize
            virtualScroll.value.endIndex = endIndex;
            vue2ScrollYTimeout = window.setTimeout(() => {
                Object.assign(virtualScroll.value, { startIndex, offsetTop });
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
            Object.assign(virtualScrollX.value, { startIndex, endIndex, offsetLeft, scrollLeft: sLeft });
        } else {
            // vue2 向右滚动优化
            Object.assign(virtualScrollX.value, { endIndex, scrollLeft: sLeft });
            vue2ScrollXTimeout = window.setTimeout(() => {
                Object.assign(virtualScrollX.value, { startIndex, offsetLeft });
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
        clearColWidthCache,
        updateVirtualXColMerge,
        virtualX_tableHeaders,
        expandRowColspan,
        theadVirtualX,
        virtualX_columnPart,
    ] as const;
}
