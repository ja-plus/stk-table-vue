import { nextTick, onMounted, onBeforeUnmount, ref, Ref } from 'vue';
import type { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
import { rafThrottle, throttle } from './utils/index';

/** Detect if the primary pointer is a touch device (mobile/tablet). */
function isTouchPrimaryDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

export type ScrollbarOptions = {
    enabled?: boolean;
    /** scroll-y width */
    width?: number;
    /** scroll-x height */
    height?: number;
    /** min scroll-y width */
    minWidth?: number;
    /** min scroll-x height */
    minHeight?: number;
};

/**
 * 自定义滚动条hooks
 * @param containerRef 滚动容器的ref
 * @param options 滚动条配置选项
 * @returns 滚动条相关状态和方法
 */
export function useScrollbar(
    props: any,
    containerRef: Ref<HTMLDivElement | undefined>,
    virtualScroll: Ref<VirtualScrollStore>,
    virtualScrollX: Ref<VirtualScrollXStore>,
    updateVirtualScrollY: (sTop?: number) => void,
    scrollbarOptions: Ref<Required<ScrollbarOptions>>,
    isExperimentalScrollY: Ref<boolean | undefined>,
) {
    const showScrollbar = ref({ x: false, y: false });
    const scrollbar = ref({ h: 0, w: 0, t: 0, l: 0 });

    let isDraggingVertical = false;
    let isDraggingHorizontal = false;
    let dragStartY = 0;
    let dragStartX = 0;
    let dragStartTop = 0;
    let dragStartLeft = 0;

    let resizeObserver: ResizeObserver | null = null;
    let currentDragHandler: ((e: MouseEvent | TouchEvent) => void) | undefined;
    let isMobileDevice = false;

    const throttledUpdateScrollbar = throttle(() => updateCustomScrollbar(), 200);
    // Use requestAnimationFrame for smoother scrollbar dragging performance
    const rafUpdateVirtualScrollY = rafThrottle((scrollTop: number) => updateVirtualScrollY(scrollTop));

    onMounted(() => {
        isMobileDevice = isTouchPrimaryDevice();
        if (scrollbarOptions.value.enabled && !isMobileDevice) {
            resizeObserver = new ResizeObserver(throttledUpdateScrollbar);
            resizeObserver.observe(containerRef.value!);
        }
        initScrollbar();
    });

    onBeforeUnmount(() => {
        // en: Clean up all event listeners to prevent memory leaks
        onDragEnd();
        resizeObserver?.disconnect();
        resizeObserver = null;
    });

    function updateCustomScrollbar() {
        if (!scrollbarOptions.value.enabled || isMobileDevice) return;
        const { scrollHeight, scrollTop, maxScrollTop, containerHeight } = virtualScroll.value;
        const { scrollWidth, scrollLeft, containerWidth } = virtualScrollX.value;

        const needVertical = maxScrollTop > 0;
        const needHorizontal = scrollWidth > containerWidth;
        showScrollbar.value = { x: needHorizontal, y: needVertical };

        if (needVertical) {
            const ratio = containerHeight / scrollHeight;
            scrollbar.value.h = Math.max(scrollbarOptions.value.minHeight, ratio * containerHeight);
            const scrollRatio = Math.min(Math.max(0, scrollTop), maxScrollTop) / maxScrollTop;
            scrollbar.value.t = Math.round(scrollRatio * (containerHeight - scrollbar.value.h));
        }

        if (needHorizontal) {
            const ratio = containerWidth / scrollWidth;
            scrollbar.value.w = Math.max(scrollbarOptions.value.minWidth, ratio * containerWidth);
            scrollbar.value.l = Math.round((scrollLeft / (scrollWidth - containerWidth)) * (containerWidth - scrollbar.value.w));
        }
    }

    function onVerticalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent) e.preventDefault();
        isDraggingVertical = true;
        const { scrollTop } = virtualScroll.value;
        dragStartTop = scrollTop;
        dragStartY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        addDragListeners(onVerticalDrag);
    }

    function onHorizontalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent) e.preventDefault();
        isDraggingHorizontal = true;
        const { scrollLeft } = virtualScrollX.value;
        dragStartLeft = scrollLeft;
        dragStartX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        addDragListeners(onHorizontalDrag);
    }

    function addDragListeners(dragHandler: (e: MouseEvent | TouchEvent) => void) {
        removeCurrentDragHandlerListeners();
        currentDragHandler = dragHandler;
        document.addEventListener('mousemove', dragHandler);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', dragHandler, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    function onVerticalDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingVertical) return;
        e.preventDefault();
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        const deltaY = clientY - dragStartY;
        const { maxScrollTop: scrollRange, containerHeight } = virtualScroll.value;
        const trackRange = containerHeight - scrollbar.value.h;
        if (scrollRange <= 0 || trackRange <= 0) return;
        const scrollDelta = (deltaY / trackRange) * scrollRange;

        if (isExperimentalScrollY.value) {
            const targetTop = Math.min(Math.max(0, dragStartTop + scrollDelta), scrollRange);
            scrollbar.value.t = Math.round((targetTop / scrollRange) * trackRange);
            rafUpdateVirtualScrollY(targetTop);
        } else {
            containerRef.value!.scrollTop = dragStartTop + scrollDelta;
        }
    }

    function onHorizontalDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingHorizontal) return;
        e.preventDefault();

        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const deltaX = clientX - dragStartX;
        const { scrollWidth, containerWidth } = virtualScrollX.value;

        const scrollRange = scrollWidth - containerWidth;
        const trackRange = containerWidth - scrollbar.value.w;
        const scrollDelta = (deltaX / trackRange) * scrollRange;
        containerRef.value!.scrollLeft = dragStartLeft + scrollDelta;
    }

    function onDragEnd() {
        isDraggingVertical = false;
        isDraggingHorizontal = false;
        removeCurrentDragHandlerListeners();
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchend', onDragEnd);
    }

    function removeCurrentDragHandlerListeners() {
        if (currentDragHandler) {
            document.removeEventListener('mousemove', currentDragHandler);
            document.removeEventListener('touchmove', currentDragHandler);
            currentDragHandler = void 0;
        }
    }

    function initScrollbar() {
        nextTick(updateCustomScrollbar);
    }

    return [scrollbar, showScrollbar, onVerticalScrollbarMouseDown, onHorizontalScrollbarMouseDown, updateCustomScrollbar] as const;
}
