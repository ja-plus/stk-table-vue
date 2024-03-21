import { Ref } from 'vue';
type Options = {
    props: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
    initVirtualScroll: () => void;
    /** 防抖延时 */
    debounceMs: number;
};
/**
 * 窗口变化自动重置虚拟滚动
 * @param param0
 */
export declare function useAutoResize({ tableContainerRef, initVirtualScroll, props, debounceMs }: Options): void;
export {};
