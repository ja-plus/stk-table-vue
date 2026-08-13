import { Ref, ShallowRef } from 'vue';
import { ColKeyGen, MergeCellsParam, PrivateRowDT, PrivateStkTableColumn, RowActiveOption, RowKeyGen, UniqKey } from './types';
import { VirtualScrollStore } from './useVirtualScroll';

/** Above-viewport cell descriptor: real column or placeholder colspan */
type AboveViewportCell = PrivateStkTableColumn<PrivateRowDT> | {
    __VT_PH__: number;
};
export declare function useMergeCells(rowActiveProp: Ref<RowActiveOption<any>>, tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>, rowKeyGen: RowKeyGen, colKeyGen: ColKeyGen, virtual_dataSourcePart: ShallowRef<any[]>, virtualScroll: Ref<VirtualScrollStore>): readonly [Ref<Record<UniqKey, Set<UniqKey>> | null, Record<UniqKey, Set<UniqKey>> | null>, (row: MergeCellsParam<any>["row"], col: MergeCellsParam<any>["col"], rowIndex: MergeCellsParam<any>["rowIndex"], colIndex: MergeCellsParam<any>["colIndex"]) => {
    colspan?: number;
    rowspan?: number;
} | undefined, Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>, (rowKey: UniqKey | undefined) => void, Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>, (clear?: boolean, rowKey?: UniqKey) => void, import('vue').ComputedRef<Map<UniqKey, AboveViewportCell[]>>];
export {};
