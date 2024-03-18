import { Ref, onBeforeUnmount, onMounted, watch } from 'vue';

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
export function useAutoResize({ tableContainerRef, initVirtualScroll, props, debounceMs }: Options) {
    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
        initResizeObserver();
    });

    onBeforeUnmount(() => {
        removeResizeObserver();
    });

    function initResizeObserver() {
        if (window.ResizeObserver) {
            if (!tableContainerRef.value) {
                const watchDom = watch(
                    () => tableContainerRef,
                    () => {
                        initResizeObserver();
                        watchDom();
                    },
                );
                return;
            }
            resizeObserver = new ResizeObserver(resizeCallback);
            resizeObserver.observe(tableContainerRef.value);
        } else {
            window.addEventListener('resize', resizeCallback);
        }
    }

    function removeResizeObserver() {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        } else {
            window.removeEventListener('resize', resizeCallback);
        }
    }

    let debounceTime = 0;
    function resizeCallback() {
        if (debounceTime) {
            window.clearTimeout(debounceTime);
        }
        debounceTime = window.setTimeout(() => {
            if (props.autoResize) {
                initVirtualScroll();
                if (typeof props.autoResize === 'function') {
                    props.autoResize();
                }
            }
            debounceTime = 0;
        }, debounceMs);
    }
}
