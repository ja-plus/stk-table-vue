# Slots 插槽

| slots | props | describe |
| ---- | ---- | ---- |
| `tableHeader` | `{col}` | table header slot |
| `empty` | -- | no data status |
| `expand` |  `{col, row}` | expand row |
| `customBottom` | -- | 表格底部 |

::: info
如果您想自定义单元格，请使用 `StkTableColumn['customCell']` 属性。
:::

## customBottom

<demo vue="api/slots/CustomBottom.vue"></demo>