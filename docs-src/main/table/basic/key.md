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
默认情况下列唯一键为 ``StkTableColumn['dataIndex']``，当 `dataIndex` 相同的时候，需要指定 `colKey`。

如果你想要配置相同`dataIndex` 的多列，这时候就需要使用 `colKey` 来指定列的唯一键，否则在虚拟列表模式下会出现渲染问题。

列配置里有可选参数，`StkTableColumns['key']` 用于处理`dataIndex` 相同情况下的唯一键。

::: warning
出于向下兼容考虑，目前版本默认是不生效的。只有重写了 `props.colKey` 才生效。如下
:::

```vue
<StkTable :colKey="col => col.key || col.dataIndex"></StkTable>
```
