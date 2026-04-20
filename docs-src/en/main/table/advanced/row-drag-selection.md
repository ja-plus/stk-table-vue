# Row Drag Selection <Badge type="tip" text="^0.12.0" /> <Badge type="warning" text="Need Register" />
Enable drag-to-select contiguous rows with `props.rowDragSelection`.
- Supports dragging upward and downward.
- Automatically scrolls when the cursor reaches the table edge.
- Useful for batch actions and pre-selecting export ranges.

::: tip Need Registration
This feature needs to be registered before use.
:::

Registration:

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
- [row-drag-selection-change Triggered when row drag selection changes](/en/main/api/emits.html#row-drag-selection-change)

## Exposed
- [getSelectedRows](/en/main/api/expose.md#getselectedrows)
- [clearSelectedRows](/en/main/api/expose.md#clearselectedrows)
