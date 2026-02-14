import { Ref, ShallowRef, computed, ref } from 'vue';
import { DEFAULT_ROW_HEIGHT, DEFAULT_TABLE_HEIGHT, DEFAULT_TABLE_WIDTH } from './const';
import { AutoRowHeightConfig, PrivateRowDT, PrivateStkTableColumn, RowKeyGen, StkTableColumn, UniqKey } from './types';
import { getCalculatedColWidth } from './utils/constRefUtils';
import { ScrollbarOptions } from './useScrollbar';

type Option<DT extends Record<string, any>> = {
    props: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
    trRef: Ref<HTMLTableRowElement[] | undefined>;
    dataSourceCopy: ShallowRef<PrivateRowDT[]>;
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>;
    tableHeaders: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>;
    rowKeyGen: RowKeyGen;
    maxRowSpan: Map<UniqKey, number>;
    scrollbarOptions: Ref<Required<ScrollbarOptions>>;
};

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

/** vue2 优化滚动回收延时 */
const VUE2_SCROLL_TIMEOUT_MS = 200;

/**
 * virtual scroll
 * @param param0
 * @returns
 */
export function useVirtualScroll<DT extends Record<string, any>>({
    props,
    tableContainerRef,
    trRef,
    dataSourceCopy,
    tableHeaderLast,
    tableHeaders,
    rowKeyGen,
    maxRowSpan,
    scrollbarOptions,
}: Option<DT>) {
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

    const virtualX_columnPart = computed(() => {
        const tableHeaderLastValue = tableHeaderLast.value;
        if (virtualX_on.value) {
            // 虚拟横向滚动，固定列要一直保持存在
            const leftCols: PrivateStkTableColumn<PrivateRowDT>[] = [];
            const rightCols: PrivateStkTableColumn<PrivateRowDT>[] = [];
            /**
             * 存在问题：
             * table columns 从多到少时。比方原来的start=5,end=10，现在start=4,end=8。这时候endIndex就超出数组范围了。
             * FIXME: 如果新列数 < endIndex，此时需要重新计算列startIndex和endIndex。
             */
            const { startIndex, endIndex } = virtualScrollX.value;

            // 左侧固定列，如果在左边不可见区。则需要拿出来放在前面
            for (let i = 0; i < startIndex; i++) {
                const col = tableHeaderLastValue[i];
                if (col?.fixed === 'left') leftCols.push(col);
            }
            // 右侧固定列，如果在右边不可见区。则需要拿出来放在后面
            for (let i = endIndex; i < tableHeaderLastValue.length; i++) {
                const col = tableHeaderLastValue[i];
                if (col?.fixed === 'right') rightCols.push(col);
            }

            const mainColumns = tableHeaderLastValue.slice(startIndex, endIndex);

            return leftCols.concat(mainColumns).concat(rightCols);
        }
        return tableHeaderLastValue;
    });

    const virtualX_offsetRight = computed(() => {
        if (!virtualX_on.value) return 0;
        let width = 0;
        const tableHeaderLastValue = tableHeaderLast.value;
        for (let i = virtualScrollX.value.endIndex; i < tableHeaderLastValue.length; i++) {
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
        let scrollTop = tableContainerRef.value?.scrollTop || 0;

        const rowHeight = getRowHeightFn.value();
        const containerHeight = height || clientHeight || DEFAULT_TABLE_HEIGHT;
        const { headless } = props;
        let pageSize = Math.ceil(containerHeight / rowHeight);
        if (!headless) {
            /** 表头高度占几行表体高度数 */
            const headerToBodyRowHeightCount = Math.floor(tableHeaderHeight.value / rowHeight);
            pageSize -= headerToBodyRowHeightCount; //减去表头行数
        }
        const maxScrollTop = dataSourceCopy.value.length * rowHeight + tableHeaderHeight.value - containerHeight;
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

    /** every row actual height */
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
            if (props.experimental?.scrollY) {
                let maxTop: number;
                sTop = sTop < 0 ? 0 : sTop < (maxTop = scrollHeight - containerHeight) ? sTop : maxTop;
                vsValue.translateY = props.scrollRowByRow ? 0 : -(sTop % rowHeight);
            }
        }
        vsValue.scrollTop = sTop;

        Object.assign(virtualScroll.value, vsValue);

        if (!virtual_on.value) {
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

        if (stripe && startIndex > 0 && startIndex % 2) {
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
            if (oldStartIndex === startIndex && oldEndIndex === endIndex) {
                // Not change: not update
                return;
            }
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
        let colWidthSum = 0;
        /** 固定左侧列宽 */
        let leftColWidthSum = 0;
        /** 横向滚动时，第一列的剩余宽度 */
        let leftFirstColRestWidth = 0;

        for (let colIndex = 0; colIndex < headerLength; colIndex++) {
            const col = tableHeaderLastValue[colIndex];
            const colWidth = getCalculatedColWidth(col);
            startIndex++;
            // fixed left 不进入计算列宽
            if (col.fixed === 'left') {
                leftColWidthSum += colWidth;
                continue;
            }
            colWidthSum += colWidth;
            // 列宽（非固定列）加到超过scrollLeft的时候，表示startIndex从上一个开始下标
            if (colWidthSum >= sLeft) {
                offsetLeft = colWidthSum - colWidth;
                startIndex--;
                leftFirstColRestWidth = colWidthSum - sLeft;
                break;
            }
        }
        // -----
        colWidthSum = leftFirstColRestWidth;
        const containerW = containerWidth - leftColWidthSum;
        let endIndex = headerLength;
        for (let colIndex = startIndex + 1; colIndex < headerLength; colIndex++) {
            const col = tableHeaderLastValue[colIndex];
            colWidthSum += getCalculatedColWidth(col);
            // 列宽大于容器宽度则停止
            if (colWidthSum >= containerW) {
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
            //vue2 向右滚动 优化
            Object.assign(virtualScrollX.value, { endIndex, scrollLeft: sLeft });
            vue2ScrollXTimeout = window.setTimeout(() => {
                Object.assign(virtualScrollX.value, { startIndex, offsetLeft });
            }, VUE2_SCROLL_TIMEOUT_MS);
        }
    }

    return {
        virtualScroll,
        virtualScrollX,
        virtual_on,
        virtual_dataSourcePart,
        virtual_offsetBottom,
        virtualX_on,
        virtualX_columnPart,
        virtualX_offsetRight,
        tableHeaderHeight,
        initVirtualScroll,
        initVirtualScrollY,
        initVirtualScrollX,
        updateVirtualScrollY,
        updateVirtualScrollX,
        setAutoHeight,
        clearAllAutoHeight,
    };
}
