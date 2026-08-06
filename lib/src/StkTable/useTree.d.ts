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
    /**
     * 将传入 row 视为目标子节点，展开/收起其所有父节点；展开时若目标行自身有子节点则一并展开
     * en: Treat the given row as a target child, expand/collapse all its ancestors. The target row itself is also expanded when expanding if it has children
     * @version 1.1.0
     */
    parents?: boolean;
};
export declare function useTree(props: any, dataSourceCopy: ShallowRef<DT[]>, rowKeyGen: RowKeyGen, emits: any, onDataSourceChange: () => void): readonly [(row: DT, col: any) => void, (row: (UniqKey | DT) | (UniqKey | DT)[], option?: SetTreeExpandOption) => void, (data: DT[]) => DT[]];
export {};
