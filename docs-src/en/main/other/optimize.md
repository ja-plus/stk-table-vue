# More Performance Optimization

## tr Layering
* Configure `transform:translateZ(0)` via CSS to layer each tr row. This helps with performance.
  - Promoting composite layers may cause color changes for text with black background and red text.
  - ~~Try enabling this feature in the following cases~~
    - ~~When there are many complex `customCell` components~~.
    - ~~When there are many highlight animations~~.

Please try adding the following CSS to see if there's a noticeable reduction in scrolling lag (more obvious on low-performance machines).
```css
.stk-table tbody tr {
  transform: translateZ(0);
}
```
## Scrolling White Screen
1. Try row-by-row scrolling. [scroll-row-by-row](/main/table/basic/scroll-row-by-row.md)
2. Try tr layering.
    
## Highlighting
* Configure `props.highlightConfig.fps` to specify the highlight frame rate. Lowering the frame rate helps reduce resource usage.
  - Recommended value: 30fps. Minimum recommended value: 15fps

## relative fixed
* When `props.cellFixedMode` is set to `relative`, fixed columns and headers are implemented using relative positioning, resulting in fewer rendering composite layers compared to `sticky` implementation.
* Issue: If vertical virtual scrolling is enabled without horizontal virtual scrolling, and some column widths are not set, changes in column widths caused by vertical scrolling may lead to calculation errors for right fixed columns.

## props.autoResize
* Manually set `props.autoResize=false` to eliminate the performance cost of monitoring. Suitable for tables with fixed width and height.

## props.smoothScroll
* Some browser versions have default inertial scrolling. Scrolling too fast can cause white screens. Therefore, it's disabled by default in Chrome > 85, which uses `onwheel` to proxy scrolling and prevent white screens.