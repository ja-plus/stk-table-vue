type Options = {
    initVirtualScroll: () => void;
    props: any;
    /** 防抖延时 */
    debounceMs: number;
};
/**
 * 窗口变化自动重置虚拟滚动
 * @param param0
 */
export declare function useAutoResize({ initVirtualScroll, props, debounceMs }: Options): void;
export {};
