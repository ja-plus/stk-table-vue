# セルマージ <Badge type="tip" text="^0.8.0" /> 

`StkTableColumns['mergeCells']` 関数を通じてマージするセルを指定します。

```ts
function mergeCells(data: {
    row: any,
    col: StkTableColumn<any>,
    rowIndex: number,
    colIndex: number
}): {
    /** マージする列数 */
    colspan:number, 
    /** マージする行数 */
    rowspan:number
}
```

`{ colspan: number, rowspan: number }` を返してマージするセル数を示し、`colspan` は列用、`rowspan` は行用です。

## 列マージ
<demo vue="basic/merge-cells/MergeCellsCol.vue"></demo>

## 行マージ
<demo vue="basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
テーブルデータが変更されると、`mergeCells` 関数が再度呼び出されて再計算されます。
:::

### 仮想リストでの行マージ <Badge type="tip" text="^0.8.4" /> 
#### シンプルマージ
<demo vue="basic/merge-cells/MergeCellsRowVirtual/index.vue"></demo>
コードでは、行の `rowspan` フィールドをマージ数として使用するように `mergeCells` 関数が定義されています。
```ts
function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}
```
これにより、`mergeCells` 関数で追加の判断をせず、データに直接マージ数を定義できます。
```ts
{
    id: '1-1-1', continent: 'アジア', country: '日本', province: '東京',
    rowspan: { continent: 12, country: 6, }
}
```
::: tip パフォーマンス
仮想リストモードでは、すべてのマージセル（mergeCells関数）が走査されるため、パフォーマンスにある程度の影響を与える可能性があります。
:::
::: warning 注意
rowspanが非常に大きい場合（例如：1000行）、マージセルはそれでもカバーするすべての行をレンダリングしますTherefore, rowspan is not recommended to be very large.

この機能はまだ **横方向仮想リスト** をサポートしていません。
:::

#### 不規則マージ
<demo vue="basic/merge-cells/MergeCellsRowVirtual/Special.vue"></demo>
