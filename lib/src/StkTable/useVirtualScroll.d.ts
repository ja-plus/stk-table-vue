import { Ref, ShallowRef } from 'vue';
import { StkTableColumn } from './types';
type Option = {
    tableContainer: Ref<HTMLElement | undefined>;
    props: any;
    dataSourceCopy: ShallowRef<any[]>;
    tableHeaderLast: Ref<StkTableColumn<any>[]>;
};
/** 暂存纵向虚拟滚动的数据 */
export type VirtualScrollStore = {
    /** 容器高度 */
    containerHeight: number;
    /** 数组开始位置 */
    startIndex: number;
    /** 行高 */
    rowHeight: number;
    /** 表格定位上边距 */
    offsetTop: number;
    /** 纵向滚动条位置，用于判断是横向滚动还是纵向 */
    scrollTop: number;
};
/** 暂存横向虚拟滚动的数据 */
export type VirtualScrollXStore = {
    /** 容器宽度 */
    containerWidth: number;
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
 * 虚拟滚动
 * @param param0
 * @returns
 */
export declare function useVirtualScroll({ tableContainer, props, dataSourceCopy, tableHeaderLast }: Option): {
    virtualScroll: Ref<{
        containerHeight: number;
        startIndex: number;
        rowHeight: number;
        offsetTop: number;
        scrollTop: number;
    }>;
    virtualScrollX: Ref<{
        containerWidth: number;
        startIndex: number;
        endIndex: number;
        offsetLeft: number;
        scrollLeft: number;
    }>;
    virtual_on: import("vue").ComputedRef<any>;
    virtual_dataSourcePart: import("vue").ComputedRef<any[]>;
    virtual_offsetBottom: import("vue").ComputedRef<number>;
    virtualX_on: import("vue").ComputedRef<any>;
    virtualX_columnPart: import("vue").ComputedRef<StkTableColumn<any>[]>;
    virtualX_offsetRight: import("vue").ComputedRef<number>;
    initVirtualScroll: (height?: number) => void;
    initVirtualScrollY: (height?: number) => void;
    initVirtualScrollX: () => void;
    updateVirtualScrollY: (sTop?: number) => void;
    updateVirtualScrollX: (sLeft?: number) => void;
};
export {};
