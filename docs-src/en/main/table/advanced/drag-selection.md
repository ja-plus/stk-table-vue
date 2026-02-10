# Drag Selection <Badge type="tip" text="^0.10.0" />

Enable cell drag selection in the table via `cellSelection`.

Supports copying to clipboard (Ctrl/Cmd + C).

<demo vue="advanced/drag-selection/DragSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/drag-selection/DragSelection.vue"></demo>

Notes:

- Enable method: Pass `:cell-selection="{ formatCellForClipboard: fn }"` to `StkTable`.
- Selection triggers the `cell-selection-change` event, which includes the selected rows and columns (absolute index slices).
- Using it with dynamically added data may cause selection data errors.
- Copy to clipboard: Press `Ctrl/Cmd+C` in the example to copy the selected content in TSV format.
- Esc to cancel selection