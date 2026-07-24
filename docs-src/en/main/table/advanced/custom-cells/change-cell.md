# ChangeCell <Badge type="tip" text="^1.0.1" />

On top of NumberCell's formatting, ChangeCell adds rise/fall coloring and arrows: it colors the value as rise / fall / flat based on its sign, can switch between A-share coloring (rise red, fall green) and international coloring (rise green, fall red), and can show ▲/▼ arrows. The coloring adapts automatically to the table's light/dark theme.

### Basic Usage

Create a ChangeCell component via the `createChangeCell` factory function and use it as `customCell`. It is recommended to set `align: 'right'` on the column for numeric alignment.

<demo vue="advanced/custom-cells/ChangeCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/ChangeCell/index.vue"></demo>

```ts
const { ChangeCell } = createChangeCell({ decimals: 2, showSign: true, arrow: true });
const ChangeCellComp = ChangeCell(); // the factory returns a component constructor; call it once

const columns = [
    { title: 'Change', dataIndex: 'change', align: 'right', customCell: ChangeCellComp },
];
```

### Configuration Options

The configuration object `CreateChangeCellOptions` inherits all of [NumberCell's formatting options](./number-cell#configuration-options) and additionally provides coloring and arrow settings:

| Property | Type | Default | Description |
|---|---|---|---|
| colorReverse | `boolean` | `false` | Reverse rise/fall colors: `false`=A-share (rise red, fall green), `true`=international (rise green, fall red) |
| arrow | `boolean` | `false` | Whether to show the rise/fall arrow (positive ▲ / negative ▼ / flat and empty hidden) |
| riseColor | `string` | - | Custom rise color (unaffected by `colorReverse` once set) |
| fallColor | `string` | - | Custom fall color |
| flatColor | `string` | - | Custom flat color |

The remaining formatting options (`decimals`, `showSign`, `percent`, `prefix`, etc.) are exactly the same as NumberCell. For example, a change-percentage column commonly uses `{ percent: true, showSign: true, arrow: true }`.

### Rise/Fall Coloring

Coloring is based on the **sign of the cell value**: `> 0` is a rise, `< 0` is a fall, `= 0` (and empty values) is flat.

- The default `colorReverse: false` follows the A-share convention: rise red, fall green
- Setting `colorReverse: true` switches to the international convention: rise green, fall red

Default colors are defined via CSS variables and are automatically brightened under the dark theme (`.stk-table.dark`). For full customization, pass `riseColor` / `fallColor` / `flatColor`, which then take precedence over `colorReverse`.
