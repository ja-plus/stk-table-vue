# 遅延ロード実装

非常に大きなデータセット（例：数百万件）を扱う場合、すべてのデータを一度にレンダリングするとパフォーマンスの問題が発生します。`StkTable`には仮想スクロールの最適化機能が内置されていますが、すべてのデータを一度にメモリにロードすると、依然として大量のリソースを消費します。

テーブルの`scroll`イベントをリッスンすることで、現在の表示領域の`startIndex`と`endIndex`を取得でき、必要に応じてデータを読み込む遅延ロードソリューションを実現できます。

## 実装アプローチ

1. 大きなプレースホルダー配列を作成し、`dataSource`に渡す
2. `scroll`イベントをリッスンして`startIndex`と`endIndex`を取得
3. スクロール位置に基づいてロードが必要なデータページを計算
4. APIからオンデマンドでデータを取得し、対応する位置に填充

<demo vue="demos/LazyLoad/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/LazyLoad/index.vue"></demo>

## 実装詳細

### コアロジック

```typescript
// 総データ数が100,000件、1ページ100件と仮定
const totalCount = 100000;
const pageSize = 100;

// プレースホルダー配列を作成
const tableData = ref<Array<Record<string, any>>>(
  Array(totalCount).fill(null).map((_, i) => ({ id: i + 1, __placeholder: true }))
);

// スクロールイベントをリッスン
function onScroll(ev: Event, data: { startIndex: number; endIndex: number }) {
  const { startIndex, endIndex } = data;
  
  // ロードするページ範囲を計算
  const startPage = Math.floor(startIndex / pageSize);
  const endPage = Math.floor(endIndex / pageSize);
  
  // 範囲内のデータページをロード
  for (let page = startPage; page <= endPage; page++) {
    loadDataPage(page);
  }
}

// 特定のページのデータをロード
async function loadDataPage(page: number) {
  // すでにロードされているか確認
  const startIndex = page * pageSize;
  if (!tableData.value[startIndex]?.__placeholder) return;
  
  // APIからデータを取得
  const response = await fetchData(page, pageSize);
  
  // 対応する位置に填充
  response.forEach((item, index) => {
    tableData.value[startIndex + index] = item;
  });
}
```

::: tip 境界ケースの処理
スクロール位置がちょうど2ページの間にがある場合（例：`startIndex=95, endIndex=105`）、両方のページを同時にロードする必要があります（ページ0とページ1）。これにより、表示領域内のデータが完全に確実に表示されます。
:::

::: warning 注意事項
1. 仮想スクロールがスクロール高さを正しく計算できるよう、プレースホルダー配列を事前に割り当てる必要があります
2. ロード済みのデータは適切にキャッシュし、重複リクエストを回避してください
3. ユーザーエクスペリエンスを向上させるため、ローディング状態のインジケーターを追加することを検討してください
:::
