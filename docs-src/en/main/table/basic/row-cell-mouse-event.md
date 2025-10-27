# Row, Cell Hover and Select

## demo
<demo vue="basic/row-cell-mouse-event/RowCellHoverSelect.vue"></demo>

## Setting Current Row
You can select the current row by calling the component method [expose setCurrentRow](/en/main/api/expose.html#setcurrentrow)

## Setting Selected Cell
You can select the current cell by calling the component method [expose setSelectedCell](/en/main/api/expose.html#setselectedcell)


## API
Related Props:
| key | Type | Default | Description |
| --- | --- | --- | --- |
| rowHover | boolean | true | Whether to highlight hovered rows |
| rowActive | boolean | true | Whether to highlight selected rows (if set to false, only the internal style will be hidden, and the `active` class will still be added to the tr element, which can be used to customize the style) |
| rowCurrentRevokable | boolean | true | Whether clicking on the current row again can deselect it (when rowActive=true) |
| cellHover | boolean | false | Whether to highlight hovered cells |
| cellActive | boolean | false | Whether to highlight selected cells |
| selectedCellRevokable | boolean | true | Whether clicking on the cell again can deselect it (when cellActive=true) |