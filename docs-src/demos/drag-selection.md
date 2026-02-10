# 拖拽选区（Cell Selection）

此示例展示如何通过 `cellSelection` 启用表格的单元格拖拽选区，并支持复制到剪贴板（Ctrl/Cmd + C）。

示例组件：

<demo vue="demos/DragSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/DragSelection.vue"></demo>

说明：

- 启用方式：在 `StkTable` 上传入 `:cell-selection="{ formatCellForClipboard: fn }"`。
- 选区会触发 `cell-selection-change` 事件，事件参数包含选中行与列（绝对索引切片）。
- 在动态添加的数据中使用会导致选区数据错误。
- 复制到剪贴板：示例中按 `Ctrl/Cmd+C` 会将选区内容按 TSV 格式复制。
- Esc 取消选区

