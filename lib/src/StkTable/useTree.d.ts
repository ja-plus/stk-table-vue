import { ShallowRef } from 'vue';
import { PrivateRowDT, RowKeyGen, UniqKey } from './types';

type DT = PrivateRowDT & {
    children?: DT[];
};
export declare function useTree(props: any, dataSourceCopy: ShallowRef<DT[]>, rowKeyGen: RowKeyGen, emits: any, onDataSourceChange: () => void): readonly [(row: DT, col: any) => void, (row: (UniqKey | DT) | (UniqKey | DT)[], option?: {
    expand?: boolean;
}) => void, (data: DT[]) => DT[]];
export {};
