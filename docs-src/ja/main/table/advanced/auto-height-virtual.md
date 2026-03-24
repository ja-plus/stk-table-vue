# 可変行高仮想リスト

## 設定
| プロパティ  | 型  | デフォルト | 説明  |
| ----- | ----- | ----- | ----- |
| props.autoRowHeight | `boolean` \| `AutoRowHeightConfig<DT>` | false | 可変行高を有効にするかどうか |
| props.rowHeight | `number` | -- | `props.autoRowHeight` が `true` の場合、これは計算目的の両側行の高さを表します。実際の行の高さにもはや影響しません。 |

### AutoRowHeightConfig&lt;DT&gt;
```ts
type AutoRowHeightConfig<DT> = {
    /** 期待される行の高さ */
    expectedHeight?: number | ((row: DT) => number);
};
```

::: tip 期待される行の高さ
現在のテーブル高さに収まる行数を計算するために使用される行の推定高さ。
:::
::: tip 優先順位
`props.autoRowHeight.expectedHeight` > `props.rowHeight`
:::


## 例

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

セルの上下のパディングを制御したい場合は、CSS変数をオーバーライドすることで行うことができます：
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## 単位列リスト
[可変高さ - 仮想単位列リスト](/ja/demos/virtual-list.html#Variable%20Height) を参照してください。
