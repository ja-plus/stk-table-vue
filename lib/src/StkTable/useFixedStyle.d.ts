import { CSSProperties, Ref } from 'vue';
import { StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
type Options = {
    props: any;
    tableHeaderLast: Ref<StkTableColumn<any>[]>;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
    virtualX_on: Ref<boolean>;
    virtualX_offsetRight: Ref<number>;
};
/**
 * 固定列style
 * @param param0
 * @returns
 */
export declare function useFixedStyle({ props, tableHeaderLast, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight }: Options): {
    getFixedStyle: (tagType: 1 | 2, col: StkTableColumn<any>, depth?: number) => CSSProperties;
};
export {};
