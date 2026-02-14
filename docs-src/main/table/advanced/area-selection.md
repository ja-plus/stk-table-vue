# 拖拽选区 <Badge type="tip" text="^0.10.0" /> 

通过 `props.areaSelection` 启用表格的单元格拖拽选区。

- 支持复制到剪贴板（Ctrl/Cmd + C）。
- Esc 取消选区

```js
<StkTable
    area-selection // [!code ++]
></StkTable>
```

<demo vue="advanced/area-selection/AreaSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/area-selection/AreaSelection.vue"></demo>

## Emit
- [area-selection-change 区域变更触发](/main/api/emits.html#area-selection-change) 

## Exposed
- [getSelectedArea](/main/api/expose.md#getselectedarea)
- [clearSelectedArea](/main/api/expose.md#clearselectedarea)
- [copySelectedArea](/main/api/expose.md#copyselectedarea)