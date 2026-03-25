# 고유 키

::: tip
가상 목록 모드에서는 반드시 `rowKey` 를 지정해야 합니다.
:::

| props | 타입 | 기본값 | 설명 |
| :--- | :--- | :--- | :--- |
| rowKey | `string` \| `(row:DataType) => string` | 배열 인덱스 | 행 고유 키 |
| colKey |  `string` \| `(col:StkTableColumn) => string` | `StkTableColumn['key']` \|`StkTableColumn['dataIndex']` | 열 고유 키 |

```vue
<StkTable row-key="id"></StkTable>
<StkTable :row-key="row => row.code + row.type"></StkTable>
```

## 열 고유 키 colKey
기본적으로 `StkTableColumn['key']` || `StkTableColumn['dataIndex']` 를 사용합니다.

동일한 `dataIndex` 를 가진 여러 열을 구성하려는 경우, 이때는 반드시 `key` 필드를 사용하여 열의 고유 키를 지정해야 합니다. *key 는 선택 사항입니다.* [StkTableColumn 타입 정의](/main/api/stk-table-column.html) 참조

```ts
const columns:StkTableColumn[] = [
    { key: '1', dataIndex: 'a', title: 'A1' },
    { key: '2', dataIndex: 'a', title: 'A2' },
    { dataIndex: 'b', title: 'B' },
    { dataIndex: 'c', title: 'C' },
] 
```
