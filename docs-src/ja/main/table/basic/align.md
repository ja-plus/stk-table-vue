# 配置

設定
| プロパティ | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| align | `"left"`\|`"center"`\|`"right"` | 'left' | テーブルボディの配置 |
| headerAlign | `"left"`\|`"center"`\|`"right"` | 'center' | テーブルヘッダーの配置 |

```ts
const columns:StkTableColumn<any>[] = [
  {
    title: '名前',
    dataIndex: 'name',
    align: 'center', // [!code ++]
    headerAlign: 'center', // [!code ++]
  },
]
```

<demo vue="basic/align/Align.vue"></demo>
