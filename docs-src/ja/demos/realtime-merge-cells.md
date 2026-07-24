# リアルタイムセル結合

`area-selection`（範囲選択）機能で複数のセルを選択し、右クリックでメニューを開いてセルをリアルタイムに結合/分割できます。

## 実装アプローチ

1. `area-selection` 範囲選択機能を有効にし、`area-selection-change` イベントを監視して選択範囲を取得
2. `row-menu` イベント（右クリック）を監視し、カスタムコンテキストメニューを表示
3. 「セル結合」クリック時に選択範囲を `rowspan`/`colspan` 情報に変換して Map に保存
4. 列設定の `mergeCells` コールバックが Map から結合情報を読み取って返す
5. 「セル分割」クリック時に選択範囲内の結合情報を削除

<demo vue="demos/RealtimeMergeCells/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/RealtimeMergeCells/index.vue"></demo>

## コアロジック

```typescript
// 結合状態の保存 key: `${rowId}__${colIndex}` value: { rowspan, colspan }
const mergeMap = reactive(new Map<string, { rowspan: number; colspan: number }>());

// 列設定の mergeCells コールバック
function mergeCells({ row, col }) {
  const colIndex = columns.findIndex(c => c.dataIndex === col.dataIndex);
  return mergeMap.get(`${row.id}__${colIndex}`);
}

// 選択セルの結合
function mergeSelectedCells() {
  const range = selectionRanges.at(-1);
  const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
  const startRow = dataSource.value[minRow];

  // 範囲内の既存の結合情報をクリアして競合を回避
  for (let r = minRow; r <= maxRow; r++)
    for (let c = minCol; c <= maxCol; c++)
      mergeMap.delete(`${dataSource.value[r].id}__${c}`);

  // 左上のセルに結合情報を設定
  mergeMap.set(`${startRow.id}__${minCol}`, {
    rowspan: maxRow - minRow + 1,
    colspan: maxCol - minCol + 1,
  });

  // テーブルの再描画を強制
  dataSource.value = dataSource.value.slice();
}

// 選択セルの分割
function splitSelectedCells() {
  for (const range of selectionRanges) {
    const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
    for (let r = minRow; r <= maxRow; r++)
      for (let c = minCol; c <= maxCol; c++)
        mergeMap.delete(`${dataSource.value[r].id}__${c}`);
  }
  dataSource.value = dataSource.value.slice();
}
```

::: tip ヒント
1. 結合後は左上のセルの内容のみ表示されます。覆われたセルのデータはデータソースに保持され、分割後に復元されます
2. 新しい結合操作は選択範囲内の既存の結合情報を自動的にクリアし、競合を回避します
3. この方法は仮想スクロールモードでも使用できます
:::
