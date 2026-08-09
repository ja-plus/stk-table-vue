## Tips

### ヘッダーセルホバー時のタイトルを無効化
* `StkTableColumn` の `title` フィールドを空の文字列（""）に設定します。これにより、th要素からタイトルが削除されます。
* `StkTableColumn` の `customHeaderCell` プロパティを使用してヘッダーセルレンダリングをカスタマイズします。

### フィルター
* ~~まだサポートされていません。`customHeaderCell` を通じてこの機能を実装できます。~~
* 組み込みのカスタムフィルターコンポーネント。[FilterCell](/main/table/advanced/custom-cells/filter-cell)

### props.fixedMode
* **古いブラウザ**の場合、低バージョンのブラウザを使用している場合、CSSで `.stk-table-main` の幅を `unset` に設定する必要があります。そうしないと、列の幅が0になります。

### customCellの幅制御
* `customCell` は `td` の子要素であるため、`customCell` 内の flex 幅制御が機能しない場合は、`StkTableColumn['width']` に小さい幅を設定して flex コンテナを計算させることができます。そうしないと、`flex` コンテナは子要素のテキスト（max-content）の幅を計算します。
