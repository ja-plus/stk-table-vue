# NumberCell 数字格式化单元格 <Badge type="tip" text="^1.0.1" />

NumberCell 是一个内置的纯展示单元格，将数值格式化为易读文本，支持小数位、千分位、前后缀、正负号、百分比、单位缩放（万/亿、K/M/B）以及空值占位。常用于金融行情、金额与统计数据展示。

### 基础使用

通过 `createNumberCell` 工厂函数创建 NumberCell 组件，并将其作为 `customCell` 使用。数字对齐建议在列上设置 `align: 'right'`。

<demo vue="advanced/custom-cells/NumberCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/NumberCell/index.vue"></demo>

```ts
const { NumberCell } = createNumberCell({ decimals: 2 });
const NumberCellComp = NumberCell(); // 工厂返回组件构造函数，使用时调用一次

const columns = [
    { title: '现价', dataIndex: 'price', align: 'right', customCell: NumberCellComp },
];
```

::: tip 不同列不同格式
每次 `createNumberCell` 固定一种格式。若各列格式不同（如价格 2 位小数、成交量按万缩放），分别创建多个实例即可。
:::

### 配置选项

`createNumberCell` 接受一个配置对象 `CreateNumberCellOptions`（等同于 `FormatNumberOptions`）：

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| decimals | `number` | - | 小数位数（四舍五入）。不传则不强制处理小数位 |
| thousands | `boolean` | `true` | 是否使用千分位分隔符 |
| prefix | `string` | `''` | 前缀，如 `¥`、`$` |
| suffix | `string` | `''` | 后缀，如 `元`、`股` |
| showSign | `boolean` | `false` | 正数是否强制显示 `+` 号（负数始终带 `-`） |
| percent | `boolean` | `false` | 百分比模式：值 ×100 并追加 `%`。与 `abbr` 互斥 |
| abbr | `'cn' \| 'en'` | - | 单位缩放：`cn`=万/亿，`en`=K/M/B。与 `percent` 互斥 |
| abbrDecimals | `number` | `2` | 缩放后保留的小数位 |
| placeholder | `string` | `'--'` | 空值（`null`/`undefined`/`''`）或非数字时的占位符 |

### 单位缩放

`abbr` 会按数量级自动缩放并追加单位：

- `abbr: 'cn'`：≥ 1 亿显示为 `亿`，≥ 1 万显示为 `万`（如 `12345` → `1.23万`、`123456789` → `1.23亿`）
- `abbr: 'en'`：按 `K`（千）/ `M`（百万）/ `B`（十亿）缩放（如 `1500` → `1.50K`、`2500000` → `2.50M`）

缩放后的小数位由 `abbrDecimals` 控制（默认 2 位）。

### formatNumber

格式化逻辑由纯函数 `formatNumber(value, options)` 提供，已一并导出。你可以在单元格之外（如表尾合计、tooltip）直接复用：

```ts
import { formatNumber } from 'stk-table-vue';

formatNumber(1234567.891, { decimals: 2 }); // '1,234,567.89'
formatNumber(0.0523, { percent: true, decimals: 2, showSign: true }); // '+5.23%'
```
