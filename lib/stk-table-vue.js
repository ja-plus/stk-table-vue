/**
 * name: stk-table-vue
 * version: v1.0.0
 * description: High performance realtime virtual table for vue3 and vue2.7
 * author: japlus
 * homepage: https://ja-plus.github.io/stk-table-vue/
 * license: MIT
 */
import { a as insertToOrderedArray, i as binarySearch, n as registerFeature, o as strCompare, r as useAreaSelection, s as tableSort, t as StkTable_default } from "./StkTable-BK4VNsvG.js";
import { Fragment, computed, createApp, createBlock, createElementBlock, createElementVNode, createTextVNode, defineComponent, getCurrentInstance, h, markRaw, nextTick, normalizeClass, openBlock, ref, renderSlot, resolveDynamicComponent, toDisplayString, watch, withModifiers } from "vue";
//#region src/StkTable/custom-cells/FilterCell/Dropdown/index.ts
var DropdownIns = null;
async function getDropdownIns() {
	if (!DropdownIns) {
		const div = document.createElement("div");
		div.classList.add("stk-filter-dropdown-wrapper");
		document.body.appendChild(div);
		DropdownIns = createApp(await import("./Dropdown-wEI6qpCx.js").then((module) => module.default)).mount(div);
	}
	return DropdownIns;
}
//#endregion
//#region src/StkTable/custom-cells/FilterCell/Filter.vue
var Filter_default = /* @__PURE__ */ defineComponent({
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
			const rect = e.target.getBoundingClientRect();
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
			getDropdownIns().then((ins) => {
				if (ins.visible) {
					ins.hide();
					return;
				}
				ins.setTheme(theme.value);
				ins.show({
					x: rect.left + scrollLeft,
					y: rect.bottom + scrollTop,
					height: rect.height
				}, props.getOptions(), handleConfirm);
			});
		}
		function handleConfirm(value) {
			emit("change", value);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["stk-filter", [{ "stk-filter--active": props.active }, `stk-filter--${theme.value}`]]) }, [renderSlot(_ctx.$slots, "default", {}, () => [createElementVNode("span", null, toDisplayString(props.col.title), 1)]), (openBlock(), createElementBlock("svg", {
				class: "stk-filter-icon",
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 1024 1024",
				onClick: handleIconClick
			}, [..._cache[0] || (_cache[0] = [createElementVNode("path", {
				fill: "currentColor",
				d: "M950.58 0 l-894.06 0 q-91.93 17.17 -34.34 119.21 l293.97 251.54 l6.06 9.1 q16.17 20.2 16.17 47.48 l0 468.74 l1.01 8.08 q3.03 10.11 9.09 19.2 q2.02 2.02 5.05 7.07 q36.37 33.34 84.86 4.04 l216.19 -124.26 q21.21 -22.22 18.18 -50.51 l0 -332.36 l1.01 -11.12 q4.04 -26.26 22.23 -45.46 l292.96 -251.54 l9.1 -10.11 q43.44 -54.55 14.14 -81.82 q-28.29 -27.28 -61.62 -27.28 ZM832.38 119.21 l-277.81 235.38 l0 377.82 l-96.98 55.57 l0 -433.39 l-275.8 -235.38 l650.59 0 Z"
			}, null, -1)])]))], 2);
		};
	}
});
//#endregion
//#region src/StkTable/custom-cells/FilterCell/createFilterCell.ts
/**
* 从数据源提取筛选选项
*
* @param dataSource 数据源
* @param columnKey 列名
* @returns 筛选选项数组
*/
function extractFilterOptions(dataSource, columnKey) {
	const uniqueValues = /* @__PURE__ */ new Set();
	dataSource.forEach((row) => {
		const val = row[columnKey];
		if (val !== void 0 && val !== null) uniqueValues.add(val);
	});
	return Array.from(uniqueValues).map((value) => ({
		label: String(value),
		value
	}));
}
/**
* 表格筛选功能工厂函数 (BETA)
*
* Q: 为什么要通过 stkTableInstance 来设置筛选状态，而不是直接在 createFilterCell 中传入dataSource。
* A: 因为 createFilterCell 不一定有 dataSource的上下文，它可能在独立的js/ts 中使用，而非Vue SFC。而通过 stkTableInstance 可以获取到 dataSource
* @beta
* @returns
*/
function createFilterCell(option) {
	const filterStatus = ref({});
	function FilterComponent(config, component) {
		return markRaw(defineComponent({
			props: ["col", "colIndex"],
			setup(props) {
				const colKey = props.col.dataIndex;
				const currentInstance = getCurrentInstance();
				/**
				* 查找最近的StkTable组件实例
				* @returns
				*/
				function findStkTableInstance(curIns) {
					let current = curIns;
					while (current = current.parent) {
						var _current$type;
						if (((_current$type = current.type) === null || _current$type === void 0 ? void 0 : _current$type.name) === "StkTable") return current;
					}
					return null;
				}
				const stkTableInstance = findStkTableInstance(currentInstance);
				const theme = computed(() => {
					var _stkTableInstance$pro;
					return (stkTableInstance === null || stkTableInstance === void 0 || (_stkTableInstance$pro = stkTableInstance.props) === null || _stkTableInstance$pro === void 0 ? void 0 : _stkTableInstance$pro.theme) || "light";
				});
				const filterNumber = computed(() => {
					var _filterStatus$value$c;
					return ((_filterStatus$value$c = filterStatus.value[colKey]) === null || _filterStatus$value$c === void 0 ? void 0 : _filterStatus$value$c.value.length) || 0;
				});
				let cachedAutoOptions = null;
				watch(() => {
					var _stkTableInstance$pro2;
					return stkTableInstance === null || stkTableInstance === void 0 || (_stkTableInstance$pro2 = stkTableInstance.props) === null || _stkTableInstance$pro2 === void 0 ? void 0 : _stkTableInstance$pro2.dataSource;
				}, () => {
					cachedAutoOptions = null;
				});
				function getAutoOptions() {
					var _stkTableInstance$pro3;
					if (!(config === null || config === void 0 ? void 0 : config.autoOptions)) return [];
					if (cachedAutoOptions) return cachedAutoOptions;
					cachedAutoOptions = extractFilterOptions((stkTableInstance === null || stkTableInstance === void 0 || (_stkTableInstance$pro3 = stkTableInstance.props) === null || _stkTableInstance$pro3 === void 0 ? void 0 : _stkTableInstance$pro3.dataSource) || [], colKey);
					return cachedAutoOptions;
				}
				function getResolvedOptions() {
					return (config === null || config === void 0 ? void 0 : config.options) ?? getAutoOptions();
				}
				function handleChange(value) {
					var _filterStatus$value$c2, _option$onChange, _stkTableInstance$exp;
					filterStatus.value[colKey] = {
						value,
						filter: (config === null || config === void 0 ? void 0 : config.filter) ?? ((_filterStatus$value$c2 = filterStatus.value[colKey]) === null || _filterStatus$value$c2 === void 0 ? void 0 : _filterStatus$value$c2.filter)
					};
					option === null || option === void 0 || (_option$onChange = option.onChange) === null || _option$onChange === void 0 || _option$onChange.call(option, {
						colKey,
						status: filterStatus.value[colKey]
					});
					stkTableInstance === null || stkTableInstance === void 0 || (_stkTableInstance$exp = stkTableInstance.exposed) === null || _stkTableInstance$exp === void 0 || _stkTableInstance$exp.setFilter(filterStatus.value, option);
				}
				return () => h(Filter_default, {
					...props,
					theme: theme.value,
					active: filterNumber.value > 0,
					getOptions: getResolvedOptions,
					onChange: handleChange
				}, component ? { default: () => [h(component, props)] } : void 0);
			}
		}));
	}
	return {
		Filter: FilterComponent,
		filterStatus
	};
}
//#endregion
//#region src/StkTable/custom-cells/EditableCell/EditableCell.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = ["value"];
//#endregion
//#region src/StkTable/custom-cells/EditableCell/EditableCell.vue
var EditableCell_default = /* @__PURE__ */ defineComponent({
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
		watch(() => props.cellValue, (v) => {
			if (!isEditing.value) editValue.value = v;
		});
		function onTrigger(e) {
			if (e.type !== props.trigger) return;
			startEditing();
		}
		function startEditing() {
			editValue.value = props.cellValue;
			isEditing.value = true;
			nextTick(() => {
				var _inputRef$value;
				(_inputRef$value = inputRef.value) === null || _inputRef$value === void 0 || _inputRef$value.focus();
			});
		}
		function finishEditing() {
			var _props$onChange;
			isEditing.value = false;
			const newValue = editValue.value;
			setCellValue(newValue);
			(_props$onChange = props.onChange) === null || _props$onChange === void 0 || _props$onChange.call(props, newValue);
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
			} else if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") e.stopPropagation();
			else if (e.key === "Tab") finishEditing();
			else e.stopPropagation();
		}
		function setCellValue(v) {
			const { row, col } = props;
			row[col.dataIndex] = v;
		}
		function refocusContainer() {
			var _rootRef$value, _rootRef$value$closes;
			const el = (_rootRef$value = rootRef.value) === null || _rootRef$value === void 0 || (_rootRef$value$closes = _rootRef$value.closest) === null || _rootRef$value$closes === void 0 ? void 0 : _rootRef$value$closes.call(_rootRef$value, ".stk-table");
			el === null || el === void 0 || el.focus();
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "rootRef",
				ref: rootRef,
				class: "stk-editable-cell",
				onDblclick: onTrigger,
				onClick: onTrigger
			}, [!editing.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createTextVNode(toDisplayString(displayValue.value), 1)], 64)) : (openBlock(), createElementBlock("input", {
				key: 1,
				ref_key: "inputRef",
				ref: inputRef,
				class: "stk-editable-cell-input",
				value: editValue.value,
				onBlur,
				onInput,
				onKeydown
			}, null, 40, _hoisted_1$1))], 544);
		};
	}
});
//#endregion
//#region src/StkTable/custom-cells/EditableCell/createEditableCell.ts
/**
* 可编辑单元格工厂函数
* @param option 配置选项
* @returns EditableCell 组件
*/
function createEditableCell(option) {
	function EditableCellComponent() {
		return markRaw(defineComponent({
			props: [
				"row",
				"col",
				"cellValue",
				"rowIndex",
				"colIndex",
				"expanded",
				"treeExpanded"
			],
			setup(props) {
				return () => h(EditableCell_default, {
					...props,
					trigger: (option === null || option === void 0 ? void 0 : option.trigger) || "dblclick",
					onChange: (newValue) => {
						var _option$onChange;
						option === null || option === void 0 || (_option$onChange = option.onChange) === null || _option$onChange === void 0 || _option$onChange.call(option, newValue, props.row, props.col.dataIndex);
					}
				});
			}
		}));
	}
	return { EditableCell: EditableCellComponent };
}
//#endregion
//#region src/StkTable/custom-cells/CheckboxCell/CheckboxCell.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "stk-checkbox-cell" };
var _hoisted_2 = ["checked", ".indeterminate"];
//#endregion
//#region src/StkTable/custom-cells/CheckboxCell/CheckboxCell.vue
var CheckboxCell_default = /* @__PURE__ */ defineComponent({
	__name: "CheckboxCell",
	props: {
		checked: { type: Boolean },
		indeterminate: { type: Boolean },
		customComponent: {}
	},
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		/** 防重保护：部分 UI 库（Element Plus / Arco Design）会同时触发多个事件 */
		let _lastValue;
		function handleChange(e) {
			var _e$target;
			let checked;
			if (typeof e === "boolean") checked = e;
			else if ((e === null || e === void 0 || (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.checked) !== void 0) checked = e.target.checked;
			else checked = !!e;
			if (checked === _lastValue) return;
			_lastValue = checked;
			emit("change", checked);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [__props.customComponent ? (openBlock(), createBlock(resolveDynamicComponent(__props.customComponent), {
				key: 0,
				"model-value": __props.checked,
				checked: __props.checked,
				indeterminate: __props.indeterminate,
				"onUpdate:modelValue": handleChange,
				"onUpdate:checked": handleChange,
				onChange: handleChange,
				onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
			}, null, 40, [
				"model-value",
				"checked",
				"indeterminate"
			])) : (openBlock(), createElementBlock("input", {
				key: 1,
				type: "checkbox",
				checked: __props.checked,
				".indeterminate": __props.indeterminate,
				class: "stk-checkbox-native",
				onChange: handleChange,
				onClick: _cache[1] || (_cache[1] = withModifiers(() => {}, ["stop"]))
			}, null, 40, _hoisted_2))]);
		};
	}
});
//#endregion
//#region src/StkTable/custom-cells/CheckboxCell/createCheckboxCell.ts
/**
* 查找最近的 StkTable 组件实例
*/
function findStkTableInstance(curIns) {
	let current = curIns;
	while (current = current.parent) {
		var _current$type;
		if (((_current$type = current.type) === null || _current$type === void 0 ? void 0 : _current$type.name) === "StkTable") return current;
	}
	return null;
}
/**
* Checkbox 工厂函数
*
* 用于快速创建多选框单元格和表头单元格组件。
*
* @param options 配置选项
* @returns 包含 CheckboxCell 和 CheckboxAllCell 组件的对象
*
* @example
* ```ts
* const { CheckboxCell, CheckboxAllCell } = createCheckboxCell({
*   field: '_isChecked',
*   onChange: (checked, row) => { row._isChecked = checked },
* });
*
* const columns = [
*   {
*     dataIndex: 'checkbox',
*     width: 50,
*     customCell: CheckboxCell,
*     customHeaderCell: CheckboxAllCell,
*   },
*   // ...other columns
* ];
* ```
*/
function createCheckboxCell(options) {
	const field = (options === null || options === void 0 ? void 0 : options.field) ?? "_isChecked";
	const customComponent = options === null || options === void 0 ? void 0 : options.checkboxComponent;
	/** 单元格 Checkbox 组件 - 用于 customCell */
	function CheckboxCellComponent() {
		return markRaw(defineComponent({
			props: [
				"row",
				"col",
				"cellValue",
				"rowIndex",
				"colIndex",
				"expanded",
				"treeExpanded"
			],
			setup(props) {
				const isChecked = computed(() => !!props.row[field]);
				function handleChange(checked) {
					var _options$onChange;
					props.row[field] = checked;
					options === null || options === void 0 || (_options$onChange = options.onChange) === null || _options$onChange === void 0 || _options$onChange.call(options, checked, props.row);
				}
				return () => h(CheckboxCell_default, {
					checked: isChecked.value,
					customComponent,
					onChange: handleChange
				});
			}
		}));
	}
	/** 表头 Checkbox 组件 - 用于 customHeaderCell（全选/半选） */
	function CheckboxAllCellComponent() {
		return markRaw(defineComponent({
			props: [
				"col",
				"colIndex",
				"rowIndex"
			],
			setup() {
				const stkTableInstance = findStkTableInstance(getCurrentInstance());
				const dataSource = computed(() => {
					var _stkTableInstance$pro;
					return (stkTableInstance === null || stkTableInstance === void 0 || (_stkTableInstance$pro = stkTableInstance.props) === null || _stkTableInstance$pro === void 0 ? void 0 : _stkTableInstance$pro.dataSource) || [];
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
					var _options$onSelectAll;
					dataSource.value.forEach((item) => {
						item[field] = checked;
					});
					options === null || options === void 0 || (_options$onSelectAll = options.onSelectAll) === null || _options$onSelectAll === void 0 || _options$onSelectAll.call(options, checked);
				}
				return () => h(CheckboxCell_default, {
					checked: isCheckAll.value,
					indeterminate: isIndeterminate.value,
					customComponent,
					onChange: handleChange
				});
			}
		}));
	}
	return {
		CheckboxCell: CheckboxCellComponent,
		CheckboxAllCell: CheckboxAllCellComponent
	};
}
//#endregion
//#region src/StkTable/custom-cells/utils/formatNumber.ts
/** 缩放单位阈值表（从大到小匹配） */
var ABBR_UNITS = {
	cn: [[1e8, "亿"], [1e4, "万"]],
	en: [
		[1e9, "B"],
		[1e6, "M"],
		[1e3, "K"]
	]
};
/**
* 给数字字符串的整数部分添加千分位分隔符。
* @param numStr 不含符号的正数字符串（可含小数部分）
*
* 用手动分组代替先读正则 `\B(?=(\d{3})+(?!\d))`：
* 后者在长数字上开销随位数非线性增长，且 split('.') 会额外分配数组。
*/
function addThousandsSeparator(numStr) {
	const dotIndex = numStr.indexOf(".");
	const intPart = dotIndex === -1 ? numStr : numStr.slice(0, dotIndex);
	const len = intPart.length;
	if (len <= 3) return numStr;
	const firstGroupLen = len % 3 || 3;
	let withSep = intPart.slice(0, firstGroupLen);
	for (let i = firstGroupLen; i < len; i += 3) withSep += "," + intPart.slice(i, i + 3);
	return dotIndex === -1 ? withSep : withSep + numStr.slice(dotIndex);
}
/**
* 数字格式化纯函数（NumberCell / ChangeCell 共享内核）。
*
* 处理管线：空值判断 → 取符号 → 百分比 → 单位缩放 → 小数位 → 千分位 → 拼装。
*
* @param value 原始值（数字或可转为数字的字符串）
* @param options 格式化选项
* @returns 格式化后的字符串；空值或非数字返回 placeholder
*/
function formatNumber(value, options = {}) {
	const { decimals, thousands = true, prefix = "", suffix = "", showSign = false, percent = false, abbr, abbrDecimals, placeholder = "--" } = options;
	if (value === null || value === void 0 || value === "") return placeholder;
	const num = typeof value === "number" ? value : Number(value);
	if (Number.isNaN(num)) return placeholder;
	const sign = num < 0 ? "-" : showSign && num > 0 ? "+" : "";
	let work = Math.abs(num);
	if (percent) work = work * 100;
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
	if (unit) fractionDigits = abbrDecimals ?? decimals ?? 2;
	else fractionDigits = decimals ?? null;
	let numStr = fractionDigits == null ? String(work) : work.toFixed(fractionDigits);
	if (thousands) numStr = addThousandsSeparator(numStr);
	return `${prefix}${sign}${numStr}${unit}${percent ? "%" : ""}${suffix}`;
}
//#endregion
//#region src/StkTable/custom-cells/NumberCell/createNumberCell.ts
/**
* 数字格式化单元格工厂函数
*
* 纯展示型单元格：将 `cellValue` 经 {@link formatNumber} 格式化为文本。
* 数字对齐请在列配置上设置 `align: 'right'`。
*
* @param options 格式化选项
* @returns `NumberCell` 组件构造函数，使用时需调用一次：`customCell: NumberCell()`
*
* @example
* ```ts
* const { NumberCell } = createNumberCell({ decimals: 2 });
* const NumberCellComp = NumberCell();
* const columns = [
*   { title: '现价', dataIndex: 'price', align: 'right', customCell: NumberCellComp },
* ];
* ```
*/
function createNumberCell(options) {
	/** 单元格组件 - 用于 customCell */
	function NumberCell() {
		return markRaw(defineComponent({
			props: [
				"row",
				"col",
				"cellValue",
				"rowIndex",
				"colIndex",
				"expanded",
				"treeExpanded"
			],
			setup(props) {
				return () => h("span", { class: "stk-number-cell" }, formatNumber(props.cellValue, options));
			}
		}));
	}
	return { NumberCell };
}
//#endregion
//#region src/StkTable/custom-cells/ChangeCell/createChangeCell.ts
/** 根据原始值判断涨跌方向 */
function resolveDir(rawValue) {
	const num = rawValue === "" || rawValue == null ? NaN : Number(rawValue);
	if (Number.isNaN(num) || num === 0) return "flat";
	return num > 0 ? "rise" : "fall";
}
/**
* 涨跌单元格工厂函数
*
* 在 {@link formatNumber} 的基础上叠加涨跌染色与箭头。染色按 `cellValue` 正负判断，
* 颜色方向可通过 `colorReverse` 切换（A股 / 国际），也可用 `riseColor` 等自定义。
* 数字对齐请在列配置上设置 `align: 'right'`。
*
* @param options 格式化 + 染色/箭头选项
* @returns `ChangeCell` 组件构造函数，使用时需调用一次：`customCell: ChangeCell()`
*
* @example
* ```ts
* const { ChangeCell } = createChangeCell({ decimals: 2, showSign: true, arrow: true });
* const ChangeCellComp = ChangeCell();
* const columns = [
*   { title: '涨跌额', dataIndex: 'change', align: 'right', customCell: ChangeCellComp },
* ];
* ```
*/
function createChangeCell(options = {}) {
	const { colorReverse = false, arrow = false, riseColor, fallColor, flatColor } = options;
	/** 单元格组件 - 用于 customCell */
	function ChangeCell() {
		return markRaw(defineComponent({
			props: [
				"row",
				"col",
				"cellValue",
				"rowIndex",
				"colIndex",
				"expanded",
				"treeExpanded"
			],
			setup(props) {
				return () => {
					const raw = props.cellValue;
					const dir = resolveDir(raw);
					let colorClass = "stk-change-cell--flat";
					if (dir === "rise") colorClass = colorReverse ? "stk-change-cell--green" : "stk-change-cell--red";
					else if (dir === "fall") colorClass = colorReverse ? "stk-change-cell--red" : "stk-change-cell--green";
					const customColor = dir === "rise" ? riseColor : dir === "fall" ? fallColor : flatColor;
					const arrowChar = arrow && dir !== "flat" ? dir === "rise" ? "▲" : "▼" : "";
					return h("span", {
						class: ["stk-change-cell", colorClass],
						style: customColor ? { color: customColor } : void 0
					}, [arrowChar ? h("span", { class: "stk-change-cell__arrow" }, arrowChar) : null, formatNumber(raw, options)]);
				};
			}
		}));
	}
	return { ChangeCell };
}
//#endregion
export { StkTable_default as StkTable, binarySearch, createChangeCell, createCheckboxCell, createEditableCell, createFilterCell, createNumberCell, formatNumber, insertToOrderedArray, registerFeature, strCompare, tableSort, useAreaSelection };
