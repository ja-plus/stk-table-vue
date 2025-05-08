# 虚拟单列表
其实就是只有**一列**的表格，通过以下几步实现：
* `props.bordered=false` 去除表格的边框。
* `props.headless=true` 去除表头。
* `props.rowActive=false` 去除行点击高亮。
* `props.rowHover=false` 去除行hover样式。
* `props.rowHeight` 设置行高。
* `StkTableColumn['customCell']` 自定义单元格内容。


## 代码示意
```ts
<StkTable
    row-key="id"
    style="height: 400px"
    virtual // [!code ++]
    headless // [!code ++]
    :row-height="200" // [!code ++]
    :bordered="false" // [!code ++]
    :row-active="false" // [!code ++]
    :row-hover="false" // [!code ++]
    :columns="columns"
    :data-source="data"
></StkTable>
```
## 例子

### 等高
<demo vue="demos/VirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList"></demo>

### 不等高
配置 `props.autoRowHeight`即可打开自动行高。

通过`props.autoRowHeight.expectedHeight`设置期望行高。默认使用 `props.rowHeight` 作为期望行高

<demo vue="demos/VirtualList/AutoHeightVirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList/AutoHeightVirtualList"></demo>
