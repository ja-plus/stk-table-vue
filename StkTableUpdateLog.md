## 0.1.1
* fix: watch `props.fixedColShadow` 响应。 

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