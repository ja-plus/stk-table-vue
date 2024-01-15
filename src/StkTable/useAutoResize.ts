import { Ref, onBeforeUnmount, onMounted, watch } from 'vue';

type Options = {
    tableContainer: Ref<HTMLElement | undefined>;
    initVirtualScroll: () => void;
    scrollTo: () => void;
    props: any;
    /** 防抖延时 */
    debounceMs: number;
};
/**
 * 窗口变化自动重置虚拟滚动
 * @param param0
 */
export function useAutoResize({ tableContainer, initVirtualScroll, scrollTo, props, debounceMs }: Options) {
    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
        initResizeObserver();
    });

    onBeforeUnmount(() => {
        removeResizeObserver();
    });

    function initResizeObserver() {
        if (window.ResizeObserver) {
            if (!tableContainer.value) {
                const watchDom = watch(
                    () => tableContainer,
                    () => {
                        initResizeObserver();
                        watchDom();
                    },
                );
                return;
            }
            resizeObserver = new ResizeObserver(resizeCallback);
            resizeObserver.observe(tableContainer.value);
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
                scrollTo();
                initVirtualScroll();
            }
            debounceTime = 0;
        }, debounceMs);
    }
}
