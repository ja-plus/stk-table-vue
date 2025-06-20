import { computed, Ref, ref, onMounted, onUnmounted, watch } from 'vue';

type Params = {
    props: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
};

export function useScrollRowByRow({ props, tableContainerRef }: Params) {
    let isMouseDown = false;
    let isAddListeners = false;
    /** record the last scroll bar position */
    let lastScrollTop = 0;

    /** record is the scroll bar is dragging */
    const isDragScroll = ref(false);
    const onlyDragScroll = computed(() => props.scrollRowByRow === 'scrollbar');

    /** is ScrollRowByRow active */
    const isSRBRActive = computed(() => {
        if (onlyDragScroll.value) {
            return isDragScroll.value;
        }
        return props.scrollRowByRow;
    });

    watch(onlyDragScroll, v => {
        if (v) {
            addEventListener();
        } else {
            removeEventListener();
        }
    });

    onMounted(() => {
        addEventListener();
    });

    onUnmounted(() => {
        removeEventListener();
    });

    function addEventListener() {
        if (isAddListeners || !onlyDragScroll.value) return;
        const container = tableContainerRef.value;
        if (!container) return;
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('scroll', handleScroll);
        isAddListeners = true;
    }

    function removeEventListener() {
        const container = tableContainerRef.value;
        if (!container) return;
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('scroll', handleScroll);
        isAddListeners = false;
    }

    function handleMouseDown(e: Event) {
        isMouseDown = true;
        lastScrollTop = (e.target as HTMLElement).scrollTop;
    }

    function handleMouseUp() {
        isMouseDown = false;
        isDragScroll.value = false;
        lastScrollTop = 0;
    }

    function handleScroll(e: Event) {
        const scrollTop = (e.target as HTMLElement).scrollTop;
        // if scrollTop === lastScrollTop means horizontal scroll
        if (!isMouseDown || scrollTop === lastScrollTop) return;
        isDragScroll.value = true;
    }
    return { isSRBRActive, isDragScroll };
}
