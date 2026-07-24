# NumberCell 数値フォーマットセル <Badge type="tip" text="^1.0.1" />

NumberCell は組み込みの表示専用セルで、数値を読みやすいテキストにフォーマットします。小数点以下の桁数、桁区切り、接頭辞・接尾辞、符号表示、パーセント、単位の短縮（万/億、K/M/B）、および空値のプレースホルダーに対応します。市場気配値・金額・統計データの表示によく使われます。

### 基本的な使い方

`createNumberCell` ファクトリ関数で NumberCell コンポーネントを作成し、`customCell` として使用します。数値の位置揃えには、列に `align: 'right'` を設定することをおすすめします。

<demo vue="advanced/custom-cells/NumberCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/NumberCell/index.vue"></demo>

```ts
const { NumberCell } = createNumberCell({ decimals: 2 });
const NumberCellComp = NumberCell(); // ファクトリはコンポーネントのコンストラクタを返すため、一度呼び出して使用します

const columns = [
    { title: '現在値', dataIndex: 'price', align: 'right', customCell: NumberCellComp },
];
```

::: tip 列ごとに異なるフォーマット
`createNumberCell` は 1 つのフォーマットを固定します。列ごとに異なるフォーマット（価格は小数 2 桁、出来高は万単位など）が必要な場合は、複数のインスタンスを作成してください。
:::

### 設定オプション

`createNumberCell` は設定オブジェクト `CreateNumberCellOptions`（`FormatNumberOptions` と同一）を受け取ります：

| プロパティ | 型 | デフォルト | 説明 |
|---|---|---|---|
| decimals | `number` | - | 小数点以下の桁数（四捨五入）。省略時は小数を処理しません |
| thousands | `boolean` | `true` | 桁区切りを使用するか |
| prefix | `string` | `''` | 接頭辞（例：`¥`、`$`） |
| suffix | `string` | `''` | 接尾辞（例：`円`、`株`） |
| showSign | `boolean` | `false` | 正の数に `+` 記号を強制表示するか（負の数は常に `-`） |
| percent | `boolean` | `false` | パーセントモード：値 ×100 に `%` を付加。`abbr` と排他 |
| abbr | `'cn' \| 'en'` | - | 単位の短縮：`cn`=万/億、`en`=K/M/B。`percent` と排他 |
| abbrDecimals | `number` | `2` | 短縮後に保持する小数桁数 |
| placeholder | `string` | `'--'` | 空値（`null`/`undefined`/`''`）または非数値のプレースホルダー |

### 単位の短縮

`abbr` は桁数に応じて値を短縮し、単位を付加します：

- `abbr: 'cn'`：1 億以上は `億`、1 万以上は `万` で表示（例：`12345` → `1.23万`、`123456789` → `1.23億`）
- `abbr: 'en'`：`K`（千）/ `M`（百万）/ `B`（十億）で短縮（例：`1500` → `1.50K`、`2500000` → `2.50M`）

短縮後の小数桁数は `abbrDecimals`（デフォルト 2）で制御します。

### formatNumber

フォーマットロジックは純粋関数 `formatNumber(value, options)` として提供され、エクスポートされています。セル以外（合計行、ツールチップなど）でも直接再利用できます：

```ts
import { formatNumber } from 'stk-table-vue';

formatNumber(1234567.891, { decimals: 2 }); // '1,234,567.89'
formatNumber(0.0523, { percent: true, decimals: 2, showSign: true }); // '+5.23%'
```
