import { ComputedRef, Ref, ShallowRef, onBeforeUnmount, onMounted, watch } from 'vue';
import { StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

/** 翻页按键 */
enum ScrollCodes {
    ArrowUp = 'ArrowUp',
    ArrowRight = 'ArrowRight',
    ArrowDown = 'ArrowDown',
    ArrowLeft = 'ArrowLeft',
    PageUp = 'PageUp',
    PageDown = 'PageDown',
}
/** 所有翻页按键数组 */
const ScrollCodesValues = Object.values(ScrollCodes);

type Options<DT extends Record<string, any>> = {
    props: any;
    scrollTo: (y: number | null, x: number | null) => void;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
    tableHeaders: ShallowRef<StkTableColumn<DT>[][]>;
    virtual_on: ComputedRef<boolean>;
};
/**
 * 按下键盘箭头滚动。只有悬浮在表体上才能生效键盘。
 *
 * 在低版本浏览器中，虚拟滚动时，使用键盘滚动，等选中的行消失在视口外时，滚动会失效。
 */
export function useKeyboardArrowScroll<DT extends Record<string, any>>(
    targetElement: Ref<HTMLElement | undefined>,
    { props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on }: Options<DT>,
) {
    /** 检测鼠标是否悬浮在表格体上 */
    let isMouseOver = false;
    watch(virtual_on, val => {
        if (!val) {
            removeListeners();
        } else {
            addEventListeners();
        }
    });

    onMounted(addEventListeners);

    onBeforeUnmount(removeListeners);

    function addEventListeners() {
        window.addEventListener('keydown', handleKeydown);
        targetElement.value?.addEventListener('mouseenter', handleMouseEnter);
        targetElement.value?.addEventListener('mouseleave', handleMouseLeave);
        targetElement.value?.addEventListener('mousedown', handleMouseDown);
    }

    function removeListeners() {
        window.removeEventListener('keydown', handleKeydown);
        targetElement.value?.removeEventListener('mouseenter', handleMouseEnter);
        targetElement.value?.removeEventListener('mouseleave', handleMouseLeave);
        targetElement.value?.removeEventListener('mousedown', handleMouseDown);
    }

    /** 键盘按下事件 */
    function handleKeydown(e: KeyboardEvent) {
        if (!virtual_on.value) return; // 非虚拟滚动使用浏览器默认滚动
        if (!ScrollCodesValues.includes(e.code as any)) return;
        if (!isMouseOver) return; // 不悬浮还是要触发键盘事件的
        e.preventDefault(); // 不触发键盘默认的箭头事件

        const { scrollTop, rowHeight, containerHeight } = virtualScroll.value;
        const { scrollLeft } = virtualScrollX.value;
        const { headless, headerRowHeight } = props;

        // 这里不用virtualScroll 中的pageSize，因为我需要上一页的最后一条放在下一页的第一条
        const headerHeight = headless ? 0 : tableHeaders.value.length * (headerRowHeight || rowHeight);
        /** 表体的page */
        const bodyPageSize = Math.floor((containerHeight - headerHeight) / rowHeight);

        if (e.code === ScrollCodes.ArrowUp) {
            scrollTo(scrollTop - rowHeight, null);
        } else if (e.code === ScrollCodes.ArrowRight) {
            scrollTo(null, scrollLeft + rowHeight);
        } else if (e.code === ScrollCodes.ArrowDown) {
            scrollTo(scrollTop + rowHeight, null);
        } else if (e.code === ScrollCodes.ArrowLeft) {
            scrollTo(null, scrollLeft - rowHeight);
        } else if (e.code === ScrollCodes.PageUp) {
            scrollTo(scrollTop - rowHeight * bodyPageSize + headerHeight, null);
        } else if (e.code === ScrollCodes.PageDown) {
            scrollTo(scrollTop + rowHeight * bodyPageSize - headerHeight, null);
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
