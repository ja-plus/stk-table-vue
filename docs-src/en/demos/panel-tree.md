# Panel Tree
## Demo
<demo vue="demos/PanelTree/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/PanelTree/index.vue"></demo>

## Key Points
### Disable Selection for Expandable Rows
Configure the `disabled` function in `row-active` to disable selection when a row has children.
### Remove Hover Style for Expandable Rows
1. Configure `row-class-name` to add the `panel-header-row` class name when a row has children.
2. Configure `panel-header-row` -> `--tr-hover-bgc: var(--th-bgc);` to maintain consistency with the header background color.
### Remove '--' for Expandable Rows
Configure `empty-cell-text` to return an empty string when a row has children.
### Text Overflow for Expandable Rows
Remove the default text overflow style through CSS.
```css
:deep(.panel-header-row .table-cell-wrapper) {
    overflow: initial;
}
```

