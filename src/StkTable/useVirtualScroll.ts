import { Ref, ShallowRef, computed, ref } from 'vue';
import { Default_Col_Width, Default_Table_Height, Default_Table_Width } from './const';
import { StkTableColumn } from './types';

type Option<DT extends Record<string, any>> = {
    tableContainer: Ref<HTMLElement | undefined>;
    props: any;
    dataSourceCopy: ShallowRef<DT[]>;
    tableHeaderLast: Ref<StkTableColumn<DT>[]>;
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
    /** 容器宽度 */
    containerWidth: number;
    /** 开始位置 */
    startIndex: number;
    /** 结束始位置 */
    endIndex: number;
    /** 表格定位左边距 */
    offsetLeft: number;
    /** 横向滚动位置，用于判断是横向滚动还是纵向 */
    scrollLeft: number;
};

/**获取计算宽度 */
function getCalcWidth<DT extends Record<string, any>>(col: StkTableColumn<DT>) {
    return parseInt(col.minWidth || col.width || Default_Col_Width);
}

/**
 * 虚拟滚动
 * @param param0
 * @returns
 */
export function useVirtualScroll<DT extends Record<string, any>>({ tableContainer, props, dataSourceCopy, tableHeaderLast }: Option<DT>) {
    const virtualScroll = ref<VirtualScrollStore>({
        containerHeight: 0,
        pageSize: 10,
        startIndex: 0,
        endIndex: 0,
        rowHeight: 28,
        offsetTop: 0,
        scrollTop: 0,
    });

    const virtualScrollX = ref<VirtualScrollXStore>({
        containerWidth: 0,
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
        return dataSourceCopy.value.slice(startIndex, endIndex);
    });

    const virtual_offsetBottom = computed(() => {
        if (!virtual_on.value) return 0;
        const { startIndex, rowHeight } = virtualScroll.value;
        return (dataSourceCopy.value.length - startIndex - virtual_dataSourcePart.value.length) * rowHeight;
    });

    const virtualX_on = computed(() => {
        return (
            props.virtualX && tableHeaderLast.value.reduce((sum, col) => (sum += getCalcWidth(col)), 0) > virtualScrollX.value.containerWidth * 1.5
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
            width += getCalcWidth(col);
        }
        return width;
    });

    /**
     * 初始化Y虚拟滚动参数
     * @param {number} [height] 虚拟滚动的高度
     */
    function initVirtualScrollY(height?: number) {
        if (!virtual_on.value) return;
        const { offsetHeight, scrollTop } = tableContainer.value || {};
        const { rowHeight } = virtualScroll.value;
        let containerHeight: number;
        // FIXME: 可能多次获取offsetHeight 会导致浏览器频繁重排
        if (typeof height === 'number') {
            containerHeight = height;
        } else {
            containerHeight = offsetHeight || Default_Table_Height;
        }
        Object.assign(virtualScroll.value, {
            containerHeight,
            pageSize: Math.ceil(containerHeight / rowHeight) + 1, // 这里最终+1，因为headless=true无头时，需要上下各预渲染一行。
        });
        updateVirtualScrollY(scrollTop);
    }

    function initVirtualScrollX() {
        if (!props.virtualX) return;
        const { offsetWidth, scrollLeft } = tableContainer.value || {};
        // scrollTo(null, 0);
        virtualScrollX.value.containerWidth = offsetWidth || Default_Table_Width;
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

    /** 通过滚动条位置，计算虚拟滚动的参数 */
    function updateVirtualScrollY(sTop = 0) {
        const { rowHeight, pageSize } = virtualScroll.value;
        const startIndex = Math.floor(sTop / rowHeight);
        let endIndex = startIndex + pageSize;
        if (endIndex > dataSourceCopy.value.length) {
            endIndex = dataSourceCopy.value.length; // 溢出index修正
        }
        Object.assign(virtualScroll.value, {
            startIndex,
            offsetTop: startIndex * rowHeight, // startIndex之前的高度
            endIndex,
        });
    }

    /** 通过横向滚动条位置，计算横向虚拟滚动的参数 */
    function updateVirtualScrollX(sLeft = 0) {
        const headerLength = tableHeaderLast.value?.length;
        if (!headerLength) return;
        let startIndex = 0;
        let offsetLeft = 0;

        let colWidthSum = 0;
        for (let colIndex = 0; colIndex < headerLength; colIndex++) {
            startIndex++;
            const col = tableHeaderLast.value[colIndex];
            // fixed left 不进入计算列宽
            if (col.fixed === 'left') continue;
            const colWidth = getCalcWidth(col);
            colWidthSum += colWidth;
            // 列宽（非固定列）加到超过scrollLeft的时候，表示startIndex从上一个开始下标
            if (colWidthSum >= sLeft) {
                offsetLeft = colWidthSum - colWidth;
                startIndex--;
                break;
            }
        }
        // -----
        colWidthSum = 0;
        let endIndex = headerLength;
        for (let colIndex = startIndex; colIndex < headerLength; colIndex++) {
            const col = tableHeaderLast.value[colIndex];
            colWidthSum += getCalcWidth(col);
            // 列宽大于容器宽度则停止
            if (colWidthSum >= virtualScrollX.value.containerWidth) {
                endIndex = colIndex + 2; // TODO:预渲染的列数
                break;
            }
        }
        if (endIndex > headerLength) {
            endIndex = headerLength;
        }
        Object.assign(virtualScrollX.value, { startIndex, endIndex, offsetLeft });
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
