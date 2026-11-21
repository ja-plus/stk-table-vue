# 可変行高仮想リスト

## 設定
| プロパティ  | 型  | デフォルト | 説明  |
| ----- | ----- | ----- | ----- |
| props.autoRowHeight | `boolean` \| `AutoRowHeightConfig<DT>` | false | 可変行高を有効にするかどうか |
| props.rowHeight | `number` | -- | `props.autoRowHeight` が `true` の場合、これは計算用の期待行の高さを表します。実際の行の高さには影響しません。 |

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

::: tip 組み込みスクロールバー（`props.scrollbar`）の有効化を推奨
可変行高モードでは各行の高さを実行時に実測するため、コンテンツの総高さ（scrollHeight）がスクロール中に変化し続けます。そのためネイティブのスクロールバーはドラッグ中にポインタとの対応を失い、**マウスに追従しない**（サムとカーソルがずれる）現象が発生します。組み込みスクロールバーの有効化を推奨します：

```vue
<StkTable virtual auto-row-height scrollbar></StkTable>
```

詳細は[スクロールバー](/ja/main/table/basic/scrollbar.md)を参照してください。
:::

## 例

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

セルの上下のパディングを制御したい場合は、CSS変数をオーバーライドすることで行うことができます：
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## 単位列リスト
[可変高さ - 仮想単位列リスト](/ja/demos/virtual-list.html#Variable%20Height) を参照してください。

## Pretextによる行高さの事前計算

行の高さがコンテンツから事前に計算可能な場合は、[@chenglou/pretext](https://github.com/chenglou/pretext)を使用して事前計算することを推奨します。これにより、ランタイムでの行高さ測定によるパフォーマンスオーバーヘッドを回避でき、スクロールバーのちらつきも防止できます。

### 仕組み

1. `auto-row-height` と `virtual` を有効にする
2. `prepare` と `layout` メソッドを使用してテキストの高さを計算
3. `setAutoHeight(rowKey, height)` で実際の行の高さを設定

::: warning 事前計算した高さは実際の描画と一致させる必要があります
`setAutoHeight` で設定した行の高さは正として扱われます（コンポーネントはその行を再測定しません）。そのため、`prepare` / `layout` に渡す**フォント、行の高さ、利用可能な幅、セルの上下 padding** は、実際に適用される CSS と一致している必要があります。どれかがずれると仮想スクロールの総高が実際のコンテンツ高さから外れ、**一番下までドラッグしても最後の行（数行）が描画されない**現象が起きます（スクロールバーは端なのにコンテンツが端に達しない）。サンプルではフォント / 行の高さ / padding を `getComputedStyle`（スタイル計算値、レイアウト不要）で取得し、テキスト幅は `ResizeObserver` の `contentRect` から取得しています。テーブルは auto レイアウトのため、列設定の `width` は下限にすぎません（サンプルの 200px 列は実際には 450px 以上に広がります）。列設定からの推測や、同期レイアウト（リフロー）を引き起こす `clientWidth` の読み取りは避けてください。これらの読み取りは初期化/サイズ変更時に一度だけ実行され、スクロールフレームには入りません。
:::

### 例

<demo vue="advanced/auto-height-virtual/PretextAutoHeight/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/PretextAutoHeight/index.vue"></demo>

### API

#### setAutoHeight(rowKey, height)

特定の行の行高さを手動で設定します。

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| rowKey | `string \| number` | 行の一意の識別子。`row-key`に対応 |
| height | `number` | 行の高さ |

::: tip ヒント
- データの読み込み完了後に呼び出す必要があります
- 設定後すぐに反映され、スクロール位置の特定とコンテンツ全体の高さ（scrollHeight）の計算に即時に参加します
- 行の高さが変更された場合は、このメソッドを再度呼び出して更新してください
- `null` または `undefined` を渡すと、設定された行の高さがクリアされ、自動測定に戻ります
:::

::: tip パフォーマンス
変高モードのスクロール位置特定は O(log n)（フェニック木インデックス）に最適化され、コンテンツ全体の高さは各行の実測/推定高さの正確な合計（行数 × デフォルト行高の推定ではなく）で算出されるため、大量データの深スクロールもスムーズです。データソースを丸ごと差し替えた場合、旧行キーの実測高さは自動的に回収されます。
:::
