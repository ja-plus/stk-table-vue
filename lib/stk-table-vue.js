/**
 * name: stk-table-vue
 * version: v1.2.0-beta.2
 * description: High performance realtime virtual table for vue3 and vue2.7
 * author: japlus
 * homepage: https://ja-plus.github.io/stk-table-vue/
 * license: MIT
 */
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, createElementBlock, openBlock, createElementVNode, defineComponent, normalizeStyle, createBlock, createCommentVNode, toDisplayString, shallowRef, customRef, onUnmounted, toRaw, triggerRef, provide, toRef, normalizeClass, unref, renderSlot, Fragment, renderList, mergeProps, resolveDynamicComponent, withCtx, createTextVNode, createVNode, createApp, markRaw, getCurrentInstance, h, withModifiers } from "vue";
const DEFAULT_COL_WIDTH = 100;
const DEFAULT_TABLE_HEIGHT = 100;
const DEFAULT_TABLE_WIDTH = 200;
const DEFAULT_ROW_HEIGHT = 28;
const HIGHLIGHT_COLOR = {
  light: { from: "#71a2fd", to: "#fff" },
  dark: { from: "#1e4c99", to: "#181c21" }
};
const HIGHLIGHT_DURATION = 2e3;
const HIGHLIGHT_ROW_CLASS = "highlight-row";
const HIGHLIGHT_CELL_CLASS = "highlight-cell";
const _chromeVersion = getBrowsersVersion("chrome");
const _firefoxVersion = getBrowsersVersion("firefox");
const IS_LEGACY_MODE = _chromeVersion < 56 || _firefoxVersion < 59;
const DEFAULT_SMOOTH_SCROLL = _chromeVersion < 85;
const STK_ID_PREFIX = "stk";
const EXPANDED_ROW_KEY_PREFIX = "expanded-";
const CELL_KEY_SEPARATE = "--";
const DEFAULT_SORT_CONFIG = {
  emptyToBottom: false,
  stringLocaleCompare: false,
  sortChildren: false
};
const DEFAULT_ROW_ACTIVE_CONFIG = {
  enabled: true,
  disabled: () => false,
  revokable: true
};
function isEmptyValue(val, isNumber) {
  let isEmpty = val === null || val === void 0;
  if (isNumber) {
    isEmpty = isEmpty || typeof val === "boolean" || Number.isNaN(+val);
  }
  return isEmpty;
}
function insertToOrderedArray(sortState, newItem, targetArray, sortConfig = {}) {
  const { dataIndex, sortField, order } = sortState;
  let { sortType } = sortState;
  const field = sortField || dataIndex;
  if (!sortType) sortType = typeof newItem[field];
  const isNumber = sortType === "number";
  const data = targetArray.slice();
  if (!order || !data.length) {
    data.unshift(newItem);
    return data;
  }
  const { emptyToBottom, customCompare, stringLocaleCompare } = { emptyToBottom: false, ...sortConfig };
  const targetVal = newItem[field];
  if (emptyToBottom && isEmptyValue(targetVal, isNumber)) {
    data.push(newItem);
  } else {
    const isAsc = order === "asc";
    const customCompareFn = customCompare || ((a, b) => {
      const midVal = a[field];
      const compareRes = strCompare(midVal, targetVal, isNumber, stringLocaleCompare);
      return isAsc ? compareRes : -compareRes;
    });
    const sIndex = binarySearch(data, (midIndex) => customCompareFn(data[midIndex], newItem));
    data.splice(sIndex, 0, newItem);
  }
  return data;
}
function binarySearch(searchArray, compareCallback) {
  let sIndex = 0;
  let eIndex = searchArray.length - 1;
  while (sIndex <= eIndex) {
    const midIndex = Math.floor((sIndex + eIndex) / 2);
    const compareRes = compareCallback(midIndex);
    if (compareRes === 0) {
      sIndex = midIndex;
      break;
    } else if (compareRes < 0) {
      sIndex = midIndex + 1;
    } else {
      eIndex = midIndex - 1;
    }
  }
  return sIndex;
}
function strCompare(a, b, isNumber, localeCompare = false) {
  let _a = a;
  let _b = b;
  if (isNumber) {
    _a = +a;
    _b = +b;
  } else if (localeCompare) {
    return String(a).localeCompare(b);
  }
  if (_a > _b) return 1;
  else if (_a === _b) return 0;
  else return -1;
}
function separatedData(sortOption, targetDataSource, isNumber) {
  const emptyArr = [];
  const valueArr = [];
  const sortField = sortOption.sortField || sortOption.dataIndex;
  for (let i = 0, len = targetDataSource.length; i < len; i++) {
    const row = targetDataSource[i];
    const isEmpty = isEmptyValue(row == null ? void 0 : row[sortField], isNumber);
    if (isEmpty) {
      emptyArr.push(row);
    } else {
      valueArr.push(row);
    }
  }
  return [valueArr, emptyArr];
}
function tableSort(sortOption, order, dataSource, sortConfig = {}) {
  if (!(dataSource == null ? void 0 : dataSource.length) || !sortOption) return dataSource || [];
  sortConfig = { ...DEFAULT_SORT_CONFIG, ...sortConfig };
  let targetDataSource = dataSource.slice();
  let sortField = sortOption.sortField || sortOption.dataIndex;
  const { defaultSort, stringLocaleCompare, emptyToBottom, sortChildren } = sortConfig;
  if (!order && defaultSort) {
    order = defaultSort.order;
    sortField = defaultSort.dataIndex;
  }
  if (typeof sortOption.sorter === "function") {
    const customSorterData = sortOption.sorter(targetDataSource, { order, column: sortOption });
    if (customSorterData) targetDataSource = customSorterData;
    if (sortChildren) {
      targetDataSource.forEach((item) => {
        var _a;
        if (!((_a = item.children) == null ? void 0 : _a.length)) return;
        item.children = tableSort(sortOption, order, item.children, sortConfig);
      });
    }
  } else if (order) {
    let { sortType } = sortOption;
    if (!sortType) sortType = typeof dataSource[0][sortField];
    const isNumber = sortType === "number";
    const [valueArr, emptyArr] = separatedData(sortOption, targetDataSource, isNumber);
    if (order === "asc") {
      valueArr.sort((a, b) => strCompare(a[sortField], b[sortField], isNumber, stringLocaleCompare));
    } else {
      valueArr.sort((a, b) => strCompare(b[sortField], a[sortField], isNumber, stringLocaleCompare));
    }
    targetDataSource = order === "desc" || emptyToBottom ? valueArr.concat(emptyArr) : emptyArr.concat(valueArr);
    if (sortChildren) {
      targetDataSource.forEach((item) => {
        var _a;
        if (!((_a = item.children) == null ? void 0 : _a.length)) return;
        item.children = tableSort(sortOption, order, item.children, sortConfig);
      });
    }
  }
  return targetDataSource;
}
function howDeepTheHeader(arr, level = 0) {
  const levels = [level];
  arr.forEach((item) => {
    var _a;
    if ((_a = item.children) == null ? void 0 : _a.length) {
      levels.push(howDeepTheHeader(item.children, level + 1));
    }
  });
  return Math.max(...levels);
}
function transformWidthToStr(width) {
  if (width === void 0) return;
  const numberWidth = Number(width);
  return width + (!Number.isNaN(numberWidth) ? "px" : "");
}
function getBrowsersVersion(browserName) {
  try {
    const reg = new RegExp(`${browserName}/\\d+`, "i");
    const userAgent = navigator.userAgent.match(reg);
    if (userAgent) {
      return +userAgent[0].split("/")[1];
    }
  } catch (e) {
    console.error("Cannot get version", e);
  }
  return 100;
}
function pureCellKeyGen(rowKey, colKey) {
  return rowKey + CELL_KEY_SEPARATE + colKey;
}
function getClosestTr(target) {
  return target == null ? void 0 : target.closest("tr");
}
function getClosestTh(target) {
  return target == null ? void 0 : target.closest("th");
}
function getClosestTd(target) {
  return target == null ? void 0 : target.closest("td");
}
function getClosestTrIndex(target) {
  const tr = getClosestTr(target);
  if (!tr) return -1;
  return Number(tr.dataset.rowI);
}
function getClosestColKey(target) {
  var _a;
  return (_a = getClosestTd(target)) == null ? void 0 : _a.dataset.colKey;
}
function throttle(fn, delay) {
  let timer;
  let lastArgs = null;
  const callFn = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };
  return function(...args) {
    lastArgs = args;
    if (!timer) {
      callFn();
      timer = self.setTimeout(() => {
        callFn();
        timer = 0;
      }, delay);
    }
  };
}
function rafThrottle(fn) {
  let rafId = null;
  let lastArgs = null;
  const callFn = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };
  return function(...args) {
    lastArgs = args;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        callFn();
        rafId = null;
      });
    }
  };
}
function getColWidth(col) {
  const val = col.minWidth ?? col.width ?? DEFAULT_COL_WIDTH;
  if (typeof val === "number") {
    return Math.floor(val);
  }
  return parseInt(val);
}
function getCalculatedColWidth(col) {
  return (col == null ? void 0 : col.__W__) || DEFAULT_COL_WIDTH;
}
function createStkTableId() {
  let id = window.__STK_TB_ID_COUNT__;
  if (!id) id = 0;
  id += 1;
  window.__STK_TB_ID_COUNT__ = id;
  return STK_ID_PREFIX + id.toString(36);
}
const MY_FN_NAME = "stkName";
function useAreaSelection(props, emits, tableContainerRef, dataSourceCopy, tableHeaderLast, colKeyGen, cellKeyGen, scrollTo, virtualScroll, virtualScrollX, getRowIndex, getColumnIndex) {
  const EDGE_ZONE = 40;
  const SCROLL_SPEED_MAX = 15;
  const POINT_EDGE_OFFSET = 2;
  const KEY_ARROW_UP = "ArrowUp";
  const KEY_ARROW_DOWN = "ArrowDown";
  const KEY_ARROW_LEFT = "ArrowLeft";
  const KEY_ARROW_RIGHT = "ArrowRight";
  const KEY_TAB = "Tab";
  const KEY_ESCAPE = "Escape";
  const KEY_ESC = "Esc";
  const KEY_C = "c";
  const ATTR_CELL_SELECTED = "data-cs-s";
  const ATTR_CELL_TOP = "data-cs-t";
  const ATTR_CELL_BOTTOM = "data-cs-b";
  const ATTR_CELL_LEFT = "data-cs-l";
  const ATTR_CELL_RIGHT = "data-cs-r";
  const ATTR_ROW_SELECTED = "data-rs-s";
  const selectionRanges = ref([]);
  const isSelecting = ref(false);
  let anchorCell = null;
  let autoScrollRafId = 0;
  let lastMouseClientX = 0;
  let lastMouseClientY = 0;
  const config = computed(() => {
    if (typeof props.areaSelection === "boolean") {
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
        ...userHighlight
      },
      ...restConfig
    };
  });
  const keyboardEnabled = computed(() => config.value.keyboard);
  const ctrlEnabled = computed(() => config.value.ctrl);
  const shiftEnabled = computed(() => config.value.shift);
  const highlightCellEnabled = computed(() => {
    var _a;
    return (_a = config.value.highlight) == null ? void 0 : _a.cell;
  });
  const highlightRowEnabled = computed(() => {
    var _a;
    return (_a = config.value.highlight) == null ? void 0 : _a.row;
  });
  const colKeyToIndexMap = computed(() => {
    const headers = tableHeaderLast.value;
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < headers.length; i++) {
      map.set(colKeyGen.value(headers[i]), i);
    }
    return map;
  });
  const getFixedColWidths = computed(() => {
    var _a, _b;
    const cols = tableHeaderLast.value;
    const leftWidths = new Array(cols.length + 1).fill(0);
    const rightWidths = new Array(cols.length + 1).fill(0);
    let leftSum = 0;
    for (let i = 0; i < cols.length; i++) {
      leftWidths[i] = leftSum;
      if (((_a = cols[i]) == null ? void 0 : _a.fixed) === "left") {
        leftSum += getCalculatedColWidth(cols[i]);
      }
    }
    leftWidths[cols.length] = leftSum;
    let rightSum = 0;
    for (let i = cols.length - 1; i >= 0; i--) {
      rightWidths[i] = rightSum;
      if (((_b = cols[i]) == null ? void 0 : _b.fixed) === "right") {
        rightSum += getCalculatedColWidth(cols[i]);
      }
    }
    return (colIndex) => {
      return [leftWidths[colIndex] ?? 0, rightWidths[colIndex + 1] ?? 0];
    };
  });
  let selectedCellKeys = /* @__PURE__ */ new Set();
  function recomputeSelectedCellKeys() {
    const ranges = selectionRanges.value;
    if (!ranges.length) {
      selectedCellKeys = /* @__PURE__ */ new Set();
      return;
    }
    const keys = /* @__PURE__ */ new Set();
    const cols = tableHeaderLast.value;
    const data = dataSourceCopy.value;
    for (const range of ranges) {
      const {
        begin: { row: r1, col: c1 },
        end: { row: r2, col: c2 }
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
  function updateSelectionDOM() {
    const container = tableContainerRef.value;
    if (!container) return;
    const cellHighlight = highlightCellEnabled.value;
    const rowHighlight = highlightRowEnabled.value;
    const oldSelectedCells = container.querySelectorAll(`[${ATTR_CELL_SELECTED}]`);
    for (let i = 0; i < oldSelectedCells.length; i++) {
      const el = oldSelectedCells[i];
      el.removeAttribute(ATTR_CELL_SELECTED);
      el.removeAttribute(ATTR_CELL_TOP);
      el.removeAttribute(ATTR_CELL_BOTTOM);
      el.removeAttribute(ATTR_CELL_LEFT);
      el.removeAttribute(ATTR_CELL_RIGHT);
    }
    const oldSelectedRows = container.querySelectorAll(`[${ATTR_ROW_SELECTED}]`);
    for (let i = 0; i < oldSelectedRows.length; i++) {
      oldSelectedRows[i].removeAttribute(ATTR_ROW_SELECTED);
    }
    recomputeSelectedCellKeys();
    const ranges = selectionRanges.value;
    if (!ranges.length) return;
    const tbody = container.querySelector(".stk-tbody-main");
    if (!tbody) return;
    if (rowHighlight) {
      for (const range of ranges) {
        const { minRow, maxRow } = normalizeRange(range);
        for (let r = minRow; r <= maxRow; r++) {
          const tr = tbody.querySelector(`tr[data-row-i="${r}"]`);
          if (tr) tr.setAttribute(ATTR_ROW_SELECTED, "");
        }
      }
    }
    if (cellHighlight) {
      const lastRange = ranges[ranges.length - 1];
      const { minRow: lrMinRow, maxRow: lrMaxRow, minCol: lrMinCol, maxCol: lrMaxCol } = normalizeRange(lastRange);
      const trs = tbody.querySelectorAll("tr[data-row-i]");
      for (let t = 0; t < trs.length; t++) {
        const tr = trs[t];
        const rowIndex = parseInt(tr.getAttribute("data-row-i"), 10);
        let inAnyRange = false;
        for (const range of ranges) {
          const { minRow, maxRow } = normalizeRange(range);
          if (rowIndex >= minRow && rowIndex <= maxRow) {
            inAnyRange = true;
            break;
          }
        }
        if (!inAnyRange) continue;
        const tds = tr.querySelectorAll("td[data-col-key]");
        for (let d = 0; d < tds.length; d++) {
          const td = tds[d];
          const colKey = td.getAttribute("data-col-key");
          const colIndex = colKeyToIndexMap.value.get(colKey);
          if (colIndex === void 0 || colIndex < 0) continue;
          const data = dataSourceCopy.value;
          const row = data[rowIndex];
          const cols = tableHeaderLast.value;
          if (!row || !cols[colIndex]) continue;
          const ck = cellKeyGen(row, cols[colIndex]);
          if (!selectedCellKeys.has(ck)) continue;
          td.setAttribute(ATTR_CELL_SELECTED, "");
          const isInLastRange = rowIndex >= lrMinRow && rowIndex <= lrMaxRow && colIndex >= lrMinCol && colIndex <= lrMaxCol;
          if (isInLastRange) {
            const effEndRow = rowIndex + (parseInt(td.getAttribute("rowspan") || "1", 10) || 1) - 1;
            const effEndCol = colIndex + (parseInt(td.getAttribute("colspan") || "1", 10) || 1) - 1;
            if (rowIndex === lrMinRow) td.setAttribute(ATTR_CELL_TOP, "");
            if (effEndRow === lrMaxRow) td.setAttribute(ATTR_CELL_BOTTOM, "");
            if (colIndex === lrMinCol) td.setAttribute(ATTR_CELL_LEFT, "");
            if (effEndCol === lrMaxCol) td.setAttribute(ATTR_CELL_RIGHT, "");
          }
        }
      }
    }
  }
  watch(
    () => {
      const ranges = selectionRanges.value;
      const vs = virtualScroll.value;
      const vsx = virtualScrollX.value;
      return [
        ranges.length,
        ranges.length > 0 ? JSON.stringify(ranges.map((r) => r.index)) : "",
        vsx.scrollLeft,
        vs.startIndex,
        vs.endIndex,
        vsx.startIndex,
        vsx.endIndex,
        dataSourceCopy.value.length,
        tableHeaderLast.value.length
      ];
    },
    () => {
      nextTick(updateSelectionDOM);
    },
    { flush: "post" }
  );
  onMounted(() => {
    addListener();
  });
  onBeforeUnmount(() => {
    removeListener();
  });
  watch([() => dataSourceCopy.value.length, () => tableHeaderLast.value.length], ([rowCount, colCount]) => {
    if (!config.value.enabled) return;
    if (anchorCell) {
      if (rowCount === 0 || colCount === 0) {
        anchorCell = null;
      } else {
        anchorCell.rowIndex = clamp(anchorCell.rowIndex, 0, rowCount - 1);
        anchorCell.colIndex = clamp(anchorCell.colIndex, 0, colCount - 1);
      }
    }
    if (!selectionRanges.value.length) return;
    if (rowCount === 0 || colCount === 0) {
      clearSelectedArea();
      emitSelectionChange();
      return;
    }
    const maxRow = rowCount - 1;
    const maxCol = colCount - 1;
    let changed = false;
    const newRanges = [];
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
    var _a;
    removeListener();
    (_a = tableContainerRef.value) == null ? void 0 : _a.addEventListener("keydown", onKeydown);
  }
  function removeListener() {
    var _a;
    (_a = tableContainerRef.value) == null ? void 0 : _a.removeEventListener("keydown", onKeydown);
    document.removeEventListener("mousemove", onDocumentMouseMove);
    document.removeEventListener("mouseup", onDocumentMouseUp);
    stopAutoScroll();
  }
  function normalizeRange(range) {
    const { begin, end } = range.index;
    return {
      minRow: Math.min(begin.row, end.row),
      maxRow: Math.max(begin.row, end.row),
      minCol: Math.min(begin.col, end.col),
      maxCol: Math.max(begin.col, end.col)
    };
  }
  function makeRange(beginRow, beginCol, endRow, endCol) {
    return {
      index: {
        x: [beginCol, endCol],
        y: [beginRow, endRow],
        begin: { row: beginRow, col: beginCol },
        end: { row: endRow, col: endCol }
      }
    };
  }
  function getColIndexByKey(colKey) {
    if (!colKey) return -1;
    return colKeyToIndexMap.value.get(colKey) ?? -1;
  }
  function getMergeSpan(rowIndex, colIndex) {
    const data = dataSourceCopy.value;
    const cols = tableHeaderLast.value;
    const row = data[rowIndex];
    const col = cols[colIndex];
    if (!row || !col || !col.mergeCells) return [1, 1];
    const { rowspan = 1, colspan = 1 } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};
    return [rowspan || 1, colspan || 1];
  }
  function expandRangeToCoverMergedCells(range) {
    var _a;
    const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
    const data = dataSourceCopy.value;
    const cols = tableHeaderLast.value;
    const rowCount = data.length;
    const colCount = cols.length;
    const mergeColIndices = [];
    for (let c = 0; c < colCount; c++) {
      if ((_a = cols[c]) == null ? void 0 : _a.mergeCells) mergeColIndices.push(c);
    }
    if (!mergeColIndices.length) return range;
    let [eMinRow, eMaxRow, eMinCol, eMaxCol] = [minRow, maxRow, minCol, maxCol];
    let changed = true;
    let guard = 0;
    while (changed && guard++ < 100) {
      changed = false;
      for (const c of mergeColIndices) {
        if (c < eMinCol || c > eMaxCol) continue;
        const [rs] = getMergeSpan(eMaxRow, c);
        if (rs > 1 && eMaxRow + rs - 1 < rowCount && eMaxRow + rs - 1 > eMaxRow) {
          eMaxRow = eMaxRow + rs - 1;
          changed = true;
        }
      }
      for (let r = eMinRow; r <= eMaxRow; r++) {
        const [, cs] = getMergeSpan(r, eMaxCol);
        if (cs > 1 && eMaxCol + cs - 1 < colCount && eMaxCol + cs - 1 > eMaxCol) {
          eMaxCol = eMaxCol + cs - 1;
          changed = true;
        }
      }
      for (const c of mergeColIndices) {
        if (c < eMinCol || c > eMaxCol) continue;
        for (let r = eMinRow - 1; r >= 0 && r > eMinRow - 500; r--) {
          const [rs] = getMergeSpan(r, c);
          if (rs <= 1) continue;
          const endRow = r + rs - 1;
          if (endRow >= eMinRow) {
            if (r < eMinRow) {
              eMinRow = r;
              changed = true;
            }
          } else {
            break;
          }
        }
      }
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
    const { begin, end } = range.index;
    const newBeginRow = begin.row < end.row || begin.row === end.row ? eMinRow : eMaxRow;
    const newEndRow = begin.row < end.row || begin.row === end.row ? eMaxRow : eMinRow;
    const newBeginCol = begin.col <= end.col ? eMinCol : eMaxCol;
    const newEndCol = begin.col <= end.col ? eMaxCol : eMinCol;
    return makeRange(newBeginRow, newBeginCol, newEndRow, newEndCol);
  }
  function getColPosition(colIndex) {
    let left = 0;
    const cols = tableHeaderLast.value;
    for (let i = 0; i < cols.length; i++) {
      const colWidth = getCalculatedColWidth(cols[i]);
      if (i === colIndex) return [left, colWidth];
      left += colWidth;
    }
    return [left, 0];
  }
  function getMovementDelta(key, shiftKey) {
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
        colDelta = shiftKey ? -1 : 1;
        break;
    }
    return [rowDelta, colDelta];
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
  function handleTabWrap(row, col, rawCol, rowCount, colCount) {
    if (rawCol >= colCount) return [Math.min(row + 1, rowCount - 1), 0];
    if (rawCol < 0) return [Math.max(row - 1, 0), colCount - 1];
    return [row, col];
  }
  function calculateAutoScrollDelta(mouseX, mouseY, rect) {
    const { top, bottom, left, right } = rect;
    let deltaX = 0;
    let deltaY = 0;
    if (mouseY < top + EDGE_ZONE) {
      const dist = Math.max(0, top + EDGE_ZONE - mouseY);
      deltaY = -Math.ceil(dist / EDGE_ZONE * SCROLL_SPEED_MAX);
    } else if (mouseY > bottom - EDGE_ZONE) {
      const dist = Math.max(0, mouseY - (bottom - EDGE_ZONE));
      deltaY = Math.ceil(dist / EDGE_ZONE * SCROLL_SPEED_MAX);
    }
    if (mouseX < left + EDGE_ZONE) {
      const dist = Math.max(0, left + EDGE_ZONE - mouseX);
      deltaX = -Math.ceil(dist / EDGE_ZONE * SCROLL_SPEED_MAX);
    } else if (mouseX > right - EDGE_ZONE) {
      const dist = Math.max(0, mouseX - (right - EDGE_ZONE));
      deltaX = Math.ceil(dist / EDGE_ZONE * SCROLL_SPEED_MAX);
    }
    return { deltaX, deltaY };
  }
  function onSelectionMouseDown(e) {
    if (!config.value.enabled || e.button !== 0) return;
    const rowIndex = getClosestTrIndex(e.target);
    const colKey = getClosestColKey(e.target);
    const colIndex = getColIndexByKey(colKey);
    if (rowIndex < 0 || colIndex < 0) return;
    const ctrlKey = e.ctrlKey || e.metaKey;
    const range = expandRangeToCoverMergedCells(makeRange(rowIndex, colIndex, rowIndex, colIndex));
    if (e.shiftKey && anchorCell && shiftEnabled.value) {
      const ranges = selectionRanges.value.slice();
      const shiftRange = expandRangeToCoverMergedCells(
        makeRange(anchorCell.rowIndex, anchorCell.colIndex, rowIndex, colIndex)
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
        selectionRanges.value = selectionRanges.value.concat([range]);
      } else {
        selectionRanges.value = [range];
      }
    }
    isSelecting.value = true;
    lastMouseClientX = e.clientX;
    lastMouseClientY = e.clientY;
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener("mouseup", onDocumentMouseUp);
  }
  function onDocumentMouseMove(e) {
    if (!isSelecting.value) return;
    lastMouseClientX = e.clientX;
    lastMouseClientY = e.clientY;
    updateSelectionFromEvent(e);
    checkAutoScroll();
  }
  function updateSelectionFromEvent(e) {
    const target = e.target;
    if (!target) return;
    const rowIndex = getClosestTrIndex(target);
    if (Number.isNaN(rowIndex) || rowIndex < 0) return;
    const colKey = getClosestColKey(target);
    const colIndex = getColIndexByKey(colKey);
    if (colIndex < 0) return;
    updateSelectionEnd(rowIndex, colIndex);
  }
  function updateSelectionEnd(endRowIndex, endColIndex) {
    if (!anchorCell) return;
    const newRange = expandRangeToCoverMergedCells(
      makeRange(anchorCell.rowIndex, anchorCell.colIndex, endRowIndex, endColIndex)
    );
    const ranges = [...selectionRanges.value];
    if (ranges.length > 0) {
      ranges[ranges.length - 1] = newRange;
    } else {
      ranges.push(newRange);
    }
    selectionRanges.value = ranges;
  }
  function checkAutoScroll() {
    const container = tableContainerRef.value;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const { top, bottom, left, right } = rect;
    const nearEdge = lastMouseClientY < top + EDGE_ZONE || lastMouseClientY > bottom - EDGE_ZONE || lastMouseClientX < left + EDGE_ZONE || lastMouseClientX > right - EDGE_ZONE;
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
    const { deltaX, deltaY } = calculateAutoScrollDelta(lastMouseClientX, lastMouseClientY, rect);
    if (deltaX !== 0 || deltaY !== 0) {
      container.scrollTop += deltaY;
      container.scrollLeft += deltaX;
      updateSelectionFromPoint(container, rect);
    }
    if (isSelecting.value && (deltaX !== 0 || deltaY !== 0)) {
      autoScrollRafId = requestAnimationFrame(autoScrollLoop);
    } else {
      autoScrollRafId = 0;
    }
  }
  function updateSelectionFromPoint(container, containerRect) {
    const thead = container.querySelector("thead");
    const { top, bottom, left, right } = containerRect;
    const headerBottom = thead ? top + thead.offsetHeight : top;
    const x = Math.max(left + POINT_EDGE_OFFSET, Math.min(lastMouseClientX, right - POINT_EDGE_OFFSET));
    const y = Math.max(headerBottom + POINT_EDGE_OFFSET, Math.min(lastMouseClientY, bottom - POINT_EDGE_OFFSET));
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const td = getClosestTd(el);
    const tr = getClosestTr(el);
    if (!td || !tr) return;
    const rowIndex = getClosestTrIndex(tr);
    const colKey = getClosestColKey(td);
    const colIndex = getColIndexByKey(colKey);
    if (Number.isNaN(rowIndex) || rowIndex < 0 || colIndex < 0) return;
    updateSelectionEnd(rowIndex, colIndex);
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
    document.removeEventListener("mousemove", onDocumentMouseMove);
    document.removeEventListener("mouseup", onDocumentMouseUp);
    const ranges = selectionRanges.value;
    if (ranges.length) {
      const expanded = expandRangeToCoverMergedCells(ranges[ranges.length - 1]);
      if (expanded !== ranges[ranges.length - 1]) {
        const newRanges = [...ranges];
        newRanges[newRanges.length - 1] = expanded;
        selectionRanges.value = newRanges;
      }
    }
    emitSelectionChange();
  }
  function emitSelectionChange() {
    emits("area-selection-change", selectionRanges.value);
  }
  function getFormatCellFn() {
    const cfg = config.value;
    return typeof cfg.formatCellForClipboard === "function" ? cfg.formatCellForClipboard : null;
  }
  function copySelectedArea() {
    const ranges = selectionRanges.value;
    if (!ranges.length) return "";
    const range = ranges[ranges.length - 1];
    const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
    const data = dataSourceCopy.value;
    const cols = tableHeaderLast.value;
    const formatCell = getFormatCellFn();
    const lines = [];
    for (let r = minRow; r <= maxRow; r++) {
      const row = data[r];
      if (!row) continue;
      const cells = [];
      for (let c = minCol; c <= maxCol; c++) {
        const col = cols[c];
        if (!col) {
          cells.push("");
          continue;
        }
        const rawValue = row[col.dataIndex];
        cells.push(formatCell ? formatCell(row, col, rawValue) : !rawValue ? "" : String(rawValue));
      }
      lines.push(cells.join("	"));
    }
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).catch(() => {
      console.warn("Failed to copy to clipboard");
    });
    return text;
  }
  function blurCellElement() {
    const container = tableContainerRef.value;
    const activeEl = document.activeElement;
    if (container && activeEl && container.contains(activeEl) && activeEl !== container) {
      container.focus({ preventScroll: true });
    }
  }
  function onKeydown(e) {
    if (!config.value.enabled) return;
    const key = e.key;
    if (key === KEY_ESCAPE || key === KEY_ESC) {
      blurCellElement();
      if (selectionRanges.value.length) {
        e.preventDefault();
      }
      return;
    }
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
    if (!selectionRanges.value.length) {
      anchorCell = { rowIndex: 0, colIndex: 0 };
      selectionRanges.value = [makeRange(0, 0, 0, 0)];
      emitSelectionChange();
      scrollToCell(0, 0);
      return;
    }
    const [rowDelta, colDelta] = getMovementDelta(key, e.shiftKey);
    if (e.shiftKey && isArrowKey && shiftEnabled.value) {
      blurCellElement();
      const ranges = [...selectionRanges.value];
      const range = ranges.length > 0 ? ranges[ranges.length - 1] : null;
      if (!range) return;
      const { begin, end } = range.index;
      let newEndRow = end.row + rowDelta;
      let newEndCol = end.col + colDelta;
      newEndRow = clamp(newEndRow, 0, rowCount - 1);
      newEndCol = clamp(newEndCol, 0, colCount - 1);
      ranges[ranges.length - 1] = makeRange(begin.row, begin.col, newEndRow, newEndCol);
      selectionRanges.value = ranges;
      scrollToCell(newEndRow, newEndCol);
    } else {
      blurCellElement();
      const ranges = selectionRanges.value;
      const range = ranges.length > 0 ? ranges[ranges.length - 1] : null;
      const baseRow = range ? normalizeRange(range).minRow : 0;
      const baseCol = range ? normalizeRange(range).minCol : 0;
      let newRow = baseRow + rowDelta;
      let newCol = baseCol + colDelta;
      newRow = clamp(newRow, 0, rowCount - 1);
      newCol = clamp(newCol, 0, colCount - 1);
      if (isTabKey) {
        const rawCol = baseCol + colDelta;
        const [tabRow, tabCol] = handleTabWrap(baseRow, newCol, rawCol, rowCount, colCount);
        newRow = tabRow;
        newCol = tabCol;
      }
      anchorCell = { rowIndex: newRow, colIndex: newCol };
      selectionRanges.value = [makeRange(newRow, newCol, newRow, newCol)];
      scrollToCell(newRow, newCol);
    }
    emitSelectionChange();
  }
  function scrollToCell(rowIndex, colIndex) {
    const container = tableContainerRef.value;
    if (!container) return;
    const row = dataSourceCopy.value[rowIndex];
    const col = tableHeaderLast.value[colIndex];
    if (!row || !col) return;
    const thead = container.querySelector("thead");
    const headerHeight = thead ? thead.offsetHeight : 0;
    const tfoot = container.querySelector("tfoot");
    const footerHeight = tfoot ? tfoot.offsetHeight : 0;
    const vs = virtualScroll.value;
    const vsx = virtualScrollX.value;
    const isScrollRowByRow = props.scrollRowByRow;
    const rowHeight = vs.rowHeight;
    const targetRowTop = rowIndex * rowHeight;
    const targetRowBottom = targetRowTop + rowHeight;
    const visibleTop = isScrollRowByRow ? vs.scrollTop : container.scrollTop;
    const visibleBottom = visibleTop + vs.containerHeight - headerHeight - footerHeight;
    let newScrollTop = null;
    if (targetRowTop < visibleTop) {
      newScrollTop = targetRowTop;
    } else if (targetRowBottom > visibleBottom) {
      newScrollTop = targetRowBottom - (vs.containerHeight - headerHeight - footerHeight);
    }
    const [targetColLeft, targetColWidth] = getColPosition(colIndex);
    const targetColRight = targetColLeft + targetColWidth;
    const visibleLeft = container.scrollLeft;
    const visibleRight = visibleLeft + vsx.containerWidth;
    const [leftFixedWidth, rightFixedWidth] = getFixedColWidths.value(colIndex);
    let newScrollLeft = null;
    if (targetColLeft < visibleLeft + leftFixedWidth) {
      newScrollLeft = targetColLeft - leftFixedWidth;
    } else if (targetColRight > visibleRight - rightFixedWidth) {
      newScrollLeft = targetColRight - vsx.containerWidth + rightFixedWidth;
    }
    if (newScrollTop !== null || newScrollLeft !== null) {
      scrollTo(newScrollTop, newScrollLeft);
    }
  }
  function getSelectedArea() {
    const ranges = selectionRanges.value;
    if (!ranges.length) return { rows: [], cols: [], ranges: [] };
    const data = dataSourceCopy.value;
    const cols = tableHeaderLast.value;
    const rowSet = /* @__PURE__ */ new Set();
    const colSet = /* @__PURE__ */ new Set();
    for (const range of ranges) {
      const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
      for (let r = minRow; r <= maxRow; r++) rowSet.add(r);
      for (let c = minCol; c <= maxCol; c++) colSet.add(c);
    }
    const sortedRows = [...rowSet].sort((a, b) => a - b);
    const sortedCols = [...colSet].sort((a, b) => a - b);
    return {
      rows: sortedRows.map((i) => data[i]).filter(Boolean),
      cols: sortedCols.map((i) => cols[i]).filter(Boolean),
      ranges: ranges.map((r) => ({ ...r }))
    };
  }
  function clearSelectedArea() {
    selectionRanges.value = [];
    isSelecting.value = false;
  }
  function setAreaSelection(ranges, option = {}) {
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
      beginRow = typeof begin.row === "number" ? begin.row : getRowIndex(begin.row);
      endRow = typeof end.row === "number" ? end.row : getRowIndex(end.row);
      const beginColInput = typeof begin.col === "number" ? begin.col : begin.col ? getColumnIndex(begin.col) : void 0;
      const endColInput = typeof end.col === "number" ? end.col : end.col ? getColumnIndex(end.col) : void 0;
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
    onMD: onSelectionMouseDown
  };
}
const useAreaSelectionName = "useAreaSelection";
useAreaSelection[MY_FN_NAME] = useAreaSelectionName;
const ON_DEMAND_FEATURE = {
  [useAreaSelectionName]: (props) => {
    if ("useAreaSelection" in props) {
      console.warn("useAreaSelection is not registered");
    }
    return {
      config: computed(() => ({ enabled: false })),
      isSelecting: ref(false),
      onMD: () => {
      },
      // getClass: () => [],
      // getRowClass: () => [],
      get: () => ({ rows: [], cols: [], ranges: [] }),
      set: () => [],
      clear: () => {
      },
      copy: () => ""
    };
  }
};
function registerFeature(feature) {
  const features = Array.isArray(feature) ? feature : [feature];
  features.forEach((f) => {
    const fnName = f[MY_FN_NAME];
    if (!fnName) {
      console.warn("invalid feature");
      return;
    }
    ON_DEMAND_FEATURE[fnName] = f;
  });
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$7 = {};
const _hoisted_1$6 = {
  class: "drag-row-handle",
  draggable: "true"
};
function _sfc_render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("span", _hoisted_1$6, [..._cache[0] || (_cache[0] = [
    createElementVNode("svg", {
      viewBox: "0 0 1024 1024",
      width: "20",
      height: "20",
      fill: "currentColor"
    }, [
      createElementVNode("path", { d: "M640 853.3a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m-256 0a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m256-256a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m-256 0a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m256-256a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3zM384 341.3a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z" })
    ], -1)
  ])]);
}
const DragHandle = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$2]]);
const _sfc_main$6 = {};
const _hoisted_1$5 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16"
};
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$5, [..._cache[0] || (_cache[0] = [
    createElementVNode("polygon", {
      class: "arrow-up",
      fill: "#757699",
      points: "8 2 4.8 6 11.2 6"
    }, null, -1),
    createElementVNode("polygon", {
      class: "arrow-down",
      transform: "translate(8, 12) rotate(-180) translate(-8, -12) ",
      points: "8 10 4.8 14 11.2 14"
    }, null, -1)
  ])]);
}
const SortIcon = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$1]]);
const _sfc_main$5 = {};
const _hoisted_1$4 = { class: "stk-fold-icon" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$4);
}
const TriangleIcon = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render]]);
const _hoisted_1$3 = ["title"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "TreeNodeCell",
  props: {
    col: {},
    row: {}
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        title: __props.row[__props.col.dataIndex] || "",
        style: normalizeStyle(__props.row.__T_LV__ ? `padding-left:${__props.row.__T_LV__ * 16}px` : "")
      }, [
        __props.row.children !== void 0 ? (openBlock(), createBlock(TriangleIcon, {
          key: 0,
          onClick: _cache[0] || (_cache[0] = ($event) => emit("click"))
        })) : createCommentVNode("", true),
        createElementVNode("span", {
          style: normalizeStyle(!__props.row.children ? "padding-left: 16px;" : null)
        }, toDisplayString(__props.row[__props.col.dataIndex] ?? ""), 5)
      ], 12, _hoisted_1$3);
    };
  }
});
const TagType = {
  TH: 0,
  TD: 1,
  /** tfoot */
  TF: 2
};
function useAutoResize(tableContainerRef, onResize, props, debounceMs) {
  let resizeObserver = null;
  let isObserved = false;
  watch(
    () => props.virtual,
    (v) => {
      if (v) initResizeObserver();
      else removeResizeObserver();
    }
  );
  watch(
    () => props.virtualX,
    (v) => {
      if (v) initResizeObserver();
      else removeResizeObserver();
    }
  );
  onMounted(() => {
    if (props.virtual || props.virtualX) {
      initResizeObserver();
    }
  });
  onBeforeUnmount(() => {
    removeResizeObserver();
  });
  function initResizeObserver() {
    if (isObserved) {
      removeResizeObserver();
    }
    if (window.ResizeObserver) {
      if (!tableContainerRef.value) {
        const watchDom = watch(
          () => tableContainerRef,
          () => {
            initResizeObserver();
            watchDom();
          }
        );
        return;
      }
      resizeObserver = new ResizeObserver(resizeCallback);
      resizeObserver.observe(tableContainerRef.value);
    } else {
      window.addEventListener("resize", resizeCallback);
    }
    isObserved = true;
  }
  function removeResizeObserver() {
    if (!isObserved) return;
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    } else {
      window.removeEventListener("resize", resizeCallback);
    }
    isObserved = false;
  }
  let debounceTime = 0;
  function resizeCallback() {
    if (debounceTime) {
      window.clearTimeout(debounceTime);
    }
    debounceTime = window.setTimeout(() => {
      if (props.autoResize) {
        onResize();
        if (typeof props.autoResize === "function") {
          props.autoResize();
        }
      }
      debounceTime = 0;
    }, debounceMs);
  }
}
function useColResize(props, emits, tableContainerRef, tableHeaderLast, colResizeIndicatorRef, colKeyGen, fixedCols, onColWidthChange) {
  const isColResizing = ref(false);
  let colResizeState = {
    currentCol: null,
    lastCol: null,
    startX: 0,
    startOffsetTableX: 0,
    revertMoveX: false
  };
  const colResizeOn = computed(() => {
    if (Object.prototype.toString.call(props.colResizable) === "[object Object]") {
      return (col) => !props.colResizable.disabled(col);
    }
    return () => props.colResizable;
  });
  onMounted(() => {
    initColResizeEvent();
  });
  onBeforeUnmount(() => {
    clearColResizeEvent();
  });
  function initColResizeEvent() {
    window.addEventListener("mousemove", onThResizeMouseMove);
    window.addEventListener("mouseup", onThResizeMouseUp);
  }
  function clearColResizeEvent() {
    window.removeEventListener("mousemove", onThResizeMouseMove);
    window.removeEventListener("mouseup", onThResizeMouseUp);
  }
  function onThResizeMouseDown(e, col, leftHandle = false) {
    if (!tableContainerRef.value) return;
    e.stopPropagation();
    e.preventDefault();
    const { clientX } = e;
    const { scrollLeft, scrollTop } = tableContainerRef.value;
    const { left } = tableContainerRef.value.getBoundingClientRect();
    const tableHeaderLastValue = tableHeaderLast.value;
    let revertMoveX = false;
    const colKey = colKeyGen.value;
    const colKeyValue = colKey(col);
    const colIndex = tableHeaderLastValue.findIndex((it) => colKey(it) === colKeyValue);
    const fixedIndex = fixedCols.value.indexOf(col);
    const isColFixed = fixedIndex !== -1;
    if (leftHandle) {
      if (isColFixed && col.fixed === "right") {
        revertMoveX = true;
      } else {
        if (colIndex - 1 >= 0) {
          col = tableHeaderLastValue[colIndex - 1];
        }
      }
    } else {
      if (isColFixed && col.fixed === "right") {
        col = fixedCols.value[fixedIndex + 1] || col;
      }
    }
    const offsetTableX = clientX - left + scrollLeft;
    isColResizing.value = true;
    Object.assign(colResizeState, {
      currentCol: col,
      lastCol: findLastChildCol(col),
      startX: clientX,
      startOffsetTableX: offsetTableX,
      revertMoveX
    });
    if (colResizeIndicatorRef.value) {
      const style = colResizeIndicatorRef.value.style;
      style.display = "block";
      style.left = offsetTableX + "px";
      style.top = scrollTop + "px";
    }
  }
  function onThResizeMouseMove(e) {
    if (!isColResizing.value) return;
    e.stopPropagation();
    e.preventDefault();
    const { lastCol, startX, startOffsetTableX } = colResizeState;
    const { clientX } = e;
    let moveX = clientX - startX;
    const currentColWidth = getCalculatedColWidth(lastCol);
    const minWidth = (lastCol == null ? void 0 : lastCol.minWidth) ?? props.colMinWidth;
    if (currentColWidth + moveX < minWidth) {
      moveX = -currentColWidth;
    }
    const offsetTableX = startOffsetTableX + moveX;
    if (!colResizeIndicatorRef.value) return;
    colResizeIndicatorRef.value.style.left = offsetTableX + "px";
  }
  function onThResizeMouseUp(e) {
    if (!isColResizing.value) return;
    const { startX, lastCol, revertMoveX } = colResizeState;
    const { clientX } = e;
    const moveX = revertMoveX ? startX - clientX : clientX - startX;
    let width = getCalculatedColWidth(lastCol) + moveX;
    if (width < props.colMinWidth) width = props.colMinWidth;
    const colKey = colKeyGen.value;
    const curCol = tableHeaderLast.value.find((it) => colKey(it) === colKey(lastCol));
    if (curCol) {
      curCol.width = width + "px";
      onColWidthChange == null ? void 0 : onColWidthChange();
      emits("update:columns", props.columns.slice());
      emits("col-resize", { ...curCol });
    }
    if (colResizeIndicatorRef.value) {
      const style = colResizeIndicatorRef.value.style;
      style.display = "none";
      style.left = "0";
      style.top = "0";
    }
    isColResizing.value = false;
    colResizeState = {
      currentCol: null,
      lastCol: null,
      startX: 0,
      startOffsetTableX: 0,
      revertMoveX: false
    };
  }
  function findLastChildCol(column) {
    var _a;
    if ((_a = column == null ? void 0 : column.children) == null ? void 0 : _a.length) {
      const lastChild = column.children.slice(-1)[0];
      return findLastChildCol(lastChild);
    }
    return column;
  }
  return [colResizeOn, isColResizing, onThResizeMouseDown];
}
function useFixedCol(props, colKeyGen, getFixedColPosition, tableHeaders, tableHeadersForCalc, tableContainerRef) {
  const fixedShadowCols = shallowRef([]);
  const fixedCols = shallowRef([]);
  const fixedBorderLeftCols = shallowRef([]);
  const fixedColClassMap = computed(() => {
    const colMap = /* @__PURE__ */ new Map();
    const fixedShadowColsValue = fixedShadowCols.value;
    const fixedColsValue = fixedCols.value;
    const fixedBorderLeftColsValue = fixedBorderLeftCols.value;
    const colKeyFn = colKeyGen.value;
    const fixedColShadow = props.fixedColShadow;
    const headers = tableHeaders.value;
    for (let i = 0, len = headers.length; i < len; i++) {
      const cols = headers[i];
      for (let j = 0, colLen = cols.length; j < colLen; j++) {
        const col = cols[j];
        const fixed = col.fixed;
        const showShadow = fixed && fixedColShadow && fixedShadowColsValue.includes(col);
        const classList = [];
        if (fixedColsValue.includes(col)) {
          classList.push("fixed-cell--active");
        }
        if (fixed) {
          classList.push("fixed-cell");
          classList.push("fixed-cell--" + fixed);
        }
        if (showShadow) {
          classList.push("fixed-cell--shadow");
        }
        if (fixed === "right" && fixedBorderLeftColsValue.includes(col)) {
          classList.push("fixed-cell--border-left");
        }
        colMap.set(colKeyFn(col), classList);
      }
    }
    return colMap;
  });
  function updateFixedShadow(virtualScrollX) {
    const fixedColsTemp = [];
    const getFixedColPositionValue = getFixedColPosition.value;
    let clientWidth, scrollLeft;
    if (virtualScrollX == null ? void 0 : virtualScrollX.value) {
      const { containerWidth: cw, scrollLeft: sl } = virtualScrollX.value;
      clientWidth = cw;
      scrollLeft = sl;
    } else {
      const { clientWidth: cw, scrollLeft: sl } = tableContainerRef.value;
      clientWidth = cw;
      scrollLeft = sl;
    }
    const leftShadowCol = [];
    const rightShadowCol = [];
    const len = tableHeadersForCalc.value.length;
    for (let level = 0; level < len; level++) {
      const row = tableHeadersForCalc.value[level];
      let rightSuffixStart = row.length;
      while (rightSuffixStart > 0 && row[rightSuffixStart - 1].fixed === "right") {
        rightSuffixStart--;
      }
      let left = 0;
      for (let i = 0, rowLen = row.length; i < rowLen; i++) {
        const col = row[i];
        const position = getFixedColPositionValue(col);
        const isFixedLeft = col.fixed === "left";
        const isFixedRight = col.fixed === "right";
        if (isFixedLeft && position + scrollLeft > left) {
          fixedColsTemp.push(col);
          leftShadowCol[level] = col;
        }
        left += getCalculatedColWidth(col);
        if (isFixedRight) {
          const needFix = scrollLeft + clientWidth - left < position;
          if (i >= rightSuffixStart || needFix) {
            fixedColsTemp.push(col);
          }
          if (needFix && !rightShadowCol[level]) {
            rightShadowCol[level] = col;
          }
        }
      }
    }
    if (props.fixedColShadow) {
      fixedShadowCols.value = leftShadowCol.concat(rightShadowCol).filter(Boolean);
    }
    fixedBorderLeftCols.value = rightShadowCol.filter(Boolean);
    fixedCols.value = fixedColsTemp;
  }
  return [fixedCols, fixedColClassMap, updateFixedShadow];
}
function useFixedStyle(props, isRelativeMode, getFixedColPosition, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight) {
  function getFixedStyle(tagType, col, depth = 0) {
    const { fixed } = col;
    if ((tagType === TagType.TD || tagType === TagType.TF) && !fixed) return "";
    const { headerRowHeight, rowHeight } = props;
    const isFixedLeft = fixed === "left";
    const { scrollLeft, scrollWidth, offsetLeft, containerWidth } = virtualScrollX.value;
    const scrollRight = scrollWidth - containerWidth - scrollLeft;
    let style = "";
    if (tagType === TagType.TH) {
      if (!isRelativeMode.value) {
        if (depth) {
          style += `top:${depth * (headerRowHeight ?? rowHeight)}px;`;
        }
      } else {
        style += `top:${virtualScroll.value.scrollTop}px;`;
      }
    } else if (tagType === TagType.TF) {
      style += "bottom:0;";
    }
    if (fixed) {
      if (!isRelativeMode.value) {
        const lr = getFixedColPosition.value(col) + "px";
        if (isFixedLeft) {
          style += `left:${lr};`;
        } else {
          style += `right:${lr};`;
        }
      } else {
        if (isFixedLeft) {
          style += `left:${scrollLeft - (virtualX_on.value ? offsetLeft : 0)}px;`;
        } else {
          style += `right:${Math.max(scrollRight - (virtualX_on.value ? virtualX_offsetRight.value : 0), 0)}px;`;
        }
      }
    }
    return style;
  }
  return getFixedStyle;
}
function useGetFixedColPosition(tableHeadersForCalc, colKeyGen) {
  const getFixedColPosition = computed(() => {
    const colKeyStore = {};
    const refStore = /* @__PURE__ */ new WeakMap();
    const colKeyGenValue = colKeyGen.value;
    tableHeadersForCalc.value.forEach((cols) => {
      let left = 0;
      let rightStartIndex = 0;
      for (let i = 0; i < cols.length; i++) {
        const item = cols[i];
        if (item.fixed === "left") {
          const colKey = colKeyGenValue(item);
          if (colKey) {
            colKeyStore[colKey] = left;
          } else {
            refStore.set(item, left);
          }
          left += getCalculatedColWidth(item);
        }
        if (!rightStartIndex && item.fixed === "right") {
          rightStartIndex = i;
        }
      }
      let right = 0;
      for (let i = cols.length - 1; i >= rightStartIndex; i--) {
        const item = cols[i];
        const colKey = colKeyGenValue(item);
        if (item.fixed === "right") {
          if (colKey) {
            colKeyStore[colKey] = right;
          } else {
            refStore.set(item, right);
          }
          right += getCalculatedColWidth(item);
        }
      }
    });
    return (col) => {
      const colKey = colKeyGenValue(col);
      return colKey ? colKeyStore[colKey] : refStore.get(col) || 0;
    };
  });
  return getFixedColPosition;
}
function useHighlight(props, stkTableId, tableContainerRef) {
  const config = props.highlightConfig;
  const highlightColor = {
    light: HIGHLIGHT_COLOR.light,
    dark: HIGHLIGHT_COLOR.dark
  };
  const highlightDuration = computed(() => config.duration ? config.duration * 1e3 : HIGHLIGHT_DURATION);
  const highlightFrequency = computed(() => config.fps && config.fps > 0 ? 1e3 / config.fps : null);
  const highlightSteps = computed(() => highlightFrequency.value ? Math.round(highlightDuration.value / highlightFrequency.value) : null);
  const highlightFrom = computed(() => highlightColor[props.theme].from);
  const highlightDimRowsAnimation = /* @__PURE__ */ new Map();
  let calcHighlightDimLoopAnimation = false;
  const highlightDimRowsTimeout = /* @__PURE__ */ new Map();
  const highlightDimCellsTimeout = /* @__PURE__ */ new Map();
  const defaultHighlightDimOption = computed(() => {
    const keyframe = { backgroundColor: [highlightFrom.value, ""] };
    if (highlightSteps.value) {
      keyframe.easing = `steps(${highlightSteps.value})`;
    }
    return { duration: highlightDuration.value, keyframe };
  });
  function calcRowHighlightLoop() {
    if (calcHighlightDimLoopAnimation) return;
    calcHighlightDimLoopAnimation = true;
    const recursion = () => {
      window.requestAnimationFrame(
        () => {
          const nowTs = performance.now();
          const keysToDelete = [];
          highlightDimRowsAnimation.forEach((store, rowKeyValue) => {
            const { ts, duration } = store;
            const timeOffset = nowTs - ts;
            if (timeOffset < duration) {
              const shouldDelete = updateRowAnimation(rowKeyValue, store, timeOffset);
              if (shouldDelete) {
                keysToDelete.push(rowKeyValue);
              }
            } else {
              keysToDelete.push(rowKeyValue);
            }
          });
          keysToDelete.forEach((key) => highlightDimRowsAnimation.delete(key));
          if (highlightDimRowsAnimation.size) {
            recursion();
          } else {
            calcHighlightDimLoopAnimation = false;
            highlightDimRowsAnimation.clear();
          }
        }
      );
    };
    recursion();
  }
  function setHighlightDimCell(rowKeyValue, colKeyValue, option = {}) {
    var _a;
    const cellEl = (_a = tableContainerRef.value) == null ? void 0 : _a.querySelector(`[data-row-key="${rowKeyValue}"] [data-col-key="${colKeyValue}"]`);
    if (!cellEl) return;
    const { className, method, duration, keyframe } = {
      className: HIGHLIGHT_CELL_CLASS,
      method: "animation",
      ...defaultHighlightDimOption.value,
      ...option
    };
    if (method === "animation") {
      cellEl.animate(keyframe, duration);
    } else {
      highlightCellsInCssKeyFrame(cellEl, rowKeyValue, colKeyValue, className, duration);
    }
  }
  function setHighlightDimRow(rowKeyValues, option = {}) {
    if (!Array.isArray(rowKeyValues)) rowKeyValues = [rowKeyValues];
    if (!rowKeyValues.length) return;
    const { className, method, keyframe, duration } = {
      className: HIGHLIGHT_ROW_CLASS,
      method: "animation",
      ...defaultHighlightDimOption.value,
      ...option
    };
    const ignoreInvisible = Boolean(option.ignoreInvisible);
    if (method === "animation") {
      if (props.virtual) {
        const nowTs = performance.now();
        for (let i = 0; i < rowKeyValues.length; i++) {
          const rowKeyValue = rowKeyValues[i];
          const store = { ts: nowTs, visible: false, keyframe, duration, ignoreInvisible };
          const shouldDelete = updateRowAnimation(rowKeyValue, store, 0);
          if (ignoreInvisible && shouldDelete) {
            highlightDimRowsAnimation.delete(rowKeyValue);
          } else {
            highlightDimRowsAnimation.set(rowKeyValue, store);
          }
        }
        calcRowHighlightLoop();
      } else {
        for (let i = 0; i < rowKeyValues.length; i++) {
          const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValues[i]));
          if (!rowEl) continue;
          rowEl.animate(keyframe, duration);
        }
      }
    } else {
      highlightRowsInCssKeyframe(rowKeyValues, className, duration);
    }
  }
  function highlightRowsInCssKeyframe(rowKeyValues, className, duration) {
    var _a;
    let needRepaint = false;
    const rowElTemp = [];
    for (let i = 0; i < rowKeyValues.length; i++) {
      const rowKeyValue = rowKeyValues[i];
      const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValue));
      if (!rowEl) continue;
      if (rowEl.classList.contains(className)) {
        rowEl.classList.remove(className);
        needRepaint = true;
      }
      rowElTemp.push(rowEl);
      window.clearTimeout(highlightDimRowsTimeout.get(rowKeyValue));
      highlightDimRowsTimeout.set(
        rowKeyValue,
        window.setTimeout(() => {
          rowEl.classList.remove(className);
          highlightDimRowsTimeout.delete(rowKeyValue);
        }, duration)
      );
    }
    if (needRepaint) {
      void ((_a = tableContainerRef.value) == null ? void 0 : _a.offsetWidth);
    }
    rowElTemp.forEach((el) => el.classList.add(className));
  }
  function highlightCellsInCssKeyFrame(cellEl, rowKeyValue, colKeyValue, className, duration) {
    if (cellEl.classList.contains(className)) {
      cellEl.classList.remove(className);
      void cellEl.offsetHeight;
    }
    cellEl.classList.add(className);
    const cellKey = `${rowKeyValue}-${colKeyValue}`;
    window.clearTimeout(highlightDimCellsTimeout.get(cellKey));
    if (!duration) {
      return;
    }
    highlightDimCellsTimeout.set(
      cellKey,
      window.setTimeout(() => {
        cellEl.classList.remove(className);
        highlightDimCellsTimeout.delete(cellKey);
      }, duration)
    );
  }
  function updateRowAnimation(rowKeyValue, store, timeOffset) {
    const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValue));
    const { visible, ignoreInvisible } = store;
    if (!rowEl) {
      if (ignoreInvisible) {
        return true;
      }
      if (visible) {
        store.visible = false;
      }
      return false;
    }
    const { keyframe, duration: initialDuration } = store;
    if (!visible) {
      store.visible = true;
      const iterationStart = timeOffset / initialDuration;
      rowEl.animate(keyframe, {
        duration: initialDuration - timeOffset,
        /** 从什么时候开始，0-1 */
        iterationStart,
        /** 持续多久 0-1 */
        iterations: 1 - iterationStart
      });
    }
    return false;
  }
  return [highlightSteps, setHighlightDimRow, setHighlightDimCell];
}
const ScrollCodes = {
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  PageUp: "PageUp",
  PageDown: "PageDown",
  Home: "Home",
  End: "End"
};
const ScrollCodesValues = Object.values(ScrollCodes);
function useKeyboardArrowScroll(targetElement, props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on, areaSelectionConfig) {
  let isMouseOver = false;
  watch(virtual_on, (val) => {
    removeListeners();
    if (val) {
      addEventListeners();
    }
  });
  onMounted(addEventListeners);
  onBeforeUnmount(removeListeners);
  function addEventListeners() {
    var _a, _b, _c;
    window.addEventListener("keydown", handleKeydown);
    (_a = targetElement.value) == null ? void 0 : _a.addEventListener("mouseenter", handleMouseEnter);
    (_b = targetElement.value) == null ? void 0 : _b.addEventListener("mouseleave", handleMouseLeave);
    (_c = targetElement.value) == null ? void 0 : _c.addEventListener("mousedown", handleMouseDown);
  }
  function removeListeners() {
    var _a, _b, _c;
    window.removeEventListener("keydown", handleKeydown);
    (_a = targetElement.value) == null ? void 0 : _a.removeEventListener("mouseenter", handleMouseEnter);
    (_b = targetElement.value) == null ? void 0 : _b.removeEventListener("mouseleave", handleMouseLeave);
    (_c = targetElement.value) == null ? void 0 : _c.removeEventListener("mousedown", handleMouseDown);
  }
  function handleKeydown(e) {
    if (!virtual_on.value) return;
    if (areaSelectionConfig.value.keyboard) return;
    const keyCode = e.code;
    if (!ScrollCodesValues.includes(keyCode)) return;
    if (!isMouseOver) return;
    e.preventDefault();
    const { scrollTop, rowHeight, containerHeight, scrollHeight } = virtualScroll.value;
    const { scrollLeft } = virtualScrollX.value;
    const { headless, headerRowHeight } = props;
    const headerHeight = headless ? 0 : tableHeaders.value.length * (headerRowHeight || rowHeight);
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
  function handleMouseLeave() {
    isMouseOver = false;
  }
  function handleMouseDown() {
    if (!isMouseOver) isMouseOver = true;
  }
}
function useMaxRowSpan(props, tableHeaderLast, rowKeyGen, dataSourceCopy) {
  const maxRowSpan = /* @__PURE__ */ new Map();
  let maxRowSpanValue = 0;
  function updateMaxRowSpan() {
    if (!props.virtual) {
      if (maxRowSpan.size) maxRowSpan.clear();
      maxRowSpanValue = 0;
      return;
    }
    maxRowSpan.clear();
    maxRowSpanValue = 0;
    const data = dataSourceCopy.value;
    const columns = tableHeaderLast.value;
    const columnsWithMerge = [];
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].mergeCells) columnsWithMerge.push({ col: columns[i], index: i });
    }
    if (!columnsWithMerge.length) return;
    const dataLength = data.length;
    const mergeColumnsLength = columnsWithMerge.length;
    for (let rowIndex = 0; rowIndex < dataLength; rowIndex++) {
      const row = data[rowIndex];
      const rowKey = rowKeyGen(row);
      let currentMax = maxRowSpan.get(rowKey) || 0;
      for (let colIndex = 0; colIndex < mergeColumnsLength; colIndex++) {
        const { col, index } = columnsWithMerge[colIndex];
        const { rowspan = 1 } = col.mergeCells({ row, col, rowIndex, colIndex: index }) || {};
        if (rowspan > 1 && rowspan > currentMax) {
          currentMax = rowspan;
          maxRowSpan.set(rowKey, currentMax);
          if (rowspan > maxRowSpanValue) maxRowSpanValue = rowspan;
        }
      }
    }
  }
  return [maxRowSpan, updateMaxRowSpan, () => maxRowSpanValue];
}
const DEFAULT_RESULT = { colspan: 1, rowspan: 1 };
const COL_INDEX_BASE = 65536;
function createMergeCellsCache() {
  const cache = /* @__PURE__ */ new Map();
  function getMergeCellsResult(row, col, rowIndex, colIndex) {
    if (!col.mergeCells) return DEFAULT_RESULT;
    const cacheKey = rowIndex * COL_INDEX_BASE + colIndex;
    const cached = cache.get(cacheKey);
    if (cached && cached.row === row) return cached;
    let { colspan = 1, rowspan = 1 } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};
    colspan = colspan || 1;
    rowspan = rowspan || 1;
    const entry = { row, colspan, rowspan };
    cache.set(cacheKey, entry);
    return entry;
  }
  function clear() {
    cache.clear();
  }
  return { getMergeCellsResult, clear };
}
const ABOVE_VIEWPORT_PH = { __VT_PH__: 1 };
function useMergeCells(rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart, virtualScroll, virtualX_columnPart, dataSourceCopy, mergeCellsCache, canMergeEmptyRows, belowViewportRowCount) {
  const hiddenCellMap = ref(null);
  const hoverRowMap = ref({});
  const hoverMergedCells = ref(/* @__PURE__ */ new Set());
  const activeMergedCells = ref(/* @__PURE__ */ new Set());
  let colIndexCache = null;
  watch([dataSourceCopy, tableHeaderLast], () => {
    mergeCellsCache.clear();
    colIndexCache = null;
  });
  watch([virtual_dataSourcePart, tableHeaderLast], () => {
    buildHiddenCellMap();
  });
  const hasMergeColumn = computed(() => tableHeaderLast.value.some((col) => !!col.mergeCells));
  function buildHiddenCellMap() {
    if (!hasMergeColumn.value) {
      if (hiddenCellMap.value) {
        hiddenCellMap.value = null;
        hoverRowMap.value = {};
      }
      return;
    }
    hiddenCellMap.value = {};
    hoverRowMap.value = {};
    const data = virtual_dataSourcePart.value;
    const columns = virtualX_columnPart.value;
    const baseRowIndex = virtualScroll.value.startIndex;
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      if (!row) continue;
      const absRowIndex = baseRowIndex + rowIndex;
      for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        const col = columns[colIdx];
        if (!col.mergeCells) continue;
        const leafIndex = col.__LF_S__ ?? colIdx;
        const { colspan, rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, leafIndex);
        if (colspan === 1 && rowspan === 1) continue;
        const rowKey = rowKeyGen(row);
        const colKey = colKeyGen.value(col);
        const mergedCellKey = pureCellKeyGen(rowKey, colKey);
        for (let i = rowIndex; i < rowIndex + rowspan; i++) {
          const targetRow = data[i];
          if (!targetRow) break;
          hideCells(rowKeyGen(targetRow), colKey, colspan, i === rowIndex, mergedCellKey);
        }
      }
    }
  }
  function hideCells(rowKey, colKey, colspan, isSelfRow = false, mergeCellKey) {
    const headers = tableHeaderLast.value;
    const colKeyGenValue = colKeyGen.value;
    let startIndex = colIndexCache == null ? void 0 : colIndexCache.get(colKey);
    if (startIndex === void 0) {
      startIndex = headers.findIndex((item) => colKeyGenValue(item) === colKey);
      if (startIndex < 0) return;
      if (!colIndexCache) colIndexCache = /* @__PURE__ */ new Map();
      colIndexCache.set(colKey, startIndex);
    }
    if (!hoverRowMap.value[rowKey]) {
      hoverRowMap.value[rowKey] = /* @__PURE__ */ new Set();
    }
    if (!hiddenCellMap.value) {
      hiddenCellMap.value = {};
    }
    if (!hiddenCellMap.value[rowKey]) {
      hiddenCellMap.value[rowKey] = /* @__PURE__ */ new Set();
    }
    const hoverSet = hoverRowMap.value[rowKey];
    const hiddenSet = hiddenCellMap.value[rowKey];
    const endIndex = Math.min(startIndex + colspan, headers.length);
    for (let i = startIndex; i < endIndex; i++) {
      hoverSet.add(mergeCellKey);
      if (isSelfRow && i === startIndex) {
        continue;
      }
      const nextCol = headers[i];
      if (!nextCol) break;
      const nextColKey = colKeyGenValue(nextCol);
      hiddenSet.add(nextColKey);
    }
  }
  function mergeCellsWrapper(row, col, rowIndex, colIndex) {
    if (!col.mergeCells) return;
    const absRowIndex = virtualScroll.value.startIndex + rowIndex;
    const { colspan, rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, colIndex);
    if (colspan === 1 && rowspan === 1) return;
    const rowKey = rowKeyGen(row);
    const colKey = colKeyGen.value(col);
    const mergedCellKey = pureCellKeyGen(rowKey, colKey);
    for (let i = rowIndex; i < rowIndex + rowspan; i++) {
      const targetRow = virtual_dataSourcePart.value[i];
      if (!targetRow) break;
      hideCells(rowKeyGen(targetRow), colKey, colspan, i === rowIndex, mergedCellKey);
    }
    return { colspan, rowspan: adjustRowspanForMergedRows(absRowIndex, rowspan) };
  }
  function adjustRowspanForMergedRows(absRowIndex, rowspan) {
    if (rowspan <= 1) return rowspan;
    let adjusted = rowspan;
    const spanEnd = absRowIndex + rowspan - 1;
    const blocks = aboveEmptyBlocks.value;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.start > absRowIndex && block.start <= spanEnd) {
        adjusted -= block.count - 1;
      }
    }
    const belowCount = belowViewportRowCount.value;
    const { viewportEndIndex } = virtualScroll.value;
    if (belowCount > 0 && spanEnd > viewportEndIndex) {
      const regionEnd = viewportEndIndex + belowCount;
      const coveredRows = Math.min(spanEnd, regionEnd) - viewportEndIndex;
      adjusted -= coveredRows - getBelowSegmentIndex(spanEnd);
    }
    return adjusted > 0 ? adjusted : 1;
  }
  function getBelowSegmentIndex(spanEnd) {
    const { viewportEndIndex } = virtualScroll.value;
    const segments = belowPhSegments.value;
    let acc = viewportEndIndex;
    for (let i = 0; i < segments.length; i++) {
      acc += segments[i].count;
      if (spanEnd <= acc) return i + 1;
    }
    return segments.length || 1;
  }
  const emptySet = /* @__PURE__ */ new Set();
  function updateHoverMergedCells(rowKey) {
    hoverMergedCells.value = rowKey === void 0 ? emptySet : hoverRowMap.value[rowKey] || emptySet;
  }
  const aboveViewportColumnMap = computed(() => {
    var _a;
    const map = /* @__PURE__ */ new Map();
    const data = virtual_dataSourcePart.value;
    const { startIndex, viewportStartIndex } = virtualScroll.value;
    const aboveCount = viewportStartIndex - startIndex;
    if (aboveCount <= 0 || !data.length) return map;
    const columns = virtualX_columnPart.value;
    const coverage = /* @__PURE__ */ new Map();
    for (let rowOffset = 0; rowOffset < aboveCount; rowOffset++) {
      const absRowIndex = startIndex + rowOffset;
      const row = data[rowOffset];
      if (!row) continue;
      const rowCols = [];
      let hasMustRender = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.__VT_C_SP__) {
          rowCols.push(col);
          continue;
        }
        const leafIndex = col.__LF_S__ ?? i;
        if ((_a = coverage.get(rowOffset)) == null ? void 0 : _a.has(leafIndex)) {
          continue;
        }
        const { rowspan, colspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, leafIndex);
        const mustRender = absRowIndex + rowspan > viewportStartIndex;
        if (mustRender && rowspan > 1) {
          for (let r = 1; r < rowspan; r++) {
            const futureOffset = rowOffset + r;
            if (futureOffset >= aboveCount) break;
            if (!coverage.has(futureOffset)) coverage.set(futureOffset, /* @__PURE__ */ new Set());
            for (let c = 0; c < colspan; c++) {
              coverage.get(futureOffset).add(leafIndex + c);
            }
          }
        }
        if (mustRender) {
          rowCols.push(col);
          hasMustRender = true;
        } else {
          for (let c = 0; c < colspan; c++) {
            rowCols.push(ABOVE_VIEWPORT_PH);
          }
        }
        i += colspan - 1;
      }
      if (!hasMustRender) {
        rowCols.length = 0;
      }
      map.set(rowKeyGen(row), rowCols);
    }
    return map;
  });
  const EMPTY_BLOCKS = [];
  const EMPTY_SEGMENTS = [];
  const aboveEmptyBlocks = computed(() => {
    if (!canMergeEmptyRows.value) return EMPTY_BLOCKS;
    const data = virtual_dataSourcePart.value;
    const { startIndex, viewportStartIndex } = virtualScroll.value;
    const aboveCount = Math.min(data.length, Math.max(0, viewportStartIndex - startIndex));
    if (aboveCount <= 0) return EMPTY_BLOCKS;
    const colMap = aboveViewportColumnMap.value;
    const isEmptyRow = (row) => {
      if (!row || row.__EXP_R__) return false;
      const cols = colMap.get(rowKeyGen(row));
      return cols !== void 0 && cols.length === 0;
    };
    const blocks = [];
    let runStart = -1;
    const flushRun = (endExclusive) => {
      if (endExclusive - runStart >= 2) {
        blocks.push({ start: startIndex + runStart, count: endExclusive - runStart });
      }
      runStart = -1;
    };
    for (let i = 0; i < aboveCount; i++) {
      if (isEmptyRow(data[i])) {
        if (runStart < 0) runStart = i;
        continue;
      }
      if (runStart >= 0) flushRun(i);
    }
    if (runStart >= 0) flushRun(aboveCount);
    return blocks.length ? blocks : EMPTY_BLOCKS;
  });
  const belowPhSegments = computed(() => {
    const belowCount = belowViewportRowCount.value;
    if (belowCount <= 0) return EMPTY_SEGMENTS;
    const data = virtual_dataSourcePart.value;
    const { startIndex, viewportEndIndex, endIndex } = virtualScroll.value;
    const regionEnd = Math.min(endIndex, startIndex + data.length - 1);
    const columns = virtualX_columnPart.value;
    const endsSet = /* @__PURE__ */ new Set();
    const anchorRowEnd = Math.min(data.length - 1, viewportEndIndex - startIndex);
    for (let rowOffset = 0; rowOffset <= anchorRowEnd; rowOffset++) {
      const row = data[rowOffset];
      if (!row) continue;
      const absRowIndex = startIndex + rowOffset;
      for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        const col = columns[colIdx];
        if (!col.mergeCells) continue;
        const leafIndex = col.__LF_S__ ?? colIdx;
        const { rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, leafIndex);
        if (rowspan <= 1) continue;
        const spanEnd = absRowIndex + rowspan - 1;
        if (spanEnd > viewportEndIndex) endsSet.add(Math.min(spanEnd, regionEnd));
      }
    }
    if (!endsSet.size) return [{ count: belowCount }];
    const ends = Array.from(endsSet).sort((a, b) => a - b);
    const segments = [];
    let prev = viewportEndIndex;
    for (let i = 0; i < ends.length; i++) {
      const count = ends[i] - prev;
      if (count > 0) segments.push({ count });
      prev = ends[i];
    }
    if (regionEnd > prev) segments.push({ count: regionEnd - prev });
    return segments;
  });
  function updateActiveMergedCells(clear, rowKey) {
    if (!rowActiveProp.value.enabled) return;
    if (clear) {
      activeMergedCells.value = /* @__PURE__ */ new Set();
      return;
    }
    activeMergedCells.value = rowKey !== void 0 && hoverRowMap.value[rowKey] || new Set(hoverMergedCells.value);
  }
  return [
    hiddenCellMap,
    mergeCellsWrapper,
    hoverMergedCells,
    updateHoverMergedCells,
    activeMergedCells,
    updateActiveMergedCells,
    aboveViewportColumnMap,
    aboveEmptyBlocks,
    belowPhSegments
  ];
}
function useRowExpand(emits, dataSourceCopy, rowKeyGen, onDataSourceChange) {
  const expandedKey = "__EXP__";
  function isExpanded(row, col) {
    return (row == null ? void 0 : row[expandedKey]) === col ? !(row == null ? void 0 : row[expandedKey]) : true;
  }
  function toggleExpandRow(row, col) {
    const isExpand = isExpanded(row, col);
    setRowExpand(row, isExpand, { col });
  }
  function setRowExpand(rowKeyOrRow, expand, data) {
    let rowKey;
    if (typeof rowKeyOrRow === "string" || typeof rowKeyOrRow === "number") {
      rowKey = rowKeyOrRow;
    } else {
      rowKey = rowKeyGen(rowKeyOrRow);
    }
    const tempData = dataSourceCopy.value.slice();
    const index = tempData.findIndex((it) => rowKeyGen(it) === rowKey);
    if (index === -1) {
      console.warn("expandRow failed.rowKey:", rowKey);
      return;
    }
    for (let i = index + 1; i < tempData.length; i++) {
      const item = tempData[i];
      const rowKey2 = item.__R_K__;
      if (rowKey2 == null ? void 0 : rowKey2.startsWith(EXPANDED_ROW_KEY_PREFIX)) {
        tempData.splice(i, 1);
        i--;
      } else {
        break;
      }
    }
    const row = tempData[index];
    const col = data == null ? void 0 : data.col;
    if (expand == null) {
      expand = isExpanded(row, col);
    }
    if (expand) {
      const newExpandRow = {
        __R_K__: EXPANDED_ROW_KEY_PREFIX + rowKey,
        __EXP_R__: row,
        __EXP_C__: col
      };
      tempData.splice(index + 1, 0, newExpandRow);
    }
    if (row) {
      row[expandedKey] = expand ? col : void 0;
    }
    dataSourceCopy.value = tempData;
    onDataSourceChange();
    if (!(data == null ? void 0 : data.silent)) {
      emits("toggle-row-expand", { expanded: Boolean(expand), row, col });
    }
  }
  return [toggleExpandRow, setRowExpand];
}
function isTouchPrimaryDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
function useScrollbar(props, containerRef, virtualScroll, virtualScrollX, updateVirtualScrollY, scrollbarOptions, isExperimentalScrollY) {
  const showScrollbar = ref({ x: false, y: false });
  const scrollbar = ref({ h: 0, w: 0, t: 0, l: 0 });
  let isDraggingVertical = false;
  let isDraggingHorizontal = false;
  let dragStartY = 0;
  let dragStartX = 0;
  let dragStartTop = 0;
  let dragStartLeft = 0;
  let resizeObserver = null;
  let currentDragHandler;
  let isMobileDevice = false;
  const throttledUpdateScrollbar = throttle(() => updateCustomScrollbar(), 200);
  const rafUpdateVirtualScrollY = rafThrottle((scrollTop) => updateVirtualScrollY(scrollTop));
  onMounted(() => {
    isMobileDevice = isTouchPrimaryDevice();
    if (scrollbarOptions.value.enabled && !isMobileDevice) {
      resizeObserver = new ResizeObserver(throttledUpdateScrollbar);
      resizeObserver.observe(containerRef.value);
    }
    initScrollbar();
  });
  onBeforeUnmount(() => {
    onDragEnd();
    resizeObserver == null ? void 0 : resizeObserver.disconnect();
    resizeObserver = null;
  });
  function updateCustomScrollbar() {
    if (!scrollbarOptions.value.enabled || isMobileDevice) return;
    const { scrollHeight, scrollTop, containerHeight } = virtualScroll.value;
    const { scrollWidth, scrollLeft, containerWidth } = virtualScrollX.value;
    const needVertical = scrollHeight > containerHeight;
    const needHorizontal = scrollWidth > containerWidth;
    showScrollbar.value = { x: needHorizontal, y: needVertical };
    if (needVertical) {
      const ratio = containerHeight / scrollHeight;
      scrollbar.value.h = Math.max(scrollbarOptions.value.minHeight, ratio * containerHeight);
      scrollbar.value.t = Math.round(scrollTop / (scrollHeight - containerHeight) * (containerHeight - scrollbar.value.h));
    }
    if (needHorizontal) {
      const ratio = containerWidth / scrollWidth;
      scrollbar.value.w = Math.max(scrollbarOptions.value.minWidth, ratio * containerWidth);
      scrollbar.value.l = Math.round(scrollLeft / (scrollWidth - containerWidth) * (containerWidth - scrollbar.value.w));
    }
  }
  function onVerticalScrollbarMouseDown(e) {
    if (e instanceof MouseEvent) e.preventDefault();
    isDraggingVertical = true;
    const { scrollTop } = virtualScroll.value;
    dragStartTop = scrollTop;
    dragStartY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    addDragListeners(onVerticalDrag);
  }
  function onHorizontalScrollbarMouseDown(e) {
    if (e instanceof MouseEvent) e.preventDefault();
    isDraggingHorizontal = true;
    const { scrollLeft } = virtualScrollX.value;
    dragStartLeft = scrollLeft;
    dragStartX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    addDragListeners(onHorizontalDrag);
  }
  function addDragListeners(dragHandler) {
    removeCurrentDragHandlerListeners();
    currentDragHandler = dragHandler;
    document.addEventListener("mousemove", dragHandler);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", dragHandler, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  }
  function onVerticalDrag(e) {
    if (!isDraggingVertical) return;
    e.preventDefault();
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const deltaY = clientY - dragStartY;
    const { scrollHeight, containerHeight } = virtualScroll.value;
    const scrollRange = scrollHeight - containerHeight;
    const trackRange = containerHeight - scrollbar.value.h;
    const scrollDelta = deltaY / trackRange * scrollRange;
    if (isExperimentalScrollY.value) {
      const ratio = containerHeight / scrollHeight;
      const top = Math.round((dragStartTop + scrollDelta) * ratio);
      const maxTop = containerHeight - scrollbar.value.h;
      scrollbar.value.t = top < 0 ? 0 : top > maxTop ? maxTop : top;
      rafUpdateVirtualScrollY(dragStartTop + scrollDelta);
    } else {
      containerRef.value.scrollTop = dragStartTop + scrollDelta;
    }
  }
  function onHorizontalDrag(e) {
    if (!isDraggingHorizontal) return;
    e.preventDefault();
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const deltaX = clientX - dragStartX;
    const { scrollWidth, containerWidth } = virtualScrollX.value;
    const scrollRange = scrollWidth - containerWidth;
    const trackRange = containerWidth - scrollbar.value.w;
    const scrollDelta = deltaX / trackRange * scrollRange;
    containerRef.value.scrollLeft = dragStartLeft + scrollDelta;
  }
  function onDragEnd() {
    isDraggingVertical = false;
    isDraggingHorizontal = false;
    removeCurrentDragHandlerListeners();
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchend", onDragEnd);
  }
  function removeCurrentDragHandlerListeners() {
    if (currentDragHandler) {
      document.removeEventListener("mousemove", currentDragHandler);
      document.removeEventListener("touchmove", currentDragHandler);
      currentDragHandler = void 0;
    }
  }
  function initScrollbar() {
    nextTick(updateCustomScrollbar);
  }
  return [scrollbar, showScrollbar, onVerticalScrollbarMouseDown, onHorizontalScrollbarMouseDown, updateCustomScrollbar];
}
function useScrollRowByRow(props, tableContainerRef) {
  let isAddListeners = false;
  const isDragScroll = customRef((track, trigger) => {
    let value = false;
    let debounceTimer = 0;
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        if (value && !newValue) {
          if (debounceTimer) {
            window.clearTimeout(debounceTimer);
          }
          debounceTimer = window.setTimeout(() => {
            value = newValue;
            trigger();
            debounceTimer = 0;
          }, 300);
        } else {
          if (debounceTimer) {
            window.clearTimeout(debounceTimer);
            debounceTimer = 0;
          }
          value = newValue;
          trigger();
        }
      }
    };
  });
  const onlyDragScroll = computed(() => props.scrollRowByRow === "scrollbar");
  const isSRBRActive = computed(() => {
    if (onlyDragScroll.value) {
      return isDragScroll.value;
    }
    return props.scrollRowByRow;
  });
  watch(onlyDragScroll, (v) => {
    if (v) {
      addEventListener();
    } else {
      removeEventListener();
    }
  });
  onMounted(() => {
    addEventListener();
  });
  onUnmounted(() => {
    removeEventListener();
  });
  function addEventListener() {
    if (isAddListeners || !onlyDragScroll.value) return;
    const container = tableContainerRef.value;
    if (!container) return;
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    isAddListeners = true;
  }
  function removeEventListener() {
    const container = tableContainerRef.value;
    if (!container) return;
    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mouseup", handleMouseUp);
    isAddListeners = false;
  }
  function handleMouseDown(e) {
    const el = e.target;
    if (el.classList.contains("stk-table")) {
      isDragScroll.value = true;
    }
  }
  function handleMouseUp() {
    isDragScroll.value = false;
  }
  return [isSRBRActive];
}
const SORT_SWITCH_ORDER = [null, "desc", "asc"];
function useSorter(props, emits, colKeyGen, tableHeaderLast, dataSourceCopy, initDataSource) {
  const sortStates = ref([]);
  const isMultiSort = computed(() => props.sortConfig.multiSort ?? false);
  const multiSortLimit = computed(() => props.sortConfig.multiSortLimit ?? 3);
  const sortCol = computed(() => {
    var _a;
    return (_a = sortStates.value[0]) == null ? void 0 : _a.dataIndex;
  });
  function getColumnSortState(colKey) {
    return sortStates.value[getSortStateIndex(colKey)];
  }
  function getSortStateIndex(colKey) {
    return sortStates.value.findIndex((s) => s.key === colKey || s.dataIndex === colKey);
  }
  function getTableCol(state) {
    return tableHeaderLast.value.find((c) => state.key && colKeyGen.value(c) === state.key || c.dataIndex === state.dataIndex);
  }
  function getSortColumns() {
    return sortStates.value.map((s) => ({ key: s.key || s.dataIndex, order: s.order }));
  }
  function addOrUpdateSortState(newState, mode) {
    const existingIndex = getSortStateIndex(newState.key || newState.dataIndex);
    if (existingIndex >= 0) {
      sortStates.value.splice(existingIndex, 1);
    }
    if (mode && isMultiSort.value) {
      if (sortStates.value.length >= multiSortLimit.value) {
        sortStates.value.pop();
      }
      sortStates.value.unshift(newState);
    } else {
      sortStates.value = [newState];
    }
  }
  function updateSortState(col, sortConfig) {
    const colKey = colKeyGen.value(col);
    const existingIndex = getSortStateIndex(colKey);
    let newOrder;
    const defaultSort = sortConfig.defaultSort;
    if (existingIndex >= 0) {
      const currentOrder = sortStates.value[existingIndex].order;
      if (currentOrder && defaultSort && (defaultSort.key === colKey || defaultSort.dataIndex === col.dataIndex)) {
        const defaultSwitchOrder = SORT_SWITCH_ORDER.filter((order) => order !== null);
        const currentIndex = defaultSwitchOrder.indexOf(currentOrder);
        newOrder = defaultSwitchOrder[(currentIndex + 1) % defaultSwitchOrder.length];
      } else {
        const currentIndex = SORT_SWITCH_ORDER.indexOf(currentOrder);
        newOrder = SORT_SWITCH_ORDER[(currentIndex + 1) % 3];
      }
      if (newOrder) {
        const updatedState = { ...sortStates.value[existingIndex], order: newOrder };
        addOrUpdateSortState(updatedState, 1);
      } else {
        sortStates.value.splice(existingIndex, 1);
        if (defaultSort == null ? void 0 : defaultSort.order) {
          const defaultSortCol = getTableCol(defaultSort);
          const { key, sortField, sortType } = defaultSortCol || {};
          addOrUpdateSortState({ key, sortField, sortType, ...defaultSort }, 1);
        }
      }
    } else {
      newOrder = SORT_SWITCH_ORDER[1];
      const newState = {
        key: colKey,
        dataIndex: col.dataIndex,
        sortField: col.sortField,
        sortType: col.sortType,
        order: newOrder
      };
      addOrUpdateSortState(newState, 1);
    }
    return newOrder;
  }
  function sortData(dataSource) {
    if (!sortStates.value.length) return dataSource;
    const sortConfig = { ...DEFAULT_SORT_CONFIG, ...props.sortConfig };
    let result = dataSource.slice();
    for (let i = sortStates.value.length - 1; i >= 0; i--) {
      const state = sortStates.value[i];
      const col = getTableCol(state);
      if (col && state.order) {
        const colSortConfig = { ...sortConfig, ...col.sortConfig };
        result = tableSort(col, state.order, result, colSortConfig);
      }
    }
    return result;
  }
  function onColumnSort(col) {
    if (!col) {
      console.warn("onColumnSort: not found col:", col);
      return;
    }
    if (!col.sorter) {
      return;
    }
    const sortConfig = { ...DEFAULT_SORT_CONFIG, ...props.sortConfig, ...col.sortConfig };
    const order = updateSortState(col, sortConfig);
    if (!props.sortRemote) {
      initDataSource();
    }
    emits("sort-change", col, order, toRaw(dataSourceCopy.value), sortConfig);
  }
  function setSorter(colKey, order, option = {}) {
    var _a;
    const newOption = { silent: true, sortOption: null, sort: true, append: false, ...option };
    const colKeyGenValue = colKeyGen.value;
    let column;
    if (order) {
      column = newOption.sortOption || tableHeaderLast.value.find((it) => colKeyGenValue(it) === colKey);
      if (column) {
        const newState = {
          key: colKey,
          dataIndex: column.dataIndex,
          sortField: column.sortField,
          sortType: column.sortType,
          order
        };
        const mode = newOption.append && isMultiSort.value ? 1 : 0;
        addOrUpdateSortState(newState, mode);
      }
    } else {
      sortStates.value = [];
    }
    if (newOption.sort && ((_a = dataSourceCopy.value) == null ? void 0 : _a.length)) {
      if (!props.sortRemote || newOption.force) {
        initDataSource(props.dataSource, { forceSort: newOption.force });
      }
    }
    if (!newOption.silent) {
      if (!column) {
        column = newOption.sortOption || tableHeaderLast.value.find((it) => colKeyGenValue(it) === colKey);
      }
      if (column) {
        emits("sort-change", column, order, toRaw(dataSourceCopy.value), props.sortConfig);
      } else {
        console.warn("Can not find column by key:", colKey);
      }
    }
    return dataSourceCopy.value;
  }
  function resetSorter() {
    sortStates.value = [];
    initDataSource();
  }
  function dealDefaultSorter() {
    if (!props.sortConfig.defaultSort) return;
    const { key, dataIndex, order, silent } = { silent: true, ...props.sortConfig.defaultSort };
    setSorter(key || dataIndex, order, { force: false, silent });
  }
  return [sortStates, sortCol, onColumnSort, setSorter, resetSorter, getSortColumns, dealDefaultSorter, getColumnSortState, sortData];
}
function useTableColumns(virtualX, isRelativeMode) {
  const tableHeaders = shallowRef([]);
  const tableHeadersForCalc = shallowRef([]);
  function dealColumns(columns) {
    const tableHeadersTemp = [];
    const tableHeadersForCalcTemp = [];
    let copyColumn = columns;
    if (isRelativeMode.value) {
      const leftCol = [];
      const centerCol = [];
      const rightCol = [];
      for (let i = 0, len = copyColumn.length; i < len; i++) {
        const col = copyColumn[i];
        if (col.fixed === "left") {
          leftCol.push(col);
        } else if (col.fixed === "right") {
          rightCol.push(col);
        } else {
          centerCol.push(col);
        }
      }
      copyColumn = leftCol.concat(centerCol).concat(rightCol);
    }
    const maxDeep = howDeepTheHeader(copyColumn);
    for (let i = 0; i <= maxDeep; i++) {
      tableHeadersTemp[i] = [];
      tableHeadersForCalcTemp[i] = [];
    }
    let leafIndex = 0;
    function flat(arr, parent, depth = 0) {
      let allChildrenLen = 0;
      let allChildrenWidthSum = 0;
      for (let i = 0, len = arr.length; i < len; i++) {
        const col = arr[i];
        if (col.hidden) continue;
        col.__P__ = parent;
        col.__LF_S__ = leafIndex;
        let colChildrenLen = 1;
        let colWidth = 0;
        if (col.children) {
          const [len2, widthSum] = flat(col.children, col, depth + 1);
          colChildrenLen = len2;
          colWidth = widthSum;
          tableHeadersForCalcTemp[depth].push(col);
        } else {
          colWidth = getColWidth(col);
          leafIndex++;
          for (let j = depth; j <= maxDeep; j++) {
            tableHeadersForCalcTemp[j].push(col);
          }
        }
        col.__LF_E__ = leafIndex;
        col.__W__ = colWidth;
        tableHeadersTemp[depth].push(col);
        const rowSpan = col.children ? 1 : maxDeep - depth + 1;
        const colSpan = colChildrenLen;
        if (rowSpan > 1) {
          col.__R_SP__ = rowSpan;
        }
        if (colSpan > 1) {
          col.__C_SP__ = colSpan;
        }
        allChildrenLen += colChildrenLen;
        allChildrenWidthSum += colWidth;
      }
      return [allChildrenLen, allChildrenWidthSum];
    }
    flat(copyColumn, null);
    tableHeaders.value = tableHeadersTemp;
    tableHeadersForCalc.value = tableHeadersForCalcTemp;
  }
  return [tableHeaders, tableHeadersForCalc, dealColumns];
}
function useThDrag(props, emits, colKeyGen) {
  const dragConfig = computed(() => {
    const headerDrag = props.headerDrag;
    const draggable = headerDrag !== false;
    return {
      draggable,
      mode: "insert",
      disabled: () => false,
      ...headerDrag
    };
  });
  function onThDragStart(e) {
    const th = getClosestTh(e.target);
    if (!th) return;
    const dragStartKey = th.dataset.colKey || "";
    const dt = e.dataTransfer;
    if (dt) {
      dt.effectAllowed = "move";
      dt.setData("text/plain", dragStartKey);
    }
    emits("th-drag-start", dragStartKey);
  }
  function onThDragOver(e) {
    const th = getClosestTh(e.target);
    if (!th) return;
    const isHeaderDraggable2 = th.getAttribute("draggable") === "true";
    if (!isHeaderDraggable2) return;
    const dt = e.dataTransfer;
    if (dt) {
      dt.dropEffect = "move";
    }
    e.preventDefault();
  }
  function onThDrop(e) {
    var _a;
    const th = getClosestTh(e.target);
    if (!th) return;
    const dragStartKey = (_a = e.dataTransfer) == null ? void 0 : _a.getData("text");
    if (dragStartKey !== th.dataset.colKey) {
      handleColOrderChange(dragStartKey, th.dataset.colKey);
    }
    emits("th-drop", th.dataset.colKey);
  }
  function handleColOrderChange(dragStartKey, dragEndKey) {
    if (isEmptyValue(dragStartKey) || isEmptyValue(dragEndKey)) return;
    if (dragConfig.value.mode !== "none") {
      const columns = props.columns.slice();
      const dragStartIndex = columns.findIndex((col) => colKeyGen.value(col) === dragStartKey);
      const dragEndIndex = columns.findIndex((col) => colKeyGen.value(col) === dragEndKey);
      if (dragStartIndex === -1 || dragEndIndex === -1) return;
      const dragStartCol = columns[dragStartIndex];
      if (dragConfig.value.mode === "swap") {
        columns[dragStartIndex] = columns[dragEndIndex];
        columns[dragEndIndex] = dragStartCol;
      } else {
        columns.splice(dragStartIndex, 1);
        columns.splice(dragEndIndex, 0, dragStartCol);
      }
      emits("update:columns", columns);
    }
    emits("col-order-change", dragStartKey, dragEndKey);
  }
  function isHeaderDraggable(col) {
    return dragConfig.value.draggable && !dragConfig.value.disabled(col);
  }
  return [onThDragStart, onThDragOver, onThDrop, isHeaderDraggable];
}
const TR_DRAGGING_CLASS = "tr-dragging";
const TR_DRAG_OVER_CLASS = "tr-dragging-over";
const DATA_TRANSFER_FORMAT = "text/plain";
function useTrDrag(props, emits, dataSourceCopy) {
  let trDragFlag = false;
  const dragRowConfig = computed(() => {
    return { mode: "insert", ...props.dragRowConfig };
  });
  function onTrDragStart(e, rowIndex) {
    var _a;
    const tr = getClosestTr(e.target);
    if (tr) {
      const trRect = tr.getBoundingClientRect();
      const x = e.clientX - (trRect.left ?? 0);
      (_a = e.dataTransfer) == null ? void 0 : _a.setDragImage(tr, x, trRect.height / 2);
      tr.classList.add(TR_DRAGGING_CLASS);
    }
    const dt = e.dataTransfer;
    if (dt) {
      dt.effectAllowed = "move";
      dt.setData(DATA_TRANSFER_FORMAT, String(rowIndex));
    }
    trDragFlag = true;
  }
  function onTrDragOver(e) {
    if (!trDragFlag) return;
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt) {
      dt.dropEffect = "move";
    }
  }
  let oldTr = null;
  function onTrDragEnter(e) {
    if (!trDragFlag) return;
    e.preventDefault();
    const tr = getClosestTr(e.target);
    if (oldTr && oldTr !== tr) {
      oldTr.classList.remove(TR_DRAG_OVER_CLASS);
    }
    if (tr) {
      oldTr = tr;
      tr.classList.add(TR_DRAG_OVER_CLASS);
    }
  }
  function onTrDragEnd(e) {
    if (!trDragFlag) return;
    const tr = getClosestTr(e.target);
    if (tr) {
      tr.classList.remove(TR_DRAGGING_CLASS);
    }
    if (oldTr) {
      oldTr.classList.remove(TR_DRAG_OVER_CLASS);
      oldTr = null;
    }
    trDragFlag = false;
  }
  function onTrDrop(e, rowIndex) {
    if (!trDragFlag) return;
    const dt = e.dataTransfer;
    if (!dt) return;
    const mode = dragRowConfig.value.mode;
    const sourceIndex = Number(dt.getData(DATA_TRANSFER_FORMAT));
    const endIndex = rowIndex;
    if (sourceIndex === endIndex) return;
    if (mode !== "none") {
      const dataSourceTemp = dataSourceCopy.value.slice();
      const sourceRow = dataSourceTemp[sourceIndex];
      if (mode === "swap") {
        dataSourceTemp[sourceIndex] = dataSourceTemp[endIndex];
        dataSourceTemp[endIndex] = sourceRow;
      } else {
        dataSourceTemp.splice(sourceIndex, 1);
        dataSourceTemp.splice(endIndex, 0, sourceRow);
      }
      dataSourceCopy.value = dataSourceTemp;
    }
    emits("row-order-change", sourceIndex, endIndex);
  }
  return [onTrDragStart, onTrDragEnter, onTrDragOver, onTrDrop, onTrDragEnd];
}
function useTree(props, dataSourceCopy, rowKeyGen, emits, onDataSourceChange) {
  const { defaultExpandAll, defaultExpandKeys, defaultExpandLevel } = props.treeConfig;
  let isFirstLoad = true;
  function toggleTreeNode(row, col) {
    const expand = row ? !row.__T_EXP__ : false;
    privateSetTreeExpand(row, { expand, col, isClick: true });
  }
  function privateSetTreeExpand(row, option) {
    const rowKeyOrRowArr = Array.isArray(row) ? row : [row];
    const tempData = dataSourceCopy.value.slice();
    for (let i = 0; i < rowKeyOrRowArr.length; i++) {
      const rowKeyOrRow = rowKeyOrRowArr[i];
      let rowKey;
      if (typeof rowKeyOrRow === "string" || typeof rowKeyOrRow === "number") {
        rowKey = rowKeyOrRow;
      } else {
        rowKey = rowKeyGen(rowKeyOrRow);
      }
      const index = tempData.findIndex((it) => rowKeyGen(it) === rowKey);
      if (index === -1) {
        console.warn("treeExpandRow failed.rowKey:", rowKey);
        return;
      }
      const row2 = tempData[index];
      const level = row2.__T_LV__ || 0;
      const wasExpanded = Boolean(row2.__T_EXP__);
      let expanded = option == null ? void 0 : option.expand;
      if (expanded === void 0) {
        expanded = !row2.__T_EXP__;
      }
      if (option.all || option.level !== void 0) {
        const targetLevel = option.all ? Infinity : option.level || 0;
        setDescendantsToLevel(row2, level + 1, targetLevel, expanded);
      }
      if (expanded) {
        if (wasExpanded) {
          const deleteCount = foldNode(index, tempData, level);
          const children = expandNode(row2, level);
          tempData.splice(index + 1, deleteCount, ...children);
        } else {
          const children = expandNode(row2, level);
          tempData.splice(index + 1, 0, ...children);
        }
      } else {
        const deleteCount = foldNode(index, tempData, level);
        tempData.splice(index + 1, deleteCount);
      }
      setNodeExpanded(row2, expanded, level);
      if (option.isClick) {
        emits("toggle-tree-expand", { expanded: Boolean(expanded), row: row2, col: option.col });
      }
    }
    dataSourceCopy.value = tempData;
    onDataSourceChange();
  }
  function setTreeExpand(row, option) {
    var _a;
    if (option == null ? void 0 : option.parents) {
      const rowKeyOrRow = Array.isArray(row) ? row[0] : row;
      const rowKey = typeof rowKeyOrRow === "string" || typeof rowKeyOrRow === "number" ? rowKeyOrRow : rowKeyGen(rowKeyOrRow);
      const path = findPath(props.dataSource || [], rowKey);
      if (!path) {
        console.warn("treeExpandRow failed.rowKey:", rowKey);
        return;
      }
      const expanded = (option == null ? void 0 : option.expand) !== false;
      const target = path[path.length - 1];
      const keys = path.slice(0, -1).map((it) => rowKeyGen(it));
      if (expanded && ((_a = target.children) == null ? void 0 : _a.length)) keys.push(rowKeyGen(target));
      if (!keys.length) return;
      if (!expanded) keys.reverse();
      privateSetTreeExpand(keys, { expand: expanded, isClick: false });
      return;
    }
    privateSetTreeExpand(row, { ...option, isClick: false });
  }
  function findPath(data, targetKey) {
    const path = [];
    function dfs(list) {
      for (const item of list) {
        if (rowKeyGen(item) === targetKey) {
          path.push(item);
          return true;
        }
        if (item.children) {
          path.push(item);
          if (dfs(item.children)) return true;
          path.pop();
        }
      }
      return false;
    }
    return dfs(data) ? path : null;
  }
  function setNodeExpanded(row, expanded, level, parent) {
    row.__T_EXP__ = expanded;
    if (level !== void 0) {
      row.__T_LV__ = level;
    }
  }
  function recursionFlat(data, level, parent) {
    if (!data) return [];
    let result = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      result.push(item);
      const isExpanded = Boolean(item.__T_EXP__);
      setNodeExpanded(item, isExpanded, level);
      if (isFirstLoad && !isExpanded) {
        if (defaultExpandAll) {
          setNodeExpanded(item, true);
        } else {
          if (defaultExpandLevel && level < defaultExpandLevel) {
            setNodeExpanded(item, true);
          }
          if (defaultExpandKeys == null ? void 0 : defaultExpandKeys.includes(rowKeyGen(item))) {
            setNodeExpanded(item, true);
          }
        }
      }
      if (item.__T_EXP__) {
        const res = recursionFlat(item.children, level + 1);
        result = result.concat(res);
      }
    }
    return result;
  }
  function flatTreeData(data) {
    const result = recursionFlat(data, 0);
    isFirstLoad = false;
    return result;
  }
  function setDescendantsToLevel(row, currentLevel, targetLevel, expanded) {
    if (!row.children || currentLevel > targetLevel) return;
    for (const child of row.children) {
      setNodeExpanded(child, expanded, currentLevel);
      setDescendantsToLevel(child, currentLevel + 1, targetLevel, expanded);
    }
  }
  function expandNode(row, level) {
    let result = [];
    row.children && row.children.forEach((child) => {
      result.push(child);
      const childLv = level + 1;
      if (child.__T_EXP__ && child.children) {
        const res = expandNode(child, childLv);
        result = result.concat(res);
      } else {
        setNodeExpanded(child, false, childLv);
      }
    });
    return result;
  }
  function foldNode(index, tempData, level) {
    let deleteCount = 0;
    for (let i = index + 1; i < tempData.length; i++) {
      const child = tempData[i];
      if (child.__T_LV__ && child.__T_LV__ > level) {
        deleteCount++;
      } else {
        break;
      }
    }
    return deleteCount;
  }
  return [toggleTreeNode, setTreeExpand, flatTreeData];
}
function useColWidthCache(getColWidth2) {
  let colWidthCache = { cols: null, nonFixedCols: [], leftFixedCols: [] };
  function build(cols) {
    const nonFixedCols = [];
    const leftFixedCols = [];
    let cumWidth = 0;
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const w = getColWidth2(col);
      if (col.fixed === "left") {
        leftFixedCols.push({ index: i, width: w });
        continue;
      }
      cumWidth += w;
      nonFixedCols.push({ index: i, cumWidth });
    }
    colWidthCache = { cols, nonFixedCols, leftFixedCols };
    return colWidthCache;
  }
  function get(cols) {
    if (colWidthCache.cols === cols) return colWidthCache;
    return build(cols);
  }
  function clear() {
    colWidthCache.cols = null;
  }
  return [get, clear];
}
const VUE2_SCROLL_TIMEOUT_MS = 200;
const MAX_MERGE_RANGE_EXPAND_ITERATIONS = 8;
function useVirtualScroll(props, tableContainerRef, trRef, dataSourceCopy, tableHeaderLast, tableHeaders, rowKeyGen, maxRowSpan, getMaxRowSpanValue, scrollbarOptions, isExperimentalScrollY, mergeCellsCache) {
  const tableHeaderHeight = computed(() => props.headerRowHeight * tableHeaders.value.length);
  const virtualScroll = shallowRef({
    containerHeight: 0,
    rowHeight: props.rowHeight,
    pageSize: 0,
    startIndex: 0,
    endIndex: 0,
    offsetTop: 0,
    scrollTop: 0,
    scrollHeight: 0,
    translateY: 0,
    viewportStartIndex: 0,
    viewportEndIndex: 0
  });
  const virtualScrollX = shallowRef({
    containerWidth: 0,
    scrollWidth: 0,
    startIndex: 0,
    endIndex: 0,
    offsetLeft: 0,
    scrollLeft: 0
  });
  const [getColWidthCache, clearColWidthCache] = useColWidthCache(getCalculatedColWidth);
  const hasExpandCol = computed(() => {
    return tableHeaderLast.value.some((col) => col.type === "expand");
  });
  const virtual_on = computed(() => {
    return props.virtual && dataSourceCopy.value.length > virtualScroll.value.pageSize;
  });
  const virtual_dataSourcePart = computed(() => {
    if (!virtual_on.value) return dataSourceCopy.value;
    const { startIndex, endIndex } = virtualScroll.value;
    return dataSourceCopy.value.slice(startIndex, endIndex + 1);
  });
  const virtual_offsetBottom = computed(() => {
    if (!virtual_on.value) return 0;
    const { startIndex, endIndex } = virtualScroll.value;
    const dataSourceCopyValue = dataSourceCopy.value;
    const rowHeight = getRowHeightFn.value();
    if (props.autoRowHeight) {
      let offsetBottom = 0;
      for (let i = endIndex + 1; i < dataSourceCopyValue.length; i++) {
        const rowHeight2 = getRowHeightFn.value(dataSourceCopyValue[i]);
        offsetBottom += rowHeight2;
      }
      return offsetBottom;
    }
    return (dataSourceCopyValue.length - startIndex - virtual_dataSourcePart.value.length) * rowHeight;
  });
  const virtualX_on = computed(() => {
    return props.virtualX && tableHeaderLast.value.reduce((sum, col) => sum += getCalculatedColWidth(col), 0) > virtualScrollX.value.containerWidth + 100;
  });
  const isMultiLevelHeader = computed(() => tableHeaders.value.length > 1);
  const virtualX_mergeColsInfo = computed(() => {
    const headers = tableHeaderLast.value;
    const headerLength = headers.length;
    let maxColIndex = headerLength;
    const mergeCols = [];
    for (let i = 0; i < headerLength; i++) {
      const col = headers[i];
      if (maxColIndex === headerLength && col.fixed === "right") maxColIndex = i;
      if (col.mergeCells && !col.fixed) mergeCols.push({ col, index: i });
    }
    if (!mergeCols.length || !maxColIndex) return null;
    return { headerLength, maxColIndex, mergeCols };
  });
  function buildColMergeRange(rows, rowIndexBase) {
    const mergeColsInfo = virtualX_mergeColsInfo.value;
    if (!mergeColsInfo) return null;
    const { headerLength, maxColIndex, mergeCols } = mergeColsInfo;
    const leftReach = new Int32Array(headerLength).fill(-1);
    const rightEnd = new Int32Array(headerLength);
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let m = 0; m < mergeCols.length; m++) {
        const { col, index } = mergeCols[m];
        if (index >= maxColIndex) break;
        const { colspan } = mergeCellsCache.getMergeCellsResult(row, col, rowIndexBase + r, index);
        if (colspan > 1) {
          const end = Math.min(index + colspan, maxColIndex);
          for (let c = index; c < end; c++) {
            if (leftReach[c] === -1 || index < leftReach[c]) leftReach[c] = index;
            if (end > rightEnd[c]) rightEnd[c] = end;
          }
        }
      }
    }
    return { leftReach, rightEnd };
  }
  const virtualX_colMergeRangeFull = computed(() => {
    if (!virtualX_on.value || virtual_on.value) return null;
    return buildColMergeRange(dataSourceCopy.value, 0);
  });
  const virtualX_colMergeRange = computed(() => {
    if (!virtualX_on.value) return null;
    if (virtual_on.value) {
      return buildColMergeRange(virtual_dataSourcePart.value, virtualScroll.value.startIndex);
    }
    return virtualX_colMergeRangeFull.value;
  });
  const virtualX_colRange = computed(() => {
    let { startIndex, endIndex } = virtualScrollX.value;
    const mergeRange = virtualX_colMergeRange.value;
    if (mergeRange) {
      const { leftReach, rightEnd } = mergeRange;
      const len = leftReach.length;
      for (let k = 0; k < MAX_MERGE_RANGE_EXPAND_ITERATIONS; k++) {
        let newStart = startIndex;
        let newEnd = endIndex;
        const loopEnd = Math.min(endIndex, len);
        for (let i = Math.max(0, startIndex); i < loopEnd; i++) {
          const reach = leftReach[i];
          if (reach > -1 && reach < newStart) newStart = reach;
          if (rightEnd[i] > newEnd) newEnd = rightEnd[i];
        }
        if (newStart === startIndex && newEnd === endIndex) break;
        startIndex = newStart;
        endIndex = newEnd;
      }
    }
    return { startIndex, endIndex };
  });
  const theadVirtualX = computed(() => {
    if (!virtualX_on.value) {
      const { startIndex: startIndex2, endIndex: endIndex2, offsetLeft } = virtualScrollX.value;
      return { startIndex: startIndex2, endIndex: endIndex2, offsetLeft };
    }
    const { startIndex, endIndex } = virtualX_colRange.value;
    if (!isMultiLevelHeader.value) {
      const { nonFixedCols } = getColWidthCache(tableHeaderLast.value);
      const found = binarySearch(nonFixedCols, (mid) => nonFixedCols[mid].index < startIndex ? -1 : 1);
      const offsetLeft = found > 0 ? nonFixedCols[found - 1].cumWidth : 0;
      return { startIndex, endIndex, offsetLeft };
    }
    const topLevelCols = tableHeaders.value[0];
    const totalLeafCount = tableHeaderLast.value.length;
    let theadStartIndex = totalLeafCount;
    let theadEndIndex = totalLeafCount;
    let theadOffsetLeft = 0;
    let cumLeft = 0;
    let foundStart = false;
    for (let i = 0, len = topLevelCols.length; i < len; i++) {
      const col = topLevelCols[i];
      if (col.fixed === "left" || col.fixed === "right") continue;
      const groupStart = col.__LF_S__ ?? 0;
      const groupEnd = col.__LF_E__ ?? groupStart + 1;
      const groupWidth = col.__W__ || getCalculatedColWidth(col);
      if (!foundStart && groupEnd > startIndex) {
        foundStart = true;
        theadStartIndex = groupStart;
        theadOffsetLeft = cumLeft;
      }
      if (foundStart) {
        if (groupStart >= endIndex) break;
        theadEndIndex = groupEnd;
      }
      cumLeft += groupWidth;
    }
    if (!foundStart) {
      theadOffsetLeft = cumLeft;
    }
    return { startIndex: theadStartIndex, endIndex: theadEndIndex, offsetLeft: theadOffsetLeft };
  });
  const virtualX_columnPart = computed(() => {
    const tableHeaderLastValue = tableHeaderLast.value;
    if (virtualX_on.value) {
      const { startIndex, endIndex } = virtualX_colRange.value;
      const maxIndex = tableHeaderLastValue.length;
      const validEndIndex = Math.min(endIndex, maxIndex);
      const validStartIndex = Math.min(startIndex, maxIndex);
      if (isMultiLevelHeader.value) {
        const leftFixedCols = [];
        const rightFixedCols = [];
        const visibleCols = [];
        for (let i = 0; i < tableHeaderLastValue.length; i++) {
          const col = tableHeaderLastValue[i];
          if (col.fixed === "right") {
            rightFixedCols.push(col);
          } else if (col.fixed === "left") {
            leftFixedCols.push(col);
          } else if (i >= validStartIndex && i < validEndIndex) {
            visibleCols.push(col);
          }
        }
        const result = [];
        result.push(...leftFixedCols);
        const theadStart = theadVirtualX.value.startIndex;
        const leftSpacerColspan = Math.max(0, startIndex - theadStart);
        if (leftSpacerColspan) {
          result.push({ __VT_C_SP__: leftSpacerColspan });
        }
        result.push(...visibleCols);
        const rightSpacerColspan = Math.max(0, theadVirtualX.value.endIndex - endIndex);
        if (rightSpacerColspan) {
          result.push({ __VT_C_SP__: rightSpacerColspan });
        }
        result.push(...rightFixedCols);
        return result;
      }
      const leftCols = [];
      const rightCols = [];
      for (let i = 0; i < validStartIndex; i++) {
        const col = tableHeaderLastValue[i];
        if ((col == null ? void 0 : col.fixed) === "left") leftCols.push(col);
      }
      for (let i = validEndIndex; i < tableHeaderLastValue.length; i++) {
        const col = tableHeaderLastValue[i];
        if ((col == null ? void 0 : col.fixed) === "right") rightCols.push(col);
      }
      const mainColumns = tableHeaderLastValue.slice(validStartIndex, validEndIndex);
      return leftCols.concat(mainColumns).concat(rightCols);
    }
    return tableHeaderLastValue;
  });
  const virtualX_expandColSegments = computed(() => {
    if (!virtualX_on.value || isMultiLevelHeader.value) return null;
    const { startIndex: xStart, endIndex: xEnd } = virtualScrollX.value;
    const { startIndex: cStart, endIndex: cEnd } = virtualX_colRange.value;
    if (cStart >= xStart && cEnd <= xEnd) return null;
    const headers = tableHeaderLast.value;
    const maxIndex = headers.length;
    const vs = Math.min(cStart, maxIndex);
    const ve = Math.min(cEnd, maxIndex);
    const prefix = [];
    const suffix = [];
    for (let i = 0; i < headers.length; i++) {
      const col = headers[i];
      if (i < vs && col.fixed === "left") prefix.push(col);
      else if (i >= ve && col.fixed === "right") suffix.push(col);
    }
    return {
      prefix,
      leftExpand: headers.slice(vs, Math.min(xStart, ve)),
      // 可视区取原始视口范围；[xEnd, cEnd) 为右扩展区，不进入 tbody 行列表
      viewport: headers.slice(Math.min(xStart, ve), Math.min(xEnd, ve)),
      suffix,
      /** leftExpand 起始的绝对叶子列索引（mergeCells 缓存键用） */
      leftExpandStart: vs
    };
  });
  const virtualX_tableHeaders = computed(() => {
    if (!virtualX_on.value) return tableHeaders.value;
    if (isMultiLevelHeader.value) {
      const { startIndex, endIndex } = theadVirtualX.value;
      return tableHeaders.value.map((row) => {
        return row.filter((col) => {
          if (col.fixed === "left" || col.fixed === "right") return true;
          const leafStart = col.__LF_S__ ?? 0;
          const leafEnd = col.__LF_E__ ?? leafStart + 1;
          return leafEnd > startIndex && leafStart < endIndex;
        });
      });
    }
    const headers = tableHeaders.value;
    return headers.map((row, i) => i === headers.length - 1 ? virtualX_columnPart.value : row);
  });
  const expandRowColspan = computed(() => {
    if (!virtualX_on.value) return tableHeaderLast.value.length;
    const spacers = virtualX_columnPart.value.filter((c) => c.__VT_C_SP__);
    return 2 + virtualX_columnPart.value.length + spacers.reduce((sum, s) => sum + Math.max(0, (s.__VT_C_SP__ ?? 0) - 1), 0);
  });
  const virtualX_offsetRight = computed(() => {
    if (!virtualX_on.value) return 0;
    const endIndex = isMultiLevelHeader.value ? theadVirtualX.value.endIndex : virtualX_colRange.value.endIndex;
    let width = 0;
    const tableHeaderLastValue = tableHeaderLast.value;
    for (let i = endIndex; i < tableHeaderLastValue.length; i++) {
      const col = tableHeaderLastValue[i];
      if (col.fixed !== "right") {
        width += getCalculatedColWidth(col);
      }
    }
    return width;
  });
  const getRowHeightFn = computed(() => {
    var _a;
    const rowHeight = props.rowHeight || DEFAULT_ROW_HEIGHT;
    let rowHeightFn = () => rowHeight;
    if (props.autoRowHeight) {
      const tempRowHeightFn = rowHeightFn;
      rowHeightFn = (row) => getAutoRowHeight(row) || tempRowHeightFn(row);
    }
    if (hasExpandCol.value) {
      const expandedRowHeight = (_a = props.expandConfig) == null ? void 0 : _a.height;
      const tempRowHeightFn = rowHeightFn;
      rowHeightFn = (row) => row && row.__EXP_R__ && expandedRowHeight || tempRowHeightFn(row);
    }
    return rowHeightFn;
  });
  function initVirtualScroll(height) {
    initVirtualScrollY(height);
    initVirtualScrollX();
  }
  function initVirtualScrollY(height) {
    var _a;
    if (height !== void 0 && typeof height !== "number") {
      console.warn("initVirtualScrollY: height must be a number");
      height = 0;
    }
    const { clientHeight, scrollHeight } = tableContainerRef.value || {};
    let scrollTop = isExperimentalScrollY.value ? virtualScroll.value.scrollTop : ((_a = tableContainerRef.value) == null ? void 0 : _a.scrollTop) || 0;
    const rowHeight = getRowHeightFn.value();
    const containerHeight = height || clientHeight || DEFAULT_TABLE_HEIGHT;
    const { headless } = props;
    let pageSize = Math.ceil(containerHeight / rowHeight);
    if (!headless) {
      const headerToBodyRowHeightCount = Math.floor(tableHeaderHeight.value / rowHeight);
      pageSize -= headerToBodyRowHeightCount;
    }
    const maxScrollTop = Math.max(0, dataSourceCopy.value.length * rowHeight + tableHeaderHeight.value - containerHeight);
    if (scrollTop > maxScrollTop) {
      scrollTop = maxScrollTop;
    }
    Object.assign(virtualScroll.value, { containerHeight, pageSize, scrollHeight });
    triggerRef(virtualScroll);
    updateVirtualScrollY(scrollTop);
  }
  function initVirtualScrollX() {
    const { clientWidth, scrollLeft, scrollWidth } = tableContainerRef.value || {};
    virtualScrollX.value.containerWidth = clientWidth || DEFAULT_TABLE_WIDTH;
    virtualScrollX.value.scrollWidth = scrollWidth || DEFAULT_TABLE_WIDTH;
    triggerRef(virtualScrollX);
    updateVirtualScrollX(scrollLeft);
  }
  let vue2ScrollYTimeout = null;
  const autoRowHeightMap = /* @__PURE__ */ new Map();
  function setAutoHeight(rowKey, height) {
    const key = String(rowKey);
    if (!height) {
      autoRowHeightMap.delete(key);
    } else {
      autoRowHeightMap.set(key, height);
    }
  }
  function clearAllAutoHeight() {
    autoRowHeightMap.clear();
  }
  function getAutoRowHeight(row) {
    var _a;
    if (!row) return;
    const rowKey = rowKeyGen(row);
    const storedHeight = autoRowHeightMap.get(String(rowKey));
    if (storedHeight) {
      return storedHeight;
    }
    const expectedHeight = (_a = props.autoRowHeight) == null ? void 0 : _a.expectedHeight;
    if (expectedHeight) {
      if (typeof expectedHeight === "function") {
        return expectedHeight(row);
      } else {
        return expectedHeight;
      }
    }
  }
  function updateVirtualScrollY(sTop = 0) {
    const { pageSize, scrollTop, startIndex: oldStartIndex, endIndex: oldEndIndex, containerHeight } = virtualScroll.value;
    const dataSourceCopyTemp = dataSourceCopy.value;
    const dataLength = dataSourceCopyTemp.length;
    const rowHeight = getRowHeightFn.value();
    const vsValue = {};
    const scrollHeight = dataLength * rowHeight + tableHeaderHeight.value;
    const { enabled: scrollbarEnable } = scrollbarOptions.value;
    if (scrollbarEnable) {
      vsValue.scrollHeight = scrollHeight;
      if (isExperimentalScrollY.value) {
        let maxTop;
        sTop = sTop < 0 ? 0 : sTop < (maxTop = scrollHeight - containerHeight) ? sTop : maxTop;
        vsValue.translateY = props.scrollRowByRow ? 0 : -(sTop % rowHeight);
      }
    }
    vsValue.scrollTop = sTop;
    Object.assign(virtualScroll.value, vsValue);
    triggerRef(virtualScroll);
    if (!virtual_on.value) {
      Object.assign(virtualScroll.value, {
        startIndex: 0,
        endIndex: 0,
        offsetTop: 0,
        viewportStartIndex: 0,
        viewportEndIndex: 0
      });
      triggerRef(virtualScroll);
      return;
    }
    const { autoRowHeight, stripe, optimizeVue2Scroll } = props;
    let startIndex = 0;
    let endIndex = dataLength;
    let autoRowHeightTop = 0;
    if (autoRowHeight || hasExpandCol.value) {
      if (autoRowHeight && trRef.value) {
        const trElements = trRef.value;
        for (let i = 0, len = trElements.length; i < len; i++) {
          const tr = trElements[i];
          const rowKey = tr.dataset.rowKey;
          if (!rowKey || autoRowHeightMap.has(rowKey)) continue;
          autoRowHeightMap.set(rowKey, tr.offsetHeight);
        }
      }
      for (let i = 0; i < dataLength; i++) {
        const height = getRowHeightFn.value(dataSourceCopyTemp[i]);
        autoRowHeightTop += height;
        if (autoRowHeightTop >= sTop) {
          startIndex = i;
          autoRowHeightTop -= height;
          break;
        }
      }
      let containerHeightSum = 0;
      for (let i = startIndex + 1; i < dataLength; i++) {
        containerHeightSum += getRowHeightFn.value(dataSourceCopyTemp[i]);
        if (containerHeightSum >= containerHeight) {
          endIndex = i;
          break;
        }
      }
    } else {
      startIndex = Math.floor(sTop / rowHeight);
      endIndex = startIndex + pageSize;
      if (startIndex === oldStartIndex && endIndex === oldEndIndex) {
        const vs = virtualScroll.value;
        if (vs.viewportStartIndex !== startIndex || vs.viewportEndIndex !== endIndex) {
          vs.viewportStartIndex = startIndex;
          vs.viewportEndIndex = endIndex;
          triggerRef(virtualScroll);
        }
        return;
      }
    }
    const viewportStartIndex = startIndex;
    const viewportEndIndex = endIndex;
    if (maxRowSpan.size) {
      let correctedStartIndex = startIndex;
      let correctedEndIndex = endIndex;
      const scanFrom = Math.max(0, startIndex - getMaxRowSpanValue() + 1);
      for (let i = startIndex - 1; i >= scanFrom; i--) {
        const row = dataSourceCopyTemp[i];
        if (!row) continue;
        const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
        if (spanEndIndex > startIndex) {
          correctedStartIndex = i;
          if (spanEndIndex > endIndex) {
            correctedEndIndex = spanEndIndex - 1;
          }
        }
      }
      for (let i = correctedStartIndex; i < endIndex; i++) {
        const row = dataSourceCopyTemp[i];
        if (!row) continue;
        const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
        if (spanEndIndex > correctedEndIndex) {
          correctedEndIndex = Math.max(spanEndIndex - 1, correctedEndIndex);
        }
      }
      startIndex = correctedStartIndex;
      endIndex = correctedEndIndex;
    }
    if (stripe && !isExperimentalScrollY.value && startIndex > 0 && startIndex % 2) {
      startIndex -= 1;
      if (autoRowHeight || hasExpandCol.value) {
        const height = getRowHeightFn.value(dataSourceCopyTemp[startIndex]);
        autoRowHeightTop -= height;
      }
    }
    startIndex = Math.max(0, startIndex);
    endIndex = Math.min(endIndex, dataLength);
    if (startIndex >= endIndex) {
      startIndex = endIndex - pageSize;
    }
    if (vue2ScrollYTimeout) {
      window.clearTimeout(vue2ScrollYTimeout);
    }
    let offsetTop = 0;
    if (autoRowHeight || hasExpandCol.value) {
      offsetTop = autoRowHeightTop;
    } else {
      offsetTop = startIndex * rowHeight;
    }
    if (!optimizeVue2Scroll || sTop <= scrollTop || Math.abs(oldStartIndex - startIndex) >= pageSize) {
      Object.assign(virtualScroll.value, { startIndex, endIndex, offsetTop, viewportStartIndex, viewportEndIndex });
      triggerRef(virtualScroll);
    } else {
      Object.assign(virtualScroll.value, { endIndex, viewportStartIndex, viewportEndIndex });
      triggerRef(virtualScroll);
      vue2ScrollYTimeout = window.setTimeout(() => {
        Object.assign(virtualScroll.value, { startIndex, offsetTop, viewportStartIndex, viewportEndIndex });
        triggerRef(virtualScroll);
      }, VUE2_SCROLL_TIMEOUT_MS);
    }
  }
  let vue2ScrollXTimeout = null;
  function updateVirtualScrollX(sLeft = 0) {
    if (!props.virtualX) return;
    const tableHeaderLastValue = tableHeaderLast.value;
    const headerLength = tableHeaderLastValue == null ? void 0 : tableHeaderLastValue.length;
    if (!headerLength) return;
    const { scrollLeft, containerWidth } = virtualScrollX.value;
    let startIndex = 0;
    let offsetLeft = 0;
    let leftFirstColRestWidth = 0;
    const { nonFixedCols, leftFixedCols } = getColWidthCache(tableHeaderLastValue);
    if (nonFixedCols.length > 0 && sLeft > 0) {
      const found = binarySearch(nonFixedCols, (mid) => {
        return nonFixedCols[mid].cumWidth <= sLeft ? -1 : 1;
      });
      const idx = Math.min(found, nonFixedCols.length - 1);
      startIndex = nonFixedCols[idx].index;
      offsetLeft = idx > 0 ? nonFixedCols[idx - 1].cumWidth : 0;
      leftFirstColRestWidth = nonFixedCols[idx].cumWidth - sLeft;
    } else if (nonFixedCols.length > 0) {
      startIndex = nonFixedCols[0].index;
    }
    let actualLeftColWidthSum = 0;
    for (const leftCol of leftFixedCols) {
      if (leftCol.index >= startIndex) break;
      actualLeftColWidthSum += leftCol.width;
    }
    const containerW = containerWidth - actualLeftColWidthSum;
    let endIndex = headerLength;
    let endColWidthSum = leftFirstColRestWidth;
    for (let colIndex = leftFirstColRestWidth ? startIndex + 1 : startIndex; colIndex < headerLength; colIndex++) {
      const col = tableHeaderLastValue[colIndex];
      endColWidthSum += getCalculatedColWidth(col);
      if (endColWidthSum >= containerW) {
        endIndex = colIndex + 1;
        break;
      }
    }
    endIndex = Math.min(endIndex, headerLength);
    if (vue2ScrollXTimeout) {
      window.clearTimeout(vue2ScrollXTimeout);
    }
    if (!props.optimizeVue2Scroll || sLeft <= scrollLeft) {
      Object.assign(virtualScrollX.value, { startIndex, endIndex, offsetLeft, scrollLeft: sLeft });
      triggerRef(virtualScrollX);
    } else {
      Object.assign(virtualScrollX.value, { endIndex, scrollLeft: sLeft });
      triggerRef(virtualScrollX);
      vue2ScrollXTimeout = window.setTimeout(() => {
        Object.assign(virtualScrollX.value, { startIndex, offsetLeft });
        triggerRef(virtualScrollX);
      }, VUE2_SCROLL_TIMEOUT_MS);
    }
  }
  return [
    virtualScroll,
    virtualScrollX,
    virtual_on,
    virtual_dataSourcePart,
    virtual_offsetBottom,
    virtualX_on,
    virtualX_offsetRight,
    tableHeaderHeight,
    initVirtualScroll,
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX,
    setAutoHeight,
    clearAllAutoHeight,
    clearColWidthCache,
    virtualX_tableHeaders,
    expandRowColspan,
    theadVirtualX,
    virtualX_columnPart,
    virtualX_expandColSegments
  ];
}
function useWheeling(resetDelay = 500) {
  let valueRef = false;
  let timerRef = 0;
  const get = () => valueRef;
  const set = (newValue) => {
    valueRef = newValue;
    if (newValue) {
      if (timerRef) {
        self.clearTimeout(timerRef);
      }
      timerRef = self.setTimeout(() => {
        valueRef = false;
        timerRef = 0;
      }, resetDelay);
    }
  };
  return [get, set];
}
const _hoisted_1$2 = ["tabindex"];
const _hoisted_2$1 = { class: "stk-table-scroll-container" };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["onMousedown"];
const _hoisted_7 = { class: "table-header-title" };
const _hoisted_8 = ["onMousedown"];
const _hoisted_9 = ["colspan"];
const _hoisted_10 = ["title"];
const _hoisted_11 = { key: 0 };
const _hoisted_12 = ["colspan"];
const _hoisted_13 = ["colspan"];
const _hoisted_14 = {
  class: "table-cell-wrapper",
  tabindex: "-1"
};
const _hoisted_15 = {
  key: 0,
  class: "vt-x-left"
};
const _hoisted_16 = ["colspan"];
const _hoisted_17 = ["colspan"];
const _hoisted_18 = ["title"];
const _hoisted_19 = {
  key: 2,
  class: "table-cell-wrapper",
  tabindex: "-1"
};
const _hoisted_20 = ["title"];
const _hoisted_21 = { key: 2 };
const _hoisted_22 = {
  key: 1,
  class: "vt-x-right"
};
const _hoisted_23 = ["data-above-count"];
const _hoisted_24 = ["data-below-count"];
const __default__ = {
  name: "StkTable"
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: {
    width: { default: "" },
    minWidth: { default: "" },
    maxWidth: { default: "" },
    stripe: { type: Boolean, default: false },
    fixedMode: { type: Boolean, default: false },
    headless: { type: Boolean, default: false },
    theme: { default: "light" },
    rowHeight: { default: DEFAULT_ROW_HEIGHT },
    autoRowHeight: { type: [Boolean, Object], default: () => false },
    rowHover: { type: Boolean, default: true },
    rowActive: { type: [Boolean, Object], default: () => DEFAULT_ROW_ACTIVE_CONFIG },
    rowCurrentRevokable: { type: Boolean, default: true },
    headerRowHeight: { default: DEFAULT_ROW_HEIGHT },
    footerRowHeight: { default: DEFAULT_ROW_HEIGHT },
    virtual: { type: Boolean, default: false },
    virtualX: { type: Boolean, default: false },
    columns: { default: () => [] },
    dataSource: { default: () => [] },
    rowKey: { type: [String, Number, Function], default: "" },
    colKey: { type: [String, Number, Function], default: void 0 },
    emptyCellText: { type: [String, Function], default: "--" },
    noDataFull: { type: Boolean, default: false },
    showNoData: { type: Boolean, default: true },
    sortRemote: { type: Boolean, default: false },
    showHeaderOverflow: { type: Boolean, default: false },
    showOverflow: { type: Boolean, default: false },
    showTrHoverClass: { type: Boolean, default: false },
    cellHover: { type: Boolean, default: false },
    cellActive: { type: Boolean, default: false },
    selectedCellRevokable: { type: Boolean, default: true },
    areaSelection: { type: Boolean, default: false },
    headerDrag: { type: [Boolean, Object], default: () => false },
    rowClassName: { type: Function, default: () => "" },
    colResizable: { type: [Boolean, Object], default: () => false },
    colMinWidth: { default: 10 },
    bordered: { type: [Boolean, String], default: true },
    autoResize: { type: [Boolean, Function], default: true },
    fixedColShadow: { type: Boolean, default: false },
    optimizeVue2Scroll: { type: Boolean, default: false },
    sortConfig: { default: () => DEFAULT_SORT_CONFIG },
    hideHeaderTitle: { type: [Boolean, Array], default: false },
    highlightConfig: { default: () => ({}) },
    seqConfig: { default: () => ({}) },
    expandConfig: { default: () => ({}) },
    dragRowConfig: { default: () => ({}) },
    treeConfig: { default: () => ({}) },
    cellFixedMode: { default: "sticky" },
    smoothScroll: { type: Boolean, default: DEFAULT_SMOOTH_SCROLL },
    scrollRowByRow: { type: [Boolean, String], default: false },
    scrollbar: { type: [Boolean, Object], default: false },
    experimental: { default: () => ({}) },
    footerData: { default: () => [] },
    footerConfig: { default: () => ({ position: "bottom" }) }
  },
  emits: ["sort-change", "row-click", "current-change", "cell-selected", "row-dblclick", "header-row-menu", "row-menu", "cell-click", "cell-mouseenter", "cell-mouseleave", "cell-mouseover", "cell-mousedown", "header-cell-click", "scroll", "scroll-x", "col-order-change", "th-drag-start", "th-drop", "row-order-change", "col-resize", "toggle-row-expand", "toggle-tree-expand", "area-selection-change", "filter-change", "update:columns"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const stkTableId = createStkTableId();
    const props = __props;
    provide("stkTheme", toRef(props, "theme"));
    const emits = __emit;
    const tableContainerRef = ref();
    const colResizeIndicatorRef = ref();
    const trRef = ref();
    const isRelativeMode = ref(IS_LEGACY_MODE ? true : props.cellFixedMode === "relative");
    const isFooterTop = computed(() => {
      var _a;
      return ((_a = props.footerConfig) == null ? void 0 : _a.position) === "top";
    });
    const footerTagName = computed(() => isFooterTop.value ? "tbody" : "tfoot");
    const currentRow = shallowRef();
    const currentRowKey = ref();
    const currentSelectedCellKey = ref();
    let currentHoverRow = null;
    const currentHoverRowKey = ref(null);
    const [tableHeaders, tableHeadersForCalc, dealColumns] = useTableColumns(props.virtualX, isRelativeMode);
    const filterStatus = ref({});
    const tableHeaderLast = computed(() => tableHeadersForCalc.value.slice(-1)[0] || []);
    const isTreeData = computed(() => {
      return props.columns.some((col) => col.type === "tree-node");
    });
    const rowActiveProp = computed(() => {
      const { rowActive } = props;
      if (typeof rowActive === "boolean") {
        return {
          ...DEFAULT_ROW_ACTIVE_CONFIG,
          enabled: rowActive ?? true,
          revokable: Boolean(props.rowCurrentRevokable)
        };
      } else {
        return { ...DEFAULT_ROW_ACTIVE_CONFIG, ...rowActive };
      }
    });
    const dataSourceCopy = shallowRef([]);
    const rowKeyGenComputed = computed(() => {
      const { rowKey } = props;
      if (typeof rowKey === "function") {
        return (row) => rowKey(row);
      } else {
        return (row) => row[rowKey];
      }
    });
    const colKeyGen = computed(() => {
      const { colKey } = props;
      if (colKey === void 0) {
        return (col) => col.key || col.dataIndex;
      } else if (typeof colKey === "function") {
        return (col) => colKey(col);
      } else {
        return (col) => col[colKey];
      }
    });
    const getEmptyCellText = computed(() => {
      const { emptyCellText } = props;
      if (typeof emptyCellText === "string") {
        return () => emptyCellText;
      } else {
        return (col, row) => emptyCellText({ row, col });
      }
    });
    const SRBRTotalHeight = computed(() => {
      if (!isSRBRActive.value || !props.virtual) return 0;
      return dataSourceCopy.value.length * virtualScroll.value.rowHeight + tableHeaderHeight.value;
    });
    const SRBRBottomHeight = computed(() => {
      if (!isSRBRActive.value || !props.virtual) return 0;
      const { containerHeight, rowHeight } = virtualScroll.value;
      return (containerHeight - tableHeaderHeight.value) % rowHeight;
    });
    const scrollbarOptions = computed(() => ({
      enabled: true,
      minHeight: 20,
      minWidth: 20,
      width: 8,
      height: 8,
      ...typeof props.scrollbar === "boolean" ? { enabled: props.scrollbar } : props.scrollbar
    }));
    const isExperimentalScrollY = computed(() => {
      var _a, _b;
      if (((_a = scrollbarOptions.value) == null ? void 0 : _a.enabled) && props.scrollRowByRow) {
        return true;
      }
      return (_b = props.experimental) == null ? void 0 : _b.scrollY;
    });
    const rowKeyGenCache = /* @__PURE__ */ new WeakMap();
    const [sortStates, sortCol, onColumnSort, setSorter, resetSorter, getSortColumns, dealDefaultSorter, getColumnSortState, sortData] = useSorter(
      props,
      emits,
      colKeyGen,
      tableHeaderLast,
      dataSourceCopy,
      initDataSource
    );
    const [isSRBRActive] = useScrollRowByRow(props, tableContainerRef);
    const [onThDragStart, onThDragOver, onThDrop, isHeaderDraggable] = useThDrag(props, emits, colKeyGen);
    const [onTrDragStart, onTrDragEnter, onTrDragOver, onTrDrop, onTrDragEnd] = useTrDrag(props, emits, dataSourceCopy);
    const [maxRowSpan, updateMaxRowSpan, getMaxRowSpanValue] = useMaxRowSpan(props, tableHeaderLast, rowKeyGen, dataSourceCopy);
    const mergeCellsCache = createMergeCellsCache();
    const [
      virtualScroll,
      virtualScrollX,
      virtual_on,
      virtual_dataSourcePart,
      virtual_offsetBottom,
      virtualX_on,
      virtualX_offsetRight,
      tableHeaderHeight,
      initVirtualScroll,
      initVirtualScrollY,
      initVirtualScrollX,
      updateVirtualScrollY,
      updateVirtualScrollX,
      setAutoHeight,
      clearAllAutoHeight,
      clearColWidthCache,
      virtualX_tableHeaders,
      expandRowColspan,
      theadVirtualX,
      virtualX_columnPart,
      virtualX_expandColSegments
    ] = useVirtualScroll(
      props,
      tableContainerRef,
      trRef,
      dataSourceCopy,
      tableHeaderLast,
      tableHeaders,
      rowKeyGen,
      maxRowSpan,
      getMaxRowSpanValue,
      scrollbarOptions,
      isExperimentalScrollY,
      mergeCellsCache
    );
    const rafUpdateVirtualScrollYForWheel = rafThrottle(updateVirtualScrollY);
    const [scrollbar, showScrollbar, onVerticalScrollbarMouseDown, onHorizontalScrollbarMouseDown, updateCustomScrollbar] = useScrollbar(
      props,
      tableContainerRef,
      virtualScroll,
      virtualScrollX,
      updateVirtualScrollY,
      scrollbarOptions,
      isExperimentalScrollY
    );
    const canMergeEmptyRows = computed(() => virtual_on.value && !props.autoRowHeight);
    const aboveViewportRowCount = computed(() => {
      if (!canMergeEmptyRows.value) return 0;
      const part = virtual_dataSourcePart.value;
      const { startIndex, viewportStartIndex } = virtualScroll.value;
      return Math.min(part.length, Math.max(0, viewportStartIndex - startIndex));
    });
    const belowViewportRowCount = computed(() => {
      var _a;
      if (!canMergeEmptyRows.value) return 0;
      const part = virtual_dataSourcePart.value;
      const { startIndex, viewportEndIndex } = virtualScroll.value;
      const viewportCount = Math.min(part.length, Math.max(0, viewportEndIndex - startIndex + 1));
      const count = part.length - viewportCount;
      if (count <= 0) return 0;
      for (let i = viewportCount; i < part.length; i++) {
        if ((_a = part[i]) == null ? void 0 : _a.__EXP_R__) return 0;
      }
      return count;
    });
    const [
      hiddenCellMap,
      mergeCellsWrapper,
      hoverMergedCells,
      updateHoverMergedCells,
      activeMergedCells,
      updateActiveMergedCells,
      aboveViewportColumnMap,
      aboveEmptyBlocks,
      belowPhSegments
    ] = useMergeCells(
      rowActiveProp,
      tableHeaderLast,
      rowKeyGen,
      colKeyGen,
      virtual_dataSourcePart,
      virtualScroll,
      virtualX_columnPart,
      dataSourceCopy,
      mergeCellsCache,
      canMergeEmptyRows,
      belowViewportRowCount
    );
    const getFixedColPosition = useGetFixedColPosition(tableHeadersForCalc, colKeyGen);
    const getFixedStyle = useFixedStyle(props, isRelativeMode, getFixedColPosition, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight);
    const [highlightSteps, setHighlightDimRow, setHighlightDimCell] = useHighlight(props, stkTableId, tableContainerRef);
    function getRowIndex(row) {
      const targetKey = rowKeyGen(row);
      return dataSourceCopy.value.findIndex((item) => rowKeyGen(item) === targetKey);
    }
    function getColumnIndex(column) {
      const targetKey = colKeyGen.value(column);
      return tableHeaderLast.value.findIndex((item) => colKeyGen.value(item) === targetKey);
    }
    const {
      config: areaSelectionConfig,
      isSelecting: isAreaSelecting,
      onMD: onSelectionMouseDown,
      // getClass: getAreaSelectionClasses,
      // getRowClass: getAreaSelectionRowClass,
      get: getSelectedArea,
      set: setAreaSelection,
      clear: clearSelectedArea,
      copy: copySelectedArea
    } = ON_DEMAND_FEATURE[useAreaSelectionName](
      props,
      emits,
      tableContainerRef,
      dataSourceCopy,
      tableHeaderLast,
      colKeyGen,
      cellKeyGen,
      scrollTo,
      virtualScroll,
      virtualScrollX,
      getRowIndex,
      getColumnIndex
    );
    useKeyboardArrowScroll(tableContainerRef, props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on, areaSelectionConfig);
    const [fixedCols, fixedColClassMap, updateFixedShadow] = useFixedCol(
      props,
      colKeyGen,
      getFixedColPosition,
      tableHeaders,
      tableHeadersForCalc,
      tableContainerRef
    );
    if (props.autoResize) {
      useAutoResize(
        tableContainerRef,
        () => {
          initVirtualScroll();
          updateFixedShadow();
        },
        props,
        200
      );
    }
    const [colResizeOn, isColResizing, onThResizeMouseDown] = useColResize(
      props,
      emits,
      tableContainerRef,
      tableHeaderLast,
      colResizeIndicatorRef,
      colKeyGen,
      fixedCols,
      clearColWidthCache
    );
    const [toggleExpandRow, setRowExpand] = useRowExpand(emits, dataSourceCopy, rowKeyGen, onDataSourceChange);
    const [toggleTreeNode, setTreeExpand, flatTreeData] = useTree(props, dataSourceCopy, rowKeyGen, emits, onDataSourceChange);
    const paddingTopStyle = computed(() => `height:${virtualScroll.value.offsetTop}px`);
    const offsetBottomStyle = computed(() => `height:${virtual_offsetBottom.value}px`);
    const SRBRBottomStyle = computed(() => `height:${SRBRBottomHeight.value}px`);
    const aboveRenderParts = computed(() => {
      const aboveCount = aboveViewportRowCount.value;
      if (aboveCount <= 0) return [];
      const part = virtual_dataSourcePart.value;
      const blocks = aboveEmptyBlocks.value;
      const { startIndex } = virtualScroll.value;
      const items = [];
      let i = 0;
      let blockIdx = 0;
      while (i < aboveCount) {
        const block = blocks[blockIdx];
        if (block && block.start === startIndex + i) {
          items.push({ type: "above-ph", count: block.count, key: `vt-above-ph-${i}` });
          i += block.count;
          blockIdx++;
        } else {
          const row = part[i];
          items.push({ type: "row", row, rowIndex: i, key: rowKeyGen(row) });
          i++;
        }
      }
      return items;
    });
    const bodyRenderItems = computed(() => {
      const part = virtual_dataSourcePart.value;
      const items = aboveRenderParts.value.slice();
      const rowEnd = part.length - belowViewportRowCount.value;
      for (let i = aboveViewportRowCount.value; i < rowEnd; i++) {
        const row = part[i];
        items.push({ type: "row", row, rowIndex: i, key: rowKeyGen(row) });
      }
      const belowSegs = belowPhSegments.value;
      for (let i = 0; i < belowSegs.length; i++) {
        items.push({ type: "below-ph", count: belowSegs[i].count, key: `vt-below-ph-${i}` });
      }
      return items;
    });
    watch(
      () => props.columns,
      () => {
        handleDealColumns();
        updateMaxRowSpan();
        nextTick(() => {
          initVirtualScrollX();
          updateFixedShadow();
          updateCustomScrollbar();
        });
      }
    );
    watch(
      () => props.virtual,
      () => {
        nextTick(initVirtualScrollY);
      }
    );
    watch(() => props.rowHeight, initVirtualScrollY);
    watch(
      () => props.virtualX,
      () => {
        handleDealColumns();
        nextTick(() => {
          initVirtualScrollX();
          updateFixedShadow();
        });
      }
    );
    watch(
      () => props.dataSource,
      (val) => {
        updateDataSource(val);
      }
    );
    watch(
      () => props.fixedColShadow,
      () => updateFixedShadow()
    );
    handleDealColumns();
    initDataSource();
    updateMaxRowSpan();
    onMounted(() => {
      initVirtualScroll();
      updateFixedShadow();
      dealDefaultSorter();
    });
    async function onDataSourceChange() {
      await nextTick();
      initVirtualScrollY();
      updateCustomScrollbar();
    }
    function initDataSource(v = props.dataSource, option) {
      let dataSourceTemp = v.slice();
      if (!props.sortRemote || (option == null ? void 0 : option.forceSort)) {
        dataSourceTemp = sortData(dataSourceTemp);
      }
      if (isTreeData.value) {
        dataSourceTemp = flatTreeData(dataSourceTemp);
      }
      dataSourceTemp = filterDataSource(dataSourceTemp);
      dataSourceCopy.value = dataSourceTemp;
    }
    function setFilter(status, option) {
      status = status || {};
      filterStatus.value = status;
      if (!(option == null ? void 0 : option.remote)) {
        initDataSource();
      }
      if (!(option == null ? void 0 : option.silent)) {
        emits("filter-change", status);
      }
    }
    function filterDataSource(dataSource) {
      const filterKeys = Object.keys(filterStatus.value);
      if (!(filterKeys == null ? void 0 : filterKeys.length)) return dataSource;
      let result = dataSource;
      for (const key of filterKeys) {
        const { value, filter } = filterStatus.value[key];
        if (!(value == null ? void 0 : value.length)) continue;
        result = result.filter((row) => {
          const cellValue = row[key];
          if (filter) {
            return filter({ row, cellValue, filterValues: value });
          }
          return value.some((v) => cellValue == v);
        });
      }
      return result;
    }
    function handleDealColumns() {
      dealColumns(props.columns);
    }
    function updateDataSource(val) {
      if (!Array.isArray(val)) {
        console.warn("invalid dataSource");
        return;
      }
      let needInitVirtualScrollY = false;
      if (
        /* slots.customBottom || */
        dataSourceCopy.value.length !== val.length
      ) {
        needInitVirtualScrollY = true;
      }
      initDataSource(val);
      updateMaxRowSpan();
      if (!val.length) {
        clearSelectedArea();
      }
      if (needInitVirtualScrollY) {
        nextTick(() => initVirtualScrollY());
      }
      nextTick(updateCustomScrollbar);
    }
    function rowKeyGen(row) {
      if (!row) return row;
      let key = rowKeyGenCache.get(row);
      if (key !== void 0) return key;
      const cachedRowKey = row.__R_K__;
      if (cachedRowKey !== void 0) {
        rowKeyGenCache.set(row, cachedRowKey);
        return cachedRowKey;
      }
      key = rowKeyGenComputed.value(row);
      if (key === void 0) {
        key = Math.random().toString(36).slice(2);
      }
      rowKeyGenCache.set(row, key);
      return key;
    }
    function cellKeyGen(row, col) {
      return rowKeyGen(row) + CELL_KEY_SEPARATE + colKeyGen.value(col);
    }
    const cellStyleMap = computed(() => {
      const thMap = /* @__PURE__ */ new Map();
      const tdMap = /* @__PURE__ */ new Map();
      const tfMap = /* @__PURE__ */ new Map();
      const { virtualX } = props;
      const headers = tableHeaders.value;
      const colKeyGenValue = colKeyGen.value;
      for (let depth = 0, depthLen = headers.length; depth < depthLen; depth++) {
        const cols = headers[depth];
        for (let i = 0, colsLen = cols.length; i < colsLen; i++) {
          const col = cols[i];
          const width = virtualX ? getCalculatedColWidth(col) + "px" : transformWidthToStr(col.width);
          const minWidthStr = transformWidthToStr(col.minWidth);
          const maxWidthStr = transformWidthToStr(col.maxWidth);
          let styleStr = "";
          if (width) styleStr += `--cw:${width}`;
          if (minWidthStr) styleStr += `;min-width:${minWidthStr}`;
          if (maxWidthStr) styleStr += `;max-width:${maxWidthStr}`;
          const colKey = colKeyGenValue(col);
          thMap.set(colKey, styleStr + ";" + getFixedStyle(TagType.TH, col, depth));
          tdMap.set(colKey, styleStr + ";" + getFixedStyle(TagType.TD, col, depth));
          tfMap.set(colKey, "position:sticky;" + styleStr + ";" + getFixedStyle(TagType.TF, col, depth));
        }
      }
      return {
        [TagType.TH]: thMap,
        [TagType.TD]: tdMap,
        [TagType.TF]: tfMap
      };
    });
    function getColGroupColStyle(col) {
      const width = transformWidthToStr(col.width);
      return width ? `width:${width}` : null;
    }
    function getAbsoluteRowIndex(rowIndex) {
      return rowIndex + virtualScroll.value.startIndex;
    }
    function shouldHideCell(row, col) {
      var _a;
      if (!hiddenCellMap.value || !row) return;
      return (_a = hiddenCellMap.value[rowKeyGen(row)]) == null ? void 0 : _a.has(colKeyGen.value(col));
    }
    function getBodyColumns(row, rowIndex) {
      if (!row) return virtualX_columnPart.value;
      if (virtual_on.value) {
        const { startIndex, viewportStartIndex, viewportEndIndex } = virtualScroll.value;
        const aboveCount = viewportStartIndex - startIndex;
        if (aboveCount > 0 && rowIndex < aboveCount) {
          return aboveViewportColumnMap.value.get(rowKeyGen(row)) || virtualX_columnPart.value;
        }
        if (startIndex + rowIndex > viewportEndIndex) {
          return [];
        }
      }
      const segments = virtualX_expandColSegments.value;
      if (!segments) return virtualX_columnPart.value;
      return buildExpandColumns(row, rowIndex, segments);
    }
    function buildExpandColumns(row, rowIndex, segments) {
      const { prefix, leftExpand, viewport, suffix, leftExpandStart } = segments;
      const result = prefix.slice();
      if (leftExpand.length) {
        const hiddenSet = hiddenCellMap.value ? hiddenCellMap.value[rowKeyGen(row)] : void 0;
        const colKeyGenValue = colKeyGen.value;
        const absRowIndex = (virtual_on.value ? virtualScroll.value.startIndex : 0) + rowIndex;
        let run = 0;
        for (let i = 0; i < leftExpand.length; i++) {
          const col = leftExpand[i];
          if (hiddenSet && hiddenSet.has(colKeyGenValue(col))) continue;
          if (col.mergeCells) {
            const { colspan, rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, col.__LF_S__ ?? leftExpandStart + i);
            if (colspan > 1 || rowspan > 1) {
              if (run > 0) {
                result.push({ __VT_PH__: run });
                run = 0;
              }
              result.push(col);
              continue;
            }
          }
          run++;
        }
        if (run > 0) result.push({ __VT_PH__: run });
      }
      result.push(...viewport, ...suffix);
      return result;
    }
    function getHeaderTitle(col) {
      const colKey = colKeyGen.value(col);
      if (props.hideHeaderTitle === true || Array.isArray(props.hideHeaderTitle) && props.hideHeaderTitle.includes(colKey)) {
        return "";
      }
      return col.title || "";
    }
    function getTRProps(row, index) {
      var _a, _b;
      const rowIndex = getAbsoluteRowIndex(index);
      const rowKey = rowKeyGen(row);
      const classList = [props.rowClassName(row, rowIndex), (row == null ? void 0 : row.__EXP__) ? "expanded" : "", (row == null ? void 0 : row.__EXP_R__) ? "expanded-row" : ""];
      if (currentRowKey.value === rowKey || row === currentRow.value) {
        classList.push("active");
      }
      if (props.showTrHoverClass && (rowKey === currentHoverRowKey.value || row === currentHoverRow)) {
        classList.push("hover");
      }
      const result = {
        id: stkTableId + "-" + rowKey,
        "data-row-key": rowKey,
        "data-row-i": rowIndex,
        class: classList.filter(Boolean).join(" "),
        style: null
      };
      const needRowHeight = (row == null ? void 0 : row.__EXP_R__) && props.virtual && ((_a = props.expandConfig) == null ? void 0 : _a.height);
      if (needRowHeight) {
        result.style = `--row-height: ${(_b = props.expandConfig) == null ? void 0 : _b.height}px`;
      }
      return result;
    }
    function getTHProps(col) {
      const colKey = colKeyGen.value(col);
      const sortState = getColumnSortState(colKey);
      const isSorted = !!sortState && sortState.order !== null;
      return {
        "data-col-key": colKey,
        draggable: Boolean(isHeaderDraggable(col)),
        rowspan: col.__R_SP__,
        colspan: col.__C_SP__,
        style: cellStyleMap.value[TagType.TH].get(colKey),
        title: getHeaderTitle(col),
        class: [
          col.sorter ? "sortable" : "",
          isSorted && "sorter-" + (sortState == null ? void 0 : sortState.order),
          col.headerClassName,
          fixedColClassMap.value.get(colKey),
          col.headerAlign && (col.headerAlign === "left" ? "text-l" : col.headerAlign === "right" ? "text-r" : col.headerAlign === "center" ? "text-c" : null)
        ]
      };
    }
    function getTFProps(col) {
      const colKey = colKeyGen.value(col);
      return {
        "data-col-key": colKey,
        style: cellStyleMap.value[TagType.TF].get(colKey),
        class: [
          col.className,
          fixedColClassMap.value.get(colKey),
          col.type === "seq" ? "seq-column" : "",
          col.align === "center" ? "text-c" : col.align === "right" ? "text-r" : ""
        ]
      };
    }
    function getTDProps(row, col, rowIndex, colIndex) {
      const colKey = colKeyGen.value(col);
      if (!row) {
        return {
          style: cellStyleMap.value[TagType.TD].get(colKey)
        };
      }
      const cellKey = cellKeyGen(row, col);
      const classList = [col.className, fixedColClassMap.value.get(colKey)];
      if (col.align === "center") {
        classList.push("text-c");
      } else if (col.align === "right") {
        classList.push("text-r");
      }
      if (col.mergeCells) {
        if (hoverMergedCells.value.has(cellKey)) {
          classList.push("cell-hover");
        }
        if (activeMergedCells.value.has(cellKey)) {
          classList.push("cell-active");
        }
      }
      if (props.cellActive && currentSelectedCellKey.value === cellKey) {
        classList.push("active");
      }
      if (col.type === "seq") {
        classList.push("seq-column");
      } else if (col.type === "expand" && (row.__EXP__ ? colKeyGen.value(row.__EXP__) === colKey : false)) {
        classList.push("expanded");
      } else if (row.__T_EXP__ && col.type === "tree-node") {
        classList.push("tree-expanded");
      } else if (col.type === "dragRow") {
        classList.push("drag-row-cell");
      }
      return {
        "data-col-key": colKey,
        style: cellStyleMap.value[TagType.TD].get(colKey),
        class: classList,
        ...mergeCellsWrapper(row, col, rowIndex, col.__LF_S__ ?? 0)
      };
    }
    function onRowClick(e) {
      var _a, _b;
      const rowIndex = getClosestTrIndex(e.target);
      const row = dataSourceCopy.value[rowIndex];
      if (!row) return;
      emits("row-click", e, row, { rowIndex });
      if ((_b = (_a = rowActiveProp.value).disabled) == null ? void 0 : _b.call(_a, row)) return;
      const isCurrentRow = props.rowKey ? currentRowKey.value === rowKeyGen(row) : currentRow.value === row;
      if (isCurrentRow) {
        if (!rowActiveProp.value.revokable) {
          return;
        }
        setCurrentRow(void 0, { silent: true });
      } else {
        setCurrentRow(row, { silent: true });
      }
      emits("current-change", e, row, { select: !isCurrentRow });
    }
    function onRowDblclick(e) {
      const rowIndex = getClosestTrIndex(e.target);
      const row = dataSourceCopy.value[rowIndex];
      if (!row) return;
      emits("row-dblclick", e, row, { rowIndex });
    }
    function onHeaderMenu(e) {
      emits("header-row-menu", e);
    }
    function onRowMenu(e) {
      const rowIndex = getClosestTrIndex(e.target);
      const row = dataSourceCopy.value[rowIndex];
      if (!row) return;
      emits("row-menu", e, row, { rowIndex });
    }
    function triangleClick(e, row, col) {
      if (col.type === "expand") {
        toggleExpandRow(row, col);
      } else if (col.type === "tree-node") {
        toggleTreeNode(row, col);
      }
    }
    function onCellClick(e) {
      var _a;
      const rowIndex = getClosestTrIndex(e.target);
      const row = dataSourceCopy.value[rowIndex];
      if (!row) return;
      const colKey = getClosestColKey(e.target);
      const col = tableHeaderLast.value.find((item) => colKeyGen.value(item) === colKey);
      if (!col) return;
      if ((_a = e.target) == null ? void 0 : _a.closest(".stk-fold-icon")) {
        triangleClick(e, row, col);
        return;
      }
      if (props.cellActive) {
        const cellKey = cellKeyGen(row, col);
        const result = { row, col, select: false, rowIndex };
        if (props.selectedCellRevokable && currentSelectedCellKey.value === cellKey) {
          currentSelectedCellKey.value = void 0;
        } else {
          currentSelectedCellKey.value = cellKey;
          result.select = true;
        }
        emits("cell-selected", e, result);
      }
      emits("cell-click", e, row, col, { rowIndex });
    }
    function getCellEventData(e) {
      const rowIndex = getClosestTrIndex(e.target) || 0;
      const row = dataSourceCopy.value[rowIndex];
      const colKey = getClosestColKey(e.target);
      const col = tableHeaderLast.value.find((item) => colKeyGen.value(item) === colKey);
      return { row, col, rowIndex };
    }
    function onHeaderCellClick(e, col) {
      onColumnSort(col);
      emits("header-cell-click", e, col);
    }
    function onCellMouseOver(e) {
      const td = getClosestTd(e.target);
      if (!td) return;
      const { row, col } = getCellEventData(e);
      emits("cell-mouseover", e, row, col);
      const related = e.relatedTarget;
      if (!related || !td.contains(related)) {
        emits("cell-mouseenter", e, row, col);
      }
    }
    function onTbodyMouseOut(e) {
      const target = e.target;
      const related = e.relatedTarget;
      const td = getClosestTd(target);
      if (td && (!related || !td.contains(related))) {
        const { row, col } = getCellEventData(e);
        emits("cell-mouseleave", e, row, col);
      }
      const tr = getClosestTr(target);
      if (tr && (!related || !tr.contains(related))) {
        currentHoverRow = null;
        if (props.showTrHoverClass) {
          currentHoverRowKey.value = null;
        }
        if (props.rowHover) {
          updateHoverMergedCells(void 0);
        }
      }
    }
    function onBodyDrop(e) {
      const trIndex = getClosestTrIndex(e.target);
      if (trIndex < 0) return;
      onTrDrop(e, getAbsoluteRowIndex(trIndex));
    }
    function onCellMouseDown(e) {
      const { row, col, rowIndex } = getCellEventData(e);
      emits("cell-mousedown", e, row, col, { rowIndex });
      if (areaSelectionConfig.value.enabled) {
        onSelectionMouseDown(e);
      }
    }
    const [isWheeling, setIsWheeling] = useWheeling();
    function onTableWheel(e) {
      if (props.smoothScroll) return;
      if (isColResizing.value) {
        e.stopPropagation();
        return;
      }
      const dom = tableContainerRef.value;
      const { deltaY, deltaX, shiftKey } = e;
      if (virtual_on.value && deltaY && !shiftKey) {
        const { containerHeight, scrollTop, scrollHeight } = virtualScroll.value;
        const canScrollDown = scrollTop < scrollHeight - containerHeight - 1;
        const canScrollUp = scrollTop > 1;
        if (deltaY > 0 && canScrollDown || deltaY < 0 && canScrollUp) {
          setIsWheeling(true);
          e.preventDefault();
        } else if (isWheeling()) {
          e.preventDefault();
        }
        if (isExperimentalScrollY.value) {
          rafUpdateVirtualScrollYForWheel(scrollTop + deltaY);
          updateCustomScrollbar();
        } else {
          dom.scrollTop += deltaY;
        }
      }
      if (virtualX_on.value) {
        const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
        let distance = deltaX;
        if (shiftKey && deltaY) {
          distance = deltaY;
        }
        const canScrollRight = scrollLeft < scrollWidth - containerWidth - 1;
        const canScrollLeft = scrollLeft > 1;
        if (distance > 0 && canScrollRight || distance < 0 && canScrollLeft) {
          setIsWheeling(true);
          e.preventDefault();
        } else if (isWheeling()) {
          e.preventDefault();
        }
        dom.scrollLeft += distance;
      }
    }
    let scrollRAFScheduled = false;
    function onTableScroll(e) {
      if (!(e == null ? void 0 : e.target) || scrollRAFScheduled) return;
      scrollRAFScheduled = true;
      requestAnimationFrame(() => {
        scrollRAFScheduled = false;
        const { scrollTop, scrollLeft } = e.target;
        const { scrollTop: vScrollTop } = virtualScroll.value;
        const { scrollLeft: vScrollLeft } = virtualScrollX.value;
        const isYScroll = isExperimentalScrollY.value ? false : scrollTop !== vScrollTop;
        const isXScroll = scrollLeft !== vScrollLeft;
        if (isYScroll) {
          updateVirtualScrollY(scrollTop);
        }
        if (isXScroll) {
          if (virtualX_on.value) {
            updateVirtualScrollX(scrollLeft);
          } else {
            virtualScrollX.value.scrollLeft = scrollLeft;
          }
          updateFixedShadow(virtualScrollX);
        }
        if (isYScroll) {
          const { startIndex, endIndex } = virtualScroll.value;
          emits("scroll", e, { startIndex, endIndex });
        }
        if (isXScroll) {
          emits("scroll-x", e);
        }
        updateCustomScrollbar();
      });
    }
    function onTrMouseOver(e) {
      const tr = getClosestTr(e.target);
      if (!tr) return;
      const rowIndex = Number(tr.dataset.rowI);
      const row = dataSourceCopy.value[rowIndex];
      if (currentHoverRow === row) return;
      currentHoverRow = row;
      const rowKey = tr.dataset.rowKey;
      if (props.showTrHoverClass) {
        currentHoverRowKey.value = rowKey || null;
      }
      if (props.rowHover) {
        updateHoverMergedCells(rowKey);
      }
    }
    function setCurrentRow(rowKeyOrRow, option = { silent: false, deep: false }) {
      const select = rowKeyOrRow !== void 0;
      const currentRowTemp = currentRow.value;
      if (!select) {
        currentRow.value = void 0;
        currentRowKey.value = void 0;
        updateActiveMergedCells(true);
      } else if (typeof rowKeyOrRow === "string") {
        const findRowByKey = (data, key) => {
          var _a;
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (rowKeyGen(item) === key) {
              return item;
            }
            if (option.deep && ((_a = item.children) == null ? void 0 : _a.length)) {
              const found = findRowByKey(item.children, key);
              if (found) {
                return found;
              }
            }
          }
          return null;
        };
        currentRowKey.value = rowKeyOrRow;
        updateActiveMergedCells(false, currentRowKey.value);
        const row = findRowByKey(dataSourceCopy.value || [], rowKeyOrRow);
        if (!row) {
          console.warn("setCurrentRow failed.rowKey:", rowKeyOrRow);
          return;
        }
        currentRow.value = row;
      } else {
        currentRow.value = rowKeyOrRow;
        currentRowKey.value = rowKeyGen(rowKeyOrRow);
        updateActiveMergedCells(false, currentRowKey.value);
      }
      if (!option.silent) {
        emits(
          "current-change",
          /** no Event */
          null,
          select ? currentRow.value : currentRowTemp,
          { select }
        );
      }
    }
    function setSelectedCell(row, col, option = { silent: false }) {
      if (!dataSourceCopy.value.length) return;
      const select = row !== void 0 && col !== void 0;
      currentSelectedCellKey.value = select ? cellKeyGen(row, col) : void 0;
      if (!option.silent) {
        emits(
          "cell-selected",
          /** no Event */
          null,
          { row, col, select }
        );
      }
    }
    function scrollTo(top = 0, left = 0) {
      if (!tableContainerRef.value) return;
      if (top !== null) {
        if (isExperimentalScrollY.value) {
          updateVirtualScrollY(top);
          updateCustomScrollbar();
        } else {
          tableContainerRef.value.scrollTop = top;
        }
      }
      if (left !== null) tableContainerRef.value.scrollLeft = left;
    }
    function getTableData() {
      return toRaw(dataSourceCopy.value);
    }
    function clearMergeCellsCache() {
      mergeCellsCache.clear();
      initDataSource();
      updateMaxRowSpan();
    }
    __expose({
      /**
       * 重新计算虚拟列表宽高
       *
       * en: calc virtual scroll x & y info
       * @see {@link initVirtualScroll}
       */
      initVirtualScroll,
      /**
       * 重新计算虚拟列表宽度
       *
       * en: calc virtual scroll x
       * @see {@link initVirtualScrollX}
       */
      initVirtualScrollX,
      /**
       * 重新计算虚拟列表高度
       *
       * en: calc virtual scroll y
       * @see {@link initVirtualScrollY}
       */
      initVirtualScrollY,
      /**
       * 清空 mergeCells 结果缓存并强制重算合并结果
       *
       * en: Clear mergeCells result cache and force recomputation
       * @see {@link clearMergeCellsCache}
       */
      clearMergeCellsCache,
      /**
       * 选中一行
       *
       * en：select a row
       * @see {@link setCurrentRow}
       */
      setCurrentRow,
      /**
       * 取消选中单元格
       *
       * en: set highlight active cell (props.cellActive=true)
       * @see {@link setSelectedCell}
       */
      setSelectedCell,
      /**
       * 设置高亮单元格
       *
       * en: Set highlight cell
       * @see {@link setHighlightDimCell}
       */
      setHighlightDimCell,
      /**
       * 设置高亮行
       *
       * en: Set highlight row
       * @see {@link setHighlightDimRow}
       */
      setHighlightDimRow,
      /**
       * 表格排序列colKey
       *
       * en: Table sort column colKey
       */
      sortCol,
      /**
       * 排序状态数组
       *
       * en: Multi-column sort states array
       */
      sortStates,
      /**
       * 表格排序列顺序
       *
       * en: get current sort info
       * @see {@link getSortColumns}
       */
      getSortColumns,
      /**
       * 设置表头排序状态
       *
       * en: Set the sort status of the table header
       * @see {@link setSorter}
       */
      setSorter,
      /**
       * 重置sorter状态
       *
       * en: Reset the sorter status
       * @see {@link resetSorter}
       */
      resetSorter,
      /**
       * 滚动至
       *
       * en: Scroll to
       * @see {@link scrollTo}
       */
      scrollTo,
      /**
       * 获取表格数据
       *
       * en: Get table data
       * @see {@link getTableData}
       */
      getTableData,
      getRowIndex,
      getColumnIndex,
      /**
       * 设置展开的行
       *
       * en: Set expanded rows
       * @see {@link setRowExpand}
       */
      setRowExpand,
      /**
       * 不定行高时，如果行高有变化，则调用此方法更新行高。
       *
       * en: When the row height is not fixed, call this method to update the row height if the row height changes.
       * @see {@link setAutoHeight}
       */
      setAutoHeight,
      /**
       * 清除所有行高
       *
       * en: Clear all row heights
       * @see {@link clearAllAutoHeight}
       */
      clearAllAutoHeight,
      /**
       * 设置树节点展开状态
       *
       * en: Set tree node expand state
       * @see {@link setTreeExpand}
       */
      setTreeExpand,
      /**
       * 获取拖选选中的单元格信息
       *
       * en: Get selected cells info (areaSelection=true)
       * @see {@link getSelectedArea}
       */
      getSelectedArea,
      /**
       * 设置拖选选区
       *
       * en: Set cell selection range (areaSelection=true)
       * @see {@link setAreaSelection}
       */
      setAreaSelection,
      /**
       * 清空拖选选区
       *
       * en: Clear cell selection range (areaSelection=true)
       * @see {@link clearSelectedArea}
       */
      clearSelectedArea,
      /**
       * 复制选区内容到剪贴板
       *
       * en: Copy selected area to clipboard (areaSelection=true)
       * @see {@link copySelectedArea}
       */
      copySelectedArea,
      /**
       * 设置筛选状态(Beta)
       *
       * en: Set filter status(Beta)
       * @see {@link setFilter}
       */
      setFilter
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "tableContainerRef",
        ref: tableContainerRef,
        class: normalizeClass(["stk-table", {
          virtual: __props.virtual,
          "virtual-x": __props.virtualX,
          "vt-on": unref(virtual_on),
          light: __props.theme === "light",
          dark: __props.theme === "dark",
          headless: __props.headless,
          "is-col-resizing": unref(isColResizing),
          "col-resizable": props.colResizable,
          bordered: props.bordered,
          [`bordered-${props.bordered}`]: typeof props.bordered === "string",
          stripe: props.stripe,
          "cell-hover": props.cellHover,
          "cell-active": props.cellActive,
          "row-hover": props.rowHover,
          "row-active": rowActiveProp.value.enabled,
          "text-overflow": props.showOverflow,
          "header-text-overflow": props.showHeaderOverflow,
          "fixed-relative-mode": isRelativeMode.value,
          "auto-row-height": props.autoRowHeight,
          "scroll-row-by-row": unref(isSRBRActive),
          "scrollbar-on": scrollbarOptions.value.enabled,
          "area-selection": unref(areaSelectionConfig).enabled,
          "is-area-selecting": unref(isAreaSelecting),
          "exp-scroll-y": isExperimentalScrollY.value
        }]),
        tabindex: unref(areaSelectionConfig).enabled ? 0 : void 0,
        style: normalizeStyle({
          "--row-height": props.autoRowHeight ? void 0 : unref(virtualScroll).rowHeight + "px",
          "--header-row-height": props.headerRowHeight + "px",
          "--footer-row-height": props.footerRowHeight + "px",
          "--highlight-duration": props.highlightConfig.duration && props.highlightConfig.duration + "s",
          "--highlight-timing-function": unref(highlightSteps) ? `steps(${unref(highlightSteps)})` : void 0,
          "--sb-width": `${scrollbarOptions.value.width}px`,
          "--sb-height": `${scrollbarOptions.value.height}px`
        }),
        onScroll: onTableScroll,
        onWheel: onTableWheel
      }, [
        !isExperimentalScrollY.value && SRBRTotalHeight.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "row-by-row-table-height",
          style: normalizeStyle(`height: ${SRBRTotalHeight.value}px`)
        }, null, 4)) : createCommentVNode("", true),
        __props.colResizable ? (openBlock(), createElementBlock("div", {
          key: 1,
          ref_key: "colResizeIndicatorRef",
          ref: colResizeIndicatorRef,
          class: "column-resize-indicator"
        }, null, 512)) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_2$1, [
          createElementVNode("table", {
            class: normalizeClass(["stk-table-main", {
              "fixed-mode": props.fixedMode
            }]),
            style: normalizeStyle({ width: __props.width, minWidth: __props.minWidth, maxWidth: __props.maxWidth }),
            onDragover: _cache[4] || (_cache[4] = //@ts-ignore
            (...args) => unref(onTrDragOver) && unref(onTrDragOver)(...args)),
            onDragenter: _cache[5] || (_cache[5] = //@ts-ignore
            (...args) => unref(onTrDragEnter) && unref(onTrDragEnter)(...args)),
            onDragend: _cache[6] || (_cache[6] = //@ts-ignore
            (...args) => unref(onTrDragEnd) && unref(onTrDragEnd)(...args)),
            onClick: onRowClick,
            onDblclick: onRowDblclick,
            onContextmenu: onRowMenu,
            onMouseover: onTrMouseOver
          }, [
            props.fixedMode && !unref(virtualX_on) ? (openBlock(), createElementBlock("colgroup", _hoisted_3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(tableHeaderLast.value, (col) => {
                return openBlock(), createElementBlock("col", {
                  key: colKeyGen.value(col),
                  style: normalizeStyle(getColGroupColStyle(col))
                }, null, 4);
              }), 128))
            ])) : createCommentVNode("", true),
            !__props.headless ? (openBlock(), createElementBlock("thead", _hoisted_4, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_on) ? unref(virtualX_tableHeaders) : unref(tableHeaders), (row, rowIndex) => {
                return openBlock(), createElementBlock("tr", {
                  key: rowIndex,
                  onContextmenu: _cache[3] || (_cache[3] = ($event) => onHeaderMenu($event))
                }, [
                  unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                    key: 0,
                    class: "vt-x-left",
                    style: normalizeStyle(`min-width:${unref(theadVirtualX).offsetLeft}px;width:${unref(theadVirtualX).offsetLeft}px`)
                  }, null, 4)) : createCommentVNode("", true),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(row, (col, colIndex) => {
                    return openBlock(), createElementBlock("th", mergeProps({
                      key: colKeyGen.value(col)
                    }, { ref_for: true }, getTHProps(col), {
                      onClick: (e) => onHeaderCellClick(e, col),
                      onDragstart: _cache[0] || (_cache[0] = //@ts-ignore
                      (...args) => unref(onThDragStart) && unref(onThDragStart)(...args)),
                      onDrop: _cache[1] || (_cache[1] = //@ts-ignore
                      (...args) => unref(onThDrop) && unref(onThDrop)(...args)),
                      onDragover: _cache[2] || (_cache[2] = //@ts-ignore
                      (...args) => unref(onThDragOver) && unref(onThDragOver)(...args))
                    }), [
                      unref(colResizeOn)(col) && colIndex > 0 ? (openBlock(), createElementBlock("div", {
                        key: 0,
                        class: "table-header-resizer left",
                        onMousedown: ($event) => unref(onThResizeMouseDown)($event, col, true)
                      }, null, 40, _hoisted_6)) : createCommentVNode("", true),
                      createElementVNode("div", {
                        class: "table-header-cell-wrapper",
                        style: normalizeStyle(col.__R_SP__ ? `--row-span:${col.__R_SP__}` : null)
                      }, [
                        col.customHeaderCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customHeaderCell), {
                          key: 0,
                          col,
                          colIndex,
                          rowIndex
                        }, null, 8, ["col", "colIndex", "rowIndex"])) : renderSlot(_ctx.$slots, "tableHeader", {
                          key: 1,
                          col
                        }, () => [
                          createElementVNode("span", _hoisted_7, toDisplayString(col.title), 1)
                        ]),
                        col.sorter ? (openBlock(), createBlock(SortIcon, {
                          key: 2,
                          class: "table-header-sorter"
                        })) : createCommentVNode("", true)
                      ], 4),
                      unref(colResizeOn)(col) ? (openBlock(), createElementBlock("div", {
                        key: 1,
                        class: "table-header-resizer right",
                        onMousedown: ($event) => unref(onThResizeMouseDown)($event, col)
                      }, null, 40, _hoisted_8)) : createCommentVNode("", true)
                    ], 16, _hoisted_5);
                  }), 128)),
                  unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                    key: 1,
                    class: "vt-x-right",
                    style: normalizeStyle(`min-width:${unref(virtualX_offsetRight)}px;width:${unref(virtualX_offsetRight)}px`)
                  }, null, 4)) : createCommentVNode("", true)
                ], 32);
              }), 128))
            ])) : createCommentVNode("", true),
            __props.footerData && __props.footerData.length > 0 ? (openBlock(), createBlock(resolveDynamicComponent(footerTagName.value), {
              key: 2,
              class: "stk-footer",
              style: normalizeStyle(isFooterTop.value ? `top:${unref(tableHeaderHeight)}px` : "")
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.footerData, (footRow, footRowIndex) => {
                  return openBlock(), createElementBlock("tr", { key: footRowIndex }, [
                    unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
                      key: 0,
                      class: "vt-x-left",
                      style: normalizeStyle(`min-width:${unref(theadVirtualX).offsetLeft}px;width:${unref(theadVirtualX).offsetLeft}px`)
                    }, null, 4)) : createCommentVNode("", true),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col, _colIdx) => {
                      return openBlock(), createElementBlock(Fragment, {
                        key: col.__VT_C_SP__ ? `spacer-${_colIdx}` : colKeyGen.value(col)
                      }, [
                        col.__VT_C_SP__ ? (openBlock(), createElementBlock("td", {
                          key: 0,
                          class: "vt-x-spacer",
                          colspan: col.__VT_C_SP__
                        }, null, 8, _hoisted_9)) : (openBlock(), createElementBlock("td", mergeProps({
                          key: 1,
                          ref_for: true
                        }, getTFProps(col)), [
                          col.customFooterCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customFooterCell), {
                            key: 0,
                            class: "table-cell-wrapper",
                            tabindex: "-1",
                            col,
                            row: footRow,
                            rowIndex: footRowIndex,
                            cellValue: footRow[col.dataIndex]
                          }, null, 8, ["col", "row", "rowIndex", "cellValue"])) : createCommentVNode("", true),
                          createElementVNode("div", {
                            class: "table-cell-wrapper",
                            tabindex: "-1",
                            title: footRow[col.dataIndex] || ""
                          }, [
                            footRow[col.dataIndex] != null ? (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(footRow[col.dataIndex]), 1)) : createCommentVNode("", true)
                          ], 8, _hoisted_10)
                        ], 16))
                      ], 64);
                    }), 128)),
                    unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
                      key: 1,
                      class: "vt-x-right",
                      style: normalizeStyle(`min-width:${unref(virtualX_offsetRight)}px;width:${unref(virtualX_offsetRight)}px`)
                    }, null, 4)) : createCommentVNode("", true)
                  ]);
                }), 128))
              ]),
              _: 1
            }, 8, ["style"])) : createCommentVNode("", true),
            createElementVNode("tbody", {
              class: "stk-tbody-main",
              style: normalizeStyle(isExperimentalScrollY.value ? `transform:translateY(${unref(virtualScroll).translateY}px)` : ""),
              onClick: onCellClick,
              onMousedown: onCellMouseDown,
              onMouseover: onCellMouseOver,
              onMouseout: onTbodyMouseOut,
              onDrop: onBodyDrop
            }, [
              !isExperimentalScrollY.value && unref(virtual_on) && !unref(isSRBRActive) ? (openBlock(), createElementBlock("tr", {
                key: 0,
                style: normalizeStyle(paddingTopStyle.value),
                class: "padding-top-tr"
              }, [
                __props.fixedMode && __props.headless ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
                    key: 0,
                    class: "vt-x-left",
                    style: normalizeStyle(`min-width:${unref(theadVirtualX).offsetLeft}px;width:${unref(theadVirtualX).offsetLeft}px`)
                  }, null, 4)) : createCommentVNode("", true),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col, _colIdx) => {
                    return openBlock(), createElementBlock(Fragment, {
                      key: col.__VT_C_SP__ ? `spacer-${_colIdx}` : colKeyGen.value(col)
                    }, [
                      col.__VT_C_SP__ ? (openBlock(), createElementBlock("td", {
                        key: 0,
                        class: "vt-x-spacer",
                        colspan: col.__VT_C_SP__
                      }, null, 8, _hoisted_12)) : (openBlock(), createElementBlock("td", {
                        key: 1,
                        style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen.value(col)))
                      }, null, 4))
                    ], 64);
                  }), 128)),
                  unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
                    key: 1,
                    class: "vt-x-right",
                    style: normalizeStyle(`min-width:${unref(virtualX_offsetRight)}px;width:${unref(virtualX_offsetRight)}px`)
                  }, null, 4)) : createCommentVNode("", true)
                ], 64)) : createCommentVNode("", true)
              ], 4)) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(bodyRenderItems.value, (item) => {
                return openBlock(), createElementBlock(Fragment, {
                  key: item.key
                }, [
                  item.type === "row" ? (openBlock(), createElementBlock("tr", mergeProps({
                    key: 0,
                    ref_for: true,
                    ref_key: "trRef",
                    ref: trRef
                  }, { ref_for: true }, getTRProps(item.row, item.rowIndex)), [
                    item.row && item.row.__EXP_R__ ? (openBlock(), createElementBlock("td", {
                      key: 0,
                      colspan: unref(expandRowColspan)
                    }, [
                      createElementVNode("div", _hoisted_14, [
                        renderSlot(_ctx.$slots, "expand", {
                          row: item.row.__EXP_R__,
                          col: item.row.__EXP_C__
                        }, () => [
                          createTextVNode(toDisplayString(item.row.__EXP_R__ && item.row.__EXP_C__ && item.row.__EXP_R__[item.row.__EXP_C__.dataIndex] || ""), 1)
                        ])
                      ])
                    ], 8, _hoisted_13)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                      unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_15)) : createCommentVNode("", true),
                      (openBlock(true), createElementBlock(Fragment, null, renderList(getBodyColumns(item.row, item.rowIndex), (col, _colIdx) => {
                        return openBlock(), createElementBlock(Fragment, {
                          key: col.__VT_C_SP__ ? `spacer-${_colIdx}` : col.__VT_PH__ ? `ph-${_colIdx}` : colKeyGen.value(col)
                        }, [
                          col.__VT_C_SP__ ? (openBlock(), createElementBlock("td", {
                            key: 0,
                            class: "vt-x-spacer",
                            colspan: col.__VT_C_SP__
                          }, null, 8, _hoisted_16)) : col.__VT_PH__ ? (openBlock(), createElementBlock("td", {
                            key: 1,
                            class: "vt-above-viewport-ph",
                            colspan: col.__VT_PH__
                          }, null, 8, _hoisted_17)) : !shouldHideCell(item.row, col) ? (openBlock(), createElementBlock("td", mergeProps({
                            key: 2,
                            ref_for: true
                          }, getTDProps(item.row, col, item.rowIndex, col.__LF_S__ ?? 0)), [
                            col.customCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customCell), {
                              key: 0,
                              class: "table-cell-wrapper",
                              tabindex: "-1",
                              col,
                              row: item.row,
                              rowIndex: getAbsoluteRowIndex(item.rowIndex),
                              colIndex: col.__LF_S__ ?? 0,
                              cellValue: item.row && item.row[col.dataIndex],
                              expanded: item.row && item.row.__EXP__,
                              "tree-expanded": item.row && item.row.__T_EXP__
                            }, {
                              stkFoldIcon: withCtx(() => [
                                createVNode(TriangleIcon, {
                                  onClick: ($event) => triangleClick($event, item.row, col)
                                }, null, 8, ["onClick"])
                              ]),
                              stkDragIcon: withCtx(() => [
                                createVNode(DragHandle, {
                                  onDragstart: ($event) => unref(onTrDragStart)($event, getAbsoluteRowIndex(item.rowIndex))
                                }, null, 8, ["onDragstart"])
                              ]),
                              _: 2
                            }, 1032, ["col", "row", "rowIndex", "colIndex", "cellValue", "expanded", "tree-expanded"])) : !col.type ? (openBlock(), createElementBlock("div", {
                              key: 1,
                              class: "table-cell-wrapper",
                              tabindex: "-1",
                              title: item.row[col.dataIndex] || ""
                            }, toDisplayString((item.row && item.row[col.dataIndex]) != null ? item.row && item.row[col.dataIndex] : getEmptyCellText.value(col, item.row)), 9, _hoisted_18)) : col.type === "seq" ? (openBlock(), createElementBlock("div", _hoisted_19, toDisplayString((props.seqConfig.startIndex || 0) + getAbsoluteRowIndex(item.rowIndex) + 1), 1)) : col.type === "tree-node" ? (openBlock(), createBlock(_sfc_main$4, {
                              key: 3,
                              class: "table-cell-wrapper",
                              tabindex: "-1",
                              col,
                              row: item.row
                            }, null, 8, ["col", "row"])) : (openBlock(), createElementBlock("div", {
                              key: 4,
                              class: "table-cell-wrapper",
                              tabindex: "-1",
                              title: item.row[col.dataIndex] || ""
                            }, [
                              col.type === "dragRow" ? (openBlock(), createBlock(DragHandle, {
                                key: 0,
                                onDragstart: ($event) => unref(onTrDragStart)($event, getAbsoluteRowIndex(item.rowIndex))
                              }, null, 8, ["onDragstart"])) : col.type === "expand" ? (openBlock(), createBlock(TriangleIcon, { key: 1 })) : createCommentVNode("", true),
                              item.row[col.dataIndex] != null ? (openBlock(), createElementBlock("span", _hoisted_21, toDisplayString(item.row[col.dataIndex]), 1)) : createCommentVNode("", true)
                            ], 8, _hoisted_20))
                          ], 16)) : createCommentVNode("", true)
                        ], 64);
                      }), 128)),
                      unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_22)) : createCommentVNode("", true)
                    ], 64))
                  ], 16)) : item.type === "above-ph" ? (openBlock(), createElementBlock("tr", {
                    key: 1,
                    class: "vt-above-viewport-ph-row",
                    "data-above-count": item.count,
                    style: normalizeStyle(`height: calc(var(--row-height) * ${item.count})`)
                  }, null, 12, _hoisted_23)) : (openBlock(), createElementBlock("tr", {
                    key: 2,
                    class: "vt-below-viewport-ph",
                    "data-below-count": item.count,
                    style: normalizeStyle(`height: calc(var(--row-height) * ${item.count})`)
                  }, null, 12, _hoisted_24))
                ], 64);
              }), 128)),
              !isExperimentalScrollY.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                unref(virtual_on) && !unref(isSRBRActive) ? (openBlock(), createElementBlock("tr", {
                  key: 0,
                  style: normalizeStyle(offsetBottomStyle.value)
                }, null, 4)) : createCommentVNode("", true),
                SRBRBottomHeight.value ? (openBlock(), createElementBlock("tr", {
                  key: 1,
                  style: normalizeStyle(SRBRBottomStyle.value)
                }, null, 4)) : createCommentVNode("", true)
              ], 64)) : createCommentVNode("", true)
            ], 36)
          ], 38),
          scrollbarOptions.value.enabled && unref(showScrollbar).y ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "stk-sb-thumb vertical",
            style: normalizeStyle(`height:${unref(scrollbar).h}px;transform:translateY(${unref(scrollbar).t}px)`),
            onMousedown: _cache[7] || (_cache[7] = //@ts-ignore
            (...args) => unref(onVerticalScrollbarMouseDown) && unref(onVerticalScrollbarMouseDown)(...args)),
            onTouchstartPassive: _cache[8] || (_cache[8] = //@ts-ignore
            (...args) => unref(onVerticalScrollbarMouseDown) && unref(onVerticalScrollbarMouseDown)(...args))
          }, null, 36)) : createCommentVNode("", true)
        ]),
        (!dataSourceCopy.value || !dataSourceCopy.value.length) && __props.showNoData ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(["stk-table-no-data", { "no-data-full": __props.noDataFull }])
        }, [
          renderSlot(_ctx.$slots, "empty", {}, () => [
            _cache[11] || (_cache[11] = createTextVNode("暂无数据", -1))
          ])
        ], 2)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "customBottom"),
        scrollbarOptions.value.enabled && unref(showScrollbar).x ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: "stk-sb-thumb horizontal",
          style: normalizeStyle(`width:${unref(scrollbar).w}px;transform:translateX(${unref(scrollbar).l}px)`),
          onMousedown: _cache[9] || (_cache[9] = //@ts-ignore
          (...args) => unref(onHorizontalScrollbarMouseDown) && unref(onHorizontalScrollbarMouseDown)(...args)),
          onTouchstartPassive: _cache[10] || (_cache[10] = //@ts-ignore
          (...args) => unref(onHorizontalScrollbarMouseDown) && unref(onHorizontalScrollbarMouseDown)(...args))
        }, null, 36)) : createCommentVNode("", true)
      ], 46, _hoisted_1$2);
    };
  }
});
let DropdownIns = null;
async function getDropdownIns() {
  if (!DropdownIns) {
    const div = document.createElement("div");
    div.classList.add("stk-filter-dropdown-wrapper");
    document.body.appendChild(div);
    const DropdownApp = await import("./index-BDlBM6WX.js").then((module) => module.default);
    DropdownIns = createApp(DropdownApp).mount(div);
  }
  return DropdownIns;
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Filter",
  props: {
    col: {},
    rowIndex: {},
    colIndex: {},
    theme: {},
    active: { type: Boolean },
    getOptions: { type: Function }
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const theme = computed(() => props.theme || "light");
    const emit = __emit;
    function handleIconClick(e) {
      e.stopPropagation();
      const target = e.target;
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      getDropdownIns().then((ins) => {
        if (ins.visible) {
          ins.hide();
          return;
        }
        ins.setTheme(theme.value);
        ins.show(
          {
            x: rect.left + scrollLeft,
            y: rect.bottom + scrollTop,
            height: rect.height
          },
          props.getOptions(),
          handleConfirm
        );
      });
    }
    function handleConfirm(value) {
      emit("change", value);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["stk-filter", [{ "stk-filter--active": props.active }, `stk-filter--${theme.value}`]])
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createElementVNode("span", null, toDisplayString(props.col.title), 1)
        ]),
        (openBlock(), createElementBlock("svg", {
          class: "stk-filter-icon",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 1024 1024",
          onClick: handleIconClick
        }, [..._cache[0] || (_cache[0] = [
          createElementVNode("path", {
            fill: "currentColor",
            d: "M950.58 0 l-894.06 0 q-91.93 17.17 -34.34 119.21 l293.97 251.54 l6.06 9.1 q16.17 20.2 16.17 47.48 l0 468.74 l1.01 8.08 q3.03 10.11 9.09 19.2 q2.02 2.02 5.05 7.07 q36.37 33.34 84.86 4.04 l216.19 -124.26 q21.21 -22.22 18.18 -50.51 l0 -332.36 l1.01 -11.12 q4.04 -26.26 22.23 -45.46 l292.96 -251.54 l9.1 -10.11 q43.44 -54.55 14.14 -81.82 q-28.29 -27.28 -61.62 -27.28 ZM832.38 119.21 l-277.81 235.38 l0 377.82 l-96.98 55.57 l0 -433.39 l-275.8 -235.38 l650.59 0 Z"
          }, null, -1)
        ])]))
      ], 2);
    };
  }
});
function extractFilterOptions(dataSource, columnKey) {
  const uniqueValues = /* @__PURE__ */ new Set();
  dataSource.forEach((row) => {
    const val = row[columnKey];
    if (val !== void 0 && val !== null) {
      uniqueValues.add(val);
    }
  });
  return Array.from(uniqueValues).map((value) => ({
    label: String(value),
    value
  }));
}
function createFilterCell(option) {
  const filterStatus = ref({});
  function FilterComponent(config, component) {
    return markRaw(
      defineComponent({
        // eslint-disable-next-line vue/require-prop-types
        props: ["col", "colIndex"],
        setup(props) {
          const colKey = props.col.dataIndex;
          const currentInstance = getCurrentInstance();
          function findStkTableInstance2(curIns) {
            var _a;
            let current = curIns;
            while (current = current.parent) {
              if (((_a = current.type) == null ? void 0 : _a.name) === "StkTable") {
                return current;
              }
            }
            return null;
          }
          const stkTableInstance = findStkTableInstance2(currentInstance);
          const theme = computed(() => {
            var _a;
            return ((_a = stkTableInstance == null ? void 0 : stkTableInstance.props) == null ? void 0 : _a.theme) || "light";
          });
          const filterNumber = computed(() => {
            var _a;
            return ((_a = filterStatus.value[colKey]) == null ? void 0 : _a.value.length) || 0;
          });
          let cachedAutoOptions = null;
          watch(
            () => {
              var _a;
              return (_a = stkTableInstance == null ? void 0 : stkTableInstance.props) == null ? void 0 : _a.dataSource;
            },
            () => {
              cachedAutoOptions = null;
            }
          );
          function getAutoOptions() {
            var _a;
            if (!(config == null ? void 0 : config.autoOptions)) return [];
            if (cachedAutoOptions) return cachedAutoOptions;
            const dataSource = ((_a = stkTableInstance == null ? void 0 : stkTableInstance.props) == null ? void 0 : _a.dataSource) || [];
            cachedAutoOptions = extractFilterOptions(dataSource, colKey);
            return cachedAutoOptions;
          }
          function getResolvedOptions() {
            return (config == null ? void 0 : config.options) ?? getAutoOptions();
          }
          function handleChange(value) {
            var _a, _b, _c;
            filterStatus.value[colKey] = {
              value,
              filter: (config == null ? void 0 : config.filter) ?? ((_a = filterStatus.value[colKey]) == null ? void 0 : _a.filter)
            };
            (_b = option == null ? void 0 : option.onChange) == null ? void 0 : _b.call(option, { colKey, status: filterStatus.value[colKey] });
            (_c = stkTableInstance == null ? void 0 : stkTableInstance.exposed) == null ? void 0 : _c.setFilter(filterStatus.value, option);
          }
          return () => h(
            _sfc_main$2,
            {
              ...props,
              theme: theme.value,
              active: filterNumber.value > 0,
              getOptions: getResolvedOptions,
              onChange: handleChange
            },
            component ? { default: () => [h(component, props)] } : void 0
          );
        }
      })
    );
  }
  return {
    Filter: FilterComponent,
    filterStatus
  };
}
const _hoisted_1$1 = ["value"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EditableCell",
  props: {
    row: {},
    col: {},
    cellValue: {},
    rowIndex: {},
    colIndex: {},
    expanded: {},
    treeExpanded: { type: Boolean },
    trigger: { default: "dblclick" },
    onChange: {}
  },
  setup(__props) {
    const props = __props;
    const editValue = ref(props.cellValue);
    const isEditing = ref(false);
    const inputRef = ref(null);
    const rootRef = ref(null);
    const editing = computed(() => isEditing.value);
    const displayValue = computed(() => {
      const v = props.cellValue;
      return v !== void 0 && v !== null ? v : "";
    });
    watch(
      () => props.cellValue,
      (v) => {
        if (!isEditing.value) {
          editValue.value = v;
        }
      }
    );
    function onTrigger(e) {
      if (e.type !== props.trigger) return;
      startEditing();
    }
    function startEditing() {
      editValue.value = props.cellValue;
      isEditing.value = true;
      nextTick(() => {
        var _a;
        (_a = inputRef.value) == null ? void 0 : _a.focus();
      });
    }
    function finishEditing() {
      var _a;
      isEditing.value = false;
      const newValue = editValue.value;
      setCellValue(newValue);
      (_a = props.onChange) == null ? void 0 : _a.call(props, newValue);
      refocusContainer();
    }
    function cancelEditing() {
      isEditing.value = false;
      editValue.value = props.cellValue;
      refocusContainer();
    }
    function onBlur() {
      if (!isEditing.value) return;
      finishEditing();
    }
    function onInput(e) {
      editValue.value = e.target.value;
    }
    function onKeydown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        finishEditing();
      } else if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        e.stopPropagation();
        cancelEditing();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.stopPropagation();
      } else if (e.key === "Tab") {
        finishEditing();
      } else {
        e.stopPropagation();
      }
    }
    function setCellValue(v) {
      const { row, col } = props;
      row[col.dataIndex] = v;
    }
    function refocusContainer() {
      var _a, _b;
      const el = (_b = (_a = rootRef.value) == null ? void 0 : _a.closest) == null ? void 0 : _b.call(_a, ".stk-table");
      el == null ? void 0 : el.focus();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: "stk-editable-cell",
        onDblclick: onTrigger,
        onClick: onTrigger
      }, [
        !editing.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createTextVNode(toDisplayString(displayValue.value), 1)
        ], 64)) : (openBlock(), createElementBlock("input", {
          key: 1,
          ref_key: "inputRef",
          ref: inputRef,
          class: "stk-editable-cell-input",
          value: editValue.value,
          onBlur,
          onInput,
          onKeydown
        }, null, 40, _hoisted_1$1))
      ], 544);
    };
  }
});
function createEditableCell(option) {
  function EditableCellComponent() {
    return markRaw(
      defineComponent({
        // eslint-disable-next-line vue/require-prop-types
        props: ["row", "col", "cellValue", "rowIndex", "colIndex", "expanded", "treeExpanded"],
        setup(props) {
          return () => h(_sfc_main$1, {
            ...props,
            trigger: (option == null ? void 0 : option.trigger) || "dblclick",
            onChange: (newValue) => {
              var _a;
              (_a = option == null ? void 0 : option.onChange) == null ? void 0 : _a.call(option, newValue, props.row, props.col.dataIndex);
            }
          });
        }
      })
    );
  }
  return {
    EditableCell: EditableCellComponent
  };
}
const _hoisted_1 = { class: "stk-checkbox-cell" };
const _hoisted_2 = ["checked", ".indeterminate"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CheckboxCell",
  props: {
    checked: { type: Boolean },
    indeterminate: { type: Boolean },
    customComponent: {}
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    let _lastValue;
    function handleChange(e) {
      var _a;
      let checked;
      if (typeof e === "boolean") {
        checked = e;
      } else if (((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.checked) !== void 0) {
        checked = e.target.checked;
      } else {
        checked = !!e;
      }
      if (checked === _lastValue) return;
      _lastValue = checked;
      emit("change", checked);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        __props.customComponent ? (openBlock(), createBlock(resolveDynamicComponent(__props.customComponent), {
          key: 0,
          "model-value": __props.checked,
          checked: __props.checked,
          indeterminate: __props.indeterminate,
          "onUpdate:modelValue": handleChange,
          "onUpdate:checked": handleChange,
          onChange: handleChange,
          onClick: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["stop"]))
        }, null, 40, ["model-value", "checked", "indeterminate"])) : (openBlock(), createElementBlock("input", {
          key: 1,
          type: "checkbox",
          checked: __props.checked,
          ".indeterminate": __props.indeterminate,
          class: "stk-checkbox-native",
          onChange: handleChange,
          onClick: _cache[1] || (_cache[1] = withModifiers(() => {
          }, ["stop"]))
        }, null, 40, _hoisted_2))
      ]);
    };
  }
});
function findStkTableInstance(curIns) {
  var _a;
  let current = curIns;
  while (current = current.parent) {
    if (((_a = current.type) == null ? void 0 : _a.name) === "StkTable") {
      return current;
    }
  }
  return null;
}
function createCheckboxCell(options) {
  const field = (options == null ? void 0 : options.field) ?? "_isChecked";
  const customComponent = options == null ? void 0 : options.checkboxComponent;
  function CheckboxCellComponent() {
    return markRaw(
      defineComponent({
        // eslint-disable-next-line vue/require-prop-types
        props: ["row", "col", "cellValue", "rowIndex", "colIndex", "expanded", "treeExpanded"],
        setup(props) {
          const isChecked = computed(() => !!props.row[field]);
          function handleChange(checked) {
            var _a;
            props.row[field] = checked;
            (_a = options == null ? void 0 : options.onChange) == null ? void 0 : _a.call(options, checked, props.row);
          }
          return () => h(_sfc_main, {
            checked: isChecked.value,
            customComponent,
            onChange: handleChange
          });
        }
      })
    );
  }
  function CheckboxAllCellComponent() {
    return markRaw(
      defineComponent({
        // eslint-disable-next-line vue/require-prop-types
        props: ["col", "colIndex", "rowIndex"],
        setup() {
          const currentInstance = getCurrentInstance();
          const stkTableInstance = findStkTableInstance(currentInstance);
          const dataSource = computed(() => {
            var _a;
            return ((_a = stkTableInstance == null ? void 0 : stkTableInstance.props) == null ? void 0 : _a.dataSource) || [];
          });
          const isCheckAll = computed(() => {
            const data = dataSource.value;
            return data.length > 0 && data.every((item) => !!item[field]);
          });
          const isIndeterminate = computed(() => {
            const data = dataSource.value;
            const checkedCount = data.filter((item) => !!item[field]).length;
            return checkedCount > 0 && checkedCount < data.length;
          });
          function handleChange(checked) {
            var _a;
            dataSource.value.forEach((item) => {
              item[field] = checked;
            });
            (_a = options == null ? void 0 : options.onSelectAll) == null ? void 0 : _a.call(options, checked);
          }
          return () => h(_sfc_main, {
            checked: isCheckAll.value,
            indeterminate: isIndeterminate.value,
            customComponent,
            onChange: handleChange
          });
        }
      })
    );
  }
  return {
    CheckboxCell: CheckboxCellComponent,
    CheckboxAllCell: CheckboxAllCellComponent
  };
}
const ABBR_UNITS = {
  cn: [
    [1e8, "亿"],
    [1e4, "万"]
  ],
  en: [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"]
  ]
};
function addThousandsSeparator(numStr) {
  const dotIndex = numStr.indexOf(".");
  const intPart = dotIndex === -1 ? numStr : numStr.slice(0, dotIndex);
  const len = intPart.length;
  if (len <= 3) return numStr;
  const firstGroupLen = len % 3 || 3;
  let withSep = intPart.slice(0, firstGroupLen);
  for (let i = firstGroupLen; i < len; i += 3) {
    withSep += "," + intPart.slice(i, i + 3);
  }
  return dotIndex === -1 ? withSep : withSep + numStr.slice(dotIndex);
}
function formatNumber(value, options = {}) {
  const {
    decimals,
    thousands = true,
    prefix = "",
    suffix = "",
    showSign = false,
    percent = false,
    abbr,
    abbrDecimals,
    placeholder = "--"
  } = options;
  if (value === null || value === void 0 || value === "") {
    return placeholder;
  }
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) {
    return placeholder;
  }
  const sign = num < 0 ? "-" : showSign && num > 0 ? "+" : "";
  let work = Math.abs(num);
  if (percent) {
    work = work * 100;
  }
  let unit = "";
  if (abbr && !percent) {
    const units = ABBR_UNITS[abbr];
    for (let i = 0; i < units.length; i++) {
      const threshold = units[i][0];
      if (work >= threshold) {
        work = work / threshold;
        unit = units[i][1];
        break;
      }
    }
  }
  let fractionDigits;
  if (unit) {
    fractionDigits = abbrDecimals ?? decimals ?? 2;
  } else {
    fractionDigits = decimals ?? null;
  }
  let numStr = fractionDigits == null ? String(work) : work.toFixed(fractionDigits);
  if (thousands) {
    numStr = addThousandsSeparator(numStr);
  }
  const percentSuffix = percent ? "%" : "";
  return `${prefix}${sign}${numStr}${unit}${percentSuffix}${suffix}`;
}
function createNumberCell(options) {
  function NumberCell() {
    return markRaw(
      defineComponent({
        // eslint-disable-next-line vue/require-prop-types
        props: ["row", "col", "cellValue", "rowIndex", "colIndex", "expanded", "treeExpanded"],
        setup(props) {
          return () => h("span", { class: "stk-number-cell" }, formatNumber(props.cellValue, options));
        }
      })
    );
  }
  return {
    NumberCell
  };
}
function resolveDir(rawValue) {
  const num = rawValue === "" || rawValue == null ? NaN : Number(rawValue);
  if (Number.isNaN(num) || num === 0) return "flat";
  return num > 0 ? "rise" : "fall";
}
function createChangeCell(options = {}) {
  const { colorReverse = false, arrow = false, riseColor, fallColor, flatColor } = options;
  function ChangeCell() {
    return markRaw(
      defineComponent({
        // eslint-disable-next-line vue/require-prop-types
        props: ["row", "col", "cellValue", "rowIndex", "colIndex", "expanded", "treeExpanded"],
        setup(props) {
          return () => {
            const raw = props.cellValue;
            const dir = resolveDir(raw);
            let colorClass = "stk-change-cell--flat";
            if (dir === "rise") colorClass = colorReverse ? "stk-change-cell--green" : "stk-change-cell--red";
            else if (dir === "fall") colorClass = colorReverse ? "stk-change-cell--red" : "stk-change-cell--green";
            const customColor = dir === "rise" ? riseColor : dir === "fall" ? fallColor : flatColor;
            const arrowChar = arrow && dir !== "flat" ? dir === "rise" ? "▲" : "▼" : "";
            return h(
              "span",
              {
                class: ["stk-change-cell", colorClass],
                style: customColor ? { color: customColor } : void 0
              },
              [arrowChar ? h("span", { class: "stk-change-cell__arrow" }, arrowChar) : null, formatNumber(raw, options)]
            );
          };
        }
      })
    );
  }
  return {
    ChangeCell
  };
}
export {
  _sfc_main$3 as StkTable,
  binarySearch,
  createChangeCell,
  createCheckboxCell,
  createEditableCell,
  createFilterCell,
  createNumberCell,
  formatNumber,
  insertToOrderedArray,
  registerFeature,
  strCompare,
  tableSort,
  useAreaSelection
};
