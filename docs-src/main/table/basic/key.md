# 唯一键

::: tip
虚拟列表模式下记得指定 `rowKey`
:::

| props | 类型 | 默认值 |描述 |
| :--- | :--- | :--- | :--- |
| rowKey | `string` \| `(row:DataType) => string` | 数组下标 | 行唯一键 |
| colKey |  `string` \| `(col:StkTableColumn) => string` | `StkTableColumn['dataIndex']` | 列唯一键 |

```vue
<StkTable row-key="id"></StkTable>
<StkTable :row-key="row => row.code + row.type"></StkTable>
```

## 列唯一键 colKey
默认情况下，优先取 `StkTableColumn['key']`作为列唯一键，如果key为空，则取 `StkTableColumn['dataIndex']`作为列唯一键。

如果您想要配置相同`dataIndex` 的多列，这时候就需要使用 `key` 字段来指定列的唯一键，*key是可选字段*，参考[StkTableColumn 类型定义](/main/api/stk-table-column.html)
```ts
const columns:StkTableColumn[] = [
    { key: '1', dataIndex: 'a'，title: 'A1' },
    { key: '2', dataIndex: 'a', title: 'A2' },
    { dataIndex: 'b', title: 'B' },
    { dataIndex: 'c', title: 'C' },
] 
```