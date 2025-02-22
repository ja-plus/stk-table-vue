## 提示

### 鼠标悬浮表头时，不展示title
* 将 `StkTableColumn` 中的 `title` 字段置为 ""(空字符串)。这样th中就没有title了。
* 使用 `StkTableColumn` 中的 `customHeaderCell` 属性中，自定义表头渲染。

### Filter过滤器
* 暂不支持。可以通过 `customHeaderCell` 自定义实现功能。

### props.fixedMode
* **低版本浏览器** 需要设置 `props.width`（default: width=fit-content不生效）。否则列宽不设宽度会变为0。