import { Ref, ShallowRef } from 'vue';
import { MergeCellsCache } from './mergeCellsCache';
import { PrivateRowDT, PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';
import { ScrollbarOptions } from './useScrollbar';

/** 暂存纵向虚拟滚动的数据 */
export type VirtualScrollStore = {
    /** 容器高度 */
    containerHeight: number;
    /** 一页的大小 */
    pageSize: number;
    /** 数组开始位置 */
    startIndex: number;
    /** 数组结束位置 */
    endIndex: number;
    /**
     * 基准行高（px）。
     * 由 initVirtualScrollY 随 props.rowHeight 同步（模板中的 --row-height 亦取此值，二者同源），
     * 因此行高配置动态变化后此处不会是旧快照。
     * 仅记录统一基准行高：变高模式（autoRowHeight）与展开行的行级高度不写入此字段。
     */
    rowHeight: number;
    /** 表格定位上边距 */
    offsetTop: number;
    /**
     * 纵向滚动条位置，用于判断是横向滚动还是纵向。
     * 静默字段：非 relative 模式下写入不触发 triggerRef（滚动窗口未变的帧零重渲染），
     * 不得在响应式上下文（computed/模板/watch）中依赖此字段。
     */
    scrollTop: number;
    /** 总滚动高度 */
    scrollHeight: number;
    translateY: number;
    /** 视口实际起始行索引（rowspan 修正前的原始值，用于区分 above-viewport 行） */
    viewportStartIndex: number;
    /** 视口实际结束行索引（rowspan 修正前的原始值，用于区分 below-viewport 行） */
    viewportEndIndex: number;
};
/** 暂存横向虚拟滚动的数据 */
export type VirtualScrollXStore = {
    /** 父容器宽度 */
    containerWidth: number;
    /** 滚动容器的宽度 */
    scrollWidth: number;
    /** 开始位置 */
    startIndex: number;
    /** 结束始位置 */
    endIndex: number;
    /** 表格定位左边距 */
    offsetLeft: number;
    /**
     * 横向滚动位置，用于判断是横向滚动还是纵向。
     * 静默字段：非 relative 模式下写入不触发 triggerRef，不得在响应式上下文中依赖此字段。
     */
    scrollLeft: number;
};
/**
 * virtual scroll
 * @returns
 */
export declare function useVirtualScroll(props: any, tableContainerRef: Ref<HTMLElement | undefined>, trRef: Ref<HTMLTableRowElement[] | undefined>, dataSourceCopy: ShallowRef<PrivateRowDT[]>, tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>, tableHeaders: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>, rowKeyGen: RowKeyGen, maxRowSpan: Map<UniqKey, number>, 
/** 全局最大 rowspan（限定跨界修正扫描范围用） */
getMaxRowSpanValue: () => number, scrollbarOptions: Ref<Required<ScrollbarOptions>>, isExperimentalScrollY: Ref<boolean | undefined>, 
/** relative 固定模式的样式（useFixedStyle）以响应式方式依赖 scrollTop/scrollLeft，该模式下保留滚动位置的响应式触发 */
isRelativeMode: Ref<boolean>, 
/** mergeCells 结果共享缓存（与 useMergeCells 共用，避免重复调用用户回调） */
mergeCellsCache: MergeCellsCache): readonly [ShallowRef<VirtualScrollStore, VirtualScrollStore>, ShallowRef<VirtualScrollXStore, VirtualScrollXStore>, import('vue').ComputedRef<any>, import('vue').ComputedRef<PrivateRowDT[]>, import('vue').ComputedRef<number>, import('vue').ComputedRef<any>, import('vue').ComputedRef<number>, import('vue').ComputedRef<number>, (height?: number) => void, (height?: number) => void, () => void, (sTop?: number) => void, (sLeft?: number) => void, (rowKey: UniqKey, height?: number | null) => void, () => void, (count: number) => number, () => void, import('vue').ComputedRef<PrivateStkTableColumn<PrivateRowDT>[][]>, import('vue').ComputedRef<number>, import('vue').ComputedRef<{
    startIndex: number;
    endIndex: number;
    offsetLeft: number;
}>, import('vue').ComputedRef<PrivateStkTableColumn<PrivateRowDT>[]>, import('vue').ComputedRef<{
    prefix: PrivateStkTableColumn<PrivateRowDT>[];
    leftExpand: PrivateStkTableColumn<PrivateRowDT>[];
    viewport: PrivateStkTableColumn<PrivateRowDT>[];
    suffix: PrivateStkTableColumn<PrivateRowDT>[];
    /** leftExpand 起始的绝对叶子列索引（mergeCells 缓存键用） */
    leftExpandStart: number;
} | null>, () => {
    mapSize: number;
    mapKeys: string[];
    cacheSize: number;
    total: number;
}];
