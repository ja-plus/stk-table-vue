import { ShallowRef } from 'vue';
import { PrivateRowDT, UniqKey } from './types';

type DT = PrivateRowDT & {
    children?: DT[];
};
type Option<DT extends Record<string, any>> = {
    props: any;
    rowKeyGen: (row: any) => UniqKey;
    dataSourceCopy: ShallowRef<DT[]>;
    emits: any;
};
export declare function useTree({ props, dataSourceCopy, rowKeyGen, emits }: Option<DT>): {
    toggleTreeNode: (row: DT, col: any) => void;
    setTreeExpand: (row: (UniqKey | DT) | (UniqKey | DT)[], option?: {
        expand?: boolean;
    }) => void;
    flatTreeData: (data: DT[]) => DT[];
};
export {};
