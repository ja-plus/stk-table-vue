import { computed, ComputedRef, Ref, ShallowRef, shallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
import { VirtualScrollXStore } from './useVirtualScroll';
import { getCalculatedColWidth } from './utils/constRefUtils';

type Params<T extends Record<string, any>> = {
    props: any;
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
    getFixedColPosition: ComputedRef<(col: StkTableColumn<T>) => number>;
    tableHeaders: ShallowRef<StkTableColumn<T>[][]>;
    tableHeadersForCalc: ShallowRef<StkTableColumn<T>[][]>;
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
    tableHeadersForCalc,
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
        const fixedColsValue = fixedCols.value;
        const colKey = colKeyGen.value;
        const fixedColShadow = props.fixedColShadow;
        tableHeaders.value.forEach(cols => {
            cols.forEach(col => {
                const fixed = col.fixed;
                const showShadow = fixedColShadow && fixed && fixedShadowColsValue.includes(col);
                const classObj: Record<string, any> = {
                    'fixed-cell--active': fixedColsValue.includes(col), // 表示该列正在被固定
                };
                if (fixed) {
                    classObj['fixed-cell'] = true;
                    classObj['fixed-cell--' + fixed] = true;
                }
                if (showShadow) {
                    classObj['fixed-cell--shadow'] = true;
                }
                colMap.set(colKey(col), classObj);
            });
        });
        return colMap;
    });

    /**
     * 返回所有父元素，包括自己
     * @param col
     * @param type 1-shadow（阴影） 2-active(被固定的列)
     *
     */
    // function getColAndParentCols(col: StkTableColumn<DT> | null, type: 1 | 2 = 1) {
    //     if (!col) return [];
    //     const colsTemp: StkTableColumn<DT>[] = [];
    //     let node: any = { __PARENT__: col };
    //     while ((node = node.__PARENT__)) {
    //         if (type === 1 && node.fixed) {
    //             // shadow
    //             colsTemp.push(node);
    //         }
    //         if (type === 2) {
    //             // active
    //             colsTemp.push(node);
    //         }
    //     }
    //     return colsTemp;
    // }

    /** 滚动条变化时，更新需要展示阴影的列 */
    function updateFixedShadow(virtualScrollX?: Ref<VirtualScrollXStore>) {
        const fixedColsTemp: StkTableColumn<DT>[] = [];
        const getFixedColPositionValue = getFixedColPosition.value;
        let clientWidth, scrollLeft;

        if (virtualScrollX?.value) {
            const { containerWidth: cw, scrollLeft: sl } = virtualScrollX.value;
            clientWidth = cw;
            scrollLeft = sl;
        } else {
            const { clientWidth: cw, scrollLeft: sl } = tableContainerRef.value as HTMLDivElement;
            clientWidth = cw;
            scrollLeft = sl;
        }

        /*******
         * 根据横向滚动位置，计算出哪个列需要展示阴影
         *****/
        /** 左侧需要展示阴影的列 */
        const leftShadowCol: StkTableColumn<DT>[] = [];
        /** 右侧展示阴影的列 */
        const rightShadowCol: StkTableColumn<DT>[] = [];
        tableHeadersForCalc.value.forEach((row, level) => {
            /**
             * 左侧第n个fixed:left 计算要加上前面所有left 的列宽。
             */
            let left = 0;
            row.forEach(col => {
                const position = getFixedColPositionValue(col);
                const isFixedLeft = col.fixed === 'left';
                const isFixedRight = col.fixed === 'right';

                if (isFixedLeft && position + scrollLeft > left) {
                    fixedColsTemp.push(col);
                    leftShadowCol[level] = col;
                }

                left += getCalculatedColWidth(col);

                if (isFixedRight && scrollLeft + clientWidth - left < position) {
                    fixedColsTemp.push(col);
                    // 右固定列阴影，只要第一列
                    if (!rightShadowCol[level]) {
                        rightShadowCol[level] = col;
                    }
                }
            });
        });

        if (props.fixedColShadow) {
            fixedShadowCols.value = leftShadowCol.concat(rightShadowCol).filter(Boolean) as StkTableColumn<DT>[];
        }

        fixedCols.value = fixedColsTemp;
    }

    return {
        /** 正在被固定的列 */
        fixedCols,
        /** 固定列class */
        fixedColClassMap,
        /** 滚动条变化时，更新需要展示阴影的列 */
        updateFixedShadow,
    };
}
