import { CSSProperties, Ref, ShallowRef } from 'vue';
import { StkTableColumn, TagType } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
type Options<T extends Record<string, any>> = {
    props: any;
    tableHeaders: ShallowRef<StkTableColumn<T>[][]>;
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
export declare function useFixedStyle<DT extends Record<string, any>>({ props, tableHeaders, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight, }: Options<DT>): {
    getFixedStyle: (tagType: TagType, col: StkTableColumn<DT>, depth?: number) => CSSProperties | null;
};
export {};
