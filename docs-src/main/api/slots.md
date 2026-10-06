# Slots 插槽

| slots | props | describe |
| ---- | ---- | ---- |
| `tableHeader` | `{col}` | 表头，一般推荐使用 customHeaderCell 。这个插槽，在批量自定义表头的时候会更方便。 |
| `empty` | -- | 空数据状态 |
| `expand` |  `{col, row}` | 展开行 |
| `customBottom` | -- | 表格底部。 |

::: info
如果您想自定义单元格，请使用 `StkTableColumn['customCell']` 属性。
:::

## customCell 侧插槽 <Badge type="tip" text="^1.2.7" />

下表是**你的 customCell 组件**的插槽（不是 StkTable 的顶层插槽）。仅在列配置了 `customCell` 时传入，用于把内置装饰交回给你摆放：

| slots | 内置内容 | describe |
| ---- | ---- | ---- |
| `stkFoldIcon` | 展开控件：箭头 / 懒加载 loading / 叶子占位格 | 渲染即拿回内置外观与展开态旋转，无需自行判断状态；不渲染则需自绘控件并标记 `data-stk-fold` |
| `stkTreeIndent` | 按层级的缩进格 + 层级引导线（`treeConfig.showGuide`） | 供 `tree-node` 列使用；`showGuide` 关闭时只剩缩进 |
| `stkDragIcon` | 行拖拽把手 | 供 `type: 'dragRow'` 列使用 |

::: warning 摆放契约
消费这些插槽时，单元格根元素需要 `height: 100%; display: flex; align-items: center;`：引导线画在缩进格内并撑满整行高，根元素若不是撑满行高的 flex 行，线会被截断。
:::

::: tip 公共树组件
也可以从 `stk-table-vue` 导入 `StkTreeCell` 作为完整的 `customCell`，或组合使用 `StkTreeIndent` 与 `StkTreeFoldIcon`。展开控件由 `expandable`、`loading`、`expanded` 这组公开状态驱动。
:::

::: tip 用法示例
见[文件管理树](/demos/file-tree)。
:::


## customBottom

<demo vue="api/slots/CustomBottom.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/api/slots/CustomBottom.vue"></demo>

::: tip
`customBottom` 可用于在表格底部加一个元素，使用 `IntersectionObserver` 监听是否滚动到表格底部。
:::