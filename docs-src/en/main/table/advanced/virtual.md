# Virtual List
Used to improve performance when rendering large amounts of data.

## Configuration
props:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| virtual | `boolean` | `false` | Whether to enable virtual list |
| virtualX | `boolean` | `false` | Whether to enable horizontal virtual list |
| autoResize | `boolean`\| `() => void` | `true` | Whether to automatically recalculate the visible area. If a callback function is passed, it will be called after resizing |


## Vertical Virtual List
::: warning
Row height will no longer be affected by content. For details, refer to the [Row Height](/en/main/table/basic/row-height) section.
:::
```vue
<StkTable virtual></StkTable>
```
<demo vue="advanced/virtual/VirtualY.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/virtual/VirtualY.vue"></demo>

## Horizontal Virtual List
::: warning
`StkTableColumn['width']` will have a default value of `100px`.
:::

```vue
<StkTable virtual-x></StkTable>
```
<demo vue="advanced/virtual/VirtualX.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/virtual/VirtualX.vue"></demo>

## Recalculate Visible Area autoResize
In many cases, the width and height of the virtual list area will change for various reasons, and the visible area needs to be recalculated.

The component internally uses `ResizeObserver` to monitor the size changes of `StkTable`. When the size changes, it will automatically recalculate the visible area. This function is enabled by default.


::: warning
Browsers that do not support `ResizeObserver` will use `onresize` as a fallback.
:::

In some cases, you still need to manually recalculate the visible area of the virtual list. In this case, you can call the method exposed by the component.

```ts
/**
 * Initialize the visible area of the vertical virtual list
 * @param {number} [height] The height of the virtual scroll
 */
initVirtualScrollY(height?: number)
/**
 * Initialize the visible area of the horizontal virtual list
 */
initVirtualScrollX()
/**
 * Initialize the visible area of both vertical and horizontal virtual lists
 */
initVirtualScroll(height?: number)
```
`initVirtualScroll` is equivalent to `initVirtualScrollY` + `initVirtualScrollX`

### Disable Auto Calculation
```vue
<StkTable :autoResize="false"></StkTable>
```

## Programmatic Scrolling

The `scrollTo` instance method can locate coordinates, a row by its current display `index` / `rowKey`, or the table top or bottom, with optional smooth scrolling.

```ts
tableRef.value?.scrollTo({ index: 100 })
tableRef.value?.scrollTo({ key: orderId, behavior: 'smooth' })
tableRef.value?.scrollTo({ position: 'bottom' })
```

See the [`scrollTo` instance method](/en/main/api/expose#scrollto) for the complete signatures, `debounce` behavior, and numeric-overload migration note.

## Single Column List
Please refer to [Virtual Single List](/en/demos/virtual-list.html)
