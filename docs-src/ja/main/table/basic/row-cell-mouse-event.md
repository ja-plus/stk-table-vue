# 行、セル ホバーと選択

## デモ
<demo vue="basic/row-cell-mouse-event/RowCellHoverSelect.vue"></demo>

## 行選択の無効化
`rowActive.disabled` を使用して、特定の行の選択機能を無効にできます。
::: warning 注意
`rowActive.disabled`：行はクリックで選択できません。ただし、`setCurrentRow` メソッドでこの行を選択仍然できます。
:::

## 現在の行を設定
[expose setCurrentRow](/ja/main/api/expose.html#setcurrentrow) コンポーネントメソッドを呼び出して現在行を選択できます。

## 選択セルを設定
[expose setSelectedCell](/ja/main/api/expose.html#setselectedcell) コンポーネントメソッドを呼び出して現在セルを選択できます。

## セルと行のマルチ選択
**セルのマルチ選択**または**行のマルチ選択**機能を実装する場合は、[エリア選択 (Area Selection)](/ja/main/table/advanced/area-selection.html) ドキュメントを参照してください。
エリア選択機能は、ドラッグ選択、Ctrl/Shift マルチ選択などの高度なインタラクションをサポートしています。

## API
### 関連 Props:
| キー | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| rowHover | boolean | true | ホバーした行をハイライトするかどうか |
| rowActive | boolean \| RowActiveOption | true | 選択された行をハイライトするかどうか |
| ~~rowCurrentRevokable~~ `deprecated(v0.8.9)` `rowActive.revokable` を使用してください | ~~boolean~~ | ~~true~~ | ~~選択された行を再度クリックして選択解除できるかどうか（rowActive=trueの場合）~~ |
| cellHover | boolean | false | ホバーしたセルをハイライトするかどうか |
| cellActive | boolean | false | 選択されたセルをハイライトするかどうか |
| selectedCellRevokable | boolean | true | セルを再度クリックして選択解除できるかどうか（cellActive=trueの場合） |

::: tip
`rowActive` を false に設定すると、コンポーネントの内部スタイルは非表示になりますが、カスタムスタイリングのために `tr` 要素には引き続き `active` クラスが追加されます。
:::

### RowActiveOption
| キー | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| enabled | boolean | true | 行選択機能を有効にするかどうか |
| disabled | (row: DT) => boolean | () => false | 行選択を無効にするかどうか |
| revokable | boolean | true | 選択を解除できるかどうか |
