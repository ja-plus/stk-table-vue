import { Ref, ShallowRef, computed, onBeforeUnmount, ref } from 'vue';
import { RowDragSelectionConfig, RowDragSelectionRange } from '../types';
import { VirtualScrollStore } from '../useVirtualScroll';
import { getClosestTrIndex } from '../utils';
import { MY_FN_NAME } from './const';

/**
 * 行拖拽选择功能
 * 支持鼠标拖拽选择多行、边缘自动滚动。
 * en: Row drag selection feature with mouse drag and edge auto-scroll.
 */
export function useRowDragSelection<DT extends Record<string, any>>(
    props: any,
    emits: any,
    tableContainerRef: Ref<HTMLDivElement | undefined>,
    dataSourceCopy: ShallowRef<DT[]>,
    scrollTo: (top: number | null, left: number | null) => void,
    virtualScroll: Ref<VirtualScrollStore>,
) {
    const EDGE_ZONE = 40;
    const SCROLL_SPEED_MAX = 15;
    const POINT_EDGE_OFFSET = 2;

    const ROW_RANGE_SELECTED = 'row-range-selected';
    const ROW_RANGE_START = 'row-range-start';
    const ROW_RANGE_END = 'row-range-end';

    const selectionRange = ref<RowDragSelectionRange | null>(null) as Ref<RowDragSelectionRange | null>;
    const isSelecting = ref(false);
    let anchorRowIndex: number | null = null;

    let autoScrollRafId = 0;
    let lastMouseClientX = 0;
    let lastMouseClientY = 0;
    let hasDragged = false;
    let preventNextClick = false;

    const config = computed<RowDragSelectionConfig>(() => {
        if (typeof props.rowDragSelection === 'boolean') {
            return { enabled: props.rowDragSelection };
        }
        return { enabled: true, ...props.rowDragSelection };
    });

    const normalizedRange = computed(() => {
        const range = selectionRange.value;
        if (!range) return null;
        return normalizeRange(range);
    });

    onBeforeUnmount(() => {
        removeListener();
    });

    function removeListener() {
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
        stopAutoScroll();
    }

    function normalizeRange(range: RowDragSelectionRange) {
        return {
            minRow: Math.min(range.startRowIndex, range.endRowIndex),
            maxRow: Math.max(range.startRowIndex, range.endRowIndex),
        };
    }

    function calculateAutoScrollDelta(mouseY: number, rect: DOMRect) {
        const { top, bottom } = rect;
        if (mouseY < top + EDGE_ZONE) {
            const dist = Math.max(0, top + EDGE_ZONE - mouseY);
            return -Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        }
        if (mouseY > bottom - EDGE_ZONE) {
            const dist = Math.max(0, mouseY - (bottom - EDGE_ZONE));
            return Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        }
        return 0;
    }

    function onSelectionMouseDown(e: MouseEvent) {
        if (!config.value.enabled || e.button !== 0) return false;
        const rowIndex = getClosestTrIndex(e.target as HTMLElement);
        if (Number.isNaN(rowIndex) || rowIndex < 0) return false;

        if (e.shiftKey && anchorRowIndex !== null) {
            selectionRange.value = {
                startRowIndex: anchorRowIndex,
                endRowIndex: rowIndex,
            };
            preventNextClick = true;
        } else {
            anchorRowIndex = rowIndex;
            selectionRange.value = {
                startRowIndex: rowIndex,
                endRowIndex: rowIndex,
            };
        }

        isSelecting.value = true;
        hasDragged = false;
        lastMouseClientX = e.clientX;
        lastMouseClientY = e.clientY;

        document.addEventListener('mousemove', onDocumentMouseMove);
        document.addEventListener('mouseup', onDocumentMouseUp);
        return true;
    }

    function onDocumentMouseMove(e: MouseEvent) {
        if (!isSelecting.value) return;

        lastMouseClientX = e.clientX;
        lastMouseClientY = e.clientY;

        updateSelectionFromEvent(e);
        checkAutoScroll();
    }

    function updateSelectionFromEvent(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target) return;
        const rowIndex = getClosestTrIndex(target);
        if (Number.isNaN(rowIndex) || rowIndex < 0) return;
        updateSelectionEnd(rowIndex);
    }

    function updateSelectionEnd(endRowIndex: number) {
        if (anchorRowIndex === null) return;
        if (endRowIndex !== anchorRowIndex) {
            hasDragged = true;
        }
        selectionRange.value = {
            startRowIndex: anchorRowIndex,
            endRowIndex,
        };
    }

    function checkAutoScroll() {
        const container = tableContainerRef.value;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const nearEdge = lastMouseClientY < rect.top + EDGE_ZONE || lastMouseClientY > rect.bottom - EDGE_ZONE;

        if (nearEdge && !autoScrollRafId) {
            autoScrollLoop();
        } else if (!nearEdge && autoScrollRafId) {
            stopAutoScroll();
        }
    }

    function autoScrollLoop() {
        const container = tableContainerRef.value;
        if (!container || !isSelecting.value) {
            stopAutoScroll();
            return;
        }

        const rect = container.getBoundingClientRect();
        const deltaY = calculateAutoScrollDelta(lastMouseClientY, rect);

        if (deltaY !== 0) {
            const currentScrollTop = props.experimental?.scrollY ? virtualScroll.value.scrollTop : container.scrollTop;
            scrollTo(currentScrollTop + deltaY, null);
            updateSelectionFromPoint(container, rect);
        }

        if (isSelecting.value && deltaY !== 0) {
            autoScrollRafId = requestAnimationFrame(autoScrollLoop);
        } else {
            autoScrollRafId = 0;
        }
    }

    function updateSelectionFromPoint(container: HTMLElement, containerRect: DOMRect) {
        const thead = container.querySelector('thead');
        const { top, bottom, left, right } = containerRect;
        const headerBottom = thead ? top + thead.offsetHeight : top;

        const x = Math.max(left + POINT_EDGE_OFFSET, Math.min(lastMouseClientX, right - POINT_EDGE_OFFSET));
        const y = Math.max(headerBottom + POINT_EDGE_OFFSET, Math.min(lastMouseClientY, bottom - POINT_EDGE_OFFSET));

        const el = document.elementFromPoint(x, y);
        if (!el) return;

        const tr = (el as HTMLElement).closest?.('tr');
        if (!tr) return;

        const rowIndex = getClosestTrIndex(tr);
        if (Number.isNaN(rowIndex) || rowIndex < 0) return;

        updateSelectionEnd(rowIndex);
    }

    function stopAutoScroll() {
        if (autoScrollRafId) {
            cancelAnimationFrame(autoScrollRafId);
            autoScrollRafId = 0;
        }
    }

    function onDocumentMouseUp() {
        if (!isSelecting.value) return;

        isSelecting.value = false;
        stopAutoScroll();

        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);

        if (hasDragged) {
            preventNextClick = true;
        }

        emitSelectionChange();
    }

    function emitSelectionChange() {
        const range = selectionRange.value;
        if (!range) {
            emits('row-drag-selection-change', null, { rows: [] });
            return;
        }
        const { minRow, maxRow } = normalizeRange(range);
        emits('row-drag-selection-change', range, {
            rows: dataSourceCopy.value.slice(minRow, maxRow + 1),
        });
    }

    function getRowSelectionClasses(absoluteRowIndex: number): string[] {
        const range = normalizedRange.value;
        if (!range || absoluteRowIndex < range.minRow || absoluteRowIndex > range.maxRow) return [];

        const classes = [ROW_RANGE_SELECTED];
        if (absoluteRowIndex === range.minRow) classes.push(ROW_RANGE_START);
        if (absoluteRowIndex === range.maxRow) classes.push(ROW_RANGE_END);
        return classes;
    }

    function getSelectedRows() {
        const range = selectionRange.value;
        if (!range) return { rows: [] as DT[], range: null };

        const { minRow, maxRow } = normalizeRange(range);
        return {
            rows: dataSourceCopy.value.slice(minRow, maxRow + 1),
            range: { ...range },
        };
    }

    function clearSelectedRows() {
        selectionRange.value = null;
        isSelecting.value = false;
        anchorRowIndex = null;
        hasDragged = false;
        preventNextClick = false;
    }

    function consumeClick() {
        const result = preventNextClick;
        preventNextClick = false;
        return result;
    }

    return {
        config,
        isSelecting,
        onMD: onSelectionMouseDown,
        getClass: getRowSelectionClasses,
        get: getSelectedRows,
        clear: clearSelectedRows,
        consumeClick,
    };
}

export const useRowDragSelectionName = 'useRowDragSelection';

(useRowDragSelection as any)[MY_FN_NAME] = useRowDragSelectionName;
