## 提示

### 鼠标悬浮表头时，不展示title
* 将 `StkTableColumn` 中的 `title` 字段置为 ""(空字符串)。这样th中就没有title了。
* 使用 `StkTableColumn` 中的 `customHeaderCell` 属性中，自定义表头渲染。

### Filter过滤器
* ~~暂不支持。可以通过 `customHeaderCell` 自定义实现功能~~。
* 内置自定义过滤器组件。[FilterCell 筛选](/main/table/advanced/custom-cells/filter-cell)

### props.fixedMode
* **低版本浏览器** 需要通过css设置 `.stk-table-main` 的 width（default: width=fit-content不生效）。否则列宽不设宽度会变为0。

### customCell宽度控制
* 由于 `customCell` 是 `td` 的子元素，如果你发现 `customCell`中 `flex` 容器，弹性宽度控制不生效，你可以给 `StkTableColumn['width']` 设置一个较小的宽度，使 flex 容器计算。否则，`flex` 容器会计算子元素的文字(max-content) 宽度。
