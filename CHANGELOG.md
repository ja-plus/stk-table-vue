## 0.2.9
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
* bugfix: 修复 `props.dataSource` 为 `shallowRef` 时，高亮行异常的问题。

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