# Slots

| スロット | props | 説明 |
| ---- | ---- | ---- |
| `tableHeader` | `{col}` | テーブルヘッダー、カスタムHeaderCellを使用することをお勧めします。バッチで複数のテーブルヘッダーをカスタマイズするときはこのスロットの方が便利です。 |
| `empty` | -- | 空データ状態 |
| `expand` |  `{col, row}` | 展開行 |
| `customBottom` | -- | テーブル下部 |

::: info
セルをカスタマイズしたい場合は、`StkTableColumn['customCell']` プロパティを使用してください。
:::

## customCell 側のスロット <Badge type="tip" text="^1.2.7" />

以下は**あなたの customCell コンポーネント**のスロットです（StkTable のトップレベルスロットではありません）。列に `customCell` を指定した場合のみ渡され、組み装飾をあなたのレイアウトで配置できるようになります：

| スロット | 組み込み内容 | 説明 |
| ---- | ---- | ---- |
| `stkFoldIcon` | 展開コントロール：矢印 / 遅延ローディング / 末端行のプレースホルダ | 描画すれば組み込みの見た目と展開時の回転がそのまま使えます。描画しない場合は自分でコントロールを描き、`data-stk-fold` を付与する必要があります |
| `stkTreeIndent` | レベル分のインデントマス + 階層ガイド線（`treeConfig.showGuide`） | `tree-node` 列用。`showGuide` 無効時はインデントのみ |
| `stkDragIcon` | 行ドラッグハンドル | `type: 'dragRow'` 列用 |

::: warning 配置の契約
これらのスロットを使う場合、セルのルート要素に `height: 100%; display: flex; align-items: center;` を指定してください。ガイド線はインデントマスの中に描画され、行の高さいっぱいに伸びるため、行高を埋める flex 行でないと線が途中で切れます。
:::

::: tip 使用例
[ファイル管理ツリー](/ja/demos/file-tree) を参照してください。
:::


## customBottom

<demo vue="api/slots/CustomBottom.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/api/slots/CustomBottom.vue"></demo>

::: tip
`customBottom` を使用してテーブル下部に要素を追加でき、`IntersectionObserver` を使用してテーブル下部にスクロールされたかどうかを監視できます。
:::
