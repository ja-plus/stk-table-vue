import { nextTick, onMounted, onUnmounted, ref, Ref } from 'vue';
import type { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
import { throttle } from './utils/index';

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

type Params = {
    props: any;
    containerRef: Ref<HTMLDivElement | undefined>;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
    updateVirtualScrollY: (sTop?: number) => void;
    scrollbarOptions: Ref<Required<ScrollbarOptions>>;
};

/**
 * 自定义滚动条hooks
 * @param containerRef 滚动容器的ref
 * @param options 滚动条配置选项
 * @returns 滚动条相关状态和方法
 */
export function useScrollbar({ props, containerRef, virtualScroll, virtualScrollX, updateVirtualScrollY, scrollbarOptions }: Params) {
    const showScrollbar = ref({ x: false, y: false });

    const scrollbar = ref({ h: 0, w: 0, t: 0, l: 0 });

    let isDraggingVertical = false;
    let isDraggingHorizontal = false;
    let dragStartY = 0;
    let dragStartX = 0;
    let dragStartTop = 0;
    let dragStartLeft = 0;

    let resizeObserver: ResizeObserver | null = null;

    const throttledUpdateScrollbar = throttle(() => {
        updateCustomScrollbar();
    }, 200);

    onMounted(() => {
        if (scrollbarOptions.value.enabled) {
            resizeObserver = new ResizeObserver(throttledUpdateScrollbar);
            resizeObserver.observe(containerRef.value!);
        }
        // if (tableMainRef.value) {
        //     resizeObserver.observe(tableMainRef.value);
        // }
        initScrollbar();
    });

    onUnmounted(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
    });

    function updateCustomScrollbar() {
        if (!scrollbarOptions.value.enabled) return;
        const { scrollHeight, scrollTop, containerHeight } = virtualScroll.value;
        const { scrollWidth, scrollLeft, containerWidth } = virtualScrollX.value;

        const needVertical = scrollHeight > containerHeight;
        const needHorizontal = scrollWidth > containerWidth;
        showScrollbar.value = { x: needHorizontal, y: needVertical };

        if (needVertical) {
            const ratio = containerHeight / scrollHeight;
            scrollbar.value.h = Math.max(scrollbarOptions.value.minHeight, ratio * containerHeight);
            scrollbar.value.t = Math.round((scrollTop / (scrollHeight - containerHeight)) * (containerHeight - scrollbar.value.h));
        }

        if (needHorizontal) {
            const ratio = containerWidth / scrollWidth;
            scrollbar.value.w = Math.max(scrollbarOptions.value.minWidth, ratio * containerWidth);
            scrollbar.value.l = Math.round((scrollLeft / (scrollWidth - containerWidth)) * (containerWidth - scrollbar.value.w));
        }
    }

    function onVerticalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        isDraggingVertical = true;

        const { scrollTop } = virtualScroll.value;

        dragStartTop = scrollTop;
        dragStartY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

        document.addEventListener('mousemove', onVerticalDrag);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onVerticalDrag, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    function onHorizontalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        isDraggingHorizontal = true;

        const { scrollLeft } = virtualScrollX.value;
        dragStartLeft = scrollLeft;

        dragStartX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

        document.addEventListener('mousemove', onHorizontalDrag);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onHorizontalDrag, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    function onVerticalDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingVertical) return;

        e.preventDefault();

        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

        const deltaY = clientY - dragStartY;
        const { scrollHeight, containerHeight } = virtualScroll.value;

        const scrollRange = scrollHeight - containerHeight;
        const trackRange = containerHeight - scrollbar.value.h;
        const scrollDelta = (deltaY / trackRange) * scrollRange;

        if (props.experimental?.scrollY) {
            const ratio = containerHeight / scrollHeight;
            const top = Math.round((dragStartTop + scrollDelta) * ratio);
            const maxTop = containerHeight - scrollbar.value.h;

            scrollbar.value.t = top < 0 ? 0 : top > maxTop ? maxTop : top;
            updateVirtualScrollY(dragStartTop + scrollDelta);
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

        document.removeEventListener('mousemove', onVerticalDrag);
        document.removeEventListener('mousemove', onHorizontalDrag);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchmove', onVerticalDrag);
        document.removeEventListener('touchmove', onHorizontalDrag);
        document.removeEventListener('touchend', onDragEnd);
    }

    function initScrollbar() {
        nextTick(() => {
            updateCustomScrollbar();
        });
    }

    return {
        scrollbar,
        showScrollbar,
        onVerticalScrollbarMouseDown,
        onHorizontalScrollbarMouseDown,
        updateCustomScrollbar,
    };
}
