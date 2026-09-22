import { ComputedRef, Ref, ShallowRef, onBeforeUnmount, onMounted, watch } from 'vue';
import { AreaSelectionConfig, StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

/** 翻页按键 */
const ScrollCodes = {
    ArrowUp: 'ArrowUp',
    ArrowRight: 'ArrowRight',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
    Home: 'Home',
    End: 'End',
} as const;

type ScrollCodes = (typeof ScrollCodes)[keyof typeof ScrollCodes];

/** 所有翻页按键数组 */
const ScrollCodesValues = Object.values(ScrollCodes);

/**
 * 按下键盘箭头滚动。只有悬浮在表体上才能生效键盘。
 *
 * 在低版本浏览器中，虚拟滚动时，使用键盘滚动，等选中的行消失在视口外时，滚动会失效。
 */
export function useKeyboardArrowScroll<DT extends Record<string, any>>(
    targetElement: Ref<HTMLElement | undefined>,
    props: any,
    scrollTo: (y: number | null, x: number | null) => void,
    virtualScroll: Ref<VirtualScrollStore>,
    virtualScrollX: Ref<VirtualScrollXStore>,
    tableHeaders: ShallowRef<StkTableColumn<DT>[][]>,
    virtual_on: ComputedRef<boolean>,
    areaSelectionConfig: ComputedRef<AreaSelectionConfig>,
) {
    /** 检测鼠标是否悬浮在表格体上 */
    let isMouseOver = false;
    watch(virtual_on, val => {
        removeListeners();
        if (val) {
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
        // 如果单元格选区键盘控制已启用，则不处理滚动，交给 useAreaSelection 处理
        if (areaSelectionConfig.value.keyboard) return;
        const keyCode = e.code;
        if (!ScrollCodesValues.includes(keyCode as any)) return;
        // 键盘可访问性：鼠标悬浮 或 焦点位于容器内部 任一命中即响应。
        // 旧实现仅判断 isMouseOver，纯键盘用户从未触发 mouseenter，方向键滚动永远失效。
        if (!isTableEngaged()) return;
        e.preventDefault(); // 不触发键盘默认的箭头事件

        const { scrollTop, rowHeight, containerHeight, scrollHeight } = virtualScroll.value;
        const { scrollLeft } = virtualScrollX.value;
        const { headless, headerRowHeight } = props;

        // 这里不用virtualScroll 中的pageSize，因为我需要上一页的最后一条放在下一页的第一条
        const headerHeight = headless ? 0 : tableHeaders.value.length * (headerRowHeight || rowHeight);
        /** 表体的page */
        const bodyPageSize = Math.floor((containerHeight - headerHeight) / rowHeight);
        if (keyCode === ScrollCodes.ArrowUp) {
            scrollTo(scrollTop - rowHeight, null);
        } else if (keyCode === ScrollCodes.ArrowRight) {
            scrollTo(null, scrollLeft + 50);
        } else if (keyCode === ScrollCodes.ArrowDown) {
            scrollTo(scrollTop + rowHeight, null);
        } else if (keyCode === ScrollCodes.ArrowLeft) {
            scrollTo(null, scrollLeft - 50);
        } else if (keyCode === ScrollCodes.PageUp) {
            scrollTo(scrollTop - rowHeight * bodyPageSize + headerHeight, null);
        } else if (keyCode === ScrollCodes.PageDown) {
            scrollTo(scrollTop + rowHeight * bodyPageSize - headerHeight, null);
        } else if (keyCode === ScrollCodes.Home) {
            scrollTo(0, null);
        } else if (keyCode === ScrollCodes.End) {
            scrollTo(scrollHeight, null);
        }
    }

    function handleMouseEnter() {
        isMouseOver = true;
    }

    /**
     * 键盘可访问性判定：焦点是否落在表格容器内部（含容器自身）。
     * 通过 document.activeElement 即时读取，无需额外 focus 监听与状态维护，
     * 也不会在容器外元素聚焦时误吞按键。
     */
    function isTableEngaged(): boolean {
        if (isMouseOver) return true;
        const el = targetElement.value;
        if (!el) return false;
        const active = document.activeElement;
        return !!active && (active === el || el.contains(active));
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
