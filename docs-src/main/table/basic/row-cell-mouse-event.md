# 行、单元格选中/悬浮

## demo
<demo vue="basic/row-cell-mouse-event/RowCellHoverSelect.vue"></demo>

## 设置当前行
可通过调用组件方法[expose setCurrentRow](/main/api/expose.html#setcurrentrow)选中当前行

## 设置选中的单元格 
可通过调用组件方法[expose setSelectedCell](/main/api/expose.html#setselectedcell)选中当前单元格


## API
相关 Props:
| key | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| rowHover | boolean | true | 是否高亮鼠标悬浮的行 |
| rowActive | boolean | true | 是否高亮选中的行 |
| rowCurrentRevokable | boolean | true | 当前行再次点击否可以取消 (rowActive=true) |
| cellHover | boolean | false | 是否高亮鼠标悬浮的单元格 |
| cellActive | boolean | false | 是否高亮选中的单元格 |
| selectedCellRevokable | boolean | true | 单元格再次点击否可以取消选中 (cellActive=true) |