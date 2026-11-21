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

::: tip Recommended: enable the built-in scrollbar (`props.scrollbar`)
In variable-height mode every row height is measured at runtime, so the content's total height (scrollHeight) keeps changing while scrolling. The native scrollbar therefore loses its pointer mapping while dragging — **the thumb stops following the cursor**. Enable the built-in scrollbar instead:

```vue
<StkTable virtual auto-row-height scrollbar></StkTable>
```

See [Scrollbar](/en/main/table/basic/scrollbar.md).
:::

## Example

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

If you want to control the top and bottom padding of cells, you can do so by overriding CSS variables:
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## Single Column List
Please refer to [Virtual Single Column List - Variable Height](/en/demos/virtual-list.html#Variable%20Height)

## Pre-calculating Row Height with Pretext

When row height can be calculated from content in advance, it is recommended to use [@chenglou/pretext](https://github.com/chenglou/pretext) for pre-calculation to avoid the performance overhead of measuring row height at runtime, and to prevent scrollbar jitter.

### How it works

1. Enable `auto-row-height` and `virtual`
2. Use `prepare` and `layout` methods to calculate text height
3. Set actual row height via `setAutoHeight(rowKey, height)`

::: warning Precomputed heights must match the real rendering
Heights written via `setAutoHeight` are authoritative (the component will not measure those rows). The **font, line height, available width, and vertical cell padding** passed to `prepare` / `layout` must therefore match the CSS that is actually applied. Any mismatch makes the virtual total height drift from the real content height: **when you drag to the bottom, the last row(s) cannot be rendered** (the scrollbar is at the end but the content is not). The example reads font / line height / padding via `getComputedStyle` (style-level values, no layout), and takes the text width from the `ResizeObserver` `contentRect`: the table uses auto layout, so a column's configured `width` is only a lower bound (the 200px column in the example actually stretches to 450px+). Do not derive it from the column config, and do not read `clientWidth`, which forces a synchronous layout. These reads run once on init/resize, never inside a scroll frame.
:::

### Example

<demo vue="advanced/auto-height-virtual/PretextAutoHeight/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/PretextAutoHeight/index.vue"></demo>

### API

#### setAutoHeight(rowKey, height)

Manually set the row height for a specific row.

| Parameter | Type | Description |
| --- | --- | --- |
| rowKey | `string \| number` | Unique identifier for the row, corresponding to `row-key` |
| height | `number` | Row height |

::: tip Tips
- Must be called after data is loaded
- Takes effect immediately, participating in scroll positioning and content height (scrollHeight) calculation right away
- If row height changes, call this method again to update
- Pass `null` or `undefined` to clear the set row height and restore auto measurement
:::

::: tip Performance
Row location in variable-height mode has been optimized to O(log n) (Fenwick tree index), and the content height is the precise sum of each row's real/estimated height (instead of row count × default row height estimation), so deep scrolling with large data sets stays smooth. When the data source is replaced entirely, measured heights of stale row keys are reclaimed automatically.
:::
