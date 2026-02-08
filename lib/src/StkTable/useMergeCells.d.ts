import { Ref, ShallowRef } from 'vue';
import { ColKeyGen, MergeCellsParam, PrivateStkTableColumn, RowActiveOption, RowKeyGen, UniqKey } from './types';

type Options = {
    rowActiveProp: Ref<RowActiveOption<any>>;
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>;
    rowKeyGen: RowKeyGen;
    colKeyGen: ColKeyGen;
    virtual_dataSourcePart: ShallowRef<any[]>;
};
export declare function useMergeCells({ rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart }: Options): {
    hiddenCellMap: Ref<Record<UniqKey, Set<UniqKey>> | null, Record<UniqKey, Set<UniqKey>> | null>;
    mergeCellsWrapper: (row: MergeCellsParam<any>["row"], col: MergeCellsParam<any>["col"], rowIndex: MergeCellsParam<any>["rowIndex"], colIndex: MergeCellsParam<any>["colIndex"]) => {
        colspan?: number;
        rowspan?: number;
    } | undefined;
    hoverMergedCells: Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
    updateHoverMergedCells: (rowKey: UniqKey | undefined) => void;
    activeMergedCells: Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
    updateActiveMergedCells: (clear?: boolean, rowKey?: UniqKey) => void;
};
export {};
