/**
 * name: stk-table-vue
 * version: v1.0.4
 * description: High performance realtime virtual table for vue3 and vue2.7
 * author: japlus
 * homepage: https://ja-plus.github.io/stk-table-vue/
 * license: MIT
 */
import { t as StkTable_default } from "./StkTable-DuT_ezDm.js";
import { createElementBlock, createElementVNode, createVNode, defineComponent, h, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, reactive, ref, withModifiers } from "vue";
//#region src/StkTable/custom-cells/FilterCell/Dropdown/index.vue?vue&type=script&setup=true&lang.ts
var DROPDOWN_DEFAULT_WIDTH = 300;
var DROPDOWN_DEFAULT_HEIGHT = 400;
var PADDING = 6;
//#endregion
//#region src/StkTable/custom-cells/FilterCell/Dropdown/index.vue
var Dropdown_default = /* @__PURE__ */ defineComponent({
	__name: "index",
	setup(__props, { expose: __expose }) {
		const theme = ref("light");
		const checkedTempValueSet = reactive(/* @__PURE__ */ new Set());
		const columns = ref([{
			title: "",
			dataIndex: "value",
			width: 30,
			className: "stk-filter-dropdown-checkbox",
			customCell: ({ row }) => h("input", {
				type: "checkbox",
				checked: checkedTempValueSet.has(row.value)
			})
		}, {
			title: "",
			dataIndex: "label"
		}]);
		const visible = ref(false);
		const position = ref({
			x: 0,
			y: 0
		});
		const options = ref([]);
		const dropdownEl = ref();
		onMounted(() => {
			document.addEventListener("click", handleClickOutside);
		});
		onUnmounted(() => {
			document.removeEventListener("click", handleClickOutside);
		});
		let onConfirmFn;
		function getDropdownSize() {
			if (!dropdownEl.value) return [DROPDOWN_DEFAULT_WIDTH, DROPDOWN_DEFAULT_HEIGHT];
			const rect = dropdownEl.value.getBoundingClientRect();
			return [rect.width || DROPDOWN_DEFAULT_WIDTH, rect.height || DROPDOWN_DEFAULT_HEIGHT];
		}
		function calculatePosition(docPos) {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
			const viewportWidth = document.documentElement.clientWidth;
			const viewportHeight = document.documentElement.clientHeight;
			const [dropdownWidth, dropdownHeight] = getDropdownSize();
			let finalX = docPos.x;
			let finalY = docPos.y;
			if (docPos.x - scrollLeft + dropdownWidth > viewportWidth - PADDING) finalX = viewportWidth - dropdownWidth - PADDING + scrollLeft;
			const relativeY = docPos.y - scrollTop;
			if (relativeY + dropdownHeight > viewportHeight - PADDING) {
				const triggerHeight = docPos.height || 30;
				if (relativeY - triggerHeight >= dropdownHeight + PADDING) finalY = docPos.y - triggerHeight - dropdownHeight - PADDING;
				else finalY = PADDING + scrollTop;
			}
			finalX = Math.max(PADDING + scrollLeft, finalX);
			finalY = Math.max(PADDING + scrollTop, finalY);
			return {
				x: finalX,
				y: finalY
			};
		}
		async function show(pos, opt, onConfirm) {
			if (dropdownEl.value) dropdownEl.value.style.visibility = "hidden";
			visible.value = true;
			options.value = opt || [];
			initChecked();
			onConfirmFn = onConfirm;
			await nextTick();
			position.value = calculatePosition(pos);
			if (dropdownEl.value) dropdownEl.value.style.visibility = "visible";
		}
		async function handleClickOutside(e) {
			var _dropdownEl$value;
			if (!visible.value || ((_dropdownEl$value = dropdownEl.value) === null || _dropdownEl$value === void 0 ? void 0 : _dropdownEl$value.contains(e.target))) return;
			hide();
		}
		function initChecked() {
			options.value.forEach((opt) => {
				if (opt.selected) checkedTempValueSet.add(opt.value);
			});
		}
		function updateChecked(checked, row) {
			if (checked) checkedTempValueSet.add(row.value);
			else checkedTempValueSet.delete(row.value);
		}
		function confirm() {
			options.value.forEach((opt) => opt.selected = checkedTempValueSet.has(opt.value));
			onConfirmFn(Array.from(checkedTempValueSet));
			hide();
		}
		function hide() {
			visible.value = false;
			options.value = [];
			checkedTempValueSet.clear();
		}
		function handleRowClick(e, row) {
			updateChecked(!checkedTempValueSet.has(row.value), row);
		}
		function setTheme(t) {
			theme.value = t;
		}
		function handleClear() {
			checkedTempValueSet.clear();
			confirm();
		}
		__expose({
			visible,
			show,
			hide,
			setTheme
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "dropdownEl",
				ref: dropdownEl,
				class: normalizeClass(["stk-filter-dropdown", [`stk-filter-dropdown--${theme.value}`]]),
				style: normalizeStyle({
					top: position.value.y + "px",
					left: position.value.x + "px",
					display: visible.value ? void 0 : "none"
				}),
				onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
			}, [createVNode(StkTable_default, {
				"row-key": "id",
				headless: "",
				virtual: "",
				"no-data-full": "",
				theme: theme.value,
				"row-active": false,
				"row-height": 20,
				bordered: false,
				columns: columns.value,
				"data-source": options.value,
				onRowClick: handleRowClick
			}, null, 8, [
				"theme",
				"columns",
				"data-source"
			]), createElementVNode("footer", null, [createElementVNode("button", { onClick: handleClear }, "↺"), createElementVNode("button", { onClick: confirm }, "✓")])], 6);
		};
	}
});
//#endregion
export { Dropdown_default as default };
