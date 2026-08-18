import { ComputedRef, Ref, ShallowRef } from 'vue';
import { MergeCellsCache } from './mergeCellsCache';
import { ColKeyGen, MergeCellsParam, PrivateRowDT, PrivateStkTableColumn, RowActiveOption, RowKeyGen, UniqKey } from './types';
import { VirtualScrollStore } from './useVirtualScroll';

/** Above-viewport cell descriptor: real column or placeholder colspan */
type AboveViewportCell = PrivateStkTableColumn<PrivateRowDT> | {
    __VT_PH__: number;
};
export declare function useMergeCells(rowActiveProp: Ref<RowActiveOption<any>>, tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>, rowKeyGen: RowKeyGen, colKeyGen: ColKeyGen, virtual_dataSourcePart: ShallowRef<any[]>, virtualScroll: Ref<VirtualScrollStore>, 
/** 视口行渲染使用的列列表（virtual-x 时为可视列子集，否则即 tableHeaderLast） */
virtualX_columnPart: ComputedRef<PrivateStkTableColumn<PrivateRowDT>[]>, 
/** 全量数据（仅用于缓存失效判定） */
dataSourceCopy: ShallowRef<any[]>, 
/** mergeCells 结果共享缓存（与 useVirtualScroll 共用，可跨滚动帧复用） */
mergeCellsCache: MergeCellsCache, 
/** 是否允许把连续空行合并为占位 tr（virtual && !autoRowHeight） */
canMergeEmptyRows: Ref<boolean>, 
/** 视口下方合并为占位 tr 的行数（渲染 rowspan 属性修正用） */
belowViewportRowCount: Ref<number>): readonly [Ref<Record<UniqKey, Set<UniqKey>> | null, Record<UniqKey, Set<UniqKey>> | null>, (row: MergeCellsParam<any>["row"], col: MergeCellsParam<any>["col"], rowIndex: MergeCellsParam<any>["rowIndex"], colIndex: MergeCellsParam<any>["colIndex"]) => {
    colspan?: number;
    rowspan?: number;
} | undefined, Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>, (rowKey: UniqKey | undefined) => void, Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>, (clear?: boolean, rowKey?: UniqKey) => void, ComputedRef<Map<UniqKey, AboveViewportCell[]>>, ComputedRef<{
    start: number;
    count: number;
}[]>, ComputedRef<{
    count: number;
}[]>];
export {};
