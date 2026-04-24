import { Ref, ShallowRef, computed, onBeforeUnmount, ref } from 'vue';
import { RowDragSelectionConfig, RowDragSelectionRange, RowKeyGen, UniqKey } from '../types';
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
    rowKeyGen: RowKeyGen,
    scrollTo: (top: number | null, left: number | null) => void,
    virtualScroll: Ref<VirtualScrollStore>,
) {
    const EDGE_ZONE = 40;
    const SCROLL_SPEED_MAX = 15;
    const POINT_EDGE_OFFSET = 2;

    const ROW_RANGE_SELECTED = 'row-range-selected';
    const ROW_RANGE_START = 'row-range-start';
    const ROW_RANGE_END = 'row-range-end';

    const selectionRanges = ref<RowDragSelectionRange[]>([]) as Ref<RowDragSelectionRange[]>;
    const selectionRange = ref<RowDragSelectionRange | null>(null) as Ref<RowDragSelectionRange | null>;
    const isSelecting = ref(false);
    let anchorRowIndex: number | null = null;
    let isAdditiveSelection = false;

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

    const displayRanges = computed(() => {
        const ranges = [...selectionRanges.value];
        if (selectionRange.value) {
            ranges.push(selectionRange.value);
        }
        return mergeRanges(ranges);
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

    function denormalizeRange(range: { minRow: number; maxRow: number }): RowDragSelectionRange {
        return {
            startRowIndex: range.minRow,
            endRowIndex: range.maxRow,
        };
    }

    function mergeRanges(ranges: RowDragSelectionRange[]) {
        if (!ranges.length) return [];
        const sortedRanges = ranges.map(normalizeRange).sort((a, b) => a.minRow - b.minRow);

        const merged = [sortedRanges[0]];
        for (let i = 1; i < sortedRanges.length; i++) {
            const current = sortedRanges[i];
            const last = merged[merged.length - 1];
            if (current.minRow <= last.maxRow + 1) {
                last.maxRow = Math.max(last.maxRow, current.maxRow);
            } else {
                merged.push({ ...current });
            }
        }
        return merged.map(denormalizeRange);
    }

    function getNormalizedRanges() {
        return mergeRanges(selectionRanges.value).map(normalizeRange);
    }

    function getPrimaryRange() {
        const ranges = mergeRanges(selectionRanges.value);
        return ranges.length === 1 ? ranges[0] : null;
    }

    function getSelectedRowsFromRanges(ranges: RowDragSelectionRange[]) {
        return mergeRanges(ranges).flatMap(range => {
            const { minRow, maxRow } = normalizeRange(range);
            return dataSourceCopy.value.slice(minRow, maxRow + 1);
        });
    }

    function buildRangesFromIndices(rowIndexList: number[]) {
        if (!rowIndexList.length) return [];
        const sortedRowIndexList = [...new Set(rowIndexList)].sort((a, b) => a - b);
        const ranges: RowDragSelectionRange[] = [];
        let start = sortedRowIndexList[0];
        let end = start;

        for (let i = 1; i < sortedRowIndexList.length; i++) {
            const current = sortedRowIndexList[i];
            if (current === end + 1) {
                end = current;
                continue;
            }
            ranges.push({ startRowIndex: start, endRowIndex: end });
            start = current;
            end = current;
        }
        ranges.push({ startRowIndex: start, endRowIndex: end });
        return ranges;
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

    function isRowIndexSelected(rowIndex: number): boolean {
        return getNormalizedRanges().some(({ minRow, maxRow }) => rowIndex >= minRow && rowIndex <= maxRow);
    }

    function removeRowIndexFromRanges(rowIndex: number) {
        const normalizedRanges = getNormalizedRanges();
        const newRanges: { minRow: number; maxRow: number }[] = [];
        for (const { minRow, maxRow } of normalizedRanges) {
            if (rowIndex < minRow || rowIndex > maxRow) {
                newRanges.push({ minRow, maxRow });
            } else if (rowIndex === minRow && rowIndex === maxRow) {
                // single-row range, remove entirely
            } else if (rowIndex === minRow) {
                newRanges.push({ minRow: minRow + 1, maxRow });
            } else if (rowIndex === maxRow) {
                newRanges.push({ minRow, maxRow: maxRow - 1 });
            } else {
                newRanges.push({ minRow, maxRow: rowIndex - 1 });
                newRanges.push({ minRow: rowIndex + 1, maxRow });
            }
        }
        selectionRanges.value = newRanges.map(denormalizeRange);
    }

    function onSelectionMouseDown(e: MouseEvent) {
        if (!config.value.enabled || e.button !== 0) return false;
        const rowIndex = getClosestTrIndex(e.target as HTMLElement);
        if (Number.isNaN(rowIndex) || rowIndex < 0) return false;

        isAdditiveSelection = e.ctrlKey || e.metaKey;

        // Ctrl+click on already-selected row: toggle off
        if (isAdditiveSelection && !e.shiftKey && isRowIndexSelected(rowIndex)) {
            removeRowIndexFromRanges(rowIndex);
            preventNextClick = true;
            emitSelectionChange();
            return true;
        }

        if (e.shiftKey && anchorRowIndex !== null) {
            selectionRange.value = {
                startRowIndex: anchorRowIndex,
                endRowIndex: rowIndex,
            };
        } else {
            anchorRowIndex = rowIndex;
            selectionRange.value = {
                startRowIndex: rowIndex,
                endRowIndex: rowIndex,
            };
        }

        if (!isAdditiveSelection) {
            selectionRanges.value = [];
        }

        preventNextClick = isAdditiveSelection || e.shiftKey;

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

        commitSelection();
        emitSelectionChange();
    }

    function commitSelection() {
        if (!selectionRange.value) return;
        selectionRanges.value = mergeRanges([...selectionRanges.value, selectionRange.value]);
        selectionRange.value = null;
    }

    function emitSelectionChange() {
        const ranges = mergeRanges(selectionRanges.value);
        const range = ranges.length === 1 ? ranges[0] : null;
        if (!ranges.length) {
            emits('row-drag-selection-change', null, { rows: [], ranges: [] });
            return;
        }
        emits('row-drag-selection-change', range, {
            rows: getSelectedRowsFromRanges(ranges),
            ranges,
        });
    }

    function getRowSelectionClasses(absoluteRowIndex: number): string[] {
        const ranges = displayRanges.value;
        for (let i = 0; i < ranges.length; i++) {
            const { minRow, maxRow } = normalizeRange(ranges[i]);
            if (absoluteRowIndex < minRow || absoluteRowIndex > maxRow) continue;
            const classes = [ROW_RANGE_SELECTED];
            if (absoluteRowIndex === minRow) classes.push(ROW_RANGE_START);
            if (absoluteRowIndex === maxRow) classes.push(ROW_RANGE_END);
            return classes;
        }
        return [];
    }

    function getSelectedRows() {
        const ranges = mergeRanges(selectionRanges.value);
        return {
            rows: getSelectedRowsFromRanges(ranges),
            range: getPrimaryRange(),
            ranges,
        };
    }

    function setSelectedRows(rowKeyOrRows?: (UniqKey | DT)[], option: { silent?: boolean } = {}) {
        if (!rowKeyOrRows?.length) {
            clearSelectedRows();
            if (!option.silent) {
                emits('row-drag-selection-change', null, { rows: [] });
            }
            return;
        }

        const rowIndexList = rowKeyOrRows
            .map(item => {
                if (typeof item === 'string' || typeof item === 'number') {
                    return dataSourceCopy.value.findIndex(row => rowKeyGen(row) === item);
                }
                return dataSourceCopy.value.indexOf(item as DT);
            })
            .filter(index => index >= 0);

        if (!rowIndexList.length) {
            console.warn('setSelectedRows failed.rows:', rowKeyOrRows);
            return;
        }

        selectionRanges.value = buildRangesFromIndices(rowIndexList);
        selectionRange.value = null;
        anchorRowIndex = rowIndexList[rowIndexList.length - 1] ?? null;
        isSelecting.value = false;
        hasDragged = false;
        preventNextClick = false;
        isAdditiveSelection = false;

        if (!option.silent) {
            emitSelectionChange();
        }
    }

    function clearSelectedRows() {
        selectionRanges.value = [];
        selectionRange.value = null;
        isSelecting.value = false;
        anchorRowIndex = null;
        hasDragged = false;
        preventNextClick = false;
        isAdditiveSelection = false;
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
        set: setSelectedRows,
        clear: clearSelectedRows,
        consumeClick,
    };
}

export const useRowDragSelectionName = 'useRowDragSelection';

(useRowDragSelection as any)[MY_FN_NAME] = useRowDragSelectionName;
