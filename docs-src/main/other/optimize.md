## 性能优化

### 高亮
* 配置 `props.highlightConfig.fps` 指定高亮帧率。降低帧率有利于性能。

### relative fixed
* 配置 `props.cellFixedMode` 为 `relative` 时，将使用相对定位实现固定列与固定表头，相较于`sticky`的实现，渲染合成层更少。
* 问题：若开启了纵向虚拟滚动，不开启横向虚拟滚动，且不设置某些列宽时。如果纵向滚动导致某些列宽变化，则会导致右侧固定列计算错误。

### tr 分层
* 通过css选择器将 stk-table tbody tr 配置 `transform:translateZ(0)` 对每行 tr 进行分层。对性能有帮助。
  - 提升合成层可能导致黑底红字字体颜色发生变化。
  - 以下情况尝试开启此功能。
    - 在 `customCell` 较多且复杂时。
    - 大量 highlight 动画时。
    
### props.autoResize
* 手动设置为 `props.autoResize=false`。可取消监听的性能消耗。适用于宽度高度不变的表格。

### props.smoothScroll
* 一些版本浏览器滚动默认有惯性。滚动过快会导致白屏。因此 chrome 85~133 版本默认关闭，将使用 `onwheel` 代理滚动，防止滚动白屏。