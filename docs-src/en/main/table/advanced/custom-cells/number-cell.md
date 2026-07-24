# NumberCell <Badge type="tip" text="^1.0.1" />

NumberCell is a built-in display-only cell that formats numeric values into readable text. It supports decimal places, thousands separators, prefix/suffix, sign display, percentages, unit abbreviation (万/亿, K/M/B) and empty-value placeholders. It is commonly used for market quotes, monetary amounts and statistical data.

### Basic Usage

Create a NumberCell component via the `createNumberCell` factory function and use it as `customCell`. It is recommended to set `align: 'right'` on the column for numeric alignment.

<demo vue="advanced/custom-cells/NumberCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/NumberCell/index.vue"></demo>

```ts
const { NumberCell } = createNumberCell({ decimals: 2 });
const NumberCellComp = NumberCell(); // the factory returns a component constructor; call it once

const columns = [
    { title: 'Price', dataIndex: 'price', align: 'right', customCell: NumberCellComp },
];
```

::: tip Different formats per column
Each `createNumberCell` fixes one format. If columns need different formats (e.g. price with 2 decimals, volume abbreviated by 万), just create multiple instances.
:::

### Configuration Options

`createNumberCell` accepts a configuration object `CreateNumberCellOptions` (identical to `FormatNumberOptions`):

| Property | Type | Default | Description |
|---|---|---|---|
| decimals | `number` | - | Number of decimal places (rounded). Omit to leave decimals untouched |
| thousands | `boolean` | `true` | Whether to use a thousands separator |
| prefix | `string` | `''` | Prefix, e.g. `¥`, `$` |
| suffix | `string` | `''` | Suffix, e.g. `元`, `shares` |
| showSign | `boolean` | `false` | Whether positive numbers force a `+` sign (negatives always show `-`) |
| percent | `boolean` | `false` | Percentage mode: value ×100 with a trailing `%`. Mutually exclusive with `abbr` |
| abbr | `'cn' \| 'en'` | - | Unit abbreviation: `cn`=万/亿, `en`=K/M/B. Mutually exclusive with `percent` |
| abbrDecimals | `number` | `2` | Decimal places kept after abbreviation |
| placeholder | `string` | `'--'` | Placeholder for empty (`null`/`undefined`/`''`) or non-numeric values |

### Unit Abbreviation

`abbr` scales the value by magnitude and appends a unit:

- `abbr: 'cn'`: ≥ 100M shows as `亿`, ≥ 10K shows as `万` (e.g. `12345` → `1.23万`, `123456789` → `1.23亿`)
- `abbr: 'en'`: scales by `K` (thousand) / `M` (million) / `B` (billion) (e.g. `1500` → `1.50K`, `2500000` → `2.50M`)

The decimals after abbreviation are controlled by `abbrDecimals` (default 2).

### formatNumber

The formatting logic is provided by the pure function `formatNumber(value, options)`, which is also exported. You can reuse it outside cells (e.g. footer totals, tooltips):

```ts
import { formatNumber } from 'stk-table-vue';

formatNumber(1234567.891, { decimals: 2 }); // '1,234,567.89'
formatNumber(0.0523, { percent: true, decimals: 2, showSign: true }); // '+5.23%'
```
