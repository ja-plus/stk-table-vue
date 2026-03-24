# 行一意キー

::: tip
仮想リストモードでは `rowKey` を指定することに気をつけてください
:::

| props | 型 | デフォルト | 説明 |
| :--- | :--- | :--- | :--- |
| rowKey | `string` \| `(row:DataType) => string` | 配列インデックス | 行の一意キー |
| colKey |  `string` \| `(col:StkTableColumn) => string` | `StkTableColumn['key']` \|`StkTableColumn['dataIndex']` | 列の一意キー |

```vue
<StkTable row-key="id"></StkTable>
<StkTable :row-key="row => row.code + row.type"></StkTable>
```

## 列一意キー colKey
デフォルトでは `StkTableColumn['key']` || `StkTableColumn['dataIndex']` を使用します。

同じ `dataIndex` を持つ複数の列を設定したい場合は、`key` フィールドを使用して列の一意キーを指定する必要があります。*keyは必須フィールドではありません*。[StkTableColumn 型定義](/ja/main/api/stk-table-column.html) を参照してください。
```ts
const columns:StkTableColumn[] = [
    { key: '1', dataIndex: 'a'，title: 'A1' },
    { key: '2', dataIndex: 'a', title: 'A2' },
    { dataIndex: 'b', title: 'B' },
    { dataIndex: 'c', title: 'C' },
] 
```
