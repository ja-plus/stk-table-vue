import { CSSProperties, Ref } from 'vue';
import { StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
type Options = {
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
export declare function useFixedStyle({ tableHeaderLast, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight }: Options): {
    getFixedStyle: (tagType: 1 | 2, col: StkTableColumn<any>) => CSSProperties;
};
export {};
