import { Ref, ShallowRef } from 'vue';
import { StkTableColumn } from './types';
type Option = {
    tableContainer: Ref<HTMLElement | undefined>;
    props: any;
    dataSourceCopy: ShallowRef<any[]>;
    tableHeaderLast: Ref<StkTableColumn<any>[]>;
};
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
    initVirtualScrollY: (height?: number) => void;
    initVirtualScrollX: () => void;
    updateVirtualScrollY: (sTop?: number) => void;
    updateVirtualScrollX: (sLeft?: number) => void;
};
export {};
