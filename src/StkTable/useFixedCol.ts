import { computed, ComputedRef, Ref, ShallowRef, shallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
import { VirtualScrollXStore } from './useVirtualScroll';
import { getCalculatedColWidth } from './utils';

type Params<T extends Record<string, any>> = {
    props: any;
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
    getFixedColPosition: ComputedRef<(col: StkTableColumn<T>) => number>;
    tableHeaders: ShallowRef<StkTableColumn<T>[][]>;
    tableHeaderLast: ShallowRef<StkTableColumn<T>[]>;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
};

/**
 * 固定列处理
 * @returns
 */
export function useFixedCol<DT extends Record<string, any>>({
    props,
    colKeyGen,
    getFixedColPosition,
    tableHeaders,
    tableHeaderLast,
    tableContainerRef,
}: Params<DT>) {
    /** 保存需要出现阴影的列 */
    const fixedShadowCols = shallowRef<StkTableColumn<DT>[]>([]);

    /** 正在被固定的列 */
    const fixedCols = shallowRef<StkTableColumn<DT>[]>([]);

    /** 固定列的class */
    const fixedColClassMap = computed(() => {
        const colMap = new Map();
        const fixedShadowColsValue = fixedShadowCols.value;
        tableHeaders.value.forEach(cols => {
            cols.forEach(col => {
                const showShadow = props.fixedColShadow && col.fixed && fixedShadowColsValue.includes(col);
                const classObj = {
                    'fixed-cell': col.fixed,
                    ['fixed-cell--' + col.fixed]: col.fixed,
                    'fixed-cell--shadow': showShadow,
                    ['fixed-cell--active']: fixedCols.value.includes(col), // 表示该列正在被固定
                };
                colMap.set(colKeyGen.value(col), classObj);
            });
        });
        return colMap;
    });

    /** 处理固定列父元素阴影 */
    function parentShadow(col: StkTableColumn<DT> | null) {
        if (!props.fixedColShadow) return [];
        if (!col) return [];
        const fixedShadowColsTemp = [];
        let node: any = { __PARENT__: col };
        while ((node = node.__PARENT__)) {
            if (node.fixed) {
                fixedShadowColsTemp.push(node);
            }
        }
        return fixedShadowColsTemp as StkTableColumn<DT>[];
    }

    /** 滚动条变化时，更新需要展示阴影的列 */
    function updateFixedShadow(virtualScrollX?: Ref<VirtualScrollXStore>) {
        if (!props.fixedColShadow) return;
        const fixedColsTemp: StkTableColumn<DT>[] = [];
        const fixedShadowColsTemp: (StkTableColumn<DT> | null)[] = [];
        let clientWidth, scrollWidth, scrollLeft;
        if (virtualScrollX?.value) {
            const { containerWidth: cw, scrollWidth: sw, scrollLeft: sl } = virtualScrollX.value;
            clientWidth = cw;
            scrollWidth = sw;
            scrollLeft = sl;
        } else {
            const { clientWidth: cw, scrollWidth: sw, scrollLeft: sl } = tableContainerRef.value as HTMLDivElement;
            clientWidth = cw;
            scrollWidth = sw;
            scrollLeft = sl;
        }

        /*******
         * 根据横向滚动位置，计算出哪个列需要展示阴影
         *****/
        /** 左侧需要展示阴影的列 */
        let leftShadowCol: StkTableColumn<DT> | null = null;
        /** 右侧展示阴影的列 */
        let rightShadowCol: StkTableColumn<DT> | null = null;
        let left = 0;
        /**
         * 左侧第n个fixed:left 计算要加上前面所有left 的列宽。
         */
        tableHeaderLast.value.forEach(col => {
            const position = getFixedColPosition.value(col);
            if (col.fixed === 'left' && position + scrollLeft > left) {
                leftShadowCol = col;
                fixedColsTemp.push(col);
            }
            left += getCalculatedColWidth(col);
            if (!rightShadowCol && col.fixed === 'right' && scrollLeft + clientWidth - left < position) {
                rightShadowCol = col;
            }
            if (rightShadowCol && col.fixed === 'right') {
                fixedColsTemp.push(col);
            }
        });
        fixedShadowColsTemp.push(leftShadowCol, rightShadowCol, ...parentShadow(leftShadowCol), ...parentShadow(rightShadowCol));

        fixedShadowCols.value = (fixedShadowColsTemp as (StkTableColumn<DT> | null)[]).filter(Boolean) as StkTableColumn<DT>[];
        fixedCols.value = fixedColsTemp;
    }

    return {
        /** 固定列class */
        fixedColClassMap,
        /** 滚动条变化时，更新需要展示阴影的列 */
        updateFixedShadow,
    };
}
