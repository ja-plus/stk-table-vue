import { ref, ShallowRef, watch } from 'vue';
import { ColKeyGen, MergeCellsParam, PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';
import { pureCellKeyGen } from './utils';

export function useMergeCells({
    props,
    tableHeaderLast,
    rowKeyGen,
    colKeyGen,
    virtual_dataSourcePart,
}: {
    props: any;
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

    /** 抽象隐藏单元格的逻辑 */
    function hideCells(rowKey: UniqKey, startIndex: number, count: number, isSelfRow = false, mergeCellKey: string) {
        for (let i = startIndex; i < startIndex + count; i++) {
            const nextCol = tableHeaderLast.value[i];
            if (!nextCol) break;
            const nextColKey = colKeyGen.value(nextCol);
            if (!hiddenCellMap.value[rowKey]) hiddenCellMap.value[rowKey] = new Set();
            hiddenCellMap.value[rowKey].add(nextColKey);
            if (isSelfRow) continue;
            // if other row hovered, the rowspan cell need to be highlight
            if (!hoverRowMap.value[rowKey]) hoverRowMap.value[rowKey] = new Set();
            hoverRowMap.value[rowKey].add(mergeCellKey);
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
        const colKey = colKeyGen.value(col);
        const dataSourceSlice = virtual_dataSourcePart.value.slice();
        const curColIndex = tableHeaderLast.value.findIndex(item => colKeyGen.value(item) === colKey);
        const curRowIndex = dataSourceSlice.findIndex(item => rowKeyGen(item) === rowKey);
        const mergedCellKey = pureCellKeyGen(rowKey, colKey);

        if (curRowIndex === -1) return;

        for (let i = curRowIndex; i < curRowIndex + rowspan; i++) {
            const row = dataSourceSlice[i];
            if (!row) break;
            const rKey = rowKeyGen(row);
            let startIndex = curColIndex;
            let count = colspan;
            const isSelfRow = i === curRowIndex;
            if (isSelfRow) {
                startIndex += 1;
                count -= 1;
            }
            hideCells(rKey, startIndex, count, isSelfRow, mergedCellKey);
        }

        return { colspan, rowspan };
    }

    function updateHoverMergedCells(rowKey: UniqKey | undefined) {
        const set = rowKey === void 0 ? null : hoverRowMap.value[rowKey];
        hoverMergedCells.value = set || new Set();
    }

    function updateActiveMergedCells(clear?: boolean) {
        if (!props.rowActive) return;
        if (clear) {
            activeMergedCells.value.clear();
        } else {
            activeMergedCells.value = new Set(hoverMergedCells.value);
        }
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
