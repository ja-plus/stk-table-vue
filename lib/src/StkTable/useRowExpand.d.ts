import { ShallowRef } from 'vue';
import { PrivateRowDT, RowKeyGen, StkTableColumn } from './types';

type DT = PrivateRowDT;
type Option<DT extends Record<string, any>> = {
    rowKeyGen: RowKeyGen;
    dataSourceCopy: ShallowRef<DT[]>;
    emits: any;
};
export declare function useRowExpand({ dataSourceCopy, rowKeyGen, emits }: Option<DT>): {
    toggleExpandRow: (row: DT, col: StkTableColumn<DT>) => void;
    setRowExpand: (rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: {
        col?: StkTableColumn<DT>;
        silent?: boolean;
    }) => void;
};
export {};
