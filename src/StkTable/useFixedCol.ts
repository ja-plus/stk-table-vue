import { computed, ComputedRef, Ref, ShallowRef, shallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
import { VirtualScrollXStore } from './useVirtualScroll';
import { getCalculatedColWidth } from './utils/constRefUtils';

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

    /**
     *
     * |            colspan3                |
     * | rowspan2 |       colspan2          |
     * | rowspan2 |  colspan1 | colspan1    |
     * ---
     * expect arr:
     * ```
     * const arr = [
     *  [col, null, null],
     *  [col2, col3, null],
     *  [col2, col4, col5],
     * ]
     * ```
     */
    const tableHeaderForCalc = computed(() => {
        const headers: (StkTableColumn<DT> | null)[][] = [];
        tableHeaders.value.forEach((cols, i) => {
            headers[i] = [];
        });
        for (let i = 0; i < tableHeaders.value.length; i++) {
            const cols = tableHeaders.value[i];
            let j = 0;
            let k = 0;
            let col;
            while ((col = cols[k])) {
                headers[i][j] = col;
                if (col.colSpan && col.colSpan > 1) {
                    const m = col.colSpan - 1;
                    for (let n = 0; n < m; n++) {
                        headers[i][j + n + 1] = null;
                    }
                    j += m;
                }
                if (col.rowSpan && col.rowSpan > 1) {
                    for (let n = 0; n < col.rowSpan; n++) {
                        headers[i + n][j] = null;
                    }
                }
                j++;
                k++;
            }
        }
        return headers;
    });

    /** 固定列的class */
    const fixedColClassMap = computed(() => {
        const colMap = new Map();
        console.log('tableHeaderForCalc', tableHeaderForCalc.value);
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

    /**
     * 返回所有父元素，包括自己
     * @param col
     * @param type 1-shadow（阴影） 2-active(被固定的列)
     *
     */
    function getColAndParentCols(col: StkTableColumn<DT> | null, type: 1 | 2 = 1) {
        if (!col) return [];
        const colsTemp: StkTableColumn<DT>[] = [];
        let node: any = { __PARENT__: col };
        while ((node = node.__PARENT__)) {
            if (type === 1 && node.fixed) {
                // shadow
                colsTemp.push(node);
            }
            if (type === 2) {
                // active
                colsTemp.push(node);
            }
        }
        return colsTemp;
    }

    /** 滚动条变化时，更新需要展示阴影的列 */
    function updateFixedShadow(virtualScrollX?: Ref<VirtualScrollXStore>) {
        const fixedColsTemp: StkTableColumn<DT>[] = [];
        const fixedShadowColsTemp: (StkTableColumn<DT> | null)[] = [];
        let clientWidth, /* scrollWidth, */ scrollLeft;

        if (virtualScrollX?.value) {
            const { containerWidth: cw, /* scrollWidth: sw, */ scrollLeft: sl } = virtualScrollX.value;
            clientWidth = cw;
            // scrollWidth = sw;
            scrollLeft = sl;
        } else {
            const { clientWidth: cw, /* scrollWidth: sw, */ scrollLeft: sl } = tableContainerRef.value as HTMLDivElement;
            clientWidth = cw;
            // scrollWidth = sw;
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
                fixedColsTemp.push(...getColAndParentCols(col, 2));
            }
            left += getCalculatedColWidth(col);
            if (!rightShadowCol && col.fixed === 'right' && scrollLeft + clientWidth - left < position) {
                rightShadowCol = col;
            }
            if (rightShadowCol && col.fixed === 'right') {
                fixedColsTemp.push(...getColAndParentCols(col, 2));
            }
        });

        if (props.fixedColShadow) {
            fixedShadowColsTemp.push(...getColAndParentCols(leftShadowCol), ...getColAndParentCols(rightShadowCol));
            fixedShadowCols.value = (fixedShadowColsTemp as (StkTableColumn<DT> | null)[]).filter(Boolean) as StkTableColumn<DT>[];
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
