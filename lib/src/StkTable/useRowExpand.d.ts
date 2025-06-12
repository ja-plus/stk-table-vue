import { ShallowRef } from 'vue';
import { PrivateRowDT, StkTableColumn, UniqKey } from './types';

type DT = PrivateRowDT;
type Option<DT extends Record<string, any>> = {
    rowKeyGen: (row: any) => UniqKey;
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
