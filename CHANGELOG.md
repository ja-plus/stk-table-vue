## 0.4.11

* feat: export strCompare from './utils';
* optimize: if not virtual table, need not do auto resize function.
* fix: `StkTable.setHighlightDimCell` first parameter type accept number.
* fix: `insertToOrderedArray` emptyToBottom bugfix

## 0.4.10

* optimize: the experience drag resize fixed right cols
* fix: error when sort with null row
* fix: `StkTable.setCurrentRow` param accept `undefined` to clear currentRow
* change: `emit('sort-change')` col will return null, when defaultSorter.dataIndex cannot find in props.columns
* change: `props.sortConfig.defaultSort` add prop `sortField` `sortType` `sorter` consistent with `StkTableColumns` fields related to sorting.

## 0.4.9 

* fix: hover, active style in stripe mode.
* fix: defaultSort cause  `sort-change` callback param: 'col' not right.

## ~~0.4.7~~ 0.4.8

* fix: virtualScrollY calculate error. which cause error load when props.stripe is true.
* fix: multi header. `th>div` max-height error.
* fix: `PageUp`&`PageDown` key function in simple table(not virtual).
* feature: watch props.virtual.
* revert: `0.3.7-fix-1` virtual padding in independent tbody -> now revert in main tbody. Because it's not worked property in old vue version or old browser version.
  -  use `vt-on` to resolve the stripe color problem.
* change: class name : `virtual-x-left`& `virtual-x-right` rename -> `vt-x-left`&`vt-x-right`

## 0.4.6

* revert: StkTableColumn&lt;DT&gt;, DT type to any.

## ~~0.4.4~~ 0.4.5

* fix: `StkTableColumns["customCell"]/StkTableColumns["customHeaderCell"]` prop可选。
* fix: 未设置 `props.fixedColShadow` 时固定列滚动异常。

## 0.4.3

* feature: `props.rowHover[true]` 控制是否高亮**悬浮**的行。
* feature: `props.rowActive[true]` 控制是否高亮**选中**的行。
* feature: `props.rowCurrentRevokable[true]` 控制选中的行再次点击是否可以取消。

## 0.4.2

* feature: `CustomHeaderCellProps` 新增 `rowIndex/colIndex`。
* fix: 虚拟滚动，滚动条不在顶部时，表格数据变少导致滚动条位置计算错误。
* fix: rowKey 为 `undefined` 异常高亮行。
* fix: row not object 时的兜底。
* fix: `StkTableColumn.customCell / customHeaderCell` 类型修改，解决 customCell 入参被推断为any的问题。
* fix: 滚动虚拟滚动表格滚动条到边界情况时，继续滚动不会触发祖先容器的滚动事件。
* fix: `SortState["dataIndex"]` type should be `keyof T`
* fix: `emit(e:'current-change')` row type DT => DT | undefined

## 0.4.1

* optimize: 优化滚动体验。使用 `wheel` 事件进行滚动，以防止滚轮滚动过快导致短暂白屏。
* fix: `firefox` 兼容。

## 0.4.0

* feature: 固定列阴影支持 fixed sticky 动态变化。
  - fix: 固定列层级调整。防止左侧固定列覆盖在右侧固定列上。
  - change: 现在列不处于固定状态时，不会为其添加z-index。
  - change: 固定列z-index由行内定于变为css定义。
* change: 添加三个tbody的class类名。
* change: `cellFixedMode` 为relative下，固定列都放在两侧。
* fix: 调整z-index ，解决固定列阴影纵向滚动时与表头阴影叠加的问题。


## 0.3.7

* fix: 新增tbody用于实现虚拟滚动上下距离，解决`props.stripe` 在虚拟滚动是否开启时表现不同的问题。
* fix: td `line-height` 为 1 导致英文基线下方部分被截断。现设置为默认值。
* fix: `highlightDim` 方法，修复高亮不返回当前背景颜色的问题。

## 0.3.6

* fix: 列数从多变少时，virtualScrollX.endIndex 超出数组长度的问题。

## 0.3.5

* fix: `initVirtualScrollY` 入参为 0 时应当去获取容器高度。
* change: `StkTableColumn.customCell` 当传入函数式组件，其 props 命名更改为 camelCase。（cell-value => cellValue）

## 0.3.4

* feature: `setHighlightDimRow`/`setHighlightDimCell` 参数 `options.method`在 `animation` 的情况下支持控制帧率。
* change: `setHighlightDimRow` / `setHighlightDimCell` 默认参数 `options.method` 调整为 `animation`。
* optimize: 横向虚拟滚动时，最右侧预渲染列是否出现算法更精准。
* fix: 修复非虚拟滚动时，设置 `props.rowHeight` 与 `props.headerRowHeight` 无效的问题。但仍会被内容撑开。
* fix: 修复 `props.stripe` 为true时，autoResize 有时会失效的问题。

## 0.3.3

* feature: 新增`props.cellFixedMode` 配置，设置为`relative` 时，将使用 `position:relative` 实现固定列固定头。
* optimize: 滚动条在最左边或最右边时，对应的固定列不分层。去除 `position:sticky`
* change: 非固定列单元格 `z-index` 原为 1 调整为 不设置。

## 0.3.2

* feature: 单元格事件
  - `props.cellHover`启用td hover状态
  - 新增 `cell-mouseenter` `cell-mouseleave` `cell-mouseover` 事件。
* change: 点击行后，再次点击取消噶奥良。
  - current-change 新增参数，{select: boolean} 表示是否选中。
* change: 减少css选择器层级。th background-color 变更为inherit。
* change: `tr` 移除 `transform:translateZ(0)` 进行分层。有需要时用户可以手动添加样式分层。
* change: remove `tbody` `position:relative`。
* fix: 高亮行时，有概率不触发高亮的问题。
* fix: 修复 legacy 模式下固定表头固定列问题。

## 0.3.1

* fix: `.highlight-row` `.highlight-cell` class 浏览器兼容。
* fix: 纵向滚动预渲染1行。，防止特殊高度情况，表格滚动下方有空白。

## 0.3.0

* feature: `StkTableColumn` 新增 `type`字段，配置 `seq` 表示为序号列。
  - 新增 `props.seqConfig.startIndex` 控制序号列开始序号。
* feature: `setHighlightDimRow`/`setHighlightDimCell`。
  - ⭐**break change**:最后参数option，deprecated -> `option.useCss`，使用 `option.method` 代替。
  - 新增 `option.method`
    - 取值 `animation` 时使用 [Animation API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API) 实现。
  - 新增 `option.keyframe`：使用 Animation Api设置动画 `option.method` = `animation` 时生效。
  - 新增 `option.duration`: 动画持续时间。
  - 新增 `option.className`: 用于自定义高亮类。`option.method` = `css` 时生效。
* optimize: 不合适的 td z-index
* optimize: `tr` 添加 `transform:translateZ(0)`, 用于提升合成层，提升高亮行性能。
* optimize: `setHighlightDimRow` 使用 `document.getElementById` 实现。优化渲染性能。
* optimize: StkTable.vue 中 变量`tableHeader`/`tableHeaderLast` 转为 `shallowRef` 优化
* change: 移除`props.highlightConfig.color`，用于可自行通过css改变颜色。新增的 Animation API，可实现颜色修改。
* change: 虚拟滚动下，默认高亮帧率 10 -> 30。
* fix: **非**虚拟滚动时，键盘上下按键及`PageUp`/`PageDown`无法滚动问题。
* fix: **非**横向虚拟滚动时，列宽不设置为变为默认列宽的问题。
* fix: **非**虚拟滚动时，列固定计算应优先使用 `minWidth` 计算，非 `width`。

## 0.2.9

* feature: 新增`props.highlightConfig` 支持配置高亮参数（持续时间，颜色，频率（虚拟滚动））。
* feature: `highlightDimRow` `highlightDimCell` 方法增加参数`option.className` 用于自定义高亮类。
* optimize: 横向虚拟滚动计算优化。在有左侧固定列时，横向虚拟区间范围缩小。

## 0.2.8

* fix: 多级表头 `fixedColClassMap` 异常

## 0.2.7

* feature: `setHighlightDimRow` 新增第二参数 options.useCss 表示强制使用css 关键帧动画。否则在虚拟滚动情况下，默认js计算高亮。
* optimize: 使用 computed 优化 `getCellStyle`。
* optimize: 使用 computed 优化 `getFixedColClass`。
* fix: 高亮开始值不应设置为空。

## 0.2.6

* feature: `props.emptyCellText` 支持传入函数 ({row, col}) => string;
* feature: `props.sortConfig.defaultSort` 添加 `silent` 属性，表示是否触发 `sort-change`事件。默认false。表示触发。
  - fix: 此配置用于修复defaultSort不触发sort-change 的问题。
* fix: package.json types
* fix: `highlightDimRow` 在 vue2.7 不生效的问题。

## 0.2.5

* feature: `props.sortConfig.stringLocaleCompare` 控制是否使用 Array.prototype.localeCompare 排序字符串。默认true。
* feature: `props.hideHeaderTitle` 控制th的 title 属性是否展示。
* optimize: 优化虚拟滚动 pageSize(减去表头高度)
* optimize: `StkTableColumn` 中的 `width`,`minWidth`,`maxWidth` 支持配置数字。
* fix: `PageUp`/`PageDown` 按键翻页会大于一页的情况。
* fix: `props.stripe` 时，虚拟滚动导致斑马纹错位问题。
* fix: `props.theme` 改变时，高亮颜色有误的问题。
* fix: 多级表头，父级表头设置 `fixed` 也可以固定。
* change: `insertToOrderedArray` 新增参数 `sortConfig`对齐 `tableSort` 方法。

## 0.2.3

* feature: `props.sortConfig.defaultSort` 控制默认排序。
* fix: 修复 `props.dataSource` 为 `shallowRef` 时，高亮行异常的问题。

## 0.2.2

* feature: `props.sortConfig` 配置排序规则排序。
  - `props.sortConfig.emptyToBottom`可配置空数据是否参与排序。
  - `tableSort` 方法新增 `sortConfig` 参数。

## 0.2.1

* feature: 多级表头固定列阴影。
* feature: `StkTable` expose `getSortColumns`，用于获取当前排序信息。
* feature: `props.headerDrag` 支持传函数，配置那些列可以被拖动。
* change: `auto-resize` debounce  `500ms` -> `200ms`
* optimize: `StkTable.vue` 文件script 中 lang `tsx` -> `ts`。方便vue2.7引入使用。
* fix: `headerDarg` 拖动文字节点，控制台报错的问题
* change: `stk-table` border,`headless` border-top

## 0.2.0

* optimize: 新增 `props.optimizeVue2Scroll` 优化vue2滚动流畅度。
* optimize: 减少 css 一些选择器层级。
* change: 表格border-left 不再由最左侧单元格提供。而由外层容器提供。
* fix: `@scroll` 事件返回的 startIndex , endIndex 不正确的问题。
* fix: watch `props.fixedColShadow` 响应。
* fix: `current-change` 在 `props.dataSource` 不用ref包的情况下。判断相等有误，导致重复触发的问题。使用rowKey判断解决。
* fix: 横向虚拟滚动右侧列会在视口加载的问题。

## 0.1.0

* feature: 固定列阴影。通过`props.fixedColShadow` 开启。出于与旧版行为保持一致，默认关闭。
* feature: `PageUp`/`PageDown` 滚动表格。
* change: `slot.tableHeader` props `column` -> `col`。
* change: 排序箭头css `arrow-up/arrow-down` id选择器 -> class选择器。
* feature: 新增 `props.headerRowHeight` 控制表头行高。
* optimize: virtualX_on 计算规则更改位超出容器宽度 + 100时开启。(之前为超出容器宽度*1.5)。

## 0.0.2

* fix: 2级表头滚动问题。
* feature: 支持任意多级表头。
* change: th z-index 3 -> 4, fixed时 4 -> 5

## 0.0.1

* feature: `props.stripe` 表格斑马条纹。
* feature: 新增`@scroll-x` 事件，用于区分横向滚动和纵向滚动。原scroll事件只响应纵向滚动事件。
* fix: `virtual-x` 右侧有固定列时，宽度计算有问题。
* update: `auto-resize` prop 支持传回调方法。用于resize后执行。
* feature: `props.rowHeight` 控制行高。

## 0.0.1-beta.9

* revert: 添加.stk-table-main width相关的默认值。
* fix: 为兼容vue2.7，不能将props放在单独文件。只能放在.vue中。
* revert: 为方便直接引用src的源码使用，style.css要求用户环境安装postcss，现替换为style.less。

## 0.0.1-beta.8

* revert: 取消.stk-table-main width相关的默认值。
* fix: col resizable

## 0.0.1-beta.7

* remove less, use css + postcss instead
* add: 鼠标悬浮在表格上时，键盘按下箭头滚动虚拟滚动列表
* 增强 StkTableColumns["sorter"] 的类型

## 0.0.1-beta.6

* 优化 StkTableColumn fixed 遍历。
* expose sortCol 用于判断表格是否在排序状态。
* fix: `tableSort` 入参dataSource 为空时报错的问题。
* fix: `autoResize` scrollTo 问题。
* feature: `autoResize` 使用 `ResizeObserver`
* fix: `stk-table-main` 样式兼容 min-width: 100%, width: fit-content;

## 0.0.1-beta.5

* expose initVirtualScroll
* remove vue style scope
* 默认不展示排序按钮。点击表头排序后显示箭头。
* 增加 props.autoResize 当window 触发 resize 时，自动重新计算虚拟滚动。

## 0.0.1-beta.4

* 修改props.border 为 props.bordered 取值 "h" | "v" | "body-v"

## 0.0.1-beta.3

* 优化 Order 类型
* 增加props.border = horizontal 表示仅展示横向边框。

## 0.0.1-beta.2

* customCell 入参增加 cellValue。
* props.fixedMode 控制表格 table-layout 为fixed
* expose 方法 scrollTo 调整参数。接收null时，不设置位置，而非原来的默认为0.

## before 1.5.0

* 转换 CompositionApi
* webpack -> vite
* 多级表头列宽拖动。

## before 1.4.0

* 实现 fixed: 'right'.存在fixed: 'left' 列，覆盖fixed: 'right'列的问题。

## before 1.3.1

* v-bind.props 有问题。移除。
* 移除不需要的v-if判断

## before 1.3.0

* 列宽拖动，列默认不铺满容器。
  * 移动量不小于最小列宽。指示器逻辑更新。

## before

* tableSort 参数 order, dataSource 位置互换
* 1.3.0 列宽拖动，列默认不铺满容器
* 1.2.3 v-bind.prop 优化, col.prop row.prop
* 1.2.2 td th style 优化
* 1.2.1 高亮单元格优化
* 1.2.0 props.rowClassName,td line-height
* 1.1.1 使td 背景为透明，fixed td背景继承tr背景
* 1.1.0 基于性能问题，不支持customCell传递函数，
