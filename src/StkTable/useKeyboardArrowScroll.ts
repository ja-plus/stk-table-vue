import { Ref, onBeforeUnmount, onMounted } from 'vue';
import { StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

/** 翻页按键 */
const SCROLL_CODES = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'PageUp', 'PageDown'] as const;

type Options<DT extends Record<string, any>> = {
    props: any;
    scrollTo: (y: number | null, x: number | null) => void;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
    tableHeaders: Ref<StkTableColumn<DT>[][]>;
};
/**
 * 按下键盘箭头滚动。只有悬浮在表体上才能生效键盘。
 *
 * 在低版本浏览器中，虚拟滚动时，使用键盘滚动，等选中的行消失在视口外时，滚动会失效。
 */
export function useKeyboardArrowScroll<DT extends Record<string, any>>(
    targetElement: Ref<HTMLElement | undefined>,
    { props, scrollTo, virtualScroll, virtualScrollX, tableHeaders }: Options<DT>,
) {
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
        if (!SCROLL_CODES.includes(e.code as any)) return;
        if (!isMouseOver) return; // 不悬浮还是要触发键盘事件的
        e.preventDefault(); // 不触发键盘默认的箭头事件

        const { scrollTop, rowHeight, pageSize } = virtualScroll.value;
        const { scrollLeft } = virtualScrollX.value;
        const { headless, headerRowHeight } = props;
        /**表头高度 */
        const headerHeight = headless ? 0 : tableHeaders.value.length * (headerRowHeight || rowHeight);
        if (e.code === SCROLL_CODES[0]) {
            scrollTo(scrollTop - rowHeight, null);
        } else if (e.code === SCROLL_CODES[1]) {
            scrollTo(null, scrollLeft + rowHeight);
        } else if (e.code === SCROLL_CODES[2]) {
            scrollTo(scrollTop + rowHeight, null);
        } else if (e.code === SCROLL_CODES[3]) {
            scrollTo(null, scrollLeft - rowHeight);
        } else if (e.code === SCROLL_CODES[4]) {
            scrollTo(scrollTop - rowHeight * pageSize - headerHeight, null);
        } else if (e.code === SCROLL_CODES[5]) {
            scrollTo(scrollTop + rowHeight * pageSize - headerHeight, null);
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
