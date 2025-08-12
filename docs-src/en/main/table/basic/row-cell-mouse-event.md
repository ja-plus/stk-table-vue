# Row, Cell Hover and Select

## demo
<demo vue="basic/row-cell-mouse-event/RowCellHoverSelect.vue"></demo>


## API
Related Props:
| key | Type | Default | Description |
| --- | --- | --- | --- |
| rowHover | boolean | true | Whether to highlight hovered rows |
| rowActive | boolean | true | Whether to highlight selected rows |
| rowCurrentRevokable | boolean | true | Whether clicking on the current row again can deselect it (when rowActive=true) |
| cellHover | boolean | false | Whether to highlight hovered cells |
| cellActive | boolean | false | Whether to highlight selected cells |
| selectedCellRevokable | boolean | true | Whether clicking on the cell again can deselect it (when cellActive=true) |