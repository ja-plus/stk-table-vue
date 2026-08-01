# table-layout: fixed

## 配置
`props.fixedMode` 即可使 table-layout 为 fixed

## 示例
为了实现一列宽度固定，其余列平分的场景，我们需要借助原生 table-layout: fixed 的列宽等分的行为。

::: warning 
此模式仅生效 `StkTableColumn['width']`
:::

<demo vue="basic/fixed-mode/FixedMode.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedMode.vue"></demo>

## 多级表头 <Badge type="tip" text="^1.0.3" />
多级表头场景下，子列声明的 `width` 同样会生效。父列宽度为其所有子列宽度之和。

<demo vue="basic/fixed-mode/FixedModeMultiHeader.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedModeMultiHeader.vue"></demo>





