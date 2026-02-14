# Drag Selection <Badge type="tip" text="^0.10.0" />

Enable cell drag selection in the table via `props.areaSelection`.

- Supports copying to clipboard (Ctrl/Cmd + C).
- Esc to cancel selection

```js
<StkTable
    area-selection // [!code ++]
></StkTable>
```

<demo vue="advanced/area-selection/AreaSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/area-selection/AreaSelection.vue"></demo>

# Emit
- [area-selection-change](/en/main/api/emits.html#area-selection-change)