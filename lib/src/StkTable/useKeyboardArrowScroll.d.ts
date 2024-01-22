import { Ref } from 'vue';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
type Options = {
    scrollTo: (x: number | null, y: number | null) => void;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
};
/**
 * 按下键盘箭头滚动。只有悬浮在表体上才能生效键盘。
 *
 * 在低版本浏览器中，虚拟滚动时，使用键盘滚动，等选中的行消失在视口外时，滚动会失效。
 */
export declare function useKeyboardArrowScroll(targetElement: Ref<HTMLElement | undefined>, { scrollTo, virtualScroll, virtualScrollX }: Options): void;
export {};
