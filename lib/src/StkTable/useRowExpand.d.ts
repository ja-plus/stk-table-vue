import { ShallowRef } from 'vue';
import { PrivateRowDT, RowKeyGen, StkTableColumn } from './types';

type DT = PrivateRowDT;
export declare function useRowExpand(emits: any, dataSourceCopy: ShallowRef<DT[]>, rowKeyGen: RowKeyGen, onDataSourceChange: () => void): readonly [(row: DT, col: StkTableColumn<DT>) => void, (rowKeyOrRow: string | undefined | DT, expand?: boolean | null, data?: {
    col?: StkTableColumn<DT>;
    silent?: boolean;
}) => void];
export {};
