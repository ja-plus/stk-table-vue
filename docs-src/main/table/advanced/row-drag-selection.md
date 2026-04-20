# 拖拽选中行 <Badge type="tip" text="^0.12.0" /> <Badge type="warning" text="Need Register" />
通过 `props.rowDragSelection` 启用鼠标拖拽连续选择多行。
- 支持向上、向下拖拽选择。
- 拖拽到表格边缘时会自动滚动。
- 适合批量操作、批量高亮、批量导出前置选择。

::: tip 需要注册
该功能需要注册后才能使用。
:::

注册方式：

```ts
import { registerFeature, useRowDragSelection } from 'stk-table-vue';

registerFeature(useRowDragSelection);
```

```js
<StkTable
    row-drag-selection // [!code ++]
></StkTable>
```

<demo vue="advanced/row-drag-selection/RowDragSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/row-drag-selection/RowDragSelection.vue"></demo>

## Emit
- [row-drag-selection-change 行拖拽选区变更触发](/main/api/emits.html#row-drag-selection-change)

## Exposed
- [getSelectedRows](/main/api/expose.md#getselectedrows)
- [clearSelectedRows](/main/api/expose.md#clearselectedrows)
