import { onMounted, onBeforeUnmount, watch, ref, shallowRef, computed, defineComponent, nextTick, toRaw, openBlock, createElementBlock, normalizeClass, unref, normalizeStyle, createCommentVNode, createElementVNode, Fragment, renderList, createBlock, resolveDynamicComponent, toDisplayString, renderSlot, createTextVNode } from "vue";
import { interpolateRgb } from "d3-interpolate";
function isEmptyValue(val, isNumber) {
  let isEmpty = val === null || val === "";
  if (isNumber) {
    isEmpty = isEmpty || typeof val === "boolean" || Number.isNaN(+val);
  }
  return isEmpty;
}
function insertToOrderedArray(sortState, newItem, targetArray, sortConfig = {}) {
  const { dataIndex, order } = sortState;
  sortConfig = { emptyToBottom: false, ...sortConfig };
  let { sortType } = sortState;
  if (!sortType)
    sortType = typeof newItem[dataIndex];
  const isNumber = sortType === "number";
  const data = [...targetArray];
  if (!order) {
    data.unshift(newItem);
    return data;
  }
  if (sortConfig.emptyToBottom && isEmptyValue(data)) {
    data.push(newItem);
  }
  let sIndex = 0;
  let eIndex = data.length - 1;
  const targetVal = newItem[dataIndex];
  while (sIndex <= eIndex) {
    const midIndex = Math.floor((sIndex + eIndex) / 2);
    const midVal = data[midIndex][dataIndex];
    const compareRes = strCompare(midVal, targetVal, isNumber, sortConfig.stringLocaleCompare);
    if (compareRes === 0) {
      sIndex = midIndex;
      break;
    } else if (compareRes === -1) {
      if (order === "asc")
        sIndex = midIndex + 1;
      else
        eIndex = midIndex - 1;
    } else {
      if (order === "asc")
        eIndex = midIndex - 1;
      else
        sIndex = midIndex + 1;
    }
  }
  data.splice(sIndex, 0, newItem);
  return data;
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
  if (_a > _b)
    return 1;
  else if (_a === _b)
    return 0;
  else
    return -1;
}
function separatedData(sortOption, targetDataSource, isNumber) {
  const emptyArr = [];
  const valueArr = [];
  for (let i = 0; i < targetDataSource.length; i++) {
    const row = targetDataSource[i];
    const sortField = sortOption.sortField || sortOption.dataIndex;
    const isEmpty = isEmptyValue(row[sortField], isNumber);
    if (isEmpty) {
      emptyArr.push(row);
    } else {
      valueArr.push(row);
    }
  }
  return [valueArr, emptyArr];
}
function tableSort(sortOption, order, dataSource, sortConfig = {}) {
  if (!(dataSource == null ? void 0 : dataSource.length))
    return dataSource || [];
  sortConfig = { emptyToBottom: false, ...sortConfig };
  let targetDataSource = [...dataSource];
  let sortField = sortOption.sortField || sortOption.dataIndex;
  if (!order && sortConfig.defaultSort) {
    order = sortConfig.defaultSort.order;
    sortField = sortConfig.defaultSort.dataIndex;
  }
  if (typeof sortOption.sorter === "function") {
    const customSorterData = sortOption.sorter(targetDataSource, { order, column: sortOption });
    if (customSorterData)
      targetDataSource = customSorterData;
  } else if (order) {
    let { sortType } = sortOption;
    if (!sortType)
      sortType = typeof dataSource[0][sortField];
    const [valueArr, emptyArr] = separatedData(sortOption, targetDataSource, sortType === "number");
    const isNumber = sortType === "number";
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
function howDeepTheHeader(arr, level = 1) {
  const levels = [level];
  arr.forEach((item) => {
    var _a;
    if ((_a = item.children) == null ? void 0 : _a.length) {
      levels.push(howDeepTheHeader(item.children, level + 1));
    }
  });
  return Math.max(...levels);
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
function transformWidthToStr(width) {
  if (typeof width === "number") {
    return width + "px";
  }
  return width;
}
function createStkTableId() {
  let id = window.__STK_TB_ID_COUNT__;
  if (!id)
    id = 0;
  id += 1;
  window.__STK_TB_ID_COUNT__ = id;
  return STK_ID_PREFIX + id.toString(36);
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
const STK_ID_PREFIX = "stk";
var TagType = /* @__PURE__ */ ((TagType2) => {
  TagType2[TagType2["TH"] = 0] = "TH";
  TagType2[TagType2["TD"] = 1] = "TD";
  return TagType2;
})(TagType || {});
function useAutoResize({ tableContainerRef, initVirtualScroll, props, debounceMs }) {
  let resizeObserver = null;
  onMounted(() => {
    initResizeObserver();
  });
  onBeforeUnmount(() => {
    removeResizeObserver();
  });
  function initResizeObserver() {
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
  }
  function removeResizeObserver() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    } else {
      window.removeEventListener("resize", resizeCallback);
    }
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
function useColResize({
  tableContainerRef,
  tableHeaderLast,
  colResizeIndicatorRef,
  props,
  emits,
  colKeyGen
}) {
  const isColResizing = ref(false);
  let colResizeState = {
    currentCol: null,
    currentColIndex: 0,
    lastCol: null,
    startX: 0,
    startOffsetTableX: 0
  };
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
  function onThResizeMouseDown(e, col, isPrev = false) {
    if (!tableContainerRef.value)
      return;
    e.stopPropagation();
    e.preventDefault();
    const { clientX } = e;
    const { scrollLeft, scrollTop } = tableContainerRef.value;
    const { left } = tableContainerRef.value.getBoundingClientRect();
    const tableHeaderLastValue = tableHeaderLast.value;
    let colIndex = tableHeaderLastValue.findIndex((it) => colKeyGen.value(it) === colKeyGen.value(col));
    if (isPrev) {
      colIndex -= 1;
      col = tableHeaderLastValue[colIndex];
    }
    const offsetTableX = clientX - left + scrollLeft;
    isColResizing.value = true;
    Object.assign(colResizeState, {
      currentCol: col,
      currentColIndex: colIndex,
      lastCol: findLastChildCol(col),
      startX: clientX,
      startOffsetTableX: offsetTableX
    });
    if (colResizeIndicatorRef.value) {
      const style = colResizeIndicatorRef.value.style;
      style.display = "block";
      style.left = offsetTableX + "px";
      style.top = scrollTop + "px";
    }
  }
  function onThResizeMouseMove(e) {
    if (!isColResizing.value)
      return;
    e.stopPropagation();
    e.preventDefault();
    const { lastCol, startX, startOffsetTableX } = colResizeState;
    const { clientX } = e;
    let moveX = clientX - startX;
    const currentColWidth = getCalculatedColWidth(lastCol);
    if (currentColWidth + moveX < props.colMinWidth) {
      moveX = -currentColWidth;
    }
    const offsetTableX = startOffsetTableX + moveX;
    if (!colResizeIndicatorRef.value)
      return;
    colResizeIndicatorRef.value.style.left = offsetTableX + "px";
  }
  function onThResizeMouseUp(e) {
    if (!isColResizing.value)
      return;
    const { startX, lastCol } = colResizeState;
    const { clientX } = e;
    const moveX = clientX - startX;
    let width = getCalculatedColWidth(lastCol) + moveX;
    if (width < props.colMinWidth)
      width = props.colMinWidth;
    const curCol = tableHeaderLast.value.find((it) => colKeyGen.value(it) === colKeyGen.value(lastCol));
    if (!curCol)
      return;
    curCol.width = width + "px";
    emits("update:columns", [...props.columns]);
    if (colResizeIndicatorRef.value) {
      const style = colResizeIndicatorRef.value.style;
      style.display = "none";
      style.left = "0";
      style.top = "0";
    }
    isColResizing.value = false;
    colResizeState = {
      currentCol: null,
      currentColIndex: 0,
      lastCol: null,
      startX: 0,
      startOffsetTableX: 0
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
    isColResizing,
    onThResizeMouseDown
  };
}
function useFixedCol({
  props,
  colKeyGen,
  getFixedColPosition,
  tableHeaders,
  tableHeaderLast,
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
  function getColAndParentCols(col, type = "shadow") {
    if (!col)
      return [];
    const fixedShadowColsTemp = [];
    const fixedColsTemp = [];
    let node = { __PARENT__: col };
    while (node = node.__PARENT__) {
      if (node.fixed) {
        fixedShadowColsTemp.push(node);
      }
      fixedColsTemp.push(node);
    }
    if (type === "shadow") {
      return fixedShadowColsTemp;
    } else {
      return fixedColsTemp;
    }
  }
  function updateFixedShadow(virtualScrollX) {
    if (!props.fixedColShadow)
      return;
    const fixedColsTemp = [];
    const fixedShadowColsTemp = [];
    let clientWidth, scrollLeft;
    if (virtualScrollX == null ? void 0 : virtualScrollX.value) {
      const { containerWidth: cw, scrollWidth: sw, scrollLeft: sl } = virtualScrollX.value;
      clientWidth = cw;
      scrollLeft = sl;
    } else {
      const { clientWidth: cw, scrollWidth: sw, scrollLeft: sl } = tableContainerRef.value;
      clientWidth = cw;
      scrollLeft = sl;
    }
    let leftShadowCol = null;
    let rightShadowCol = null;
    let left = 0;
    tableHeaderLast.value.forEach((col) => {
      const position = getFixedColPosition.value(col);
      if (col.fixed === "left" && position + scrollLeft > left) {
        leftShadowCol = col;
        fixedColsTemp.push(...getColAndParentCols(col, "active"));
      }
      left += getCalculatedColWidth(col);
      if (!rightShadowCol && col.fixed === "right" && scrollLeft + clientWidth - left < position) {
        rightShadowCol = col;
      }
      if (rightShadowCol && col.fixed === "right") {
        fixedColsTemp.push(...getColAndParentCols(col, "active"));
      }
    });
    fixedShadowColsTemp.push(...getColAndParentCols(leftShadowCol), ...getColAndParentCols(rightShadowCol));
    fixedShadowCols.value = fixedShadowColsTemp.filter(Boolean);
    fixedCols.value = fixedColsTemp;
  }
  return {
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
    if (tagType === TagType.TD && !fixed)
      return null;
    const style = {};
    const { scrollLeft, scrollWidth, offsetLeft, containerWidth } = virtualScrollX.value;
    const scrollRight = scrollWidth - containerWidth - scrollLeft;
    const isFixedLeft = fixed === "left";
    if (tagType === TagType.TH) {
      if (isRelativeMode.value) {
        style.top = virtualScroll.value.scrollTop + "px";
      } else {
        style.top = depth * props.rowHeight + "px";
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
function useGetFixedColPosition({ tableHeaders, colKeyGen }) {
  const getFixedColPosition = computed(() => {
    const colKeyStore = {};
    const refStore = /* @__PURE__ */ new WeakMap();
    tableHeaders.value.forEach((cols) => {
      let left = 0;
      let rightStartIndex = 0;
      for (let i = 0; i < cols.length; i++) {
        const item = cols[i];
        if (item.fixed === "left") {
          const colKey = colKeyGen.value(item) || item.dataIndex;
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
        const colKey = colKeyGen.value(item) || item.dataIndex;
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
      const colKey = colKeyGen.value(col) || col.dataIndex;
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
    if (calcHighlightDimLoopAnimation)
      return;
    calcHighlightDimLoopAnimation = true;
    const recursion = () => {
      window.requestAnimationFrame(
        () => {
          const nowTs = Date.now();
          highlightDimRowsAnimation.forEach((store, rowKeyValue) => {
            const { ts, duration } = store;
            const timeOffset = nowTs - ts;
            if (nowTs - ts < duration) {
              updateRowBgc(rowKeyValue, store, timeOffset);
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
    if (calcHighlightDimLoopJs)
      return;
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
  function setHighlightDimCell(rowKeyValue, dataIndex, option = {}) {
    var _a;
    const cellEl = (_a = tableContainerRef.value) == null ? void 0 : _a.querySelector(`[data-row-key="${rowKeyValue}"]>[data-index="${dataIndex}"]`);
    const { className, method, duration, keyframe } = {
      className: HIGHLIGHT_CELL_CLASS,
      method: "animation",
      ...defaultHighlightDimOption,
      ...option
    };
    if (!cellEl)
      return;
    if (method === "animation") {
      cellEl.animate(keyframe, duration);
    } else {
      highlightCellsInCssKeyFrame(cellEl, rowKeyValue, className, duration);
    }
  }
  function setHighlightDimRow(rowKeyValues, option = {}) {
    if (!Array.isArray(rowKeyValues))
      rowKeyValues = [rowKeyValues];
    const { className, method, useCss, keyframe, duration } = {
      className: HIGHLIGHT_ROW_CLASS,
      method: "animation",
      ...defaultHighlightDimOption,
      ...option
    };
    if (method === "css" || useCss) {
      highlightRowsInCssKeyframe(rowKeyValues, className, duration);
    } else if (method === "animation") {
      if (props.virtual) {
        const nowTs = Date.now();
        for (let i = 0; i < rowKeyValues.length; i++) {
          const rowKeyValue = rowKeyValues[i];
          const store = { ts: nowTs, visible: false, keyframe, duration };
          highlightDimRowsAnimation.set(rowKeyValue, store);
          updateRowBgc(rowKeyValue, store, 0);
        }
        calcRowHighlightLoop();
      } else {
        for (let i = 0; i < rowKeyValues.length; i++) {
          const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValues[i]));
          if (!rowEl)
            continue;
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
      if (!rowEl)
        continue;
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
  function updateRowBgc(rowKeyValue, store, timeOffset) {
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
    if (!rowEl)
      return;
    rowEl.style.backgroundColor = color;
  }
  return {
    highlightSteps,
    setHighlightDimRow,
    setHighlightDimCell
  };
}
const SCROLL_CODES = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "PageUp", "PageDown"];
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
    if (!SCROLL_CODES.includes(e.code))
      return;
    if (!isMouseOver)
      return;
    e.preventDefault();
    const { scrollTop, rowHeight, containerHeight } = virtualScroll.value;
    const { scrollLeft } = virtualScrollX.value;
    const { headless, headerRowHeight } = props;
    const headerHeight = headless ? 0 : tableHeaders.value.length * (headerRowHeight || rowHeight);
    const bodyPageSize = Math.floor((containerHeight - headerHeight) / rowHeight);
    if (e.code === SCROLL_CODES[0]) {
      scrollTo(scrollTop - rowHeight, null);
    } else if (e.code === SCROLL_CODES[1]) {
      scrollTo(null, scrollLeft + rowHeight);
    } else if (e.code === SCROLL_CODES[2]) {
      scrollTo(scrollTop + rowHeight, null);
    } else if (e.code === SCROLL_CODES[3]) {
      scrollTo(null, scrollLeft - rowHeight);
    } else if (e.code === SCROLL_CODES[4]) {
      scrollTo(scrollTop - rowHeight * bodyPageSize + headerHeight, null);
    } else if (e.code === SCROLL_CODES[5]) {
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
    if (!isMouseOver)
      isMouseOver = true;
  }
}
function useThDrag({ props, emits }) {
  let dragStartKey = void 0;
  function findParentTH(el) {
    let n = el;
    while (n) {
      if (n.tagName === "TH")
        return n;
      n = n.parentElement;
    }
  }
  function onThDragStart(e) {
    const th = findParentTH(e.target);
    if (!th)
      return;
    dragStartKey = th.dataset.colKey;
    emits("th-drag-start", dragStartKey);
  }
  function onThDragOver(e) {
    const th = findParentTH(e.target);
    if (!th)
      return;
    const isHeaderDraggable2 = th.getAttribute("draggable") === "true";
    if (!isHeaderDraggable2) {
      return;
    }
    e.preventDefault();
  }
  function onThDrop(e) {
    const th = findParentTH(e.target);
    if (!th)
      return;
    if (dragStartKey !== th.dataset.colKey) {
      emits("col-order-change", dragStartKey, th.dataset.colKey);
    }
    emits("th-drop", th.dataset.colKey);
  }
  const isHeaderDragFun = typeof props.headerDrag === "function";
  function isHeaderDraggable(col) {
    if (isHeaderDragFun) {
      return props.headerDrag(col);
    } else {
      return props.headerDrag;
    }
  }
  return {
    onThDragStart,
    onThDragOver,
    onThDrop,
    isHeaderDraggable
  };
}
const VUE2_SCROLL_TIMEOUT_MS = 200;
function useVirtualScroll({
  props,
  tableContainerRef,
  dataSourceCopy,
  tableHeaderLast,
  tableHeaders
}) {
  const virtualScroll = ref({
    containerHeight: 0,
    rowHeight: props.rowHeight,
    pageSize: 10,
    startIndex: 0,
    endIndex: 0,
    offsetTop: 0,
    scrollTop: 0
  });
  const virtualScrollX = ref({
    containerWidth: 0,
    scrollWidth: 0,
    startIndex: 0,
    endIndex: 0,
    offsetLeft: 0,
    scrollLeft: 0
  });
  const virtual_on = computed(() => {
    return props.virtual && dataSourceCopy.value.length > virtualScroll.value.pageSize * 2;
  });
  const virtual_dataSourcePart = computed(() => {
    if (!virtual_on.value)
      return dataSourceCopy.value;
    const { startIndex, endIndex } = virtualScroll.value;
    return dataSourceCopy.value.slice(startIndex, endIndex + 1);
  });
  const virtual_offsetBottom = computed(() => {
    if (!virtual_on.value)
      return 0;
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
        if ((col == null ? void 0 : col.fixed) === "left")
          leftCols.push(col);
      }
      for (let i = endIndex; i < tableHeaderLastValue.length; i++) {
        const col = tableHeaderLastValue[i];
        if ((col == null ? void 0 : col.fixed) === "right")
          rightCols.push(col);
      }
      const mainColumns = tableHeaderLastValue.slice(startIndex, endIndex);
      return leftCols.concat(mainColumns).concat(rightCols);
    }
    return tableHeaderLastValue;
  });
  const virtualX_offsetRight = computed(() => {
    if (!virtualX_on.value)
      return 0;
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
  function initVirtualScrollY(height) {
    if (height !== void 0 && typeof height !== "number") {
      console.warn("initVirtualScrollY: height must be a number");
      height = 0;
    }
    if (!virtual_on.value)
      return;
    const { offsetHeight, scrollTop } = tableContainerRef.value || {};
    const { rowHeight } = virtualScroll.value;
    const containerHeight = height || offsetHeight || DEFAULT_TABLE_HEIGHT;
    const { headless, headerRowHeight } = props;
    let pageSize = Math.ceil(containerHeight / rowHeight);
    if (!headless) {
      const headerToBodyRowHeightCount = Math.floor(tableHeaders.value.length * (headerRowHeight || rowHeight) / rowHeight);
      pageSize -= headerToBodyRowHeightCount;
    }
    Object.assign(virtualScroll.value, { containerHeight, pageSize });
    updateVirtualScrollY(scrollTop);
  }
  function initVirtualScrollX() {
    const { clientWidth, scrollLeft, scrollWidth } = tableContainerRef.value || {};
    virtualScrollX.value.containerWidth = clientWidth || DEFAULT_TABLE_WIDTH;
    virtualScrollX.value.scrollWidth = scrollWidth || DEFAULT_TABLE_WIDTH;
    updateVirtualScrollX(scrollLeft);
  }
  function initVirtualScroll(height) {
    initVirtualScrollY(height);
    initVirtualScrollX();
  }
  let vue2ScrollYTimeout = null;
  function updateVirtualScrollY(sTop = 0) {
    const { rowHeight, pageSize, scrollTop, startIndex: oldStartIndex } = virtualScroll.value;
    virtualScroll.value.scrollTop = sTop;
    if (!virtual_on.value)
      return;
    let startIndex = Math.floor(sTop / rowHeight);
    if (startIndex < 0) {
      startIndex = 0;
    }
    if (props.stripe && startIndex !== 0) {
      const scrollRows = Math.abs(oldStartIndex - startIndex);
      if (scrollRows % 2) {
        startIndex -= 1;
      }
    }
    let endIndex = startIndex + pageSize;
    if (props.stripe) {
      endIndex += 1;
    }
    const offsetTop = startIndex * rowHeight;
    endIndex = Math.min(endIndex, dataSourceCopy.value.length);
    if (vue2ScrollYTimeout) {
      window.clearTimeout(vue2ScrollYTimeout);
    }
    if (!props.optimizeVue2Scroll || sTop <= scrollTop || Math.abs(oldStartIndex - startIndex) >= pageSize) {
      Object.assign(virtualScroll.value, {
        startIndex,
        endIndex,
        offsetTop
      });
    } else {
      virtualScroll.value.endIndex = endIndex;
      vue2ScrollYTimeout = window.setTimeout(() => {
        Object.assign(virtualScroll.value, { startIndex, offsetTop });
      }, VUE2_SCROLL_TIMEOUT_MS);
    }
  }
  let vue2ScrollXTimeout = null;
  function updateVirtualScrollX(sLeft = 0) {
    if (!props.virtualX)
      return;
    const tableHeaderLastValue = tableHeaderLast.value;
    const headerLength = tableHeaderLastValue == null ? void 0 : tableHeaderLastValue.length;
    if (!headerLength)
      return;
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
    updateVirtualScrollX
  };
}
const _hoisted_1 = { key: 0 };
const _hoisted_2 = ["data-col-key", "draggable", "rowspan", "colspan", "title", "onClick"];
const _hoisted_3 = { class: "table-header-cell-wrapper" };
const _hoisted_4 = {
  key: 1,
  class: "table-header-title"
};
const _hoisted_5 = { class: "table-header-title" };
const _hoisted_6 = {
  key: 3,
  class: "table-header-sorter"
};
const _hoisted_7 = /* @__PURE__ */ createElementVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16"
}, [
  /* @__PURE__ */ createElementVNode("polygon", {
    class: "arrow-up",
    fill: "#757699",
    points: "8 2 4.8 6 11.2 6"
  }),
  /* @__PURE__ */ createElementVNode("polygon", {
    class: "arrow-down",
    transform: "translate(8, 12) rotate(-180) translate(-8, -12) ",
    points: "8 10 4.8 14 11.2 14"
  })
], -1);
const _hoisted_8 = [
  _hoisted_7
];
const _hoisted_9 = ["onMousedown"];
const _hoisted_10 = ["onMousedown"];
const _hoisted_11 = {
  key: 1,
  class: "virtual-top"
};
const _hoisted_12 = {
  key: 0,
  class: "virtual-x-left"
};
const _hoisted_13 = { class: "stk-tbody-main" };
const _hoisted_14 = ["id", "data-row-key", "onClick", "onDblclick", "onContextmenu", "onMouseover"];
const _hoisted_15 = {
  key: 0,
  class: "virtual-x-left"
};
const _hoisted_16 = ["data-index", "onClick", "onMouseenter", "onMouseleave", "onMouseover"];
const _hoisted_17 = ["title"];
const _hoisted_18 = {
  key: 2,
  class: "virtual-bottom"
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
    headerRowHeight: { default: null },
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
    headerDrag: { type: [Boolean, Function], default: false },
    rowClassName: { type: Function, default: () => "" },
    colResizable: { type: Boolean, default: false },
    colMinWidth: { default: 10 },
    bordered: { type: [Boolean, String], default: true },
    autoResize: { type: [Boolean, Function], default: true },
    fixedColShadow: { type: Boolean, default: false },
    optimizeVue2Scroll: { type: Boolean, default: false },
    sortConfig: { default: () => ({
      emptyToBottom: false,
      stringLocaleCompare: true
    }) },
    hideHeaderTitle: { type: [Boolean, Array], default: false },
    highlightConfig: { default: () => ({}) },
    seqConfig: { default: () => ({}) },
    cellFixedMode: { default: "sticky" }
  },
  emits: ["sort-change", "row-click", "current-change", "row-dblclick", "header-row-menu", "row-menu", "cell-click", "cell-mouseenter", "cell-mouseleave", "cell-mouseover", "header-cell-click", "scroll", "scroll-x", "col-order-change", "th-drag-start", "th-drop", "update:columns"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const stkTableId = createStkTableId();
    const props = __props;
    const emits = __emit;
    const tableContainerRef = ref();
    const colResizeIndicatorRef = ref();
    const isRelativeMode = ref(IS_LEGACY_MODE ? true : props.cellFixedMode === "relative");
    const currentRow = ref(null);
    const currentRowKey = ref(null);
    let currentHoverRow = null;
    const currentHoverRowKey = ref(null);
    let sortCol = ref();
    let sortOrderIndex = ref(0);
    const sortSwitchOrder = [null, "desc", "asc"];
    const tableHeaders = shallowRef([]);
    const tableHeaderLast = shallowRef([]);
    const dataSourceCopy = shallowRef([...props.dataSource]);
    const colKeyGen = computed(() => {
      if (typeof props.colKey === "function") {
        return (col) => props.colKey(col);
      } else {
        return (col) => col[props.colKey];
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
    const { isColResizing, onThResizeMouseDown } = useColResize({
      props,
      emits,
      colKeyGen,
      colResizeIndicatorRef,
      tableContainerRef,
      tableHeaderLast
    });
    const { onThDragStart, onThDragOver, onThDrop, isHeaderDraggable } = useThDrag({ props, emits });
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
      updateVirtualScrollX
    } = useVirtualScroll({ tableContainerRef, props, dataSourceCopy, tableHeaderLast, tableHeaders });
    const getFixedColPosition = useGetFixedColPosition({ colKeyGen, tableHeaders });
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
    const { fixedColClassMap, updateFixedShadow } = useFixedCol({
      props,
      colKeyGen,
      getFixedColPosition,
      tableContainerRef,
      tableHeaders,
      tableHeaderLast
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
        if (needInitVirtualScrollY)
          initVirtualScrollY();
        if (sortCol.value) {
          const column = tableHeaderLast.value.find((it) => it.dataIndex === sortCol.value);
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
      if (!props.sortConfig.defaultSort)
        return;
      const { dataIndex, order, silent } = { silent: false, ...props.sortConfig.defaultSort };
      setSorter(dataIndex, order, { force: false, silent });
    }
    function dealColumns() {
      let tableHeadersTemp = [];
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
      const deep = howDeepTheHeader(copyColumn);
      const tempHeaderLast = [];
      if (deep > 1 && props.virtualX) {
        console.error("多级表头不支持横向虚拟滚动");
      }
      function flat(arr, parent, depth = 0) {
        if (!tableHeadersTemp[depth]) {
          tableHeadersTemp[depth] = [];
        }
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
          } else {
            colWidth = getColWidth(col);
            tempHeaderLast.push(col);
          }
          tableHeadersTemp[depth].push(col);
          const rowSpan = col.children ? 1 : deep - depth;
          const colSpan = colChildrenLen;
          if (rowSpan !== 1) {
            col.rowSpan = rowSpan;
          }
          if (colSpan !== 1) {
            col.colSpan = colSpan;
          }
          col.__WIDTH__ = colWidth;
          allChildrenLen += colChildrenLen;
          allChildrenWidthSum += colWidth;
        });
        return [allChildrenLen, allChildrenWidthSum];
      }
      flat(copyColumn, null);
      tableHeaders.value = tableHeadersTemp;
      tableHeaderLast.value = tempHeaderLast;
    }
    function rowKeyGen(row) {
      if (!row)
        return;
      let key = rowKeyGenStore.get(row);
      if (!key) {
        key = typeof props.rowKey === "function" ? props.rowKey(row) : row[props.rowKey];
        rowKeyGenStore.set(row, key);
      }
      return key;
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
      if (props.hideHeaderTitle === true || Array.isArray(props.hideHeaderTitle) && props.hideHeaderTitle.includes(col.dataIndex)) {
        return "";
      }
      return col.title || "";
    }
    function onColumnSort(col, click = true, options = {}) {
      if (!(col == null ? void 0 : col.sorter))
        return;
      options = { force: false, emit: false, ...options };
      if (sortCol.value !== col.dataIndex) {
        sortCol.value = col.dataIndex;
        sortOrderIndex.value = 0;
      }
      if (click)
        sortOrderIndex.value++;
      sortOrderIndex.value = sortOrderIndex.value % 3;
      let order = sortSwitchOrder[sortOrderIndex.value];
      const sortConfig = props.sortConfig;
      const defaultSort = sortConfig.defaultSort;
      if (!order && defaultSort) {
        order = defaultSort.order;
        sortOrderIndex.value = sortSwitchOrder.indexOf(order);
        sortCol.value = defaultSort.dataIndex;
      }
      if (!props.sortRemote || options.force) {
        dataSourceCopy.value = tableSort(col, order, props.dataSource, sortConfig);
      }
      if (click || options.emit) {
        emits("sort-change", col, order, toRaw(dataSourceCopy.value), sortConfig);
      }
    }
    function onRowClick(e, row) {
      emits("row-click", e, row);
      if (props.rowKey ? currentRowKey.value === rowKeyGen(row) : currentRow.value === row) {
        currentRow.value = null;
        currentRowKey.value = null;
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
      e.preventDefault();
      if (isColResizing.value) {
        e.stopPropagation();
        return;
      }
      const dom = tableContainerRef.value;
      if (!dom)
        return;
      const { deltaY, deltaX } = e;
      if (deltaY)
        dom.scrollTop += deltaY;
      if (deltaX)
        dom.scrollLeft += deltaX;
    }
    function onTableScroll(e) {
      if (!(e == null ? void 0 : e.target))
        return;
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
      if (currentHoverRow === row)
        return;
      currentHoverRow = row;
      currentHoverRowKey.value = rowKeyGen(row);
    }
    function setCurrentRow(rowKey, option = { silent: false }) {
      if (!dataSourceCopy.value.length)
        return;
      currentRow.value = dataSourceCopy.value.find((it) => rowKeyGen(it) === rowKey);
      currentRowKey.value = rowKeyGen(currentRow.value);
      if (!option.silent) {
        emits(
          "current-change",
          /** no Event */
          null,
          currentRow.value,
          { select: Boolean(currentRowKey.value) }
        );
      }
    }
    function setSorter(dataIndex, order, option = {}) {
      var _a;
      const newOption = { silent: true, sortOption: null, sort: true, ...option };
      sortCol.value = dataIndex;
      sortOrderIndex.value = sortSwitchOrder.indexOf(order);
      if (newOption.sort && ((_a = dataSourceCopy.value) == null ? void 0 : _a.length)) {
        const column = newOption.sortOption || tableHeaderLast.value.find((it) => it.dataIndex === sortCol.value);
        if (column)
          onColumnSort(column, false, { force: option.force ?? true, emit: !newOption.silent });
        else
          console.warn("Can not find column by dataIndex:", sortCol.value);
      }
      return dataSourceCopy.value;
    }
    function resetSorter() {
      sortCol.value = null;
      sortOrderIndex.value = 0;
      dataSourceCopy.value = [...props.dataSource];
    }
    function scrollTo(top = 0, left = 0) {
      if (!tableContainerRef.value)
        return;
      if (top !== null)
        tableContainerRef.value.scrollTop = top;
      if (left !== null)
        tableContainerRef.value.scrollLeft = left;
    }
    function getTableData() {
      return toRaw(dataSourceCopy.value);
    }
    function getSortColumns() {
      const sortOrder = sortSwitchOrder[sortOrderIndex.value];
      if (!sortOrder)
        return [];
      return [{ dataIndex: sortCol.value, order: sortOrder }];
    }
    __expose({
      /** 初始化横向纵向虚拟滚动 */
      initVirtualScroll,
      /** 初始化横向虚拟滚动 */
      initVirtualScrollX,
      /** 初始化纵向虚拟滚动 */
      initVirtualScrollY,
      /** 设置当前选中行 */
      setCurrentRow,
      /** 设置高亮渐暗单元格 */
      setHighlightDimCell,
      /** 设置高亮渐暗行 */
      setHighlightDimRow,
      /** 表格排序列dataIndex */
      sortCol,
      /** 获取当前排序状态 */
      getSortColumns,
      /** 设置排序 */
      setSorter,
      /** 重置排序 */
      resetSorter,
      /** 滚动至 */
      scrollTo,
      /** 获取表格数据 */
      getTableData
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "tableContainerRef",
        ref: tableContainerRef,
        class: normalizeClass(["stk-table", {
          virtual: _ctx.virtual,
          "virtual-x": _ctx.virtualX,
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
          "text-overflow": props.showOverflow,
          "header-text-overflow": props.showHeaderOverflow,
          "fixed-relative-mode": isRelativeMode.value
        }]),
        style: normalizeStyle({
          "--row-height": unref(virtualScroll).rowHeight + "px",
          "--header-row-height": (props.headerRowHeight || props.rowHeight) + "px",
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
          !_ctx.headless ? (openBlock(), createElementBlock("thead", _hoisted_1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(tableHeaders.value, (row, rowIndex) => {
              return openBlock(), createElementBlock("tr", {
                key: rowIndex,
                onContextmenu: _cache[3] || (_cache[3] = (e) => onHeaderMenu(e))
              }, [
                unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                  key: 0,
                  class: "virtual-x-left",
                  style: normalizeStyle({
                    minWidth: unref(virtualScrollX).offsetLeft + "px",
                    width: unref(virtualScrollX).offsetLeft + "px"
                  })
                }, null, 4)) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_on) && rowIndex === tableHeaders.value.length - 1 ? unref(virtualX_columnPart) : row, (col, colIndex) => {
                  return openBlock(), createElementBlock("th", {
                    key: col.dataIndex,
                    "data-col-key": colKeyGen.value(col),
                    draggable: unref(isHeaderDraggable)(col) ? "true" : "false",
                    rowspan: unref(virtualX_on) ? 1 : col.rowSpan,
                    colspan: col.colSpan,
                    style: normalizeStyle(cellStyleMap.value[unref(TagType).TH].get(colKeyGen.value(col))),
                    title: getHeaderTitle(col),
                    class: normalizeClass([
                      col.sorter ? "sortable" : "",
                      col.dataIndex === unref(sortCol) && unref(sortOrderIndex) !== 0 && "sorter-" + sortSwitchOrder[unref(sortOrderIndex)],
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
                    createElementVNode("div", _hoisted_3, [
                      col.customHeaderCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customHeaderCell), {
                        key: 0,
                        col
                      }, null, 8, ["col"])) : col.type === "seq" ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(col.title), 1)) : renderSlot(_ctx.$slots, "tableHeader", {
                        key: 2,
                        col
                      }, () => [
                        createElementVNode("span", _hoisted_5, toDisplayString(col.title), 1)
                      ]),
                      col.sorter ? (openBlock(), createElementBlock("span", _hoisted_6, _hoisted_8)) : createCommentVNode("", true),
                      _ctx.colResizable && colIndex > 0 ? (openBlock(), createElementBlock("div", {
                        key: 4,
                        class: "table-header-resizer left",
                        onMousedown: (e) => unref(onThResizeMouseDown)(e, col, true)
                      }, null, 40, _hoisted_9)) : createCommentVNode("", true),
                      _ctx.colResizable ? (openBlock(), createElementBlock("div", {
                        key: 5,
                        class: "table-header-resizer right",
                        onMousedown: (e) => unref(onThResizeMouseDown)(e, col)
                      }, null, 40, _hoisted_10)) : createCommentVNode("", true)
                    ])
                  ], 46, _hoisted_2);
                }), 128)),
                unref(virtualX_on) ? (openBlock(), createElementBlock("th", {
                  key: 1,
                  class: "virtual-x-right",
                  style: normalizeStyle({
                    minWidth: unref(virtualX_offsetRight) + "px",
                    width: unref(virtualX_offsetRight) + "px"
                  })
                }, null, 4)) : createCommentVNode("", true)
              ], 32);
            }), 128))
          ])) : createCommentVNode("", true),
          unref(virtual_on) ? (openBlock(), createElementBlock("tbody", _hoisted_11, [
            createElementVNode("tr", {
              style: normalizeStyle({ height: `${unref(virtualScroll).offsetTop}px` }),
              class: "padding-top-tr"
            }, [
              unref(virtualX_on) && _ctx.fixedMode && _ctx.headless ? (openBlock(), createElementBlock("td", _hoisted_12)) : createCommentVNode("", true),
              _ctx.fixedMode && _ctx.headless ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(unref(virtualX_columnPart), (col) => {
                return openBlock(), createElementBlock("td", {
                  key: col.dataIndex,
                  style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen.value(col)))
                }, null, 4);
              }), 128)) : createCommentVNode("", true)
            ], 4)
          ])) : createCommentVNode("", true),
          createElementVNode("tbody", _hoisted_13, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtual_dataSourcePart), (row, rowIndex) => {
              return openBlock(), createElementBlock("tr", {
                id: unref(stkTableId) + "-" + (_ctx.rowKey ? rowKeyGen(row) : rowIndex),
                key: _ctx.rowKey ? rowKeyGen(row) : rowIndex,
                "data-row-key": _ctx.rowKey ? rowKeyGen(row) : rowIndex,
                class: normalizeClass({
                  active: _ctx.rowKey ? rowKeyGen(row) === rowKeyGen(currentRow.value) : row === currentRow.value,
                  hover: props.showTrHoverClass && (_ctx.rowKey ? rowKeyGen(row) === currentHoverRowKey.value : row === currentHoverRowKey.value),
                  [_ctx.rowClassName(row, rowIndex)]: true
                }),
                onClick: (e) => onRowClick(e, row),
                onDblclick: (e) => onRowDblclick(e, row),
                onContextmenu: (e) => onRowMenu(e, row),
                onMouseover: (e) => onTrMouseOver(e, row)
              }, [
                unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_15)) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col, colIndex) => {
                  return openBlock(), createElementBlock("td", {
                    key: col.dataIndex,
                    "data-index": col.dataIndex,
                    style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen.value(col))),
                    class: normalizeClass([col.className, unref(fixedColClassMap).get(colKeyGen.value(col)), col.type === "seq" ? "seq-column" : ""]),
                    onClick: (e) => onCellClick(e, row, col),
                    onMouseenter: (e) => onCellMouseEnter(e, row, col),
                    onMouseleave: (e) => onCellMouseLeave(e, row, col),
                    onMouseover: (e) => onCellMouseOver(e, row, col)
                  }, [
                    col.customCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customCell), {
                      key: 0,
                      col,
                      row,
                      rowIndex,
                      colIndex,
                      cellValue: row[col.dataIndex]
                    }, null, 8, ["col", "row", "rowIndex", "colIndex", "cellValue"])) : (openBlock(), createElementBlock("div", {
                      key: 1,
                      class: "table-cell-wrapper",
                      title: !col.type ? row[col.dataIndex] : ""
                    }, [
                      col.type === "seq" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString((props.seqConfig.startIndex || 0) + rowIndex + 1), 1)
                      ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                        createTextVNode(toDisplayString(row[col.dataIndex] ?? getEmptyCellText.value(col, row)), 1)
                      ], 64))
                    ], 8, _hoisted_17))
                  ], 46, _hoisted_16);
                }), 128))
              ], 42, _hoisted_14);
            }), 128))
          ]),
          unref(virtual_on) ? (openBlock(), createElementBlock("tbody", _hoisted_18, [
            createElementVNode("tr", {
              style: normalizeStyle({ height: `${unref(virtual_offsetBottom)}px` })
            }, null, 4)
          ])) : createCommentVNode("", true)
        ], 6),
        (!dataSourceCopy.value || !dataSourceCopy.value.length) && _ctx.showNoData ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(["stk-table-no-data", { "no-data-full": _ctx.noDataFull }])
        }, [
          renderSlot(_ctx.$slots, "empty", {}, () => [
            createTextVNode("暂无数据")
          ])
        ], 2)) : createCommentVNode("", true)
      ], 38);
    };
  }
});
export {
  _sfc_main as StkTable,
  insertToOrderedArray,
  tableSort
};
