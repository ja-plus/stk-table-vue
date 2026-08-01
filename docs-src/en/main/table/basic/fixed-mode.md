# table-layout: fixed

## Configuration
`props.fixedMode` enables table-layout: fixed

## Example
To achieve a scenario where one column has a fixed width and the remaining columns are evenly divided, we need to leverage the native table-layout: fixed behavior of equal column width distribution.

::: warning 
This mode only affects `StkTableColumn['width']`
:::

<demo vue="basic/fixed-mode/FixedMode.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedMode.vue"></demo>

## Multi-level Header <Badge type="tip" text="^1.0.3" />
In multi-level header scenarios, the `width` declared on child columns also takes effect. The parent column's width equals the sum of all its child column widths.

<demo vue="basic/fixed-mode/FixedModeMultiHeader.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedModeMultiHeader.vue"></demo>





