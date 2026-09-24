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

## Slots on the customCell side <Badge type="tip" text="^1.2.7" />

The table below lists slots of **your customCell component** (not top-level StkTable slots). They are passed only when a column declares `customCell`, handing the built-in decorations back to you:

| slots | built-in content | describe |
| ---- | ---- | ---- |
| `stkFoldIcon` | expand control: arrow / lazy loading spinner / leaf placeholder cell | Rendering it gives you the built-in look and the expanded-state rotation for free; skipping it means you draw the control yourself and must mark it with `data-stk-fold` |
| `stkTreeIndent` | per-level indent cell + level guide lines (`treeConfig.showGuide`) | For `tree-node` columns; with `showGuide` off only the indent remains |
| `stkDragIcon` | row drag handle | For `type: 'dragRow'` columns |

::: warning Placement contract
When you consume these slots, the cell root element needs `height: 100%; display: flex; align-items: center;`: guide lines are drawn inside the indent cell and stretch over the full row height, so a root that is not a full-height flex row will cut them short.
:::

::: tip Public tree components
You can also import `StkTreeCell` as a complete `customCell`, or compose `StkTreeIndent` and `StkTreeFoldIcon` from `stk-table-vue`. The fold control is driven by the public `expandable`, `loading`, and `expanded` states.
:::

::: tip Example
See [File Management Tree](/en/demos/file-tree).
:::


## customBottom

<demo vue="api/slots/CustomBottom.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/api/slots/CustomBottom.vue"></demo>

::: tip
`customBottom` can be used to add an element at the bottom of the table, using `IntersectionObserver` to monitor whether the table bottom is scrolled to.
:::