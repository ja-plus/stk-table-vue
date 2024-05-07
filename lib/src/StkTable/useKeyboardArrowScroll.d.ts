import { ComputedRef, Ref, ShallowRef } from 'vue';
import { StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

type Options<DT extends Record<string, any>> = {
    props: any;
    scrollTo: (y: number | null, x: number | null) => void;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
    tableHeaders: ShallowRef<StkTableColumn<DT>[][]>;
    virtual_on: ComputedRef<boolean>;
};
/**
 * 按下键盘箭头滚动。只有悬浮在表体上才能生效键盘。
 *
 * 在低版本浏览器中，虚拟滚动时，使用键盘滚动，等选中的行消失在视口外时，滚动会失效。
 */
export declare function useKeyboardArrowScroll<DT extends Record<string, any>>(targetElement: Ref<HTMLElement | undefined>, { props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on }: Options<DT>): void;
export {};
