# Matrix
<demo vue="demos/Matrix/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/Matrix/index.vue"></demo>

::: tip
Disable the first column hover event using CSS `pointer-event:none`.
:::

## Notes
The table must have a height set, otherwise setting height on the root element in customCell will not work.
```css
:deep(.stk-table .stk-table-main) {
    height: 100%; // Important, must add height here
}
```