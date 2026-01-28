/**
 * name: stk-table-vue
 * version: v0.9.0
 * description: High performance realtime virtual table for vue3 and vue2.7
 * author: japlus
 * homepage: https://ja-plus.github.io/stk-table-vue/
 * license: MIT
 */
import { createElementBlock, openBlock, createElementVNode, watch, onMounted, onBeforeUnmount, ref, computed, shallowRef, onUnmounted, nextTick, customRef, defineComponent, toRef, toRaw, normalizeStyle, normalizeClass, unref, createCommentVNode, renderSlot, Fragment, renderList, mergeProps, createBlock, resolveDynamicComponent, toDisplayString, createTextVNode, withCtx, createVNode } from "vue";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$3 = {};
const _hoisted_1$3 = {
  class: "drag-row-handle",
  draggable: "true"
};
function _sfc_render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("span", _hoisted_1$3, [..._cache[0] || (_cache[0] = [
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
const DragHandle = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2]]);
const _sfc_main$2 = {};
const _hoisted_1$2 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16"
};
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, [..._cache[0] || (_cache[0] = [
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
const SortIcon = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1]]);
const _sfc_main$1 = {};
const _hoisted_1$1 = { class: "stk-fold-icon" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$1);
}
const TriangleIcon = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
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
  const data = targetArray.slice();
  if (!order || !data.length) {
    data.unshift(newItem);
    return data;
  }
  const { emptyToBottom, customCompare, stringLocaleCompare } = { emptyToBottom: false, ...sortConfig };
  const targetVal = newItem[field];
  if (emptyToBottom && isEmptyValue(targetVal)) {
    data.push(newItem);
  } else {
    const customCompareFn = customCompare || ((a, b) => {
      const midVal = a[field];
      const compareRes = strCompare(midVal, targetVal, isNumber, stringLocaleCompare);
      return order === "asc" ? compareRes : -compareRes;
    });
    const isNumber = sortType === "number";
    const sIndex = binarySearch(data, (midIndex) => {
      return customCompareFn(data[midIndex], newItem);
    });
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
  for (let i = 0; i < targetDataSource.length; i++) {
    const row = targetDataSource[i];
    const sortField = sortOption.sortField || sortOption.dataIndex;
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
function getClosestTr(e) {
  const target = e.target;
  const tr = target == null ? void 0 : target.closest("tr");
  return tr;
}
function getClosestTrIndex(e) {
  const tr = getClosestTr(e);
  if (!tr) return -1;
  return Number(tr.dataset.rowI);
}
function getClosestColKey(e) {
  var _a, _b;
  return (_b = (_a = e.target) == null ? void 0 : _a.closest("td")) == null ? void 0 : _b.dataset.colKey;
}
function throttle(fn, delay) {
  let timer;
  let lastArgs = null;
  const callFn = function() {
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
const DEFAULT_COL_WIDTH = "100";
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
var TagType = /* @__PURE__ */ ((TagType2) => {
  TagType2[TagType2["TH"] = 0] = "TH";
  TagType2[TagType2["TD"] = 1] = "TD";
  return TagType2;
})(TagType || {});
function useAutoResize({ tableContainerRef, initVirtualScroll, props, debounceMs }) {
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
        initVirtualScroll();
        if (typeof props.autoResize === "function") {
          props.autoResize();
        }
      }
      debounceTime = 0;
    }, debounceMs);
  }
}
function getColWidth(col) {
  const val = (col == null ? void 0 : col.minWidth) ?? (col == null ? void 0 : col.width) ?? DEFAULT_COL_WIDTH;
  if (typeof val === "number") {
    return Math.floor(val);
  }
  return parseInt(val);
}
function getCalculatedColWidth(col) {
  return (col && col.__WIDTH__) ?? +DEFAULT_COL_WIDTH;
}
function createStkTableId() {
  let id = window.__STK_TB_ID_COUNT__;
  if (!id) id = 0;
  id += 1;
  window.__STK_TB_ID_COUNT__ = id;
  return STK_ID_PREFIX + id.toString(36);
}
function useColResize({
  tableContainerRef,
  tableHeaderLast,
  colResizeIndicatorRef,
  props,
  emits,
  colKeyGen,
  fixedCols
}) {
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
    const colIndex = tableHeaderLastValue.findIndex((it) => colKey(it) === colKey(col));
    const fixedIndex = fixedCols.value.indexOf(col);
    const isFixed = fixedIndex !== -1;
    if (leftHandle) {
      if (isFixed && col.fixed === "right") {
        revertMoveX = true;
      } else {
        if (colIndex - 1 >= 0) {
          col = tableHeaderLastValue[colIndex - 1];
        }
      }
    } else {
      if (isFixed && col.fixed === "right") {
        revertMoveX = true;
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
    if (!curCol) return;
    curCol.width = width + "px";
    emits("update:columns", props.columns.slice());
    emits("col-resize", { ...curCol });
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
  return {
    colResizeOn,
    isColResizing,
    onThResizeMouseDown
  };
}
function useFixedCol({
  props,
  colKeyGen,
  getFixedColPosition,
  tableHeaders,
  tableHeadersForCalc,
  tableContainerRef
}) {
  const fixedShadowCols = shallowRef([]);
  const fixedCols = shallowRef([]);
  const fixedColClassMap = computed(() => {
    const colMap = /* @__PURE__ */ new Map();
    const fixedShadowColsValue = fixedShadowCols.value;
    const fixedColsValue = fixedCols.value;
    const colKey = colKeyGen.value;
    const fixedColShadow = props.fixedColShadow;
    tableHeaders.value.forEach((cols) => {
      cols.forEach((col) => {
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
        colMap.set(colKey(col), classList);
      });
    });
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
    tableHeadersForCalc.value.forEach((row, level) => {
      let left = 0;
      row.forEach((col) => {
        const position = getFixedColPositionValue(col);
        const isFixedLeft = col.fixed === "left";
        const isFixedRight = col.fixed === "right";
        if (isFixedLeft && position + scrollLeft > left) {
          fixedColsTemp.push(col);
          leftShadowCol[level] = col;
        }
        left += getCalculatedColWidth(col);
        if (isFixedRight && scrollLeft + clientWidth - left < position) {
          fixedColsTemp.push(col);
          if (!rightShadowCol[level]) {
            rightShadowCol[level] = col;
          }
        }
      });
    });
    if (props.fixedColShadow) {
      fixedShadowCols.value = leftShadowCol.concat(rightShadowCol).filter(Boolean);
    }
    fixedCols.value = fixedColsTemp;
  }
  return {
    /** 正在被固定的列 */
    fixedCols,
    /** 固定列class */
    fixedColClassMap,
    /** 滚动条变化时，更新需要展示阴影的列 */
    updateFixedShadow
  };
}
function useFixedStyle({
  props,
  isRelativeMode,
  getFixedColPosition,
  virtualScroll,
  virtualScrollX,
  virtualX_on,
  virtualX_offsetRight
}) {
  function getFixedStyle(tagType, col, depth = 0) {
    const { fixed } = col;
    if (tagType === TagType.TD && !fixed) return null;
    const style = {};
    const { headerRowHeight, rowHeight } = props;
    const isFixedLeft = fixed === "left";
    const { scrollLeft, scrollWidth, offsetLeft, containerWidth } = virtualScrollX.value;
    const scrollRight = scrollWidth - containerWidth - scrollLeft;
    if (tagType === TagType.TH) {
      if (isRelativeMode.value) {
        style.top = virtualScroll.value.scrollTop + "px";
      } else {
        style.top = depth * (headerRowHeight ?? rowHeight) + "px";
      }
    }
    if (fixed === "left" || fixed === "right") {
      if (isRelativeMode.value) {
        if (isFixedLeft) {
          style.left = scrollLeft - (virtualX_on.value ? offsetLeft : 0) + "px";
        } else {
          style.right = Math.max(scrollRight - (virtualX_on.value ? virtualX_offsetRight.value : 0), 0) + "px";
        }
      } else {
        const lr = getFixedColPosition.value(col) + "px";
        if (isFixedLeft) {
          style.left = lr;
        } else {
          style.right = lr;
        }
      }
    }
    return style;
  }
  return getFixedStyle;
}
function useGetFixedColPosition({ tableHeadersForCalc, colKeyGen }) {
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
function useHighlight({ props, stkTableId, tableContainerRef }) {
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
          highlightDimRowsAnimation.forEach((store, rowKeyValue) => {
            const { ts, duration } = store;
            const timeOffset = nowTs - ts;
            if (timeOffset < duration) {
              updateRowAnimation(rowKeyValue, store, timeOffset);
            } else {
              highlightDimRowsAnimation.delete(rowKeyValue);
            }
          });
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
      highlightCellsInCssKeyFrame(cellEl, rowKeyValue, className, duration);
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
    if (method === "animation") {
      if (props.virtual) {
        const nowTs = performance.now();
        for (let i = 0; i < rowKeyValues.length; i++) {
          const rowKeyValue = rowKeyValues[i];
          const store = { ts: nowTs, visible: false, keyframe, duration };
          highlightDimRowsAnimation.set(rowKeyValue, store);
          updateRowAnimation(rowKeyValue, store, 0);
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
  function highlightCellsInCssKeyFrame(cellEl, rowKeyValue, className, duration) {
    if (cellEl.classList.contains(className)) {
      cellEl.classList.remove(className);
      void cellEl.offsetHeight;
    }
    cellEl.classList.add(className);
    window.clearTimeout(highlightDimCellsTimeout.get(rowKeyValue));
    highlightDimCellsTimeout.set(
      rowKeyValue,
      window.setTimeout(() => {
        cellEl.classList.remove(className);
        highlightDimCellsTimeout.delete(rowKeyValue);
      }, duration)
    );
  }
  function updateRowAnimation(rowKeyValue, store, timeOffset) {
    const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValue));
    const { visible } = store;
    if (!rowEl) {
      if (visible) {
        store.visible = false;
      }
      return;
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
  }
  return {
    highlightSteps,
    setHighlightDimRow,
    setHighlightDimCell
  };
}
var ScrollCodes = /* @__PURE__ */ ((ScrollCodes2) => {
  ScrollCodes2["ArrowUp"] = "ArrowUp";
  ScrollCodes2["ArrowRight"] = "ArrowRight";
  ScrollCodes2["ArrowDown"] = "ArrowDown";
  ScrollCodes2["ArrowLeft"] = "ArrowLeft";
  ScrollCodes2["PageUp"] = "PageUp";
  ScrollCodes2["PageDown"] = "PageDown";
  ScrollCodes2["Home"] = "Home";
  ScrollCodes2["End"] = "End";
  return ScrollCodes2;
})(ScrollCodes || {});
const ScrollCodesValues = Object.values(ScrollCodes);
function useKeyboardArrowScroll(targetElement, { props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on }) {
  let isMouseOver = false;
  watch(virtual_on, (val) => {
    if (!val) {
      removeListeners();
    } else {
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
    const keyCode = e.code;
    if (!ScrollCodesValues.includes(keyCode)) return;
    if (!isMouseOver) return;
    e.preventDefault();
    const { scrollTop, rowHeight, containerHeight, scrollHeight } = virtualScroll.value;
    const { scrollLeft } = virtualScrollX.value;
    const { headless, headerRowHeight } = props;
    const headerHeight = headless ? 0 : tableHeaders.value.length * (headerRowHeight || rowHeight);
    const bodyPageSize = Math.floor((containerHeight - headerHeight) / rowHeight);
    if (keyCode === "ArrowUp") {
      scrollTo(scrollTop - rowHeight, null);
    } else if (keyCode === "ArrowRight") {
      scrollTo(null, scrollLeft + 50);
    } else if (keyCode === "ArrowDown") {
      scrollTo(scrollTop + rowHeight, null);
    } else if (keyCode === "ArrowLeft") {
      scrollTo(null, scrollLeft - 50);
    } else if (keyCode === "PageUp") {
      scrollTo(scrollTop - rowHeight * bodyPageSize + headerHeight, null);
    } else if (keyCode === "PageDown") {
      scrollTo(scrollTop + rowHeight * bodyPageSize - headerHeight, null);
    } else if (keyCode === "Home") {
      scrollTo(0, null);
    } else if (keyCode === "End") {
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
function useMaxRowSpan({ props, tableHeaderLast, rowKeyGen, dataSourceCopy }) {
  const maxRowSpan = /* @__PURE__ */ new Map();
  function updateMaxRowSpan() {
    if (!props.virtual) {
      if (maxRowSpan.size) maxRowSpan.clear();
      return;
    }
    maxRowSpan.clear();
    const data = dataSourceCopy.value;
    const columns = tableHeaderLast.value;
    const columnsWithMerge = columns.filter((col) => col.mergeCells);
    if (!columnsWithMerge.length) return;
    const dataLength = data.length;
    const mergeColumnsLength = columnsWithMerge.length;
    for (let rowIndex = 0; rowIndex < dataLength; rowIndex++) {
      const row = data[rowIndex];
      const rowKey = rowKeyGen(row);
      let currentMax = maxRowSpan.get(rowKey) || 0;
      for (let colIndex = 0; colIndex < mergeColumnsLength; colIndex++) {
        const col = columnsWithMerge[colIndex];
        const { rowspan = 1 } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};
        if (rowspan > 1 && rowspan > currentMax) {
          currentMax = rowspan;
          maxRowSpan.set(rowKey, currentMax);
        }
      }
    }
  }
  return {
    maxRowSpan,
    updateMaxRowSpan
  };
}
function useMergeCells({ rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart }) {
  const hiddenCellMap = ref({});
  const hoverRowMap = ref({});
  const hoverMergedCells = ref(/* @__PURE__ */ new Set());
  const activeMergedCells = ref(/* @__PURE__ */ new Set());
  watch([virtual_dataSourcePart, tableHeaderLast], () => {
    hiddenCellMap.value = {};
    hoverRowMap.value = {};
  });
  function hideCells(rowKey, colKey, colspan, isSelfRow = false, mergeCellKey) {
    const startIndex = tableHeaderLast.value.findIndex((item) => colKeyGen.value(item) === colKey);
    for (let i = startIndex; i < startIndex + colspan; i++) {
      if (!hoverRowMap.value[rowKey]) hoverRowMap.value[rowKey] = /* @__PURE__ */ new Set();
      hoverRowMap.value[rowKey].add(mergeCellKey);
      if (isSelfRow && i === startIndex) {
        continue;
      }
      const nextCol = tableHeaderLast.value[i];
      if (!nextCol) break;
      const nextColKey = colKeyGen.value(nextCol);
      if (!hiddenCellMap.value[rowKey]) hiddenCellMap.value[rowKey] = /* @__PURE__ */ new Set();
      hiddenCellMap.value[rowKey].add(nextColKey);
    }
  }
  function mergeCellsWrapper(row, col, rowIndex, colIndex) {
    if (!col.mergeCells) return;
    let { colspan, rowspan } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};
    colspan = colspan || 1;
    rowspan = rowspan || 1;
    if (colspan === 1 && rowspan === 1) return;
    const rowKey = rowKeyGen(row);
    const curRowIndex = virtual_dataSourcePart.value.findIndex((item) => rowKeyGen(item) === rowKey);
    if (curRowIndex === -1) return;
    const colKey = colKeyGen.value(col);
    const mergedCellKey = pureCellKeyGen(rowKey, colKey);
    for (let i = curRowIndex; i < curRowIndex + rowspan; i++) {
      const row2 = virtual_dataSourcePart.value[i];
      if (!row2) break;
      hideCells(rowKeyGen(row2), colKey, colspan, i === curRowIndex, mergedCellKey);
    }
    return { colspan, rowspan };
  }
  const emptySet = /* @__PURE__ */ new Set();
  function updateHoverMergedCells(rowKey) {
    hoverMergedCells.value = rowKey === void 0 ? emptySet : hoverRowMap.value[rowKey] || emptySet;
  }
  function updateActiveMergedCells(clear, rowKey) {
    if (!rowActiveProp.value.enabled) return;
    if (clear) {
      activeMergedCells.value = /* @__PURE__ */ new Set();
      return;
    }
    activeMergedCells.value = rowKey !== void 0 && hoverRowMap.value[rowKey] || new Set(hoverMergedCells.value);
  }
  return {
    hiddenCellMap,
    mergeCellsWrapper,
    hoverMergedCells,
    updateHoverMergedCells,
    activeMergedCells,
    updateActiveMergedCells
  };
}
function useRowExpand({ dataSourceCopy, rowKeyGen, emits }) {
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
    if (typeof rowKeyOrRow === "string") {
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
      const rowKey2 = item.__ROW_K__;
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
        __ROW_K__: EXPANDED_ROW_KEY_PREFIX + rowKey,
        __EXP_R__: row,
        __EXP_C__: col
      };
      tempData.splice(index + 1, 0, newExpandRow);
    }
    if (row) {
      row[expandedKey] = expand ? col : void 0;
    }
    dataSourceCopy.value = tempData;
    if (!(data == null ? void 0 : data.silent)) {
      emits("toggle-row-expand", { expanded: Boolean(expand), row, col });
    }
  }
  return {
    toggleExpandRow,
    setRowExpand
  };
}
function useScrollbar(containerRef, options = ref(false)) {
  const defaultOptions = ref({
    enabled: true,
    minHeight: 20,
    minWidth: 20,
    width: 8,
    height: 8
  });
  const mergedOptions = computed(() => ({
    ...defaultOptions.value,
    ...typeof options.value === "boolean" ? { enabled: options.value } : options.value
  }));
  const showScrollbar = ref({ x: false, y: false });
  const scrollbar = ref({ h: 0, w: 0, top: 0, left: 0 });
  let isDraggingVertical = false;
  let isDraggingHorizontal = false;
  let dragStartY = 0;
  let dragStartX = 0;
  let dragStartTop = 0;
  let dragStartLeft = 0;
  let resizeObserver = null;
  const throttledUpdateScrollbar = throttle(() => {
    updateCustomScrollbar();
  }, 200);
  onMounted(() => {
    if (mergedOptions.value.enabled && containerRef.value) {
      resizeObserver = new ResizeObserver(throttledUpdateScrollbar);
      resizeObserver.observe(containerRef.value);
    }
    initScrollbar();
  });
  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });
  function updateCustomScrollbar() {
    if (!mergedOptions.value.enabled || !containerRef.value) return;
    const container = containerRef.value;
    const { scrollHeight, clientHeight, scrollWidth, clientWidth, scrollTop, scrollLeft } = container;
    const needVertical = scrollHeight > clientHeight;
    const needHorizontal = scrollWidth > clientWidth;
    showScrollbar.value = { x: needHorizontal, y: needVertical };
    if (needVertical) {
      const ratio = clientHeight / scrollHeight;
      scrollbar.value.h = Math.max(mergedOptions.value.minHeight, ratio * clientHeight);
      scrollbar.value.top = scrollTop / (scrollHeight - clientHeight) * (clientHeight - scrollbar.value.h);
    }
    if (needHorizontal) {
      const ratio = clientWidth / scrollWidth;
      scrollbar.value.w = Math.max(mergedOptions.value.minWidth, ratio * clientWidth);
      scrollbar.value.left = scrollLeft / (scrollWidth - clientWidth) * (clientWidth - scrollbar.value.w);
    }
  }
  function onVerticalScrollbarMouseDown(e) {
    e.preventDefault();
    isDraggingVertical = true;
    const container = containerRef.value;
    if (!container) return;
    dragStartTop = container.scrollTop;
    dragStartY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    document.addEventListener("mousemove", onVerticalDrag);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onVerticalDrag, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  }
  function onHorizontalScrollbarMouseDown(e) {
    e.preventDefault();
    isDraggingHorizontal = true;
    const container = containerRef.value;
    if (!container) return;
    dragStartLeft = container.scrollLeft;
    dragStartX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    document.addEventListener("mousemove", onHorizontalDrag);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onHorizontalDrag, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  }
  function onVerticalDrag(e) {
    if (!isDraggingVertical || !containerRef.value) return;
    e.preventDefault();
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const deltaY = clientY - dragStartY;
    const container = containerRef.value;
    const { scrollHeight, clientHeight } = container;
    const scrollRange = scrollHeight - clientHeight;
    const trackRange = clientHeight - scrollbar.value.h;
    const scrollDelta = deltaY / trackRange * scrollRange;
    container.scrollTop = dragStartTop + scrollDelta;
  }
  function onHorizontalDrag(e) {
    if (!isDraggingHorizontal || !containerRef.value) return;
    e.preventDefault();
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const deltaX = clientX - dragStartX;
    const container = containerRef.value;
    const { scrollWidth, clientWidth } = container;
    const scrollRange = scrollWidth - clientWidth;
    const trackRange = clientWidth - scrollbar.value.w;
    const scrollDelta = deltaX / trackRange * scrollRange;
    container.scrollLeft = dragStartLeft + scrollDelta;
  }
  function onDragEnd() {
    isDraggingVertical = false;
    isDraggingHorizontal = false;
    document.removeEventListener("mousemove", onVerticalDrag);
    document.removeEventListener("mousemove", onHorizontalDrag);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onVerticalDrag);
    document.removeEventListener("touchmove", onHorizontalDrag);
    document.removeEventListener("touchend", onDragEnd);
  }
  function initScrollbar() {
    nextTick(() => {
      updateCustomScrollbar();
    });
  }
  return {
    scrollbarOptions: mergedOptions,
    scrollbar,
    showScrollbar,
    onVerticalScrollbarMouseDown,
    onHorizontalScrollbarMouseDown,
    updateCustomScrollbar
  };
}
function useScrollRowByRow({ props, tableContainerRef }) {
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
  return { isSRBRActive, isDragScroll };
}
function useThDrag({ props, emits, colKeyGen }) {
  const findParentTH = (e) => e.target.closest("th");
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
    const th = findParentTH(e);
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
    const th = findParentTH(e);
    if (!th) return;
    const isHeaderDraggable = th.getAttribute("draggable") === "true";
    if (!isHeaderDraggable) return;
    const dt = e.dataTransfer;
    if (dt) {
      dt.dropEffect = "move";
    }
    e.preventDefault();
  }
  function onThDrop(e) {
    var _a;
    const th = findParentTH(e);
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
  return {
    onThDragStart,
    onThDragOver,
    onThDrop,
    /** 是否可拖拽 */
    isHeaderDraggable: (col) => dragConfig.value.draggable && !dragConfig.value.disabled(col)
  };
}
const TR_DRAGGING_CLASS = "tr-dragging";
const TR_DRAG_OVER_CLASS = "tr-dragging-over";
const DATA_TRANSFER_FORMAT = "text/plain";
function useTrDrag({ props, emits, dataSourceCopy }) {
  let trDragFlag = false;
  const dragRowConfig = computed(() => {
    return { mode: "insert", ...props.dragRowConfig };
  });
  function onTrDragStart(e, rowIndex) {
    var _a;
    const tr = getClosestTr(e);
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
    const tr = getClosestTr(e);
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
    const tr = getClosestTr(e);
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
  return {
    dragRowConfig,
    onTrDragStart,
    onTrDragEnter,
    onTrDragOver,
    onTrDrop,
    onTrDragEnd
  };
}
function useTree({ props, dataSourceCopy, rowKeyGen, emits }) {
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
      if (typeof rowKeyOrRow === "string") {
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
      let expanded = option == null ? void 0 : option.expand;
      if (expanded === void 0) {
        expanded = !row2.__T_EXP__;
      }
      if (expanded) {
        const children = expandNode(row2, level);
        tempData.splice(index + 1, 0, ...children);
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
  }
  function setTreeExpand(row, option) {
    privateSetTreeExpand(row, { ...option, isClick: false });
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
  return {
    toggleTreeNode,
    setTreeExpand,
    flatTreeData
  };
}
const VUE2_SCROLL_TIMEOUT_MS = 200;
function useVirtualScroll({
  props,
  tableContainerRef,
  trRef,
  dataSourceCopy,
  tableHeaderLast,
  tableHeaders,
  rowKeyGen,
  maxRowSpan
}) {
  const tableHeaderHeight = computed(() => props.headerRowHeight * tableHeaders.value.length);
  const virtualScroll = ref({
    containerHeight: 0,
    rowHeight: props.rowHeight,
    pageSize: 0,
    startIndex: 0,
    endIndex: 0,
    offsetTop: 0,
    scrollTop: 0,
    scrollHeight: 0
  });
  const virtualScrollX = ref({
    containerWidth: 0,
    scrollWidth: 0,
    startIndex: 0,
    endIndex: 0,
    offsetLeft: 0,
    scrollLeft: 0
  });
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
  const virtualX_columnPart = computed(() => {
    const tableHeaderLastValue = tableHeaderLast.value;
    if (virtualX_on.value) {
      const leftCols = [];
      const rightCols = [];
      const { startIndex, endIndex } = virtualScrollX.value;
      for (let i = 0; i < startIndex; i++) {
        const col = tableHeaderLastValue[i];
        if ((col == null ? void 0 : col.fixed) === "left") leftCols.push(col);
      }
      for (let i = endIndex; i < tableHeaderLastValue.length; i++) {
        const col = tableHeaderLastValue[i];
        if ((col == null ? void 0 : col.fixed) === "right") rightCols.push(col);
      }
      const mainColumns = tableHeaderLastValue.slice(startIndex, endIndex);
      return leftCols.concat(mainColumns).concat(rightCols);
    }
    return tableHeaderLastValue;
  });
  const virtualX_offsetRight = computed(() => {
    if (!virtualX_on.value) return 0;
    let width = 0;
    const tableHeaderLastValue = tableHeaderLast.value;
    for (let i = virtualScrollX.value.endIndex; i < tableHeaderLastValue.length; i++) {
      const col = tableHeaderLastValue[i];
      if (col.fixed !== "right") {
        width += getCalculatedColWidth(col);
      }
    }
    return width;
  });
  const getRowHeightFn = computed(() => {
    var _a;
    let rowHeightFn = () => props.rowHeight || DEFAULT_ROW_HEIGHT;
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
    let scrollTop = ((_a = tableContainerRef.value) == null ? void 0 : _a.scrollTop) || 0;
    const rowHeight = getRowHeightFn.value();
    const containerHeight = height || clientHeight || DEFAULT_TABLE_HEIGHT;
    const { headless } = props;
    let pageSize = Math.ceil(containerHeight / rowHeight);
    if (!headless) {
      const headerToBodyRowHeightCount = Math.floor(tableHeaderHeight.value / rowHeight);
      pageSize -= headerToBodyRowHeightCount;
    }
    const maxScrollTop = dataSourceCopy.value.length * rowHeight + tableHeaderHeight.value - containerHeight;
    if (scrollTop > maxScrollTop) {
      scrollTop = maxScrollTop;
    }
    Object.assign(virtualScroll.value, { containerHeight, pageSize, scrollHeight });
    updateVirtualScrollY(scrollTop);
  }
  function initVirtualScrollX() {
    const { clientWidth, scrollLeft, scrollWidth } = tableContainerRef.value || {};
    virtualScrollX.value.containerWidth = clientWidth || DEFAULT_TABLE_WIDTH;
    virtualScrollX.value.scrollWidth = scrollWidth || DEFAULT_TABLE_WIDTH;
    updateVirtualScrollX(scrollLeft);
  }
  let vue2ScrollYTimeout = null;
  const autoRowHeightMap = /* @__PURE__ */ new Map();
  function setAutoHeight(rowKey, height) {
    if (!height) {
      autoRowHeightMap.delete(String(rowKey));
    } else {
      autoRowHeightMap.set(String(rowKey), height);
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
    var _a;
    const { pageSize, scrollTop, startIndex: oldStartIndex, endIndex: oldEndIndex, containerHeight } = virtualScroll.value;
    virtualScroll.value.scrollTop = sTop;
    if (!virtual_on.value) {
      return;
    }
    const dataSourceCopyTemp = dataSourceCopy.value;
    const rowHeight = getRowHeightFn.value();
    const { autoRowHeight, stripe, optimizeVue2Scroll } = props;
    const dataLength = dataSourceCopyTemp.length;
    let startIndex = 0;
    let endIndex = dataLength;
    let autoRowHeightTop = 0;
    if (autoRowHeight || hasExpandCol.value) {
      if (autoRowHeight) {
        (_a = trRef.value) == null ? void 0 : _a.forEach((tr) => {
          const { rowKey } = tr.dataset;
          if (!rowKey || autoRowHeightMap.has(rowKey)) return;
          autoRowHeightMap.set(rowKey, tr.offsetHeight);
        });
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
    }
    if (maxRowSpan.size) {
      let correctedStartIndex = startIndex;
      let correctedEndIndex = endIndex;
      for (let i = 0; i < startIndex; i++) {
        const row = dataSourceCopyTemp[i];
        if (!row) continue;
        const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
        if (spanEndIndex > startIndex) {
          correctedStartIndex = i;
          if (spanEndIndex > endIndex) {
            correctedEndIndex = spanEndIndex;
          }
          break;
        }
      }
      for (let i = correctedStartIndex; i < endIndex; i++) {
        const row = dataSourceCopyTemp[i];
        if (!row) continue;
        const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
        if (spanEndIndex > correctedEndIndex) {
          correctedEndIndex = Math.max(spanEndIndex, correctedEndIndex);
        }
      }
      startIndex = correctedStartIndex;
      endIndex = correctedEndIndex;
    }
    if (stripe && startIndex > 0 && startIndex % 2) {
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
      if (oldStartIndex === startIndex && oldEndIndex === endIndex) {
        return;
      }
      offsetTop = startIndex * rowHeight;
    }
    if (!optimizeVue2Scroll || sTop <= scrollTop || Math.abs(oldStartIndex - startIndex) >= pageSize) {
      Object.assign(virtualScroll.value, { startIndex, endIndex, offsetTop });
    } else {
      virtualScroll.value.endIndex = endIndex;
      vue2ScrollYTimeout = window.setTimeout(() => {
        Object.assign(virtualScroll.value, { startIndex, offsetTop });
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
    let colWidthSum = 0;
    let leftColWidthSum = 0;
    let leftFirstColRestWidth = 0;
    for (let colIndex = 0; colIndex < headerLength; colIndex++) {
      const col = tableHeaderLastValue[colIndex];
      const colWidth = getCalculatedColWidth(col);
      startIndex++;
      if (col.fixed === "left") {
        leftColWidthSum += colWidth;
        continue;
      }
      colWidthSum += colWidth;
      if (colWidthSum >= sLeft) {
        offsetLeft = colWidthSum - colWidth;
        startIndex--;
        leftFirstColRestWidth = colWidthSum - sLeft;
        break;
      }
    }
    colWidthSum = leftFirstColRestWidth;
    const containerW = containerWidth - leftColWidthSum;
    let endIndex = headerLength;
    for (let colIndex = startIndex + 1; colIndex < headerLength; colIndex++) {
      const col = tableHeaderLastValue[colIndex];
      colWidthSum += getCalculatedColWidth(col);
      if (colWidthSum >= containerW) {
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
    } else {
      Object.assign(virtualScrollX.value, { endIndex, scrollLeft: sLeft });
      vue2ScrollXTimeout = window.setTimeout(() => {
        Object.assign(virtualScrollX.value, { startIndex, offsetLeft });
      }, VUE2_SCROLL_TIMEOUT_MS);
    }
  }
  return {
    virtualScroll,
    virtualScrollX,
    virtual_on,
    virtual_dataSourcePart,
    virtual_offsetBottom,
    virtualX_on,
    virtualX_columnPart,
    virtualX_offsetRight,
    tableHeaderHeight,
    initVirtualScroll,
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX,
    setAutoHeight,
    clearAllAutoHeight
  };
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
const _hoisted_1 = { class: "stk-table-scroll-container" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = ["onClick"];
const _hoisted_4 = ["onMousedown"];
const _hoisted_5 = { class: "table-header-title" };
const _hoisted_6 = ["onMousedown"];
const _hoisted_7 = {
  key: 0,
  class: "vt-x-left"
};
const _hoisted_8 = ["onDrop"];
const _hoisted_9 = {
  key: 0,
  class: "vt-x-left"
};
const _hoisted_10 = ["colspan"];
const _hoisted_11 = { class: "table-cell-wrapper" };
const _hoisted_12 = ["title"];
const _hoisted_13 = {
  key: 3,
  class: "vt-x-right"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StkTable",
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
    scrollbar: { type: [Boolean, Object], default: false }
  },
  emits: ["sort-change", "row-click", "current-change", "cell-selected", "row-dblclick", "header-row-menu", "row-menu", "cell-click", "cell-mouseenter", "cell-mouseleave", "cell-mouseover", "cell-mousedown", "header-cell-click", "scroll", "scroll-x", "col-order-change", "th-drag-start", "th-drop", "row-order-change", "col-resize", "toggle-row-expand", "toggle-tree-expand", "update:columns"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const stkTableId = createStkTableId();
    const props = __props;
    const emits = __emit;
    const tableContainerRef = ref();
    const colResizeIndicatorRef = ref();
    const trRef = ref();
    const isRelativeMode = ref(IS_LEGACY_MODE ? true : props.cellFixedMode === "relative");
    const currentRow = shallowRef();
    const currentRowKey = ref();
    const currentSelectedCellKey = ref();
    let currentHoverRow = null;
    const currentHoverRowKey = ref(null);
    let sortCol = ref();
    let sortOrderIndex = ref(0);
    const sortSwitchOrder = [null, "desc", "asc"];
    const tableHeaders = shallowRef([]);
    const tableHeadersForCalc = shallowRef([]);
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
    const rowKeyGenCache = /* @__PURE__ */ new WeakMap();
    const { scrollbarOptions, scrollbar, showScrollbar, onVerticalScrollbarMouseDown, onHorizontalScrollbarMouseDown, updateCustomScrollbar } = useScrollbar(tableContainerRef, toRef(props, "scrollbar"));
    const { isSRBRActive } = useScrollRowByRow({ props, tableContainerRef });
    const { onThDragStart, onThDragOver, onThDrop, isHeaderDraggable } = useThDrag({ props, emits, colKeyGen });
    const { onTrDragStart, onTrDrop, onTrDragOver, onTrDragEnd, onTrDragEnter } = useTrDrag({ props, emits, dataSourceCopy });
    const { maxRowSpan, updateMaxRowSpan } = useMaxRowSpan({ props, tableHeaderLast, rowKeyGen, dataSourceCopy });
    const {
      virtualScroll,
      virtualScrollX,
      virtual_on,
      virtual_dataSourcePart,
      virtual_offsetBottom,
      virtualX_on,
      virtualX_columnPart,
      virtualX_offsetRight,
      tableHeaderHeight,
      initVirtualScroll,
      initVirtualScrollY,
      initVirtualScrollX,
      updateVirtualScrollY,
      updateVirtualScrollX,
      setAutoHeight,
      clearAllAutoHeight
    } = useVirtualScroll({ tableContainerRef, trRef, props, dataSourceCopy, tableHeaderLast, tableHeaders, rowKeyGen, maxRowSpan });
    const {
      hiddenCellMap,
      //
      mergeCellsWrapper,
      hoverMergedCells,
      updateHoverMergedCells,
      activeMergedCells,
      updateActiveMergedCells
    } = useMergeCells({ rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart });
    const getFixedColPosition = useGetFixedColPosition({ colKeyGen, tableHeadersForCalc });
    const getFixedStyle = useFixedStyle({
      props,
      isRelativeMode,
      getFixedColPosition,
      virtualScroll,
      virtualScrollX,
      virtualX_on,
      virtualX_offsetRight
    });
    const { highlightSteps, setHighlightDimCell, setHighlightDimRow } = useHighlight({ props, stkTableId, tableContainerRef });
    if (props.autoResize) {
      useAutoResize({ tableContainerRef, initVirtualScroll, props, debounceMs: 200 });
    }
    useKeyboardArrowScroll(tableContainerRef, {
      props,
      scrollTo,
      virtualScroll,
      virtualScrollX,
      tableHeaders,
      virtual_on
    });
    const { fixedCols, fixedColClassMap, updateFixedShadow } = useFixedCol({
      props,
      colKeyGen,
      getFixedColPosition,
      tableContainerRef,
      tableHeaders,
      tableHeadersForCalc
    });
    const { isColResizing, onThResizeMouseDown, colResizeOn } = useColResize({
      props,
      emits,
      colKeyGen,
      colResizeIndicatorRef,
      tableContainerRef,
      tableHeaderLast,
      fixedCols
    });
    const { toggleExpandRow, setRowExpand } = useRowExpand({ dataSourceCopy, rowKeyGen, emits });
    const { toggleTreeNode, setTreeExpand, flatTreeData } = useTree({ props, dataSourceCopy, rowKeyGen, emits });
    watch(
      () => props.columns,
      () => {
        dealColumns();
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
        dealColumns();
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
      () => dataSourceCopy.value,
      () => {
        nextTick(updateCustomScrollbar);
      }
    );
    watch(
      () => props.fixedColShadow,
      () => updateFixedShadow()
    );
    dealColumns();
    initDataSource();
    updateMaxRowSpan();
    onMounted(() => {
      initVirtualScroll();
      updateFixedShadow();
      dealDefaultSorter();
    });
    function initDataSource(v = props.dataSource) {
      let dataSourceTemp = v.slice();
      if (isTreeData.value) {
        dataSourceTemp = flatTreeData(dataSourceTemp);
      }
      dataSourceCopy.value = dataSourceTemp;
    }
    function dealDefaultSorter() {
      if (!props.sortConfig.defaultSort) return;
      const { key, dataIndex, order, silent } = { silent: false, ...props.sortConfig.defaultSort };
      setSorter(key || dataIndex, order, { force: false, silent });
    }
    function dealColumns() {
      const tableHeadersTemp = [];
      const tableHeadersForCalcTemp = [];
      let copyColumn = props.columns;
      if (isRelativeMode.value) {
        let leftCol = [];
        let centerCol = [];
        let rightCol = [];
        copyColumn.forEach((col) => {
          if (col.fixed === "left") {
            leftCol.push(col);
          } else if (col.fixed === "right") {
            rightCol.push(col);
          } else {
            centerCol.push(col);
          }
        });
        copyColumn = leftCol.concat(centerCol).concat(rightCol);
      }
      const maxDeep = howDeepTheHeader(copyColumn);
      if (maxDeep > 0 && props.virtualX) {
        console.error("StkTableVue:多级表头不支持横向虚拟滚动!");
      }
      for (let i = 0; i <= maxDeep; i++) {
        tableHeadersTemp[i] = [];
        tableHeadersForCalcTemp[i] = [];
      }
      function flat(arr, parent, depth = 0) {
        let allChildrenLen = 0;
        let allChildrenWidthSum = 0;
        arr.forEach((col) => {
          col.__PARENT__ = parent;
          let colChildrenLen = 1;
          let colWidth = 0;
          if (col.children) {
            const [len, widthSum] = flat(
              col.children,
              col,
              depth + 1
              /* , col.fixed */
            );
            colChildrenLen = len;
            colWidth = widthSum;
            tableHeadersForCalcTemp[depth].push(col);
          } else {
            colWidth = getColWidth(col);
            for (let i = depth; i <= maxDeep; i++) {
              tableHeadersForCalcTemp[i].push(col);
            }
          }
          col.__WIDTH__ = colWidth;
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
        });
        return [allChildrenLen, allChildrenWidthSum];
      }
      flat(copyColumn, null);
      tableHeaders.value = tableHeadersTemp;
      tableHeadersForCalc.value = tableHeadersForCalcTemp;
    }
    function updateDataSource(val) {
      if (!Array.isArray(val)) {
        console.warn("invalid dataSource");
        return;
      }
      let needInitVirtualScrollY = false;
      if (dataSourceCopy.value.length !== val.length) {
        needInitVirtualScrollY = true;
      }
      initDataSource(val);
      updateMaxRowSpan();
      if (needInitVirtualScrollY) {
        nextTick(() => initVirtualScrollY());
      }
      const sortColValue = sortCol.value;
      if (!isEmptyValue(sortColValue) && !props.sortRemote) {
        const colKey = colKeyGen.value;
        const column = tableHeaderLast.value.find((it) => colKey(it) === sortColValue);
        onColumnSort(column, false);
      }
    }
    function rowKeyGen(row) {
      if (!row) return row;
      let key = rowKeyGenCache.get(row) || row.__ROW_K__;
      if (!key) {
        key = rowKeyGenComputed.value(row);
        if (key === void 0) {
          key = Math.random().toString(36).slice(2);
        }
        rowKeyGenCache.set(row, key);
      }
      return key;
    }
    function cellKeyGen(row, col) {
      return rowKeyGen(row) + CELL_KEY_SEPARATE + colKeyGen.value(col);
    }
    const cellStyleMap = computed(() => {
      const thMap = /* @__PURE__ */ new Map();
      const tdMap = /* @__PURE__ */ new Map();
      const { virtualX, colResizable } = props;
      tableHeaders.value.forEach((cols, depth) => {
        cols.forEach((col) => {
          const width = virtualX ? getCalculatedColWidth(col) + "px" : transformWidthToStr(col.width);
          const style = {
            width
          };
          if (colResizable) {
            style.minWidth = width;
            style.maxWidth = width;
          } else {
            style.minWidth = transformWidthToStr(col.minWidth) ?? width;
            style.maxWidth = transformWidthToStr(col.maxWidth) ?? width;
          }
          const colKey = colKeyGen.value(col);
          thMap.set(colKey, Object.assign({}, style, getFixedStyle(TagType.TH, col, depth)));
          tdMap.set(colKey, Object.assign({}, style, getFixedStyle(TagType.TD, col, depth)));
        });
      });
      return {
        [TagType.TH]: thMap,
        [TagType.TD]: tdMap
      };
    });
    function getRowIndex(rowIndex) {
      return rowIndex + virtualScroll.value.startIndex;
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
      const rowIndex = getRowIndex(index);
      const rowKey = rowKeyGen(row);
      let classStr = props.rowClassName(row, rowIndex) || " " + ((row == null ? void 0 : row.__EXP__) ? "expanded" : "") + " " + ((row == null ? void 0 : row.__EXP_R__) ? "expanded-row" : "");
      if (currentRowKey.value === rowKey || row === currentRow.value) {
        classStr += " active";
      }
      if (props.showTrHoverClass && (rowKey === currentHoverRowKey.value || row === currentHoverRow)) {
        classStr += " hover";
      }
      const result = {
        id: stkTableId + "-" + rowKey,
        "data-row-key": rowKey,
        "data-row-i": rowIndex,
        class: classStr,
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
      return {
        "data-col-key": colKey,
        draggable: Boolean(isHeaderDraggable(col)),
        rowspan: virtualX_on.value ? 1 : col.__R_SP__,
        colspan: col.__C_SP__,
        style: cellStyleMap.value[TagType.TH].get(colKey),
        title: getHeaderTitle(col),
        class: [
          col.sorter ? "sortable" : "",
          colKey === sortCol.value && sortOrderIndex.value !== 0 && "sorter-" + sortSwitchOrder[sortOrderIndex.value],
          col.headerClassName,
          fixedColClassMap.value.get(colKey),
          col.headerAlign && (col.headerAlign === "left" ? "cell-text-l" : col.headerAlign === "right" ? "cell-text-r" : null)
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
      const classList = [
        col.className,
        fixedColClassMap.value.get(colKey),
        col.align && (col.align === "center" ? "cell-text-c" : col.align === "right" ? "cell-text-r" : null)
      ];
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
        ...mergeCellsWrapper(row, col, rowIndex, colIndex)
      };
    }
    function onColumnSort(col, click = true, options = {}) {
      if (!col) {
        console.warn("onColumnSort: not found col:", col);
        return;
      }
      if (!col.sorter && click) {
        return;
      }
      options = { force: false, emit: false, ...options };
      const colKey = colKeyGen.value(col);
      if (sortCol.value !== colKey) {
        sortCol.value = colKey;
        sortOrderIndex.value = 0;
      }
      const prevOrder = sortSwitchOrder[sortOrderIndex.value];
      if (click) sortOrderIndex.value++;
      sortOrderIndex.value = sortOrderIndex.value % 3;
      let order = sortSwitchOrder[sortOrderIndex.value];
      const sortConfig = { ...DEFAULT_SORT_CONFIG, ...props.sortConfig, ...col.sortConfig };
      const { defaultSort } = sortConfig;
      const colKeyGenValue = colKeyGen.value;
      if (!order && defaultSort) {
        const defaultColKey = defaultSort.key || defaultSort.dataIndex;
        if (!defaultColKey) {
          console.error("sortConfig.defaultSort key or dataIndex is required");
          return;
        }
        if (colKey === defaultColKey && prevOrder === defaultSort.order) {
          order = sortSwitchOrder.find((o) => o !== defaultSort.order && o);
        } else {
          order = defaultSort.order;
        }
        sortOrderIndex.value = sortSwitchOrder.indexOf(order);
        sortCol.value = defaultColKey;
        col = null;
        for (const row of tableHeaders.value) {
          const c = row.find((item) => colKeyGenValue(item) === defaultColKey);
          if (c) {
            col = c;
            break;
          }
        }
      }
      let dataSourceTemp = props.dataSource.slice();
      if (!props.sortRemote || options.force) {
        const sortOption = col || defaultSort;
        if (sortOption) {
          dataSourceTemp = tableSort(sortOption, order, dataSourceTemp, sortConfig);
          dataSourceCopy.value = isTreeData.value ? flatTreeData(dataSourceTemp) : dataSourceTemp;
        }
      }
      if (click || options.emit) {
        emits("sort-change", col, order, toRaw(dataSourceTemp), sortConfig);
      }
    }
    function onRowClick(e) {
      var _a, _b;
      const rowIndex = getClosestTrIndex(e);
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
      const rowIndex = getClosestTrIndex(e);
      const row = dataSourceCopy.value[rowIndex];
      if (!row) return;
      emits("row-dblclick", e, row, { rowIndex });
    }
    function onHeaderMenu(e) {
      emits("header-row-menu", e);
    }
    function onRowMenu(e) {
      const rowIndex = getClosestTrIndex(e);
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
      const rowIndex = getClosestTrIndex(e);
      const row = dataSourceCopy.value[rowIndex];
      if (!row) return;
      const colKey = getClosestColKey(e);
      const col = tableHeaderLast.value.find((item) => colKeyGen.value(item) === colKey);
      if (!col) return;
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
      const rowIndex = getClosestTrIndex(e) || 0;
      const row = dataSourceCopy.value[rowIndex];
      const colKey = getClosestColKey(e);
      const col = tableHeaderLast.value.find((item) => colKeyGen.value(item) === colKey);
      return { row, col, rowIndex };
    }
    function onHeaderCellClick(e, col) {
      onColumnSort(col);
      emits("header-cell-click", e, col);
    }
    function onCellMouseEnter(e) {
      const { row, col } = getCellEventData(e);
      emits("cell-mouseenter", e, row, col);
    }
    function onCellMouseLeave(e) {
      const { row, col } = getCellEventData(e);
      emits("cell-mouseleave", e, row, col);
    }
    function onCellMouseOver(e) {
      const { row, col } = getCellEventData(e);
      emits("cell-mouseover", e, row, col);
    }
    function onCellMouseDown(e) {
      const { row, col, rowIndex } = getCellEventData(e);
      emits("cell-mousedown", e, row, col, { rowIndex });
    }
    const [isWheeling, setIsWheeling] = useWheeling();
    function onTableWheel(e) {
      const sbEnabled = scrollbarOptions.value.enabled;
      if (props.smoothScroll && !sbEnabled) {
        return;
      }
      if (isColResizing.value) {
        e.stopPropagation();
        return;
      }
      const dom = tableContainerRef.value;
      if (!dom) return;
      const { deltaY, deltaX, shiftKey } = e;
      if (virtual_on.value && deltaY && !shiftKey) {
        const { containerHeight, scrollTop, scrollHeight } = virtualScroll.value;
        const isScrollBottom = scrollHeight - containerHeight - scrollTop < 10;
        if (deltaY > 0 && !isScrollBottom || deltaY < 0 && scrollTop > 0) {
          setIsWheeling(true);
          e.preventDefault();
        }
        if (isWheeling()) {
          e.preventDefault();
        }
        dom.scrollTop += deltaY;
      }
      if (virtualX_on.value) {
        const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
        const isScrollRight = scrollWidth - containerWidth - scrollLeft < 10;
        let distance = deltaX;
        if (shiftKey && deltaY) {
          distance = deltaY;
        }
        if (distance > 0 && !isScrollRight || distance < 0 && scrollLeft > 0) {
          setIsWheeling(true);
          e.preventDefault();
        }
        if (isWheeling()) {
          e.preventDefault();
        }
        dom.scrollLeft += distance;
      }
    }
    function onTableScroll(e) {
      if (!(e == null ? void 0 : e.target)) return;
      const { scrollTop, scrollLeft } = e.target;
      const { scrollTop: vScrollTop } = virtualScroll.value;
      const { scrollLeft: vScrollLeft } = virtualScrollX.value;
      const isYScroll = scrollTop !== vScrollTop;
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
    }
    function onTrMouseOver(e) {
      const tr = getClosestTr(e);
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
    function onTrMouseLeave(e) {
      if (e.target.tagName !== "TR") return;
      currentHoverRow = null;
      if (props.showTrHoverClass) {
        currentHoverRowKey.value = null;
      }
      if (props.rowHover) {
        updateHoverMergedCells(void 0);
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
    function setSorter(colKey, order, option = {}) {
      var _a;
      const newOption = { silent: true, sortOption: null, sort: true, ...option };
      sortCol.value = colKey;
      sortOrderIndex.value = sortSwitchOrder.indexOf(order);
      const colKeyGenValue = colKeyGen.value;
      if (newOption.sort && ((_a = dataSourceCopy.value) == null ? void 0 : _a.length)) {
        const column = newOption.sortOption || tableHeaderLast.value.find((it) => colKeyGenValue(it) === sortCol.value);
        if (column) onColumnSort(column, false, { force: option.force ?? true, emit: !newOption.silent });
        else console.warn("Can not find column by key:", sortCol.value);
      }
      return dataSourceCopy.value;
    }
    function resetSorter() {
      sortCol.value = void 0;
      sortOrderIndex.value = 0;
      dataSourceCopy.value = props.dataSource.slice();
    }
    function scrollTo(top = 0, left = 0) {
      if (!tableContainerRef.value) return;
      if (top !== null) tableContainerRef.value.scrollTop = top;
      if (left !== null) tableContainerRef.value.scrollLeft = left;
    }
    function getTableData() {
      return toRaw(dataSourceCopy.value);
    }
    function getSortColumns() {
      const sortOrder = sortSwitchOrder[sortOrderIndex.value];
      if (!sortOrder) return [];
      return [{ key: sortCol.value, order: sortOrder }];
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
      setTreeExpand
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
          "scrollbar-on": unref(scrollbarOptions).enabled
        }]),
        style: normalizeStyle({
          "--row-height": props.autoRowHeight ? void 0 : unref(virtualScroll).rowHeight + "px",
          "--header-row-height": props.headerRowHeight + "px",
          "--highlight-duration": props.highlightConfig.duration && props.highlightConfig.duration + "s",
          "--highlight-timing-function": unref(highlightSteps) ? `steps(${unref(highlightSteps)})` : null,
          "--sb-width": `${unref(scrollbarOptions).width}px`,
          "--sb-height": `${unref(scrollbarOptions).height}px`
        }),
        onScroll: onTableScroll,
        onWheel: onTableWheel
      }, [
        SRBRTotalHeight.value ? (openBlock(), createElementBlock("div", {
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
        createElementVNode("div", _hoisted_1, [
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
            !__props.headless ? (openBlock(), createElementBlock("thead", _hoisted_2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(tableHeaders.value, (row, rowIndex) => {
                return openBlock(), createElementBlock("tr", {
                  key: rowIndex,
                  onContextmenu: _cache[3] || (_cache[3] = ($event) => onHeaderMenu($event))
                }, [
                  unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                    key: 0,
                    class: "vt-x-left",
                    style: normalizeStyle(`min-width:${unref(virtualScrollX).offsetLeft}px;width:${unref(virtualScrollX).offsetLeft}px`)
                  }, null, 4)) : createCommentVNode("", true),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_on) && rowIndex === tableHeaders.value.length - 1 ? unref(virtualX_columnPart) : row, (col, colIndex) => {
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
                      }, null, 40, _hoisted_4)) : createCommentVNode("", true),
                      createElementVNode("div", {
                        class: "table-header-cell-wrapper",
                        style: normalizeStyle(unref(virtualX_on) ? null : col.__R_SP__ ? `--row-span:${col.__R_SP__}` : null)
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
                          createElementVNode("span", _hoisted_5, toDisplayString(col.title), 1)
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
                      }, null, 40, _hoisted_6)) : createCommentVNode("", true)
                    ], 16, _hoisted_3);
                  }), 128)),
                  unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                    key: 1,
                    class: "vt-x-right",
                    style: normalizeStyle(`min-width:${unref(virtualX_offsetRight)}px;width:${unref(virtualX_offsetRight)}px`)
                  }, null, 4)) : createCommentVNode("", true)
                ], 32);
              }), 128))
            ])) : createCommentVNode("", true),
            createElementVNode("tbody", {
              class: "stk-tbody-main",
              onClick: onCellClick,
              onMousedown: onCellMouseDown,
              onMouseover: onCellMouseOver
            }, [
              unref(virtual_on) && !unref(isSRBRActive) ? (openBlock(), createElementBlock("tr", {
                key: 0,
                style: normalizeStyle(`height:${unref(virtualScroll).offsetTop}px`),
                class: "padding-top-tr"
              }, [
                unref(virtualX_on) && __props.fixedMode && __props.headless ? (openBlock(), createElementBlock("td", _hoisted_7)) : createCommentVNode("", true),
                __props.fixedMode && __props.headless ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(unref(virtualX_columnPart), (col) => {
                  return openBlock(), createElementBlock("td", {
                    key: colKeyGen.value(col),
                    style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen.value(col)))
                  }, null, 4);
                }), 128)) : createCommentVNode("", true)
              ], 4)) : createCommentVNode("", true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtual_dataSourcePart), (row, rowIndex) => {
                return openBlock(), createElementBlock("tr", mergeProps({
                  ref_for: true,
                  ref_key: "trRef",
                  ref: trRef,
                  key: rowKeyGen(row)
                }, { ref_for: true }, getTRProps(row, rowIndex), {
                  onDrop: ($event) => unref(onTrDrop)($event, getRowIndex(rowIndex)),
                  onMouseleave: onTrMouseLeave
                }), [
                  unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_9)) : createCommentVNode("", true),
                  row && row.__EXP_R__ ? (openBlock(), createElementBlock("td", {
                    key: 1,
                    colspan: unref(virtualX_columnPart).length
                  }, [
                    createElementVNode("div", _hoisted_11, [
                      renderSlot(_ctx.$slots, "expand", {
                        row: row.__EXP_R__,
                        col: row.__EXP_C__
                      }, () => {
                        var _a;
                        return [
                          createTextVNode(toDisplayString(((_a = row.__EXP_R__) == null ? void 0 : _a[row.__EXP_C__.dataIndex]) ?? ""), 1)
                        ];
                      })
                    ])
                  ], 8, _hoisted_10)) : (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(unref(virtualX_columnPart), (col, colIndex) => {
                    var _a;
                    return openBlock(), createElementBlock(Fragment, null, [
                      !((_a = unref(hiddenCellMap)[rowKeyGen(row)]) == null ? void 0 : _a.has(colKeyGen.value(col))) ? (openBlock(), createElementBlock("td", mergeProps({
                        key: colKeyGen.value(col)
                      }, { ref_for: true }, getTDProps(row, col, rowIndex, colIndex), {
                        onMouseenter: onCellMouseEnter,
                        onMouseleave: onCellMouseLeave
                      }), [
                        col.customCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customCell), {
                          key: 0,
                          class: "table-cell-wrapper",
                          col,
                          row,
                          rowIndex: getRowIndex(rowIndex),
                          colIndex,
                          cellValue: row && row[col.dataIndex],
                          expanded: row && row.__EXP__,
                          "tree-expanded": row && row.__T_EXP__
                        }, {
                          stkFoldIcon: withCtx(() => [
                            createVNode(TriangleIcon, {
                              onClick: ($event) => triangleClick($event, row, col)
                            }, null, 8, ["onClick"])
                          ]),
                          stkDragIcon: withCtx(() => [
                            createVNode(DragHandle, {
                              onDragstart: ($event) => unref(onTrDragStart)($event, getRowIndex(rowIndex))
                            }, null, 8, ["onDragstart"])
                          ]),
                          _: 2
                        }, 1032, ["col", "row", "rowIndex", "colIndex", "cellValue", "expanded", "tree-expanded"])) : (openBlock(), createElementBlock("div", {
                          key: 1,
                          class: "table-cell-wrapper",
                          title: col.type !== "seq" ? row == null ? void 0 : row[col.dataIndex] : "",
                          style: normalizeStyle(col.type === "tree-node" && row.__T_LV__ ? `padding-left:${row.__T_LV__ * 16}px` : null)
                        }, [
                          col.type === "seq" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                            createTextVNode(toDisplayString((props.seqConfig.startIndex || 0) + getRowIndex(rowIndex) + 1), 1)
                          ], 64)) : col.type === "dragRow" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                            createVNode(DragHandle, {
                              onDragstart: ($event) => unref(onTrDragStart)($event, getRowIndex(rowIndex))
                            }, null, 8, ["onDragstart"]),
                            createElementVNode("span", null, toDisplayString((row == null ? void 0 : row[col.dataIndex]) ?? ""), 1)
                          ], 64)) : col.type === "expand" || col.type === "tree-node" ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                            col.type === "expand" || col.type === "tree-node" && row.children !== void 0 ? (openBlock(), createBlock(TriangleIcon, {
                              key: 0,
                              onClick: ($event) => triangleClick($event, row, col)
                            }, null, 8, ["onClick"])) : createCommentVNode("", true),
                            createElementVNode("span", {
                              style: normalizeStyle(col.type === "tree-node" && !row.children ? "padding-left: 16px;" : null)
                            }, toDisplayString((row == null ? void 0 : row[col.dataIndex]) ?? ""), 5)
                          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 3 }, [
                            createTextVNode(toDisplayString((row == null ? void 0 : row[col.dataIndex]) ?? getEmptyCellText.value(col, row)), 1)
                          ], 64))
                        ], 12, _hoisted_12))
                      ], 16)) : createCommentVNode("", true)
                    ], 64);
                  }), 256)),
                  unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_13)) : createCommentVNode("", true)
                ], 16, _hoisted_8);
              }), 128)),
              unref(virtual_on) && !unref(isSRBRActive) ? (openBlock(), createElementBlock("tr", {
                key: 1,
                style: normalizeStyle(`height: ${unref(virtual_offsetBottom)}px`)
              }, null, 4)) : createCommentVNode("", true),
              SRBRBottomHeight.value ? (openBlock(), createElementBlock("tr", {
                key: 2,
                style: normalizeStyle(`height: ${SRBRBottomHeight.value}px`)
              }, null, 4)) : createCommentVNode("", true)
            ], 32)
          ], 38),
          unref(scrollbarOptions).enabled && unref(showScrollbar).y ? (openBlock(), createElementBlock("div", {
            key: 0,
            ref: "verticalScrollbarRef",
            class: "stk-sb-thumb vertical",
            style: normalizeStyle({
              height: `${unref(scrollbar).h}px`,
              transform: `translateY(${unref(scrollbar).top}px)`
            }),
            onMousedown: _cache[7] || (_cache[7] = //@ts-ignore
            (...args) => unref(onVerticalScrollbarMouseDown) && unref(onVerticalScrollbarMouseDown)(...args)),
            onTouchstart: _cache[8] || (_cache[8] = //@ts-ignore
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
        unref(scrollbarOptions).enabled && unref(showScrollbar).x ? (openBlock(), createElementBlock("div", {
          key: 3,
          ref: "horizontalScrollbarRef",
          class: "stk-sb-thumb horizontal",
          style: normalizeStyle({
            width: `${unref(scrollbar).w}px`,
            transform: `translateX(${unref(scrollbar).left}px)`
          }),
          onMousedown: _cache[9] || (_cache[9] = //@ts-ignore
          (...args) => unref(onHorizontalScrollbarMouseDown) && unref(onHorizontalScrollbarMouseDown)(...args)),
          onTouchstart: _cache[10] || (_cache[10] = //@ts-ignore
          (...args) => unref(onHorizontalScrollbarMouseDown) && unref(onHorizontalScrollbarMouseDown)(...args))
        }, null, 36)) : createCommentVNode("", true)
      ], 38);
    };
  }
});
export {
  _sfc_main as StkTable,
  binarySearch,
  insertToOrderedArray,
  strCompare,
  tableSort
};
