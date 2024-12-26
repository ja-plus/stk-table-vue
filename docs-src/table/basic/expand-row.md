# 行展开

列配置添加 `type: 'expand'` 即可将列设置为内置的可展开单元格。
再配置 slot `#expand="{row, col}` 设置展开内容。

::: warning
目前如果配置了展开行，虚拟列表的计算顶部距离的方式，是通过从第一条数据开始，累加行高实现，在数据量过多时可能有性能问题。
:::
## 例子

### 基本展开
<demo vue="../../../docs-demo/basic/expand-row/ExpandRow.vue"></demo>

### 自定义展开单元格
<demo vue="../../../docs-demo/basic/expand-row/CustomExpandRow.vue"></demo>

## API
### StkTableColumn配置
`StkTableColumn['type'] = 'expand'` 即可将这列设置为可展开。

```ts
const columns = [
    { type: 'expand', dataIndex: '', title: '' }
]

```

### slot 
`#expand="{row, col}"` 设置展开行中的内容。

```html
<StkTable>
    <template #expand="{ row, col }">
        {{ row[col.dataIndex]}}
    </template>
</StkTable>
```

| slot-prop | 说明 |
| ---- | ---- |
| row | 展开行的数据 |
| col | 点击展开行的列 |


### props
`props.expandConfig`
| 属性 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| height | number | 表格行高 | 展开行的行高 |

### expose
可以通过示例方法调用触发展开收起行
```ts
/**
 * 展开或收起某一行
 * @param rowKeyOrRow 行唯一键或行对象
 * @param expand 是否展开
 * @param data.col 列配置
 * @param data.silent 设为true则不触发 `@toggle-row-expand`, 默认:false
 */
setRowExpand(
    rowKeyOrRow: string | undefined | DT,
    expand?: boolean,
    data?: { 
        col?: StkTableColumn<DT>; 
        silent?: boolean 
    }
):void
```
