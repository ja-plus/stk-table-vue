# 列宽

## 基础
通过 
* `StkTableColumn['width']` : `number|string`
* `StkTableColumn['minWidth']` : `number|string`
* `StkTableColumn['maxWidth']` : `number|string`

设置列宽行为，传 `number` 类型时，单位是px。

也支持字符串自行指定单位，如`%`,`em`,`ch`等（**虚拟列表只支持px**）。



::: info
配置了 `StkTableColumn['width']` 就会同时配置 `StkTableColumn['minWidth']` 和 `StkTableColumn['maxWidth']`。
:::

<demo vue="basic/column-width/ColumnWidth.vue"></demo>


## 表格不铺满
组件中的表格默认会铺满整个容器。因此，如果 `所有列宽总和` < `容器宽度` 时，会根据配置列宽的比例自动调整，使表格铺满整个容器。（这也是原生表格的默认行为）

如果希望不铺满，可以通过 css 选择器 `.stk-table-main` 设置 `flex: none` 来实现。

<demo vue="basic/column-width/TableWidthFit.vue"></demo>

## 横向虚拟列表
在普通(非虚拟列表)模式与虚拟列表模式下的列宽控制行为有所不同。

在开启 `props.virtual-x`（横向虚拟列表）的情况下，**必须**要设置列宽用于计算。

::: warning
不设置列宽会将每一列的宽度设置为`100`
:::

## 固定列相关问题
如果您发现固定列的位置有问题，请检查是否设置列宽。具体移步[固定列](/main/table/basic/fixed)

