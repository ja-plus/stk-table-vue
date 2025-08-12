# Row Drag to Change Order

Drag rows to change their order in the table.

## Example
Use built-in drag with `StkTableColumn['type']="dragRow"`

::: warning
`dataIndex` is not specified in the column configuration for `dragRow` because the unique key is overridden by `props.colKey`, and the `StkTableColumn['key']` field is prioritized.
:::

<demo vue="advanced/row-drag/RowDrag.vue"></demo>

You can also implement it yourself using the native draggable API, here's a reference:

<demo vue="advanced/row-drag/RowDragCustom.vue"></demo>

## API

### emits
```ts
/**
 * Row drag event
 *
 * ```(dragStartKey: string, targetRowKey: string)```
 */
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
```

