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
    /**
     * 拖拽起始时拇指位置的浮点锚点。
     * thumb 以像素 1:1 跟随指针（锚点 + 指针位移），内容位置则按「拇指在轨道上的比例 × 实时总高」推导。
     * 这样 autoRowHeight 下拖拽期间总高变化时：拇指不漂移，且拖到轨道底部时比例恰为 1，
     * 一次拖拽即可到达内容底部（不会像冻结像素映射那样被起始总高卡住）。
     * 用浮点而非取整后的 scrollbar.t，避免比例换算把取整误差放大成内容偏移。
     */
    let dragStartThumbT = 0;
    let dragStartThumbL = 0;
    /** 最近一次指针位置：松手时用它 + 最新几何再映射一次（touchend 的 touches 为空，不能依赖事件坐标） */
    let lastClientY = 0;
    let lastClientX = 0;

    let resizeObserver: ResizeObserver | null = null;
    let currentDragHandler: ((e: MouseEvent | TouchEvent) => void) | undefined;
    let isMobileDevice = false;

    const throttledUpdateScrollbar = throttle(() => updateCustomScrollbar(), 200);
    // Use requestAnimationFrame for smoother scrollbar dragging performance
    const rafUpdateVirtualScrollY = rafThrottle((scrollTop: number) => {
        updateVirtualScrollY(scrollTop);
        // 实验模式 DOM scrollTop 恒为 0、不会触发 scroll 事件，需在此让 thumb 长度跟上实测总高
        updateCustomScrollbar();
    });

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
        // 卸载不是用户松手，置空拖拽标记以避免执行「松手再映射」
        isDraggingVertical = false;
        isDraggingHorizontal = false;
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

        if (needVertical) {
            const ratio = containerHeight / scrollHeight;
            // 长度只取决于实时总高，拖拽期间也要更新：轨道范围是比例映射的分母，冻结它会导致拖不到底部
            scrollbar.value.h = Math.max(scrollbarOptions.value.minHeight, ratio * containerHeight);
            // 位置由指针驱动，拖拽期间不能用滚动位置反算，否则 thumb 会相对指针漂移
            if (!isDraggingVertical) {
                scrollbar.value.t = Math.round((scrollTop / (scrollHeight - containerHeight)) * (containerHeight - scrollbar.value.h));
            }
        }

        if (needHorizontal) {
            const ratio = containerWidth / scrollWidth;
            scrollbar.value.w = Math.max(scrollbarOptions.value.minWidth, ratio * containerWidth);
            if (!isDraggingHorizontal) {
                scrollbar.value.l = Math.round((scrollLeft / (scrollWidth - containerWidth)) * (containerWidth - scrollbar.value.w));
            }
        }
    }

    function onVerticalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent) e.preventDefault();
        isDraggingVertical = true;
        const { scrollTop, scrollHeight, containerHeight } = virtualScroll.value;
        dragStartY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        const scrollRange = Math.max(0, scrollHeight - containerHeight);
        const trackRange = Math.max(1, containerHeight - scrollbar.value.h);
        // 浮点锚定起始比例对应的像素位置，保证 delta=0 时内容不跳
        dragStartThumbT = scrollRange > 0 ? (scrollTop / scrollRange) * trackRange : 0;
        addDragListeners(onVerticalDrag);
    }

    function onHorizontalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent) e.preventDefault();
        isDraggingHorizontal = true;
        const { scrollLeft, scrollWidth, containerWidth } = virtualScrollX.value;
        dragStartX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const scrollRange = Math.max(0, scrollWidth - containerWidth);
        const trackRange = Math.max(1, containerWidth - scrollbar.value.w);
        dragStartThumbL = scrollRange > 0 ? (scrollLeft / scrollRange) * trackRange : 0;
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
        applyVerticalDrag(clientY);
    }

    /**
     * 应用纵向拖拽映射
     * @param clientY 指针 Y
     * @param sync 松手时同步更新实验模式的虚拟滚动（rAF 排队可能导致松手后 thumb 用旧位置重算）
     */
    function applyVerticalDrag(clientY: number, sync = false) {
        lastClientY = clientY;
        const deltaY = clientY - dragStartY;
        const { scrollHeight, containerHeight } = virtualScroll.value;
        // 实时几何：autoRowHeight 下拖拽期间行高实测会改变总高与 thumb 长度
        const scrollRange = Math.max(0, scrollHeight - containerHeight);
        const trackRange = Math.max(1, containerHeight - scrollbar.value.h);
        // thumb 与指针 1:1（按起始锚点 + 指针位移），不随总高变化重算
        const thumbT = Math.min(trackRange, Math.max(0, dragStartThumbT + deltaY));
        scrollbar.value.t = Math.round(thumbT);
        // 内容按拇指在轨道上的比例映射到实时总高：
        // 拖到轨道底部时比例为 1 → top = 实时最大滚动距离，一次拖拽即可到底
        const top = scrollRange > 0 ? Math.min(scrollRange, (thumbT / trackRange) * scrollRange) : 0;

        if (isExperimentalScrollY.value) {
            if (sync) updateVirtualScrollY(top);
            else rafUpdateVirtualScrollY(top);
        } else if (containerRef.value) {
            containerRef.value.scrollTop = top;
        }
    }

    function onHorizontalDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingHorizontal) return;
        e.preventDefault();
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        applyHorizontalDrag(clientX);
    }

    function applyHorizontalDrag(clientX: number) {
        lastClientX = clientX;
        const deltaX = clientX - dragStartX;
        const { scrollWidth, containerWidth } = virtualScrollX.value;
        const scrollRange = Math.max(0, scrollWidth - containerWidth);
        const trackRange = Math.max(1, containerWidth - scrollbar.value.w);
        const thumbL = Math.min(trackRange, Math.max(0, dragStartThumbL + deltaX));
        scrollbar.value.l = Math.round(thumbL);
        const left = scrollRange > 0 ? Math.min(scrollRange, (thumbL / trackRange) * scrollRange) : 0;
        if (containerRef.value) containerRef.value.scrollLeft = left;
    }

    function onDragEnd() {
        const wasVertical = isDraggingVertical;
        const wasHorizontal = isDraggingHorizontal;
        isDraggingVertical = false;
        isDraggingHorizontal = false;
        removeCurrentDragHandlerListeners();
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchend', onDragEnd);
        // 松手前用最终指针位置 + 最新几何再映射一次：
        // 最后一次 mousemove 之后的实测（rAF）可能已改变总高，若此时按内容位置反算 thumb，
        // 会跳回「按旧总高算出的、未到底」的位置。再映射一次后 thumb 留在指针处，内容贴住其比例。
        if (wasVertical) applyVerticalDrag(lastClientY, true);
        else if (wasHorizontal) applyHorizontalDrag(lastClientX);
        // 非 experimental 模式下 store 的滚动位置落后 DOM 一帧（scroll 事件 rAF 节流），
        // 松手对齐前先同步，避免 thumb 用旧位置重算跳一帧
        if (!isExperimentalScrollY.value && containerRef.value) {
            virtualScroll.value.scrollTop = containerRef.value.scrollTop;
            virtualScrollX.value.scrollLeft = containerRef.value.scrollLeft;
        }
        // 对齐实时几何（长度 h/w 与实验模式下可能仍滞后的位置）
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
