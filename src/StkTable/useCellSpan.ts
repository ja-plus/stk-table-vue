import { ref, ShallowRef } from 'vue';
import { CellSpanParam, ColKeyGen, PrivateStkTableColumn, UniqKey } from './types';

export function useCellSpan({ tableHeaderLast, colKeyGen }: { tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>; colKeyGen: ColKeyGen }) {
    /** which cell need be hidden */
    const hiddenCellMap = ref<Record<UniqKey, Set<UniqKey>>>({});

    function cellSpanWrapper(
        row: CellSpanParam<any>['row'],
        col: CellSpanParam<any>['col'],
        rowIndex: CellSpanParam<any>['rowIndex'],
        colIndex: CellSpanParam<any>['colIndex'],
    ) {
        if (!col.cellSpan) return;
        const { colspan, rowspan } = col.cellSpan({ row, col, rowIndex, colIndex });
        if (colspan) {
            const colKey = colKeyGen.value(col);
            const curColIndex = tableHeaderLast.value.findIndex(item => colKeyGen.value(item) === colKey);
            // curColIndex 后面的单元格都隐藏
            for (let i = curColIndex + 1; i < curColIndex + colspan; i++) {
                const nextCol = tableHeaderLast.value[i];
                if (!nextCol) break;
                const nextColKey = colKeyGen.value(nextCol);
                if (!hiddenCellMap.value[colKey]) hiddenCellMap.value[colKey] = new Set();
                hiddenCellMap.value[colKey].add(nextColKey);
            }
        }
        return {
            colspan,
            rowspan,
        };
    }

    return { hiddenCellMap, cellSpanWrapper };
}
