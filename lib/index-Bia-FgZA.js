/**
 * name: stk-table-vue
 * version: v0.11.0-beta.2
 * description: High performance realtime virtual table for vue3 and vue2.7
 * author: japlus
 * homepage: https://ja-plus.github.io/stk-table-vue/
 * license: MIT
 */
import { defineComponent, ref, h, onMounted, onUnmounted, createElementBlock, openBlock, withModifiers, normalizeStyle, createVNode, createElementVNode } from "vue";
import { StkTable as _sfc_main$1 } from "./stk-table-vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  emits: ["confirm"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const columns = ref([
      {
        title: "",
        dataIndex: "value",
        className: "stk-filter-dropdown-checkbox",
        customCell: ({ row }) => h("input", {
          type: "checkbox",
          checked: row.selected,
          onChange: (e) => handleSelectChange(e, row)
        })
      },
      { title: "", dataIndex: "label", customCell: ({ row }) => h("span", [row.label]) }
    ]);
    const visible = ref(false);
    const position = ref({ x: 0, y: 0 });
    const options = ref([]);
    const dropdownEl = ref();
    const checkedTempValue = ref(/* @__PURE__ */ new Set());
    const emit = __emit;
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    function show(pos, opt) {
      visible.value = true;
      position.value = pos;
      options.value = opt || [];
      initChecked();
    }
    function clear() {
      options.value = [];
      checkedTempValue.value.clear();
      confirm();
    }
    async function handleClickOutside(e) {
      var _a;
      if (!visible.value || ((_a = dropdownEl.value) == null ? void 0 : _a.contains(e.target))) return;
      hide();
    }
    function initChecked() {
      checkedTempValue.value = new Set(options.value.filter((opt) => opt.selected).map((opt) => opt.value));
    }
    function handleSelectChange(e, row) {
      const target = e.target;
      if (target.checked) {
        checkedTempValue.value.add(row.value);
      } else {
        checkedTempValue.value.delete(row.value);
      }
    }
    function confirm() {
      options.value.forEach((opt) => opt.selected = checkedTempValue.value.has(opt.value));
      emit("confirm", Array.from(checkedTempValue.value));
      hide();
    }
    function hide() {
      visible.value = false;
    }
    __expose({ visible, show, clear, hide });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "dropdownEl",
        ref: dropdownEl,
        class: "stk-filter-dropdown",
        style: normalizeStyle({ top: position.value.y + "px", left: position.value.x + "px", display: visible.value ? void 0 : "none" }),
        onClick: _cache[0] || (_cache[0] = withModifiers(() => {
        }, ["stop"]))
      }, [
        createVNode(_sfc_main$1, {
          "row-key": "id",
          theme: "dark",
          headless: "",
          virtual: "",
          "no-data-full": "",
          "row-active": false,
          "row-height": 20,
          bordered: false,
          columns: columns.value,
          "data-source": options.value
        }, null, 8, ["columns", "data-source"]),
        createElementVNode("footer", null, [
          createElementVNode("button", { onClick: clear }, "❌"),
          createElementVNode("button", { onClick: confirm }, "✔️")
        ])
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};
