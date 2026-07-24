# ChangeCell 涨跌单元格 <Badge type="tip" text="^1.0.1" />

ChangeCell 在 NumberCell 的格式化能力之上，叠加涨跌染色与箭头：按单元格值的正负自动染成上涨 / 下跌 / 平盘色，可在 A 股（涨红跌绿）与国际（涨绿跌红）两种配色间切换，并可显示 ▲/▼ 箭头。染色会自动适配表格的明暗主题。

### 基础使用

通过 `createChangeCell` 工厂函数创建 ChangeCell 组件，并将其作为 `customCell` 使用。数字对齐建议在列上设置 `align: 'right'`。

<demo vue="advanced/custom-cells/ChangeCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/ChangeCell/index.vue"></demo>

```ts
const { ChangeCell } = createChangeCell({ decimals: 2, showSign: true, arrow: true });
const ChangeCellComp = ChangeCell(); // 工厂返回组件构造函数，使用时调用一次

const columns = [
    { title: '涨跌额', dataIndex: 'change', align: 'right', customCell: ChangeCellComp },
];
```

### 配置选项

`createChangeCell` 的配置对象 `CreateChangeCellOptions` 继承全部 [NumberCell 的格式化选项](./number-cell#配置选项)，并额外提供染色与箭头相关配置：

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| colorReverse | `boolean` | `false` | 涨跌颜色反转：`false`=A股（涨红跌绿），`true`=国际（涨绿跌红） |
| arrow | `boolean` | `false` | 是否显示涨跌箭头（正数 ▲ / 负数 ▼ / 平盘与空值不显示） |
| riseColor | `string` | - | 自定义上涨颜色（传入后不受 `colorReverse` 影响） |
| fallColor | `string` | - | 自定义下跌颜色 |
| flatColor | `string` | - | 自定义平盘颜色 |

其余格式化选项（`decimals`、`showSign`、`percent`、`prefix` 等）与 NumberCell 完全一致。例如涨跌幅列常用 `{ percent: true, showSign: true, arrow: true }`。

### 涨跌配色

染色依据**单元格值的正负**：`> 0` 为上涨、`< 0` 为下跌、`= 0`（及空值）为平盘。

- 默认 `colorReverse: false` 为 A 股习惯：涨红、跌绿
- 设 `colorReverse: true` 切换为国际习惯：涨绿、跌红

默认配色通过 CSS 变量定义，并在暗色主题（`.stk-table.dark`）下自动提亮。如需完全自定义，可传入 `riseColor` / `fallColor` / `flatColor`，此时不再受 `colorReverse` 影响。
