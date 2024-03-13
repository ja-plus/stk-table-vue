import { onMounted, onBeforeUnmount, watch, ref, shallowRef, computed, defineComponent, toRaw, openBlock, createElementBlock, normalizeClass, unref, normalizeStyle, withDirectives, createElementVNode, vShow, Fragment, renderList, createCommentVNode, createBlock, resolveDynamicComponent, renderSlot, toDisplayString, createTextVNode } from "vue";
import { interpolateRgb } from "d3-interpolate";
const DEFAULT_COL_WIDTH = "100";
const DEFAULT_TABLE_HEIGHT = 100;
const DEFAULT_TABLE_WIDTH = 200;
const DEFAULT_ROW_HEIGHT = 28;
const HIGHLIGHT_COLOR = {
  light: { from: "#71a2fd", to: "#fff" },
  dark: { from: "#1e4c99", to: "#181c21" }
};
const HIGHLIGHT_DURATION = 2e3;
const HIGHLIGHT_FREQ = 100;
const HIGHLIGHT_ROW_CLASS = "highlight-row";
const HIGHLIGHT_CELL_CLASS = "highlight-cell";
let _chromeVersion = 0;
try {
  const userAgent = navigator.userAgent.match(/chrome\/\d+/i);
  if (userAgent) {
    _chromeVersion = +userAgent[0].split("/")[1];
  }
} catch (e) {
  console.error("Cannot get Chrome version", e);
}
const IS_LEGACY_MODE = _chromeVersion < 56;
var TagType = /* @__PURE__ */ ((TagType2) => {
  TagType2[TagType2["TH"] = 0] = "TH";
  TagType2[TagType2["TD"] = 1] = "TD";
  return TagType2;
})(TagType || {});
function useAutoResize({ tableContainer, initVirtualScroll, props, debounceMs }) {
  let resizeObserver = null;
  onMounted(() => {
    initResizeObserver();
  });
  onBeforeUnmount(() => {
    removeResizeObserver();
  });
  function initResizeObserver() {
    if (window.ResizeObserver) {
      if (!tableContainer.value) {
        const watchDom = watch(
          () => tableContainer,
          () => {
            initResizeObserver();
            watchDom();
          }
        );
        return;
      }
      resizeObserver = new ResizeObserver(resizeCallback);
      resizeObserver.observe(tableContainer.value);
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
function isEmptyValue(val, isNumber) {
  let isEmpty = val === null || val === "";
  if (isNumber) {
    isEmpty || (isEmpty = typeof val === "boolean" || Number.isNaN(+val));
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
  const val = (col == null ? void 0 : col.width) ?? DEFAULT_COL_WIDTH;
  if (typeof val === "number") {
    return Math.floor(val);
  }
  return parseInt(val);
}
function getColWidthStr(col, key = "width") {
  const val = col == null ? void 0 : col[key];
  if (typeof val === "number") {
    return val + "px";
  }
  return val;
}
function useColResize({
  tableContainer,
  tableHeaderLast,
  colResizeIndicator,
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
    if (!tableContainer.value)
      return;
    e.stopPropagation();
    e.preventDefault();
    const { clientX } = e;
    const { scrollLeft, scrollTop } = tableContainer.value;
    const { left } = tableContainer.value.getBoundingClientRect();
    let colIndex = tableHeaderLast.value.findIndex((it) => colKeyGen(it) === colKeyGen(col));
    if (isPrev) {
      colIndex -= 1;
      col = tableHeaderLast.value[colIndex];
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
    if (colResizeIndicator.value) {
      const style = colResizeIndicator.value.style;
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
    const currentColWidth = getColWidth(lastCol);
    if (currentColWidth + moveX < props.colMinWidth) {
      moveX = -currentColWidth;
    }
    const offsetTableX = startOffsetTableX + moveX;
    if (!colResizeIndicator.value)
      return;
    colResizeIndicator.value.style.left = offsetTableX + "px";
  }
  function onThResizeMouseUp(e) {
    if (!isColResizing.value)
      return;
    const { startX, lastCol } = colResizeState;
    const { clientX } = e;
    const moveX = clientX - startX;
    let width = getColWidth(lastCol) + moveX;
    if (width < props.colMinWidth)
      width = props.colMinWidth;
    const curCol = tableHeaderLast.value.find((it) => colKeyGen(it) === colKeyGen(lastCol));
    if (!curCol)
      return;
    curCol.width = width + "px";
    emits("update:columns", [...props.columns]);
    if (colResizeIndicator.value) {
      const style = colResizeIndicator.value.style;
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
    onThResizeMouseDown,
    onThResizeMouseMove,
    onThResizeMouseUp
  };
}
function useFixedCol({ props, colKeyGen, tableHeaders, tableHeaderLast, tableContainer }) {
  const fixedShadow = ref({
    showL: false,
    showR: false
  });
  const fixedShadowCols = shallowRef([]);
  const fixedColClassMap = computed(() => {
    const colMap = /* @__PURE__ */ new Map();
    tableHeaders.value.forEach((cols) => {
      cols.forEach((col) => {
        const { showR, showL } = fixedShadow.value;
        const showShadow = props.fixedColShadow && col.fixed && (showL && col.fixed === "left" || showR && col.fixed === "right") && fixedShadowCols.value.includes(col);
        const classObj = {
          "fixed-cell": col.fixed,
          ["fixed-cell--" + col.fixed]: col.fixed,
          "fixed-cell--shadow": showShadow
        };
        colMap.set(colKeyGen(col), classObj);
      });
    });
    return colMap;
  });
  function dealFixedColShadow() {
    if (!props.fixedColShadow)
      return;
    fixedShadowCols.value = [];
    let lastLeftCol = null;
    for (let i = tableHeaderLast.value.length - 1; i >= 0; i--) {
      const col = tableHeaderLast.value[i];
      if (col.fixed === "left") {
        lastLeftCol = col;
        break;
      }
    }
    let node = { __PARENT__: lastLeftCol };
    while (node = node.__PARENT__) {
      if (node.fixed) {
        fixedShadowCols.value.push(node);
      }
    }
    const lastRightCol = tableHeaderLast.value.find((it) => it.fixed === "right");
    node = { __PARENT__: lastRightCol };
    while (node = node.__PARENT__) {
      if (node.fixed) {
        fixedShadowCols.value.push(node);
      }
    }
  }
  function updateFixedShadow() {
    if (!props.fixedColShadow)
      return;
    const { clientWidth, scrollWidth, scrollLeft } = tableContainer.value;
    fixedShadow.value.showL = Boolean(scrollLeft);
    fixedShadow.value.showR = Math.abs(scrollWidth - scrollLeft - clientWidth) > 0.5;
  }
  return {
    /** 固定列class */
    fixedColClassMap,
    /** 处理固定列阴影 */
    dealFixedColShadow,
    /** 滚动条变化时，更新需要展示阴影的列 */
    updateFixedShadow
  };
}
function useFixedStyle({
  props,
  tableHeaders,
  virtualScroll,
  virtualScrollX,
  virtualX_on,
  virtualX_offsetRight
}) {
  const fixedColumnsPositionStore = computed(() => {
    const colKeyStore = {};
    const refStore = /* @__PURE__ */ new WeakMap();
    tableHeaders.value.forEach((cols) => {
      let left = 0;
      let rightStartIndex = 0;
      for (let i = 0; i < cols.length; i++) {
        const item = cols[i];
        if (item.fixed === "left") {
          if (item.dataIndex) {
            colKeyStore[item.dataIndex] = left;
          } else {
            refStore.set(item, left);
          }
          left += getColWidth(item);
        }
        if (!rightStartIndex && item.fixed === "right") {
          rightStartIndex = i;
        }
      }
      let right = 0;
      for (let i = cols.length - 1; i >= rightStartIndex; i--) {
        const item = cols[i];
        if (item.fixed === "right") {
          if (item.dataIndex) {
            colKeyStore[item.dataIndex] = right;
          } else {
            refStore.set(item, right);
          }
          right += getColWidth(item);
        }
      }
    });
    return { refStore, colKeyStore };
  });
  function getFixedStyle(tagType, col, depth = 0) {
    const { fixed } = col;
    const isFixedLeft = fixed === "left";
    const style = {};
    const { colKeyStore, refStore } = fixedColumnsPositionStore.value;
    if (IS_LEGACY_MODE) {
      style.position = "relative";
    } else {
      style.position = "sticky";
    }
    if (tagType === TagType.TH) {
      if (IS_LEGACY_MODE) {
        style.top = virtualScroll.value.scrollTop + depth * props.rowHeight + "px";
      } else {
        style.top = depth * props.rowHeight + "px";
      }
      style.zIndex = isFixedLeft ? "5" : "4";
    } else {
      style.zIndex = isFixedLeft ? "3" : "2";
    }
    if (fixed === "left" || fixed === "right") {
      if (IS_LEGACY_MODE) {
        if (isFixedLeft) {
          if (virtualX_on.value)
            style.left = virtualScrollX.value.scrollLeft - virtualScrollX.value.offsetLeft + "px";
          else
            style.left = virtualScrollX.value.scrollLeft + "px";
        } else {
          style.right = `${virtualX_offsetRight.value}px`;
        }
      } else {
        const lr = (col.dataIndex ? colKeyStore[col.dataIndex] : refStore.get(col)) + "px";
        if (isFixedLeft) {
          style.left = lr;
        } else {
          style.right = lr;
        }
      }
    }
    return style;
  }
  return {
    getFixedStyle
  };
}
function useHighlight({ props, tableContainer }) {
  var _a, _b;
  const config = props.highlightConfig;
  const highlightRowStore = ref({});
  const duration = config.duration ? config.duration * 1e3 : HIGHLIGHT_DURATION;
  const frequency = config.fps ? 1e3 / config.fps : HIGHLIGHT_FREQ;
  const highlightColor = {
    light: Object.assign(HIGHLIGHT_COLOR.light, (_a = config.color) == null ? void 0 : _a.light),
    dark: Object.assign(HIGHLIGHT_COLOR.dark, (_b = config.color) == null ? void 0 : _b.dark)
  };
  const highlightFrom = computed(() => highlightColor[props.theme].from);
  const highlightTo = computed(() => highlightColor[props.theme].to);
  const highlightInter = computed(() => interpolateRgb(highlightFrom.value, highlightTo.value));
  const highlightDimRowKeys = /* @__PURE__ */ new Set();
  const highlightDimRowsTimeout = /* @__PURE__ */ new Map();
  const highlightDimCellsTimeout = /* @__PURE__ */ new Map();
  let calcHighlightDimLoop = false;
  function calcHighlightLoop() {
    if (calcHighlightDimLoop)
      return;
    calcHighlightDimLoop = true;
    const recursion = () => {
      window.setTimeout(() => {
        const nowTs = Date.now();
        highlightDimRowKeys.forEach((rowKeyValue) => {
          const highlightItem = highlightRowStore.value[rowKeyValue];
          const progress = (nowTs - highlightItem.bgc_progress_ms) / duration;
          if (0 < progress && progress < 1) {
            highlightItem.bgc = highlightInter.value(progress);
          } else {
            highlightItem.bgc = "";
            highlightDimRowKeys.delete(rowKeyValue);
          }
        });
        highlightRowStore.value = { ...highlightRowStore.value };
        if (highlightDimRowKeys.size > 0) {
          recursion();
        } else {
          calcHighlightDimLoop = false;
        }
      }, frequency);
    };
    recursion();
  }
  function setHighlightDimCell(rowKeyValue, dataIndex, option = {}) {
    var _a2;
    const cellEl = (_a2 = tableContainer.value) == null ? void 0 : _a2.querySelector(`[data-row-key="${rowKeyValue}"]>[data-index="${dataIndex}"]`);
    const opt = { className: HIGHLIGHT_CELL_CLASS, ...option };
    if (!cellEl)
      return;
    if (cellEl.classList.contains(opt.className)) {
      cellEl.classList.remove(opt.className);
      void cellEl.offsetHeight;
    }
    cellEl.classList.add(opt.className);
    window.clearTimeout(highlightDimCellsTimeout.get(rowKeyValue));
    highlightDimCellsTimeout.set(
      rowKeyValue,
      window.setTimeout(() => {
        cellEl.classList.remove(opt.className);
        highlightDimCellsTimeout.delete(rowKeyValue);
      }, duration)
    );
  }
  function setHighlightDimRow(rowKeyValues, option = {}) {
    var _a2, _b2;
    if (!Array.isArray(rowKeyValues))
      rowKeyValues = [rowKeyValues];
    const { className, useCss } = { className: HIGHLIGHT_ROW_CLASS, useCss: false, ...option };
    if (props.virtual && !useCss) {
      const nowTs = Date.now();
      for (let i = 0; i < rowKeyValues.length; i++) {
        const rowKeyValue = rowKeyValues[i];
        highlightRowStore.value[rowKeyValue] = {
          bgc: highlightFrom.value,
          bgc_progress: 0,
          bgc_progress_ms: nowTs
        };
        highlightDimRowKeys.add(rowKeyValue);
      }
      calcHighlightLoop();
    } else {
      let needRepaint = false;
      const rowElTemp = [];
      for (let i = 0; i < rowKeyValues.length; i++) {
        const rowKeyValue = rowKeyValues[i];
        const rowEl = (_a2 = tableContainer.value) == null ? void 0 : _a2.querySelector(`[data-row-key="${rowKeyValue}"]`);
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
        void ((_b2 = tableContainer.value) == null ? void 0 : _b2.offsetWidth);
      }
      rowElTemp.forEach((el) => el.classList.add(className));
    }
  }
  return {
    highlightRowStore,
    highlightFrom,
    setHighlightDimRow,
    setHighlightDimCell
  };
}
const SCROLL_CODES = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "PageUp", "PageDown"];
function useKeyboardArrowScroll(targetElement, { props, scrollTo, virtualScroll, virtualScrollX, tableHeaders }) {
  let isMouseOver = false;
  onMounted(() => {
    var _a, _b, _c;
    window.addEventListener("keydown", handleKeydown);
    (_a = targetElement.value) == null ? void 0 : _a.addEventListener("mouseenter", handleMouseEnter);
    (_b = targetElement.value) == null ? void 0 : _b.addEventListener("mouseleave", handleMouseLeave);
    (_c = targetElement.value) == null ? void 0 : _c.addEventListener("mousedown", handleMouseDown);
  });
  onBeforeUnmount(() => {
    var _a, _b, _c;
    window.removeEventListener("keydown", handleKeydown);
    (_a = targetElement.value) == null ? void 0 : _a.removeEventListener("mouseenter", handleMouseEnter);
    (_b = targetElement.value) == null ? void 0 : _b.removeEventListener("mouseleave", handleMouseLeave);
    (_c = targetElement.value) == null ? void 0 : _c.removeEventListener("mousedown", handleMouseDown);
  });
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
  tableContainer,
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
    return dataSourceCopy.value.slice(startIndex, endIndex);
  });
  const virtual_offsetBottom = computed(() => {
    if (!virtual_on.value)
      return 0;
    const { startIndex, rowHeight } = virtualScroll.value;
    return (dataSourceCopy.value.length - startIndex - virtual_dataSourcePart.value.length) * rowHeight;
  });
  const virtualX_on = computed(() => {
    return props.virtualX && tableHeaderLast.value.reduce((sum, col) => sum += getColWidth(col), 0) > virtualScrollX.value.containerWidth + 100;
  });
  const virtualX_columnPart = computed(() => {
    if (virtualX_on.value) {
      const leftCols = [];
      const rightCols = [];
      const { startIndex, endIndex } = virtualScrollX.value;
      for (let i = 0; i < startIndex; i++) {
        const col = tableHeaderLast.value[i];
        if (col.fixed === "left")
          leftCols.push(col);
      }
      for (let i = endIndex; i < tableHeaderLast.value.length; i++) {
        const col = tableHeaderLast.value[i];
        if (col.fixed === "right")
          rightCols.push(col);
      }
      const mainColumns = tableHeaderLast.value.slice(startIndex, endIndex);
      return leftCols.concat(mainColumns).concat(rightCols);
    }
    return tableHeaderLast.value;
  });
  const virtualX_offsetRight = computed(() => {
    if (!virtualX_on.value)
      return 0;
    let width = 0;
    for (let i = virtualScrollX.value.endIndex; i < tableHeaderLast.value.length; i++) {
      const col = tableHeaderLast.value[i];
      if (col.fixed !== "right") {
        width += getColWidth(col);
      }
    }
    return width;
  });
  function initVirtualScrollY(height) {
    if (!virtual_on.value)
      return;
    const { offsetHeight, scrollTop } = tableContainer.value || {};
    const { rowHeight } = virtualScroll.value;
    let containerHeight;
    if (typeof height === "number") {
      containerHeight = height;
    } else {
      containerHeight = offsetHeight || DEFAULT_TABLE_HEIGHT;
    }
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
    if (!props.virtualX)
      return;
    const { offsetWidth, scrollLeft } = tableContainer.value || {};
    virtualScrollX.value.containerWidth = offsetWidth || DEFAULT_TABLE_WIDTH;
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
    let startIndex = Math.floor(sTop / rowHeight);
    if (props.stripe) {
      startIndex -= 1;
    }
    if (startIndex < 0) {
      startIndex = 0;
    }
    if (props.stripe && startIndex !== 0) {
      const scrollRows = Math.abs(oldStartIndex - startIndex);
      if (scrollRows < 2) {
        return;
      } else if (scrollRows % 2) {
        startIndex -= 1;
      }
    }
    let endIndex = startIndex + pageSize;
    if (props.stripe) {
      endIndex += 2;
    }
    const offsetTop = startIndex * rowHeight;
    if (endIndex > dataSourceCopy.value.length) {
      endIndex = dataSourceCopy.value.length;
    }
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
    var _a;
    const headerLength = (_a = tableHeaderLast.value) == null ? void 0 : _a.length;
    const { scrollLeft } = virtualScrollX.value;
    if (!headerLength)
      return;
    let startIndex = 0;
    let offsetLeft = 0;
    let colWidthSum = 0;
    let leftColWidthSum = 0;
    for (let colIndex = 0; colIndex < headerLength; colIndex++) {
      startIndex++;
      const col = tableHeaderLast.value[colIndex];
      const colWidth = getColWidth(col);
      if (col.fixed === "left") {
        leftColWidthSum += colWidth;
        continue;
      }
      colWidthSum += colWidth;
      if (colWidthSum >= sLeft) {
        offsetLeft = colWidthSum - colWidth;
        startIndex--;
        break;
      }
    }
    colWidthSum = 0;
    const containerWidth = virtualScrollX.value.containerWidth - leftColWidthSum;
    let endIndex = headerLength;
    for (let colIndex = startIndex + 1; colIndex < headerLength; colIndex++) {
      const col = tableHeaderLast.value[colIndex];
      colWidthSum += getColWidth(col);
      if (colWidthSum >= containerWidth) {
        endIndex = colIndex + 1;
        break;
      }
    }
    if (endIndex > headerLength) {
      endIndex = headerLength;
    }
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
const _hoisted_4 = { class: "table-header-title" };
const _hoisted_5 = {
  key: 2,
  class: "table-header-sorter"
};
const _hoisted_6 = /* @__PURE__ */ createElementVNode("svg", {
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
const _hoisted_7 = [
  _hoisted_6
];
const _hoisted_8 = ["onMousedown"];
const _hoisted_9 = ["onMousedown"];
const _hoisted_10 = {
  key: 0,
  class: "virtual-x-left",
  style: { "padding": "0" }
};
const _hoisted_11 = ["data-row-key", "onClick", "onDblclick", "onContextmenu", "onMouseover"];
const _hoisted_12 = {
  key: 0,
  class: "virtual-x-left",
  style: { "padding": "0" }
};
const _hoisted_13 = ["data-index", "onClick"];
const _hoisted_14 = ["title"];
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
    highlightConfig: { default: () => ({}) }
  },
  emits: ["sort-change", "row-click", "current-change", "row-dblclick", "header-row-menu", "row-menu", "cell-click", "header-cell-click", "scroll", "scroll-x", "col-order-change", "th-drag-start", "th-drop", "update:columns"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const tableContainer = ref();
    const colResizeIndicator = ref();
    const currentItem = ref(null);
    const currentItemKey = ref(null);
    const currentHover = ref(null);
    let sortCol = ref();
    let sortOrderIndex = ref(0);
    const sortSwitchOrder = [null, "desc", "asc"];
    const tableHeaders = ref([]);
    const tableHeaderLast = ref([]);
    const dataSourceCopy = shallowRef([...props.dataSource]);
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
      colResizeIndicator,
      tableContainer,
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
    } = useVirtualScroll({ tableContainer, props, dataSourceCopy, tableHeaderLast, tableHeaders });
    const { getFixedStyle } = useFixedStyle({
      props,
      tableHeaders,
      virtualScroll,
      virtualScrollX,
      virtualX_on,
      virtualX_offsetRight
    });
    const { highlightRowStore, highlightFrom, setHighlightDimCell, setHighlightDimRow } = useHighlight({ props, tableContainer });
    if (props.autoResize) {
      useAutoResize({ tableContainer, initVirtualScroll, props, debounceMs: 200 });
    }
    useKeyboardArrowScroll(tableContainer, {
      props,
      scrollTo,
      virtualScroll,
      virtualScrollX,
      tableHeaders
    });
    const { fixedColClassMap, dealFixedColShadow, updateFixedShadow } = useFixedCol({
      props,
      colKeyGen,
      tableContainer,
      tableHeaders,
      tableHeaderLast
    });
    watch(
      () => props.columns,
      () => {
        dealColumns();
        initVirtualScrollX();
      }
    );
    dealColumns();
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
        updateFixedShadow();
      },
      {
        deep: false
      }
    );
    watch(() => props.fixedColShadow, dealFixedColShadow);
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
      tableHeaders.value = [];
      tableHeaderLast.value = [];
      const copyColumn = props.columns;
      const deep = howDeepTheHeader(copyColumn);
      const tempHeaderLast = [];
      if (deep > 1 && props.virtualX) {
        console.error("多级表头不支持横向虚拟滚动");
      }
      function flat(arr, parent, depth = 0) {
        if (!tableHeaders.value[depth]) {
          tableHeaders.value[depth] = [];
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
          tableHeaders.value[depth].push(col);
          const rowSpan = col.children ? 1 : deep - depth;
          const colSpan = colChildrenLen;
          if (rowSpan !== 1) {
            col.rowSpan = rowSpan;
          }
          if (colSpan !== 1) {
            col.colSpan = colSpan;
          }
          if (!props.fixedMode && col.width === void 0) {
            col.width = colWidth + "px";
          }
          allChildrenLen += colChildrenLen;
          allChildrenWidthSum += colWidth;
        });
        return [allChildrenLen, allChildrenWidthSum];
      }
      flat(copyColumn, null);
      tableHeaderLast.value = tempHeaderLast;
      dealFixedColShadow();
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
    function colKeyGen(col) {
      return typeof props.colKey === "function" ? props.colKey(col) : col[props.colKey];
    }
    const cellStyleMap = computed(() => {
      const thMap = /* @__PURE__ */ new Map();
      const tdMap = /* @__PURE__ */ new Map();
      tableHeaders.value.forEach((cols, depth) => {
        cols.forEach((col) => {
          const colKey = colKeyGen(col);
          const width = getColWidthStr(col);
          const style = {
            width
          };
          if (props.colResizable) {
            style.minWidth = width;
            style.maxWidth = width;
          } else {
            style.minWidth = getColWidthStr(col, "minWidth") ?? width;
            style.maxWidth = getColWidthStr(col, "maxWidth") ?? width;
          }
          const thStyle = {
            ...style,
            ...getFixedStyle(TagType.TH, col, depth),
            textAlign: col.headerAlign
          };
          const tdStyle = {
            ...style,
            ...getFixedStyle(TagType.TD, col, depth),
            textAlign: col.align
          };
          thMap.set(colKey, thStyle);
          tdMap.set(colKey, tdStyle);
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
      if (props.rowKey ? currentItemKey.value === rowKeyGen(row) : currentItem.value === row)
        return;
      currentItem.value = row;
      currentItemKey.value = rowKeyGen(row);
      emits("current-change", e, row);
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
    function onTableWheel(e) {
      if (isColResizing.value) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }
    function onTableScroll(e) {
      if (!(e == null ? void 0 : e.target))
        return;
      const { scrollTop, scrollLeft } = e.target;
      const { scrollTop: vScrollTop } = virtualScroll.value;
      const { scrollLeft: vScrollLeft } = virtualScrollX.value;
      const isYScroll = scrollTop !== vScrollTop;
      const isXScroll = scrollLeft !== vScrollLeft;
      if (isYScroll && virtual_on.value) {
        updateVirtualScrollY(scrollTop);
      }
      if (isXScroll) {
        updateFixedShadow();
        if (virtualX_on.value) {
          updateVirtualScrollX(scrollLeft);
        } else {
          virtualScrollX.value.scrollLeft = scrollLeft;
        }
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
      if (props.showTrHoverClass) {
        currentHover.value = rowKeyGen(row);
      }
    }
    function setCurrentRow(rowKey, option = { silent: false }) {
      if (!dataSourceCopy.value.length)
        return;
      currentItem.value = dataSourceCopy.value.find((it) => rowKeyGen(it) === rowKey);
      currentItemKey.value = rowKeyGen(currentItem.value);
      if (!option.silent) {
        emits("current-change", null, currentItem.value);
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
      if (!tableContainer.value)
        return;
      if (top !== null)
        tableContainer.value.scrollTop = top;
      if (left !== null)
        tableContainer.value.scrollLeft = left;
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
        ref_key: "tableContainer",
        ref: tableContainer,
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
          stripe: props.stripe
        }]),
        style: normalizeStyle([
          _ctx.virtual && {
            "--row-height": unref(virtualScroll).rowHeight + "px",
            "--header-row-height": (props.headerRowHeight || props.rowHeight) + "px"
          },
          {
            "--highlight-color": props.highlightConfig.color && unref(highlightFrom),
            "--highlight-duration": props.highlightConfig.duration && props.highlightConfig.duration + "s"
          }
        ]),
        onScroll: onTableScroll,
        onWheel: onTableWheel
      }, [
        withDirectives(createElementVNode("div", {
          ref_key: "colResizeIndicator",
          ref: colResizeIndicator,
          class: "column-resize-indicator"
        }, null, 512), [
          [vShow, _ctx.colResizable]
        ]),
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
                    "data-col-key": colKeyGen(col),
                    draggable: unref(isHeaderDraggable)(col) ? "true" : "false",
                    rowspan: unref(virtualX_on) ? 1 : col.rowSpan,
                    colspan: col.colSpan,
                    style: normalizeStyle(cellStyleMap.value[unref(TagType).TH].get(colKeyGen(col))),
                    title: getHeaderTitle(col),
                    class: normalizeClass([
                      col.sorter ? "sortable" : "",
                      col.dataIndex === unref(sortCol) && unref(sortOrderIndex) !== 0 && "sorter-" + sortSwitchOrder[unref(sortOrderIndex)],
                      _ctx.showHeaderOverflow ? "text-overflow" : "",
                      col.headerClassName,
                      unref(fixedColClassMap).get(colKeyGen(col))
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
                      }, null, 8, ["col"])) : renderSlot(_ctx.$slots, "tableHeader", {
                        key: 1,
                        col
                      }, () => [
                        createElementVNode("span", _hoisted_4, toDisplayString(col.title), 1)
                      ]),
                      col.sorter ? (openBlock(), createElementBlock("span", _hoisted_5, _hoisted_7)) : createCommentVNode("", true),
                      _ctx.colResizable && colIndex > 0 ? (openBlock(), createElementBlock("div", {
                        key: 3,
                        class: "table-header-resizer left",
                        onMousedown: (e) => unref(onThResizeMouseDown)(e, col, true)
                      }, null, 40, _hoisted_8)) : createCommentVNode("", true),
                      _ctx.colResizable ? (openBlock(), createElementBlock("div", {
                        key: 4,
                        class: "table-header-resizer right",
                        onMousedown: (e) => unref(onThResizeMouseDown)(e, col)
                      }, null, 40, _hoisted_9)) : createCommentVNode("", true)
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
          createElementVNode("tbody", null, [
            unref(virtual_on) ? (openBlock(), createElementBlock("tr", {
              key: 0,
              style: normalizeStyle({ height: `${unref(virtualScroll).offsetTop}px` }),
              class: "padding-top-tr"
            }, [
              unref(virtualX_on) && _ctx.fixedMode && _ctx.headless ? (openBlock(), createElementBlock("td", _hoisted_10)) : createCommentVNode("", true),
              _ctx.fixedMode && _ctx.headless ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(unref(virtualX_columnPart), (col) => {
                return openBlock(), createElementBlock("td", {
                  key: col.dataIndex,
                  style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen(col)))
                }, null, 4);
              }), 128)) : createCommentVNode("", true)
            ], 4)) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtual_dataSourcePart), (row, i) => {
              var _a;
              return openBlock(), createElementBlock("tr", {
                key: _ctx.rowKey ? rowKeyGen(row) : i,
                "data-row-key": _ctx.rowKey ? rowKeyGen(row) : i,
                class: normalizeClass({
                  active: _ctx.rowKey ? rowKeyGen(row) === rowKeyGen(currentItem.value) : row === currentItem.value,
                  hover: _ctx.rowKey ? rowKeyGen(row) === currentHover.value : row === currentHover.value,
                  [_ctx.rowClassName(row, i)]: true
                }),
                style: normalizeStyle({
                  backgroundColor: (_a = unref(highlightRowStore)[rowKeyGen(row)]) == null ? void 0 : _a.bgc
                }),
                onClick: (e) => onRowClick(e, row),
                onDblclick: (e) => onRowDblclick(e, row),
                onContextmenu: (e) => onRowMenu(e, row),
                onMouseover: (e) => onTrMouseOver(e, row)
              }, [
                unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_12)) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col) => {
                  return openBlock(), createElementBlock("td", {
                    key: col.dataIndex,
                    "data-index": col.dataIndex,
                    class: normalizeClass([col.className, _ctx.showOverflow ? "text-overflow" : "", unref(fixedColClassMap).get(colKeyGen(col))]),
                    style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen(col))),
                    onClick: (e) => onCellClick(e, row, col)
                  }, [
                    col.customCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customCell), {
                      key: 0,
                      col,
                      row,
                      "cell-value": row[col.dataIndex]
                    }, null, 8, ["col", "row", "cell-value"])) : (openBlock(), createElementBlock("div", {
                      key: 1,
                      class: "table-cell-wrapper",
                      title: row[col.dataIndex]
                    }, toDisplayString(row[col.dataIndex] ?? getEmptyCellText.value(col, row)), 9, _hoisted_14))
                  ], 14, _hoisted_13);
                }), 128))
              ], 46, _hoisted_11);
            }), 128)),
            unref(virtual_on) ? (openBlock(), createElementBlock("tr", {
              key: 1,
              style: normalizeStyle({ height: `${unref(virtual_offsetBottom)}px` })
            }, null, 4)) : createCommentVNode("", true)
          ])
        ], 6),
        (!dataSourceCopy.value || !dataSourceCopy.value.length) && _ctx.showNoData ? (openBlock(), createElementBlock("div", {
          key: 0,
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
