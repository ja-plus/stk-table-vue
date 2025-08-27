import { ShallowRef } from 'vue';
import { ColKeyGen, MergeCellsParam, PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';

type Options = {
    props: any;
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>;
    rowKeyGen: RowKeyGen;
    colKeyGen: ColKeyGen;
    virtual_dataSourcePart: ShallowRef<any[]>;
};
export declare function useMergeCells({ props, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart, }: Options): {
    hiddenCellMap: import('vue').Ref<Record<UniqKey, Set<UniqKey>>, Record<UniqKey, Set<UniqKey>>>;
    mergeCellsWrapper: (row: MergeCellsParam<any>["row"], col: MergeCellsParam<any>["col"], rowIndex: MergeCellsParam<any>["rowIndex"], colIndex: MergeCellsParam<any>["colIndex"]) => {
        colspan?: number;
        rowspan?: number;
    } | undefined;
    hoverMergedCells: import('vue').Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
    updateHoverMergedCells: (rowKey: UniqKey | undefined) => void;
    activeMergedCells: import('vue').Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
    updateActiveMergedCells: (clear?: boolean) => void;
};
export {};
