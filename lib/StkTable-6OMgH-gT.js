/**
 * name: stk-table-vue
 * version: v1.1.0
 * description: High performance realtime virtual table for vue3 and vue2.7
 * author: japlus
 * homepage: https://ja-plus.github.io/stk-table-vue/
 * license: MIT
 */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, customRef, defineComponent, mergeProps, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, onUnmounted, openBlock, provide, ref, renderList, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRaw, toRef, unref, watch, withCtx } from "vue";
//#region src/StkTable/const.ts
/** highlight background */
var HIGHLIGHT_COLOR = {
	light: {
		from: "#71a2fd",
		to: "#fff"
	},
	dark: {
		from: "#1e4c99",
		to: "#181c21"
	}
};
var HIGHLIGHT_DURATION = 2e3;
/** highlight change frequency 1000/30 -> 30FPS */
var HIGHLIGHT_ROW_CLASS = "highlight-row";
var HIGHLIGHT_CELL_CLASS = "highlight-cell";
var _chromeVersion = getBrowsersVersion("chrome");
var _firefoxVersion = getBrowsersVersion("firefox");
/** legacy sticky compatible mode  */
var IS_LEGACY_MODE = _chromeVersion < 56 || _firefoxVersion < 59;
/** default props.smoothDefault */
var DEFAULT_SMOOTH_SCROLL = _chromeVersion < 85;
/** expanded row key prefix */
var EXPANDED_ROW_KEY_PREFIX = "expanded-";
var DEFAULT_SORT_CONFIG = {
	emptyToBottom: false,
	stringLocaleCompare: false,
	sortChildren: false
};
var DEFAULT_ROW_ACTIVE_CONFIG = {
	enabled: true,
	disabled: () => false,
	revokable: true
};
//#endregion
//#region src/StkTable/utils/index.ts
/** 是否空值 */
function isEmptyValue(val, isNumber) {
	let isEmpty = val === null || val === void 0;
	if (isNumber) isEmpty = isEmpty || typeof val === "boolean" || Number.isNaN(+val);
	return isEmpty;
}
/**
* 对有序数组插入新数据
*
* 注意：不会改变原数组，返回新数组
* @param sortState
* @param sortState.dataIndex 排序的字段
* @param sortState.order 排序顺序
* @param sortState.sortType 排序方式
* @param newItem 要插入的数据
* @param targetArray 表格数据
* @return targetArray 的浅拷贝
*/
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
	const { emptyToBottom, customCompare, stringLocaleCompare } = {
		emptyToBottom: false,
		...sortConfig
	};
	const targetVal = newItem[field];
	if (emptyToBottom && isEmptyValue(targetVal, isNumber)) data.push(newItem);
	else {
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
/**
* 二分查找
*  @param searchArray 查找数组
*  @param compareCallback 比较函数，返回 -1|0|1
*/
function binarySearch(searchArray, compareCallback) {
	let sIndex = 0;
	let eIndex = searchArray.length - 1;
	while (sIndex <= eIndex) {
		const midIndex = Math.floor((sIndex + eIndex) / 2);
		const compareRes = compareCallback(midIndex);
		if (compareRes === 0) {
			sIndex = midIndex;
			break;
		} else if (compareRes < 0) sIndex = midIndex + 1;
		else eIndex = midIndex - 1;
	}
	return sIndex;
}
/**
* 字符串比较
* @param a
* @param b
* @param type 类型
* @param isNumber 是否是数字类型
* @param localeCompare 是否 使用Array.prototyshpe.localeCompare
* @return {number} <0: a < b, 0: a = b, >0: a > b
*/
function strCompare(a, b, isNumber, localeCompare = false) {
	let _a = a;
	let _b = b;
	if (isNumber) {
		_a = +a;
		_b = +b;
	} else if (localeCompare) return String(a).localeCompare(b);
	if (_a > _b) return 1;
	else if (_a === _b) return 0;
	else return -1;
}
/**
* 分离出空数据和非空数据成两个数组。NaN视为空数据。
* @param sortOption
* @param targetDataSource
* @param isNumber 是否数字
* @return [值数组,空数组]
*/
function separatedData(sortOption, targetDataSource, isNumber) {
	const emptyArr = [];
	const valueArr = [];
	const sortField = sortOption.sortField || sortOption.dataIndex;
	for (let i = 0, len = targetDataSource.length; i < len; i++) {
		const row = targetDataSource[i];
		if (isEmptyValue(row === null || row === void 0 ? void 0 : row[sortField], isNumber)) emptyArr.push(row);
		else valueArr.push(row);
	}
	return [valueArr, emptyArr];
}
/**
* 表格排序抽离
* 可以在组件外部自己实现表格排序，组件配置remote，使表格不排序。
* 使用者在@sort-change事件中自行更改table props 'dataSource'完成排序。
* TODO: key 唯一值，排序字段相同时，根据唯一值排序。
*
* sortConfig.defaultSort 会在order为null时生效
* @param sortOption 列配置
* @param order 排序方式
* @param dataSource 排序的数组
*/
function tableSort(sortOption, order, dataSource, sortConfig = {}) {
	if (!(dataSource === null || dataSource === void 0 ? void 0 : dataSource.length) || !sortOption) return dataSource || [];
	sortConfig = {
		...DEFAULT_SORT_CONFIG,
		...sortConfig
	};
	let targetDataSource = dataSource.slice();
	let sortField = sortOption.sortField || sortOption.dataIndex;
	const { defaultSort, stringLocaleCompare, emptyToBottom, sortChildren } = sortConfig;
	if (!order && defaultSort) {
		order = defaultSort.order;
		sortField = defaultSort.dataIndex;
	}
	if (typeof sortOption.sorter === "function") {
		const customSorterData = sortOption.sorter(targetDataSource, {
			order,
			column: sortOption
		});
		if (customSorterData) targetDataSource = customSorterData;
		if (sortChildren) targetDataSource.forEach((item) => {
			var _item$children;
			if (!((_item$children = item.children) === null || _item$children === void 0 ? void 0 : _item$children.length)) return;
			item.children = tableSort(sortOption, order, item.children, sortConfig);
		});
	} else if (order) {
		let { sortType } = sortOption;
		if (!sortType) sortType = typeof dataSource[0][sortField];
		const isNumber = sortType === "number";
		const [valueArr, emptyArr] = separatedData(sortOption, targetDataSource, isNumber);
		if (order === "asc") valueArr.sort((a, b) => strCompare(a[sortField], b[sortField], isNumber, stringLocaleCompare));
		else valueArr.sort((a, b) => strCompare(b[sortField], a[sortField], isNumber, stringLocaleCompare));
		targetDataSource = order === "desc" || emptyToBottom ? valueArr.concat(emptyArr) : emptyArr.concat(valueArr);
		if (sortChildren) targetDataSource.forEach((item) => {
			var _item$children2;
			if (!((_item$children2 = item.children) === null || _item$children2 === void 0 ? void 0 : _item$children2.length)) return;
			item.children = tableSort(sortOption, order, item.children, sortConfig);
		});
	}
	return targetDataSource;
}
/** 多级表头深度 从0开始为一级*/
function howDeepTheHeader(arr, level = 0) {
	const levels = [level];
	arr.forEach((item) => {
		var _item$children3;
		if ((_item$children3 = item.children) === null || _item$children3 === void 0 ? void 0 : _item$children3.length) levels.push(howDeepTheHeader(item.children, level + 1));
	});
	return Math.max(...levels);
}
/** number width +px */
function transformWidthToStr(width) {
	if (width === void 0) return;
	const numberWidth = Number(width);
	return width + (!Number.isNaN(numberWidth) ? "px" : "");
}
function getBrowsersVersion(browserName) {
	try {
		const reg = new RegExp(`${browserName}/\\d+`, "i");
		const userAgent = navigator.userAgent.match(reg);
		if (userAgent) return +userAgent[0].split("/")[1];
	} catch (e) {
		console.error("Cannot get version", e);
	}
	return 100;
}
function pureCellKeyGen(rowKey, colKey) {
	return rowKey + "--" + colKey;
}
function getClosestTr(target) {
	return target === null || target === void 0 ? void 0 : target.closest("tr");
}
function getClosestTh(target) {
	return target === null || target === void 0 ? void 0 : target.closest("th");
}
function getClosestTd(target) {
	return target === null || target === void 0 ? void 0 : target.closest("td");
}
function getClosestTrIndex(target) {
	const tr = getClosestTr(target);
	if (!tr) return -1;
	return Number(tr.dataset.rowI);
}
function getClosestColKey(target) {
	var _getClosestTd;
	return (_getClosestTd = getClosestTd(target)) === null || _getClosestTd === void 0 ? void 0 : _getClosestTd.dataset.colKey;
}
/**
* 改进的节流函数，确保最后一个调用不会被丢弃
* @param fn 要执行的函数
* @param delay 延迟时间（毫秒）
* @returns 节流处理后的函数
*/
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
/**
* Creates a requestAnimationFrame-based throttled function for smooth scrolling performance.
* Multiple calls within a single frame are coalesced - only the last call is executed.
* @param fn The function to throttle
* @returns A throttled function that executes on the next animation frame
*/
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
		if (rafId === null) rafId = requestAnimationFrame(() => {
			callFn();
			rafId = null;
		});
	};
}
//#endregion
//#region src/StkTable/utils/constRefUtils.ts
/**
* 获取列宽
*
* 关于列宽的操作往往在横向滚动中使用。既然已经有横向滚动了，则列宽会被压缩至minWidth，所以优先取minWidth
*/
function getColWidth(col) {
	const val = col.minWidth ?? col.width ?? 100;
	if (typeof val === "number") return Math.floor(val);
	return parseInt(val);
}
/** 获取计算后的宽度 */
function getCalculatedColWidth(col) {
	return (col === null || col === void 0 ? void 0 : col.__W__) || 100;
}
/** 创建组件唯一标识 */
function createStkTableId() {
	let id = window.__STK_TB_ID_COUNT__;
	if (!id) id = 0;
	id += 1;
	window.__STK_TB_ID_COUNT__ = id;
	return "stk" + id.toString(36);
}
//#endregion
//#region src/StkTable/features/const.ts
var MY_FN_NAME = "stkName";
//#endregion
//#region src/StkTable/features/useAreaSelection.ts
/**
* 单元格区域选择功能
* 支持鼠标拖拽选择、键盘导航、复制粘贴等功能
* en: Cell area selection feature with mouse drag, keyboard navigation, copy-paste, etc.
*/
function useAreaSelection(props, emits, tableContainerRef, dataSourceCopy, tableHeaderLast, colKeyGen, cellKeyGen, scrollTo, virtualScroll, virtualScrollX, getRowIndex, getColumnIndex) {
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
	/** start cell */
	let anchorCell = null;
	/** auto scroll rAF id */
	let autoScrollRafId = 0;
	/**
	* 最后一次鼠标位置（用于边界自动滚动计算）
	* en: Last mouse position (for boundary auto scroll calculation)
	*/
	let lastMouseClientX = 0;
	let lastMouseClientY = 0;
	const config = computed(() => {
		if (typeof props.areaSelection === "boolean") {
			const b = props.areaSelection;
			return {
				enabled: b,
				keyboard: b,
				ctrl: b,
				shift: b,
				highlight: {
					cell: b,
					row: false
				}
			};
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
	/** 是否启用键盘控制选区移动 */
	const keyboardEnabled = computed(() => config.value.keyboard);
	/** 是否启用 Ctrl 多选 */
	const ctrlEnabled = computed(() => config.value.ctrl);
	/** 是否启用 Shift 扩选 */
	const shiftEnabled = computed(() => config.value.shift);
	/** 是否启用单元格高亮 */
	const highlightCellEnabled = computed(() => {
		var _config$value$highlig;
		return (_config$value$highlig = config.value.highlight) === null || _config$value$highlig === void 0 ? void 0 : _config$value$highlig.cell;
	});
	/** 是否启用行高亮 */
	const highlightRowEnabled = computed(() => {
		var _config$value$highlig2;
		return (_config$value$highlig2 = config.value.highlight) === null || _config$value$highlig2 === void 0 ? void 0 : _config$value$highlig2.row;
	});
	/** colKey → absolute index 映射 */
	const colKeyToIndexMap = computed(() => {
		const headers = tableHeaderLast.value;
		const map = /* @__PURE__ */ new Map();
		for (let i = 0; i < headers.length; i++) map.set(colKeyGen.value(headers[i]), i);
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
		const leftWidths = new Array(cols.length + 1).fill(0);
		const rightWidths = new Array(cols.length + 1).fill(0);
		let leftSum = 0;
		for (let i = 0; i < cols.length; i++) {
			var _cols$i;
			leftWidths[i] = leftSum;
			if (((_cols$i = cols[i]) === null || _cols$i === void 0 ? void 0 : _cols$i.fixed) === "left") leftSum += getCalculatedColWidth(cols[i]);
		}
		leftWidths[cols.length] = leftSum;
		let rightSum = 0;
		for (let i = cols.length - 1; i >= 0; i--) {
			var _cols$i2;
			rightWidths[i] = rightSum;
			if (((_cols$i2 = cols[i]) === null || _cols$i2 === void 0 ? void 0 : _cols$i2.fixed) === "right") rightSum += getCalculatedColWidth(cols[i]);
		}
		return (colIndex) => {
			return [leftWidths[colIndex] ?? 0, rightWidths[colIndex + 1] ?? 0];
		};
	});
	/** 根据 selectionRanges 计算所有选区内 cellKey 的并集（非响应式，用于 DOM 操作） */
	let selectedCellKeys = /* @__PURE__ */ new Set();
	/** 重新计算 selectedCellKeys */
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
			const { begin: { row: r1, col: c1 }, end: { row: r2, col: c2 } } = range.index;
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
		for (let i = 0; i < oldSelectedRows.length; i++) oldSelectedRows[i].removeAttribute(ATTR_ROW_SELECTED);
		recomputeSelectedCellKeys();
		const ranges = selectionRanges.value;
		if (!ranges.length) return;
		const tbody = container.querySelector(".stk-tbody-main");
		if (!tbody) return;
		if (rowHighlight) for (const range of ranges) {
			const { minRow, maxRow } = normalizeRange(range);
			for (let r = minRow; r <= maxRow; r++) {
				const tr = tbody.querySelector(`tr[data-row-i="${r}"]`);
				if (tr) tr.setAttribute(ATTR_ROW_SELECTED, "");
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
					const row = dataSourceCopy.value[rowIndex];
					const cols = tableHeaderLast.value;
					if (!row || !cols[colIndex]) continue;
					const ck = cellKeyGen(row, cols[colIndex]);
					if (!selectedCellKeys.has(ck)) continue;
					td.setAttribute(ATTR_CELL_SELECTED, "");
					if (rowIndex >= lrMinRow && rowIndex <= lrMaxRow && colIndex >= lrMinCol && colIndex <= lrMaxCol) {
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
	/**
	* 监听 selectionRanges 变化，在 DOM 更新后直接操作选区 class
	* 同时在虚拟滚动等导致 DOM 重建时也能重新应用选区样式
	*/
	watch(() => {
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
	}, () => {
		nextTick(updateSelectionDOM);
	}, { flush: "post" });
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
		if (anchorCell) if (rowCount === 0 || colCount === 0) anchorCell = null;
		else {
			anchorCell.rowIndex = clamp(anchorCell.rowIndex, 0, rowCount - 1);
			anchorCell.colIndex = clamp(anchorCell.colIndex, 0, colCount - 1);
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
			} else newRanges.push(range);
		}
		if (changed) {
			selectionRanges.value = newRanges;
			emitSelectionChange();
		}
	});
	function addListener() {
		var _tableContainerRef$va;
		removeListener();
		(_tableContainerRef$va = tableContainerRef.value) === null || _tableContainerRef$va === void 0 || _tableContainerRef$va.addEventListener("keydown", onKeydown);
	}
	function removeListener() {
		var _tableContainerRef$va2;
		(_tableContainerRef$va2 = tableContainerRef.value) === null || _tableContainerRef$va2 === void 0 || _tableContainerRef$va2.removeEventListener("keydown", onKeydown);
		document.removeEventListener("mousemove", onDocumentMouseMove);
		document.removeEventListener("mouseup", onDocumentMouseUp);
		stopAutoScroll();
	}
	/** 获取归一化（min/max）后的选区范围 */
	function normalizeRange(range) {
		const { begin, end } = range.index;
		return {
			minRow: Math.min(begin.row, end.row),
			maxRow: Math.max(begin.row, end.row),
			minCol: Math.min(begin.col, end.col),
			maxCol: Math.max(begin.col, end.col)
		};
	}
	/**
	* 构造选区范围。begin = 拖拽起点，end = 拖拽终点。
	* 同时填充已废弃的 x/y 字段以保证向后兼容。
	*/
	function makeRange(beginRow, beginCol, endRow, endCol) {
		return { index: {
			x: [beginCol, endCol],
			y: [beginRow, endRow],
			begin: {
				row: beginRow,
				col: beginCol
			},
			end: {
				row: endRow,
				col: endCol
			}
		} };
	}
	/** 根据colKey获取列的绝对索引 */
	function getColIndexByKey(colKey) {
		if (!colKey) return -1;
		return colKeyToIndexMap.value.get(colKey) ?? -1;
	}
	/** 获取指定单元格的合并信息 [rowspan, colspan]，无合并返回 [1, 1] */
	function getMergeSpan(rowIndex, colIndex) {
		const data = dataSourceCopy.value;
		const cols = tableHeaderLast.value;
		const row = data[rowIndex];
		const col = cols[colIndex];
		if (!row || !col || !col.mergeCells) return [1, 1];
		const { rowspan = 1, colspan = 1 } = col.mergeCells({
			row,
			col,
			rowIndex,
			colIndex
		}) || {};
		return [rowspan || 1, colspan || 1];
	}
	/**
	* 扩展选区范围，使其完整覆盖边界上部分选中的合并单元格
	* en: Expand selection range to fully cover merged cells that are partially selected at boundaries
	*/
	function expandRangeToCoverMergedCells(range) {
		const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
		const data = dataSourceCopy.value;
		const cols = tableHeaderLast.value;
		const rowCount = data.length;
		const colCount = cols.length;
		const mergeColIndices = [];
		for (let c = 0; c < colCount; c++) {
			var _cols$c;
			if ((_cols$c = cols[c]) === null || _cols$c === void 0 ? void 0 : _cols$c.mergeCells) mergeColIndices.push(c);
		}
		if (!mergeColIndices.length) return range;
		let [eMinRow, eMaxRow, eMinCol, eMaxCol] = [
			minRow,
			maxRow,
			minCol,
			maxCol
		];
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
					if (r + rs - 1 >= eMinRow) {
						if (r < eMinRow) {
							eMinRow = r;
							changed = true;
						}
					} else break;
				}
			}
			for (let r = eMinRow; r <= eMaxRow; r++) for (let c = eMinCol - 1; c >= 0 && c > eMinCol - 500; c--) {
				const [, cs] = getMergeSpan(r, c);
				if (cs <= 1) continue;
				if (c + cs - 1 >= eMinCol) {
					if (c < eMinCol) {
						eMinCol = c;
						changed = true;
					}
				} else break;
			}
		}
		if (eMinRow === minRow && eMaxRow === maxRow && eMinCol === minCol && eMaxCol === maxCol) return range;
		const { begin, end } = range.index;
		const newBeginRow = begin.row < end.row || begin.row === end.row ? eMinRow : eMaxRow;
		const newEndRow = begin.row < end.row || begin.row === end.row ? eMaxRow : eMinRow;
		return makeRange(newBeginRow, begin.col <= end.col ? eMinCol : eMaxCol, newEndRow, begin.col <= end.col ? eMaxCol : eMinCol);
	}
	/** 获取列的左边距和宽度
	* @param colIndex 列的绝对索引
	* @returns [left, width]
	*/
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
	/** 根据按键计算移动方向 */
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
	/** 钳制值到指定范围内 */
	function clamp(value, min, max) {
		return Math.max(min, Math.min(value, max));
	}
	/** 处理Tab键的换行逻辑 */
	function handleTabWrap(row, col, rawCol, rowCount, colCount) {
		if (rawCol >= colCount) return [Math.min(row + 1, rowCount - 1), 0];
		if (rawCol < 0) return [Math.max(row - 1, 0), colCount - 1];
		return [row, col];
	}
	/** 计算自动滚动的增量 */
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
		return {
			deltaX,
			deltaY
		};
	}
	/** mousedown 处理：设置锚点，开始拖选 */
	function onSelectionMouseDown(e) {
		if (!config.value.enabled || e.button !== 0) return;
		const rowIndex = getClosestTrIndex(e.target);
		const colIndex = getColIndexByKey(getClosestColKey(e.target));
		if (rowIndex < 0 || colIndex < 0) return;
		const ctrlKey = e.ctrlKey || e.metaKey;
		const range = expandRangeToCoverMergedCells(makeRange(rowIndex, colIndex, rowIndex, colIndex));
		if (e.shiftKey && anchorCell && shiftEnabled.value) {
			const ranges = selectionRanges.value.slice();
			const shiftRange = expandRangeToCoverMergedCells(makeRange(anchorCell.rowIndex, anchorCell.colIndex, rowIndex, colIndex));
			if (ranges.length) ranges[ranges.length - 1] = shiftRange;
			else ranges.push(shiftRange);
			selectionRanges.value = ranges;
		} else {
			anchorCell = {
				rowIndex,
				colIndex
			};
			if (ctrlKey && ctrlEnabled.value) selectionRanges.value = selectionRanges.value.concat([range]);
			else selectionRanges.value = [range];
		}
		isSelecting.value = true;
		lastMouseClientX = e.clientX;
		lastMouseClientY = e.clientY;
		document.addEventListener("mousemove", onDocumentMouseMove);
		document.addEventListener("mouseup", onDocumentMouseUp);
	}
	/** document mousemove 处理：更新选区终点 + 检测边界自动滚动 */
	function onDocumentMouseMove(e) {
		if (!isSelecting.value) return;
		lastMouseClientX = e.clientX;
		lastMouseClientY = e.clientY;
		updateSelectionFromEvent(e);
		checkAutoScroll();
	}
	/** 从 MouseEvent 目标元素更新选区 */
	function updateSelectionFromEvent(e) {
		const target = e.target;
		if (!target) return;
		const rowIndex = getClosestTrIndex(target);
		if (Number.isNaN(rowIndex) || rowIndex < 0) return;
		const colIndex = getColIndexByKey(getClosestColKey(target));
		if (colIndex < 0) return;
		updateSelectionEnd(rowIndex, colIndex);
	}
	/** 更新最后一个选区的终点（拖拽过程中） */
	function updateSelectionEnd(endRowIndex, endColIndex) {
		if (!anchorCell) return;
		const newRange = expandRangeToCoverMergedCells(makeRange(anchorCell.rowIndex, anchorCell.colIndex, endRowIndex, endColIndex));
		const ranges = [...selectionRanges.value];
		if (ranges.length > 0) ranges[ranges.length - 1] = newRange;
		else ranges.push(newRange);
		selectionRanges.value = ranges;
	}
	/** 检查鼠标是否在容器边缘附近，启动或停止自动滚动 */
	function checkAutoScroll() {
		const container = tableContainerRef.value;
		if (!container) return;
		const { top, bottom, left, right } = container.getBoundingClientRect();
		const nearEdge = lastMouseClientY < top + EDGE_ZONE || lastMouseClientY > bottom - EDGE_ZONE || lastMouseClientX < left + EDGE_ZONE || lastMouseClientX > right - EDGE_ZONE;
		if (nearEdge && !autoScrollRafId) autoScrollLoop();
		else if (!nearEdge && autoScrollRafId) stopAutoScroll();
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
			updateSelectionFromPoint(container, rect);
		}
		if (isSelecting.value && (deltaX !== 0 || deltaY !== 0)) autoScrollRafId = requestAnimationFrame(autoScrollLoop);
		else autoScrollRafId = 0;
	}
	/** 将鼠标位置钳制到容器内部，用 elementFromPoint 找到边缘单元格并更新选区 */
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
		const colIndex = getColIndexByKey(getClosestColKey(td));
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
	/** 获取 areaSelection 配置中的格式化回调 */
	function getFormatCellFn() {
		const cfg = config.value;
		return typeof cfg.formatCellForClipboard === "function" ? cfg.formatCellForClipboard : null;
	}
	/**
	* 复制选区内容到剪贴板,只复制最后一个选区
	* en: Copy selected area content to clipboard, only copy the last selected area
	* @returns {string} text
	*/
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
		if (container && activeEl && container.contains(activeEl) && activeEl !== container) container.focus({ preventScroll: true });
	}
	/**
	* Ctrl+C / Cmd+C copy
	* Esc ：cancel
	* Arrow keys / Tab move (when keyboard=true)
	**/
	function onKeydown(e) {
		if (!config.value.enabled) return;
		const key = e.key;
		if (key === KEY_ESCAPE || key === KEY_ESC) {
			blurCellElement();
			if (selectionRanges.value.length) e.preventDefault();
			return;
		}
		if ((e.ctrlKey || e.metaKey) && key === KEY_C && selectionRanges.value.length) {
			copySelectedArea();
			e.preventDefault();
			return;
		}
		if (!keyboardEnabled.value) return;
		const isArrowKey = [
			KEY_ARROW_UP,
			KEY_ARROW_DOWN,
			KEY_ARROW_LEFT,
			KEY_ARROW_RIGHT
		].includes(key);
		const isTabKey = key === KEY_TAB;
		if (!(isArrowKey || isTabKey)) return;
		e.preventDefault();
		const rowCount = dataSourceCopy.value.length;
		const colCount = tableHeaderLast.value.length;
		if (rowCount === 0 || colCount === 0) return;
		if (!selectionRanges.value.length) {
			anchorCell = {
				rowIndex: 0,
				colIndex: 0
			};
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
			anchorCell = {
				rowIndex: newRow,
				colIndex: newCol
			};
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
		if (targetRowTop < visibleTop) newScrollTop = targetRowTop;
		else if (targetRowBottom > visibleBottom) newScrollTop = targetRowBottom - (vs.containerHeight - headerHeight - footerHeight);
		const [targetColLeft, targetColWidth] = getColPosition(colIndex);
		const targetColRight = targetColLeft + targetColWidth;
		const visibleLeft = container.scrollLeft;
		const visibleRight = visibleLeft + vsx.containerWidth;
		const [leftFixedWidth, rightFixedWidth] = getFixedColWidths.value(colIndex);
		let newScrollLeft = null;
		if (targetColLeft < visibleLeft + leftFixedWidth) newScrollLeft = targetColLeft - leftFixedWidth;
		else if (targetColRight > visibleRight - rightFixedWidth) newScrollLeft = targetColRight - vsx.containerWidth + rightFixedWidth;
		if (newScrollTop !== null || newScrollLeft !== null) scrollTo(newScrollTop, newScrollLeft);
	}
	/**
	* 判断一个单元格的选区样式类名
	* @param cellKey 单元格唯一键
	* @param absoluteRowIndex 行在 dataSourceCopy 中的绝对索引
	* @param colKey 列唯一键
	* @returns 样式类名数组
	*/
	/**
	* 判断一行的选区样式类名（行高亮）
	* @param absoluteRowIndex 行在 dataSourceCopy 中的绝对索引
	* @returns 样式类名数组
	*/
	/** 获取选中的单元格信息 */
	function getSelectedArea() {
		const ranges = selectionRanges.value;
		if (!ranges.length) return {
			rows: [],
			cols: [],
			ranges: []
		};
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
		anchorCell = {
			rowIndex: beginRow,
			colIndex: beginCol
		};
		isSelecting.value = false;
		if (scrollToView) scrollToCell(endRow, endCol);
		if (!silent) emitSelectionChange();
		return selectionRanges.value;
	}
	return {
		config,
		isSelecting,
		get: getSelectedArea,
		set: setAreaSelection,
		clear: clearSelectedArea,
		copy: copySelectedArea,
		onMD: onSelectionMouseDown
	};
}
var useAreaSelectionName = "useAreaSelection";
useAreaSelection[MY_FN_NAME] = useAreaSelectionName;
//#endregion
//#region src/StkTable/registerFeature.ts
var ON_DEMAND_FEATURE = { [useAreaSelectionName]: ((props) => {
	if ("useAreaSelection" in props) console.warn("useAreaSelection is not registered");
	return {
		config: computed(() => ({ enabled: false })),
		isSelecting: ref(false),
		onMD: () => {},
		get: () => ({
			rows: [],
			cols: [],
			ranges: []
		}),
		set: () => [],
		clear: () => {},
		copy: () => ""
	};
}) };
function registerFeature(feature) {
	(Array.isArray(feature) ? feature : [feature]).forEach((f) => {
		const fnName = f[MY_FN_NAME];
		if (!fnName) {
			console.warn("invalid feature");
			return;
		}
		ON_DEMAND_FEATURE[fnName] = f;
	});
}
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/StkTable/components/DragHandle.vue
var _sfc_main$2 = {};
var _hoisted_1$4 = {
	class: "drag-row-handle",
	draggable: "true"
};
function _sfc_render$2(_ctx, _cache) {
	return openBlock(), createElementBlock("span", _hoisted_1$4, [..._cache[0] || (_cache[0] = [createElementVNode("svg", {
		viewBox: "0 0 1024 1024",
		width: "20",
		height: "20",
		fill: "currentColor"
	}, [createElementVNode("path", { d: "M640 853.3a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m-256 0a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m256-256a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m-256 0a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z m256-256a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3zM384 341.3a85.3 85.3 0 1 1 85.3-85.3 85.3 85.3 0 0 1-85.3 85.3z" })], -1)])]);
}
var DragHandle_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["render", _sfc_render$2]]);
//#endregion
//#region src/StkTable/components/SortIcon.vue
var _sfc_main$1 = {};
var _hoisted_1$3 = {
	xmlns: "http://www.w3.org/2000/svg",
	width: "16px",
	height: "16px",
	viewBox: "0 0 16 16"
};
function _sfc_render$1(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$3, [..._cache[0] || (_cache[0] = [createElementVNode("polygon", {
		class: "arrow-up",
		fill: "#757699",
		points: "8 2 4.8 6 11.2 6"
	}, null, -1), createElementVNode("polygon", {
		class: "arrow-down",
		transform: "translate(8, 12) rotate(-180) translate(-8, -12) ",
		points: "8 10 4.8 14 11.2 14"
	}, null, -1)])]);
}
var SortIcon_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render$1]]);
//#endregion
//#region src/StkTable/components/TriangleIcon.vue
var _sfc_main = {};
var _hoisted_1$2 = { class: "stk-fold-icon" };
function _sfc_render(_ctx, _cache) {
	return openBlock(), createElementBlock("div", _hoisted_1$2);
}
var TriangleIcon_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render]]);
//#endregion
//#region src/StkTable/components/TreeNodeCell.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = ["title"];
//#endregion
//#region src/StkTable/components/TreeNodeCell.vue
var TreeNodeCell_default = /* @__PURE__ */ defineComponent({
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
			}, [__props.row.children !== void 0 ? (openBlock(), createBlock(TriangleIcon_default, {
				key: 0,
				onClick: _cache[0] || (_cache[0] = ($event) => emit("click"))
			})) : createCommentVNode("", true), createElementVNode("span", { style: normalizeStyle(!__props.row.children ? "padding-left: 16px;" : null) }, toDisplayString(__props.row[__props.col.dataIndex] ?? ""), 5)], 12, _hoisted_1$1);
		};
	}
});
//#endregion
//#region src/StkTable/types/index.ts
/** th td type */
var TagType = {
	TH: 0,
	TD: 1,
	/** tfoot */
	TF: 2
};
//#endregion
//#region src/StkTable/useAutoResize.ts
/**
* 窗口变化自动重置虚拟滚动
* @param tableContainerRef
* @param onResize 容器尺寸变化后的重算逻辑（虚拟滚动、固定列等）
* @param props
* @param debounceMs
*/
function useAutoResize(tableContainerRef, onResize, props, debounceMs) {
	let resizeObserver = null;
	let isObserved = false;
	watch(() => props.virtual, (v) => {
		if (v) initResizeObserver();
		else removeResizeObserver();
	});
	watch(() => props.virtualX, (v) => {
		if (v) initResizeObserver();
		else removeResizeObserver();
	});
	onMounted(() => {
		if (props.virtual || props.virtualX) initResizeObserver();
	});
	onBeforeUnmount(() => {
		removeResizeObserver();
	});
	function initResizeObserver() {
		if (isObserved) removeResizeObserver();
		if (window.ResizeObserver) {
			if (!tableContainerRef.value) {
				const watchDom = watch(() => tableContainerRef, () => {
					initResizeObserver();
					watchDom();
				});
				return;
			}
			resizeObserver = new ResizeObserver(resizeCallback);
			resizeObserver.observe(tableContainerRef.value);
		} else window.addEventListener("resize", resizeCallback);
		isObserved = true;
	}
	function removeResizeObserver() {
		if (!isObserved) return;
		if (resizeObserver) {
			resizeObserver.disconnect();
			resizeObserver = null;
		} else window.removeEventListener("resize", resizeCallback);
		isObserved = false;
	}
	let debounceTime = 0;
	function resizeCallback() {
		if (debounceTime) window.clearTimeout(debounceTime);
		debounceTime = window.setTimeout(() => {
			if (props.autoResize) {
				onResize();
				if (typeof props.autoResize === "function") props.autoResize();
			}
			debounceTime = 0;
		}, debounceMs);
	}
}
//#endregion
//#region src/StkTable/useColResize.ts
/** 列宽拖动 */
function useColResize(props, emits, tableContainerRef, tableHeaderLast, colResizeIndicatorRef, colKeyGen, fixedCols, onColWidthChange) {
	/** 列宽是否在拖动 */
	const isColResizing = ref(false);
	/** 列宽调整状态 */
	let colResizeState = {
		currentCol: null,
		lastCol: null,
		startX: 0,
		startOffsetTableX: 0,
		revertMoveX: false
	};
	/** 是否可拖动 */
	const colResizeOn = computed(() => {
		if (Object.prototype.toString.call(props.colResizable) === "[object Object]") return (col) => !props.colResizable.disabled(col);
		return () => props.colResizable;
	});
	onMounted(() => {
		initColResizeEvent();
	});
	onBeforeUnmount(() => {
		clearColResizeEvent();
	});
	/** 初始化列宽拖动事件 */
	function initColResizeEvent() {
		window.addEventListener("mousemove", onThResizeMouseMove);
		window.addEventListener("mouseup", onThResizeMouseUp);
	}
	/** 清除列宽拖动事件 */
	function clearColResizeEvent() {
		window.removeEventListener("mousemove", onThResizeMouseMove);
		window.removeEventListener("mouseup", onThResizeMouseUp);
	}
	/**
	* 拖动开始
	* @param e
	* @param col 当前列配置
	* @param leftHandle 是否是左侧的拖动条
	*/
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
			if (isColFixed && col.fixed === "right") revertMoveX = true;
			else if (colIndex - 1 >= 0) col = tableHeaderLastValue[colIndex - 1];
		} else if (isColFixed && col.fixed === "right") col = fixedCols.value[fixedIndex + 1] || col;
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
	/**
	* @param {MouseEvent} e
	*/
	function onThResizeMouseMove(e) {
		if (!isColResizing.value) return;
		e.stopPropagation();
		e.preventDefault();
		const { lastCol, startX, startOffsetTableX } = colResizeState;
		const { clientX } = e;
		let moveX = clientX - startX;
		const currentColWidth = getCalculatedColWidth(lastCol);
		const minWidth = (lastCol === null || lastCol === void 0 ? void 0 : lastCol.minWidth) ?? props.colMinWidth;
		if (currentColWidth + moveX < minWidth) moveX = -currentColWidth;
		const offsetTableX = startOffsetTableX + moveX;
		if (!colResizeIndicatorRef.value) return;
		colResizeIndicatorRef.value.style.left = offsetTableX + "px";
	}
	/**
	* @param {MouseEvent} e
	*/
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
			onColWidthChange === null || onColWidthChange === void 0 || onColWidthChange();
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
	/**获取最后一个叶子 */
	function findLastChildCol(column) {
		var _column$children;
		if (column === null || column === void 0 || (_column$children = column.children) === null || _column$children === void 0 ? void 0 : _column$children.length) {
			const lastChild = column.children.slice(-1)[0];
			return findLastChildCol(lastChild);
		}
		return column;
	}
	return [
		colResizeOn,
		isColResizing,
		onThResizeMouseDown
	];
}
//#endregion
//#region src/StkTable/useFixedCol.ts
/**
* 固定列处理
* @returns
*/
function useFixedCol(props, colKeyGen, getFixedColPosition, tableHeaders, tableHeadersForCalc, tableContainerRef) {
	/** 保存需要出现阴影的列 */
	const fixedShadowCols = shallowRef([]);
	/** 正在被固定的列 */
	const fixedCols = shallowRef([]);
	/**
	* 需要自行绘制左边框的右固定列。
	* 单元格的左边框由左侧相邻单元格的 border-right 提供，右固定列吸附遮挡内容后两者不再相邻，因此需要自行绘制。
	*/
	const fixedBorderLeftCols = shallowRef([]);
	/** 固定列的class */
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
				if (fixedColsValue.includes(col)) classList.push("fixed-cell--active");
				if (fixed) {
					classList.push("fixed-cell");
					classList.push("fixed-cell--" + fixed);
				}
				if (showShadow) classList.push("fixed-cell--shadow");
				if (fixed === "right" && fixedBorderLeftColsValue.includes(col)) classList.push("fixed-cell--border-left");
				colMap.set(colKeyFn(col), classList);
			}
		}
		return colMap;
	});
	/**
	* 返回所有父元素，包括自己
	* @param col
	* @param type 1-shadow（阴影） 2-active(被固定的列)
	*
	*/
	/** 滚动条变化时，更新需要展示阴影的列 */
	function updateFixedShadow(virtualScrollX) {
		const fixedColsTemp = [];
		const getFixedColPositionValue = getFixedColPosition.value;
		let clientWidth, scrollLeft;
		if (virtualScrollX === null || virtualScrollX === void 0 ? void 0 : virtualScrollX.value) {
			const { containerWidth: cw, scrollLeft: sl } = virtualScrollX.value;
			clientWidth = cw;
			scrollLeft = sl;
		} else {
			const { clientWidth: cw, scrollLeft: sl } = tableContainerRef.value;
			clientWidth = cw;
			scrollLeft = sl;
		}
		/*******
		* 根据横向滚动位置，计算出哪个列需要展示阴影
		*****/
		/** 左侧需要展示阴影的列 */
		const leftShadowCol = [];
		/** 右侧展示阴影的列 */
		const rightShadowCol = [];
		const len = tableHeadersForCalc.value.length;
		for (let level = 0; level < len; level++) {
			const row = tableHeadersForCalc.value[level];
			/**
			* 最右侧连续 fixed:right 列的起始下标。
			* 这些列的固定偏移只由其右侧固定列宽度决定，不依赖中间列的声明宽度，
			* 且 sticky/relative 在无横向溢出时偏移为0无副作用，因此无需判断滚动位置，始终固定。
			*/
			let rightSuffixStart = row.length;
			while (rightSuffixStart > 0 && row[rightSuffixStart - 1].fixed === "right") rightSuffixStart--;
			/**
			* 左侧第n个fixed:left 计算要加上前面所有left 的列宽。
			*/
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
					/** 是否需要固定。依赖列声明宽度累加，声明宽度与实际渲染宽度不一致时会失真 */
					const needFix = scrollLeft + clientWidth - left < position;
					if (i >= rightSuffixStart || needFix) fixedColsTemp.push(col);
					if (needFix && !rightShadowCol[level]) rightShadowCol[level] = col;
				}
			}
		}
		if (props.fixedColShadow) fixedShadowCols.value = leftShadowCol.concat(rightShadowCol).filter(Boolean);
		fixedBorderLeftCols.value = rightShadowCol.filter(Boolean);
		fixedCols.value = fixedColsTemp;
	}
	return [
		fixedCols,
		fixedColClassMap,
		updateFixedShadow
	];
}
//#endregion
//#region src/StkTable/useFixedStyle.ts
/**
* 固定列style
* @param props
* @param isRelativeMode
* @param getFixedColPosition
* @param virtualScroll
* @param virtualScrollX
* @param virtualX_on
* @param virtualX_offsetRight
* @returns
*/
function useFixedStyle(props, isRelativeMode, getFixedColPosition, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight) {
	/**
	* fixed columns style
	* @param tagType 1-th 2-td
	* @param col
	* @param depth tagType = 1时使用
	*/
	function getFixedStyle(tagType, col, depth = 0) {
		const { fixed } = col;
		if ((tagType === TagType.TD || tagType === TagType.TF) && !fixed) return "";
		const { headerRowHeight, rowHeight } = props;
		const isFixedLeft = fixed === "left";
		const { scrollLeft, scrollWidth, offsetLeft, containerWidth } = virtualScrollX.value;
		const scrollRight = scrollWidth - containerWidth - scrollLeft;
		let style = "";
		if (tagType === TagType.TH) if (!isRelativeMode.value) {
			if (depth) style += `top:${depth * (headerRowHeight ?? rowHeight)}px;`;
		} else style += `top:${virtualScroll.value.scrollTop}px;`;
		else if (tagType === TagType.TF) style += "bottom:0;";
		if (fixed) if (!isRelativeMode.value) {
			const lr = getFixedColPosition.value(col) + "px";
			if (isFixedLeft) style += `left:${lr};`;
			else style += `right:${lr};`;
		} else if (isFixedLeft) style += `left:${scrollLeft - (virtualX_on.value ? offsetLeft : 0)}px;`;
		else style += `right:${Math.max(scrollRight - (virtualX_on.value ? virtualX_offsetRight.value : 0), 0)}px;`;
		return style;
	}
	return getFixedStyle;
}
//#endregion
//#region src/StkTable/useGetFixedColPosition.ts
/**
* 固定列fixed左侧或者右侧的距离
* - col.fixed = left 则得到距离左侧的距离
* - col.fixed = right 则得到距离右侧的距离
*/
function useGetFixedColPosition(tableHeadersForCalc, colKeyGen) {
	return computed(() => {
		/** colKey 作为唯一标识 */
		const colKeyStore = {};
		/** 没有 colKey 的多级表头列，使用对象引用做标识 */
		const refStore = /* @__PURE__ */ new WeakMap();
		const colKeyGenValue = colKeyGen.value;
		tableHeadersForCalc.value.forEach((cols) => {
			let left = 0;
			/**遍历右侧fixed时，因为left已经遍历过一次了。所以，可以拿到right遍历边界 */
			let rightStartIndex = 0;
			for (let i = 0; i < cols.length; i++) {
				const item = cols[i];
				if (item.fixed === "left") {
					const colKey = colKeyGenValue(item);
					if (colKey) colKeyStore[colKey] = left;
					else refStore.set(item, left);
					left += getCalculatedColWidth(item);
				}
				if (!rightStartIndex && item.fixed === "right") rightStartIndex = i;
			}
			let right = 0;
			for (let i = cols.length - 1; i >= rightStartIndex; i--) {
				const item = cols[i];
				const colKey = colKeyGenValue(item);
				if (item.fixed === "right") {
					if (colKey) colKeyStore[colKey] = right;
					else refStore.set(item, right);
					right += getCalculatedColWidth(item);
				}
			}
		});
		return (col) => {
			const colKey = colKeyGenValue(col);
			return colKey ? colKeyStore[colKey] : refStore.get(col) || 0;
		};
	});
}
//#endregion
//#region src/StkTable/useHighlight.ts
/**
* 高亮单元格，行
*/
function useHighlight(props, stkTableId, tableContainerRef) {
	const config = props.highlightConfig;
	/** 高亮颜色 */
	const highlightColor = {
		light: HIGHLIGHT_COLOR.light,
		dark: HIGHLIGHT_COLOR.dark
	};
	/** 持续时间 */
	const highlightDuration = computed(() => config.duration ? config.duration * 1e3 : HIGHLIGHT_DURATION);
	/** 高亮频率*/
	const highlightFrequency = computed(() => config.fps && config.fps > 0 ? 1e3 / config.fps : null);
	/** 高亮帧数（非帧率），用于 timing-function: steps() */
	const highlightSteps = computed(() => highlightFrequency.value ? Math.round(highlightDuration.value / highlightFrequency.value) : null);
	/** 高亮开始 */
	const highlightFrom = computed(() => highlightColor[props.theme].from);
	/**
	* 存放高亮行的状态-使用animation api实现
	* @key 行唯一键
	* @value 记录高亮配置
	*/
	const highlightDimRowsAnimation = /* @__PURE__ */ new Map();
	/** 是否正在计算高亮行的循环-使用animation api实现 */
	let calcHighlightDimLoopAnimation = false;
	/** 高亮后渐暗的行定时器 */
	const highlightDimRowsTimeout = /* @__PURE__ */ new Map();
	/** 高亮后渐暗的单元格定时器 */
	const highlightDimCellsTimeout = /* @__PURE__ */ new Map();
	/** 高亮函数的默认参数 */
	const defaultHighlightDimOption = computed(() => {
		const keyframe = { backgroundColor: [highlightFrom.value, ""] };
		if (highlightSteps.value) keyframe.easing = `steps(${highlightSteps.value})`;
		return {
			duration: highlightDuration.value,
			keyframe
		};
	});
	/**
	* 计算高亮渐暗颜色的循环
	*/
	function calcRowHighlightLoop() {
		if (calcHighlightDimLoopAnimation) return;
		calcHighlightDimLoopAnimation = true;
		const recursion = () => {
			window.requestAnimationFrame(() => {
				const nowTs = performance.now();
				const keysToDelete = [];
				highlightDimRowsAnimation.forEach((store, rowKeyValue) => {
					const { ts, duration } = store;
					const timeOffset = nowTs - ts;
					if (timeOffset < duration) {
						if (updateRowAnimation(rowKeyValue, store, timeOffset)) keysToDelete.push(rowKeyValue);
					} else keysToDelete.push(rowKeyValue);
				});
				keysToDelete.forEach((key) => highlightDimRowsAnimation.delete(key));
				if (highlightDimRowsAnimation.size) recursion();
				else {
					calcHighlightDimLoopAnimation = false;
					highlightDimRowsAnimation.clear();
				}
			});
		};
		recursion();
	}
	/**
	* 高亮一个单元格。暂不支持虚拟滚动高亮状态记忆。
	* @param rowKeyValue 一行的key
	* @param colKeyValue 列key
	* @param options.method css-使用css渲染，animation-使用animation api。默认animation;
	* @param option.className 自定义css动画的class。
	* @param option.keyframe 如果自定义keyframe，则 highlightConfig.fps 将会失效。Keyframe：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
	* @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。
	*/
	function setHighlightDimCell(rowKeyValue, colKeyValue, option = {}) {
		var _tableContainerRef$va;
		const cellEl = (_tableContainerRef$va = tableContainerRef.value) === null || _tableContainerRef$va === void 0 ? void 0 : _tableContainerRef$va.querySelector(`[data-row-key="${rowKeyValue}"] [data-col-key="${colKeyValue}"]`);
		if (!cellEl) return;
		const { className, method, duration, keyframe } = {
			className: HIGHLIGHT_CELL_CLASS,
			method: "animation",
			...defaultHighlightDimOption.value,
			...option
		};
		if (method === "animation") cellEl.animate(keyframe, duration);
		else highlightCellsInCssKeyFrame(cellEl, rowKeyValue, colKeyValue, className, duration);
	}
	/**
	* 高亮一行
	* @param rowKeyValues 行唯一键的数组
	* @param option.method css-使用css渲染，animation-使用animation api，js-使用js计算颜色。默认animation
	* @param option.className 自定义css动画的class。
	* @param option.keyframe 如果自定义keyframe，则 highlightConfig.fps 将会失效。Keyframe：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats。
	* @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。。
	*/
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
		if (method === "animation") if (props.virtual) {
			const nowTs = performance.now();
			for (let i = 0; i < rowKeyValues.length; i++) {
				const rowKeyValue = rowKeyValues[i];
				const store = {
					ts: nowTs,
					visible: false,
					keyframe,
					duration,
					ignoreInvisible
				};
				const shouldDelete = updateRowAnimation(rowKeyValue, store, 0);
				if (ignoreInvisible && shouldDelete) highlightDimRowsAnimation.delete(rowKeyValue);
				else highlightDimRowsAnimation.set(rowKeyValue, store);
			}
			calcRowHighlightLoop();
		} else for (let i = 0; i < rowKeyValues.length; i++) {
			const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValues[i]));
			if (!rowEl) continue;
			rowEl.animate(keyframe, duration);
		}
		else highlightRowsInCssKeyframe(rowKeyValues, className, duration);
	}
	/**
	* 使用css @keyframes动画，实现高亮行动画
	* 此方案作为兼容方式。v0.3.4 将使用Element.animate 接口实现动画。
	*/
	function highlightRowsInCssKeyframe(rowKeyValues, className, duration) {
		/**是否需要重绘 */
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
			highlightDimRowsTimeout.set(rowKeyValue, window.setTimeout(() => {
				rowEl.classList.remove(className);
				highlightDimRowsTimeout.delete(rowKeyValue);
			}, duration));
		}
		if (needRepaint) {
			var _tableContainerRef$va2;
			(_tableContainerRef$va2 = tableContainerRef.value) === null || _tableContainerRef$va2 === void 0 || _tableContainerRef$va2.offsetWidth;
		}
		rowElTemp.forEach((el) => el.classList.add(className));
	}
	/**
	* 使用css @keyframes动画，实现高亮单元格动画
	* 此方案作为兼容方式。v0.3.4 将使用Element.animate 接口实现动画。
	*/
	function highlightCellsInCssKeyFrame(cellEl, rowKeyValue, colKeyValue, className, duration) {
		if (cellEl.classList.contains(className)) {
			cellEl.classList.remove(className);
			cellEl.offsetHeight;
		}
		cellEl.classList.add(className);
		const cellKey = `${rowKeyValue}-${colKeyValue}`;
		window.clearTimeout(highlightDimCellsTimeout.get(cellKey));
		if (!duration) return;
		highlightDimCellsTimeout.set(cellKey, window.setTimeout(() => {
			cellEl.classList.remove(className);
			highlightDimCellsTimeout.delete(cellKey);
		}, duration));
	}
	/**
	*  更新行状态
	* @param rowKeyValue 行唯一键
	* @param store highlightDimRowStore 的引用对象
	* @param timeOffset 距动画开始经过的时长
	* @returns 是否应该从store中删除（ignoreInvisible为true且DOM不存在时返回true）
	*/
	function updateRowAnimation(rowKeyValue, store, timeOffset) {
		const rowEl = document.getElementById(stkTableId + "-" + String(rowKeyValue));
		const { visible, ignoreInvisible } = store;
		if (!rowEl) {
			if (ignoreInvisible) return true;
			if (visible) store.visible = false;
			return false;
		}
		const { keyframe, duration: initialDuration } = store;
		if (!visible) {
			store.visible = true;
			/** 经过的时间 ÷ 高亮持续时间 计算出 颜色过渡进度 (0-1) */
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
	return [
		highlightSteps,
		setHighlightDimRow,
		setHighlightDimCell
	];
}
//#endregion
//#region src/StkTable/useKeyboardArrowScroll.ts
/** 翻页按键 */
var ScrollCodes = {
	ArrowUp: "ArrowUp",
	ArrowRight: "ArrowRight",
	ArrowDown: "ArrowDown",
	ArrowLeft: "ArrowLeft",
	PageUp: "PageUp",
	PageDown: "PageDown",
	Home: "Home",
	End: "End"
};
/** 所有翻页按键数组 */
var ScrollCodesValues = Object.values(ScrollCodes);
/**
* 按下键盘箭头滚动。只有悬浮在表体上才能生效键盘。
*
* 在低版本浏览器中，虚拟滚动时，使用键盘滚动，等选中的行消失在视口外时，滚动会失效。
*/
function useKeyboardArrowScroll(targetElement, props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on, areaSelectionConfig) {
	/** 检测鼠标是否悬浮在表格体上 */
	let isMouseOver = false;
	watch(virtual_on, (val) => {
		removeListeners();
		if (val) addEventListeners();
	});
	onMounted(addEventListeners);
	onBeforeUnmount(removeListeners);
	function addEventListeners() {
		var _targetElement$value, _targetElement$value2, _targetElement$value3;
		window.addEventListener("keydown", handleKeydown);
		(_targetElement$value = targetElement.value) === null || _targetElement$value === void 0 || _targetElement$value.addEventListener("mouseenter", handleMouseEnter);
		(_targetElement$value2 = targetElement.value) === null || _targetElement$value2 === void 0 || _targetElement$value2.addEventListener("mouseleave", handleMouseLeave);
		(_targetElement$value3 = targetElement.value) === null || _targetElement$value3 === void 0 || _targetElement$value3.addEventListener("mousedown", handleMouseDown);
	}
	function removeListeners() {
		var _targetElement$value4, _targetElement$value5, _targetElement$value6;
		window.removeEventListener("keydown", handleKeydown);
		(_targetElement$value4 = targetElement.value) === null || _targetElement$value4 === void 0 || _targetElement$value4.removeEventListener("mouseenter", handleMouseEnter);
		(_targetElement$value5 = targetElement.value) === null || _targetElement$value5 === void 0 || _targetElement$value5.removeEventListener("mouseleave", handleMouseLeave);
		(_targetElement$value6 = targetElement.value) === null || _targetElement$value6 === void 0 || _targetElement$value6.removeEventListener("mousedown", handleMouseDown);
	}
	/** 键盘按下事件 */
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
		/** 表体的page */
		const bodyPageSize = Math.floor((containerHeight - headerHeight) / rowHeight);
		if (keyCode === ScrollCodes.ArrowUp) scrollTo(scrollTop - rowHeight, null);
		else if (keyCode === ScrollCodes.ArrowRight) scrollTo(null, scrollLeft + 50);
		else if (keyCode === ScrollCodes.ArrowDown) scrollTo(scrollTop + rowHeight, null);
		else if (keyCode === ScrollCodes.ArrowLeft) scrollTo(null, scrollLeft - 50);
		else if (keyCode === ScrollCodes.PageUp) scrollTo(scrollTop - rowHeight * bodyPageSize + headerHeight, null);
		else if (keyCode === ScrollCodes.PageDown) scrollTo(scrollTop + rowHeight * bodyPageSize - headerHeight, null);
		else if (keyCode === ScrollCodes.Home) scrollTo(0, null);
		else if (keyCode === ScrollCodes.End) scrollTo(scrollHeight, null);
	}
	function handleMouseEnter() {
		isMouseOver = true;
	}
	function handleMouseLeave() {
		isMouseOver = false;
	}
	/**
	* 兜底。
	* 是否存在不触发mouseEnter的时候？
	*/
	function handleMouseDown() {
		if (!isMouseOver) isMouseOver = true;
	}
}
//#endregion
//#region src/StkTable/useMaxRowSpan.ts
function useMaxRowSpan(props, tableHeaderLast, rowKeyGen, dataSourceCopy) {
	/** max rowspan of each row */
	const maxRowSpan = /* @__PURE__ */ new Map();
	/**
	* Use dataSourceCopy and tableHeaderLast to calculate maxRowSpan
	* @link {maxRowSpan}
	*/
	function updateMaxRowSpan() {
		if (!props.virtual) {
			if (maxRowSpan.size) maxRowSpan.clear();
			return;
		}
		maxRowSpan.clear();
		const data = dataSourceCopy.value;
		const columnsWithMerge = tableHeaderLast.value.filter((col) => col.mergeCells);
		if (!columnsWithMerge.length) return;
		const dataLength = data.length;
		const mergeColumnsLength = columnsWithMerge.length;
		for (let rowIndex = 0; rowIndex < dataLength; rowIndex++) {
			const row = data[rowIndex];
			const rowKey = rowKeyGen(row);
			let currentMax = maxRowSpan.get(rowKey) || 0;
			for (let colIndex = 0; colIndex < mergeColumnsLength; colIndex++) {
				const col = columnsWithMerge[colIndex];
				const { rowspan = 1 } = col.mergeCells({
					row,
					col,
					rowIndex,
					colIndex
				}) || {};
				if (rowspan > 1 && rowspan > currentMax) {
					currentMax = rowspan;
					maxRowSpan.set(rowKey, currentMax);
				}
			}
		}
	}
	return [maxRowSpan, updateMaxRowSpan];
}
//#endregion
//#region src/StkTable/useMergeCells.ts
function useMergeCells(rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart) {
	/**
	* which cell need be hidden
	* - key: rowKey
	* - value: colKey Set
	*/
	const hiddenCellMap = ref(null);
	/**
	* hover other row and rowspan cell should be highlighted
	* - key: rowKey
	* - value: cellKey Set
	*/
	const hoverRowMap = ref({});
	/** hover current row , which rowspan cells should be highlight */
	const hoverMergedCells = ref(/* @__PURE__ */ new Set());
	/** click current row , which rowspan cells should be highlight */
	const activeMergedCells = ref(/* @__PURE__ */ new Set());
	/** column index cache */
	let colIndexCache = null;
	watch([virtual_dataSourcePart, tableHeaderLast], () => {
		hiddenCellMap.value = null;
		hoverRowMap.value = {};
		colIndexCache = null;
	});
	/**
	* abstract the logic of hiding cells
	*/
	function hideCells(rowKey, colKey, colspan, isSelfRow = false, mergeCellKey) {
		const headers = tableHeaderLast.value;
		const colKeyGenValue = colKeyGen.value;
		let startIndex = colIndexCache === null || colIndexCache === void 0 ? void 0 : colIndexCache.get(colKey);
		if (startIndex === void 0) {
			startIndex = headers.findIndex((item) => colKeyGenValue(item) === colKey);
			if (startIndex < 0) return;
			if (!colIndexCache) colIndexCache = /* @__PURE__ */ new Map();
			colIndexCache.set(colKey, startIndex);
		}
		if (!hoverRowMap.value[rowKey]) hoverRowMap.value[rowKey] = /* @__PURE__ */ new Set();
		if (!hiddenCellMap.value) hiddenCellMap.value = {};
		if (!hiddenCellMap.value[rowKey]) hiddenCellMap.value[rowKey] = /* @__PURE__ */ new Set();
		const hoverSet = hoverRowMap.value[rowKey];
		const hiddenSet = hiddenCellMap.value[rowKey];
		const endIndex = Math.min(startIndex + colspan, headers.length);
		for (let i = startIndex; i < endIndex; i++) {
			hoverSet.add(mergeCellKey);
			if (isSelfRow && i === startIndex) continue;
			const nextCol = headers[i];
			if (!nextCol) break;
			const nextColKey = colKeyGenValue(nextCol);
			hiddenSet.add(nextColKey);
		}
	}
	/**
	* calculate colspan and rowspan
	* @param row
	* @param col
	* @param rowIndex
	* @param colIndex
	* @returns
	*/
	function mergeCellsWrapper(row, col, rowIndex, colIndex) {
		if (!col.mergeCells) return;
		let { colspan, rowspan } = col.mergeCells({
			row,
			col,
			rowIndex,
			colIndex
		}) || {};
		colspan = colspan || 1;
		rowspan = rowspan || 1;
		if (colspan === 1 && rowspan === 1) return;
		const rowKey = rowKeyGen(row);
		const colKey = colKeyGen.value(col);
		const mergedCellKey = pureCellKeyGen(rowKey, colKey);
		for (let i = rowIndex; i < rowIndex + rowspan; i++) {
			const targetRow = virtual_dataSourcePart.value[i];
			if (!targetRow) break;
			hideCells(rowKeyGen(targetRow), colKey, colspan, i === rowIndex, mergedCellKey);
		}
		return {
			colspan,
			rowspan
		};
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
	return [
		hiddenCellMap,
		mergeCellsWrapper,
		hoverMergedCells,
		updateHoverMergedCells,
		activeMergedCells,
		updateActiveMergedCells
	];
}
//#endregion
//#region src/StkTable/useRowExpand.ts
function useRowExpand(emits, dataSourceCopy, rowKeyGen, onDataSourceChange) {
	const expandedKey = "__EXP__";
	function isExpanded(row, col) {
		return (row === null || row === void 0 ? void 0 : row[expandedKey]) === col ? !(row === null || row === void 0 ? void 0 : row[expandedKey]) : true;
	}
	/** click expended icon to toggle expand row */
	function toggleExpandRow(row, col) {
		setRowExpand(row, isExpanded(row, col), { col });
	}
	/**
	*
	* @param rowKeyOrRow rowKey or row
	* @param expand expand or collapse, if set null, toggle expand
	* @param data { col?: StkTableColumn<DT> }
	* @param data.silent if set true, not emit `toggle-row-expand`, default:false
	*/
	function setRowExpand(rowKeyOrRow, expand, data) {
		let rowKey;
		if (typeof rowKeyOrRow === "string" || typeof rowKeyOrRow === "number") rowKey = rowKeyOrRow;
		else rowKey = rowKeyGen(rowKeyOrRow);
		const tempData = dataSourceCopy.value.slice();
		const index = tempData.findIndex((it) => rowKeyGen(it) === rowKey);
		if (index === -1) {
			console.warn("expandRow failed.rowKey:", rowKey);
			return;
		}
		for (let i = index + 1; i < tempData.length; i++) {
			const rowKey = tempData[i].__R_K__;
			if (rowKey === null || rowKey === void 0 ? void 0 : rowKey.startsWith("expanded-")) {
				tempData.splice(i, 1);
				i--;
			} else break;
		}
		const row = tempData[index];
		const col = data === null || data === void 0 ? void 0 : data.col;
		if (expand == null) expand = isExpanded(row, col);
		if (expand) {
			const newExpandRow = {
				__R_K__: EXPANDED_ROW_KEY_PREFIX + rowKey,
				__EXP_R__: row,
				__EXP_C__: col
			};
			tempData.splice(index + 1, 0, newExpandRow);
		}
		if (row) row[expandedKey] = expand ? col : void 0;
		dataSourceCopy.value = tempData;
		onDataSourceChange();
		if (!(data === null || data === void 0 ? void 0 : data.silent)) emits("toggle-row-expand", {
			expanded: Boolean(expand),
			row,
			col
		});
	}
	return [toggleExpandRow, setRowExpand];
}
//#endregion
//#region src/StkTable/useScrollbar.ts
/** Detect if the primary pointer is a touch device (mobile/tablet). */
function isTouchPrimaryDevice() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
/**
* 自定义滚动条hooks
* @param containerRef 滚动容器的ref
* @param options 滚动条配置选项
* @returns 滚动条相关状态和方法
*/
function useScrollbar(props, containerRef, virtualScroll, virtualScrollX, updateVirtualScrollY, scrollbarOptions, isExperimentalScrollY) {
	const showScrollbar = ref({
		x: false,
		y: false
	});
	const scrollbar = ref({
		h: 0,
		w: 0,
		t: 0,
		l: 0
	});
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
		resizeObserver === null || resizeObserver === void 0 || resizeObserver.disconnect();
		resizeObserver = null;
	});
	function updateCustomScrollbar() {
		if (!scrollbarOptions.value.enabled || isMobileDevice) return;
		const { scrollHeight, scrollTop, containerHeight } = virtualScroll.value;
		const { scrollWidth, scrollLeft, containerWidth } = virtualScrollX.value;
		const needVertical = scrollHeight > containerHeight;
		const needHorizontal = scrollWidth > containerWidth;
		showScrollbar.value = {
			x: needHorizontal,
			y: needVertical
		};
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
		const deltaY = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - dragStartY;
		const { scrollHeight, containerHeight } = virtualScroll.value;
		const scrollRange = scrollHeight - containerHeight;
		const scrollDelta = deltaY / (containerHeight - scrollbar.value.h) * scrollRange;
		if (isExperimentalScrollY.value) {
			const ratio = containerHeight / scrollHeight;
			const top = Math.round((dragStartTop + scrollDelta) * ratio);
			const maxTop = containerHeight - scrollbar.value.h;
			scrollbar.value.t = top < 0 ? 0 : top > maxTop ? maxTop : top;
			rafUpdateVirtualScrollY(dragStartTop + scrollDelta);
		} else containerRef.value.scrollTop = dragStartTop + scrollDelta;
	}
	function onHorizontalDrag(e) {
		if (!isDraggingHorizontal) return;
		e.preventDefault();
		const deltaX = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - dragStartX;
		const { scrollWidth, containerWidth } = virtualScrollX.value;
		const scrollRange = scrollWidth - containerWidth;
		const scrollDelta = deltaX / (containerWidth - scrollbar.value.w) * scrollRange;
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
	return [
		scrollbar,
		showScrollbar,
		onVerticalScrollbarMouseDown,
		onHorizontalScrollbarMouseDown,
		updateCustomScrollbar
	];
}
//#endregion
//#region src/StkTable/useScrollRowByRow.ts
function useScrollRowByRow(props, tableContainerRef) {
	let isAddListeners = false;
	/** record the last scroll bar position */
	/** record is the scroll bar is dragging.debounce true to false */
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
					if (debounceTimer) window.clearTimeout(debounceTimer);
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
	/** is ScrollRowByRow active */
	const isSRBRActive = computed(() => {
		if (onlyDragScroll.value) return isDragScroll.value;
		return props.scrollRowByRow;
	});
	watch(onlyDragScroll, (v) => {
		if (v) addEventListener();
		else removeEventListener();
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
		if (e.target.classList.contains("stk-table")) isDragScroll.value = true;
	}
	function handleMouseUp() {
		isDragScroll.value = false;
	}
	return [isSRBRActive];
}
//#endregion
//#region src/StkTable/useSorter.ts
/**
* 排序切换顺序
* 循环顺序：null → desc → asc → null → ...
*/
var SORT_SWITCH_ORDER = [
	null,
	"desc",
	"asc"
];
/**
* 排序 Hook
* 管理表格排序状态和相关操作
* @param props 表格 props
* @param colKeyGen 列 key 生成函数
* @param tableHeaderLast 表头最后一行（叶子节点）
* @param dataSourceCopy 数据源副本 ref
* @param initDataSource 初始化数据源函数
* @param emits 事件发射函数
* @returns 排序相关状态和方法
*/
function useSorter(props, emits, colKeyGen, tableHeaderLast, dataSourceCopy, initDataSource) {
	/** 多列排序状态数组 */
	const sortStates = ref([]);
	/** 是否启用多列排序 */
	const isMultiSort = computed(() => props.sortConfig.multiSort ?? false);
	/** 多列排序限制 */
	const multiSortLimit = computed(() => props.sortConfig.multiSortLimit ?? 3);
	/** 对外暴露：当前排序的列 key（只读计算属性） */
	const sortCol = computed(() => {
		var _sortStates$value$;
		return (_sortStates$value$ = sortStates.value[0]) === null || _sortStates$value$ === void 0 ? void 0 : _sortStates$value$.dataIndex;
	});
	/**
	* 获取列的排序状态
	*/
	function getColumnSortState(colKey) {
		return sortStates.value[getSortStateIndex(colKey)];
	}
	/**
	* 获取列的排序状态索引
	*/
	function getSortStateIndex(colKey) {
		return sortStates.value.findIndex((s) => s.key === colKey || s.dataIndex === colKey);
	}
	function getTableCol(state) {
		return tableHeaderLast.value.find((c) => state.key && colKeyGen.value(c) === state.key || c.dataIndex === state.dataIndex);
	}
	/**
	* 获取排序列信息
	*/
	function getSortColumns() {
		return sortStates.value.map((s) => ({
			key: s.key || s.dataIndex,
			order: s.order
		}));
	}
	/**
	* 添加或更新排序状态到 sortStates
	* @param newState 新的排序状态
	* @param mode '1' - 追加模式（多列排序），0 - 替换模式（单列排序）
	*/
	function addOrUpdateSortState(newState, mode) {
		const existingIndex = getSortStateIndex(newState.key || newState.dataIndex);
		if (existingIndex >= 0) sortStates.value.splice(existingIndex, 1);
		if (mode && isMultiSort.value) {
			if (sortStates.value.length >= multiSortLimit.value) sortStates.value.pop();
			sortStates.value.unshift(newState);
		} else sortStates.value = [newState];
	}
	/**
	* 更新排序状态（点击表头时调用）
	*/
	function updateSortState(col, sortConfig) {
		const colKey = colKeyGen.value(col);
		const existingIndex = getSortStateIndex(colKey);
		let newOrder;
		const defaultSort = sortConfig.defaultSort;
		if (existingIndex >= 0) {
			const currentOrder = sortStates.value[existingIndex].order;
			if (currentOrder && defaultSort && (defaultSort.key === colKey || defaultSort.dataIndex === col.dataIndex)) {
				const defaultSwitchOrder = SORT_SWITCH_ORDER.filter((order) => order !== null);
				newOrder = defaultSwitchOrder[(defaultSwitchOrder.indexOf(currentOrder) + 1) % defaultSwitchOrder.length];
			} else newOrder = SORT_SWITCH_ORDER[(SORT_SWITCH_ORDER.indexOf(currentOrder) + 1) % 3];
			if (newOrder) addOrUpdateSortState({
				...sortStates.value[existingIndex],
				order: newOrder
			}, 1);
			else {
				sortStates.value.splice(existingIndex, 1);
				if (defaultSort === null || defaultSort === void 0 ? void 0 : defaultSort.order) {
					const { key, sortField, sortType } = getTableCol(defaultSort) || {};
					addOrUpdateSortState({
						key,
						sortField,
						sortType,
						...defaultSort
					}, 1);
				}
			}
		} else {
			newOrder = SORT_SWITCH_ORDER[1];
			addOrUpdateSortState({
				key: colKey,
				dataIndex: col.dataIndex,
				sortField: col.sortField,
				sortType: col.sortType,
				order: newOrder
			}, 1);
		}
		return newOrder;
	}
	/**
	* 对数据源执行排序
	* tableSort 内部会根据 sortChildren 配置自动处理树形递归排序
	*/
	function sortData(dataSource) {
		if (!sortStates.value.length) return dataSource;
		const sortConfig = {
			...DEFAULT_SORT_CONFIG,
			...props.sortConfig
		};
		let result = dataSource.slice();
		for (let i = sortStates.value.length - 1; i >= 0; i--) {
			const state = sortStates.value[i];
			const col = getTableCol(state);
			if (col && state.order) {
				const colSortConfig = {
					...sortConfig,
					...col.sortConfig
				};
				result = tableSort(col, state.order, result, colSortConfig);
			}
		}
		return result;
	}
	/**
	* 表头点击排序
	*/
	function onColumnSort(col) {
		if (!col) {
			console.warn("onColumnSort: not found col:", col);
			return;
		}
		if (!col.sorter) return;
		const sortConfig = {
			...DEFAULT_SORT_CONFIG,
			...props.sortConfig,
			...col.sortConfig
		};
		const order = updateSortState(col, sortConfig);
		if (!props.sortRemote) initDataSource();
		emits("sort-change", col, order, toRaw(dataSourceCopy.value), sortConfig);
	}
	/**
	* 设置表头排序状态
	*/
	function setSorter(colKey, order, option = {}) {
		var _dataSourceCopy$value;
		const newOption = {
			silent: true,
			sortOption: null,
			sort: true,
			append: false,
			...option
		};
		const colKeyGenValue = colKeyGen.value;
		let column;
		if (order) {
			column = newOption.sortOption || tableHeaderLast.value.find((it) => colKeyGenValue(it) === colKey);
			if (column) addOrUpdateSortState({
				key: colKey,
				dataIndex: column.dataIndex,
				sortField: column.sortField,
				sortType: column.sortType,
				order
			}, newOption.append && isMultiSort.value ? 1 : 0);
		} else sortStates.value = [];
		if (newOption.sort && ((_dataSourceCopy$value = dataSourceCopy.value) === null || _dataSourceCopy$value === void 0 ? void 0 : _dataSourceCopy$value.length)) {
			if (!props.sortRemote || newOption.force) initDataSource(props.dataSource, { forceSort: newOption.force });
		}
		if (!newOption.silent) {
			if (!column) column = newOption.sortOption || tableHeaderLast.value.find((it) => colKeyGenValue(it) === colKey);
			if (column) emits("sort-change", column, order, toRaw(dataSourceCopy.value), props.sortConfig);
			else console.warn("Can not find column by key:", colKey);
		}
		return dataSourceCopy.value;
	}
	/**
	* 重置排序器
	*/
	function resetSorter() {
		sortStates.value = [];
		initDataSource();
	}
	/**
	* 处理默认排序
	*/
	function dealDefaultSorter() {
		if (!props.sortConfig.defaultSort) return;
		const { key, dataIndex, order, silent } = {
			silent: true,
			...props.sortConfig.defaultSort
		};
		setSorter(key || dataIndex, order, {
			force: false,
			silent
		});
	}
	return [
		sortStates,
		sortCol,
		onColumnSort,
		setSorter,
		resetSorter,
		getSortColumns,
		dealDefaultSorter,
		getColumnSortState,
		sortData
	];
}
//#endregion
//#region src/StkTable/useTableColumns.ts
/**
* Table Columns Processing Hook
* Handles multi-level header processing and column flattening
*/
function useTableColumns(virtualX, isRelativeMode) {
	/**
	* 表头.内容是 props.columns 的引用集合
	* @eg
	* ```js
	* [
	*      [{dataIndex:'id',...}], // 第0行列配置
	*      [], // 第一行列配置
	*      //...
	* ]
	* ```
	*/
	const tableHeaders = shallowRef([]);
	/**
	* 用于计算多级表头的tableHeaders。模拟rowSpan 位置的辅助数组。用于计算固定列。
	*/
	const tableHeadersForCalc = shallowRef([]);
	/**
	* 处理多级表头
	* @param columns 原始列配置
	*/
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
				if (col.fixed === "left") leftCol.push(col);
				else if (col.fixed === "right") rightCol.push(col);
				else centerCol.push(col);
			}
			copyColumn = leftCol.concat(centerCol).concat(rightCol);
		}
		const maxDeep = howDeepTheHeader(copyColumn);
		for (let i = 0; i <= maxDeep; i++) {
			tableHeadersTemp[i] = [];
			tableHeadersForCalcTemp[i] = [];
		}
		/** 叶子列索引计数器，用于标注每个列在 tableHeaderLast 中的叶子范围 */
		let leafIndex = 0;
		/**
		* flat columns
		* @param arr
		* @param depth 深度
		* @param parent 父节点引用，用于构建双向链表。
		*/
		function flat(arr, parent, depth = 0) {
			/** 所有子节点数量 */
			let allChildrenLen = 0;
			let allChildrenWidthSum = 0;
			for (let i = 0, len = arr.length; i < len; i++) {
				const col = arr[i];
				if (col.hidden) continue;
				col.__P__ = parent;
				col.__LF_S__ = leafIndex;
				/** 一列中的子节点数量 */
				let colChildrenLen = 1;
				/** 多级表头的父节点宽度，通过叶子节点宽度计算得到 */
				let colWidth = 0;
				if (col.children) {
					const [len, widthSum] = flat(col.children, col, depth + 1);
					colChildrenLen = len;
					colWidth = widthSum;
					tableHeadersForCalcTemp[depth].push(col);
				} else {
					colWidth = getColWidth(col);
					leafIndex++;
					for (let j = depth; j <= maxDeep; j++) tableHeadersForCalcTemp[j].push(col);
				}
				col.__LF_E__ = leafIndex;
				col.__W__ = colWidth;
				tableHeadersTemp[depth].push(col);
				const rowSpan = col.children ? 1 : maxDeep - depth + 1;
				const colSpan = colChildrenLen;
				if (rowSpan > 1) col.__R_SP__ = rowSpan;
				if (colSpan > 1) col.__C_SP__ = colSpan;
				allChildrenLen += colChildrenLen;
				allChildrenWidthSum += colWidth;
			}
			return [allChildrenLen, allChildrenWidthSum];
		}
		flat(copyColumn, null);
		tableHeaders.value = tableHeadersTemp;
		tableHeadersForCalc.value = tableHeadersForCalcTemp;
	}
	return [
		tableHeaders,
		tableHeadersForCalc,
		dealColumns
	];
}
//#endregion
//#region src/StkTable/useThDrag.ts
/**
* 列顺序拖动
* @returns
*/
function useThDrag(props, emits, colKeyGen) {
	const dragConfig = computed(() => {
		const headerDrag = props.headerDrag;
		return {
			draggable: headerDrag !== false,
			mode: "insert",
			disabled: () => false,
			...headerDrag
		};
	});
	/** 开始拖动记录th位置 */
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
		if (!(th.getAttribute("draggable") === "true")) return;
		const dt = e.dataTransfer;
		if (dt) dt.dropEffect = "move";
		e.preventDefault();
	}
	/** th拖动释放时 */
	function onThDrop(e) {
		var _e$dataTransfer;
		const th = getClosestTh(e.target);
		if (!th) return;
		const dragStartKey = (_e$dataTransfer = e.dataTransfer) === null || _e$dataTransfer === void 0 ? void 0 : _e$dataTransfer.getData("text");
		if (dragStartKey !== th.dataset.colKey) handleColOrderChange(dragStartKey, th.dataset.colKey);
		emits("th-drop", th.dataset.colKey);
	}
	/** 列拖动交换顺序 */
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
	/** 是否可拖拽 */
	function isHeaderDraggable(col) {
		return dragConfig.value.draggable && !dragConfig.value.disabled(col);
	}
	return [
		onThDragStart,
		onThDragOver,
		onThDrop,
		isHeaderDraggable
	];
}
//#endregion
//#region src/StkTable/useTrDrag.ts
var TR_DRAGGING_CLASS = "tr-dragging";
var TR_DRAG_OVER_CLASS = "tr-dragging-over";
var DATA_TRANSFER_FORMAT = "text/plain";
/**
* 拖拽行
* TODO: 不在虚拟滚动的情况下，从上面拖拽到下面，跨页的时候，滚动条会自适应位置。没有顶上去
*/
function useTrDrag(props, emits, dataSourceCopy) {
	let trDragFlag = false;
	const dragRowConfig = computed(() => {
		return {
			mode: "insert",
			...props.dragRowConfig
		};
	});
	function onTrDragStart(e, rowIndex) {
		const tr = getClosestTr(e.target);
		if (tr) {
			var _e$dataTransfer;
			const trRect = tr.getBoundingClientRect();
			const x = e.clientX - (trRect.left ?? 0);
			(_e$dataTransfer = e.dataTransfer) === null || _e$dataTransfer === void 0 || _e$dataTransfer.setDragImage(tr, x, trRect.height / 2);
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
		if (dt) dt.dropEffect = "move";
	}
	let oldTr = null;
	function onTrDragEnter(e) {
		if (!trDragFlag) return;
		e.preventDefault();
		const tr = getClosestTr(e.target);
		if (oldTr && oldTr !== tr) oldTr.classList.remove(TR_DRAG_OVER_CLASS);
		if (tr) {
			oldTr = tr;
			tr.classList.add(TR_DRAG_OVER_CLASS);
		}
	}
	function onTrDragEnd(e) {
		if (!trDragFlag) return;
		const tr = getClosestTr(e.target);
		if (tr) tr.classList.remove(TR_DRAGGING_CLASS);
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
	return [
		onTrDragStart,
		onTrDragEnter,
		onTrDragOver,
		onTrDrop,
		onTrDragEnd
	];
}
//#endregion
//#region src/StkTable/useTree.ts
function useTree(props, dataSourceCopy, rowKeyGen, emits, onDataSourceChange) {
	const { defaultExpandAll, defaultExpandKeys, defaultExpandLevel } = props.treeConfig;
	/** It used to check if it is first load. To execute defaultExpandXXX */
	let isFirstLoad = true;
	/** click expended icon to toggle expand row */
	function toggleTreeNode(row, col) {
		privateSetTreeExpand(row, {
			expand: row ? !row.__T_EXP__ : false,
			col,
			isClick: true
		});
	}
	/**
	*
	* @param row rowKey or row
	* @param option
	* @param option.expand expand or collapse
	* @param option.all expand all descendants
	* @param option.level expand to the nth level
	* @param option.parents expand/collapse all ancestors of the given row, the target row itself is also expanded if it has children
	* @param option.silent if set true, not emit `toggle-tree-expand`, default:false
	*/
	function privateSetTreeExpand(row, option) {
		const rowKeyOrRowArr = Array.isArray(row) ? row : [row];
		const tempData = dataSourceCopy.value.slice();
		for (let i = 0; i < rowKeyOrRowArr.length; i++) {
			const rowKeyOrRow = rowKeyOrRowArr[i];
			let rowKey;
			if (typeof rowKeyOrRow === "string" || typeof rowKeyOrRow === "number") rowKey = rowKeyOrRow;
			else rowKey = rowKeyGen(rowKeyOrRow);
			const index = tempData.findIndex((it) => rowKeyGen(it) === rowKey);
			if (index === -1) {
				console.warn("treeExpandRow failed.rowKey:", rowKey);
				return;
			}
			const row = tempData[index];
			const level = row.__T_LV__ || 0;
			const wasExpanded = Boolean(row.__T_EXP__);
			let expanded = option === null || option === void 0 ? void 0 : option.expand;
			if (expanded === void 0) expanded = !row.__T_EXP__;
			if (option.all || option.level !== void 0) {
				const targetLevel = option.all ? Infinity : option.level || 0;
				setDescendantsToLevel(row, level + 1, targetLevel, expanded);
			}
			if (expanded) if (wasExpanded) {
				const deleteCount = foldNode(index, tempData, level);
				const children = expandNode(row, level);
				tempData.splice(index + 1, deleteCount, ...children);
			} else {
				const children = expandNode(row, level);
				tempData.splice(index + 1, 0, ...children);
			}
			else {
				const deleteCount = foldNode(index, tempData, level);
				tempData.splice(index + 1, deleteCount);
			}
			setNodeExpanded(row, expanded, level);
			if (option.isClick) emits("toggle-tree-expand", {
				expanded: Boolean(expanded),
				row,
				col: option.col
			});
		}
		dataSourceCopy.value = tempData;
		onDataSourceChange();
	}
	function setTreeExpand(row, option) {
		if (option === null || option === void 0 ? void 0 : option.parents) {
			var _target$children;
			const rowKeyOrRow = Array.isArray(row) ? row[0] : row;
			const rowKey = typeof rowKeyOrRow === "string" || typeof rowKeyOrRow === "number" ? rowKeyOrRow : rowKeyGen(rowKeyOrRow);
			const path = findPath(props.dataSource || [], rowKey);
			if (!path) {
				console.warn("treeExpandRow failed.rowKey:", rowKey);
				return;
			}
			const expanded = (option === null || option === void 0 ? void 0 : option.expand) !== false;
			const target = path[path.length - 1];
			const keys = path.slice(0, -1).map((it) => rowKeyGen(it));
			if (expanded && ((_target$children = target.children) === null || _target$children === void 0 ? void 0 : _target$children.length)) keys.push(rowKeyGen(target));
			if (!keys.length) return;
			if (!expanded) keys.reverse();
			privateSetTreeExpand(keys, {
				expand: expanded,
				isClick: false
			});
			return;
		}
		privateSetTreeExpand(row, {
			...option,
			isClick: false
		});
	}
	/**
	* 在原始树形数据中查找目标节点，返回从根节点到目标节点的完整路径（含目标节点自身）
	* en: Find target node in raw tree data, return the full path from root to target node (target included)
	* @returns full path including target, or null if target not found
	*/
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
		if (level !== void 0) row.__T_LV__ = level;
	}
	function recursionFlat(data, level, parent) {
		if (!data) return [];
		let result = [];
		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			result.push(item);
			const isExpanded = Boolean(item.__T_EXP__);
			setNodeExpanded(item, isExpanded, level, parent);
			if (isFirstLoad && !isExpanded) if (defaultExpandAll) setNodeExpanded(item, true);
			else {
				if (defaultExpandLevel && level < defaultExpandLevel) setNodeExpanded(item, true);
				if (defaultExpandKeys === null || defaultExpandKeys === void 0 ? void 0 : defaultExpandKeys.includes(rowKeyGen(item))) setNodeExpanded(item, true);
			}
			if (item.__T_EXP__) {
				const res = recursionFlat(item.children, level + 1, item);
				result = result.concat(res);
			}
		}
		return result;
	}
	/**
	* 根据保存的展开状态，深度遍历，展平树形数据。
	* en: flatten tree data by saved expand state.
	* @param data
	* @returns
	*/
	function flatTreeData(data) {
		const result = recursionFlat(data, 0);
		isFirstLoad = false;
		return result;
	}
	/**
	* 递归设置目标节点后代到指定层级的展开/折叠状态
	* en: Recursively set expand/collapse state for descendants up to the target level
	*/
	function setDescendantsToLevel(row, currentLevel, targetLevel, expanded) {
		if (!row.children || currentLevel > targetLevel) return;
		for (const child of row.children) {
			setNodeExpanded(child, expanded, currentLevel, row);
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
			} else setNodeExpanded(child, false, childLv, row);
		});
		return result;
	}
	function foldNode(index, tempData, level) {
		let deleteCount = 0;
		for (let i = index + 1; i < tempData.length; i++) {
			const child = tempData[i];
			if (child.__T_LV__ && child.__T_LV__ > level) deleteCount++;
			else break;
		}
		return deleteCount;
	}
	return [
		toggleTreeNode,
		setTreeExpand,
		flatTreeData
	];
}
//#endregion
//#region src/StkTable/useVirtualScroll.ts
/** 横向虚拟滚动列宽缓存，避免每次滚动都 O(n) 构建 */
function useColWidthCache(getColWidth) {
	let colWidthCache = {
		cols: null,
		nonFixedCols: [],
		leftFixedCols: []
	};
	function build(cols) {
		const nonFixedCols = [];
		const leftFixedCols = [];
		let cumWidth = 0;
		for (let i = 0; i < cols.length; i++) {
			const col = cols[i];
			const w = getColWidth(col);
			if (col.fixed === "left") {
				leftFixedCols.push({
					index: i,
					width: w
				});
				continue;
			}
			cumWidth += w;
			nonFixedCols.push({
				index: i,
				cumWidth
			});
		}
		colWidthCache = {
			cols,
			nonFixedCols,
			leftFixedCols
		};
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
/** vue2 优化滚动回收延时 */
var VUE2_SCROLL_TIMEOUT_MS = 200;
/**
* 合并单元格可视范围修正的最大迭代次数。
* 合法（不重叠）的合并配置最多 2 轮即收敛（1 轮扩展 + 1 轮验证）；
* 此上限仅针对重叠合并区域等病态配置兜底，防止修正循环过长。
*/
var MAX_MERGE_RANGE_EXPAND_ITERATIONS = 8;
/**
* virtual scroll
* @returns
*/
function useVirtualScroll(props, tableContainerRef, trRef, dataSourceCopy, tableHeaderLast, tableHeaders, rowKeyGen, maxRowSpan, scrollbarOptions, isExperimentalScrollY) {
	const tableHeaderHeight = computed(() => props.headerRowHeight * tableHeaders.value.length);
	const virtualScroll = ref({
		containerHeight: 0,
		rowHeight: props.rowHeight,
		pageSize: 0,
		startIndex: 0,
		endIndex: 0,
		offsetTop: 0,
		scrollTop: 0,
		scrollHeight: 0,
		translateY: 0
	});
	const virtualScrollX = ref({
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
	/** 是否虚拟滚动标志 */
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
				const rowHeight = getRowHeightFn.value(dataSourceCopyValue[i]);
				offsetBottom += rowHeight;
			}
			return offsetBottom;
		}
		return (dataSourceCopyValue.length - startIndex - virtual_dataSourcePart.value.length) * rowHeight;
	});
	const virtualX_on = computed(() => {
		return props.virtualX && tableHeaderLast.value.reduce((sum, col) => sum += getCalculatedColWidth(col), 0) > virtualScrollX.value.containerWidth + 100;
	});
	/** 是否多级表头 */
	const isMultiLevelHeader = computed(() => tableHeaders.value.length > 1);
	/**
	* 需要参与可视范围修正的合并列集合。仅依赖 tableHeaderLast（columns 变化），
	* 缓存后避免在数据更新、纵向滚动换窗等高频调用 buildColMergeRange 时重复收集。
	* 无需修正时返回 null。
	*/
	const virtualX_mergeColsInfo = computed(() => {
		const headers = tableHeaderLast.value;
		const headerLength = headers.length;
		let maxColIndex = headerLength;
		const mergeCols = [];
		for (let i = 0; i < headerLength; i++) {
			const col = headers[i];
			if (maxColIndex === headerLength && col.fixed === "right") maxColIndex = i;
			if (col.mergeCells && !col.fixed) mergeCols.push({
				col,
				index: i
			});
		}
		if (!mergeCols.length || !maxColIndex) return null;
		return {
			headerLength,
			maxColIndex,
			mergeCols
		};
	});
	/**
	* 收集行集合中的列合并（colspan）区间
	* @param rows 行数据
	* @param rowIndexBase mergeCells 入参 rowIndex 的起始值
	*/
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
				const { colspan = 1 } = col.mergeCells({
					row,
					col,
					rowIndex: rowIndexBase + r,
					colIndex: index
				}) || {};
				if (colspan > 1) {
					const end = Math.min(index + colspan, maxColIndex);
					for (let c = index; c < end; c++) {
						if (leftReach[c] === -1 || index < leftReach[c]) leftReach[c] = index;
						if (end > rightEnd[c]) rightEnd[c] = end;
					}
				}
			}
		}
		return {
			leftReach,
			rightEnd
		};
	}
	/**
	* 全量数据的列合并覆盖信息（懒计算）。
	* 仅在 Y 虚拟滚动未开启（可视行即全量数据）且被消费时才遍历全量数据；
	* 依赖 dataSourceCopy 与 columns，数据/列变化时自动重算。
	* virtual + virtualX 模式下消费方走可视行分支，本 computed 直接返回 null，
	* 避免 O(rows × mergeCols) 的全量 mergeCells 调用浪费。
	*/
	const virtualX_colMergeRangeFull = computed(() => {
		if (!virtualX_on.value || virtual_on.value) return null;
		return buildColMergeRange(dataSourceCopy.value, 0);
	});
	/**
	* virtual-x 列合并覆盖信息。
	* Y 虚拟滚动开启时仅计算可视行（rowIndex 与渲染时 mergeCells 入参保持一致）；
	* 否则使用全量数据懒计算缓存（此时可视行即全量数据）。
	*/
	const virtualX_colMergeRange = computed(() => {
		if (!virtualX_on.value) return null;
		if (virtual_on.value) return buildColMergeRange(virtual_dataSourcePart.value, 0);
		return virtualX_colMergeRangeFull.value;
	});
	/**
	* 经列合并修正后的可视列范围。
	* 合并单元格的锚点列可能已滚出可视区（但合并区域仍覆盖可视列），
	* 也可能合并区域超出可视区右边界，需要将范围扩展到能完整渲染合并单元格。
	*/
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
		return {
			startIndex,
			endIndex
		};
	});
	/**
	* 多级表头横向虚拟滚动参数：以顶层列组为单位计算开始/结束位置。
	* - 只有整个顶层组完全滚出视口时才移除（避免 colSpan 变化导致抖动）。
	* - 单级表头时退化为与 tbody 相同的参数。
	* - 范围基于列合并修正后的 virtualX_colRange，保证合并单元格完整渲染。
	*/
	const theadVirtualX = computed(() => {
		if (!virtualX_on.value) {
			const { startIndex, endIndex, offsetLeft } = virtualScrollX.value;
			return {
				startIndex,
				endIndex,
				offsetLeft
			};
		}
		const { startIndex, endIndex } = virtualX_colRange.value;
		if (!isMultiLevelHeader.value) {
			const { nonFixedCols } = getColWidthCache(tableHeaderLast.value);
			const found = binarySearch(nonFixedCols, (mid) => nonFixedCols[mid].index < startIndex ? -1 : 1);
			return {
				startIndex,
				endIndex,
				offsetLeft: found > 0 ? nonFixedCols[found - 1].cumWidth : 0
			};
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
		if (!foundStart) theadOffsetLeft = cumLeft;
		return {
			startIndex: theadStartIndex,
			endIndex: theadEndIndex,
			offsetLeft: theadOffsetLeft
		};
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
					if (col.fixed === "right") rightFixedCols.push(col);
					else if (col.fixed === "left") leftFixedCols.push(col);
					else if (i >= validStartIndex && i < validEndIndex) visibleCols.push(col);
				}
				const result = [];
				result.push(...leftFixedCols);
				const theadStart = theadVirtualX.value.startIndex;
				const leftSpacerColspan = Math.max(0, startIndex - theadStart);
				if (leftSpacerColspan) result.push({ __VT_C_SP__: leftSpacerColspan });
				result.push(...visibleCols);
				const rightSpacerColspan = Math.max(0, theadVirtualX.value.endIndex - endIndex);
				if (rightSpacerColspan) result.push({ __VT_C_SP__: rightSpacerColspan });
				result.push(...rightFixedCols);
				return result;
			}
			const leftCols = [];
			const rightCols = [];
			for (let i = 0; i < validStartIndex; i++) {
				const col = tableHeaderLastValue[i];
				if ((col === null || col === void 0 ? void 0 : col.fixed) === "left") leftCols.push(col);
			}
			for (let i = validEndIndex; i < tableHeaderLastValue.length; i++) {
				const col = tableHeaderLastValue[i];
				if ((col === null || col === void 0 ? void 0 : col.fixed) === "right") rightCols.push(col);
			}
			const mainColumns = tableHeaderLastValue.slice(validStartIndex, validEndIndex);
			return leftCols.concat(mainColumns).concat(rightCols);
		}
		return tableHeaderLastValue;
	});
	/**
	* 表头横向虚拟滚动：
	* - 单级表头：最后一行使用 virtualX_columnPart，其他行原样返回。
	* - 多级表头：按顶层组粒度过滤（整个组滚出才移除），保持 colSpan 稳定。
	*/
	const virtualX_tableHeaders = computed(() => {
		if (!virtualX_on.value) return tableHeaders.value;
		if (isMultiLevelHeader.value) {
			const { startIndex, endIndex } = theadVirtualX.value;
			return tableHeaders.value.map((row) => {
				return row.filter((col) => {
					if (col.fixed === "left" || col.fixed === "right") return true;
					const leafStart = col.__LF_S__ ?? 0;
					return (col.__LF_E__ ?? leafStart + 1) > startIndex && leafStart < endIndex;
				});
			});
		}
		const headers = tableHeaders.value;
		return headers.map((row, i) => i === headers.length - 1 ? virtualX_columnPart.value : row);
	});
	/** 展开行 colspan：虚拟滚动时等于所有 td 元素数量（含 spacer）之和 */
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
			if (col.fixed !== "right") width += getCalculatedColWidth(col);
		}
		return width;
	});
	const getRowHeightFn = computed(() => {
		const rowHeight = props.rowHeight || 28;
		let rowHeightFn = () => rowHeight;
		if (props.autoRowHeight) {
			const tempRowHeightFn = rowHeightFn;
			rowHeightFn = (row) => getAutoRowHeight(row) || tempRowHeightFn(row);
		}
		if (hasExpandCol.value) {
			var _props$expandConfig;
			const expandedRowHeight = (_props$expandConfig = props.expandConfig) === null || _props$expandConfig === void 0 ? void 0 : _props$expandConfig.height;
			const tempRowHeightFn = rowHeightFn;
			rowHeightFn = (row) => row && row.__EXP_R__ && expandedRowHeight || tempRowHeightFn(row);
		}
		return rowHeightFn;
	});
	/**
	* 初始化虚拟滚动参数
	* @param {number} [height] 虚拟滚动的高度
	*/
	function initVirtualScroll(height) {
		initVirtualScrollY(height);
		initVirtualScrollX();
	}
	/**
	* 初始化Y虚拟滚动参数
	* @param {number} [height] 虚拟滚动的高度
	*/
	function initVirtualScrollY(height) {
		var _tableContainerRef$va;
		if (height !== void 0 && typeof height !== "number") {
			console.warn("initVirtualScrollY: height must be a number");
			height = 0;
		}
		const { clientHeight, scrollHeight } = tableContainerRef.value || {};
		let scrollTop = isExperimentalScrollY.value ? virtualScroll.value.scrollTop : ((_tableContainerRef$va = tableContainerRef.value) === null || _tableContainerRef$va === void 0 ? void 0 : _tableContainerRef$va.scrollTop) || 0;
		const rowHeight = getRowHeightFn.value();
		const containerHeight = height || clientHeight || 100;
		const { headless } = props;
		let pageSize = Math.ceil(containerHeight / rowHeight);
		if (!headless) {
			/** 表头高度占几行表体高度数 */
			const headerToBodyRowHeightCount = Math.floor(tableHeaderHeight.value / rowHeight);
			pageSize -= headerToBodyRowHeightCount;
		}
		const maxScrollTop = Math.max(0, dataSourceCopy.value.length * rowHeight + tableHeaderHeight.value - containerHeight);
		if (scrollTop > maxScrollTop)
 /** fix： 滚动条不在顶部时，表格数据变少，导致滚动条位置有误 */
		scrollTop = maxScrollTop;
		Object.assign(virtualScroll.value, {
			containerHeight,
			pageSize,
			scrollHeight
		});
		updateVirtualScrollY(scrollTop);
	}
	function initVirtualScrollX() {
		const { clientWidth, scrollLeft, scrollWidth } = tableContainerRef.value || {};
		virtualScrollX.value.containerWidth = clientWidth || 200;
		virtualScrollX.value.scrollWidth = scrollWidth || 200;
		updateVirtualScrollX(scrollLeft);
	}
	let vue2ScrollYTimeout = null;
	/**
	* every row actual height.
	* FIXME: use a weak map instead of a plain map
	*/
	const autoRowHeightMap = /* @__PURE__ */ new Map();
	/** 如果行高度有变化，则要调用此方法清除保存的行高 */
	function setAutoHeight(rowKey, height) {
		const key = String(rowKey);
		if (!height) autoRowHeightMap.delete(key);
		else autoRowHeightMap.set(key, height);
	}
	function clearAllAutoHeight() {
		autoRowHeightMap.clear();
	}
	function getAutoRowHeight(row) {
		var _props$autoRowHeight;
		if (!row) return;
		const rowKey = rowKeyGen(row);
		const storedHeight = autoRowHeightMap.get(String(rowKey));
		if (storedHeight) return storedHeight;
		const expectedHeight = (_props$autoRowHeight = props.autoRowHeight) === null || _props$autoRowHeight === void 0 ? void 0 : _props$autoRowHeight.expectedHeight;
		if (expectedHeight) if (typeof expectedHeight === "function") return expectedHeight(row);
		else return expectedHeight;
	}
	/** 通过滚动条位置，计算虚拟滚动的参数 */
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
		if (!virtual_on.value) {
			Object.assign(virtualScroll.value, {
				startIndex: 0,
				endIndex: 0,
				offsetTop: 0
			});
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
			if (startIndex === oldStartIndex && endIndex === oldEndIndex) return;
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
					if (spanEndIndex > endIndex) correctedEndIndex = spanEndIndex;
					break;
				}
			}
			for (let i = correctedStartIndex; i < endIndex; i++) {
				const row = dataSourceCopyTemp[i];
				if (!row) continue;
				const spanEndIndex = i + (maxRowSpan.get(rowKeyGen(row)) || 1);
				if (spanEndIndex > correctedEndIndex) correctedEndIndex = Math.max(spanEndIndex, correctedEndIndex);
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
		if (startIndex >= endIndex) startIndex = endIndex - pageSize;
		if (vue2ScrollYTimeout) window.clearTimeout(vue2ScrollYTimeout);
		let offsetTop = 0;
		if (autoRowHeight || hasExpandCol.value) offsetTop = autoRowHeightTop;
		else offsetTop = startIndex * rowHeight;
		/**
		* en:  If scroll faster than one page, roll back
		*/
		if (!optimizeVue2Scroll || sTop <= scrollTop || Math.abs(oldStartIndex - startIndex) >= pageSize) Object.assign(virtualScroll.value, {
			startIndex,
			endIndex,
			offsetTop
		});
		else {
			virtualScroll.value.endIndex = endIndex;
			vue2ScrollYTimeout = window.setTimeout(() => {
				Object.assign(virtualScroll.value, {
					startIndex,
					offsetTop
				});
			}, VUE2_SCROLL_TIMEOUT_MS);
		}
	}
	let vue2ScrollXTimeout = null;
	/**
	* Calculate virtual scroll parameters based on horizontal scroll bar position
	*/
	function updateVirtualScrollX(sLeft = 0) {
		if (!props.virtualX) return;
		const tableHeaderLastValue = tableHeaderLast.value;
		const headerLength = tableHeaderLastValue === null || tableHeaderLastValue === void 0 ? void 0 : tableHeaderLastValue.length;
		if (!headerLength) return;
		const { scrollLeft, containerWidth } = virtualScrollX.value;
		let startIndex = 0;
		let offsetLeft = 0;
		/** 横向滚动时，第一列的剩余宽度 */
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
		} else if (nonFixedCols.length > 0) startIndex = nonFixedCols[0].index;
		let actualLeftColWidthSum = 0;
		for (const leftCol of leftFixedCols) {
			if (leftCol.index >= startIndex) break;
			actualLeftColWidthSum += leftCol.width;
		}
		const containerW = containerWidth - actualLeftColWidthSum;
		let endIndex = headerLength;
		let endColWidthSum = leftFirstColRestWidth;
		/**
		* 这里根据 leftFirstColRestWidth 如果为0 说明开始位置恰好在单元格边界，则计算endIndex 需要从当前单元格开始。
		* 如果有值，则说明开始位置的单元格已经切了一半，需要从下一个单元格开始计算 因此startIndex + 1。
		*/
		for (let colIndex = leftFirstColRestWidth ? startIndex + 1 : startIndex; colIndex < headerLength; colIndex++) {
			const col = tableHeaderLastValue[colIndex];
			endColWidthSum += getCalculatedColWidth(col);
			if (endColWidthSum >= containerW) {
				endIndex = colIndex + 1;
				break;
			}
		}
		endIndex = Math.min(endIndex, headerLength);
		if (vue2ScrollXTimeout) window.clearTimeout(vue2ScrollXTimeout);
		if (!props.optimizeVue2Scroll || sLeft <= scrollLeft) Object.assign(virtualScrollX.value, {
			startIndex,
			endIndex,
			offsetLeft,
			scrollLeft: sLeft
		});
		else {
			Object.assign(virtualScrollX.value, {
				endIndex,
				scrollLeft: sLeft
			});
			vue2ScrollXTimeout = window.setTimeout(() => {
				Object.assign(virtualScrollX.value, {
					startIndex,
					offsetLeft
				});
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
		virtualX_columnPart
	];
}
//#endregion
//#region src/StkTable/useWheeling.ts
function useWheeling(resetDelay = 500) {
	let valueRef = false;
	let timerRef = 0;
	const get = () => valueRef;
	const set = (newValue) => {
		valueRef = newValue;
		if (newValue) {
			if (timerRef) self.clearTimeout(timerRef);
			timerRef = self.setTimeout(() => {
				valueRef = false;
				timerRef = 0;
			}, resetDelay);
		}
	};
	return [get, set];
}
//#endregion
//#region src/StkTable/StkTable.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["tabindex"];
var _hoisted_2 = { class: "stk-table-scroll-container" };
var _hoisted_3 = { key: 0 };
var _hoisted_4 = { key: 1 };
var _hoisted_5 = ["onClick"];
var _hoisted_6 = ["onMousedown"];
var _hoisted_7 = { class: "table-header-title" };
var _hoisted_8 = ["onMousedown"];
var _hoisted_9 = ["colspan"];
var _hoisted_10 = ["title"];
var _hoisted_11 = { key: 0 };
var _hoisted_12 = ["colspan"];
var _hoisted_13 = ["colspan"];
var _hoisted_14 = {
	class: "table-cell-wrapper",
	tabindex: "-1"
};
var _hoisted_15 = {
	key: 0,
	class: "vt-x-left"
};
var _hoisted_16 = ["colspan"];
var _hoisted_17 = ["title"];
var _hoisted_18 = {
	key: 2,
	class: "table-cell-wrapper",
	tabindex: "-1"
};
var _hoisted_19 = ["title"];
var _hoisted_20 = { key: 2 };
var _hoisted_21 = {
	key: 1,
	class: "vt-x-right"
};
//#endregion
//#region src/StkTable/StkTable.vue
var StkTable_default = /* @__PURE__ */ defineComponent({
	name: "StkTable",
	props: {
		width: { default: "" },
		minWidth: { default: "" },
		maxWidth: { default: "" },
		stripe: {
			type: Boolean,
			default: false
		},
		fixedMode: {
			type: Boolean,
			default: false
		},
		headless: {
			type: Boolean,
			default: false
		},
		theme: { default: "light" },
		rowHeight: { default: 28 },
		autoRowHeight: {
			type: [Boolean, Object],
			default: () => false
		},
		rowHover: {
			type: Boolean,
			default: true
		},
		rowActive: {
			type: [Boolean, Object],
			default: () => DEFAULT_ROW_ACTIVE_CONFIG
		},
		rowCurrentRevokable: {
			type: Boolean,
			default: true
		},
		headerRowHeight: { default: 28 },
		footerRowHeight: { default: 28 },
		virtual: {
			type: Boolean,
			default: false
		},
		virtualX: {
			type: Boolean,
			default: false
		},
		columns: { default: () => [] },
		dataSource: { default: () => [] },
		rowKey: {
			type: [
				String,
				Number,
				Function
			],
			default: ""
		},
		colKey: {
			type: [
				String,
				Number,
				Function
			],
			default: void 0
		},
		emptyCellText: {
			type: [String, Function],
			default: "--"
		},
		noDataFull: {
			type: Boolean,
			default: false
		},
		showNoData: {
			type: Boolean,
			default: true
		},
		sortRemote: {
			type: Boolean,
			default: false
		},
		showHeaderOverflow: {
			type: Boolean,
			default: false
		},
		showOverflow: {
			type: Boolean,
			default: false
		},
		showTrHoverClass: {
			type: Boolean,
			default: false
		},
		cellHover: {
			type: Boolean,
			default: false
		},
		cellActive: {
			type: Boolean,
			default: false
		},
		selectedCellRevokable: {
			type: Boolean,
			default: true
		},
		areaSelection: {
			type: Boolean,
			default: false
		},
		headerDrag: {
			type: [Boolean, Object],
			default: () => false
		},
		rowClassName: {
			type: Function,
			default: () => ""
		},
		colResizable: {
			type: [Boolean, Object],
			default: () => false
		},
		colMinWidth: { default: 10 },
		bordered: {
			type: [Boolean, String],
			default: true
		},
		autoResize: {
			type: [Boolean, Function],
			default: true
		},
		fixedColShadow: {
			type: Boolean,
			default: false
		},
		optimizeVue2Scroll: {
			type: Boolean,
			default: false
		},
		sortConfig: { default: () => DEFAULT_SORT_CONFIG },
		hideHeaderTitle: {
			type: [Boolean, Array],
			default: false
		},
		highlightConfig: { default: () => ({}) },
		seqConfig: { default: () => ({}) },
		expandConfig: { default: () => ({}) },
		dragRowConfig: { default: () => ({}) },
		treeConfig: { default: () => ({}) },
		cellFixedMode: { default: "sticky" },
		smoothScroll: {
			type: Boolean,
			default: DEFAULT_SMOOTH_SCROLL
		},
		scrollRowByRow: {
			type: [Boolean, String],
			default: false
		},
		scrollbar: {
			type: [Boolean, Object],
			default: false
		},
		experimental: { default: () => ({}) },
		footerData: { default: () => [] },
		footerConfig: { default: () => ({ position: "bottom" }) }
	},
	emits: [
		"sort-change",
		"row-click",
		"current-change",
		"cell-selected",
		"row-dblclick",
		"header-row-menu",
		"row-menu",
		"cell-click",
		"cell-mouseenter",
		"cell-mouseleave",
		"cell-mouseover",
		"cell-mousedown",
		"header-cell-click",
		"scroll",
		"scroll-x",
		"col-order-change",
		"th-drag-start",
		"th-drop",
		"row-order-change",
		"col-resize",
		"toggle-row-expand",
		"toggle-tree-expand",
		"area-selection-change",
		"filter-change",
		"update:columns"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		/**
		* @author japlus
		*/
		const stkTableId = createStkTableId();
		/**
		* props cannot be placed in a separate file. It will cause compilation errors with vue 2.7 compiler.
		*/
		const props = __props;
		provide("stkTheme", toRef(props, "theme"));
		const emits = __emit;
		const tableContainerRef = ref();
		const colResizeIndicatorRef = ref();
		const trRef = ref();
		/** 是否使用 relative 固定头和列 */
		const isRelativeMode = ref(IS_LEGACY_MODE ? true : props.cellFixedMode === "relative");
		/** 表格底部是否吸附在顶部 */
		const isFooterTop = computed(() => {
			var _props$footerConfig;
			return ((_props$footerConfig = props.footerConfig) === null || _props$footerConfig === void 0 ? void 0 : _props$footerConfig.position) === "top";
		});
		/** 表格底部标签名：顶部吸附用 tbody，底部吸附用 tfoot */
		const footerTagName = computed(() => isFooterTop.value ? "tbody" : "tfoot");
		/**
		* 当前选中的一行
		* - shallowRef： 使 currentRow.value === row 地址相同。防止rowKeyGen 的WeakMap key不一致。
		*/
		const currentRow = shallowRef();
		/**
		* 保存当前选中行的key<br>
		* 原因：vue3 不用ref包dataSource时，row为原始对象，与currentItem（Ref）相比会不相等。
		*/
		const currentRowKey = ref();
		/** 当前选中的单元格key  */
		const currentSelectedCellKey = ref();
		/** 当前hover行 */
		let currentHoverRow = null;
		/** 当前hover的行的key */
		const currentHoverRowKey = ref(null);
		/** 当前hover的列的key */
		const [tableHeaders, tableHeadersForCalc, dealColumns] = useTableColumns(props.virtualX, isRelativeMode);
		const filterStatus = ref({});
		/** 最后一行的tableHeaders.内容是 props.columns 的引用集合  */
		const tableHeaderLast = computed(() => tableHeadersForCalc.value.slice(-1)[0] || []);
		const isTreeData = computed(() => {
			return props.columns.some((col) => col.type === "tree-node");
		});
		const rowActiveProp = computed(() => {
			const { rowActive } = props;
			if (typeof rowActive === "boolean") return {
				...DEFAULT_ROW_ACTIVE_CONFIG,
				enabled: rowActive ?? true,
				revokable: Boolean(props.rowCurrentRevokable)
			};
			else return {
				...DEFAULT_ROW_ACTIVE_CONFIG,
				...rowActive
			};
		});
		const dataSourceCopy = shallowRef([]);
		const rowKeyGenComputed = computed(() => {
			const { rowKey } = props;
			if (typeof rowKey === "function") return (row) => rowKey(row);
			else return (row) => row[rowKey];
		});
		const colKeyGen = computed(() => {
			const { colKey } = props;
			if (colKey === void 0) return (col) => col.key || col.dataIndex;
			else if (typeof colKey === "function") return (col) => colKey(col);
			else return (col) => col[colKey];
		});
		const getEmptyCellText = computed(() => {
			const { emptyCellText } = props;
			if (typeof emptyCellText === "string") return () => emptyCellText;
			else return (col, row) => emptyCellText({
				row,
				col
			});
		});
		/** scroll-row-by-row total-height */
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
			var _scrollbarOptions$val, _props$experimental;
			if (((_scrollbarOptions$val = scrollbarOptions.value) === null || _scrollbarOptions$val === void 0 ? void 0 : _scrollbarOptions$val.enabled) && props.scrollRowByRow) return true;
			return (_props$experimental = props.experimental) === null || _props$experimental === void 0 ? void 0 : _props$experimental.scrollY;
		});
		const rowKeyGenCache = /* @__PURE__ */ new WeakMap();
		const [sortStates, sortCol, onColumnSort, setSorter, resetSorter, getSortColumns, dealDefaultSorter, getColumnSortState, sortData] = useSorter(props, emits, colKeyGen, tableHeaderLast, dataSourceCopy, initDataSource);
		const [isSRBRActive] = useScrollRowByRow(props, tableContainerRef);
		const [onThDragStart, onThDragOver, onThDrop, isHeaderDraggable] = useThDrag(props, emits, colKeyGen);
		const [onTrDragStart, onTrDragEnter, onTrDragOver, onTrDrop, onTrDragEnd] = useTrDrag(props, emits, dataSourceCopy);
		const [maxRowSpan, updateMaxRowSpan] = useMaxRowSpan(props, tableHeaderLast, rowKeyGen, dataSourceCopy);
		const [virtualScroll, virtualScrollX, virtual_on, virtual_dataSourcePart, virtual_offsetBottom, virtualX_on, virtualX_offsetRight, tableHeaderHeight, initVirtualScroll, initVirtualScrollY, initVirtualScrollX, updateVirtualScrollY, updateVirtualScrollX, setAutoHeight, clearAllAutoHeight, clearColWidthCache, virtualX_tableHeaders, expandRowColspan, theadVirtualX, virtualX_columnPart] = useVirtualScroll(props, tableContainerRef, trRef, dataSourceCopy, tableHeaderLast, tableHeaders, rowKeyGen, maxRowSpan, scrollbarOptions, isExperimentalScrollY);
		/** requestAnimationFrame throttled version of updateVirtualScrollY for smoother wheel scrolling */
		const rafUpdateVirtualScrollYForWheel = rafThrottle(updateVirtualScrollY);
		const [scrollbar, showScrollbar, onVerticalScrollbarMouseDown, onHorizontalScrollbarMouseDown, updateCustomScrollbar] = useScrollbar(props, tableContainerRef, virtualScroll, virtualScrollX, updateVirtualScrollY, scrollbarOptions, isExperimentalScrollY);
		const [hiddenCellMap, mergeCellsWrapper, hoverMergedCells, updateHoverMergedCells, activeMergedCells, updateActiveMergedCells] = useMergeCells(rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart);
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
		const { config: areaSelectionConfig, isSelecting: isAreaSelecting, onMD: onSelectionMouseDown, get: getSelectedArea, set: setAreaSelection, clear: clearSelectedArea, copy: copySelectedArea } = ON_DEMAND_FEATURE[useAreaSelectionName](props, emits, tableContainerRef, dataSourceCopy, tableHeaderLast, colKeyGen, cellKeyGen, scrollTo, virtualScroll, virtualScrollX, getRowIndex, getColumnIndex);
		/** 键盘箭头滚动 */
		useKeyboardArrowScroll(tableContainerRef, props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on, areaSelectionConfig);
		/** 固定列处理 */
		const [fixedCols, fixedColClassMap, updateFixedShadow] = useFixedCol(props, colKeyGen, getFixedColPosition, tableHeaders, tableHeadersForCalc, tableContainerRef);
		if (props.autoResize) useAutoResize(tableContainerRef, () => {
			initVirtualScroll();
			updateFixedShadow();
		}, props, 200);
		const [colResizeOn, isColResizing, onThResizeMouseDown] = useColResize(props, emits, tableContainerRef, tableHeaderLast, colResizeIndicatorRef, colKeyGen, fixedCols, clearColWidthCache);
		const [toggleExpandRow, setRowExpand] = useRowExpand(emits, dataSourceCopy, rowKeyGen, onDataSourceChange);
		const [toggleTreeNode, setTreeExpand, flatTreeData] = useTree(props, dataSourceCopy, rowKeyGen, emits, onDataSourceChange);
		/** style cache */
		const paddingTopStyle = computed(() => `height:${virtualScroll.value.offsetTop}px`);
		const offsetBottomStyle = computed(() => `height:${virtual_offsetBottom.value}px`);
		const SRBRBottomStyle = computed(() => `height:${SRBRBottomHeight.value}px`);
		watch(() => props.columns, () => {
			handleDealColumns();
			updateMaxRowSpan();
			nextTick(() => {
				initVirtualScrollX();
				updateFixedShadow();
				updateCustomScrollbar();
			});
		});
		watch(() => props.virtual, () => {
			nextTick(initVirtualScrollY);
		});
		watch(() => props.rowHeight, initVirtualScrollY);
		watch(() => props.virtualX, () => {
			handleDealColumns();
			nextTick(() => {
				initVirtualScrollX();
				updateFixedShadow();
			});
		});
		watch(() => props.dataSource, (val) => {
			updateDataSource(val);
		});
		watch(() => props.fixedColShadow, () => updateFixedShadow());
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
			if (!props.sortRemote || (option === null || option === void 0 ? void 0 : option.forceSort)) dataSourceTemp = sortData(dataSourceTemp);
			if (isTreeData.value) dataSourceTemp = flatTreeData(dataSourceTemp);
			dataSourceTemp = filterDataSource(dataSourceTemp);
			dataSourceCopy.value = dataSourceTemp;
		}
		function setFilter(status, option) {
			status = status || {};
			filterStatus.value = status;
			if (!(option === null || option === void 0 ? void 0 : option.remote)) initDataSource();
			if (!(option === null || option === void 0 ? void 0 : option.silent)) emits("filter-change", status);
		}
		function filterDataSource(dataSource) {
			const filterKeys = Object.keys(filterStatus.value);
			if (!(filterKeys === null || filterKeys === void 0 ? void 0 : filterKeys.length)) return dataSource;
			let result = dataSource;
			for (const key of filterKeys) {
				const { value, filter } = filterStatus.value[key];
				if (!(value === null || value === void 0 ? void 0 : value.length)) continue;
				result = result.filter((row) => {
					const cellValue = row[key];
					if (filter) return filter({
						row,
						cellValue,
						filterValues: value
					});
					return value.some((v) => cellValue == v);
				});
			}
			return result;
		}
		/**
		* Wrapper for dealColumns to pass props.columns
		*/
		function handleDealColumns() {
			dealColumns(props.columns);
		}
		function updateDataSource(val) {
			if (!Array.isArray(val)) {
				console.warn("invalid dataSource");
				return;
			}
			let needInitVirtualScrollY = false;
			if (dataSourceCopy.value.length !== val.length) needInitVirtualScrollY = true;
			initDataSource(val);
			updateMaxRowSpan();
			if (!val.length) clearSelectedArea();
			if (needInitVirtualScrollY) nextTick(() => initVirtualScrollY());
			nextTick(updateCustomScrollbar);
		}
		/** tr key */
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
			if (key === void 0) key = Math.random().toString(36).slice(2);
			rowKeyGenCache.set(row, key);
			return key;
		}
		/** td key */
		function cellKeyGen(row, col) {
			return rowKeyGen(row) + "--" + colKeyGen.value(col);
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
		/**
		* fixed 模式下 colgroup 中单个 col 的样式。
		* 仅取叶子列的 width（与 cellStyleMap 中 --cw 保持一致）；未设置 width 的列不声明宽度，
		* 由 table-layout:fixed 将剩余空间平分，符合“一列固定、其余列平分”的预期。
		*/
		function getColGroupColStyle(col) {
			const width = transformWidthToStr(col.width);
			return width ? `width:${width}` : null;
		}
		function getAbsoluteRowIndex(rowIndex) {
			return rowIndex + virtualScroll.value.startIndex;
		}
		function shouldHideCell(row, col) {
			var _hiddenCellMap$value$;
			if (!hiddenCellMap.value || !row) return;
			return (_hiddenCellMap$value$ = hiddenCellMap.value[rowKeyGen(row)]) === null || _hiddenCellMap$value$ === void 0 ? void 0 : _hiddenCellMap$value$.has(colKeyGen.value(col));
		}
		/** th title */
		function getHeaderTitle(col) {
			const colKey = colKeyGen.value(col);
			if (props.hideHeaderTitle === true || Array.isArray(props.hideHeaderTitle) && props.hideHeaderTitle.includes(colKey)) return "";
			return col.title || "";
		}
		function getTRProps(row, index) {
			var _props$expandConfig;
			const rowIndex = getAbsoluteRowIndex(index);
			const rowKey = rowKeyGen(row);
			const classList = [
				props.rowClassName(row, rowIndex),
				(row === null || row === void 0 ? void 0 : row.__EXP__) ? "expanded" : "",
				(row === null || row === void 0 ? void 0 : row.__EXP_R__) ? "expanded-row" : ""
			];
			if (currentRowKey.value === rowKey || row === currentRow.value) classList.push("active");
			if (props.showTrHoverClass && (rowKey === currentHoverRowKey.value || row === currentHoverRow)) classList.push("hover");
			const result = {
				id: stkTableId + "-" + rowKey,
				"data-row-key": rowKey,
				"data-row-i": rowIndex,
				class: classList.filter(Boolean).join(" "),
				style: null
			};
			if ((row === null || row === void 0 ? void 0 : row.__EXP_R__) && props.virtual && ((_props$expandConfig = props.expandConfig) === null || _props$expandConfig === void 0 ? void 0 : _props$expandConfig.height)) {
				var _props$expandConfig2;
				result.style = `--row-height: ${(_props$expandConfig2 = props.expandConfig) === null || _props$expandConfig2 === void 0 ? void 0 : _props$expandConfig2.height}px`;
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
					isSorted && "sorter-" + (sortState === null || sortState === void 0 ? void 0 : sortState.order),
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
			if (!row) return { style: cellStyleMap.value[TagType.TD].get(colKey) };
			const cellKey = cellKeyGen(row, col);
			const classList = [col.className, fixedColClassMap.value.get(colKey)];
			if (col.align === "center") classList.push("text-c");
			else if (col.align === "right") classList.push("text-r");
			if (col.mergeCells) {
				if (hoverMergedCells.value.has(cellKey)) classList.push("cell-hover");
				if (activeMergedCells.value.has(cellKey)) classList.push("cell-active");
			}
			if (props.cellActive && currentSelectedCellKey.value === cellKey) classList.push("active");
			if (col.type === "seq") classList.push("seq-column");
			else if (col.type === "expand" && (row.__EXP__ ? colKeyGen.value(row.__EXP__) === colKey : false)) classList.push("expanded");
			else if (row.__T_EXP__ && col.type === "tree-node") classList.push("tree-expanded");
			else if (col.type === "dragRow") classList.push("drag-row-cell");
			return {
				"data-col-key": colKey,
				style: cellStyleMap.value[TagType.TD].get(colKey),
				class: classList,
				...mergeCellsWrapper(row, col, rowIndex, col.__LF_S__ ?? 0)
			};
		}
		function onRowClick(e) {
			var _rowActiveProp$value$, _rowActiveProp$value;
			const rowIndex = getClosestTrIndex(e.target);
			const row = dataSourceCopy.value[rowIndex];
			if (!row) return;
			emits("row-click", e, row, { rowIndex });
			if ((_rowActiveProp$value$ = (_rowActiveProp$value = rowActiveProp.value).disabled) === null || _rowActiveProp$value$ === void 0 ? void 0 : _rowActiveProp$value$.call(_rowActiveProp$value, row)) return;
			const isCurrentRow = props.rowKey ? currentRowKey.value === rowKeyGen(row) : currentRow.value === row;
			if (isCurrentRow) {
				if (!rowActiveProp.value.revokable) return;
				setCurrentRow(void 0, { silent: true });
			} else setCurrentRow(row, { silent: true });
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
			if (col.type === "expand") toggleExpandRow(row, col);
			else if (col.type === "tree-node") toggleTreeNode(row, col);
		}
		function onCellClick(e) {
			var _e$target;
			const rowIndex = getClosestTrIndex(e.target);
			const row = dataSourceCopy.value[rowIndex];
			if (!row) return;
			const colKey = getClosestColKey(e.target);
			const col = tableHeaderLast.value.find((item) => colKeyGen.value(item) === colKey);
			if (!col) return;
			if ((_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.closest(".stk-fold-icon")) {
				triangleClick(e, row, col);
				return;
			}
			if (props.cellActive) {
				const cellKey = cellKeyGen(row, col);
				const result = {
					row,
					col,
					select: false,
					rowIndex
				};
				if (props.selectedCellRevokable && currentSelectedCellKey.value === cellKey) currentSelectedCellKey.value = void 0;
				else {
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
			return {
				row,
				col: tableHeaderLast.value.find((item) => colKeyGen.value(item) === colKey),
				rowIndex
			};
		}
		/** th click */
		function onHeaderCellClick(e, col) {
			onColumnSort(col);
			emits("header-cell-click", e, col);
		}
		/**
		* Delegated mouseover on tbody: emits cell-mouseover, and simulates cell-mouseenter
		* by checking if relatedTarget is outside the current td.
		*/
		function onCellMouseOver(e) {
			const td = getClosestTd(e.target);
			if (!td) return;
			const { row, col } = getCellEventData(e);
			emits("cell-mouseover", e, row, col);
			const related = e.relatedTarget;
			if (!related || !td.contains(related)) emits("cell-mouseenter", e, row, col);
		}
		/**
		* Delegated mouseout on tbody: handles both cell-mouseleave and tr-mouseleave.
		* - cell-mouseleave: relatedTarget is outside the current td.
		* - tr-mouseleave: relatedTarget is outside the current tr (simulates the old onTrMouseLeave).
		*/
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
				if (props.showTrHoverClass) currentHoverRowKey.value = null;
				if (props.rowHover) updateHoverMergedCells(void 0);
			}
		}
		/** Delegated drop on tbody: extracts rowIndex from the closest tr and calls onTrDrop. */
		function onBodyDrop(e) {
			const trIndex = getClosestTrIndex(e.target);
			if (trIndex < 0) return;
			onTrDrop(e, getAbsoluteRowIndex(trIndex));
		}
		function onCellMouseDown(e) {
			const { row, col, rowIndex } = getCellEventData(e);
			emits("cell-mousedown", e, row, col, { rowIndex });
			if (areaSelectionConfig.value.enabled) onSelectionMouseDown(e);
		}
		const [isWheeling, setIsWheeling] = useWheeling();
		/**
		* proxy scroll, prevent white screen
		* @param e
		*/
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
				if (deltaY > 0 && canScrollDown || deltaY < 0 && scrollTop > 1) {
					setIsWheeling(true);
					e.preventDefault();
				} else if (isWheeling()) e.preventDefault();
				if (isExperimentalScrollY.value) {
					rafUpdateVirtualScrollYForWheel(scrollTop + deltaY);
					updateCustomScrollbar();
				} else dom.scrollTop += deltaY;
			}
			if (virtualX_on.value) {
				const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
				let distance = deltaX;
				if (shiftKey && deltaY) distance = deltaY;
				const canScrollRight = scrollLeft < scrollWidth - containerWidth - 1;
				if (distance > 0 && canScrollRight || distance < 0 && scrollLeft > 1) {
					setIsWheeling(true);
					e.preventDefault();
				} else if (isWheeling()) e.preventDefault();
				dom.scrollLeft += distance;
			}
		}
		/** Prevent re-entrant requestAnimationFrame in onTableScroll */
		let scrollRAFScheduled = false;
		/**
		* @param e scrollEvent
		*/
		function onTableScroll(e) {
			if (!(e === null || e === void 0 ? void 0 : e.target) || scrollRAFScheduled) return;
			scrollRAFScheduled = true;
			requestAnimationFrame(() => {
				scrollRAFScheduled = false;
				const { scrollTop, scrollLeft } = e.target;
				const { scrollTop: vScrollTop } = virtualScroll.value;
				const { scrollLeft: vScrollLeft } = virtualScrollX.value;
				const isYScroll = isExperimentalScrollY.value ? false : scrollTop !== vScrollTop;
				const isXScroll = scrollLeft !== vScrollLeft;
				if (isYScroll) updateVirtualScrollY(scrollTop);
				if (isXScroll) {
					if (virtualX_on.value) updateVirtualScrollX(scrollLeft);
					else virtualScrollX.value.scrollLeft = scrollLeft;
					updateFixedShadow(virtualScrollX);
				}
				if (isYScroll) {
					const { startIndex, endIndex } = virtualScroll.value;
					emits("scroll", e, {
						startIndex,
						endIndex
					});
				}
				if (isXScroll) emits("scroll-x", e);
				updateCustomScrollbar();
			});
		}
		/** tr hover */
		function onTrMouseOver(e) {
			const tr = getClosestTr(e.target);
			if (!tr) return;
			const rowIndex = Number(tr.dataset.rowI);
			const row = dataSourceCopy.value[rowIndex];
			if (currentHoverRow === row) return;
			currentHoverRow = row;
			const rowKey = tr.dataset.rowKey;
			if (props.showTrHoverClass) currentHoverRowKey.value = rowKey || null;
			if (props.rowHover) updateHoverMergedCells(rowKey);
		}
		/**
		* 选中一行
		*
		* en: Select a row
		* @param {string} rowKeyOrRow selected rowKey, undefined to unselect
		* @param {boolean} option.silent if set true not emit `current-change`. default:false
		* @param {boolean} option.deep if set true, deep search in children. default:false
		*/
		function setCurrentRow(rowKeyOrRow, option = {
			silent: false,
			deep: false
		}) {
			const select = rowKeyOrRow !== void 0;
			const currentRowTemp = currentRow.value;
			if (!select) {
				currentRow.value = void 0;
				currentRowKey.value = void 0;
				updateActiveMergedCells(true);
			} else if (typeof rowKeyOrRow === "string") {
				const findRowByKey = (data, key) => {
					for (let i = 0; i < data.length; i++) {
						var _item$children;
						const item = data[i];
						if (rowKeyGen(item) === key) return item;
						if (option.deep && ((_item$children = item.children) === null || _item$children === void 0 ? void 0 : _item$children.length)) {
							const found = findRowByKey(item.children, key);
							if (found) return found;
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
			if (!option.silent) emits(
				"current-change",
				/** no Event */
				null,
				select ? currentRow.value : currentRowTemp,
				{ select }
			);
		}
		/**
		* set highlight active cell (props.cellActive=true)
		* @param row row if undefined, clear highlight
		* @param col column
		* @param option.silent if emit current-change. default:false(not emit `current-change`)
		*/
		function setSelectedCell(row, col, option = { silent: false }) {
			if (!dataSourceCopy.value.length) return;
			const select = row !== void 0 && col !== void 0;
			currentSelectedCellKey.value = select ? cellKeyGen(row, col) : void 0;
			if (!option.silent) emits(
				"cell-selected",
				/** no Event */
				null,
				{
					row,
					col,
					select
				}
			);
		}
		/**
		* set scroll bar position
		* @param top null to not change
		* @param left null to not change
		*/
		function scrollTo(top = 0, left = 0) {
			if (!tableContainerRef.value) return;
			if (top !== null) if (isExperimentalScrollY.value) {
				updateVirtualScrollY(top);
				updateCustomScrollbar();
			} else tableContainerRef.value.scrollTop = top;
			if (left !== null) tableContainerRef.value.scrollLeft = left;
		}
		/** get current table data */
		function getTableData() {
			return toRaw(dataSourceCopy.value);
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
				createElementVNode("div", _hoisted_2, [createElementVNode("table", {
					class: normalizeClass(["stk-table-main", { "fixed-mode": props.fixedMode }]),
					style: normalizeStyle({
						width: __props.width,
						minWidth: __props.minWidth,
						maxWidth: __props.maxWidth
					}),
					onDragover: _cache[4] || (_cache[4] = (...args) => unref(onTrDragOver) && unref(onTrDragOver)(...args)),
					onDragenter: _cache[5] || (_cache[5] = (...args) => unref(onTrDragEnter) && unref(onTrDragEnter)(...args)),
					onDragend: _cache[6] || (_cache[6] = (...args) => unref(onTrDragEnd) && unref(onTrDragEnd)(...args)),
					onClick: onRowClick,
					onDblclick: onRowDblclick,
					onContextmenu: onRowMenu,
					onMouseover: onTrMouseOver
				}, [
					props.fixedMode && !unref(virtualX_on) ? (openBlock(), createElementBlock("colgroup", _hoisted_3, [(openBlock(true), createElementBlock(Fragment, null, renderList(tableHeaderLast.value, (col) => {
						return openBlock(), createElementBlock("col", {
							key: colKeyGen.value(col),
							style: normalizeStyle(getColGroupColStyle(col))
						}, null, 4);
					}), 128))])) : createCommentVNode("", true),
					!__props.headless ? (openBlock(), createElementBlock("thead", _hoisted_4, [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_on) ? unref(virtualX_tableHeaders) : unref(tableHeaders), (row, rowIndex) => {
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
								return openBlock(), createElementBlock("th", mergeProps({ key: colKeyGen.value(col) }, { ref_for: true }, getTHProps(col), {
									onClick: (e) => onHeaderCellClick(e, col),
									onDragstart: _cache[0] || (_cache[0] = (...args) => unref(onThDragStart) && unref(onThDragStart)(...args)),
									onDrop: _cache[1] || (_cache[1] = (...args) => unref(onThDrop) && unref(onThDrop)(...args)),
									onDragover: _cache[2] || (_cache[2] = (...args) => unref(onThDragOver) && unref(onThDragOver)(...args))
								}), [
									unref(colResizeOn)(col) && colIndex > 0 ? (openBlock(), createElementBlock("div", {
										key: 0,
										class: "table-header-resizer left",
										onMousedown: ($event) => unref(onThResizeMouseDown)($event, col, true)
									}, null, 40, _hoisted_6)) : createCommentVNode("", true),
									createElementVNode("div", {
										class: "table-header-cell-wrapper",
										style: normalizeStyle(col.__R_SP__ ? `--row-span:${col.__R_SP__}` : null)
									}, [col.customHeaderCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customHeaderCell), {
										key: 0,
										col,
										colIndex,
										rowIndex
									}, null, 8, [
										"col",
										"colIndex",
										"rowIndex"
									])) : renderSlot(_ctx.$slots, "tableHeader", {
										key: 1,
										col
									}, () => [createElementVNode("span", _hoisted_7, toDisplayString(col.title), 1)]), col.sorter ? (openBlock(), createBlock(SortIcon_default, {
										key: 2,
										class: "table-header-sorter"
									})) : createCommentVNode("", true)], 4),
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
					}), 128))])) : createCommentVNode("", true),
					__props.footerData && __props.footerData.length > 0 ? (openBlock(), createBlock(resolveDynamicComponent(footerTagName.value), {
						key: 2,
						class: "stk-footer",
						style: normalizeStyle(isFooterTop.value ? `top:${unref(tableHeaderHeight)}px` : "")
					}, {
						default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.footerData, (footRow, footRowIndex) => {
							return openBlock(), createElementBlock("tr", { key: footRowIndex }, [
								unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
									key: 0,
									class: "vt-x-left",
									style: normalizeStyle(`min-width:${unref(theadVirtualX).offsetLeft}px;width:${unref(theadVirtualX).offsetLeft}px`)
								}, null, 4)) : createCommentVNode("", true),
								(openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col, _colIdx) => {
									return openBlock(), createElementBlock(Fragment, { key: col.__VT_C_SP__ ? `spacer-${_colIdx}` : colKeyGen.value(col) }, [col.__VT_C_SP__ ? (openBlock(), createElementBlock("td", {
										key: 0,
										class: "vt-x-spacer",
										colspan: col.__VT_C_SP__
									}, null, 8, _hoisted_9)) : (openBlock(), createElementBlock("td", mergeProps({
										key: 1,
										ref_for: true
									}, getTFProps(col)), [col.customFooterCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customFooterCell), {
										key: 0,
										class: "table-cell-wrapper",
										tabindex: "-1",
										col,
										row: footRow,
										rowIndex: footRowIndex,
										cellValue: footRow[col.dataIndex]
									}, null, 8, [
										"col",
										"row",
										"rowIndex",
										"cellValue"
									])) : createCommentVNode("", true), createElementVNode("div", {
										class: "table-cell-wrapper",
										tabindex: "-1",
										title: footRow[col.dataIndex] || ""
									}, [footRow[col.dataIndex] != null ? (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(footRow[col.dataIndex]), 1)) : createCommentVNode("", true)], 8, _hoisted_10)], 16))], 64);
								}), 128)),
								unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
									key: 1,
									class: "vt-x-right",
									style: normalizeStyle(`min-width:${unref(virtualX_offsetRight)}px;width:${unref(virtualX_offsetRight)}px`)
								}, null, 4)) : createCommentVNode("", true)
							]);
						}), 128))]),
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
						}, [__props.fixedMode && __props.headless ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
							unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
								key: 0,
								class: "vt-x-left",
								style: normalizeStyle(`min-width:${unref(theadVirtualX).offsetLeft}px;width:${unref(theadVirtualX).offsetLeft}px`)
							}, null, 4)) : createCommentVNode("", true),
							(openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col, _colIdx) => {
								return openBlock(), createElementBlock(Fragment, { key: col.__VT_C_SP__ ? `spacer-${_colIdx}` : colKeyGen.value(col) }, [col.__VT_C_SP__ ? (openBlock(), createElementBlock("td", {
									key: 0,
									class: "vt-x-spacer",
									colspan: col.__VT_C_SP__
								}, null, 8, _hoisted_12)) : (openBlock(), createElementBlock("td", {
									key: 1,
									style: normalizeStyle(cellStyleMap.value[unref(TagType).TD].get(colKeyGen.value(col)))
								}, null, 4))], 64);
							}), 128)),
							unref(virtualX_on) ? (openBlock(), createElementBlock("td", {
								key: 1,
								class: "vt-x-right",
								style: normalizeStyle(`min-width:${unref(virtualX_offsetRight)}px;width:${unref(virtualX_offsetRight)}px`)
							}, null, 4)) : createCommentVNode("", true)
						], 64)) : createCommentVNode("", true)], 4)) : createCommentVNode("", true),
						(openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtual_dataSourcePart), (row, rowIndex) => {
							return openBlock(), createElementBlock("tr", mergeProps({
								ref_for: true,
								ref_key: "trRef",
								ref: trRef,
								key: rowKeyGen(row)
							}, { ref_for: true }, getTRProps(row, rowIndex)), [row && row.__EXP_R__ ? (openBlock(), createElementBlock("td", {
								key: 0,
								colspan: unref(expandRowColspan)
							}, [createElementVNode("div", _hoisted_14, [renderSlot(_ctx.$slots, "expand", {
								row: row.__EXP_R__,
								col: row.__EXP_C__
							}, () => [createTextVNode(toDisplayString(row.__EXP_R__ && row.__EXP_C__ && row.__EXP_R__[row.__EXP_C__.dataIndex] || ""), 1)])])], 8, _hoisted_13)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
								unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_15)) : createCommentVNode("", true),
								(openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualX_columnPart), (col, _colIdx) => {
									return openBlock(), createElementBlock(Fragment, { key: col.__VT_C_SP__ ? `spacer-${_colIdx}` : colKeyGen.value(col) }, [col.__VT_C_SP__ ? (openBlock(), createElementBlock("td", {
										key: 0,
										class: "vt-x-spacer",
										colspan: col.__VT_C_SP__
									}, null, 8, _hoisted_16)) : !shouldHideCell(row, col) ? (openBlock(), createElementBlock("td", mergeProps({
										key: 1,
										ref_for: true
									}, getTDProps(row, col, rowIndex, col.__LF_S__ ?? 0)), [col.customCell ? (openBlock(), createBlock(resolveDynamicComponent(col.customCell), {
										key: 0,
										class: "table-cell-wrapper",
										tabindex: "-1",
										col,
										row,
										rowIndex: getAbsoluteRowIndex(rowIndex),
										colIndex: col.__LF_S__ ?? 0,
										cellValue: row && row[col.dataIndex],
										expanded: row && row.__EXP__,
										"tree-expanded": row && row.__T_EXP__
									}, {
										stkFoldIcon: withCtx(() => [createVNode(TriangleIcon_default, { onClick: ($event) => triangleClick($event, row, col) }, null, 8, ["onClick"])]),
										stkDragIcon: withCtx(() => [createVNode(DragHandle_default, { onDragstart: ($event) => unref(onTrDragStart)($event, getAbsoluteRowIndex(rowIndex)) }, null, 8, ["onDragstart"])]),
										_: 2
									}, 1032, [
										"col",
										"row",
										"rowIndex",
										"colIndex",
										"cellValue",
										"expanded",
										"tree-expanded"
									])) : !col.type ? (openBlock(), createElementBlock("div", {
										key: 1,
										class: "table-cell-wrapper",
										tabindex: "-1",
										title: row[col.dataIndex] || ""
									}, toDisplayString((row && row[col.dataIndex]) != null ? row && row[col.dataIndex] : getEmptyCellText.value(col, row)), 9, _hoisted_17)) : col.type === "seq" ? (openBlock(), createElementBlock("div", _hoisted_18, toDisplayString((props.seqConfig.startIndex || 0) + getAbsoluteRowIndex(rowIndex) + 1), 1)) : col.type === "tree-node" ? (openBlock(), createBlock(TreeNodeCell_default, {
										key: 3,
										class: "table-cell-wrapper",
										tabindex: "-1",
										col,
										row
									}, null, 8, ["col", "row"])) : (openBlock(), createElementBlock("div", {
										key: 4,
										class: "table-cell-wrapper",
										tabindex: "-1",
										title: row[col.dataIndex] || ""
									}, [col.type === "dragRow" ? (openBlock(), createBlock(DragHandle_default, {
										key: 0,
										onDragstart: ($event) => unref(onTrDragStart)($event, getAbsoluteRowIndex(rowIndex))
									}, null, 8, ["onDragstart"])) : col.type === "expand" ? (openBlock(), createBlock(TriangleIcon_default, { key: 1 })) : createCommentVNode("", true), row[col.dataIndex] != null ? (openBlock(), createElementBlock("span", _hoisted_20, toDisplayString(row[col.dataIndex]), 1)) : createCommentVNode("", true)], 8, _hoisted_19))], 16)) : createCommentVNode("", true)], 64);
								}), 128)),
								unref(virtualX_on) ? (openBlock(), createElementBlock("td", _hoisted_21)) : createCommentVNode("", true)
							], 64))], 16);
						}), 128)),
						!isExperimentalScrollY.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [unref(virtual_on) && !unref(isSRBRActive) ? (openBlock(), createElementBlock("tr", {
							key: 0,
							style: normalizeStyle(offsetBottomStyle.value)
						}, null, 4)) : createCommentVNode("", true), SRBRBottomHeight.value ? (openBlock(), createElementBlock("tr", {
							key: 1,
							style: normalizeStyle(SRBRBottomStyle.value)
						}, null, 4)) : createCommentVNode("", true)], 64)) : createCommentVNode("", true)
					], 36)
				], 38), scrollbarOptions.value.enabled && unref(showScrollbar).y ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "stk-sb-thumb vertical",
					style: normalizeStyle(`height:${unref(scrollbar).h}px;transform:translateY(${unref(scrollbar).t}px)`),
					onMousedown: _cache[7] || (_cache[7] = (...args) => unref(onVerticalScrollbarMouseDown) && unref(onVerticalScrollbarMouseDown)(...args)),
					onTouchstartPassive: _cache[8] || (_cache[8] = (...args) => unref(onVerticalScrollbarMouseDown) && unref(onVerticalScrollbarMouseDown)(...args))
				}, null, 36)) : createCommentVNode("", true)]),
				(!dataSourceCopy.value || !dataSourceCopy.value.length) && __props.showNoData ? (openBlock(), createElementBlock("div", {
					key: 2,
					class: normalizeClass(["stk-table-no-data", { "no-data-full": __props.noDataFull }])
				}, [renderSlot(_ctx.$slots, "empty", {}, () => [_cache[11] || (_cache[11] = createTextVNode("暂无数据", -1))])], 2)) : createCommentVNode("", true),
				renderSlot(_ctx.$slots, "customBottom"),
				scrollbarOptions.value.enabled && unref(showScrollbar).x ? (openBlock(), createElementBlock("div", {
					key: 3,
					class: "stk-sb-thumb horizontal",
					style: normalizeStyle(`width:${unref(scrollbar).w}px;transform:translateX(${unref(scrollbar).l}px)`),
					onMousedown: _cache[9] || (_cache[9] = (...args) => unref(onHorizontalScrollbarMouseDown) && unref(onHorizontalScrollbarMouseDown)(...args)),
					onTouchstartPassive: _cache[10] || (_cache[10] = (...args) => unref(onHorizontalScrollbarMouseDown) && unref(onHorizontalScrollbarMouseDown)(...args))
				}, null, 36)) : createCommentVNode("", true)
			], 46, _hoisted_1);
		};
	}
});
//#endregion
export { insertToOrderedArray as a, binarySearch as i, registerFeature as n, strCompare as o, useAreaSelection as r, tableSort as s, StkTable_default as t };
