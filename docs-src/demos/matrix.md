# 矩阵
<demo vue="demos/Matrix/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/Matrix/index.vue"></demo>

::: tip
取消首列悬浮事件使用css `pointer-evnet:none`控制。
:::

## 注意点
table 必须设置高度，否则 customCell 中的根元素设置height无效。
```css
:deep(.stk-table .stk-table-main) {
    height: 100%; // 重要，这里必须加高度
}
```