import { ref, onMounted, onBeforeUnmount, computed, defineComponent, shallowRef, watch, toRaw, openBlock, createElementBlock, normalizeClass, unref, normalizeStyle, withDirectives, createElementVNode, vShow, Fragment, renderList, createCommentVNode, createBlock, resolveDynamicComponent, renderSlot, toDisplayString, createTextVNode, pushScopeId, popScopeId } from "vue";
import { interpolateRgb } from "d3-interpolate";
const Default_Col_Width = "100";
const Default_Table_Height = 100;
const Default_Table_Width = 200;
const Highlight_Color = {
  light: { from: "#71a2fd", to: "#fff" },
  dark: { from: "#1e4c99", to: "#181c21" }
};
const Highlight_Duration = 2e3;
const Highlight_Color_Change_Freq = 100;
let _chromeVersion = 0;
try {
  const userAgent = navigator.userAgent.match(/chrome\/\d+/i);
  if (userAgent) {
    _chromeVersion = +userAgent[0].split("/")[1];
  }
} catch (e) {
  console.error("Cannot get Chrome version", e);
}
const Is_Legacy_Mode = _chromeVersion < 56;
function useColResize({ tableContainer, tableHeaderLast, colResizeIndicator, props, emit, colKeyGen }) {
  const isColResizing = ref(false);
  let colResizeState = {
    currentCol: null,
    currentColIndex: 0,
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
    const { scrollLeft } = tableContainer.value;
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
      startX: clientX,
      startOffsetTableX: offsetTableX
    });
    if (colResizeIndicator.value) {
      colResizeIndicator.value.style.display = "block";
      colResizeIndicator.value.style.left = offsetTableX + "px";
      colResizeIndicator.value.style.top = tableContainer.value.scrollTop + "px";
    }
  }
  function onThResizeMouseMove(e) {
    if (!isColResizing.value)
      return;
    e.stopPropagation();
    e.preventDefault();
    const { currentCol, startX, startOffsetTableX } = colResizeState;
    const { clientX } = e;
    let moveX = clientX - startX;
    const currentColWidth = parseInt((currentCol == null ? void 0 : currentCol.width) || Default_Col_Width);
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
    const { startX, currentCol } = colResizeState;
    const { clientX } = e;
    const moveX = clientX - startX;
    let width = parseInt((currentCol == null ? void 0 : currentCol.width) || Default_Col_Width) + moveX;
    if (width < props.colMinWidth)
      width = props.colMinWidth;
    const curCol = tableHeaderLast.value.find((it) => colKeyGen(it) === colKeyGen(currentCol));
    if (!curCol)
      return;
    curCol.width = width + "px";
    emit("update:columns", [...props.columns]);
    if (colResizeIndicator.value) {
      colResizeIndicator.value.style.display = "none";
      colResizeIndicator.value.style.left = "0";
      colResizeIndicator.value.style.top = "0";
    }
    isColResizing.value = false;
    colResizeState = {
      currentCol: null,
      currentColIndex: 0,
      startX: 0,
      startOffsetTableX: 0
    };
  }
  return {
    isColResizing,
    onThResizeMouseDown,
    onThResizeMouseMove,
    onThResizeMouseUp
  };
}
function useThDrag({ emit }) {
  let dragStartKey = void 0;
  function onThDragStart(e) {
    dragStartKey = e.target.dataset.colKey;
    emit("th-drag-start", dragStartKey);
  }
  function onThDragOver(e) {
    e.preventDefault();
  }
  function onThDrop(e) {
    let th = e.target;
    while (th) {
      if (th.tagName === "TH")
        break;
      th = th.parentNode;
    }
    if (dragStartKey !== th.dataset.colKey) {
      emit("col-order-change", dragStartKey, th.dataset.colKey);
    }
    emit("th-drop", th.dataset.colKey);
  }
  return {
    onThDragStart,
    onThDragOver,
    onThDrop
  };
}
function useVirtualScroll({ tableContainer, props, dataSourceCopy, tableHeaderLast }) {
  const virtualScroll = ref({
    containerHeight: 0,
    startIndex: 0,
    // 数组开始位置
    rowHeight: 28,
    offsetTop: 0,
    // 表格定位上边距
    scrollTop: 0
    // 纵向滚动条位置，用于判断是横向滚动还是纵向
  });
  const virtualScrollX = ref({
    containerWidth: 0,
    startIndex: 0,
    endIndex: 0,
    offsetLeft: 0,
    scrollLeft: 0
    // 横向滚动位置，用于判断是横向滚动还是纵向
  });
  const virtual_on = computed(() => {
    return props.virtual && dataSourceCopy.value.length > virtual_pageSize.value * 2;
  });
  const virtual_pageSize = computed(() => {
    return Math.ceil(virtualScroll.value.containerHeight / virtualScroll.value.rowHeight) + 1;
  });
  const virtual_dataSourcePart = computed(() => {
    if (!virtual_on.value)
      return dataSourceCopy.value;
    return dataSourceCopy.value.slice(
      virtualScroll.value.startIndex,
      virtualScroll.value.startIndex + virtual_pageSize.value
    );
  });
  const virtual_offsetBottom = computed(() => {
    if (!virtual_on.value)
      return 0;
    return (dataSourceCopy.value.length - virtualScroll.value.startIndex - virtual_dataSourcePart.value.length) * virtualScroll.value.rowHeight;
  });
  const virtualX_on = computed(() => {
    return props.virtualX && tableHeaderLast.value.reduce((sum, col) => sum += parseInt(col.minWidth || col.width || Default_Col_Width), 0) > virtualScrollX.value.containerWidth * 1.5;
  });
  const virtualX_columnPart = computed(() => {
    if (virtualX_on.value) {
      const leftCols = [];
      const rightCols = [];
      for (let i = 0; i < virtualScrollX.value.startIndex; i++) {
        const col = tableHeaderLast.value[i];
        if (col.fixed === "left")
          leftCols.push(col);
      }
      for (let i = virtualScrollX.value.endIndex; i < tableHeaderLast.value.length; i++) {
        const col = tableHeaderLast.value[i];
        if (col.fixed === "right")
          rightCols.push(col);
      }
      const mainColumns = tableHeaderLast.value.slice(virtualScrollX.value.startIndex, virtualScrollX.value.endIndex);
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
      width += parseInt(col.width || col.maxWidth || col.minWidth || Default_Col_Width);
    }
    return width;
  });
  function initVirtualScrollY(height) {
    var _a, _b;
    if (virtual_on.value) {
      virtualScroll.value.containerHeight = typeof height === "number" ? height : ((_a = tableContainer.value) == null ? void 0 : _a.offsetHeight) || Default_Table_Height;
      updateVirtualScrollY((_b = tableContainer.value) == null ? void 0 : _b.scrollTop);
    }
  }
  function initVirtualScrollX() {
    if (props.virtualX) {
      const { offsetWidth, scrollLeft } = tableContainer.value || {};
      virtualScrollX.value.containerWidth = offsetWidth || Default_Table_Width;
      updateVirtualScrollX(scrollLeft);
    }
  }
  function updateVirtualScrollY(sTop = 0) {
    const { rowHeight } = virtualScroll.value;
    const startIndex = Math.floor(sTop / rowHeight);
    Object.assign(virtualScroll.value, {
      startIndex,
      offsetTop: startIndex * rowHeight
      // startIndex之前的高度
    });
  }
  function updateVirtualScrollX(sLeft = 0) {
    var _a;
    if (!((_a = tableHeaderLast.value) == null ? void 0 : _a.length))
      return;
    let startIndex = 0;
    let offsetLeft = 0;
    let colWidthSum = 0;
    for (let colIndex = 0; colIndex < tableHeaderLast.value.length; colIndex++) {
      startIndex++;
      const col = tableHeaderLast.value[colIndex];
      if (col.fixed === "left")
        continue;
      const colWidth = parseInt(col.width || col.maxWidth || col.minWidth || Default_Col_Width);
      colWidthSum += colWidth;
      if (colWidthSum >= sLeft) {
        offsetLeft = colWidthSum - colWidth;
        startIndex--;
        break;
      }
    }
    colWidthSum = 0;
    let endIndex = tableHeaderLast.value.length;
    for (let colIndex = startIndex; colIndex < tableHeaderLast.value.length - 1; colIndex++) {
      const col = tableHeaderLast.value[colIndex];
      colWidthSum += parseInt(col.width || col.maxWidth || col.minWidth || Default_Col_Width);
      if (colWidthSum >= virtualScrollX.value.containerWidth) {
        endIndex = colIndex + 2;
        break;
      }
    }
    Object.assign(virtualScrollX.value, { startIndex, endIndex, offsetLeft });
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
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX
  };
}
function insertToOrderedArray(sortState, newItem, targetArray) {
  const { dataIndex, order } = sortState;
  let { sortType } = sortState;
  if (!sortType)
    sortType = typeof newItem[dataIndex];
  const data = [...targetArray];
  if (!order) {
    data.unshift(newItem);
    return data;
  }
  let sIndex = 0;
  let eIndex = data.length - 1;
  const targetVal = newItem[dataIndex];
  while (sIndex <= eIndex) {
    const midIndex = Math.floor((sIndex + eIndex) / 2);
    const midVal = data[midIndex][dataIndex];
    const compareRes = strCompare(midVal, targetVal, sortType);
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
function strCompare(a, b, type) {
  if (type === "number") {
    if (+a > +b)
      return 1;
    if (+a === +b)
      return 0;
    if (+a < +b)
      return -1;
  } else {
    return String(a).localeCompare(b);
  }
}
function tableSort(sortOption, order, dataSource) {
  let targetDataSource = [...dataSource];
  if (typeof sortOption.sorter === "function") {
    const customSorterData = sortOption.sorter(targetDataSource, { order, column: sortOption });
    if (customSorterData)
      targetDataSource = customSorterData;
  } else if (order) {
    const sortField = sortOption.sortField || sortOption.dataIndex;
    let { sortType } = sortOption;
    if (!sortType)
      sortType = typeof dataSource[0][sortField];
    if (sortType === "number") {
      const nanArr = [];
      const numArr = [];
      for (let i = 0; i < targetDataSource.length; i++) {
        const row = targetDataSource[i];
        if (row[sortField] === null || row[sortField] === "" || typeof row[sortField] === "boolean" || Number.isNaN(+row[sortField])) {
          nanArr.push(row);
        } else {
          numArr.push(row);
        }
      }
      if (order === "asc") {
        numArr.sort((a, b) => +a[sortField] - +b[sortField]);
        targetDataSource = [...nanArr, ...numArr];
      } else {
        numArr.sort((a, b) => +b[sortField] - +a[sortField]);
        targetDataSource = [...numArr, ...nanArr];
      }
    } else {
      if (order === "asc") {
        targetDataSource.sort((a, b) => String(a[sortField]).localeCompare(b[sortField]));
      } else {
        targetDataSource.sort((a, b) => String(a[sortField]).localeCompare(b[sortField]) * -1);
      }
    }
  }
  return targetDataSource;
}
function howDeepTheColumn(arr, level = 1) {
  const levels = [level];
  arr.forEach((item) => {
    var _a;
    if ((_a = item.children) == null ? void 0 : _a.length) {
      levels.push(howDeepTheColumn(item.children, level + 1));
    }
  });
  return Math.max(...levels);
}
const _withScopeId = (n) => (pushScopeId("data-v-12388195"), n = n(), popScopeId(), n);
const _hoisted_1 = { key: 0 };
const _hoisted_2 = ["data-col-key", "draggable", "rowspan", "colspan", "title", "onClick"];
const _hoisted_3 = { class: "table-header-cell-wrapper" };
const _hoisted_4 = { class: "table-header-title" };
const _hoisted_5 = {
  key: 2,
  class: "table-header-sorter"
};
const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16"
}, [
  /* @__PURE__ */ createElementVNode("g", { id: "sort-btn" }, [
    /* @__PURE__ */ createElementVNode("polygon", {
      id: "arrow-up",
      fill: "#757699",
      points: "8 2 4.8 6 11.2 6"
    }),
    /* @__PURE__ */ createElementVNode("polygon", {
      id: "arrow-down",
      transform: "translate(8, 12) rotate(-180) translate(-8, -12) ",
      points: "8 10 4.8 14 11.2 14"
    })
  ])
], -1));
const _hoisted_7 = [
  _hoisted_6
];
const _hoisted_8 = ["onMousedown"];
const _hoisted_9 = ["onMousedown"];
const _hoisted_10 = ["data-row-key", "onClick", "onDblclick", "onContextmenu", "onMouseover"];
const _hoisted_11 = {
  key: 0,
  class: "virtual-x-left",
  style: { "padding": "0" }
};
const _hoisted_12 = ["data-index", "onClick"];
const _hoisted_13 = ["title"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StkTable",
  props: {
    width: { default: "" },
    minWidth: { default: "min-content" },
    maxWidth: { default: "" },
    headless: { type: Boolean, default: false },
    theme: { default: "light" },
    virtual: { type: Boolean, default: false },
    virtualX: { type: Boolean, default: false },
    columns: { default: () => [] },
    dataSource: { default: () => [] },
    rowKey: { type: [String, Function], default: "" },
    colKey: { type: [String, Function], default: "dataIndex" },
    emptyCellText: { default: "--" },
    noDataFull: { type: Boolean, default: false },
    showNoData: { type: Boolean, default: true },
    sortRemote: { type: Boolean, default: false },
    showHeaderOverflow: { type: Boolean, default: false },
    showOverflow: { type: Boolean, default: false },
    showTrHoverClass: { type: Boolean, default: false },
    headerDrag: { type: Boolean, default: false },
    rowClassName: { type: Function, default: () => "" },
    colResizable: { type: Boolean, default: false },
    colMinWidth: { default: 10 }
  },
  emits: [
    "sort-change",
    "row-click",
    "current-change",
    "row-dblclick",
    "header-row-menu",
    "row-menu",
    "cell-click",
    "header-cell-click",
    "scroll",
    "col-order-change",
    "th-drop",
    "th-drag-start",
    "columns"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const tableContainer = ref();
    const colResizeIndicator = ref();
    const currentItem = ref(null);
    const currentHover = ref(null);
    let sortCol = ref();
    let sortOrderIndex = ref(0);
    const sortSwitchOrder = [null, "desc", "asc"];
    const tableHeaders = ref([]);
    const tableHeaderLast = ref([]);
    const dataSourceCopy = shallowRef([...props.dataSource]);
    let highlightDimRows = /* @__PURE__ */ new Set();
    let highlightDimRowsTimeout = /* @__PURE__ */ new Map();
    let highlightDimCellsTimeout = /* @__PURE__ */ new Map();
    let calcHighlightDimLoop = false;
    const rowKeyGenStore = /* @__PURE__ */ new WeakMap();
    const tableWidth = computed(() => {
      return props.colResizable ? "fit-content" : props.width;
    });
    const highlightInter = computed(() => {
      return interpolateRgb(Highlight_Color[props.theme].from, Highlight_Color[props.theme].to);
    });
    const fixedColumnsPositionStore = computed(() => {
      const store = {};
      const cols = [...tableHeaderLast.value];
      let left = 0;
      for (let i = 0; i < cols.length; i++) {
        const item = cols[i];
        if (item.fixed === "left") {
          store[item.dataIndex] = left;
          left += parseInt(item.width || Default_Col_Width);
        }
      }
      let right = 0;
      for (let i = cols.length - 1; i >= 0; i--) {
        const item = cols[i];
        if (item.fixed === "right") {
          store[item.dataIndex] = right;
          right += parseInt(item.width || Default_Col_Width);
        }
      }
      return store;
    });
    watch(
      () => props.columns,
      () => {
        dealColumns();
        initVirtualScrollX();
      }
    );
    dealColumns();
    const { isColResizing, onThResizeMouseDown } = useColResize({
      props,
      emit,
      colKeyGen,
      colResizeIndicator,
      tableContainer,
      tableHeaderLast
    });
    const { onThDragStart, onThDragOver, onThDrop } = useThDrag({ emit });
    const {
      virtualScroll,
      virtualScrollX,
      virtual_on,
      virtual_dataSourcePart,
      virtual_offsetBottom,
      virtualX_on,
      virtualX_columnPart,
      virtualX_offsetRight,
      initVirtualScrollY,
      initVirtualScrollX,
      updateVirtualScrollY,
      updateVirtualScrollX
    } = useVirtualScroll({ tableContainer, props, dataSourceCopy, tableHeaderLast });
    watch(
      () => props.dataSource,
      (val) => {
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
    onMounted(() => {
      initVirtualScroll();
    });
    function initVirtualScroll(height) {
      initVirtualScrollY(height);
      initVirtualScrollX();
    }
    function getFixedStyle(tagType, col) {
      const style = {};
      if (Is_Legacy_Mode) {
        if (tagType === 1) {
          style.position = "relative";
          style.top = virtualScroll.value.scrollTop + "px";
        }
      }
      const { fixed, dataIndex } = col;
      if (fixed === "left" || fixed === "right") {
        const isFixedLeft = fixed === "left";
        if (Is_Legacy_Mode) {
          style.position = "relative";
          if (isFixedLeft) {
            if (virtualX_on.value)
              style.left = virtualScrollX.value.scrollLeft - virtualScrollX.value.offsetLeft + "px";
            else
              style.left = virtualScrollX.value.scrollLeft + "px";
          } else {
            style.right = `${virtualX_offsetRight.value}px`;
          }
          if (tagType === 1) {
            style.top = virtualScroll.value.scrollTop + "px";
            style.zIndex = isFixedLeft ? "4" : "3";
          } else {
            style.zIndex = isFixedLeft ? "3" : "2";
          }
        } else {
          style.position = "sticky";
          if (isFixedLeft) {
            style.left = fixedColumnsPositionStore.value[dataIndex] + "px";
          } else {
            style.right = fixedColumnsPositionStore.value[dataIndex] + "px";
          }
          if (tagType === 1) {
            style.top = "0";
            style.zIndex = isFixedLeft ? "4" : "3";
          } else {
            style.zIndex = isFixedLeft ? "3" : "2";
          }
        }
      }
      return style;
    }
    function dealColumns() {
      tableHeaders.value = [];
      tableHeaderLast.value = [];
      const copyColumn = props.columns;
      const deep = howDeepTheColumn(copyColumn);
      const tmpHeaderRows = [];
      const tmpHeaderLast = [];
      (function flat(arr, level = 0) {
        const colArr = [];
        const childrenArr = [];
        arr.forEach((col) => {
          var _a;
          col.rowSpan = col.children ? 1 : deep - level;
          col.colSpan = (_a = col.children) == null ? void 0 : _a.length;
          if (col.rowSpan === 1)
            delete col.rowSpan;
          if (col.colSpan === 1)
            delete col.colSpan;
          colArr.push(col);
          if (col.children) {
            childrenArr.push(...col.children);
          } else {
            tmpHeaderLast.push(col);
          }
        });
        tmpHeaderRows.push(colArr);
        if (childrenArr.length)
          flat(childrenArr, level + 1);
      })(copyColumn);
      tableHeaders.value = tmpHeaderRows;
      tableHeaderLast.value = tmpHeaderLast;
    }
    function rowKeyGen(row) {
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
    function getCellStyle(tagType, col) {
      const fixedStyle = getFixedStyle(tagType, col);
      const style = {
        width: col.width,
        minWidth: props.colResizable ? col.width : col.minWidth || col.width,
        maxWidth: props.colResizable ? col.width : col.maxWidth || col.width,
        ...fixedStyle
      };
      if (tagType === 1) {
        style.textAlign = col.headerAlign;
      } else if (tagType === 2) {
        style.textAlign = col.align;
      }
      return style;
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
      const order = sortSwitchOrder[sortOrderIndex.value];
      if (!props.sortRemote || options.force) {
        dataSourceCopy.value = tableSort(col, order, props.dataSource);
      }
      if (click || options.emit) {
        emit("sort-change", col, order, toRaw(dataSourceCopy.value));
      }
    }
    function onRowClick(e, row) {
      emit("row-click", e, row);
      if (currentItem.value === row)
        return;
      currentItem.value = row;
      emit("current-change", e, row);
    }
    function onRowDblclick(e, row) {
      emit("row-dblclick", e, row);
    }
    function onHeaderMenu(e) {
      emit("header-row-menu", e);
    }
    function onRowMenu(e, row) {
      emit("row-menu", e, row);
    }
    function onCellClick(e, row, col) {
      emit("cell-click", e, row, col);
    }
    function onHeaderCellClick(e, col) {
      emit("header-cell-click", e, col);
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
      if (scrollTop !== virtualScroll.value.scrollTop)
        virtualScroll.value.scrollTop = scrollTop;
      if (virtual_on.value) {
        updateVirtualScrollY(scrollTop);
      }
      if (scrollLeft !== virtualScrollX.value.scrollLeft)
        virtualScrollX.value.scrollLeft = scrollLeft;
      if (virtualX_on.value) {
        updateVirtualScrollX(scrollLeft);
      }
      emit("scroll", e);
    }
    function onTrMouseOver(e, row) {
      if (props.showTrHoverClass) {
        currentHover.value = rowKeyGen(row);
      }
    }
    function calcHighlightLoop() {
      if (calcHighlightDimLoop)
        return;
      calcHighlightDimLoop = true;
      const recursion = () => {
        window.setTimeout(() => {
          const highlightRows = [...highlightDimRows];
          const nowTs = Date.now();
          for (let i = 0; i < highlightRows.length; i++) {
            const row = highlightRows[i];
            const progress = (nowTs - row._bgc_progress_ms) / Highlight_Duration;
            if (progress <= 1) {
              row._bgc = highlightInter.value(progress);
            } else {
              row._bgc = "";
              highlightRows.splice(i--, 1);
            }
          }
          highlightDimRows = new Set(highlightRows);
          if (highlightDimRows.size > 0) {
            recursion();
          } else {
            calcHighlightDimLoop = false;
          }
        }, Highlight_Color_Change_Freq);
      };
      recursion();
    }
    function setCurrentRow(rowKey, option = { silent: false }) {
      if (!dataSourceCopy.value.length)
        return;
      currentItem.value = dataSourceCopy.value.find((it) => rowKeyGen(it) === rowKey);
      if (!option.silent) {
        emit("current-change", null, currentItem.value);
      }
    }
    function setHighlightDimCell(rowKeyValue, dataIndex) {
      var _a;
      const cellEl = (_a = tableContainer.value) == null ? void 0 : _a.querySelector(
        `[data-row-key="${rowKeyValue}"]>[data-index="${dataIndex}"]`
      );
      if (!cellEl)
        return;
      if (cellEl.classList.contains("highlight-cell")) {
        cellEl.classList.remove("highlight-cell");
        void cellEl.offsetHeight;
      }
      cellEl.classList.add("highlight-cell");
      window.clearTimeout(highlightDimCellsTimeout.get(rowKeyValue));
      highlightDimCellsTimeout.set(
        rowKeyValue,
        window.setTimeout(() => {
          cellEl.classList.remove("highlight-cell");
          highlightDimCellsTimeout.delete(rowKeyValue);
        }, Highlight_Duration)
      );
    }
    function setHighlightDimRow(rowKeyValues) {
      var _a, _b;
      if (!Array.isArray(rowKeyValues))
        rowKeyValues = [rowKeyValues];
      if (props.virtual) {
        const nowTs = Date.now();
        for (let i = 0; i < rowKeyValues.length; i++) {
          const rowKeyValue = rowKeyValues[i];
          const row = props.dataSource.find((it) => rowKeyGen(it) === rowKeyValue);
          if (!row)
            continue;
          row._bgc_progress_ms = nowTs;
          highlightDimRows.add(row);
        }
        calcHighlightLoop();
      } else {
        let needRepaint = false;
        const rowElTemp = [];
        for (let i = 0; i < rowKeyValues.length; i++) {
          const rowKeyValue = rowKeyValues[i];
          const rowEl = (_a = tableContainer.value) == null ? void 0 : _a.querySelector(`[data-row-key="${rowKeyValue}"]`);
          if (!rowEl)
            continue;
          if (rowEl.classList.contains("highlight-row")) {
            rowEl.classList.remove("highlight-row");
            needRepaint = true;
          }
          rowElTemp.push(rowEl);
          window.clearTimeout(highlightDimRowsTimeout.get(rowKeyValue));
          highlightDimRowsTimeout.set(
            rowKeyValue,
            window.setTimeout(() => {
              rowEl.classList.remove("highlight-row");
              highlightDimRowsTimeout.delete(rowKeyValue);
            }, Highlight_Duration)
          );
        }
        if (needRepaint) {
          void ((_b = tableContainer.value) == null ? void 0 : _b.offsetWidth);
        }
        rowElTemp.forEach((el) => el.classList.add("highlight-row"));
      }
    }
    function setSorter(dataIndex, order, option = {}) {
      var _a;
      const newOption = { silent: true, sortOption: null, sort: true, ...option };
      sortCol.value = dataIndex;
      sortOrderIndex.value = sortSwitchOrder.findIndex((it) => it === order);
      if (newOption.sort && ((_a = dataSourceCopy.value) == null ? void 0 : _a.length)) {
        const column = newOption.sortOption || tableHeaderLast.value.find((it) => it.dataIndex === sortCol.value);
        if (column)
          onColumnSort(column, false, { force: true, emit: !newOption.silent });
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
    __expose({
      setCurrentRow,
      setHighlightDimCell,
      setHighlightDimRow,
      setSorter,
      resetSorter,
      scrollTo,
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
          "is-col-resizing": unref(isColResizing)
        }]),
        style: normalizeStyle(_ctx.virtual && { "--row-height": unref(virtualScroll).rowHeight + "px" }),
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
          class: "stk-table-main",
          style: normalizeStyle({ width: tableWidth.value, minWidth: _ctx.minWidth, maxWidth: _ctx.maxWidth })
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
                    "data-col-key": col.dataIndex,
                    draggable: _ctx.headerDrag ? "true" : "false",
                    rowspan: col.rowSpan,
                    colspan: col.colSpan,
                    style: normalizeStyle(getCellStyle(1, col)),
                    title: col.title,
                    class: normalizeClass([
                      col.sorter ? "sortable" : "",
                      col.dataIndex === unref(sortCol) && unref(sortOrderIndex) !== 0 && "sorter-" + sortSwitchOrder[unref(sortOrderIndex)],
                      _ctx.showHeaderOverflow ? "text-overflow" : "",
                      col.headerClassName,
                      col.fixed ? "fixed-cell" : ""
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
                        column: col
                      }, () => [
                        createElementVNode("span", _hoisted_4, toDisplayString(col.title), 1)
                      ], true),
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
                  style: normalizeStyle([{ "padding": "0" }, {
                    minWidth: unref(virtualX_offsetRight) + "px",
                    width: unref(virtualX_offsetRight) + "px"
                  }])
                }, null, 4)) : createCommentVNode("", true)
              ], 32);
            }), 128))
          ])) : createCommentVNode("", true),
          createElementVNode("tbody", null, [
            unref(virtual_on) ? (openBlock(), createElementBlock("tr", {
              key: 0,
              style: normalizeStyle({ height: `${unref(virtualScroll).offsetTop}px` })
            }, null, 4)) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtual_dataSourcePart), (row, i) => {
              return openBlock(), createElementBlock("tr", {
                key: _ctx.rowKey ? rowKeyGen(row) : i,
                "data-row-key": _ctx.rowKey ? rowKeyGen(row) : i,
                class: normalizeClass({
                  active: _ctx.rowKey ? rowKeyGen(row) === (currentItem.value && rowKeyGen(currentItem.value)) : row === currentItem.value,
                  hover: _ctx.rowKey ? rowKeyGen(row) === currentHover.value : row === currentHover.value,
                  [_ctx.rowClassName(row, i)]: true
                }),
                style: normalizeStyle({
                  backgroundColor: row._bgc
                }),
                onClick: (e) => onRowClick(e, row),
                onDblclick: (e) => onRowDblclick(e, row),
                onContextmenu: (e) => onRowMenu(e, row),
                onMouseover: (e) => onTrMouseOver(e, row)
              }, [
                unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_11)) : createCommentVNode("", true),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col) => {
                  return openBlock(), createElementBlock("td", {
                    key: col.dataIndex,
                    "data-index": col.dataIndex,
                    class: normalizeClass([col.className, _ctx.showOverflow ? "text-overflow" : "", col.fixed ? "fixed-cell" : ""]),
                    style: normalizeStyle(getCellStyle(2, col)),
                    onClick: (e) => onCellClick(e, row, col)
                  }, [
                    col.customCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customCell), {
                      key: 0,
                      col,
                      row
                    }, null, 8, ["col", "row"])) : (openBlock(), createElementBlock("div", {
                      key: 1,
                      class: "table-cell-wrapper",
                      title: row[col.dataIndex]
                    }, toDisplayString(row[col.dataIndex] ?? _ctx.emptyCellText), 9, _hoisted_13))
                  ], 14, _hoisted_12);
                }), 128))
              ], 46, _hoisted_10);
            }), 128)),
            unref(virtual_on) ? (openBlock(), createElementBlock("tr", {
              key: 1,
              style: normalizeStyle({ height: `${unref(virtual_offsetBottom)}px` })
            }, null, 4)) : createCommentVNode("", true)
          ])
        ], 4),
        (!dataSourceCopy.value || !dataSourceCopy.value.length) && _ctx.showNoData ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["stk-table-no-data", { "no-data-full": _ctx.noDataFull }])
        }, [
          renderSlot(_ctx.$slots, "empty", {}, () => [
            createTextVNode("暂无数据")
          ], true)
        ], 2)) : createCommentVNode("", true)
      ], 38);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const StkTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-12388195"]]);
export {
  StkTable,
  insertToOrderedArray,
  tableSort
};
