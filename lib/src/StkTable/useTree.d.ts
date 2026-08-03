import { ShallowRef } from 'vue';
import { PrivateRowDT, RowKeyGen, UniqKey } from './types';

type DT = PrivateRowDT & {
    children?: DT[];
};
type SetTreeExpandOption = {
    /**
     * 是否展开
     * en: Whether to expand
     * @default false
     */
    expand?: boolean;
    /**
     * 是否展开所有子节点
     * en: Whether to expand all child nodes
     * @default false
     * @version 1.0.4
     */
    all?: boolean;
    /**
     * 展开到第几层
     * en: Expand to the nth level
     * @version 1.0.4
     */
    level?: number;
};
export declare function useTree(props: any, dataSourceCopy: ShallowRef<DT[]>, rowKeyGen: RowKeyGen, emits: any, onDataSourceChange: () => void): readonly [(row: DT, col: any) => void, (row: (UniqKey | DT) | (UniqKey | DT)[], option?: SetTreeExpandOption) => void, (data: DT[]) => DT[]];
export {};
