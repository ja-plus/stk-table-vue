# 行高

* `props.rowHeight` 设置表体行高，默认为 28px。
* `props.headerRowHeight` 设置表头行高，默认为 28px。

## 例子
如下设置了表头行高为 50px，表体行高为 40px。
```vue
<template>
    <StkTable row-height="40" header-row-height="50"></StkTable>
</template>
```
::: info
在**普通**(非虚拟列表)模式下，若内容超过行高，则会撑开行高。

在**虚拟列表**的模式下，行高始终为设置的值。
:::

<demo vue="../../../docs-demo/basic/row-height/RowHeight.vue"></demo>

在开启虚拟列表时，滚动会导致列宽度变化，是没有设置列宽导致的。
