import { computed, Ref, ref, onMounted, onUnmounted, watch } from 'vue';

type Params = {
    props: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
};

export function useScrollRowByRow({ props, tableContainerRef }: Params) {
    let isMouseDown = false;
    let isAddListeners = false;

    /**记录滚动条是否正在被拖动 */
    const isDragScroll = ref(false);
    const onlyDragScroll = computed(() => props.scrollRowByRow === 'scrollbar');

    /** is ScrollRowByRow active */
    const isSRBRActive = computed(() => {
        if (onlyDragScroll.value) {
            return isDragScroll.value;
        }
        return props.scrollRowByRow;
    });

    watch(
        () => onlyDragScroll.value,
        v => {
            if (v) {
                addEventListener();
            } else {
                removeEventListener();
            }
        },
    );

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

    function handleMouseDown() {
        isMouseDown = true;
    }

    function handleMouseUp() {
        isMouseDown = false;
        isDragScroll.value = false;
    }

    function handleScroll() {
        if (!isMouseDown) return;
        isDragScroll.value = true;
    }
    return { isSRBRActive, isDragScroll };
}
