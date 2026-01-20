import { ref, onMounted, onUnmounted, nextTick, Ref } from 'vue';
import { throttle } from './utils/index';

/**
 * 自定义滚动条配置选项
 */
export interface ScrollbarOptions {
    /** 是否启用自定义滚动条 */
    enabled?: boolean;
    /** 滚动条最小高度 */
    minBarHeight?: number;
    /** 滚动条最小宽度 */
    minBarWidth?: number;
    /** 滚动条宽度 */
    barWidth?: number;
    /** 滚动条高度 */
    barHeight?: number;
}

/**
 * 自定义滚动条hooks
 * @param containerRef 滚动容器的ref
 * @param options 滚动条配置选项
 * @returns 滚动条相关状态和方法
 */
export function useScrollbar(containerRef: Ref<HTMLDivElement | undefined>, options: ScrollbarOptions = {}) {
    const defaultOptions: Required<ScrollbarOptions> = {
        enabled: true,
        minBarHeight: 20,
        minBarWidth: 20,
        barWidth: 8,
        barHeight: 8,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const showScrollbar = ref({
        x: false,
        y: false,
    });
    const verticalScrollbarHeight = ref(0);
    const verticalScrollbarTop = ref(0);
    const horizontalScrollbarWidth = ref(0);
    const horizontalScrollbarLeft = ref(0);

    let isDraggingVertical = false;
    let isDraggingHorizontal = false;
    let dragStartY = 0;
    let dragStartX = 0;
    let dragStartScrollTop = 0;
    let dragStartScrollLeft = 0;

    let resizeObserver: ResizeObserver | null = null;

    const throttledUpdateScrollbar = throttle(() => {
        updateCustomScrollbar();
    }, 200);

    onMounted(() => {
        if (containerRef.value) {
            resizeObserver = new ResizeObserver(throttledUpdateScrollbar);
            resizeObserver.observe(containerRef.value);
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
        if (!mergedOptions.enabled || !containerRef.value) return;

        const container = containerRef.value;
        const { scrollHeight, clientHeight, scrollWidth, clientWidth, scrollTop, scrollLeft } = container;

        const needVertical = scrollHeight > clientHeight;
        const needHorizontal = scrollWidth > clientWidth;
        showScrollbar.value = { x: needHorizontal, y: needVertical };

        if (needVertical) {
            const ratio = clientHeight / scrollHeight;
            verticalScrollbarHeight.value = Math.max(mergedOptions.minBarHeight, ratio * clientHeight);
            verticalScrollbarTop.value = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - verticalScrollbarHeight.value);
        }

        if (needHorizontal) {
            const ratio = clientWidth / scrollWidth;
            horizontalScrollbarWidth.value = Math.max(mergedOptions.minBarWidth, ratio * clientWidth);
            horizontalScrollbarLeft.value = (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - horizontalScrollbarWidth.value);
        }
    }

    function onVerticalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        isDraggingVertical = true;

        const container = containerRef.value;
        if (!container) return;

        dragStartScrollTop = container.scrollTop;

        if (e instanceof MouseEvent) {
            dragStartY = e.clientY;
        } else {
            dragStartY = e.touches[0].clientY;
        }

        document.addEventListener('mousemove', onVerticalScrollbarDrag);
        document.addEventListener('mouseup', onScrollbarDragEnd);
        document.addEventListener('touchmove', onVerticalScrollbarDrag, { passive: false });
        document.addEventListener('touchend', onScrollbarDragEnd);
    }

    function onHorizontalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        isDraggingHorizontal = true;

        const container = containerRef.value;
        if (!container) return;

        dragStartScrollLeft = container.scrollLeft;

        if (e instanceof MouseEvent) {
            dragStartX = e.clientX;
        } else {
            dragStartX = e.touches[0].clientX;
        }

        document.addEventListener('mousemove', onHorizontalScrollbarDrag);
        document.addEventListener('mouseup', onScrollbarDragEnd);
        document.addEventListener('touchmove', onHorizontalScrollbarDrag, { passive: false });
        document.addEventListener('touchend', onScrollbarDragEnd);
    }

    function onVerticalScrollbarDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingVertical || !containerRef.value) return;

        e.preventDefault();

        let clientY = 0;
        if (e instanceof MouseEvent) {
            clientY = e.clientY;
        } else {
            clientY = e.touches[0].clientY;
        }

        const deltaY = clientY - dragStartY;
        const container = containerRef.value;
        const { scrollHeight, clientHeight } = container;

        // 计算新的scrollTop
        const scrollRange = scrollHeight - clientHeight;
        const trackRange = clientHeight - verticalScrollbarHeight.value;
        const scrollDelta = (deltaY / trackRange) * scrollRange;
        container.scrollTop = dragStartScrollTop + scrollDelta;

        // updateCustomScrollbar();
    }

    function onHorizontalScrollbarDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingHorizontal || !containerRef.value) return;

        e.preventDefault();

        let clientX = 0;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
        } else {
            clientX = e.touches[0].clientX;
        }

        const deltaX = clientX - dragStartX;
        const container = containerRef.value;
        const { scrollWidth, clientWidth } = container;

        // 计算新的scrollLeft
        const scrollRange = scrollWidth - clientWidth;
        const trackRange = clientWidth - horizontalScrollbarWidth.value;
        const scrollDelta = (deltaX / trackRange) * scrollRange;
        container.scrollLeft = dragStartScrollLeft + scrollDelta;

        // 立即更新滚动条位置，确保拖动时同步
        // updateCustomScrollbar();
    }

    function onScrollbarDragEnd() {
        isDraggingVertical = false;
        isDraggingHorizontal = false;

        document.removeEventListener('mousemove', onVerticalScrollbarDrag);
        document.removeEventListener('mousemove', onHorizontalScrollbarDrag);
        document.removeEventListener('mouseup', onScrollbarDragEnd);
        document.removeEventListener('touchmove', onVerticalScrollbarDrag);
        document.removeEventListener('touchmove', onHorizontalScrollbarDrag);
        document.removeEventListener('touchend', onScrollbarDragEnd);
    }

    function initScrollbar() {
        nextTick(() => {
            updateCustomScrollbar();
        });
    }

    return {
        showScrollbar,
        verticalScrollbarHeight,
        verticalScrollbarTop,
        horizontalScrollbarWidth,
        horizontalScrollbarLeft,

        onVerticalScrollbarMouseDown,
        onHorizontalScrollbarMouseDown,

        updateCustomScrollbar,
    };
}
