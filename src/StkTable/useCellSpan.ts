import { ref, ShallowRef } from 'vue';
import { CellSpanParam, ColKeyGen, PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';

export function useCellSpan({
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

    function cellSpanWrapper(
        row: CellSpanParam<any>['row'],
        col: CellSpanParam<any>['col'],
        rowIndex: CellSpanParam<any>['rowIndex'],
        colIndex: CellSpanParam<any>['colIndex'],
    ) {
        if (!col.cellSpan) return;
        const { colspan, rowspan } = col.cellSpan({ row, col, rowIndex, colIndex });
        const rowKey = rowKeyGen(row);
        let curColIndex = 0;
        if (colspan) {
            const colKey = colKeyGen.value(col);
            curColIndex = tableHeaderLast.value.findIndex(item => colKeyGen.value(item) === colKey);
            // curColIndex 后面的单元格都隐藏
            for (let i = curColIndex + 1; i < curColIndex + colspan; i++) {
                const nextCol = tableHeaderLast.value[i];
                if (!nextCol) break;
                const nextColKey = colKeyGen.value(nextCol);
                if (!hiddenCellMap.value[rowKey]) hiddenCellMap.value[rowKey] = new Set();
                hiddenCellMap.value[rowKey].add(nextColKey);
            }
        }
        if (rowspan) {
            const dataSourceSlice = virtual_dataSourcePart.value.slice();
            const curRowIndex = dataSourceSlice.findIndex(item => item[colKeyGen.value(col)] === row[colKeyGen.value(col)]);
            if (curRowIndex === -1)
                return {
                    colspan,
                    rowspan,
                };
            for (let i = curRowIndex + 1; i < curRowIndex + rowspan; i++) {
                const nextRow = dataSourceSlice[i];
                if (!nextRow) break;
                const nextRowKey = rowKeyGen(nextRow);
                const nextColKey = colKeyGen.value(col);
                if (!hiddenCellMap.value[nextRowKey]) hiddenCellMap.value[nextRowKey] = new Set();
                hiddenCellMap.value[nextRowKey].add(nextColKey);
                if (colspan) {
                    for (let j = curColIndex + 1; j < curColIndex + colspan; j++) {
                        const nextCol = tableHeaderLast.value[j];
                        if (!nextCol) break;
                        const nextColKey = colKeyGen.value(nextCol);
                        hiddenCellMap.value[nextRowKey].add(nextColKey);
                    }
                }
            }
        }
        return {
            colspan,
            rowspan,
        };
    }

    return { hiddenCellMap, cellSpanWrapper };
}
