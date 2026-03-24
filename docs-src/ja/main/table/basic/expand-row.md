# 行展開

列設定に `type: 'expand'` を追加して、列を組み込みの展開可能セルとして設定します。
次に、スロット `#expand="{row, col}"` を設定して展開コンテンツを設定します。

::: warning
現在、展開行が設定されている場合、仮想リストは最初のデータ項目から行の高さを累積して上部距離を計算するため、データ量が多いとパフォーマンス問題が発生する可能性があります。
:::

## 例

### 基本展開
<demo vue="basic/expand-row/ExpandRow.vue"></demo>

### カスタム展開セル
<demo vue="basic/expand-row/CustomExpandRow.vue"></demo>

## API
### StkTableColumn 設定
`StkTableColumn['type'] = 'expand'` を設定して列を展開可能にします。

```ts
const columns = [
    { type: 'expand', dataIndex: '', title: '' }
]

```

### スロット 
`#expand="{row, col}"` 展開行のコンテンツを設定します。

```html
<StkTable>
    <template #expand="{ row, col }">
        {{ row[col.dataIndex]}}
    </template>
</StkTable>
```

| スロットプロパティ | 説明 |
| ---- | ---- |
| row | 展開行のデータ |
| col | 行展開をトリガーする列 |


### props
`props.expandConfig`
| プロパティ | 型 | デフォルト | 説明 |
| ---- | ---- | ---- | ---- |
| height | number | テーブル行の高さ | 展開行の高さ |

### expose
コンポーネントメソッドを呼び出して行を展開または折りたたむことができます。
```ts
/**
 * 行を展開または折りたたみます。
 * @param rowKeyOrRow 行の一意キーまたは行オブジェクト
 * @param expand 展開するかどうか
 * @param data.col 列設定
 * @param data.silent `@toggle-row-expand` イベントの発生を防ぐためにtrueに設定、デフォルト: false
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
