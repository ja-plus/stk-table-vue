# セル編集
各プロジェクトには異なる要件があるため、テーブルには組み込みのセル編集機能がありません。`customCell` を使用して自分で実装する必要があります。

簡単な実装を以下に示します：

* セルをダブルクリックして編集：`Enter` を押して保存、`Esc` を押すかブラーしてキャンセル。
* 行編集モード：編集行にチェックを入れて行編集モードに入ります。このモードでは保存するために `Enter` を押す必要がありません。

<demo vue="demos/CellEdit/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/CellEdit/index.vue"></demo>

## 実装手順
`customCell` を使用して入力をカスタマイズすることで実装されます。

::: tip change イベント
`EditCell` change イベントをイベントバス（[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) / [mitt](https://www.npmjs.com/package/mitt)）またはその他の方法介して外部に通知できます。
:::
