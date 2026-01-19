import { ref, onMounted, onUnmounted, nextTick, Ref } from 'vue';

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
    // 默认配置
    const defaultOptions: Required<ScrollbarOptions> = {
        enabled: true,
        minBarHeight: 20,
        minBarWidth: 20,
        barWidth: 8,
        barHeight: 8,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // 自定义滚动条状态
    const showCustomScrollbar = ref(false);
    const verticalScrollbarHeight = ref(0);
    const verticalScrollbarTop = ref(0);
    const horizontalScrollbarWidth = ref(0);
    const horizontalScrollbarLeft = ref(0);

    // 滚动条拖动状态
    const isDraggingVertical = ref(false);
    const isDraggingHorizontal = ref(false);
    const dragStartY = ref(0);
    const dragStartX = ref(0);
    const dragStartScrollTop = ref(0);
    const dragStartScrollLeft = ref(0);

    /**
     * 更新自定义滚动条状态
     */
    function updateCustomScrollbar() {
        if (!mergedOptions.enabled || !containerRef.value) return;

        const container = containerRef.value;
        const { scrollHeight, clientHeight, scrollWidth, clientWidth, scrollTop, scrollLeft } = container;

        // 判断是否需要显示滚动条
        const needVertical = scrollHeight > clientHeight;
        const needHorizontal = scrollWidth > clientWidth;
        showCustomScrollbar.value = needVertical || needHorizontal;

        if (needVertical) {
            // 计算垂直滚动条高度和位置
            const ratio = clientHeight / scrollHeight;
            verticalScrollbarHeight.value = Math.max(mergedOptions.minBarHeight, ratio * clientHeight);
            verticalScrollbarTop.value = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - verticalScrollbarHeight.value);
        }

        if (needHorizontal) {
            // 计算水平滚动条宽度和位置
            const ratio = clientWidth / scrollWidth;
            horizontalScrollbarWidth.value = Math.max(mergedOptions.minBarWidth, ratio * clientWidth);
            horizontalScrollbarLeft.value = (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - horizontalScrollbarWidth.value);
        }
    }

    /**
     * 垂直滚动条鼠标按下事件
     */
    function onVerticalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        isDraggingVertical.value = true;

        const container = containerRef.value;
        if (!container) return;

        dragStartScrollTop.value = container.scrollTop;

        if (e instanceof MouseEvent) {
            dragStartY.value = e.clientY;
        } else {
            dragStartY.value = e.touches[0].clientY;
        }

        // 添加全局鼠标事件监听
        document.addEventListener('mousemove', onVerticalScrollbarDrag);
        document.addEventListener('mouseup', onScrollbarDragEnd);
        document.addEventListener('touchmove', onVerticalScrollbarDrag, { passive: false });
        document.addEventListener('touchend', onScrollbarDragEnd);
    }

    /**
     * 水平滚动条鼠标按下事件
     */
    function onHorizontalScrollbarMouseDown(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        isDraggingHorizontal.value = true;

        const container = containerRef.value;
        if (!container) return;

        dragStartScrollLeft.value = container.scrollLeft;

        if (e instanceof MouseEvent) {
            dragStartX.value = e.clientX;
        } else {
            dragStartX.value = e.touches[0].clientX;
        }

        // 添加全局鼠标事件监听
        document.addEventListener('mousemove', onHorizontalScrollbarDrag);
        document.addEventListener('mouseup', onScrollbarDragEnd);
        document.addEventListener('touchmove', onHorizontalScrollbarDrag, { passive: false });
        document.addEventListener('touchend', onScrollbarDragEnd);
    }

    /**
     * 垂直滚动条拖动事件
     */
    function onVerticalScrollbarDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingVertical.value || !containerRef.value) return;

        e.preventDefault();

        let clientY = 0;
        if (e instanceof MouseEvent) {
            clientY = e.clientY;
        } else {
            clientY = e.touches[0].clientY;
        }

        const deltaY = clientY - dragStartY.value;
        const container = containerRef.value;
        const { scrollHeight, clientHeight } = container;

        // 计算新的scrollTop
        const scrollRange = scrollHeight - clientHeight;
        const trackRange = clientHeight - verticalScrollbarHeight.value;
        const scrollDelta = (deltaY / trackRange) * scrollRange;
        container.scrollTop = dragStartScrollTop.value + scrollDelta;

        // 立即更新滚动条位置，确保拖动时同步
        updateCustomScrollbar();
    }

    /**
     * 水平滚动条拖动事件
     */
    function onHorizontalScrollbarDrag(e: MouseEvent | TouchEvent) {
        if (!isDraggingHorizontal.value || !containerRef.value) return;

        e.preventDefault();

        let clientX = 0;
        if (e instanceof MouseEvent) {
            clientX = e.clientX;
        } else {
            clientX = e.touches[0].clientX;
        }

        const deltaX = clientX - dragStartX.value;
        const container = containerRef.value;
        const { scrollWidth, clientWidth } = container;

        // 计算新的scrollLeft
        const scrollRange = scrollWidth - clientWidth;
        const trackRange = clientWidth - horizontalScrollbarWidth.value;
        const scrollDelta = (deltaX / trackRange) * scrollRange;
        container.scrollLeft = dragStartScrollLeft.value + scrollDelta;

        // 立即更新滚动条位置，确保拖动时同步
        updateCustomScrollbar();
    }

    /**
     * 滚动条拖动结束事件
     */
    function onScrollbarDragEnd() {
        isDraggingVertical.value = false;
        isDraggingHorizontal.value = false;

        // 移除全局鼠标事件监听
        document.removeEventListener('mousemove', onVerticalScrollbarDrag);
        document.removeEventListener('mousemove', onHorizontalScrollbarDrag);
        document.removeEventListener('mouseup', onScrollbarDragEnd);
        document.removeEventListener('touchmove', onVerticalScrollbarDrag);
        document.removeEventListener('touchmove', onHorizontalScrollbarDrag);
        document.removeEventListener('touchend', onScrollbarDragEnd);
    }

    /**
     * 初始化滚动条
     */
    function initScrollbar() {
        nextTick(() => {
            updateCustomScrollbar();
        });
    }

    // 监听窗口大小变化和容器滚动事件，更新滚动条
    onMounted(() => {
        window.addEventListener('resize', updateCustomScrollbar);

        // 监听容器滚动事件，确保滚动条位置始终正确
        if (containerRef.value) {
            containerRef.value.addEventListener('scroll', updateCustomScrollbar);
        }

        initScrollbar();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateCustomScrollbar);

        // 移除容器滚动事件监听
        if (containerRef.value) {
            containerRef.value.removeEventListener('scroll', updateCustomScrollbar);
        }
    });

    return {
        // 滚动条状态
        showCustomScrollbar,
        verticalScrollbarHeight,
        verticalScrollbarTop,
        horizontalScrollbarWidth,
        horizontalScrollbarLeft,

        // 滚动条事件处理函数
        onVerticalScrollbarMouseDown,
        onHorizontalScrollbarMouseDown,

        // 滚动条更新方法
        updateCustomScrollbar,
        initScrollbar,

        // 配置选项
        options: mergedOptions,
    };
}
