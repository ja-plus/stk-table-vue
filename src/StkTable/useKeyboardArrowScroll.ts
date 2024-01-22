import { Ref, onBeforeUnmount, onMounted } from 'vue';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

const ARROW_CODES = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];

type Options = {
    scrollTo: (x: number | null, y: number | null) => void;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
};
/**
 * 按下键盘箭头滚动。只有悬浮在表体上才能生效键盘。
 *
 * 在低版本浏览器中，虚拟滚动时，使用键盘滚动，等选中的行消失在视口外时，滚动会失效。
 */
export function useKeyboardArrowScroll(targetElement: Ref<HTMLElement | undefined>, { scrollTo, virtualScroll, virtualScrollX }: Options) {
    /** 检测鼠标是否悬浮在表格体上 */
    let isMouseOver = false;

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
        targetElement.value?.addEventListener('mouseenter', handleMouseEnter);
        targetElement.value?.addEventListener('mouseleave', handleMouseLeave);
        targetElement.value?.addEventListener('mousedown', handleMouseDown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown);
        targetElement.value?.removeEventListener('mouseenter', handleMouseEnter);
        targetElement.value?.removeEventListener('mouseleave', handleMouseLeave);
        targetElement.value?.removeEventListener('mousedown', handleMouseDown);
    });

    /** 键盘按下事件 */
    function handleKeydown(e: KeyboardEvent) {
        if (!ARROW_CODES.includes(e.code)) return;
        e.preventDefault(); // 不触发键盘默认的箭头事件
        if (!isMouseOver) return;

        const { scrollTop, rowHeight } = virtualScroll.value;
        const { scrollLeft } = virtualScrollX.value;
        if (e.code === ARROW_CODES[0]) {
            scrollTo(scrollTop - rowHeight, null);
        } else if (e.code === ARROW_CODES[1]) {
            scrollTo(null, scrollLeft + rowHeight);
        } else if (e.code === ARROW_CODES[2]) {
            scrollTo(scrollTop + rowHeight, null);
        } else if (e.code === ARROW_CODES[3]) {
            scrollTo(null, scrollLeft - rowHeight);
        }
    }

    function handleMouseEnter() {
        isMouseOver = true;
    }
    function handleMouseLeave() {
        isMouseOver = false;
    }
    /**
     * 兜底。
     * 是否存在不触发mouseEnter的时候？
     */
    function handleMouseDown() {
        if (!isMouseOver) isMouseOver = true;
    }
}
