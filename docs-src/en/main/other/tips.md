## 提示

### Disable title on header cell hover
* Set the `title` field in `StkTableColumn` to an empty string (""). This will remove the title from the th element.
* Use the `customHeaderCell` property in `StkTableColumn` to customize header cell rendering.

### Filter
* Not supported yet. You can implement this functionality through `customHeaderCell`.

### props.fixedMode
* For **older browsers**, you need to set `props.width` (default: width=fit-content doesn't work). Otherwise, columns without specified width will have zero width.