import { Ref, ShallowRef, computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { AreaSelectionRange, CellKeyGen, ColKeyGen, StkTableColumn, UniqKey } from '../types';
import { VirtualScrollStore, VirtualScrollXStore } from '../useVirtualScroll';
import { getClosestColKey, getClosestTrIndex } from '../utils';
import { getCalculatedColWidth } from '../utils/constRefUtils';

/**
 * 单元格拖拽选区
 * en: Cell drag selection
 */
export function useAreaSelection<DT extends Record<string, any>>(
    props: any,
    emits: any,
    tableContainerRef: Ref<HTMLDivElement | undefined>,
    dataSourceCopy: ShallowRef<DT[]>,
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>,
    colKeyGen: ColKeyGen,
    cellKeyGen: CellKeyGen,
    scrollTo: (top: number | null, left: number | null) => void,
    virtualScroll: Ref<VirtualScrollStore>,
    virtualScrollX: Ref<VirtualScrollXStore>,
) {
    /**
     * 自动滚动：鼠标距容器边缘多少px开始触发
     * en: Mouse distance from container edge to start auto scroll
     */
    const EDGE_ZONE = 40;
    /**
     * 自动滚动：每帧最大滚动像素
     * en: Maximum scroll pixels per frame
     */
    const SCROLL_SPEED_MAX = 15;

    const POINT_EDGE_OFFSET = 2;

    /** 当前选区范围 */
    const selectionRange = ref<AreaSelectionRange | null>(null) as Ref<AreaSelectionRange | null>;
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
        const headers = tableHeaderLast.value;
        const map = new Map<UniqKey, number>();
        for (let i = 0; i < headers.length; i++) {
            map.set(colKeyGen.value(headers[i]), i);
        }
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
                if (col) {
                    keys.add(cellKeyGen(row, col));
                }
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

    // 生命周期：在表格容器上注册 keydown
    onMounted(() => {
        addListener();
    });
    onBeforeUnmount(() => {
        removeListener();
    });

    function addListener() {
        removeListener();
        const el = tableContainerRef.value;
        if (el) {
            el.addEventListener('keydown', onKeydown);
        }
    }

    function removeListener() {
        const el = tableContainerRef.value;
        if (el) {
            el.removeEventListener('keydown', onKeydown);
        }
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
        stopAutoScroll();
    }

    /** 获取归一化（min/max）后的选区范围 */
    function normalizeRange(range: AreaSelectionRange) {
        const { startRowIndex, endRowIndex, startColIndex, endColIndex } = range;
        return {
            minRow: Math.min(startRowIndex, endRowIndex),
            maxRow: Math.max(startRowIndex, endRowIndex),
            minCol: Math.min(startColIndex, endColIndex),
            maxCol: Math.max(startColIndex, endColIndex),
        };
    }

    /** 根据colKey获取列的绝对索引 */
    function getColIndexByKey(colKey: string | undefined): number {
        if (!colKey) return -1;
        return colKeyToIndexMap.value.get(colKey) ?? -1;
    }

    /** mousedown 处理：设置锚点，开始拖选 */
    function onSelectionMouseDown(e: MouseEvent) {
        if (!props.areaSelection || e.button !== 0) return;

        const rowIndex = getClosestTrIndex(e.target as HTMLElement);
        const colKey = getClosestColKey(e.target as HTMLElement);
        const colIndex = getColIndexByKey(colKey);

        if (rowIndex < 0 || colIndex < 0) return;

        // Shift 扩选：从锚点到当前位置
        if (e.shiftKey && anchorCell) {
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
        if (!target) return;

        const rowIndex = getClosestTrIndex(target);
        if (Number.isNaN(rowIndex) || rowIndex < 0) return;

        const colKey = getClosestColKey(target);
        const colIndex = getColIndexByKey(colKey);
        if (colIndex < 0) return;

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
        const { top, bottom, left, right } = rect;

        const nearEdge =
            lastMouseClientY < top + EDGE_ZONE ||
            lastMouseClientY > bottom - EDGE_ZONE ||
            lastMouseClientX < left + EDGE_ZONE ||
            lastMouseClientX > right - EDGE_ZONE;

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
        const { top, bottom, left, right } = rect;
        let deltaX = 0;
        let deltaY = 0;

        // Y方向
        if (lastMouseClientY < top + EDGE_ZONE) {
            const dist = Math.max(0, top + EDGE_ZONE - lastMouseClientY);
            deltaY = -Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        } else if (lastMouseClientY > bottom - EDGE_ZONE) {
            const dist = Math.max(0, lastMouseClientY - (bottom - EDGE_ZONE));
            deltaY = Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        }

        // X方向
        if (lastMouseClientX < left + EDGE_ZONE) {
            const dist = Math.max(0, left + EDGE_ZONE - lastMouseClientX);
            deltaX = -Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        } else if (lastMouseClientX > right - EDGE_ZONE) {
            const dist = Math.max(0, lastMouseClientX - (right - EDGE_ZONE));
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
        const { top, bottom, left, right } = containerRect;

        const headerBottom = thead ? top + thead.offsetHeight : top;

        const x = Math.max(left + POINT_EDGE_OFFSET, Math.min(lastMouseClientX, right - POINT_EDGE_OFFSET));
        const y = Math.max(headerBottom + POINT_EDGE_OFFSET, Math.min(lastMouseClientY, bottom - POINT_EDGE_OFFSET));

        const el = document.elementFromPoint(x, y);
        if (!el) return;

        const td = (el as HTMLElement).closest?.('td');
        const tr = (el as HTMLElement).closest?.('tr');
        if (!td || !tr) return;

        const rowIndex = getClosestTrIndex(tr);
        const colKey = getClosestColKey(td);
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

    /** 发出 area-selection-change 事件 */
    function emitSelectionChange() {
        const range = selectionRange.value;
        if (!range) {
            emits('area-selection-change', null, { rows: [], cols: [] });
            return;
        }
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        const data = dataSourceCopy.value;
        const cols = tableHeaderLast.value;
        const rows = data.slice(minRow, maxRow + 1);
        const selectedCols = cols.slice(minCol, maxCol + 1);
        emits('area-selection-change', range, { rows, cols: selectedCols });
    }

    /** 获取 areaSelection 配置中的格式化回调 */
    function getFormatCellFn() {
        const cfg = props.areaSelection;
        return cfg && typeof cfg === 'object' && typeof cfg.formatCellForClipboard === 'function' ? cfg.formatCellForClipboard : null;
    }

    /** 是否启用键盘控制选区移动 */
    const keyboardEnabled = computed(() => {
        const cfg = props.areaSelection;
        return cfg && typeof cfg === 'object' && cfg.keyboard === true;
    });

    /**
     * 复制选区内容到剪贴板
     * @returns 复制的文本内容
     */
    function copySelectedArea(): string {
        if (!selectionRange.value) return '';

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
                cells.push(formatCell ? formatCell(row, col, rawValue) : !rawValue ? '' : String(rawValue));
            }
            lines.push(cells.join('\t'));
        }
        const text = lines.join('\n');

        navigator.clipboard.writeText(text).catch(() => {
            console.warn('Failed to copy to clipboard');
        });

        return text;
    }

    /**
     * Ctrl+C / Cmd+C 复制选区内容
     * Esc 取消选区
     * Arrow keys / Tab 移动选区（keyboard=true时）
     **/
    function onKeydown(e: KeyboardEvent) {
        if (!props.areaSelection) return;

        const key = e.key;

        // Esc 键：取消当前选区
        if (key === 'Escape' || key === 'Esc') {
            if (selectionRange.value) {
                clearSelectedArea();
                emitSelectionChange();
                e.preventDefault();
            }
            return;
        }

        // Ctrl/Cmd+C 复制选区
        if ((e.ctrlKey || e.metaKey) && key === 'c' && selectionRange.value) {
            copySelectedArea();
            e.preventDefault();
            return;
        }

        // 键盘导航（需要启用 keyboard 选项）
        if (!keyboardEnabled.value) return;

        const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key);
        const isTabKey = key === 'Tab';
        const isNavigationKey = isArrowKey || isTabKey;

        if (!isNavigationKey) return;

        e.preventDefault();

        const rowCount = dataSourceCopy.value.length;
        const colCount = tableHeaderLast.value.length;
        if (rowCount === 0 || colCount === 0) return;

        // 如果没有选区，默认从第一个单元格开始
        if (!selectionRange.value) {
            anchorCell = { rowIndex: 0, colIndex: 0 };
            selectionRange.value = {
                startRowIndex: 0,
                startColIndex: 0,
                endRowIndex: 0,
                endColIndex: 0,
            };
            emitSelectionChange();
            scrollToCell(0, 0);
            return;
        }

        // 计算移动方向
        let rowDelta = 0;
        let colDelta = 0;

        if (key === 'ArrowUp') {
            rowDelta = -1;
        } else if (key === 'ArrowDown') {
            rowDelta = 1;
        } else if (key === 'ArrowLeft') {
            colDelta = -1;
        } else if (key === 'ArrowRight') {
            colDelta = 1;
        } else if (key === 'Tab') {
            // Tab: 向右移动；Shift+Tab: 向左移动
            colDelta = e.shiftKey ? -1 : 1;
        }

        // Shift 扩展选区，否则移动单格选区
        if (e.shiftKey && isArrowKey) {
            // 扩展选区：更新 endRow/endCol
            const range = selectionRange.value;
            let newEndRow = range.endRowIndex + rowDelta;
            let newEndCol = range.endColIndex + colDelta;

            // 边界检查
            newEndRow = Math.max(0, Math.min(newEndRow, rowCount - 1));
            newEndCol = Math.max(0, Math.min(newEndCol, colCount - 1));

            selectionRange.value = {
                ...range,
                endRowIndex: newEndRow,
                endColIndex: newEndCol,
            };

            scrollToCell(newEndRow, newEndCol);
        } else {
            // 移动单格选区
            // 取当前 end 位置作为基础（这样多次移动时，方向一致）
            const range = selectionRange.value;
            const { minRow, minCol } = normalizeRange(range);
            let newRow = minRow + rowDelta;
            let newCol = minCol + colDelta;

            // 边界检查（先检查，避免越界）
            newRow = Math.max(0, Math.min(newRow, rowCount - 1));
            newCol = Math.max(0, Math.min(newCol, colCount - 1));

            // Tab 换行逻辑：如果到达行尾/行首，换行
            if (isTabKey) {
                // 计算原始未 clamp 的值
                const rawCol = minCol + colDelta;
                if (rawCol >= colCount) {
                    newCol = 0;
                    newRow = Math.min(minRow + 1, rowCount - 1);
                } else if (rawCol < 0) {
                    newCol = colCount - 1;
                    newRow = Math.max(minRow - 1, 0);
                }
            }

            // 更新锚点和选区
            anchorCell = { rowIndex: newRow, colIndex: newCol };
            selectionRange.value = {
                startRowIndex: newRow,
                startColIndex: newCol,
                endRowIndex: newRow,
                endColIndex: newCol,
            };

            scrollToCell(newRow, newCol);
        }

        emitSelectionChange();
    }

    /**
     * 滚动到指定单元格，确保其在可视区域内
     */
    function scrollToCell(rowIndex: number, colIndex: number) {
        const container = tableContainerRef.value;
        if (!container) return;

        const row = dataSourceCopy.value[rowIndex];
        const col = tableHeaderLast.value[colIndex];
        if (!row || !col) return;

        // 获取表头高度
        const thead = container.querySelector('thead');
        const headerHeight = thead ? thead.offsetHeight : 0;

        const vs = virtualScroll.value;
        const vsx = virtualScrollX.value;

        // 计算目标行的位置（基于虚拟滚动数据）
        const rowHeight = vs.rowHeight;
        const targetRowTop = rowIndex * rowHeight;
        const targetRowBottom = targetRowTop + rowHeight;

        // 计算可视区域
        const visibleTop = container.scrollTop;
        const visibleBottom = visibleTop + vs.containerHeight - headerHeight;

        // 计算需要的垂直滚动位置
        let newScrollTop: number | null = null;
        if (targetRowTop < visibleTop) {
            // 目标行在可视区域上方，滚动到使目标行位于顶部
            newScrollTop = targetRowTop;
        } else if (targetRowBottom > visibleBottom) {
            // 目标行在可视区域下方，滚动到使目标行位于底部
            newScrollTop = targetRowBottom - (vs.containerHeight - headerHeight);
        }

        // 计算目标列的位置
        let targetColLeft = 0;
        let targetColWidth = 0;
        const cols = tableHeaderLast.value;
        for (let i = 0; i < cols.length; i++) {
            const colWidth = getCalculatedColWidth(cols[i]) || 100; // 默认100px
            if (i < colIndex) {
                targetColLeft += colWidth;
            } else if (i === colIndex) {
                targetColWidth = colWidth;
                break;
            }
        }
        const targetColRight = targetColLeft + targetColWidth;

        // 计算可视区域（水平）
        const visibleLeft = container.scrollLeft;
        const visibleRight = visibleLeft + vsx.containerWidth;

        // 计算需要的水平滚动位置
        let newScrollLeft: number | null = null;
        if (targetColLeft < visibleLeft) {
            // 目标列在可视区域左侧
            newScrollLeft = targetColLeft;
        } else if (targetColRight > visibleRight) {
            // 目标列在可视区域右侧
            newScrollLeft = targetColRight - vsx.containerWidth;
        }

        // 执行滚动
        if (newScrollTop !== null || newScrollLeft !== null) {
            scrollTo(newScrollTop, newScrollLeft);
        }
    }

    /**
     * 判断一个单元格的选区 class
     * @param cellKey 单元格唯一键
     * @param absoluteRowIndex 行在 dataSourceCopy 中的绝对索引
     * @param colKey 列唯一键
     */
    function getAreaSelectionClasses(cellKey: string, absoluteRowIndex: number, colKey: UniqKey): string[] {
        const nr = normalizedRange.value;
        if (!nr || !selectedCellKeys.value.has(cellKey)) return [];

        const colIndex = colKeyToIndexMap.value.get(colKey);
        if (colIndex === void 0 || colIndex < 0) return [];

        const classes: string[] = ['cell-range-selected'];
        if (absoluteRowIndex === nr.minRow) classes.push('cell-range-t');
        if (absoluteRowIndex === nr.maxRow) classes.push('cell-range-b');
        if (colIndex === nr.minCol) classes.push('cell-range-l');
        if (colIndex === nr.maxCol) classes.push('cell-range-r');
        return classes;
    }

    // 暴露方法

    /** 获取选中的单元格信息 */
    function getSelectedArea() {
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
    function clearSelectedArea() {
        selectionRange.value = null;
        isSelecting.value = false;
    }

    return {
        isSelecting,
        getClass: getAreaSelectionClasses,
        get: getSelectedArea,
        clear: clearSelectedArea,
        copy: copySelectedArea,
        onMD: onSelectionMouseDown,
    };
}
