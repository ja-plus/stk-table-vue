import { Ref, ShallowRef, computed, ref } from 'vue';
import { DEFAULT_TABLE_HEIGHT, DEFAULT_TABLE_WIDTH } from './const';
import { StkTableColumn } from './types';
import { getCalculatedColWidth } from './utils';

type Option<DT extends Record<string, any>> = {
    props: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
    dataSourceCopy: ShallowRef<DT[]>;
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>;
    tableHeaders: ShallowRef<StkTableColumn<DT>[][]>;
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
 * 虚拟滚动
 * @param param0
 * @returns
 */
export function useVirtualScroll<DT extends Record<string, any>>({
    props,
    tableContainerRef,
    dataSourceCopy,
    tableHeaderLast,
    tableHeaders,
}: Option<DT>) {
    const virtualScroll = ref<VirtualScrollStore>({
        containerHeight: 0,
        rowHeight: props.rowHeight,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
        offsetTop: 0,
        scrollTop: 0,
    });

    const virtualScrollX = ref<VirtualScrollXStore>({
        containerWidth: 0,
        scrollWidth: 0,
        startIndex: 0,
        endIndex: 0,
        offsetLeft: 0,
        scrollLeft: 0,
    });

    /** 是否虚拟滚动标志 */
    const virtual_on = computed(() => {
        return props.virtual && dataSourceCopy.value.length > virtualScroll.value.pageSize * 2;
    });

    const virtual_dataSourcePart = computed(() => {
        if (!virtual_on.value) return dataSourceCopy.value;
        const { startIndex, endIndex } = virtualScroll.value;
        return dataSourceCopy.value.slice(startIndex, endIndex + 1);
    });

    const virtual_offsetBottom = computed(() => {
        if (!virtual_on.value) return 0;
        const { startIndex, rowHeight } = virtualScroll.value;
        return (dataSourceCopy.value.length - startIndex - virtual_dataSourcePart.value.length) * rowHeight;
    });

    const virtualX_on = computed(() => {
        return (
            props.virtualX &&
            tableHeaderLast.value.reduce((sum, col) => (sum += getCalculatedColWidth(col)), 0) > virtualScrollX.value.containerWidth + 100
        );
    });

    const virtualX_columnPart = computed(() => {
        if (virtualX_on.value) {
            // 虚拟横向滚动，固定列要一直保持存在
            const leftCols = [];
            const rightCols = [];
            const { startIndex, endIndex } = virtualScrollX.value;
            // 左侧固定列，如果在左边不可见区。则需要拿出来放在前面
            for (let i = 0; i < startIndex; i++) {
                const col = tableHeaderLast.value[i];
                if (col.fixed === 'left') leftCols.push(col);
            }
            // 右侧固定列，如果在右边不可见区。则需要拿出来放在后面
            for (let i = endIndex; i < tableHeaderLast.value.length; i++) {
                const col = tableHeaderLast.value[i];
                if (col.fixed === 'right') rightCols.push(col);
            }

            const mainColumns = tableHeaderLast.value.slice(startIndex, endIndex);

            return leftCols.concat(mainColumns).concat(rightCols);
        }
        return tableHeaderLast.value;
    });

    const virtualX_offsetRight = computed(() => {
        if (!virtualX_on.value) return 0;
        let width = 0;
        for (let i = virtualScrollX.value.endIndex; i < tableHeaderLast.value.length; i++) {
            const col = tableHeaderLast.value[i];
            if (col.fixed !== 'right') {
                width += getCalculatedColWidth(col);
            }
        }
        return width;
    });

    /**
     * 初始化Y虚拟滚动参数
     * @param {number} [height] 虚拟滚动的高度
     */
    function initVirtualScrollY(height?: number) {
        if (typeof height !== 'number') {
            console.warn('initVirtualScrollY: height must be a number');
            height = 0;
        }
        if (!virtual_on.value) return;
        const { offsetHeight, scrollTop } = tableContainerRef.value || {};
        const { rowHeight } = virtualScroll.value;
        const containerHeight = height || offsetHeight || DEFAULT_TABLE_HEIGHT;
        const { headless, headerRowHeight } = props;
        let pageSize = Math.ceil(containerHeight / rowHeight);
        if (!headless) {
            /** 表头高度占几行表体高度数 */
            const headerToBodyRowHeightCount = Math.floor((tableHeaders.value.length * (headerRowHeight || rowHeight)) / rowHeight);
            pageSize -= headerToBodyRowHeightCount; //减去表头行数
        }
        Object.assign(virtualScroll.value, { containerHeight, pageSize });
        updateVirtualScrollY(scrollTop);
    }

    function initVirtualScrollX() {
        const { clientWidth, scrollLeft, scrollWidth } = tableContainerRef.value || {};
        virtualScrollX.value.containerWidth = clientWidth || DEFAULT_TABLE_WIDTH;
        virtualScrollX.value.scrollWidth = scrollWidth || DEFAULT_TABLE_WIDTH;
        updateVirtualScrollX(scrollLeft);
    }
    /**
     * 初始化虚拟滚动参数
     * @param {number} [height] 虚拟滚动的高度
     */
    function initVirtualScroll(height?: number) {
        initVirtualScrollY(height);
        initVirtualScrollX();
    }

    let vue2ScrollYTimeout: null | number = null;

    /** 通过滚动条位置，计算虚拟滚动的参数 */
    function updateVirtualScrollY(sTop = 0) {
        const { rowHeight, pageSize, scrollTop, startIndex: oldStartIndex } = virtualScroll.value;
        // 先更新滚动条位置记录，其他地方可能有依赖。(stripe 时ArrowUp/Down滚动依赖)
        virtualScroll.value.scrollTop = sTop;

        // 非虚拟滚动不往下执行
        if (!virtual_on.value) return;

        let startIndex = Math.floor(sTop / rowHeight);
        if (startIndex < 0) {
            startIndex = 0;
        }
        if (props.stripe && startIndex !== 0) {
            const scrollRows = Math.abs(oldStartIndex - startIndex);
            // 斑马纹情况下，每滚动偶数行才加载。防止斑马纹错位。
            if (scrollRows % 2) {
                startIndex -= 1; // 奇数-1变成偶数
            }
        }
        let endIndex = startIndex + pageSize;
        if (props.stripe) {
            endIndex += 1; // 斑马纹下多渲染一些
        }
        const offsetTop = startIndex * rowHeight; // startIndex之前的高度
        endIndex = Math.min(endIndex, dataSourceCopy.value.length); // 溢出index修正
        if (vue2ScrollYTimeout) {
            window.clearTimeout(vue2ScrollYTimeout);
        }
        /**
         * 一次滚动大于一页时表示滚动过快，回退优化
         */
        if (!props.optimizeVue2Scroll || sTop <= scrollTop || Math.abs(oldStartIndex - startIndex) >= pageSize) {
            // 向上滚动
            Object.assign(virtualScroll.value, {
                startIndex,
                endIndex,
                offsetTop,
            });
        } else {
            // vue2向下滚动优化
            virtualScroll.value.endIndex = endIndex;
            vue2ScrollYTimeout = window.setTimeout(() => {
                Object.assign(virtualScroll.value, { startIndex, offsetTop });
            }, VUE2_SCROLL_TIMEOUT_MS);
        }
    }

    let vue2ScrollXTimeout: null | number = null;

    /** 通过横向滚动条位置，计算横向虚拟滚动的参数 */
    function updateVirtualScrollX(sLeft = 0) {
        if (!props.virtualX) return;
        const headerLength = tableHeaderLast.value?.length;
        if (!headerLength) return;

        const { scrollLeft } = virtualScrollX.value;
        let startIndex = 0;
        let offsetLeft = 0;
        /** 列宽累加 */
        let colWidthSum = 0;
        /** 固定左侧列宽 */
        let leftColWidthSum = 0;
        /** 横向滚动时，第一列的剩余宽度 */
        let leftFirstColRestWidth = 0;

        for (let colIndex = 0; colIndex < headerLength; colIndex++) {
            const col = tableHeaderLast.value[colIndex];
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
        const containerWidth = virtualScrollX.value.containerWidth - leftColWidthSum;
        let endIndex = headerLength;
        for (let colIndex = startIndex + 1; colIndex < headerLength; colIndex++) {
            const col = tableHeaderLast.value[colIndex];
            colWidthSum += getCalculatedColWidth(col);
            // 列宽大于容器宽度则停止
            if (colWidthSum >= containerWidth) {
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
        initVirtualScroll,
        initVirtualScrollY,
        initVirtualScrollX,
        updateVirtualScrollY,
        updateVirtualScrollX,
    };
}
