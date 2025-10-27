# 行、单元格选中/悬浮

## demo
<demo vue="basic/row-cell-mouse-event/RowCellHoverSelect.vue"></demo>

使用 `rowActive.disabled` 可以禁用特定行的选中功能。
::: warning 注意
`rowActive.disabled` : 行将不能被点击选中。但通过 `setCurrentRow` 方法依然可选中该行。
:::

## 设置当前行
可通过调用组件方法[expose setCurrentRow](/main/api/expose.html#setcurrentrow)选中当前行

## 设置选中的单元格 
可通过调用组件方法[expose setSelectedCell](/main/api/expose.html#setselectedcell)选中当前单元格


## API
相关 Props:
| key | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| rowHover | boolean | true | 是否高亮鼠标悬浮的行 |
| rowActive | boolean \| RowActiveOption | true | 是否高亮选中的行 |
| ~~rowCurrentRevokable~~ `deprecated(v0.8.9)`请使用 `rowActive.revokable` | ~~boolean~~ | ~~true~~ | ~~当前行再次点击否可以取消 (rowActive=true)~~ |
| cellHover | boolean | false | 是否高亮鼠标悬浮的单元格 |
| cellActive | boolean | false | 是否高亮选中的单元格 |
| selectedCellRevokable | boolean | true | 单元格再次点击否可以取消选中 (cellActive=true) |

::: tip
`rowActive` 如设为false，仅隐藏组件内部的样式，在tr上依然会添加 `active` 类，方便自定义样式
:::

### RowActiveOption
| key | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| enabled | boolean | true | 是否启用行选中功能 |
| disabled | (row: DT) => boolean | () => false | 是否禁用行选中 |
| revokable | boolean | true | 是否可以取消选中 |