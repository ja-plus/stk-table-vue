# Auto Height Virtual List

## Configuration
| Property  | Type  | Default | Description  |
| ----- | ----- | ----- | ----- |
| props.autoRowHeight | `boolean` \| `AutoRowHeightConfig<DT>` | false | Whether to enable auto row height |
| props.rowHeight | `number` | -- | When `props.autoRowHeight` is `true`, this represents the expected row height for calculation purposes. It no longer affects the actual row height. |

### AutoRowHeightConfig&lt;DT&gt;
```ts
type AutoRowHeightConfig<DT> = {
    /** Expected row height */
    expectedHeight?: number | ((row: DT) => number);
};
```

::: tip Expected Row Height
Estimated height of a row, used to calculate how many rows can fit within the current table height.
:::
::: tip Priority
`props.autoRowHeight.expectedHeight` > `props.rowHeight`
:::


## Example

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

If you want to control the top and bottom padding of cells, you can do so by overriding CSS variables:
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## Single Column List
Please refer to [Virtual Single Column List - Variable Height](/demos/virtual-list.html#不等高)
