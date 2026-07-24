# ChangeCell 騰落セル <Badge type="tip" text="^1.0.1" />

ChangeCell は NumberCell のフォーマット機能に、騰落の色分けと矢印を追加します。セル値の符号に応じて上昇 / 下落 / 変わらずの色を自動で付け、A 株方式（上昇=赤、下落=緑）と国際方式（上昇=緑、下落=赤）を切り替えられ、▲/▼ の矢印も表示できます。色分けはテーブルのライト / ダークテーマに自動で適応します。

### 基本的な使い方

`createChangeCell` ファクトリ関数で ChangeCell コンポーネントを作成し、`customCell` として使用します。数値の位置揃えには、列に `align: 'right'` を設定することをおすすめします。

<demo vue="advanced/custom-cells/ChangeCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/ChangeCell/index.vue"></demo>

```ts
const { ChangeCell } = createChangeCell({ decimals: 2, showSign: true, arrow: true });
const ChangeCellComp = ChangeCell(); // ファクトリはコンポーネントのコンストラクタを返すため、一度呼び出して使用します

const columns = [
    { title: '騰落額', dataIndex: 'change', align: 'right', customCell: ChangeCellComp },
];
```

### 設定オプション

設定オブジェクト `CreateChangeCellOptions` は [NumberCell のフォーマットオプション](./number-cell#設定オプション) をすべて継承し、さらに色分けと矢印に関する設定を提供します：

| プロパティ | 型 | デフォルト | 説明 |
|---|---|---|---|
| colorReverse | `boolean` | `false` | 騰落色の反転：`false`=A 株（上昇赤・下落緑）、`true`=国際（上昇緑・下落赤） |
| arrow | `boolean` | `false` | 騰落矢印を表示するか（正 ▲ / 負 ▼ / 変わらず・空値は非表示） |
| riseColor | `string` | - | 上昇色のカスタム指定（設定すると `colorReverse` の影響を受けません） |
| fallColor | `string` | - | 下落色のカスタム指定 |
| flatColor | `string` | - | 変わらず色のカスタム指定 |

その他のフォーマットオプション（`decimals`、`showSign`、`percent`、`prefix` など）は NumberCell と完全に同じです。例えば騰落率の列では `{ percent: true, showSign: true, arrow: true }` がよく使われます。

### 騰落の色分け

色分けは**セル値の符号**に基づきます：`> 0` は上昇、`< 0` は下落、`= 0`（および空値）は変わらずです。

- デフォルトの `colorReverse: false` は A 株の慣習：上昇=赤、下落=緑
- `colorReverse: true` にすると国際的な慣習に切り替わります：上昇=緑、下落=赤

デフォルトの色は CSS 変数で定義され、ダークテーマ（`.stk-table.dark`）では自動的に明るく調整されます。完全にカスタマイズする場合は `riseColor` / `fallColor` / `flatColor` を渡してください。この場合 `colorReverse` より優先されます。
