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
    /** 行高 */
    rowHeight: number;
    /** 表格定位上边距 */
    offsetTop: number;
    /** 纵向滚动条位置，用于判断是横向滚动还是纵向 */
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
    /** 横向滚动位置，用于判断是横向滚动还是纵向 */
    scrollLeft: number;
};
/**
 * 行高 Fenwick 树（树状数组）：Float64Array 存储，维护各行高度的累计和。
 * 用于变高（autoRowHeight / 展开列）模式下以 O(log n) 定位视口行范围与推导总高度，
 * 替代原先每滚动帧 O(n) 的逐行累加。
 * 支持：O(n) 建树、O(log n) 单点增量更新、O(log n) 前缀和查询、O(log n) 累计和下界查找（树上二分）。
 */
export declare class RowHeightFenwickTree {
    /** 内部 1-based 索引，bit[0] 不使用 */
    private bit;
    readonly size: number;
    /** 全部行高之和，更新时增量维护 */
    total: number;
    constructor(size: number);
    /** O(n) 顺序建树：heights[i] 为第 i 行（0-based）高度 */
    build(heights: ArrayLike<number>): void;
    /** 单点增量更新：第 index 行（0-based）高度变化 delta，O(log n) */
    add(index: number, delta: number): void;
    /** 前 count 行的累计高度（前缀和），O(log n)；count 越界时钳制到 [0, size] */
    query(count: number): number;
    /**
     * 累计和下界查找（树上二分，O(log n)）：
     * 返回首个「累计高度（含本行）≥ target」的行索引（0-based）；
     * 总高不足 target 时返回 size（不存在满足条件的行）。
     */
    findFirstPrefixGE(target: number): number;
}
/**
 * virtual scroll
 * @returns
 */
export declare function useVirtualScroll(props: any, tableContainerRef: Ref<HTMLElement | undefined>, trRef: Ref<HTMLTableRowElement[] | undefined>, dataSourceCopy: ShallowRef<PrivateRowDT[]>, tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>, tableHeaders: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>, rowKeyGen: RowKeyGen, maxRowSpan: Map<UniqKey, number>, 
/** 全局最大 rowspan（限定跨界修正扫描范围用） */
getMaxRowSpanValue: () => number, scrollbarOptions: Ref<Required<ScrollbarOptions>>, isExperimentalScrollY: Ref<boolean | undefined>, 
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
