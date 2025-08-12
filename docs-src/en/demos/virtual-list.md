# Virtual Single List

It's essentially a table with **only one column**, implemented through the following steps:
* `props.bordered=false` to remove the table border.
* `props.headless=true` to remove the table header.
* `props.rowActive=false` to remove row click highlighting.
* `props.rowHover=false` to remove row hover styles.
* `props.rowHeight` to set row height.
* `StkTableColumn['customCell']` to customize cell content.


## Code Example
```ts
<StkTable
    row-key="id"
    style="height: 400px"
    virtual // [!code ++]
    headless // [!code ++]
    :row-height="200" // [!code ++]
    :bordered="false" // [!code ++]
    :row-active="false" // [!code ++]
    :row-hover="false" // [!code ++]
    :columns="columns"
    :data-source="data"
></StkTable>
```
## Examples

### Equal Height
<demo vue="demos/VirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList"></demo>

### Variable Height
Configure `props.autoRowHeight` to enable automatic row height.

Set the expected height through `props.autoRowHeight.expectedHeight`. By default, `props.rowHeight` is used as the expected height.

<demo vue="demos/VirtualList/AutoHeightVirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList/AutoHeightVirtualList"></demo>
