import { Ref, shallowRef } from 'vue';
import { PrivateRowDT, PrivateStkTableColumn, StkTableColumn } from './types';
import { getColWidth } from './utils/constRefUtils';
import { howDeepTheHeader } from './utils/index';

type Params = {
    virtualX: boolean;
    isRelativeMode: Ref<boolean>;
};

/**
 * Table Columns Processing Hook
 * Handles multi-level header processing and column flattening
 */
export function useTableColumns<DT extends Record<string, any>>({ virtualX, isRelativeMode }: Params) {
    /**
     * 表头.内容是 props.columns 的引用集合
     * @eg
     * ```js
     * [
     *      [{dataIndex:'id',...}], // 第0行列配置
     *      [], // 第一行列配置
     *      //...
     * ]
     * ```
     */
    const tableHeaders = shallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>([]);

    /**
     * 用于计算多级表头的tableHeaders。模拟rowSpan 位置的辅助数组。用于计算固定列。
     */
    const tableHeadersForCalc = shallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>([]);

    /**
     * 处理多级表头
     * @param columns 原始列配置
     */
    function dealColumns(columns: StkTableColumn<DT>[]) {
        // reset
        const tableHeadersTemp: PrivateStkTableColumn<PrivateRowDT>[][] = [];
        const tableHeadersForCalcTemp: PrivateStkTableColumn<PrivateRowDT>[][] = [];
        let copyColumn: StkTableColumn<DT>[] = columns; // do not deep clone

        // relative 模式下不支持sticky列。因此就放在左右两侧。
        if (isRelativeMode.value) {
            const leftCol: StkTableColumn<DT>[] = [];
            const centerCol: StkTableColumn<DT>[] = [];
            const rightCol: StkTableColumn<DT>[] = [];

            for (let i = 0, len = copyColumn.length; i < len; i++) {
                const col = copyColumn[i];
                if (col.fixed === 'left') {
                    leftCol.push(col);
                } else if (col.fixed === 'right') {
                    rightCol.push(col);
                } else {
                    centerCol.push(col);
                }
            }
            copyColumn = leftCol.concat(centerCol).concat(rightCol);
        }

        const maxDeep = howDeepTheHeader(copyColumn);

        if (maxDeep > 0 && virtualX) {
            console.error('StkTableVue:多级表头不支持横向虚拟滚动!');
        }

        for (let i = 0; i <= maxDeep; i++) {
            tableHeadersTemp[i] = [];
            tableHeadersForCalcTemp[i] = [];
        }

        /**
         * flat columns
         * @param arr
         * @param depth 深度
         * @param parent 父节点引用，用于构建双向链表。
         */
        function flat(arr: PrivateStkTableColumn<PrivateRowDT>[], parent: PrivateStkTableColumn<PrivateRowDT> | null, depth = 0): [number, number] {
            /** 所有子节点数量 */
            let allChildrenLen = 0;
            let allChildrenWidthSum = 0;

            for (let i = 0, len = arr.length; i < len; i++) {
                const col = arr[i];
                col.__PARENT__ = parent;

                /** 一列中的子节点数量 */
                let colChildrenLen = 1;
                /** 多级表头的父节点宽度，通过叶子节点宽度计算得到 */
                let colWidth = 0;

                if (col.children) {
                    // DFS
                    const [len, widthSum] = flat(col.children, col, depth + 1);
                    colChildrenLen = len;
                    colWidth = widthSum;
                    tableHeadersForCalcTemp[depth].push(col);
                } else {
                    colWidth = getColWidth(col);
                    for (let j = depth; j <= maxDeep; j++) {
                        // 如有rowSpan 向下复制一个表头col，用于计算固定列
                        tableHeadersForCalcTemp[j].push(col);
                    }
                }

                // 回溯
                col.__WIDTH__ = colWidth; //记录计算的列宽
                tableHeadersTemp[depth].push(col);
                const rowSpan = col.children ? 1 : maxDeep - depth + 1;
                const colSpan = colChildrenLen;

                if (rowSpan > 1) {
                    col.__R_SP__ = rowSpan;
                }
                if (colSpan > 1) {
                    col.__C_SP__ = colSpan;
                }

                allChildrenLen += colChildrenLen;
                allChildrenWidthSum += colWidth;
            }
            return [allChildrenLen, allChildrenWidthSum];
        }

        flat(copyColumn as PrivateStkTableColumn<PrivateRowDT>[], null);
        tableHeaders.value = tableHeadersTemp;
        tableHeadersForCalc.value = tableHeadersForCalcTemp;
    }

    return {
        tableHeaders,
        tableHeadersForCalc,
        dealColumns,
    };
}
