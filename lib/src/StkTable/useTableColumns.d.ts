import { Ref } from 'vue';
import { PrivateRowDT, PrivateStkTableColumn, StkTableColumn } from './types';

type Params = {
    virtualX: boolean;
    isRelativeMode: Ref<boolean>;
};
/**
 * Table Columns Processing Hook
 * Handles multi-level header processing and column flattening
 */
export declare function useTableColumns<DT extends Record<string, any>>({ virtualX, isRelativeMode }: Params): {
    tableHeaders: import('vue').ShallowRef<PrivateStkTableColumn<PrivateRowDT>[][], PrivateStkTableColumn<PrivateRowDT>[][]>;
    tableHeadersForCalc: import('vue').ShallowRef<PrivateStkTableColumn<PrivateRowDT>[][], PrivateStkTableColumn<PrivateRowDT>[][]>;
    dealColumns: (columns: StkTableColumn<DT>[]) => void;
};
export {};
