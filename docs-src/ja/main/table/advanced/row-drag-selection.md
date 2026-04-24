# 行ドラッグ選択 <Badge type="tip" text="^0.12.0" /> <Badge type="warning" text="登録が必要" />
`props.rowDragSelection` で連続した行のドラッグ選択を有効にします。
- 上下方向のドラッグ選択をサポートします。
- `Ctrl` / `Command` を押しながら複数の非連続範囲を追加選択できます。
- カーソルが表の端に来ると自動スクロールします。
- 一括操作やエクスポート前の範囲選択に便利です。

::: tip 登録が必要です
この機能を使用する前に登録が必要です。
:::

登録方法：

```ts
import { registerFeature, useRowDragSelection } from 'stk-table-vue';

registerFeature(useRowDragSelection);
```

```js
<StkTable
    row-drag-selection // [!code ++]
></StkTable>
```

<demo vue="advanced/row-drag-selection/RowDragSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/row-drag-selection/RowDragSelection.vue"></demo>

## Emit
- [row-drag-selection-change 行ドラッグ選択の変更時に発火](/ja/main/api/emits.html#row-drag-selection-change)

## Exposed
- [getSelectedRows](/ja/main/api/expose.md#getselectedrows)
- [setSelectedRows](/ja/main/api/expose.md#setselectedrows)
- [clearSelectedRows](/ja/main/api/expose.md#clearselectedrows)
