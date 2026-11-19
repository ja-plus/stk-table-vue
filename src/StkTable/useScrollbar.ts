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
    // 拖拽起始时冻结的映射参数：autoRowHeight 等模式下总高会在拖拽期间变化，
    // 若每帧用实时总高换算，thumb 与内容会相对指针漂移（不跟手）
    let dragStartThumbT = 0;
    let dragStartThumbL = 0;
    let dragScrollRangeY = 0;
    let dragTrackRangeY = 0;
    let dragScrollRangeX = 0;
    let dragTrackRangeX = 0;

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
        const { scrollHeight, scrollTop, containerHeight } = virtualScroll.value;
        const { scrollWidth, scrollLeft, containerWidth } = virtualScrollX.value;

        const needVertical = scrollHeight > containerHeight;
        const needHorizontal = scrollWidth > containerWidth;
        showScrollbar.value = { x: needHorizontal, y: needVertical };

        if (needVertical && !isDraggingVertical) {
            const ratio = containerHeight / scrollHeight;
            scrollbar.value.h = Math.max(scrollbarOptions.value.minHeight, ratio * containerHeight);
            scrollbar.value.t = Math.round((scrollTop / (scrollHeight - containerHeight)) * (containerHeight - scrollbar.value.h));
        }

        if (needHorizontal && !isDraggingHorizontal) {
            const ratio = containerWidth / scrollWidth;
            scrollbar.value.w = Math.max(scrollbarOptions.value.minWidth, ratio * containerWidth);
            scrollbar.value.l = Math.round((scrollLeft / (scrollWidth - containerWidth)) * (containerWidth - scrollbar.value.w));
        }
    }

    function onVerticalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent) e.preventDefault();
        isDraggingVertical = true;
        const { scrollTop, scrollHeight, containerHeight } = virtualScroll.value;
        dragStartTop = scrollTop;
        dragStartY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        dragStartThumbT = scrollbar.value.t;
        dragScrollRangeY = Math.max(0, scrollHeight - containerHeight);
        dragTrackRangeY = Math.max(1, containerHeight - scrollbar.value.h);
        addDragListeners(onVerticalDrag);
    }

    function onHorizontalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent) e.preventDefault();
        isDraggingHorizontal = true;
        const { scrollLeft, scrollWidth, containerWidth } = virtualScrollX.value;
        dragStartLeft = scrollLeft;
        dragStartX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        dragStartThumbL = scrollbar.value.l;
        dragScrollRangeX = Math.max(0, scrollWidth - containerWidth);
        dragTrackRangeX = Math.max(1, containerWidth - scrollbar.value.w);
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
        const scrollDelta = (deltaY / dragTrackRangeY) * dragScrollRangeY;
        const top = Math.min(dragScrollRangeY, Math.max(0, dragStartTop + scrollDelta));
        // thumb 与指针 1:1，不随拖拽期间的总高变化重算
        scrollbar.value.t = Math.min(dragTrackRangeY, Math.max(0, dragStartThumbT + deltaY));

        if (isExperimentalScrollY.value) {
            rafUpdateVirtualScrollY(top);
        } else {
            containerRef.value!.scrollTop = top;
        }
    }

    function onHorizontalDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingHorizontal) return;
        e.preventDefault();

        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const deltaX = clientX - dragStartX;
        const scrollDelta = (deltaX / dragTrackRangeX) * dragScrollRangeX;
        const left = Math.min(dragScrollRangeX, Math.max(0, dragStartLeft + scrollDelta));
        scrollbar.value.l = Math.min(dragTrackRangeX, Math.max(0, dragStartThumbL + deltaX));
        containerRef.value!.scrollLeft = left;
    }

    function onDragEnd() {
        isDraggingVertical = false;
        isDraggingHorizontal = false;
        removeCurrentDragHandlerListeners();
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchend', onDragEnd);
        // 非 experimental 模式下 store 的滚动位置落后 DOM 一帧（scroll 事件 rAF 节流），
        // 松手对齐前先同步，避免 thumb 用旧位置重算跳一帧
        if (!isExperimentalScrollY.value && containerRef.value) {
            virtualScroll.value.scrollTop = containerRef.value.scrollTop;
            virtualScrollX.value.scrollLeft = containerRef.value.scrollLeft;
        }
        // 拖拽期间冻结的 thumb 几何与实时总高可能已不一致，松手后对齐
        updateCustomScrollbar();
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
