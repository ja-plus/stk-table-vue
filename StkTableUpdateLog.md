## 0.0.1-beta.3

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