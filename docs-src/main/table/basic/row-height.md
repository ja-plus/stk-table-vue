# 行高

* `props.rowHeight` 设置表体行高，默认为 `28px`。
* `props.headerRowHeight` 设置表头行高，默认为 `28px`。

## 示例
如下设置了表头行高为 `50px`，表体行高为 `40px`。
```vue
<template>
    <StkTable row-height="40" header-row-height="50"></StkTable>
</template>
```
::: info
在**普通**(非虚拟列表)模式下，若内容超过行高，则会撑开行高。

在**虚拟列表**的模式下，行高始终为设置的值。
:::

<demo vue="basic/row-height/RowHeight.vue"></demo>

在开启虚拟列表时，滚动会导致列宽度变化，是没有设置列宽导致的。


## 弹性行高
首先 `<StkTable>` 这个组件的高度必须是足够的。您可以使其处在`flex`、`grid`等弹性布局中，或将高度设为`100%`，这样做的目的是让其父元素决定它的高度，而不是子元素撑开。

其次, 令`.stk-table .stk-table-main` 的 `height` 为 `100%`

如下

```css
:deep(.stk-table .stk-table-main) {
    height: 100%;
}
```

拖动下方的高度控制器，可以看到行弹性行高。
<demo vue="basic/row-height/RowHeightFull.vue"></demo>
在做一些 **行数固定** 的表格会比较有用。

::: info
当height缩小到一定程度时，可以看到，最小高度依然由表格中的内容决定（min-content）。
:::

