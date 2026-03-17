/**
 * name: stk-table-vue
 * version: v0.11.3
 * description: High performance realtime virtual table for vue3 and vue2.7
 * author: japlus
 * homepage: https://ja-plus.github.io/stk-table-vue/
 * license: MIT
 */
import { defineComponent, ref, reactive, h, onMounted, onUnmounted, createElementBlock, openBlock, withModifiers, normalizeStyle, normalizeClass, createElementVNode, createVNode } from "vue";
import { StkTable as _sfc_main$1 } from "./stk-table-vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props, { expose: __expose }) {
    const theme = ref("light");
    const checkedTempValueSet = reactive(/* @__PURE__ */ new Set());
    const columns = ref([
      {
        title: "",
        dataIndex: "value",
        width: 30,
        className: "stk-filter-dropdown-checkbox",
        customCell: ({ row }) => h("input", {
          type: "checkbox",
          checked: checkedTempValueSet.has(row.value),
          onClick: (e) => e.preventDefault()
        })
      },
      { title: "", dataIndex: "label", customCell: ({ row }) => h("span", [row.label]) }
    ]);
    const visible = ref(false);
    const position = ref({ x: 0, y: 0 });
    const options = ref([]);
    const dropdownEl = ref();
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    let onConfirmFn;
    function show(pos, opt, onConfirm) {
      visible.value = true;
      position.value = pos;
      options.value = opt || [];
      initChecked();
      onConfirmFn = onConfirm;
    }
    async function handleClickOutside(e) {
      var _a;
      if (!visible.value || ((_a = dropdownEl.value) == null ? void 0 : _a.contains(e.target))) return;
      hide();
    }
    function initChecked() {
      options.value.forEach((opt) => {
        if (opt.selected) {
          checkedTempValueSet.add(opt.value);
        }
      });
    }
    function updateChecked(checked, row) {
      if (checked) {
        checkedTempValueSet.add(row.value);
      } else {
        checkedTempValueSet.delete(row.value);
      }
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
      const selected = checkedTempValueSet.has(row.value);
      updateChecked(!selected, row);
    }
    function setTheme(t) {
      theme.value = t;
    }
    function handleClear() {
      checkedTempValueSet.clear();
    }
    __expose({ visible, show, hide, setTheme });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "dropdownEl",
        ref: dropdownEl,
        class: normalizeClass(["stk-filter-dropdown", [`stk-filter-dropdown--${theme.value}`]]),
        style: normalizeStyle({ top: position.value.y + "px", left: position.value.x + "px", display: visible.value ? void 0 : "none" }),
        onClick: _cache[0] || (_cache[0] = withModifiers(() => {
        }, ["stop"]))
      }, [
        _cache[1] || (_cache[1] = createElementVNode("div", { style: { "padding": "4px" } }, "Filter (Beta)", -1)),
        createVNode(_sfc_main$1, {
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
        }, null, 8, ["theme", "columns", "data-source"]),
        createElementVNode("footer", null, [
          createElementVNode("button", { onClick: handleClear }, "↺"),
          createElementVNode("button", { onClick: confirm }, "✓")
        ])
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
