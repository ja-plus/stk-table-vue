# Row Unique Key

::: tip
Remember to specify `rowKey` in virtual list mode
:::

| props | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| rowKey | `string` \| `(row:DataType) => string` | Array index | Row unique key |
| colKey |  `string` \| `(col:StkTableColumn) => string` | `StkTableColumn['key']` \|`StkTableColumn['dataIndex']` | Column unique key |

```vue
<StkTable row-key="id"></StkTable>
<StkTable :row-key="row => row.code + row.type"></StkTable>
```

## Column Unique Key colKey
By default, it takes `StkTableColumn['key']` || `StkTableColumn['dataIndex']`.

If you want to configure multiple columns with the same `dataIndex`, you need to use the `key` field to specify the unique key of the column. *key is an optional field*. Refer to [StkTableColumn Type Definition](/en/main/api/stk-table-column.html)
```ts
const columns:StkTableColumn[] = [
    { key: '1', dataIndex: 'a'，title: 'A1' },
    { key: '2', dataIndex: 'a', title: 'A2' },
    { dataIndex: 'b', title: 'B' },
    { dataIndex: 'c', title: 'C' },
] 
```