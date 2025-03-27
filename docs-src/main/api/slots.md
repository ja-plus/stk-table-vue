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


## customBottom

<demo vue="api/slots/CustomBottom.vue"></demo>

::: tip
`customBottom` 可用于在表格底部加一个元素，使用 `IntersectionObserver` 监听是否滚动到表格底部。
:::