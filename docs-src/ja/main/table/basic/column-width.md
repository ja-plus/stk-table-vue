# 列幅

## 基本
以下の方法で列幅の動作を設定します：
* `StkTableColumn['width']` : `number|string`
* `StkTableColumn['minWidth']` : `number|string`
* `StkTableColumn['maxWidth']` : `number|string`

`number` 型を渡すと、单位はpxです。

`%`、`em`、`ch` などのカスタム単位を持つ文字列値もサポートされています（**仮想リストはpxのみサポート**）。


::: info
`StkTableColumn['width']` を設定すると、`StkTableColumn['minWidth']` と `StkTableColumn['maxWidth']` も設定されます。
:::

<demo vue="basic/column-width/ColumnWidth.vue"></demo>


## テーブルが全幅ではない場合
コンポーネント内のテーブルはコンテナ全体を埋めます。したがって、`すべての列幅の合計` < `コンテナ幅` の場合、テーブルがコンテナ全体を埋めるように、設定された列幅の比率に従って自動調整されます。（これはネイティブテーブルのデフォルトの動作でもあります）

コンテナを埋めたくない場合は、`.stk-table-main` を `flex: none` に設定できます。

<demo vue="basic/column-width/TableWidthFit.vue"></demo>

## 横方向仮想リスト
列幅制御の動作は、通常の（非仮想リスト）モードと仮想リストモードで異なります。

`props.virtual-x`（横方向仮想リスト）が有効になっている場合、計算のために列幅を**設定する必要があります**。

::: warning
列幅を設定しないと、各列の幅が `100` に設定されます
:::

## 固定列関連の問題
固定列の位置が正しくない場合は、列幅が設定されているかどうかを確認してください。詳細については、[固定列](/ja/main/table/basic/fixed) を参照してください。
