import { onBeforeUnmount, onMounted } from 'vue';

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
export function useAutoResize({ initVirtualScroll, props, debounceMs }: Options) {
    onMounted(() => {
        window.addEventListener('resize', resizeCallback);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeCallback);
    });
    let debounceTime = 0;
    function resizeCallback() {
        if (debounceTime) {
            window.clearTimeout(debounceTime);
        }
        debounceTime = window.setTimeout(() => {
            // TODO: 使用ResizeObserver 监听。
            if (props.autoResize) {
                scrollTo();
                initVirtualScroll();
            }
            debounceTime = 0;
        }, debounceMs);
    }
}
