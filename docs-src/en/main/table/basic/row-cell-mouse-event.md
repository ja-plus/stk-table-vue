# Row, Cell Hover and Select

## demo
<demo vue="basic/row-cell-mouse-event/RowCellHoverSelect.vue"></demo>

## Disabling Row Selection
You can use `rowActive.disabled` to disable the selection function for specific rows.
::: warning Note
`rowActive.disabled`: The row cannot be selected by clicking. However, this row can still be selected through the `setCurrentRow` method.
:::

## Setting Current Row
You can select the current row by calling the component method [expose setCurrentRow](/en/main/api/expose.html#setcurrentrow)

## Setting Selected Cell
You can select the current cell by calling the component method [expose setSelectedCell](/en/main/api/expose.html#setselectedcell)


## API
### Related Props:
| key | Type | Default | Description |
| --- | --- | --- | --- |
| rowHover | boolean | true | Whether to highlight hovered rows |
| rowActive | boolean \| RowActiveOption | true | Whether to highlight selected rows |
| ~~rowCurrentRevokable~~ `deprecated(v0.8.9)` Please use `rowActive.revokable` | ~~boolean~~ | ~~true~~ | ~~Whether clicking on the current row again can deselect it (when rowActive=true)~~ |
| cellHover | boolean | false | Whether to highlight hovered cells |
| cellActive | boolean | false | Whether to highlight selected cells |
| selectedCellRevokable | boolean | true | Whether clicking on the cell again can deselect it (when cellActive=true) |

::: tip
If `rowActive` is set to false, it only hides the internal style of the component. The `active` class will still be added to the tr element for custom styling convenience.
:::

### RowActiveOption
| key | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | boolean | true | Whether to enable row selection function |
| disabled | (row: DT) => boolean | () => false | Whether to disable row selection |
| revokable | boolean | true | Whether selection can be revoked |