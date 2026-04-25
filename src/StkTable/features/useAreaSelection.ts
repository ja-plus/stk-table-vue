import { Ref, ShallowRef, computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { AreaSelectionConfig, AreaSelectionRange, CellKeyGen, ColKeyGen, StkTableColumn, UniqKey } from '../types';
import { VirtualScrollStore, VirtualScrollXStore } from '../useVirtualScroll';
import { getClosestColKey, getClosestTrIndex } from '../utils';
import { getCalculatedColWidth } from '../utils/constRefUtils';
import { MY_FN_NAME } from './const';

/**
 * 单元格区域选择功能
 * 支持鼠标拖拽选择、键盘导航、复制粘贴等功能
 * en: Cell area selection feature with mouse drag, keyboard navigation, copy-paste, etc.
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

    const KEY_ARROW_UP = 'ArrowUp';
    const KEY_ARROW_DOWN = 'ArrowDown';
    const KEY_ARROW_LEFT = 'ArrowLeft';
    const KEY_ARROW_RIGHT = 'ArrowRight';
    const KEY_TAB = 'Tab';
    const KEY_ESCAPE = 'Escape';
    const KEY_ESC = 'Esc';
    const KEY_C = 'c';

    // CSS
    const CELL_RANGE_SELECTED = 'cell-range-selected';
    const CELL_RANGE_TOP = 'cell-range-t';
    const CELL_RANGE_BOTTOM = 'cell-range-b';
    const CELL_RANGE_LEFT = 'cell-range-l';
    const CELL_RANGE_RIGHT = 'cell-range-r';

    const selectionRanges = ref<AreaSelectionRange[]>([]);
    const isSelecting = ref(false);
    /** start cell */
    let anchorCell: { rowIndex: number; colIndex: number } | null = null;

    /** auto scroll rAF id */
    let autoScrollRafId = 0;
    /**
     * 最后一次鼠标位置（用于边界自动滚动计算）
     * en: Last mouse position (for boundary auto scroll calculation)
     */
    let lastMouseClientX = 0;
    let lastMouseClientY = 0;

    const config = computed<AreaSelectionConfig>(() => {
        if (typeof props.areaSelection === 'boolean') {
            const b = props.areaSelection;
            return { enabled: b, keyboard: b, ctrl: b, shift: b };
        }
        return { enabled: true, ctrl: true, shift: true, ...props.areaSelection };
    });

    /** 是否启用键盘控制选区移动 */
    const keyboardEnabled = computed(() => config.value.keyboard);

    /** 是否启用 Ctrl 多选 */
    const ctrlEnabled = computed(() => config.value.ctrl);

    /** 是否启用 Shift 扩选 */
    const shiftEnabled = computed(() => config.value.shift);

    /** 是否启用单元格高亮 */
    const highlightCellEnabled = computed(() => config.value.highlight?.cell);

    /** 是否启用行高亮 */
    const highlightRowEnabled = computed(() => config.value.highlight?.row);

    /** colKey → absolute index 映射 */
    const colKeyToIndexMap = computed(() => {
        const headers = tableHeaderLast.value;
        const map = new Map<UniqKey, number>();
        for (let i = 0; i < headers.length; i++) {
            map.set(colKeyGen.value(headers[i]), i);
        }
        return map;
    });

    /**
     * 获取固定列宽度的函数
     * 缓存每个固定列位置的累计宽度，查询时直接返回
     * @param colIndex 目标列索引
     * @returns [leftFixedWidth, rightFixedWidth]
     */
    const getFixedColWidths = computed(() => {
        const cols = tableHeaderLast.value;
        type FixedColWidth = { i: number; /** accumulated width */ w: number };
        // 保存每个固定列位置的累计宽度（包含当前列）
        const leftAccumulated: FixedColWidth[] = [];
        const rightAccumulated: FixedColWidth[] = [];

        let leftSum = 0;
        let rightSum = 0;

        for (let i = 0, j = cols.length - 1; i < cols.length; i++, j--) {
            const leftCol = cols[i];
            const rightCol = cols[j];

            if (leftCol?.fixed === 'left') {
                leftSum += getCalculatedColWidth(leftCol);
                leftAccumulated.push({ i, w: leftSum });
            }

            if (rightCol?.fixed === 'right') {
                rightSum += getCalculatedColWidth(rightCol);
                rightAccumulated.unshift({ i: j, w: rightSum });
            }
        }

        return (colIndex: number) => {
            // 查找目标列左侧最近的固定列的累计宽度
            let leftFixedWidth = 0;
            for (let i = leftAccumulated.length - 1; i >= 0; i--) {
                if (leftAccumulated[i].i < colIndex) {
                    leftFixedWidth = leftAccumulated[i].w;
                    break;
                }
            }

            // 查找目标列右侧最近的固定列的累计宽度
            let rightFixedWidth = 0;
            for (let i = rightAccumulated.length - 1; i >= 0; i--) {
                if (rightAccumulated[i].i > colIndex) {
                    rightFixedWidth = rightAccumulated[i].w;
                    break;
                }
            }

            return [leftFixedWidth, rightFixedWidth] as const;
        };
    });

    /** 根据 selectionRanges 计算所有选区内 cellKey 的并集 */
    const selectedCellKeys = computed<Set<string>>(() => {
        const ranges = selectionRanges.value;
        if (!ranges.length) return new Set();

        const keys = new Set<string>();
        const cols = tableHeaderLast.value;
        const data = dataSourceCopy.value;
        for (const range of ranges) {
            const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
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
        }
        return keys;
    });

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
        const { index } = range;
        const [x1, x2] = index.x;
        const [y1, y2] = index.y;
        return {
            minRow: Math.min(y1, y2),
            maxRow: Math.max(y1, y2),
            minCol: Math.min(x1, x2),
            maxCol: Math.max(x1, x2),
        };
    }

    /** 根据colKey获取列的绝对索引 */
    function getColIndexByKey(colKey: string | undefined): number {
        if (!colKey) return -1;
        return colKeyToIndexMap.value.get(colKey) ?? -1;
    }

    /** 获取列的左边距和宽度 */
    function getColPosition(colIndex: number): { l: number; w: number } {
        let l = 0;
        let w = 0;
        const cols = tableHeaderLast.value;
        for (let i = 0; i < cols.length; i++) {
            const colWidth = getCalculatedColWidth(cols[i]);
            if (i < colIndex) {
                l += colWidth;
            } else if (i === colIndex) {
                w = colWidth;
                break;
            }
        }
        return { l, w };
    }

    /** 根据按键计算移动方向 */
    function getMovementDelta(key: string, shiftKey: boolean): [number, number] {
        let rowDelta = 0;
        let colDelta = 0;

        switch (key) {
            case KEY_ARROW_UP:
                rowDelta = -1;
                break;
            case KEY_ARROW_DOWN:
                rowDelta = 1;
                break;
            case KEY_ARROW_LEFT:
                colDelta = -1;
                break;
            case KEY_ARROW_RIGHT:
                colDelta = 1;
                break;
            case KEY_TAB:
                // Tab: right; Shift+Tab: left
                colDelta = shiftKey ? -1 : 1;
                break;
        }

        return [rowDelta, colDelta];
    }

    /** 钳制值到指定范围内 */
    function clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(value, max));
    }

    /** 处理Tab键的换行逻辑 */
    function handleTabWrap(row: number, col: number, rawCol: number, rowCount: number, colCount: number): [number, number] {
        let newRow = row;
        let newCol = col;

        if (rawCol >= colCount) {
            newCol = 0;
            newRow = Math.min(row + 1, rowCount - 1);
        } else if (rawCol < 0) {
            newCol = colCount - 1;
            newRow = Math.max(row - 1, 0);
        }

        return [newRow, newCol];
    }

    /** 计算自动滚动的增量 */
    function calculateAutoScrollDelta(mouseX: number, mouseY: number, rect: DOMRect): { deltaX: number; deltaY: number } {
        const { top, bottom, left, right } = rect;
        let deltaX = 0;
        let deltaY = 0;

        // Y方向
        if (mouseY < top + EDGE_ZONE) {
            const dist = Math.max(0, top + EDGE_ZONE - mouseY);
            deltaY = -Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        } else if (mouseY > bottom - EDGE_ZONE) {
            const dist = Math.max(0, mouseY - (bottom - EDGE_ZONE));
            deltaY = Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        }

        // X方向
        if (mouseX < left + EDGE_ZONE) {
            const dist = Math.max(0, left + EDGE_ZONE - mouseX);
            deltaX = -Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        } else if (mouseX > right - EDGE_ZONE) {
            const dist = Math.max(0, mouseX - (right - EDGE_ZONE));
            deltaX = Math.ceil((dist / EDGE_ZONE) * SCROLL_SPEED_MAX);
        }

        return { deltaX, deltaY };
    }

    /** mousedown 处理：设置锚点，开始拖选 */
    function onSelectionMouseDown(e: MouseEvent) {
        if (!config.value.enabled || e.button !== 0) return;

        const rowIndex = getClosestTrIndex(e.target as HTMLElement);
        const colKey = getClosestColKey(e.target as HTMLElement);
        const colIndex = getColIndexByKey(colKey);

        if (rowIndex < 0 || colIndex < 0) return;

        const ctrlKey = e.ctrlKey || e.metaKey;

        const range: AreaSelectionRange = {
            index: {
                x: [colIndex, colIndex],
                y: [rowIndex, rowIndex],
            },
        };
        // Shift 扩选：从锚点扩展到当前位置，更新最后一个区域
        if (e.shiftKey && anchorCell && shiftEnabled.value) {
            const ranges = selectionRanges.value.slice();
            const shiftRange: AreaSelectionRange = {
                index: {
                    x: [anchorCell.colIndex, colIndex],
                    y: [anchorCell.rowIndex, rowIndex],
                },
            };
            if (ranges.length) {
                ranges[ranges.length - 1] = shiftRange;
            } else {
                ranges.push(shiftRange);
            }
            selectionRanges.value = ranges;
        } else {
            anchorCell = { rowIndex, colIndex };
            if (ctrlKey && ctrlEnabled.value) {
                // Ctrl multiple
                selectionRanges.value = selectionRanges.value.concat([range]);
            } else {
                // normal click
                selectionRanges.value = [range];
            }
        }

        isSelecting.value = true;
        lastMouseClientX = e.clientX;
        lastMouseClientY = e.clientY;

        // 防止拖选时选中文字
        // en: Prevent text selection during drag
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

    /** 更新最后一个选区的终点（拖拽过程中） */
    function updateSelectionEnd(endRowIndex: number, endColIndex: number) {
        if (!anchorCell) return;
        const newRange: AreaSelectionRange = {
            index: {
                x: [anchorCell.colIndex, endColIndex],
                y: [anchorCell.rowIndex, endRowIndex],
            },
        };
        const ranges = [...selectionRanges.value];
        if (ranges.length > 0) {
            ranges[ranges.length - 1] = newRange;
        } else {
            ranges.push(newRange);
        }
        selectionRanges.value = ranges;
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
        const { deltaX, deltaY } = calculateAutoScrollDelta(lastMouseClientX, lastMouseClientY, rect);

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

    function emitSelectionChange() {
        emits('area-selection-change', selectionRanges.value);
    }

    /** 获取 areaSelection 配置中的格式化回调 */
    function getFormatCellFn() {
        const cfg = config.value;
        return typeof cfg.formatCellForClipboard === 'function' ? cfg.formatCellForClipboard : null;
    }

    /**
     * 复制选区内容到剪贴板,只复制最后一个选区
     * en: Copy selected area content to clipboard, only copy the last selected area
     * @returns {string} text
     */
    function copySelectedArea(): string {
        const ranges = selectionRanges.value;
        if (!ranges.length) return '';

        const range = ranges[ranges.length - 1];
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
     * Ctrl+C / Cmd+C copy
     * Esc ：cancel
     * Arrow keys / Tab move (when keyboard=true)
     **/
    function onKeydown(e: KeyboardEvent) {
        if (!config.value.enabled) return;

        const key = e.key;

        // Esc ：cancel
        if (key === KEY_ESCAPE || key === KEY_ESC) {
            if (selectionRanges.value.length) {
                clearSelectedArea();
                emitSelectionChange();
                e.preventDefault();
            }
            return;
        }

        // Ctrl/Cmd+C  copy
        if ((e.ctrlKey || e.metaKey) && key === KEY_C && selectionRanges.value.length) {
            copySelectedArea();
            e.preventDefault();
            return;
        }

        if (!keyboardEnabled.value) return;

        const isArrowKey = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_ARROW_LEFT, KEY_ARROW_RIGHT].includes(key);
        const isTabKey = key === KEY_TAB;
        const isNavigationKey = isArrowKey || isTabKey;

        if (!isNavigationKey) return;

        e.preventDefault();

        const rowCount = dataSourceCopy.value.length;
        const colCount = tableHeaderLast.value.length;
        if (rowCount === 0 || colCount === 0) return;

        // 如果没有选区，默认从第一个单元格开始
        // en: If no selection, start from the first cell
        if (!selectionRanges.value.length) {
            anchorCell = { rowIndex: 0, colIndex: 0 };
            selectionRanges.value = [
                {
                    index: {
                        x: [0, 0],
                        y: [0, 0],
                    },
                },
            ];
            emitSelectionChange();
            scrollToCell(0, 0);
            return;
        }

        // 计算移动方向
        const [rowDelta, colDelta] = getMovementDelta(key, e.shiftKey);

        // Shift 扩展选区，否则移动单格选区
        if (e.shiftKey && isArrowKey && shiftEnabled.value) {
            // 扩展选区：更新最后一个区域的 endRow/endCol
            const ranges = [...selectionRanges.value];
            const range = ranges.length > 0 ? ranges[ranges.length - 1] : null;
            if (!range) return;
            const { index } = range;
            let newEndRow = index.y[1] + rowDelta;
            let newEndCol = index.x[1] + colDelta;

            // 边界检查
            newEndRow = clamp(newEndRow, 0, rowCount - 1);
            newEndCol = clamp(newEndCol, 0, colCount - 1);

            ranges[ranges.length - 1] = {
                index: {
                    x: [index.x[0], newEndCol],
                    y: [index.y[0], newEndRow],
                },
            };
            selectionRanges.value = ranges;

            scrollToCell(newEndRow, newEndCol);
        } else {
            // 移动单格选区
            // 取最后一个区域的 end 位置作为基础，清空旧选区重建
            const ranges = selectionRanges.value;
            const range = ranges.length > 0 ? ranges[ranges.length - 1] : null;
            const baseRow = range ? normalizeRange(range).minRow : 0;
            const baseCol = range ? normalizeRange(range).minCol : 0;
            let newRow = baseRow + rowDelta;
            let newCol = baseCol + colDelta;

            // 边界检查（先检查，避免越界）
            newRow = clamp(newRow, 0, rowCount - 1);
            newCol = clamp(newCol, 0, colCount - 1);

            // Tab 换行逻辑：如果到达行尾/行首，换行
            if (isTabKey) {
                // 计算原始未 clamp 的值
                const rawCol = baseCol + colDelta;
                const [tabRow, tabCol] = handleTabWrap(baseRow, newCol, rawCol, rowCount, colCount);
                newRow = tabRow;
                newCol = tabCol;
            }

            // 更新锚点和选区（移动单格时清空其他区域，仅保留新位置）
            anchorCell = { rowIndex: newRow, colIndex: newCol };
            selectionRanges.value = [
                {
                    index: {
                        x: [newCol, newCol],
                        y: [newRow, newRow],
                    },
                },
            ];

            scrollToCell(newRow, newCol);
        }

        emitSelectionChange();
    }

    /**
     * 滚动到指定单元格，确保其在可视区域内
     * @param rowIndex 行索引
     * @param colIndex 列索引
     */
    function scrollToCell(rowIndex: number, colIndex: number) {
        const container = tableContainerRef.value;
        if (!container) return;

        const row = dataSourceCopy.value[rowIndex];
        const col = tableHeaderLast.value[colIndex];
        if (!row || !col) return;

        const thead = container.querySelector('thead');
        const headerHeight = thead ? thead.offsetHeight : 0;
        const tfoot = container.querySelector('tfoot');
        const footerHeight = tfoot ? tfoot.offsetHeight : 0;

        const vs = virtualScroll.value;
        const vsx = virtualScrollX.value;

        // 是否开启按行滚动模式（experimental.scrollY 模式）
        const isScrollRowByRow = props.scrollRowByRow;

        // 计算目标行的位置（基于虚拟滚动数据）
        const rowHeight = vs.rowHeight;
        const targetRowTop = rowIndex * rowHeight;
        const targetRowBottom = targetRowTop + rowHeight;

        // 计算可视区域
        // experimental.scrollY 模式下，容器 scrollTop 始终为 0，需要使用 virtualScroll.scrollTop
        const visibleTop = isScrollRowByRow ? vs.scrollTop : container.scrollTop;
        const visibleBottom = visibleTop + vs.containerHeight - headerHeight - footerHeight;

        // 计算需要的垂直滚动位置
        let newScrollTop: number | null = null;
        if (targetRowTop < visibleTop) {
            // 目标行在可视区域上方，滚动到使目标行位于顶部
            newScrollTop = targetRowTop;
        } else if (targetRowBottom > visibleBottom) {
            // 目标行在可视区域下方
            newScrollTop = targetRowBottom - (vs.containerHeight - headerHeight - footerHeight);
        }

        // 计算目标列的位置
        const { l: targetColLeft, w: targetColWidth } = getColPosition(colIndex);
        const targetColRight = targetColLeft + targetColWidth;

        // 计算可视区域（水平）
        const visibleLeft = container.scrollLeft;
        const visibleRight = visibleLeft + vsx.containerWidth;

        // 计算固定列的宽度（用于检测遮挡）
        const [leftFixedWidth, rightFixedWidth] = getFixedColWidths.value(colIndex);
        let newScrollLeft: number | null = null;
        if (targetColLeft < visibleLeft + leftFixedWidth) {
            // 目标列在左侧固定列遮挡区域内，需要向左滚动
            newScrollLeft = targetColLeft - leftFixedWidth;
        } else if (targetColRight > visibleRight - rightFixedWidth) {
            // 目标列在右侧固定列遮挡区域内，需要向右滚动
            newScrollLeft = targetColRight - vsx.containerWidth + rightFixedWidth;
        }

        if (newScrollTop !== null || newScrollLeft !== null) {
            scrollTo(newScrollTop, newScrollLeft);
        }
    }

    /**
     * 判断一个单元格的选区样式类名
     * @param cellKey 单元格唯一键
     * @param absoluteRowIndex 行在 dataSourceCopy 中的绝对索引
     * @param colKey 列唯一键
     * @returns 样式类名数组
     */
    function getAreaSelectionClasses(cellKey: string, absoluteRowIndex: number, colKey: UniqKey): string[] {
        // 如果禁用了单元格高亮，则不返回任何 class
        if (!highlightCellEnabled.value) return [];

        if (!selectedCellKeys.value.has(cellKey)) return [];

        const colIndex = colKeyToIndexMap.value.get(colKey);
        if (colIndex === void 0 || colIndex < 0) return [];

        const classes: string[] = [CELL_RANGE_SELECTED];
        const ranges = selectionRanges.value;
        if (!ranges.length) return classes;

        // 只对最后一个区域（最后操作的区域）添加边界边框
        const lastRange = normalizeRange(ranges[ranges.length - 1]);
        const { minRow, maxRow, minCol, maxCol } = lastRange;

        // 判断当前单元格是否在最后一个区域内
        const isInLastRange = absoluteRowIndex >= minRow && absoluteRowIndex <= maxRow && colIndex >= minCol && colIndex <= maxCol;

        if (isInLastRange) {
            if (absoluteRowIndex === minRow) classes.push(CELL_RANGE_TOP);
            if (absoluteRowIndex === maxRow) classes.push(CELL_RANGE_BOTTOM);
            if (colIndex === minCol) classes.push(CELL_RANGE_LEFT);
            if (colIndex === maxCol) classes.push(CELL_RANGE_RIGHT);
        }

        return classes;
    }

    /**
     * 判断一行的选区样式类名（行高亮）
     * @param absoluteRowIndex 行在 dataSourceCopy 中的绝对索引
     * @returns 样式类名数组
     */
    function getAreaSelectionRowClasses(absoluteRowIndex: number): string[] {
        // 如果禁用了行高亮，则不返回任何 class
        if (!highlightRowEnabled.value) return [];

        const ranges = selectionRanges.value;
        if (!ranges.length) return [];

        // 检查该行是否在任何选区内
        for (const range of ranges) {
            const { minRow, maxRow } = normalizeRange(range);
            if (absoluteRowIndex >= minRow && absoluteRowIndex <= maxRow) {
                return ['row-range-selected'];
            }
        }

        return [];
    }

    // expose function

    /** 获取选中的单元格信息 */
    function getSelectedArea() {
        const ranges = selectionRanges.value;
        if (!ranges.length) return { rows: [] as DT[], cols: [] as StkTableColumn<DT>[], ranges: [] as AreaSelectionRange[] };
        const data = dataSourceCopy.value;
        const cols = tableHeaderLast.value;
        // 收集所有区域的行和列
        const rowSet = new Set<number>();
        const colSet = new Set<number>();
        for (const range of ranges) {
            const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
            for (let r = minRow; r <= maxRow; r++) rowSet.add(r);
            for (let c = minCol; c <= maxCol; c++) colSet.add(c);
        }
        const sortedRows = [...rowSet].sort((a, b) => a - b);
        const sortedCols = [...colSet].sort((a, b) => a - b);
        return {
            rows: sortedRows.map(i => data[i]).filter(Boolean),
            cols: sortedCols.map(i => cols[i]).filter(Boolean),
            ranges: ranges.map(r => ({ ...r })),
        };
    }

    function clearSelectedArea() {
        selectionRanges.value = [];
        isSelecting.value = false;
    }

    return {
        config,
        isSelecting,
        getClass: getAreaSelectionClasses,
        getRowClass: getAreaSelectionRowClasses,
        get: getSelectedArea,
        clear: clearSelectedArea,
        copy: copySelectedArea,
        onMD: onSelectionMouseDown,
    };
}
export const useAreaSelectionName = 'useAreaSelection';

(useAreaSelection as any)[MY_FN_NAME] = useAreaSelectionName;
