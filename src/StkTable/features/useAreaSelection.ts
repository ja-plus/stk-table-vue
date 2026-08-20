import { Ref, ShallowRef, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
    AreaSelectionConfig,
    AreaSelectionRange,
    CellKeyGen,
    ColKeyGen,
    StkTableColumn,
    UniqKey,
    AreaSelectionSetterRange,
    AreaSelectionSetterOption,
} from '../types';
import { VirtualScrollStore, VirtualScrollXStore } from '../useVirtualScroll';
import { getClosestColKey, getClosestTd, getClosestTr, getClosestTrIndex } from '../utils';
import { getCalculatedColWidth } from '../utils/constRefUtils';
import { MY_FN_NAME } from './const';

/**
 * 单元格区域选择功能
 * 支持鼠标拖拽选择、键盘导航、复制粘贴等功能
 * en: Cell area selection feature with mouse drag, keyboard navigation, copy-paste, etc.
 */
function useAreaSelectionImpl<DT extends Record<string, any>>(
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
    getRowIndex: (row: DT) => number,
    getColumnIndex: (col: StkTableColumn<DT>) => number,
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

    // 选区样式通过 data-* 属性（而非 classList）应用。
    // 原因：合并单元格的 td 存在响应式 class 绑定（cell-hover/cell-active），
    // hover 时 Vue 的 patchClass 会用 `el.className = value` 整体覆盖 className，
    // 从而抹掉命令式添加的选区 class，导致选区高亮/边框在鼠标经过合并单元格时消失。
    // data-* 属性不在 vnode props 中，Vue 不会清除它们，可稳定保留选区样式。
    // en: Apply selection styles via data-* attributes instead of classList, so Vue's
    // reactive class patching on merged cells (cell-hover/cell-active) won't wipe them.
    //  const CELL_RANGE_SELECTED = 'cell-range-selected';
    // const CELL_RANGE_TOP = 'cell-range-t';
    // const CELL_RANGE_BOTTOM = 'cell-range-b';
    // const CELL_RANGE_LEFT = 'cell-range-l';
    // const CELL_RANGE_RIGHT = 'cell-range-r';
    // const ROW_RANGE_SELECTED = 'row-range-selected';
    const ATTR_CELL_SELECTED = 'data-cs-s';
    const ATTR_CELL_TOP = 'data-cs-t';
    const ATTR_CELL_BOTTOM = 'data-cs-b';
    const ATTR_CELL_LEFT = 'data-cs-l';
    const ATTR_CELL_RIGHT = 'data-cs-r';
    const ATTR_ROW_SELECTED = 'data-rs-s';

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
            return { enabled: b, keyboard: b, ctrl: b, shift: b, highlight: { cell: b, row: false } };
        }
        const { highlight: userHighlight, ...restConfig } = props.areaSelection || {};
        return {
            enabled: true,
            ctrl: true,
            shift: true,
            highlight: {
                cell: true,
                row: false,
                ...userHighlight,
            },
            ...restConfig,
        };
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
        // 预计算每个列索引位置对应的左右固定列累计宽度
        // 左固定列：从左向右累加，非固定列继承前一个值
        const leftWidths: number[] = new Array(cols.length + 1).fill(0);
        // 右固定列：从右向左累加，非固定列继承后一个值
        const rightWidths: number[] = new Array(cols.length + 1).fill(0);

        let leftSum = 0;
        for (let i = 0; i < cols.length; i++) {
            leftWidths[i] = leftSum;
            if (cols[i]?.fixed === 'left') {
                leftSum += getCalculatedColWidth(cols[i]);
            }
        }
        leftWidths[cols.length] = leftSum;

        let rightSum = 0;
        for (let i = cols.length - 1; i >= 0; i--) {
            rightWidths[i] = rightSum;
            if (cols[i]?.fixed === 'right') {
                rightSum += getCalculatedColWidth(cols[i]);
            }
        }

        return (colIndex: number) => {
            return [leftWidths[colIndex] ?? 0, rightWidths[colIndex + 1] ?? 0] as const;
        };
    });

    /** 根据 selectionRanges 计算所有选区内 cellKey 的并集（非响应式，用于 DOM 操作） */
    let selectedCellKeys: Set<string> = new Set();

    /** 重新计算 selectedCellKeys */
    function recomputeSelectedCellKeys() {
        const ranges = selectionRanges.value;
        if (!ranges.length) {
            selectedCellKeys = new Set();
            return;
        }
        const keys = new Set<string>();
        const cols = tableHeaderLast.value;
        const data = dataSourceCopy.value;
        for (const range of ranges) {
            const {
                begin: { row: r1, col: c1 },
                end: { row: r2, col: c2 },
            } = range.index;
            const [rStart, rEnd] = r1 < r2 ? [r1, r2] : [r2, r1];
            const [cStart, cEnd] = c1 < c2 ? [c1, c2] : [c2, c1];
            for (let r = rStart; r <= rEnd; r++) {
                const row = data[r];
                if (!row) continue;
                for (let c = cStart; c <= cEnd; c++) {
                    const col = cols[c];
                    if (col) keys.add(cellKeyGen(row, col));
                }
            }
        }
        selectedCellKeys = keys;
    }

    /**
     * 直接操作 DOM 更新选区样式（不触发 Vue re-render）
     * 用于替代在渲染函数中读取响应式选区数据，避免拖选时频繁触发整个表格重渲染
     */
    function updateSelectionDOM() {
        const container = tableContainerRef.value;
        if (!container) return;

        const cellHighlight = highlightCellEnabled.value;
        const rowHighlight = highlightRowEnabled.value;

        // 1. 清除所有旧的选区属性
        const oldSelectedCells = container.querySelectorAll(`[${ATTR_CELL_SELECTED}]`);
        for (let i = 0; i < oldSelectedCells.length; i++) {
            const el = oldSelectedCells[i] as HTMLElement;
            el.removeAttribute(ATTR_CELL_SELECTED);
            el.removeAttribute(ATTR_CELL_TOP);
            el.removeAttribute(ATTR_CELL_BOTTOM);
            el.removeAttribute(ATTR_CELL_LEFT);
            el.removeAttribute(ATTR_CELL_RIGHT);
        }
        const oldSelectedRows = container.querySelectorAll(`[${ATTR_ROW_SELECTED}]`);
        for (let i = 0; i < oldSelectedRows.length; i++) {
            (oldSelectedRows[i] as HTMLElement).removeAttribute(ATTR_ROW_SELECTED);
        }

        // 2. 重算 selectedCellKeys
        recomputeSelectedCellKeys();

        const ranges = selectionRanges.value;
        if (!ranges.length) return;

        const tbody = container.querySelector('.stk-tbody-main');
        if (!tbody) return;

        // 3. 应用行高亮 class
        if (rowHighlight) {
            for (const range of ranges) {
                const { minRow, maxRow } = normalizeRange(range);
                for (let r = minRow; r <= maxRow; r++) {
                    const tr = tbody.querySelector(`tr[data-row-i="${r}"]`) as HTMLElement | null;
                    if (tr) tr.setAttribute(ATTR_ROW_SELECTED, '');
                }
            }
        }

        // 4. 应用单元格高亮 class
        if (cellHighlight) {
            const lastRange = ranges[ranges.length - 1];
            const { minRow: lrMinRow, maxRow: lrMaxRow, minCol: lrMinCol, maxCol: lrMaxCol } = normalizeRange(lastRange);

            // 遍历所有可见行
            const trs = tbody.querySelectorAll('tr[data-row-i]');
            for (let t = 0; t < trs.length; t++) {
                const tr = trs[t] as HTMLElement;
                const rowIndex = parseInt(tr.getAttribute('data-row-i')!, 10);

                // 检查此行是否在任何选区内
                let inAnyRange = false;
                for (const range of ranges) {
                    const { minRow, maxRow } = normalizeRange(range);
                    if (rowIndex >= minRow && rowIndex <= maxRow) {
                        inAnyRange = true;
                        break;
                    }
                }
                if (!inAnyRange) continue;

                // 遍历此行中的单元格
                const tds = tr.querySelectorAll('td[data-col-key]');
                for (let d = 0; d < tds.length; d++) {
                    const td = tds[d] as HTMLElement;
                    const colKey = td.getAttribute('data-col-key')!;
                    const colIndex = colKeyToIndexMap.value.get(colKey);
                    if (colIndex === void 0 || colIndex < 0) continue;

                    // 生成 cellKey 检查是否在选区内
                    const data = dataSourceCopy.value;
                    const row = data[rowIndex];
                    const cols = tableHeaderLast.value;
                    if (!row || !cols[colIndex]) continue;
                    const ck = cellKeyGen(row, cols[colIndex]);
                    if (!selectedCellKeys.has(ck)) continue;

                    td.setAttribute(ATTR_CELL_SELECTED, '');

                    // 判断是否在最后一个区域的边界（考虑合并单元格的 rowspan/colspan）
                    const isInLastRange = rowIndex >= lrMinRow && rowIndex <= lrMaxRow && colIndex >= lrMinCol && colIndex <= lrMaxCol;
                    if (isInLastRange) {
                        // 合并单元格的实际结束行/列
                        const effEndRow = rowIndex + (parseInt(td.getAttribute('rowspan') || '1', 10) || 1) - 1;
                        const effEndCol = colIndex + (parseInt(td.getAttribute('colspan') || '1', 10) || 1) - 1;
                        if (rowIndex === lrMinRow) td.setAttribute(ATTR_CELL_TOP, '');
                        if (effEndRow === lrMaxRow) td.setAttribute(ATTR_CELL_BOTTOM, '');
                        if (colIndex === lrMinCol) td.setAttribute(ATTR_CELL_LEFT, '');
                        if (effEndCol === lrMaxCol) td.setAttribute(ATTR_CELL_RIGHT, '');
                    }
                }
            }
        }
    }

    /**
     * 监听 selectionRanges 变化，在 DOM 更新后直接操作选区 class
     * 同时在虚拟滚动等导致 DOM 重建时也能重新应用选区样式
     */
    watch(
        () => {
            // 组合依赖：选区变化 或 虚拟滚动可见范围变化 都触发
            const ranges = selectionRanges.value;
            const vs = virtualScroll.value;
            const vsx = virtualScrollX.value;
            return [
                ranges.length,
                ranges.length > 0 ? JSON.stringify(ranges.map(r => r.index)) : '',
                vsx.scrollLeft,
                vs.startIndex,
                vs.endIndex,
                vsx.startIndex,
                vsx.endIndex,
                dataSourceCopy.value.length,
                tableHeaderLast.value.length,
            ];
        },
        () => {
            // flush: 'post' 等效 — watch callback 在 DOM patch 后执行
            nextTick(updateSelectionDOM);
        },
        { flush: 'post' },
    );

    onMounted(() => {
        addListener();
    });
    onBeforeUnmount(() => {
        removeListener();
    });

    /**
     * 监听数据行数/列数变化，当行列变少时钳制选区与锚点，避免越界
     * en: Watch row/col count changes, clamp selection ranges and anchor to avoid out-of-bounds
     */
    watch([() => dataSourceCopy.value.length, () => tableHeaderLast.value.length], ([rowCount, colCount]) => {
        if (!config.value.enabled) return;

        // 钳制锚点
        if (anchorCell) {
            if (rowCount === 0 || colCount === 0) {
                anchorCell = null;
            } else {
                anchorCell.rowIndex = clamp(anchorCell.rowIndex, 0, rowCount - 1);
                anchorCell.colIndex = clamp(anchorCell.colIndex, 0, colCount - 1);
            }
        }

        if (!selectionRanges.value.length) return;

        // 行或列为 0 时清空选区
        if (rowCount === 0 || colCount === 0) {
            clearSelectedArea();
            emitSelectionChange();
            return;
        }

        const maxRow = rowCount - 1;
        const maxCol = colCount - 1;
        let changed = false;
        const newRanges: AreaSelectionRange[] = [];
        for (const range of selectionRanges.value) {
            const { begin, end } = range.index;
            const nbRow = clamp(begin.row, 0, maxRow);
            const nbCol = clamp(begin.col, 0, maxCol);
            const neRow = clamp(end.row, 0, maxRow);
            const neCol = clamp(end.col, 0, maxCol);
            if (nbRow !== begin.row || nbCol !== begin.col || neRow !== end.row || neCol !== end.col) {
                changed = true;
                newRanges.push(makeRange(nbRow, nbCol, neRow, neCol));
            } else {
                newRanges.push(range);
            }
        }

        if (changed) {
            selectionRanges.value = newRanges;
            emitSelectionChange();
        }
    });

    function addListener() {
        removeListener();
        tableContainerRef.value?.addEventListener('keydown', onKeydown);
    }

    function removeListener() {
        tableContainerRef.value?.removeEventListener('keydown', onKeydown);
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);
        stopAutoScroll();
    }

    /** 获取归一化（min/max）后的选区范围 */
    function normalizeRange(range: AreaSelectionRange) {
        const { begin, end } = range.index;
        return {
            minRow: Math.min(begin.row, end.row),
            maxRow: Math.max(begin.row, end.row),
            minCol: Math.min(begin.col, end.col),
            maxCol: Math.max(begin.col, end.col),
        };
    }

    /**
     * 构造选区范围。begin = 拖拽起点，end = 拖拽终点。
     * 同时填充已废弃的 x/y 字段以保证向后兼容。
     */
    function makeRange(beginRow: number, beginCol: number, endRow: number, endCol: number): AreaSelectionRange {
        return {
            index: {
                x: [beginCol, endCol],
                y: [beginRow, endRow],
                begin: { row: beginRow, col: beginCol },
                end: { row: endRow, col: endCol },
            },
        };
    }

    /** 根据colKey获取列的绝对索引 */
    function getColIndexByKey(colKey: string | undefined): number {
        if (!colKey) return -1;
        return colKeyToIndexMap.value.get(colKey) ?? -1;
    }

    // ---- 合并单元格支持 ----

    /** 获取指定单元格的合并信息 [rowspan, colspan]，无合并返回 [1, 1] */
    function getMergeSpan(rowIndex: number, colIndex: number): [number, number] {
        const data = dataSourceCopy.value;
        const cols = tableHeaderLast.value;
        const row = data[rowIndex];
        const col = cols[colIndex];
        if (!row || !col || !col.mergeCells) return [1, 1];
        const { rowspan = 1, colspan = 1 } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};
        return [rowspan || 1, colspan || 1];
    }

    /**
     * 扩展选区范围，使其完整覆盖边界上部分选中的合并单元格
     * en: Expand selection range to fully cover merged cells that are partially selected at boundaries
     */
    function expandRangeToCoverMergedCells(range: AreaSelectionRange): AreaSelectionRange {
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        const data = dataSourceCopy.value;
        const cols = tableHeaderLast.value;
        const rowCount = data.length;
        const colCount = cols.length;

        // 预计算含 mergeCells 的列索引
        const mergeColIndices: number[] = [];
        for (let c = 0; c < colCount; c++) {
            if (cols[c]?.mergeCells) mergeColIndices.push(c);
        }
        if (!mergeColIndices.length) return range;

        let [eMinRow, eMaxRow, eMinCol, eMaxCol] = [minRow, maxRow, minCol, maxCol];

        // 迭代扩展直到稳定（级联合并需要多轮）
        let changed = true;
        let guard = 0;
        while (changed && guard++ < 100) {
            changed = false;

            // 下边界：最后一行中的单元格 rowspan 是否超出边界
            for (const c of mergeColIndices) {
                if (c < eMinCol || c > eMaxCol) continue;
                const [rs] = getMergeSpan(eMaxRow, c);
                if (rs > 1 && eMaxRow + rs - 1 < rowCount && eMaxRow + rs - 1 > eMaxRow) {
                    eMaxRow = eMaxRow + rs - 1;
                    changed = true;
                }
            }

            // 右边界：最后一列中的单元格 colspan 是否超出边界
            for (let r = eMinRow; r <= eMaxRow; r++) {
                const [, cs] = getMergeSpan(r, eMaxCol);
                if (cs > 1 && eMaxCol + cs - 1 < colCount && eMaxCol + cs - 1 > eMaxCol) {
                    eMaxCol = eMaxCol + cs - 1;
                    changed = true;
                }
            }

            // 上边界：检查 minRow 上方的单元格是否延伸进选区
            for (const c of mergeColIndices) {
                if (c < eMinCol || c > eMaxCol) continue;
                for (let r = eMinRow - 1; r >= 0 && r > eMinRow - 500; r--) {
                    const [rs] = getMergeSpan(r, c);
                    if (rs <= 1) continue;
                    const endRow = r + rs - 1;
                    if (endRow >= eMinRow) {
                        // 合并单元格延伸进选区，扩展上边界
                        if (r < eMinRow) {
                            eMinRow = r;
                            changed = true;
                        }
                    } else {
                        // 该合并单元格未到达当前边界，更上方的也不会到达，停止扫描此列
                        break;
                    }
                }
            }

            // 左边界：检查 minCol 左侧的单元格是否延伸进选区
            for (let r = eMinRow; r <= eMaxRow; r++) {
                for (let c = eMinCol - 1; c >= 0 && c > eMinCol - 500; c--) {
                    const [, cs] = getMergeSpan(r, c);
                    if (cs <= 1) continue;
                    const endCol = c + cs - 1;
                    if (endCol >= eMinCol) {
                        if (c < eMinCol) {
                            eMinCol = c;
                            changed = true;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        if (eMinRow === minRow && eMaxRow === maxRow && eMinCol === minCol && eMaxCol === maxCol) {
            return range;
        }

        // 保持 begin/end 的原始方向
        const { begin, end } = range.index;
        const newBeginRow = begin.row < end.row || begin.row === end.row ? eMinRow : eMaxRow;
        const newEndRow = begin.row < end.row || begin.row === end.row ? eMaxRow : eMinRow;
        const newBeginCol = begin.col <= end.col ? eMinCol : eMaxCol;
        const newEndCol = begin.col <= end.col ? eMaxCol : eMinCol;
        return makeRange(newBeginRow, newBeginCol, newEndRow, newEndCol);
    }

    /** 获取列的左边距和宽度
     * @param colIndex 列的绝对索引
     * @returns [left, width]
     */
    function getColPosition(colIndex: number): [number, number] {
        let left = 0;
        const cols = tableHeaderLast.value;
        for (let i = 0; i < cols.length; i++) {
            const colWidth = getCalculatedColWidth(cols[i]);
            if (i === colIndex) return [left, colWidth];
            left += colWidth;
        }
        return [left, 0];
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
        if (rawCol >= colCount) return [Math.min(row + 1, rowCount - 1), 0];
        if (rawCol < 0) return [Math.max(row - 1, 0), colCount - 1];
        return [row, col];
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

        // 立即扩展以完整覆盖合并单元格（修复 mousedown 合并单元格时边框显示不全）
        const range: AreaSelectionRange = expandRangeToCoverMergedCells(makeRange(rowIndex, colIndex, rowIndex, colIndex));
        // Shift 扩选：从锚点扩展到当前位置，更新最后一个区域
        if (e.shiftKey && anchorCell && shiftEnabled.value) {
            const ranges = selectionRanges.value.slice();
            const shiftRange: AreaSelectionRange = expandRangeToCoverMergedCells(
                makeRange(anchorCell.rowIndex, anchorCell.colIndex, rowIndex, colIndex),
            );
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
        // 拖拽过程中即扩展，使选区实时覆盖合并单元格的完整边界
        const newRange: AreaSelectionRange = expandRangeToCoverMergedCells(
            makeRange(anchorCell.rowIndex, anchorCell.colIndex, endRowIndex, endColIndex),
        );
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

        const td = getClosestTd(el as HTMLElement);
        const tr = getClosestTr(el as HTMLElement);
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

        // 扩展最后一个选区，使其完整覆盖合并单元格
        const ranges = selectionRanges.value;
        if (ranges.length) {
            const expanded = expandRangeToCoverMergedCells(ranges[ranges.length - 1]);
            if (expanded !== ranges[ranges.length - 1]) {
                const newRanges = [...ranges];
                newRanges[newRanges.length - 1] = expanded;
                selectionRanges.value = newRanges;
            }
        }

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

    function blurCellElement() {
        // 防止虚拟滚动移除 DOM 时焦点被动丢失，导致后续 keydown 无法冒泡到容器
        // en: Prevent focus loss when virtual scroll removes DOM, causing subsequent keydown events to not bubble to the container
        const container = tableContainerRef.value;
        const activeEl = document.activeElement as HTMLElement | null;
        if (container && activeEl && container.contains(activeEl) && activeEl !== container) {
            container.focus({ preventScroll: true });
        }
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
            blurCellElement();
            if (selectionRanges.value.length) {
                // clearSelectedArea();
                // emitSelectionChange();
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
            selectionRanges.value = [makeRange(0, 0, 0, 0)];
            emitSelectionChange();
            scrollToCell(0, 0);
            return;
        }

        // 计算移动方向
        const [rowDelta, colDelta] = getMovementDelta(key, e.shiftKey);

        // Shift 扩展选区，否则移动单格选区
        if (e.shiftKey && isArrowKey && shiftEnabled.value) {
            blurCellElement();
            // 扩展选区：保留 begin，更新最后一个区域的 end
            const ranges = [...selectionRanges.value];
            const range = ranges.length > 0 ? ranges[ranges.length - 1] : null;
            if (!range) return;
            const { begin, end } = range.index;
            let newEndRow = end.row + rowDelta;
            let newEndCol = end.col + colDelta;

            // 边界检查
            newEndRow = clamp(newEndRow, 0, rowCount - 1);
            newEndCol = clamp(newEndCol, 0, colCount - 1);

            ranges[ranges.length - 1] = makeRange(begin.row, begin.col, newEndRow, newEndCol);
            selectionRanges.value = ranges;

            scrollToCell(newEndRow, newEndCol);
        } else {
            blurCellElement();
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
            selectionRanges.value = [makeRange(newRow, newCol, newRow, newCol)];

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
        const [targetColLeft, targetColWidth] = getColPosition(colIndex);
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
    // function getAreaSelectionClasses(cellKey: string, absoluteRowIndex: number, colKey: UniqKey): string[] {
    //     if (!highlightCellEnabled.value) return [];
    //     if (!selectedCellKeys.has(cellKey)) return [];

    //     const colIndex = colKeyToIndexMap.value.get(colKey);
    //     if (colIndex === void 0 || colIndex < 0) return [];

    //     const classes: string[] = [CELL_RANGE_SELECTED];
    //     const ranges = selectionRanges.value;
    //     if (!ranges.length) return classes;

    //     const lastRange = ranges[ranges.length - 1];
    //     const { minRow, maxRow, minCol, maxCol } = normalizeRange(lastRange);

    //     // 判断当前单元格是否在最后一个区域内
    //     const isInLastRange = absoluteRowIndex >= minRow && absoluteRowIndex <= maxRow && colIndex >= minCol && colIndex <= maxCol;

    //     if (isInLastRange) {
    //         if (absoluteRowIndex === minRow) classes.push(CELL_RANGE_TOP);
    //         if (absoluteRowIndex === maxRow) classes.push(CELL_RANGE_BOTTOM);
    //         if (colIndex === minCol) classes.push(CELL_RANGE_LEFT);
    //         if (colIndex === maxCol) classes.push(CELL_RANGE_RIGHT);
    //     }

    //     return classes;
    // }

    /**
     * 判断一行的选区样式类名（行高亮）
     * @param absoluteRowIndex 行在 dataSourceCopy 中的绝对索引
     * @returns 样式类名数组
     */
    // function getAreaSelectionRowClasses(absoluteRowIndex: number): string[] {
    //     if (!highlightRowEnabled.value) return [];

    //     const ranges = selectionRanges.value;
    //     if (!ranges.length) return [];

    //     // 检查该行是否在任何选区内
    //     for (const range of ranges) {
    //         const {
    //             begin: { row: r1 },
    //             end: { row: r2 },
    //         } = range.index;
    //         const [minRow, maxRow] = r1 < r2 ? [r1, r2] : [r2, r1];
    //         if (absoluteRowIndex >= minRow && absoluteRowIndex <= maxRow) {
    //             return ['row-range-selected'];
    //         }
    //     }

    //     return [];
    // }

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

    function setAreaSelection(ranges?: AreaSelectionSetterRange<DT>, option: AreaSelectionSetterOption = {}): AreaSelectionRange[] {
        if (!config.value.enabled) return selectionRanges.value;

        const { silent = false, scrollToView = false } = option;
        const rowCount = dataSourceCopy.value.length;
        const colCount = tableHeaderLast.value.length;

        if (rowCount <= 0 || colCount <= 0) {
            clearSelectedArea();
            if (!silent) emitSelectionChange();
            return selectionRanges.value;
        }

        const maxRow = rowCount - 1;
        const maxCol = colCount - 1;

        let beginRow = 0;
        let endRow = maxRow;
        let beginCol = 0;
        let endCol = maxCol;

        if (ranges) {
            const begin = ranges.begin;
            const end = ranges.end ?? begin;

            beginRow = typeof begin.row === 'number' ? begin.row : getRowIndex(begin.row);
            endRow = typeof end.row === 'number' ? end.row : getRowIndex(end.row);

            const beginColInput = typeof begin.col === 'number' ? begin.col : begin.col ? getColumnIndex(begin.col) : void 0;
            const endColInput = typeof end.col === 'number' ? end.col : end.col ? getColumnIndex(end.col) : void 0;

            if (beginColInput !== void 0) {
                beginCol = beginColInput;
                endCol = endColInput !== void 0 ? endColInput : beginColInput;
            } else if (endColInput !== void 0) {
                beginCol = 0;
                endCol = endColInput;
            }
        }

        beginRow = clamp(beginRow, 0, maxRow);
        endRow = clamp(endRow, 0, maxRow);
        beginCol = clamp(beginCol, 0, maxCol);
        endCol = clamp(endCol, 0, maxCol);

        selectionRanges.value = [makeRange(beginRow, beginCol, endRow, endCol)];
        anchorCell = { rowIndex: beginRow, colIndex: beginCol };
        isSelecting.value = false;

        if (scrollToView) {
            scrollToCell(endRow, endCol);
        }

        if (!silent) emitSelectionChange();
        return selectionRanges.value;
    }

    return {
        config,
        isSelecting,
        // getClass: getAreaSelectionClasses,
        // getRowClass: getAreaSelectionRowClasses,
        get: getSelectedArea,
        set: setAreaSelection,
        clear: clearSelectedArea,
        copy: copySelectedArea,
        onMD: onSelectionMouseDown,
    };
}
export const useAreaSelectionName = 'useAreaSelection';

// 挂载特性名供 registerFeature 识别。
// 顶层属性赋值会阻止消费方 tree-shaking，改用 @__PURE__ 包装并绑定到导出：
// 本库构建时导出存活故保留；消费方未使用该导出时可整体摇掉。
export const useAreaSelection: typeof useAreaSelectionImpl = /* @__PURE__ */ Object.assign(useAreaSelectionImpl, {
    [MY_FN_NAME]: useAreaSelectionName,
});
