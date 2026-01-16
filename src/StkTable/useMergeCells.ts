import { Ref, ref, ShallowRef, watch } from 'vue';
import { ColKeyGen, MergeCellsParam, PrivateStkTableColumn, RowActiveOption, RowKeyGen, UniqKey } from './types';
import { pureCellKeyGen } from './utils';
type Options = {
    rowActiveProp: Ref<RowActiveOption<any>>;
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>;
    rowKeyGen: RowKeyGen;
    colKeyGen: ColKeyGen;
    virtual_dataSourcePart: ShallowRef<any[]>;
};
export function useMergeCells({ rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart }: Options) {
    /**
     * which cell need be hidden
     * - key: rowKey
     * - value: colKey Set
     */
    const hiddenCellMap = ref<Record<UniqKey, Set<UniqKey>>>({});
    /**
     * hover other row and rowspan cell should be highlighted
     * - key: rowKey
     * - value: cellKey Set
     */
    const hoverRowMap = ref<Record<UniqKey, Set<string>>>({});

    /** hover current row , which rowspan cells should be highlight */
    const hoverMergedCells = ref(new Set<string>());
    /** click current row , which rowspan cells should be highlight */
    const activeMergedCells = ref(new Set<string>());

    watch([virtual_dataSourcePart, tableHeaderLast], () => {
        hiddenCellMap.value = {};
        hoverRowMap.value = {};
    });

    /**
     * abstract the logic of hiding cells
     */
    function hideCells(rowKey: UniqKey, colKey: UniqKey, colspan: number, isSelfRow = false, mergeCellKey: string) {
        const startIndex = tableHeaderLast.value.findIndex(item => colKeyGen.value(item) === colKey);

        for (let i = startIndex; i < startIndex + colspan; i++) {
            // if other row hovered, the rowspan cell need to be highlight
            if (!hoverRowMap.value[rowKey]) hoverRowMap.value[rowKey] = new Set();
            hoverRowMap.value[rowKey].add(mergeCellKey);
            if (isSelfRow && i === startIndex) {
                // self row start cell does not need to be hidden
                continue;
            }
            const nextCol = tableHeaderLast.value[i];
            if (!nextCol) break;
            const nextColKey = colKeyGen.value(nextCol);
            if (!hiddenCellMap.value[rowKey]) hiddenCellMap.value[rowKey] = new Set();
            hiddenCellMap.value[rowKey].add(nextColKey);
        }
    }

    /**
     * calculate colspan and rowspan
     * @param row
     * @param col
     * @param rowIndex
     * @param colIndex
     * @returns
     */
    function mergeCellsWrapper(
        row: MergeCellsParam<any>['row'],
        col: MergeCellsParam<any>['col'],
        rowIndex: MergeCellsParam<any>['rowIndex'],
        colIndex: MergeCellsParam<any>['colIndex'],
    ): { colspan?: number; rowspan?: number } | undefined {
        if (!col.mergeCells) return;

        let { colspan, rowspan } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};

        // default colspan and rowspan is 1
        colspan = colspan || 1;
        rowspan = rowspan || 1;

        if (colspan === 1 && rowspan === 1) return;

        const rowKey = rowKeyGen(row);

        const curRowIndex = virtual_dataSourcePart.value.findIndex(item => rowKeyGen(item) === rowKey);
        if (curRowIndex === -1) return;

        const colKey = colKeyGen.value(col);
        const mergedCellKey = pureCellKeyGen(rowKey, colKey);

        for (let i = curRowIndex; i < curRowIndex + rowspan; i++) {
            const row = virtual_dataSourcePart.value[i];
            if (!row) break;
            hideCells(rowKeyGen(row), colKey, colspan, i === curRowIndex, mergedCellKey);
        }

        return { colspan, rowspan };
    }

    const emptySet = new Set<string>();
    function updateHoverMergedCells(rowKey: UniqKey | undefined) {
        hoverMergedCells.value = rowKey === void 0 ? emptySet : hoverRowMap.value[rowKey] || emptySet;
    }

    function updateActiveMergedCells(clear?: boolean, rowKey?: UniqKey) {
        if (!rowActiveProp.value.enabled) return;
        if (clear) {
            activeMergedCells.value = new Set();
            return;
        }
        activeMergedCells.value = (rowKey !== void 0 && hoverRowMap.value[rowKey]) || new Set(hoverMergedCells.value);
    }

    return {
        hiddenCellMap,
        mergeCellsWrapper,
        hoverMergedCells,
        updateHoverMergedCells,
        activeMergedCells,
        updateActiveMergedCells,
    };
}
