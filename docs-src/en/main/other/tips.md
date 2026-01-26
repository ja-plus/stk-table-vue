## Tips

### Disable title on header cell hover
* Set the `title` field in `StkTableColumn` to an empty string (""). This will remove the title from the th element.
* Use the `customHeaderCell` property in `StkTableColumn` to customize header cell rendering.

### Filter
* Not supported yet. You can implement this functionality through `customHeaderCell`.

### props.fixedMode
* For **older browsers**, If you are using a low version of browser, you need to set the width of `.stk-table-main` to `unset` in css. Otherwise, the width of the column will be 0.