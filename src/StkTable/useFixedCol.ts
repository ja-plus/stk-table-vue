import { computed, ComputedRef, Ref, ShallowRef, shallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
import { VirtualScrollXStore } from './useVirtualScroll';
import { getCalculatedColWidth } from './utils/constRefUtils';

/**
 * 固定列处理
 * @returns
 */
export function useFixedCol<DT extends Record<string, any>>(
    props: any,
    colKeyGen: ComputedRef<(col: StkTableColumn<DT>) => UniqKey>,
    getFixedColPosition: ComputedRef<(col: StkTableColumn<DT>) => number>,
    tableHeaders: ShallowRef<StkTableColumn<DT>[][]>,
    tableHeadersForCalc: ShallowRef<StkTableColumn<DT>[][]>,
    tableContainerRef: Ref<HTMLDivElement | undefined>,
) {
    /** 保存需要出现阴影的列 */
    const fixedShadowCols = shallowRef<StkTableColumn<DT>[]>([]);

    /** 正在被固定的列 */
    const fixedCols = shallowRef<StkTableColumn<DT>[]>([]);

    /**
     * 需要自行绘制左边框的右固定列。
     * 单元格的左边框由左侧相邻单元格的 border-right 提供，右固定列吸附遮挡内容后两者不再相邻，因此需要自行绘制。
     */
    const fixedBorderLeftCols = shallowRef<StkTableColumn<DT>[]>([]);

    /** 固定列的class */
    const fixedColClassMap = computed(() => {
        const colMap = new Map();
        const fixedShadowColsValue = fixedShadowCols.value;
        const fixedColsValue = fixedCols.value;
        const fixedBorderLeftColsValue = fixedBorderLeftCols.value;
        const colKeyFn = colKeyGen.value;
        const fixedColShadow = props.fixedColShadow;
        const headers = tableHeaders.value;

        for (let i = 0, len = headers.length; i < len; i++) {
            const cols = headers[i];
            for (let j = 0, colLen = cols.length; j < colLen; j++) {
                const col = cols[j];
                const fixed = col.fixed;
                const showShadow = fixed && fixedColShadow && fixedShadowColsValue.includes(col);
                const classList = [];

                if (fixedColsValue.includes(col)) {
                    // 表示该列正在被固定
                    classList.push('fixed-cell--active');
                }
                if (fixed) {
                    classList.push('fixed-cell');
                    classList.push('fixed-cell--' + fixed);
                }
                if (showShadow) {
                    classList.push('fixed-cell--shadow');
                }
                if (fixed === 'right' && fixedBorderLeftColsValue.includes(col)) {
                    classList.push('fixed-cell--border-left');
                }
                colMap.set(colKeyFn(col), classList);
            }
        }
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
        const len = tableHeadersForCalc.value.length;
        for (let level = 0; level < len; level++) {
            const row = tableHeadersForCalc.value[level];
            /**
             * 最右侧连续 fixed:right 列的起始下标。
             * 这些列的固定偏移只由其右侧固定列宽度决定，不依赖中间列的声明宽度，
             * 且 sticky/relative 在无横向溢出时偏移为0无副作用，因此无需判断滚动位置，始终固定。
             */
            let rightSuffixStart = row.length;
            while (rightSuffixStart > 0 && row[rightSuffixStart - 1].fixed === 'right') {
                rightSuffixStart--;
            }
            /**
             * 左侧第n个fixed:left 计算要加上前面所有left 的列宽。
             */
            let left = 0;
            for (let i = 0, rowLen = row.length; i < rowLen; i++) {
                const col = row[i];
                const position = getFixedColPositionValue(col);
                const isFixedLeft = col.fixed === 'left';
                const isFixedRight = col.fixed === 'right';

                if (isFixedLeft && position + scrollLeft > left) {
                    fixedColsTemp.push(col);
                    leftShadowCol[level] = col;
                }

                left += getCalculatedColWidth(col);

                if (isFixedRight) {
                    /** 是否需要固定。依赖列声明宽度累加，声明宽度与实际渲染宽度不一致时会失真 */
                    const needFix = scrollLeft + clientWidth - left < position;
                    if (i >= rightSuffixStart || needFix) {
                        fixedColsTemp.push(col);
                    }
                    // 右固定列阴影，只要第一列。阴影仍按滚动位置判断，避免未遮挡时也显示阴影
                    if (needFix && !rightShadowCol[level]) {
                        rightShadowCol[level] = col;
                    }
                }
            }
        }

        if (props.fixedColShadow) {
            fixedShadowCols.value = leftShadowCol.concat(rightShadowCol).filter(Boolean) as StkTableColumn<DT>[];
        }

        // rightShadowCol 是每层最靠左的、已遮挡内容的右固定列，正是需要绘制左边框的列
        fixedBorderLeftCols.value = rightShadowCol.filter(Boolean) as StkTableColumn<DT>[];

        fixedCols.value = fixedColsTemp;
    }

    return [fixedCols, fixedColClassMap, updateFixedShadow] as const;
}
