# 单元格编辑
由于每个项目的需求并不相同，表格没有内置单元格编辑功能，您需要通过`customCell` 自行实现。

以下是简易实现：

* 双击单元格编辑： 按 `Enter` 保存，按 `Esc` 或 blur 取消。
* 行编辑模式：勾选编辑行，进入行编辑模式。此模式无需 `Enter` 保存。

<demo vue="demos/CellEdit/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/CellEdit/index.vue"></demo>

## 实现说明
使用 `customCell` 自定义input实现。

::: tip change 事件
您可以通过事件总线 ([CustomEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent/CustomEvent) / [mitt](https://www.npmjs.com/package/mitt)) 等方式，将 `EditCell` 的change事件通知到外部。
:::
