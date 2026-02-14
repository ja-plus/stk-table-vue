import { Ref, ShallowRef } from 'vue';
import { AreaSelectionRange, CellKeyGen, ColKeyGen, RowKeyGen, StkTableColumn, UniqKey } from './types';

type Params<DT extends Record<string, any>> = {
    props: any;
    emits: any;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
    dataSourceCopy: ShallowRef<DT[]>;
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>;
    rowKeyGen: RowKeyGen;
    colKeyGen: ColKeyGen;
    cellKeyGen: CellKeyGen;
};
/**
 * 单元格拖拽选区
 */
export declare function useAreaSelection<DT extends Record<string, any>>({ props, emits, tableContainerRef, dataSourceCopy, tableHeaderLast, colKeyGen, cellKeyGen, }: Params<DT>): {
    selectionRange: Ref<AreaSelectionRange | null, AreaSelectionRange | null>;
    isSelecting: Ref<boolean, boolean>;
    selectedCellKeys: import('vue').ComputedRef<Set<string>>;
    normalizedRange: import('vue').ComputedRef<{
        minRow: number;
        maxRow: number;
        minCol: number;
        maxCol: number;
    } | null>;
    onSelectionMouseDown: (e: MouseEvent) => void;
    getAreaSelectionClasses: (cellKey: string, absoluteRowIndex: number, colKey: UniqKey) => string[];
    getSelectedArea: () => {
        rows: DT[];
        cols: StkTableColumn<DT>[];
        range: null;
    } | {
        rows: DT[];
        cols: StkTableColumn<DT>[];
        range: {
            startRowIndex: number;
            startColIndex: number;
            endRowIndex: number;
            endColIndex: number;
        };
    };
    clearSelectedArea: () => void;
    copySelectedArea: () => string;
};
export {};
