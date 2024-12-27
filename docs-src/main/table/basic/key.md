# 唯一键

::: tip
虚拟列表模式下记得指定 `rowKey`
:::

| props | 类型 | 默认值 |描述 |
| :--- | :--- | :--- | :--- |
| rowKey | `string` \| `(row:DataType) => string` | 数组下标 | 行唯一键 |
| colKey |  `string` \| `(col:StkTableColumn) => string`| `StkTableColumn['dataIndex']` | 列唯一键 |

```vue
<StkTable row-key="id"></StkTable>
<StkTable :row-key="row => row.code + row.type"></StkTable>
```
