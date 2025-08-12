# Slots

| slots | props | describe |
| ---- | ---- | ---- |
| `tableHeader` | `{col}` | Table header, generally recommended to use customHeaderCell. This slot is more convenient when customizing multiple table headers in batch. |
| `empty` | -- | Empty data state |
| `expand` |  `{col, row}` | Expand row |
| `customBottom` | -- | Table bottom. |

::: info
If you want to customize cells, please use the `StkTableColumn['customCell']` property.
:::


## customBottom

<demo vue="api/slots/CustomBottom.vue"></demo>

::: tip
`customBottom` can be used to add an element at the bottom of the table, using `IntersectionObserver` to monitor whether the table bottom is scrolled to.
:::