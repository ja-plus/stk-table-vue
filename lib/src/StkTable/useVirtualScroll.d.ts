import { Ref, ShallowRef } from 'vue';
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
 * virtual scroll
 * @returns
 */
export declare function useVirtualScroll<DT extends Record<string, any>>(props: any, tableContainerRef: Ref<HTMLElement | undefined>, trRef: Ref<HTMLTableRowElement[] | undefined>, dataSourceCopy: ShallowRef<PrivateRowDT[]>, tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>, tableHeaders: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>, rowKeyGen: RowKeyGen, maxRowSpan: Map<UniqKey, number>, scrollbarOptions: Ref<Required<ScrollbarOptions>>, isExperimentalScrollY: Ref<boolean | undefined>): readonly [Ref<{
    containerHeight: number;
    pageSize: number;
    startIndex: number;
    endIndex: number;
    rowHeight: number;
    offsetTop: number;
    scrollTop: number;
    scrollHeight: number;
    translateY: number;
}, VirtualScrollStore | {
    containerHeight: number;
    pageSize: number;
    startIndex: number;
    endIndex: number;
    rowHeight: number;
    offsetTop: number;
    scrollTop: number;
    scrollHeight: number;
    translateY: number;
}>, Ref<{
    containerWidth: number;
    scrollWidth: number;
    startIndex: number;
    endIndex: number;
    offsetLeft: number;
    scrollLeft: number;
}, VirtualScrollXStore | {
    containerWidth: number;
    scrollWidth: number;
    startIndex: number;
    endIndex: number;
    offsetLeft: number;
    scrollLeft: number;
}>, import('vue').ComputedRef<any>, import('vue').ComputedRef<PrivateRowDT[]>, import('vue').ComputedRef<number>, import('vue').ComputedRef<any>, import('vue').ComputedRef<PrivateStkTableColumn<PrivateRowDT>[]>, import('vue').ComputedRef<number>, import('vue').ComputedRef<number>, (height?: number) => void, (height?: number) => void, () => void, (sTop?: number) => void, (sLeft?: number) => void, (rowKey: UniqKey, height?: number | null) => void, () => void];
