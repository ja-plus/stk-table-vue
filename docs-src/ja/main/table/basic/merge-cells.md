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
<demo vue="basic/merge-cells/MergeCellsCol.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsCol.vue"></demo>

### 列マージ仮想リスト <Badge type="tip" text="^1.1.0" />
#### シンプルマージ
<demo vue="basic/merge-cells/MergeCellsColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/index.vue"></demo>
コードでは、行の `colspan` フィールドをマージ数として使用するように `mergeCells` 関数が定義されています。
```ts
mergeCells: ({ row }) => {
    return row.colspan ? { colspan: row.colspan } : void 0;
}
```

::: tip
横方向仮想リストモードでは、マージセル（colspan）のアンカー列が可視エリア外にスクロールアウトした場合、可視列範囲を自動的に拡張し、マージセルの完全なレンダリングを保証します。
:::

#### 不規則マージ
<demo vue="basic/merge-cells/MergeCellsColVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/Special.vue"></demo>

#### 非常に大きな colspan
`colspan` が非常に大きい（例：150 列をマージ）場合でも、横方向仮想スクロールは正しく動作します：マージ範囲が可視エリアと交差している間、可視列範囲はマージ範囲全体まで拡張され、マージセルの完全なレンダリングを保証します；マージ範囲外へスクロールすると通常のレンダリングに戻ります。
<demo vue="basic/merge-cells/MergeCellsColVirtual/HugeColspan.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/HugeColspan.vue"></demo>

## 行マージ
<demo vue="basic/merge-cells/MergeCellsRow.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
テーブルデータが変更されると、`mergeCells` 関数が再度呼び出されて再計算されます。

注意：行フィールドを**その場で変更**した場合（行オブジェクトの参照が変わらず、新しい `dataSource` を再渡していない場合）かつ `mergeCells` がこれらのフィールドに依存する場合、変更後にインスタンスメソッド [`clearMergeCellsCache`](/ja/main/api/expose.html#clearmergecellscache) を呼び出して、マージ結果のキャッシュを手動で無効化する必要があります。
:::

### 仮想リストでの行マージ <Badge type="tip" text="^0.8.4" /> 
#### シンプルマージ
<demo vue="basic/merge-cells/MergeCellsRowVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/index.vue"></demo>
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
::: tip mergeCellsパフォーマンス
仮想リストモードでは、すべてのマージセル（mergeCells関数）が走査されるため、パフォーマンスにある程度の影響を与える可能性があります。
:::

#### 不規則マージ
<demo vue="basic/merge-cells/MergeCellsRowVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/Special.vue"></demo>

#### 超長 rowspan
`rowspan` が非常に大きい場合（例：1000〜2000行）、仮想リストはマージセルがカバーするすべての行をレンダリングするため、パフォーマンスが低下する可能性があります。以下の例はこの極端なシナリオを示しています。
<demo vue="basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue"></demo>

::: tip パフォーマンス最適化
rowspan や colspan が非常に大きい場合は、**通常のセル** + **border の非表示** という方法でセルマージの効果を**シミュレート**することを検討できます。
:::

## 行・列マージ <Badge type="tip" text="^1.1.0" />
行マージ（`rowspan`）と列マージ（`colspan`）は同時に使用でき、`virtual` と `virtual-x` の仮想スクロールにも対応しています。
<demo vue="basic/merge-cells/MergeCellsRowColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowColVirtual/index.vue"></demo>

## リアルタイムセル結合
ユーザー操作（範囲選択 + 右クリックメニュー）でセルを動的に結合/分割したい場合は、[リアルタイムセル結合](/ja/demos/realtime-merge-cells)をご参照ください。
