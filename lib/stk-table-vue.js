import { openBlock, createElementBlock, createElementVNode, watch, onMounted, onBeforeUnmount, ref, computed, shallowRef, defineComponent, nextTick, toRaw, normalizeClass, unref, normalizeStyle, createCommentVNode, Fragment, renderList, createBlock, resolveDynamicComponent, toDisplayString, renderSlot, createVNode, createTextVNode } from "vue";
import { interpolateRgb } from "d3-interpolate";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {};
const _hoisted_1$2 = {
  class: "drag-row-handle",
  draggable: "true"
};
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("span", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createElementVNode("svg", {
      viewBox: "0 0 1024 1024",
      width: "16",
      height: "16",
      fill: "currentColor"
    }, [
      createElementVNode("path", { d: "M640 853.3a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m-256 0a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m256-256a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m-256 0a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m256-256a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3zM384 341.3a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z" })
    ], -1)
  ]));
}
const DragHandle = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1]]);
const _sfc_main$1 = {};
const _hoisted_1$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16"
};
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
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
  ]));
}
const SortIcon = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
function isEmptyValue(val, isNumber) {
  let isEmpty = val === null || val === void 0;
  if (isNumber) {
    isEmpty = isEmpty || typeof val === "boolean" || Number.isNaN(+val);
  }
  return isEmpty;
}
function insertToOrderedArray(sortState, newItem, targetArray, sortConfig = {}) {
  const { dataIndex, order } = sortState;
  sortConfig = { emptyToBottom: false, ...sortConfig };
  let { sortType } = sortState;
  if (!sortType) sortType = typeof newItem[dataIndex];
  const data = [...targetArray];
  if (!order || !data.length) {
    data.unshift(newItem);
    return data;
  }
  if (sortConfig.emptyToBottom && isEmptyValue(newItem)) {
    data.push(newItem);
  }
  const isNumber = sortType === "number";
  const targetVal = newItem[dataIndex];
  const sIndex = binarySearch(data, (midIndex) => {
    const midVal = data[midIndex][dataIndex];
    const compareRes = strCompare(midVal, targetVal, isNumber, sortConfig.stringLocaleCompare);
    return order === "asc" ? compareRes : -compareRes;
  });
  data.splice(sIndex, 0, newItem);
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
  sortConfig = { emptyToBottom: false, ...sortConfig };
  let targetDataSource = [...dataSource];
  let sortField = sortOption.sortField || sortOption.dataIndex;
  if (!order && sortConfig.defaultSort) {
    order = sortConfig.defaultSort.order;
    sortField = sortConfig.defaultSort.dataIndex;
  }
  if (typeof sortOption.sorter === "function") {
    const customSorterData = sortOption.sorter(targetDataSource, { order, column: sortOption });
    if (customSorterData) targetDataSource = customSorterData;
  } else if (order) {
    let { sortType } = sortOption;
    if (!sortType) sortType = typeof dataSource[0][sortField];
    const isNumber = sortType === "number";
    const [valueArr, emptyArr] = separatedData(sortOption, targetDataSource, isNumber);
    if (order === "asc") {
      valueArr.sort((a, b) => strCompare(a[sortField], b[sortField], isNumber, sortConfig.stringLocaleCompare));
    } else {
      valueArr.sort((a, b) => strCompare(b[sortField], a[sortField], isNumber, sortConfig.stringLocaleCompare));
    }
    if (order === "desc" || sortConfig.emptyToBottom) {
      targetDataSource = [...valueArr, ...emptyArr];
    } else {
      targetDataSource = [...emptyArr, ...valueArr];
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
const DEFAULT_COL_WIDTH = "100";
const DEFAULT_TABLE_HEIGHT = 100;
const DEFAULT_TABLE_WIDTH = 200;
const DEFAULT_ROW_HEIGHT = 28;
const HIGHLIGHT_COLOR = {
  light: { from: "#71a2fd", to: "#fff" },
  dark: { from: "#1e4c99", to: "#181c21" }
};
const HIGHLIGHT_DURATION = 2e3;
const HIGHLIGHT_FREQ = 1e3 / 30;
const HIGHLIGHT_ROW_CLASS = "highlight-row";
const HIGHLIGHT_CELL_CLASS = "highlight-cell";
const _chromeVersion = getBrowsersVersion("chrome");
const _firefoxVersion = getBrowsersVersion("firefox");
const IS_LEGACY_MODE = _chromeVersion < 56 || _firefoxVersion < 59;
const DEFAULT_SMOOTH_SCROLL = _chromeVersion < 85;
const STK_ID_PREFIX = "stk";
const EXPANDED_ROW_KEY_PREFIX = "expanded-";
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
  return (col == null ? void 0 : col.__WIDTH__) ?? +DEFAULT_COL_WIDTH;
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
    const colIndex = tableHeaderLastValue.findIndex((it) => colKeyGen.value(it) === colKeyGen.value(col));
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
    const curCol = tableHeaderLast.value.find((it) => colKeyGen.value(it) === colKeyGen.value(lastCol));
    if (!curCol) return;
    curCol.width = width + "px";
    emits("update:columns", [...props.columns]);
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
      const lastChild = column.children.at(-1);
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
    tableHeaders.value.forEach((cols) => {
      cols.forEach((col) => {
        const showShadow = props.fixedColShadow && col.fixed && fixedShadowColsValue.includes(col);
        const classObj = {
          "fixed-cell": col.fixed,
          ["fixed-cell--" + col.fixed]: col.fixed,
          "fixed-cell--shadow": showShadow,
          ["fixed-cell--active"]: fixedCols.value.includes(col)
          // 表示该列正在被固定
        };
        colMap.set(colKeyGen.value(col), classObj);
      });
    });
    return colMap;
  });
  function updateFixedShadow(virtualScrollX) {
    const fixedColsTemp = [];
    let clientWidth, scrollLeft;
    if (virtualScrollX == null ? void 0 : virtualScrollX.value) {
      const {
        containerWidth: cw,
        /* scrollWidth: sw, */
        scrollLeft: sl
      } = virtualScrollX.value;
      clientWidth = cw;
      scrollLeft = sl;
    } else {
      const {
        clientWidth: cw,
        /* scrollWidth: sw, */
        scrollLeft: sl
      } = tableContainerRef.value;
      clientWidth = cw;
      scrollLeft = sl;
    }
    const leftShadowCol = [];
    const rightShadowCol = [];
    tableHeadersForCalc.value.forEach((row, level) => {
      let left = 0;
      row.forEach((col) => {
        const position = getFixedColPosition.value(col);
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
      fixedShadowCols.value = [...leftShadowCol, ...rightShadowCol].filter(Boolean);
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
    const isFixedLeft = fixed === "left";
    if (tagType === TagType.TH) {
      if (isRelativeMode.value) {
        style.top = virtualScroll.value.scrollTop + "px";
      } else {
        const rowHeight = props.headerRowHeight ?? props.rowHeight;
        style.top = depth * rowHeight + "px";
      }
    }
    const { scrollLeft, scrollWidth, offsetLeft, containerWidth } = virtualScrollX.value;
    const scrollRight = scrollWidth - containerWidth - scrollLeft;
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
    tableHeadersForCalc.value.forEach((cols) => {
      let left = 0;
      let rightStartIndex = 0;
      for (let i = 0; i < cols.length; i++) {
        const item = cols[i];
        if (item.fixed === "left") {
          const colKey = colKeyGen.value(item);
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
        const colKey = colKeyGen.value(item);
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
      const colKey = colKeyGen.value(col);
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
  const highlightDuration = config.duration ? config.duration * 1e3 : HIGHLIGHT_DURATION;
  const highlightFrequency = config.fps && config.fps > 0 ? 1e3 / config.fps : null;
  const highlightSteps = highlightFrequency ? Math.round(highlightDuration / highlightFrequency) : null;
  const highlightFrom = computed(() => highlightColor[props.theme].from);
  const highlightTo = computed(() => highlightColor[props.theme].to);
  const highlightInter = computed(() => interpolateRgb(highlightFrom.value, highlightTo.value));
  const highlightDimRowsJs = /* @__PURE__ */ new Map();
  let calcHighlightDimLoopJs = false;
  const highlightDimRowsAnimation = /* @__PURE__ */ new Map();
  let calcHighlightDimLoopAnimation = false;
  const highlightDimRowsTimeout = /* @__PURE__ */ new Map();
  const highlightDimCellsTimeout = /* @__PURE__ */ new Map();
  const defaultHighlightDimOption = (() => {
    const keyframe = { backgroundColor: [highlightFrom.value, ""] };
    if (highlightSteps) {
      keyframe.easing = `steps(${highlightSteps})`;
    }
    return { duration: highlightDuration, keyframe };
  })();
  function calcRowHighlightLoop() {
    if (calcHighlightDimLoopAnimation) return;
    calcHighlightDimLoopAnimation = true;
    const recursion = () => {
      window.requestAnimationFrame(
        () => {
          const nowTs = Date.now();
          highlightDimRowsAnimation.forEach((store, rowKeyValue) => {
            const { ts, duration } = store;
            const timeOffset = nowTs - ts;
            if (nowTs - ts < duration) {
              updateRowAnimation(rowKeyValue, store, timeOffset);
            } else {
              highlightDimRowsAnimation.delete(rowKeyValue);
            }
          });
          if (highlightDimRowsAnimation.size > 0) {
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
  function calcRowHighlightLoopJs() {
    if (calcHighlightDimLoopJs) return;
    calcHighlightDimLoopJs = true;
    const recursion = () => {
      window.setTimeout(() => {
        const nowTs = Date.now();
        highlightDimRowsJs.forEach((highlightStart, rowKeyValue) => {
          const progress = (nowTs - highlightStart) / highlightDuration;
          let bgc = "";
          if (0 <= progress && progress <= 1) {
            bgc = highlightInter.value(progress);
          } else {
            highlightDimRowsJs.delete(rowKeyValue);
          }
          updateRowBgcJs(rowKeyValue, bgc);
        });
        if (highlightDimRowsJs.size > 0) {
          recursion();
        } else {
          calcHighlightDimLoopJs = false;
          highlightDimRowsJs.clear();
        }
      }, highlightFrequency || HIGHLIGHT_FREQ);
    };
    recursion();
  }
  function setHighlightDimCell(rowKeyValue, colKeyValue, option = {}) {
    var _a;
    const cellEl = (_a = tableContainerRef.value) == null ? void 0 : _a.querySelector(`[data-cell-key="${rowKeyValue}--${colKeyValue}"]`);
    const { className, method, duration, keyframe } = {
      className: HIGHLIGHT_CELL_CLASS,
      method: "animation",
      ...defaultHighlightDimOption,
      ...option
    };
    if (!cellEl) return;
    if (method === "animation") {
      cellEl.animate(keyframe, duration);
    } else {
      highlightCellsInCssKeyFrame(cellEl, rowKeyValue, className, duration);
    }
  }
  function setHighlightDimRow(rowKeyValues, option = {}) {
    if (!Array.isArray(rowKeyValues)) rowKeyValues = [rowKeyValues];
    const { className, method, keyframe, duration } = {
      className: HIGHLIGHT_ROW_CLASS,
      method: "animation",
      ...defaultHighlightDimOption,
      ...option
    };
    if (method === "css") {
      highlightRowsInCssKeyframe(rowKeyValues, className, duration);
    } else if (method === "animation") {
      if (props.virtual) {
        const nowTs = Date.now();
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
    } else if (method === "js") {
      const nowTs = Date.now();
      for (let i = 0; i < rowKeyValues.length; i++) {
        const rowKeyValue = rowKeyValues[i];
        highlightDimRowsJs.set(rowKeyValue, nowTs);
        updateRowBgcJs(rowKeyValue, highlightFrom.value);
      }
      calcRowHighlightLoopJs();
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
    const { visible, keyframe, duration: initialDuration } = store;
    if (!rowEl) {
      if (visible) {
        store.visible = false;
      }
      return;
    }
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
  function updateRowBgcJs(rowKeyValue, color) {
    const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValue));
    if (!rowEl) return;
    rowEl.style.backgroundColor = color;
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
    if (!ScrollCodesValues.includes(e.code)) return;
    if (!isMouseOver) return;
    e.preventDefault();
    const { scrollTop, rowHeight, containerHeight } = virtualScroll.value;
    const { scrollLeft } = virtualScrollX.value;
    const { headless, headerRowHeight } = props;
    const headerHeight = headless ? 0 : tableHeaders.value.length * (headerRowHeight || rowHeight);
    const bodyPageSize = Math.floor((containerHeight - headerHeight) / rowHeight);
    if (e.code === "ArrowUp") {
      scrollTo(scrollTop - rowHeight, null);
    } else if (e.code === "ArrowRight") {
      scrollTo(null, scrollLeft + rowHeight);
    } else if (e.code === "ArrowDown") {
      scrollTo(scrollTop + rowHeight, null);
    } else if (e.code === "ArrowLeft") {
      scrollTo(null, scrollLeft - rowHeight);
    } else if (e.code === "PageUp") {
      scrollTo(scrollTop - rowHeight * bodyPageSize + headerHeight, null);
    } else if (e.code === "PageDown") {
      scrollTo(scrollTop + rowHeight * bodyPageSize - headerHeight, null);
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
      const columns = [...props.columns];
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
  function getClosestTr(e) {
    const target = e.target;
    const tr = target == null ? void 0 : target.closest("tr");
    return tr;
  }
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
      const dataSourceTemp = [...dataSourceCopy.value];
      const sourceRow = dataSourceTemp[sourceIndex];
      if (mode === "swap") {
        dataSourceTemp[sourceIndex] = dataSourceTemp[endIndex];
        dataSourceTemp[endIndex] = sourceRow;
      } else {
        dataSourceTemp.splice(sourceIndex, 1);
        dataSourceTemp.splice(endIndex, 0, sourceRow);
      }
      dataSourceCopy.value = [...dataSourceTemp];
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
const VUE2_SCROLL_TIMEOUT_MS = 200;
function useVirtualScroll({
  props,
  tableContainerRef,
  trRef,
  dataSourceCopy,
  tableHeaderLast,
  tableHeaders,
  rowKeyGen
}) {
  const tableHeaderHeight = ref(props.headerRowHeight);
  const virtualScroll = ref({
    containerHeight: 0,
    rowHeight: props.rowHeight,
    pageSize: 10,
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
    return props.virtual && dataSourceCopy.value.length > virtualScroll.value.pageSize * 2;
  });
  const virtual_dataSourcePart = computed(() => {
    if (!virtual_on.value) return dataSourceCopy.value;
    const { startIndex, endIndex } = virtualScroll.value;
    return dataSourceCopy.value.slice(startIndex, endIndex + 1);
  });
  const virtual_offsetBottom = computed(() => {
    if (!virtual_on.value) return 0;
    const { startIndex, rowHeight } = virtualScroll.value;
    return (dataSourceCopy.value.length - startIndex - virtual_dataSourcePart.value.length) * rowHeight;
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
  function getTableHeaderHeight() {
    const { headerRowHeight } = props;
    return headerRowHeight * tableHeaders.value.length;
  }
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
    if (!virtual_on.value) return;
    const { offsetHeight, scrollHeight } = tableContainerRef.value || {};
    let scrollTop = ((_a = tableContainerRef.value) == null ? void 0 : _a.scrollTop) || 0;
    const { rowHeight } = virtualScroll.value;
    const containerHeight = height || offsetHeight || DEFAULT_TABLE_HEIGHT;
    const { headless } = props;
    let pageSize = Math.ceil(containerHeight / rowHeight);
    const headerHeight = getTableHeaderHeight();
    tableHeaderHeight.value = headerHeight;
    if (!headless) {
      const headerToBodyRowHeightCount = Math.floor(headerHeight / rowHeight);
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
  const setAutoHeight = (rowKey, height) => {
    if (!height) {
      autoRowHeightMap.delete(rowKey);
    } else {
      autoRowHeightMap.set(rowKey, height);
    }
  };
  const clearAllAutoHeight = () => {
    autoRowHeightMap.clear();
  };
  const getAutoRowHeight = (row) => {
    var _a;
    const rowKey = String(rowKeyGen(row));
    const storedHeight = autoRowHeightMap.get(rowKey);
    let expectedHeight;
    if (storedHeight) {
      return storedHeight;
    }
    if (expectedHeight = (_a = props.autoRowHeight) == null ? void 0 : _a.expectedHeight) {
      if (typeof expectedHeight === "function") {
        return expectedHeight(row);
      } else {
        return expectedHeight;
      }
    }
    return props.rowHeight || DEFAULT_ROW_HEIGHT;
  };
  const createGetRowHeightFn = () => {
    var _a;
    if (props.autoRowHeight) {
      return (row) => getAutoRowHeight(row);
    }
    if (hasExpandCol.value) {
      const { rowHeight } = virtualScroll.value;
      const expandedRowHeight = ((_a = props.expandConfig) == null ? void 0 : _a.height) || rowHeight;
      return (row) => row.__EXPANDED_ROW__ ? expandedRowHeight : rowHeight;
    }
    return () => props.rowHeight || DEFAULT_ROW_HEIGHT;
  };
  function updateVirtualScrollY(sTop = 0) {
    var _a;
    const { rowHeight, pageSize, scrollTop, startIndex: oldStartIndex, endIndex: oldEndIndex } = virtualScroll.value;
    virtualScroll.value.scrollTop = sTop;
    if (!virtual_on.value) {
      return;
    }
    const dataSourceCopyTemp = dataSourceCopy.value;
    const { autoRowHeight, stripe, optimizeVue2Scroll } = props;
    let startIndex = 0;
    let autoRowHeightTop = 0;
    let getRowHeight = null;
    const dataLength = dataSourceCopyTemp.length;
    if (autoRowHeight || hasExpandCol.value) {
      if (autoRowHeight) {
        (_a = trRef.value) == null ? void 0 : _a.forEach((tr) => {
          const { rowKey } = tr.dataset;
          if (!rowKey || autoRowHeightMap.has(rowKey)) return;
          autoRowHeightMap.set(rowKey, tr.offsetHeight);
        });
      }
      getRowHeight = createGetRowHeightFn();
      for (let i = 0; i < dataLength; i++) {
        const height = getRowHeight(dataSourceCopyTemp[i]);
        autoRowHeightTop += height;
        if (autoRowHeightTop >= sTop) {
          startIndex = i;
          autoRowHeightTop -= height;
          break;
        }
      }
    } else {
      startIndex = Math.floor(sTop / rowHeight);
    }
    let endIndex = startIndex + pageSize;
    if (stripe && startIndex > 0 && startIndex % 2) {
      startIndex -= 1;
      if (autoRowHeight || hasExpandCol.value) {
        const height = getRowHeight(dataSourceCopyTemp[startIndex]);
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
    const { scrollLeft } = virtualScrollX.value;
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
    const containerWidth = virtualScrollX.value.containerWidth - leftColWidthSum;
    let endIndex = headerLength;
    for (let colIndex = startIndex + 1; colIndex < headerLength; colIndex++) {
      const col = tableHeaderLastValue[colIndex];
      colWidthSum += getCalculatedColWidth(col);
      if (colWidthSum >= containerWidth) {
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
    initVirtualScroll,
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX,
    setAutoHeight,
    clearAllAutoHeight
  };
}
const _hoisted_1 = ["data-col-key", "draggable", "rowspan", "colspan", "title", "onClick"];
const _hoisted_2 = {
  key: 1,
  class: "table-header-title"
};
const _hoisted_3 = { class: "table-header-title" };
const _hoisted_4 = {
  key: 3,
  class: "table-header-sorter"
};
const _hoisted_5 = ["onMousedown"];
const _hoisted_6 = ["onMousedown"];
const _hoisted_7 = {
  key: 0,
  class: "vt-x-left"
};
const _hoisted_8 = ["id", "data-row-key", "onClick", "onDblclick", "onContextmenu", "onMouseover", "onDrop"];
const _hoisted_9 = {
  key: 0,
  class: "vt-x-left"
};
const _hoisted_10 = ["colspan"];
const _hoisted_11 = { class: "table-cell-wrapper" };
const _hoisted_12 = ["data-cell-key", "onClick", "onMouseenter", "onMouseleave", "onMouseover"];
const _hoisted_13 = ["title"];
const _hoisted_14 = { key: 1 };
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
    autoRowHeight: { type: Boolean, default: false },
    rowHover: { type: Boolean, default: true },
    rowActive: { type: Boolean, default: true },
    rowCurrentRevokable: { type: Boolean, default: true },
    headerRowHeight: { default: DEFAULT_ROW_HEIGHT },
    virtual: { type: Boolean, default: false },
    virtualX: { type: Boolean, default: false },
    columns: { default: () => [] },
    dataSource: { default: () => [] },
    rowKey: { type: [String, Number, Function], default: "" },
    colKey: { type: [String, Number, Function], default: "dataIndex" },
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
    headerDrag: { default: false },
    rowClassName: { type: Function, default: () => "" },
    colResizable: { type: Boolean, default: false },
    colMinWidth: { default: 10 },
    bordered: { type: [Boolean, String], default: true },
    autoResize: { type: [Boolean, Function], default: true },
    fixedColShadow: { type: Boolean, default: false },
    optimizeVue2Scroll: { type: Boolean, default: false },
    sortConfig: { default: () => ({
      emptyToBottom: false,
      stringLocaleCompare: false
    }) },
    hideHeaderTitle: { type: [Boolean, Array], default: false },
    highlightConfig: { default: () => ({}) },
    seqConfig: { default: () => ({}) },
    expandConfig: { default: () => ({}) },
    dragRowConfig: { default: () => ({}) },
    cellFixedMode: { default: "sticky" },
    smoothScroll: { type: Boolean, default: DEFAULT_SMOOTH_SCROLL }
  },
  emits: ["sort-change", "row-click", "current-change", "cell-selected", "row-dblclick", "header-row-menu", "row-menu", "cell-click", "cell-mouseenter", "cell-mouseleave", "cell-mouseover", "header-cell-click", "scroll", "scroll-x", "col-order-change", "th-drag-start", "th-drop", "row-order-change", "col-resize", "toggle-row-expand", "update:columns"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const stkTableId = createStkTableId();
    const props = __props;
    const emits = __emit;
    const tableContainerRef = ref();
    const theadRef = ref();
    const colResizeIndicatorRef = ref();
    const trRef = ref();
    const isRelativeMode = ref(IS_LEGACY_MODE ? true : props.cellFixedMode === "relative");
    const currentRow = shallowRef();
    const currentRowKey = ref(void 0);
    const currentSelectedCellKey = ref(void 0);
    let currentHoverRow = null;
    const currentHoverRowKey = ref(null);
    let sortCol = ref();
    let sortOrderIndex = ref(0);
    const sortSwitchOrder = [null, "desc", "asc"];
    const tableHeaders = shallowRef([]);
    const tableHeaderLast = shallowRef([]);
    const tableHeadersForCalc = shallowRef([]);
    const dataSourceCopy = shallowRef([...props.dataSource]);
    const colKeyGen = computed(() => {
      if (typeof props.colKey === "function") {
        return (col) => props.colKey(col);
      } else {
        return (col) => col ? col[props.colKey] : null;
      }
    });
    const getEmptyCellText = computed(() => {
      if (typeof props.emptyCellText === "string") {
        return () => props.emptyCellText;
      } else {
        return (col, row) => props.emptyCellText({ row, col });
      }
    });
    const rowKeyGenStore = /* @__PURE__ */ new WeakMap();
    const { onThDragStart, onThDragOver, onThDrop, isHeaderDraggable } = useThDrag({ props, emits, colKeyGen });
    const { onTrDragStart, onTrDrop, onTrDragOver, onTrDragEnd, onTrDragEnter } = useTrDrag({ props, emits, dataSourceCopy });
    const {
      virtualScroll,
      virtualScrollX,
      virtual_on,
      virtual_dataSourcePart,
      virtual_offsetBottom,
      virtualX_on,
      virtualX_columnPart,
      virtualX_offsetRight,
      initVirtualScroll,
      initVirtualScrollY,
      initVirtualScrollX,
      updateVirtualScrollY,
      updateVirtualScrollX,
      setAutoHeight,
      clearAllAutoHeight
    } = useVirtualScroll({ tableContainerRef, trRef, props, dataSourceCopy, tableHeaderLast, tableHeaders, rowKeyGen });
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
    watch(
      () => props.columns,
      () => {
        dealColumns();
        nextTick(() => {
          initVirtualScrollX();
          updateFixedShadow();
        });
      }
    );
    watch(
      () => props.virtual,
      () => {
        nextTick(() => {
          initVirtualScrollY();
        });
      }
    );
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
        if (!val) {
          console.warn("invalid dataSource");
          return;
        }
        let needInitVirtualScrollY = false;
        if (dataSourceCopy.value.length !== val.length) {
          needInitVirtualScrollY = true;
        }
        dataSourceCopy.value = [...val];
        if (needInitVirtualScrollY) {
          nextTick(() => initVirtualScrollY());
        }
        if (sortCol.value) {
          const column = tableHeaderLast.value.find((it) => colKeyGen.value(it) === sortCol.value);
          onColumnSort(column, false);
        }
      },
      {
        deep: false
      }
    );
    watch(
      () => props.fixedColShadow,
      () => updateFixedShadow()
    );
    dealColumns();
    onMounted(() => {
      initVirtualScroll();
      updateFixedShadow();
      dealDefaultSorter();
    });
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
        copyColumn = [...leftCol, ...centerCol, ...rightCol];
      }
      const maxDeep = howDeepTheHeader(copyColumn);
      const tempHeaderLast = [];
      if (maxDeep > 0 && props.virtualX) {
        console.error("多级表头不支持横向虚拟滚动");
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
            tempHeaderLast.push(col);
            for (let i = depth; i <= maxDeep; i++) {
              tableHeadersForCalcTemp[i].push(col);
            }
          }
          col.__WIDTH__ = colWidth;
          tableHeadersTemp[depth].push(col);
          const rowSpan = col.children ? 1 : maxDeep - depth + 1;
          const colSpan = colChildrenLen;
          if (rowSpan > 1) {
            col.rowSpan = rowSpan;
          }
          if (colSpan > 1) {
            col.colSpan = colSpan;
          }
          allChildrenLen += colChildrenLen;
          allChildrenWidthSum += colWidth;
        });
        return [allChildrenLen, allChildrenWidthSum];
      }
      flat(copyColumn, null);
      tableHeaders.value = tableHeadersTemp;
      tableHeaderLast.value = tempHeaderLast;
      tableHeadersForCalc.value = tableHeadersForCalcTemp;
    }
    function rowKeyGen(row) {
      if (!row) return row;
      let key = rowKeyGenStore.get(row);
      if (!key) {
        if (row.__ROW_KEY__) {
          key = row.__ROW_KEY__;
        } else {
          key = typeof props.rowKey === "function" ? props.rowKey(row) : row[props.rowKey];
        }
        if (key === void 0) {
          key = Math.random().toString();
        }
        rowKeyGenStore.set(row, key);
      }
      return key;
    }
    function cellKeyGen(row, col) {
      return rowKeyGen(row) + "--" + colKeyGen.value(col);
    }
    const cellStyleMap = computed(() => {
      const thMap = /* @__PURE__ */ new Map();
      const tdMap = /* @__PURE__ */ new Map();
      tableHeaders.value.forEach((cols, depth) => {
        cols.forEach((col) => {
          const colKey = colKeyGen.value(col);
          const width = props.virtualX ? getCalculatedColWidth(col) + "px" : transformWidthToStr(col.width);
          const style = {
            width
          };
          if (props.colResizable) {
            style.minWidth = width;
            style.maxWidth = width;
          } else {
            style.minWidth = transformWidthToStr(col.minWidth) ?? width;
            style.maxWidth = transformWidthToStr(col.maxWidth) ?? width;
          }
          thMap.set(colKey, {
            ...style,
            ...getFixedStyle(TagType.TH, col, depth),
            textAlign: col.headerAlign
          });
          tdMap.set(colKey, {
            ...style,
            ...getFixedStyle(TagType.TD, col, depth),
            textAlign: col.align
          });
        });
      });
      return {
        [TagType.TH]: thMap,
        [TagType.TD]: tdMap
      };
    });
    function getHeaderTitle(col) {
      const colKey = colKeyGen.value(col);
      if (props.hideHeaderTitle === true || Array.isArray(props.hideHeaderTitle) && props.hideHeaderTitle.includes(colKey)) {
        return "";
      }
      return col.title || "";
    }
    function onColumnSort(col, click = true, options = {}) {
      if (!col) {
        console.warn("onColumnSort: col is not found");
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
      if (click) sortOrderIndex.value++;
      sortOrderIndex.value = sortOrderIndex.value % 3;
      let order = sortSwitchOrder[sortOrderIndex.value];
      const sortConfig = { ...props.sortConfig, ...col.sortConfig };
      const defaultSort = sortConfig.defaultSort;
      if (!order && defaultSort) {
        const colKey2 = defaultSort.key || defaultSort.dataIndex;
        if (!colKey2) {
          console.error("sortConfig.defaultSort key or dataIndex is required");
          return;
        }
        order = defaultSort.order || "desc";
        sortOrderIndex.value = sortSwitchOrder.indexOf(order);
        sortCol.value = colKey2;
        col = null;
        for (const row of tableHeaders.value) {
          const c = row.find((item) => colKeyGen.value(item) === colKey2);
          if (c) {
            col = c;
            break;
          }
        }
      }
      if (!props.sortRemote || options.force) {
        const sortOption = col || defaultSort;
        if (sortOption) {
          dataSourceCopy.value = tableSort(sortOption, order, props.dataSource, sortConfig);
        }
      }
      if (click || options.emit) {
        emits("sort-change", col, order, toRaw(dataSourceCopy.value), sortConfig);
      }
    }
    function onRowClick(e, row) {
      emits("row-click", e, row);
      const isCurrentRow = props.rowKey ? currentRowKey.value === rowKeyGen(row) : currentRow.value === row;
      if (isCurrentRow) {
        if (!props.rowCurrentRevokable) {
          return;
        }
        currentRow.value = void 0;
        currentRowKey.value = void 0;
        emits("current-change", e, row, { select: false });
      } else {
        currentRow.value = row;
        currentRowKey.value = rowKeyGen(row);
        emits("current-change", e, row, { select: true });
      }
    }
    function onRowDblclick(e, row) {
      emits("row-dblclick", e, row);
    }
    function onHeaderMenu(e) {
      emits("header-row-menu", e);
    }
    function onRowMenu(e, row) {
      emits("row-menu", e, row);
    }
    function onCellClick(e, row, col) {
      if (props.cellActive) {
        const cellKey = cellKeyGen(row, col);
        if (props.selectedCellRevokable && currentSelectedCellKey.value === cellKey) {
          currentSelectedCellKey.value = void 0;
          emits("cell-selected", e, { select: false, row, col });
        } else {
          currentSelectedCellKey.value = cellKey;
          emits("cell-selected", e, { select: true, row, col });
        }
      }
      emits("cell-click", e, row, col);
    }
    function onHeaderCellClick(e, col) {
      emits("header-cell-click", e, col);
    }
    function onCellMouseEnter(e, row, col) {
      emits("cell-mouseenter", e, row, col);
    }
    function onCellMouseLeave(e, row, col) {
      emits("cell-mouseleave", e, row, col);
    }
    function onCellMouseOver(e, row, col) {
      emits("cell-mouseover", e, row, col);
    }
    function onTableWheel(e) {
      if (props.smoothScroll) {
        return;
      }
      if (isColResizing.value) {
        e.stopPropagation();
        return;
      }
      const dom = tableContainerRef.value;
      if (!dom) return;
      const { containerHeight, scrollTop, scrollHeight } = virtualScroll.value;
      const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
      const isScrollBottom = scrollHeight - containerHeight - scrollTop < 10;
      const isScrollRight = scrollWidth - containerWidth - scrollLeft < 10;
      const { deltaY, deltaX } = e;
      if (virtual_on && deltaY) {
        if (deltaY > 0 && !isScrollBottom || deltaY < 0 && scrollTop > 0) {
          e.preventDefault();
        }
        dom.scrollTop += deltaY;
      }
      if (virtualX_on && deltaX) {
        if (deltaX > 0 && !isScrollRight || deltaX < 0 && scrollLeft > 0) {
          e.preventDefault();
        }
        dom.scrollLeft += deltaX;
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
      const { startIndex, endIndex } = virtualScroll.value;
      const data = { startIndex, endIndex };
      if (isYScroll) {
        emits("scroll", e, data);
      }
      if (isXScroll) {
        emits("scroll-x", e);
      }
    }
    function onTrMouseOver(_e, row) {
      if (currentHoverRow === row) return;
      currentHoverRow = row;
      currentHoverRowKey.value = rowKeyGen(row);
    }
    function setCurrentRow(rowKeyOrRow, option = { silent: false }) {
      if (!dataSourceCopy.value.length) return;
      const select = rowKeyOrRow !== void 0;
      if (!select) {
        currentRow.value = void 0;
        currentRowKey.value = void 0;
      } else if (typeof rowKeyOrRow === "string") {
        const row = dataSourceCopy.value.find((it) => rowKeyGen(it) === rowKeyOrRow);
        if (!row) {
          console.warn("setCurrentRow failed.rowKey:", rowKeyOrRow);
          return;
        }
        currentRow.value = row;
        currentRowKey.value = rowKeyOrRow;
      } else {
        currentRow.value = rowKeyOrRow;
        currentRowKey.value = rowKeyGen(rowKeyOrRow);
      }
      if (!option.silent) {
        emits(
          "current-change",
          /** no Event */
          null,
          currentRow.value,
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
      if (newOption.sort && ((_a = dataSourceCopy.value) == null ? void 0 : _a.length)) {
        const column = newOption.sortOption || tableHeaderLast.value.find((it) => colKeyGen.value(it) === sortCol.value);
        if (column) onColumnSort(column, false, { force: option.force ?? true, emit: !newOption.silent });
        else console.warn("Can not find column by key:", sortCol.value);
      }
      return dataSourceCopy.value;
    }
    function resetSorter() {
      sortCol.value = void 0;
      sortOrderIndex.value = 0;
      dataSourceCopy.value = [...props.dataSource];
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
    function toggleExpandRow(row, col) {
      const isExpand = (row == null ? void 0 : row.__EXPANDED__) === col ? !(row == null ? void 0 : row.__EXPANDED__) : true;
      setRowExpand(row, isExpand, { col });
    }
    function setRowExpand(rowKeyOrRow, expand, data) {
      let rowKey;
      if (typeof rowKeyOrRow === "string") {
        rowKey = rowKeyOrRow;
      } else {
        rowKey = rowKeyGen(rowKeyOrRow);
      }
      const tempData = [...dataSourceCopy.value];
      const index = tempData.findIndex((it) => rowKeyGen(it) === rowKey);
      if (index === -1) {
        console.warn("expandRow failed.rowKey:", rowKey);
        return;
      }
      for (let i = index + 1; i < tempData.length; i++) {
        const item = tempData[i];
        const rowKey2 = item.__ROW_KEY__;
        if (rowKey2 == null ? void 0 : rowKey2.startsWith(EXPANDED_ROW_KEY_PREFIX)) {
          tempData.splice(i, 1);
          i--;
        } else {
          break;
        }
      }
      const row = tempData[index];
      const col = (data == null ? void 0 : data.col) || null;
      if (expand) {
        const newExpandRow = {
          __ROW_KEY__: EXPANDED_ROW_KEY_PREFIX + rowKey,
          __EXPANDED_ROW__: row,
          __EXPANDED_COL__: col
        };
        tempData.splice(index + 1, 0, newExpandRow);
      }
      if (row) {
        row.__EXPANDED__ = expand ? col : null;
      }
      dataSourceCopy.value = tempData;
      if (!(data == null ? void 0 : data.silent)) {
        emits("toggle-row-expand", { expanded: Boolean(expand), row, col });
      }
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
      clearAllAutoHeight
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "tableContainerRef",
        ref: tableContainerRef,
        class: normalizeClass(["stk-table", {
          virtual: _ctx.virtual,
          "virtual-x": _ctx.virtualX,
          "vt-on": unref(virtual_on),
          dark: _ctx.theme === "dark",
          headless: _ctx.headless,
          "is-col-resizing": unref(isColResizing),
          "col-resizable": props.colResizable,
          border: props.bordered,
          "border-h": props.bordered === "h",
          "border-v": props.bordered === "v",
          "border-body-v": props.bordered === "body-v",
          stripe: props.stripe,
          "cell-hover": props.cellHover,
          "cell-active": props.cellActive,
          "row-hover": props.rowHover,
          "row-active": props.rowActive,
          "text-overflow": props.showOverflow,
          "header-text-overflow": props.showHeaderOverflow,
          "fixed-relative-mode": isRelativeMode.value,
          "auto-row-height": props.autoRowHeight
        }]),
        style: normalizeStyle({
          "--row-height": props.autoRowHeight ? void 0 : unref(virtualScroll).rowHeight + "px",
          "--header-row-height": props.headerRowHeight + "px",
          "--highlight-duration": props.highlightConfig.duration && props.highlightConfig.duration + "s",
          "--highlight-timing-function": unref(highlightSteps) ? `steps(${unref(highlightSteps)})` : ""
        }),
        onScroll: onTableScroll,
        onWheel: onTableWheel
      }, [
        _ctx.colResizable ? (openBlock(), createElementBlock("div", {
          key: 0,
          ref_key: "colResizeIndicatorRef",
          ref: colResizeIndicatorRef,
          class: "column-resize-indicator"
        }, null, 512)) : createCommentVNode("", true),
        createElementVNode("table", {
          class: normalizeClass(["stk-table-main", {
            "fixed-mode": props.fixedMode
          }]),
          style: normalizeStyle({ width: _ctx.width, minWidth: _ctx.minWidth, maxWidth: _ctx.maxWidth })
        }, [
          !_ctx.headless ? (openBlock(), createElementBlock("thead", {
            key: 0,
            ref_key: "theadRef",
            ref: theadRef
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(tableHeaders.value, (row, rowIndex) => {
              return openBlock(), createElementBlock("tr", {
                key: rowIndex,
                onContextmenu: _cache[3] || (_cache[3] = (e) => onHeaderMenu(e))
              }, [
                unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                  key: 0,
                  class: "vt-x-left",
                  style: normalizeStyle(`min-width:${unref(virtualScrollX).offsetLeft}px;width:${unref(virtualScrollX).offsetLeft}px`)
                }, null, 4)) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_on) && rowIndex === tableHeaders.value.length - 1 ? unref(virtualX_columnPart) : row, (col, colIndex) => {
                  return openBlock(), createElementBlock("th", {
                    key: colKeyGen.value(col),
                    "data-col-key": colKeyGen.value(col),
                    draggable: unref(isHeaderDraggable)(col) ? "true" : "false",
                    rowspan: unref(virtualX_on) ? 1 : col.rowSpan,
                    colspan: col.colSpan,
                    style: normalizeStyle(cellStyleMap.value[unref(TagType).TH].get(colKeyGen.value(col))),
                    title: getHeaderTitle(col),
                    class: normalizeClass([
                      col.sorter ? "sortable" : "",
                      colKeyGen.value(col) === unref(sortCol) && unref(sortOrderIndex) !== 0 && "sorter-" + sortSwitchOrder[unref(sortOrderIndex)],
                      col.headerClassName,
                      unref(fixedColClassMap).get(colKeyGen.value(col))
                    ]),
                    onClick: (e) => {
                      onColumnSort(col);
                      onHeaderCellClick(e, col);
                    },
                    onDragstart: _cache[0] || (_cache[0] = //@ts-ignore
                    (...args) => unref(onThDragStart) && unref(onThDragStart)(...args)),
                    onDrop: _cache[1] || (_cache[1] = //@ts-ignore
                    (...args) => unref(onThDrop) && unref(onThDrop)(...args)),
                    onDragover: _cache[2] || (_cache[2] = //@ts-ignore
                    (...args) => unref(onThDragOver) && unref(onThDragOver)(...args))
                  }, [
                    createElementVNode("div", {
                      class: "table-header-cell-wrapper",
                      style: normalizeStyle({ "--row-span": unref(virtualX_on) ? 1 : col.rowSpan })
                    }, [
                      col.customHeaderCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customHeaderCell), {
                        key: 0,
                        col,
                        colIndex,
                        rowIndex
                      }, null, 8, ["col", "colIndex", "rowIndex"])) : col.type === "seq" ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(col.title), 1)) : renderSlot(_ctx.$slots, "tableHeader", {
                        key: 2,
                        col
                      }, () => [
                        createElementVNode("span", _hoisted_3, toDisplayString(col.title), 1)
                      ]),
                      col.sorter ? (openBlock(), createElementBlock("span", _hoisted_4, [
                        createVNode(SortIcon)
                      ])) : createCommentVNode("", true),
                      unref(colResizeOn)(col) && colIndex > 0 ? (openBlock(), createElementBlock("div", {
                        key: 4,
                        class: "table-header-resizer left",
                        onMousedown: (e) => unref(onThResizeMouseDown)(e, col, true)
                      }, null, 40, _hoisted_5)) : createCommentVNode("", true),
                      unref(colResizeOn)(col) ? (openBlock(), createElementBlock("div", {
                        key: 5,
                        class: "table-header-resizer right",
                        onMousedown: (e) => unref(onThResizeMouseDown)(e, col)
                      }, null, 40, _hoisted_6)) : createCommentVNode("", true)
                    ], 4)
                  ], 46, _hoisted_1);
                }), 128)),
                unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                  key: 1,
                  class: "vt-x-right",
                  style: normalizeStyle(`min-width:${unref(virtualX_offsetRight)}px;width:${unref(virtualX_offsetRight)}px`)
                }, null, 4)) : createCommentVNode("", true)
              ], 32);
            }), 128))
          ], 512)) : createCommentVNode("", true),
          createElementVNode("tbody", {
            class: "stk-tbody-main",
            onDragover: _cache[4] || (_cache[4] = //@ts-ignore
            (...args) => unref(onTrDragOver) && unref(onTrDragOver)(...args)),
            onDragenter: _cache[5] || (_cache[5] = //@ts-ignore
            (...args) => unref(onTrDragEnter) && unref(onTrDragEnter)(...args)),
            onDragend: _cache[6] || (_cache[6] = //@ts-ignore
            (...args) => unref(onTrDragEnd) && unref(onTrDragEnd)(...args))
          }, [
            unref(virtual_on) ? (openBlock(), createElementBlock("tr", {
              key: 0,
              style: normalizeStyle(`height:${unref(virtualScroll).offsetTop}px`),
              class: "padding-top-tr"
            }, [
              unref(virtualX_on) && _ctx.fixedMode && _ctx.headless ? (openBlock(), createElementBlock("td", _hoisted_7)) : createCommentVNode("", true),
              _ctx.fixedMode && _ctx.headless ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(unref(virtualX_columnPart), (col) => {
                return openBlock(), createElementBlock("td", {
                  key: colKeyGen.value(col),
                  style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen.value(col)))
                }, null, 4);
              }), 128)) : createCommentVNode("", true)
            ], 4)) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtual_dataSourcePart), (row, rowIndex) => {
              var _a, _b;
              return openBlock(), createElementBlock("tr", {
                id: unref(stkTableId) + "-" + (_ctx.rowKey ? rowKeyGen(row) : (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex),
                ref_for: true,
                ref_key: "trRef",
                ref: trRef,
                key: _ctx.rowKey ? rowKeyGen(row) : (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex,
                "data-row-key": _ctx.rowKey ? rowKeyGen(row) : (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex,
                class: normalizeClass({
                  active: _ctx.rowKey ? rowKeyGen(row) === currentRowKey.value : row === currentRow.value,
                  hover: props.showTrHoverClass && (_ctx.rowKey ? rowKeyGen(row) === currentHoverRowKey.value : row === currentHoverRowKey.value),
                  [_ctx.rowClassName(row, (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex)]: true,
                  expanded: row == null ? void 0 : row.__EXPANDED__,
                  "expanded-row": row && row.__EXPANDED_ROW__
                }),
                style: normalizeStyle({
                  "--row-height": row && row.__EXPANDED_ROW__ && props.virtual && ((_a = props.expandConfig) == null ? void 0 : _a.height) && ((_b = props.expandConfig) == null ? void 0 : _b.height) + "px"
                }),
                onClick: (e) => onRowClick(e, row),
                onDblclick: (e) => onRowDblclick(e, row),
                onContextmenu: (e) => onRowMenu(e, row),
                onMouseover: (e) => onTrMouseOver(e, row),
                onDrop: (e) => unref(onTrDrop)(e, (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex)
              }, [
                unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_9)) : createCommentVNode("", true),
                row && row.__EXPANDED_ROW__ ? (openBlock(), createElementBlock("td", {
                  key: 1,
                  colspan: unref(virtualX_columnPart).length
                }, [
                  createElementVNode("div", _hoisted_11, [
                    renderSlot(_ctx.$slots, "expand", {
                      row: row.__EXPANDED_ROW__,
                      col: row.__EXPANDED_COL__
                    }, () => {
                      var _a2;
                      return [
                        createTextVNode(toDisplayString(((_a2 = row.__EXPANDED_ROW__) == null ? void 0 : _a2[row.__EXPANDED_COL__.dataIndex]) ?? ""), 1)
                      ];
                    })
                  ])
                ], 8, _hoisted_10)) : (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(unref(virtualX_columnPart), (col, colIndex) => {
                  return openBlock(), createElementBlock("td", {
                    key: colKeyGen.value(col),
                    "data-cell-key": cellKeyGen(row, col),
                    style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen.value(col))),
                    class: normalizeClass([
                      col.className,
                      unref(fixedColClassMap).get(colKeyGen.value(col)),
                      {
                        "seq-column": col.type === "seq",
                        active: currentSelectedCellKey.value === cellKeyGen(row, col),
                        "expand-cell": col.type === "expand",
                        expanded: col.type === "expand" && colKeyGen.value(row == null ? void 0 : row.__EXPANDED__) === colKeyGen.value(col),
                        "drag-row-cell": col.type === "dragRow"
                      }
                    ]),
                    onClick: (e) => {
                      col.type === "expand" && toggleExpandRow(row, col);
                      onCellClick(e, row, col);
                    },
                    onMouseenter: (e) => onCellMouseEnter(e, row, col),
                    onMouseleave: (e) => onCellMouseLeave(e, row, col),
                    onMouseover: (e) => onCellMouseOver(e, row, col)
                  }, [
                    col.customCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customCell), {
                      key: 0,
                      class: "table-cell-wrapper",
                      col,
                      row,
                      rowIndex: (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex,
                      colIndex,
                      cellValue: row == null ? void 0 : row[col.dataIndex],
                      expanded: (row == null ? void 0 : row.__EXPANDED__) || null
                    }, null, 8, ["col", "row", "rowIndex", "colIndex", "cellValue", "expanded"])) : (openBlock(), createElementBlock("div", {
                      key: 1,
                      class: normalizeClass(["table-cell-wrapper", { "expanded-cell-wrapper": col.type === "expand" }]),
                      title: col.type !== "seq" ? row == null ? void 0 : row[col.dataIndex] : ""
                    }, [
                      col.type === "seq" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString((props.seqConfig.startIndex || 0) + (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex + 1), 1)
                      ], 64)) : col.type === "expand" ? (openBlock(), createElementBlock("span", _hoisted_14, toDisplayString((row == null ? void 0 : row[col.dataIndex]) ?? ""), 1)) : col.type === "dragRow" ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                        createVNode(DragHandle, {
                          onDragstart: (e) => unref(onTrDragStart)(e, (unref(virtual_on) ? unref(virtualScroll).startIndex : 0) + rowIndex)
                        }, null, 8, ["onDragstart"]),
                        createElementVNode("span", null, toDisplayString((row == null ? void 0 : row[col.dataIndex]) ?? ""), 1)
                      ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 3 }, [
                        createTextVNode(toDisplayString((row == null ? void 0 : row[col.dataIndex]) ?? getEmptyCellText.value(col, row)), 1)
                      ], 64))
                    ], 10, _hoisted_13))
                  ], 46, _hoisted_12);
                }), 128))
              ], 46, _hoisted_8);
            }), 128)),
            unref(virtual_on) ? (openBlock(), createElementBlock("tr", {
              key: 1,
              style: normalizeStyle(`height: ${unref(virtual_offsetBottom)}px`)
            }, null, 4)) : createCommentVNode("", true)
          ], 32)
        ], 6),
        (!dataSourceCopy.value || !dataSourceCopy.value.length) && _ctx.showNoData ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(["stk-table-no-data", { "no-data-full": _ctx.noDataFull }])
        }, [
          renderSlot(_ctx.$slots, "empty", {}, () => [
            _cache[7] || (_cache[7] = createTextVNode("暂无数据"))
          ])
        ], 2)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "customBottom")
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
