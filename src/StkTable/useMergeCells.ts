import { ref, ShallowRef, watch } from 'vue';
import { MergeCellsParam, ColKeyGen, PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';

export function useMergeCells({
    tableHeaderLast,
    rowKeyGen,
    colKeyGen,
    virtual_dataSourcePart,
}: {
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>;
    rowKeyGen: RowKeyGen;
    colKeyGen: ColKeyGen;
    virtual_dataSourcePart: ShallowRef<any[]>;
}) {
    /**
     * which cell need be hidden
     * - key: rowKey
     * - value: colKey Set
     */
    const hiddenCellMap = ref<Record<UniqKey, Set<UniqKey>>>({});

    watch([virtual_dataSourcePart, tableHeaderLast], () => {
        hiddenCellMap.value = {};
    });

    /** 抽象隐藏单元格的逻辑 */
    function hideCells(rowKey: UniqKey, startIndex: number, count: number) {
        for (let i = startIndex; i < startIndex + count; i++) {
            const nextCol = tableHeaderLast.value[i];
            if (!nextCol) break;
            const nextColKey = colKeyGen.value(nextCol);
            if (!hiddenCellMap.value[rowKey]) hiddenCellMap.value[rowKey] = new Set();
            hiddenCellMap.value[rowKey].add(nextColKey);
        }
    }

    function mergeCellsWrapper(
        row: MergeCellsParam<any>['row'],
        col: MergeCellsParam<any>['col'],
        rowIndex: MergeCellsParam<any>['rowIndex'],
        colIndex: MergeCellsParam<any>['colIndex'],
    ): { colspan?: number; rowspan?: number } | undefined {
        if (!col.mergeCells) return;

        let { colspan, rowspan } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};
        colspan = colspan || 1;
        rowspan = rowspan || 1;

        if (colspan === 1 && rowspan === 1) return;

        const rowKey = rowKeyGen(row);
        const colKey = colKeyGen.value(col);
        const dataSourceSlice = virtual_dataSourcePart.value.slice();
        const curColIndex = tableHeaderLast.value.findIndex(item => colKeyGen.value(item) === colKey);
        const curRowIndex = dataSourceSlice.findIndex(item => rowKeyGen(item) === rowKey);

        if (curRowIndex === -1) return;

        for (let i = curRowIndex; i < curRowIndex + rowspan; i++) {
            const row = dataSourceSlice[i];
            if (!row) break;
            const rKey = rowKeyGen(row);
            let startIndex = curColIndex;
            let count = colspan;
            if (i === curRowIndex) {
                startIndex += 1;
                count -= 1;
            }
            hideCells(rKey, startIndex, count);
        }
        return {
            colspan,
            rowspan,
        };
    }

    return { hiddenCellMap, mergeCellsWrapper };
}
