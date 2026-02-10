import { Ref, ShallowRef, computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { CellSelectionRange, CellKeyGen, ColKeyGen, RowKeyGen, StkTableColumn, UniqKey } from './types';
import { getClosestColKey, getClosestTrIndex } from './utils';

type Params<DT extends Record<string, any>> = {
    props: any;
    emits: any;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
    dataSourceCopy: ShallowRef<DT[]>;
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>;
    rowKeyGen: RowKeyGen;
    colKeyGen: ColKeyGen;
    cellKeyGen: CellKeyGen;
};

/** 获取归一化（min/max）后的选区范围 */
function normalizeRange(range: CellSelectionRange) {
    return {
        minRow: Math.min(range.startRowIndex, range.endRowIndex),
        maxRow: Math.max(range.startRowIndex, range.endRowIndex),
        minCol: Math.min(range.startColIndex, range.endColIndex),
        maxCol: Math.max(range.startColIndex, range.endColIndex),
    };
}

/** 自动滚动：鼠标距容器边缘多少px开始触发 */
const EDGE_ZONE = 40;
/** 自动滚动：每帧最大滚动像素 */
const SCROLL_SPEED_MAX = 15;

/**
 * 单元格拖拽选区
 */
export function useCellSelection<DT extends Record<string, any>>({
    props,
    emits,
    tableContainerRef,
    dataSourceCopy,
    tableHeaderLast,
    // rowKeyGen,
    colKeyGen,
    cellKeyGen,
}: Params<DT>) {
    /** 当前选区范围 */
    const selectionRange = ref<CellSelectionRange | null>(null) as Ref<CellSelectionRange | null>;
    /** 是否正在拖选 */
    const isSelecting = ref(false);
    /** 锚点（拖选起点 / Shift扩选起点） */
    let anchorCell: { rowIndex: number; colIndex: number } | null = null;

    /** 自动滚动 rAF id */
    let autoScrollRafId = 0;
    /** 最后一次鼠标位置（用于边界自动滚动计算） */
    let lastMouseClientX = 0;
    let lastMouseClientY = 0;

    /** colKey → absolute index 映射 */
    const colKeyToIndexMap = computed(() => {
        const map = new Map<UniqKey, number>();
        tableHeaderLast.value.forEach((col, i) => {
            map.set(colKeyGen.value(col), i);
        });
        return map;
    });

    /** 根据 selectionRange 计算选区内所有 cellKey 的集合 */
    const selectedCellKeys = computed<Set<string>>(() => {
        const range = selectionRange.value;
        if (!range) return new Set();
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        const keys = new Set<string>();
        const cols = tableHeaderLast.value;
        const data = dataSourceCopy.value;
        for (let r = minRow; r <= maxRow; r++) {
            const row = data[r];
            if (!row) continue;
            for (let c = minCol; c <= maxCol; c++) {
                const col = cols[c];
                if (!col) continue;
                keys.add(cellKeyGen(row, col));
            }
        }
        return keys;
    });

    /** 获取归一化的选区信息，用于样式判断 */
    const normalizedRange = computed(() => {
        const range = selectionRange.value;
        if (!range) return null;
        return normalizeRange(range);
    });

    /** 根据colKey获取列的绝对索引 */
    function getColIndexByKey(colKey: string | undefined): number {
        if (!colKey) return -1;
        return colKeyToIndexMap.value.get(colKey) ?? -1;
    }

    /** mousedown 处理：设置锚点，开始拖选 */
    function onSelectionMouseDown(e: MouseEvent) {
        console.log('🚀 ~ onKeydown ~ props.cellSelection:', props.cellSelection);

        if (!props.cellSelection) return;
        // 仅响应左键
        if (e.button !== 0) return;

        const rowIndex = getClosestTrIndex(e);
        const colKey = getClosestColKey(e);
        const colIndex = getColIndexByKey(colKey);
        if (rowIndex < 0 || colIndex < 0) return;

        if (e.shiftKey && anchorCell) {
            // Shift 扩选：从锚点到当前位置
            selectionRange.value = {
                startRowIndex: anchorCell.rowIndex,
                startColIndex: anchorCell.colIndex,
                endRowIndex: rowIndex,
                endColIndex: colIndex,
            };
        } else {
            // 普通点击：新建锚点，单格选区
            anchorCell = { rowIndex, colIndex };
            selectionRange.value = {
                startRowIndex: rowIndex,
                startColIndex: colIndex,
                endRowIndex: rowIndex,
                endColIndex: colIndex,
            };
        }

        isSelecting.value = true;
        lastMouseClientX = e.clientX;
        lastMouseClientY = e.clientY;

        // 防止拖选时选中文字
        document.addEventListener('mousemove', onDocumentMouseMove);
        document.addEventListener('mouseup', onDocumentMouseUp);
    }

    /** document mousemove 处理：更新选区终点 + 检测边界自动滚动 */
    function onDocumentMouseMove(e: MouseEvent) {
        if (!isSelecting.value) return;

        lastMouseClientX = e.clientX;
        lastMouseClientY = e.clientY;

        // 尝试从当前鼠标位置更新选区
        updateSelectionFromEvent(e);

        // 检测是否需要边界自动滚动
        checkAutoScroll();
    }

    /** 从 MouseEvent 目标元素更新选区 */
    function updateSelectionFromEvent(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const td = target?.closest?.('td');
        const tr = target?.closest?.('tr');
        if (!td || !tr) return;

        const rowIndex = Number(tr.dataset.rowI);
        const colKey = td.dataset.colKey;
        const colIndex = getColIndexByKey(colKey);
        if (Number.isNaN(rowIndex) || rowIndex < 0 || colIndex < 0) return;

        updateSelectionEnd(rowIndex, colIndex);
    }

    /** 更新选区的终点 */
    function updateSelectionEnd(endRowIndex: number, endColIndex: number) {
        if (!anchorCell) return;
        selectionRange.value = {
            startRowIndex: anchorCell.rowIndex,
            startColIndex: anchorCell.colIndex,
            endRowIndex,
            endColIndex,
        };
    }

    // ---- 边界自动滚动 ----

    /** 检查鼠标是否在容器边缘附近，启动或停止自动滚动 */
    function checkAutoScroll() {
        const container = tableContainerRef.value;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const nearEdge =
            lastMouseClientY < rect.top + EDGE_ZONE ||
            lastMouseClientY > rect.bottom - EDGE_ZONE ||
            lastMouseClientX < rect.left + EDGE_ZONE ||
            lastMouseClientX > rect.right - EDGE_ZONE;

        if (nearEdge && !autoScrollRafId) {
            autoScrollLoop();
        } else if (!nearEdge && autoScrollRafId) {
            stopAutoScroll();
        }
    }

    /** rAF 循环：边界自动滚动 + 更新选区 */
    function autoScrollLoop() {
        const container = tableContainerRef.value;
        if (!container || !isSelecting.value) {
            stopAutoScroll();
            return;
        }

        const rect = container.getBoundingClientRect();
        let deltaX = 0;
        let deltaY = 0;

        // Y方向
        if (lastMouseClientY < rect.top + EDGE_ZONE) {
            const dist = Math.max(0, rect.top + EDGE_ZONE - lastMouseClientY);
            deltaY = -Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        } else if (lastMouseClientY > rect.bottom - EDGE_ZONE) {
            const dist = Math.max(0, lastMouseClientY - (rect.bottom - EDGE_ZONE));
            deltaY = Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        }

        // X方向
        if (lastMouseClientX < rect.left + EDGE_ZONE) {
            const dist = Math.max(0, rect.left + EDGE_ZONE - lastMouseClientX);
            deltaX = -Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        } else if (lastMouseClientX > rect.right - EDGE_ZONE) {
            const dist = Math.max(0, lastMouseClientX - (rect.right - EDGE_ZONE));
            deltaX = Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        }

        if (deltaX !== 0 || deltaY !== 0) {
            container.scrollTop += deltaY;
            container.scrollLeft += deltaX;

            // 滚动后，在容器内边缘处用 elementFromPoint 找到当前单元格更新选区
            updateSelectionFromPoint(container, rect);
        }

        // 如果还在拖选且仍需滚动，继续循环
        if (isSelecting.value && (deltaX !== 0 || deltaY !== 0)) {
            autoScrollRafId = requestAnimationFrame(autoScrollLoop);
        } else {
            autoScrollRafId = 0;
        }
    }

    /** 将鼠标位置钳制到容器内部，用 elementFromPoint 找到边缘单元格并更新选区 */
    function updateSelectionFromPoint(container: HTMLElement, containerRect: DOMRect) {
        // 获取表头高度，钳制 Y 时跳过表头区域
        const thead = container.querySelector('thead');
        const headerBottom = thead ? containerRect.top + thead.offsetHeight : containerRect.top;

        const x = Math.max(containerRect.left + 2, Math.min(lastMouseClientX, containerRect.right - 2));
        const y = Math.max(headerBottom + 2, Math.min(lastMouseClientY, containerRect.bottom - 2));

        const el = document.elementFromPoint(x, y);
        if (!el) return;

        const td = (el as HTMLElement).closest?.('td');
        const tr = (el as HTMLElement).closest?.('tr');
        if (!td || !tr) return;

        const rowIndex = Number(tr.dataset.rowI);
        const colKey = td.dataset.colKey;
        const colIndex = getColIndexByKey(colKey);
        if (Number.isNaN(rowIndex) || rowIndex < 0 || colIndex < 0) return;

        updateSelectionEnd(rowIndex, colIndex);
    }

    /** 停止自动滚动 */
    function stopAutoScroll() {
        if (autoScrollRafId) {
            cancelAnimationFrame(autoScrollRafId);
            autoScrollRafId = 0;
        }
    }

    /** document mouseup 处理：结束拖选 */
    function onDocumentMouseUp() {
        if (!isSelecting.value) return;
        isSelecting.value = false;
        stopAutoScroll();

        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);

        // 发出事件
        emitSelectionChange();
    }

    /** 发出 cell-selection-change 事件 */
    function emitSelectionChange() {
        const range = selectionRange.value;
        if (!range) {
            emits('cell-selection-change', null, { rows: [], cols: [] });
            return;
        }
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        const data = dataSourceCopy.value;
        const cols = tableHeaderLast.value;
        const rows = data.slice(minRow, maxRow + 1);
        const selectedCols = cols.slice(minCol, maxCol + 1);
        emits('cell-selection-change', range, { rows, cols: selectedCols });
    }

    /** 获取 cellSelection 配置中的格式化回调 */
    function getFormatCellFn() {
        const cfg = props.cellSelection;
        if (cfg && typeof cfg === 'object' && typeof cfg.formatCellForClipboard === 'function') {
            return cfg.formatCellForClipboard;
        }
        return null;
    }

    /**
     * Ctrl+C / Cmd+C 复制选区内容
     * Esc 取消选区
     **/
    function onKeydown(e: KeyboardEvent) {
        if (!props.cellSelection) return;
        if (!selectionRange.value) return;
        // Esc 键：取消当前选区
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (selectionRange.value) {
                clearSelection();
                emitSelectionChange();
                e.preventDefault();
            }
            return;
        }

        // Ctrl/Cmd+C 复制选区
        if (!((e.ctrlKey || e.metaKey) && e.key === 'c')) return;

        const range = selectionRange.value;
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        const data = dataSourceCopy.value;
        const cols = tableHeaderLast.value;
        const formatCell = getFormatCellFn();

        const lines: string[] = [];
        for (let r = minRow; r <= maxRow; r++) {
            const row = data[r];
            if (!row) continue;
            const cells: string[] = [];
            for (let c = minCol; c <= maxCol; c++) {
                const col = cols[c];
                if (!col) {
                    cells.push('');
                    continue;
                }
                const rawValue = row[col.dataIndex];
                if (formatCell) {
                    cells.push(formatCell(row, col, rawValue));
                } else {
                    cells.push(!rawValue ? '' : String(rawValue));
                }
            }
            lines.push(cells.join('\t'));
        }
        const text = lines.join('\n');

        navigator.clipboard.writeText(text).catch(() => {
            console.warn('Failed to copy to clipboard');
        });

        e.preventDefault();
    }

    /**
     * 判断一个单元格的选区 class
     * @param cellKey 单元格唯一键
     * @param absoluteRowIndex 行在 dataSourceCopy 中的绝对索引
     * @param colKey 列唯一键
     */
    function getCellSelectionClasses(cellKey: string, absoluteRowIndex: number, colKey: UniqKey): string[] {
        const nr = normalizedRange.value;
        if (!nr) return [];
        if (!selectedCellKeys.value.has(cellKey)) return [];

        const colIndex = colKeyToIndexMap.value.get(colKey) ?? -1;
        if (colIndex < 0) return [];

        const classes: string[] = ['cell-range-selected'];
        if (absoluteRowIndex === nr.minRow) classes.push('cell-range-top');
        if (absoluteRowIndex === nr.maxRow) classes.push('cell-range-bottom');
        if (colIndex === nr.minCol) classes.push('cell-range-left');
        if (colIndex === nr.maxCol) classes.push('cell-range-right');
        return classes;
    }

    // 暴露方法

    /** 获取选中的单元格信息 */
    function getSelectedCells() {
        const range = selectionRange.value;
        if (!range) return { rows: [] as DT[], cols: [] as StkTableColumn<DT>[], range: null };
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        const data = dataSourceCopy.value;
        const cols = tableHeaderLast.value;
        return {
            rows: data.slice(minRow, maxRow + 1),
            cols: cols.slice(minCol, maxCol + 1),
            range: { ...range },
        };
    }

    /** 清空选区 */
    function clearSelection() {
        selectionRange.value = null;
        isSelecting.value = false;
    }

    // 生命周期：在表格容器上注册 keydown
    onMounted(() => {
        const el = tableContainerRef.value;
        if (el) {
            el.addEventListener('keydown', onKeydown);
        }
    });
    onBeforeUnmount(() => {
        const el = tableContainerRef.value;
        if (el) {
            el.removeEventListener('keydown', onKeydown);
        }
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
        stopAutoScroll();
    });

    return {
        selectionRange,
        isSelecting,
        selectedCellKeys,
        normalizedRange,
        onSelectionMouseDown,
        getCellSelectionClasses,
        getSelectedCells,
        clearSelection,
    };
}
