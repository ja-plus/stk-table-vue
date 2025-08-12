# 唯一键

::: tip
Remember to specify `rowKey` in virtual list mode
:::

| props | 类型 | 默认值 |描述 |
| :--- | :--- | :--- | :--- |
| rowKey | `string` \| `(row:DataType) => string` | 数组下标 | 行唯一键 |
| colKey |  `string` \| `(col:StkTableColumn) => string` | `StkTableColumn['key']` \|`StkTableColumn['dataIndex']` | 列唯一键 |

```vue
<StkTable row-key="id"></StkTable>
<StkTable :row-key="row => row.code + row.type"></StkTable>
```

## 列唯一键 colKey
默认情况下，取 `StkTableColumn['key']` || `StkTableColumn['dataIndex']`。

如果您想要配置相同`dataIndex` 的多列，这时候就需要使用 `key` 字段来指定列的唯一键，*key是可选字段*，参考[StkTableColumn 类型定义](/main/api/stk-table-column.html)
```ts
const columns:StkTableColumn[] = [
    { key: '1', dataIndex: 'a'，title: 'A1' },
    { key: '2', dataIndex: 'a', title: 'A2' },
    { dataIndex: 'b', title: 'B' },
    { dataIndex: 'c', title: 'C' },
] 
```