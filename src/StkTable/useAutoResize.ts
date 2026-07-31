import { Ref, onBeforeUnmount, onMounted, watch } from 'vue';

/**
 * 窗口变化自动重置虚拟滚动
 * @param tableContainerRef
 * @param onResize 容器尺寸变化后的重算逻辑（虚拟滚动、固定列等）
 * @param props
 * @param debounceMs
 */
export function useAutoResize(tableContainerRef: Ref<HTMLElement | undefined>, onResize: () => void, props: any, debounceMs: number) {
    let resizeObserver: ResizeObserver | null = null;
    let isObserved = false;
    watch(
        () => props.virtual,
        v => {
            if (v) initResizeObserver();
            else removeResizeObserver();
        },
    );
    watch(
        () => props.virtualX,
        v => {
            if (v) initResizeObserver();
            else removeResizeObserver();
        },
    );

    onMounted(() => {
        if (props.virtual || props.virtualX) {
            initResizeObserver();
        }
    });

    onBeforeUnmount(() => {
        removeResizeObserver();
    });

    function initResizeObserver() {
        if (isObserved) {
            removeResizeObserver();
        }
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
        isObserved = true;
    }

    function removeResizeObserver() {
        if (!isObserved) return;
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        } else {
            window.removeEventListener('resize', resizeCallback);
        }
        isObserved = false;
    }

    let debounceTime = 0;
    function resizeCallback() {
        if (debounceTime) {
            window.clearTimeout(debounceTime);
        }
        debounceTime = window.setTimeout(() => {
            if (props.autoResize) {
                onResize();
                if (typeof props.autoResize === 'function') {
                    props.autoResize();
                }
            }
            debounceTime = 0;
        }, debounceMs);
    }
}
