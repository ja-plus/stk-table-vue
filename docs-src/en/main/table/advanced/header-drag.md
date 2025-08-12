# Header Drag

* Configure the `headerDrag` property to enable column dragging for reordering.
* `columns` needs to be configured with `v-model` modifier.

```js
<StkTable
    header-drag // [!code ++]
    :columns="columns" // [!code --]
    v-model:columns="columns" // [!code ++]
></StkTable>
```

Try dragging the headers

<demo vue="advanced/header-drag/HeaderDrag.vue"></demo>

## Change Order via Event
```ts
/**
 * Header column drag event
 * ```(dragStartKey: string, targetColKey: string)```
 */
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
```

This way, you don't need to add the `v-model` modifier before `columns`; you can manually update the order of the `columns` array.

## API

### props.headerDrag

```ts
/** header drag config */
export type HeaderDragConfig<DT extends Record<string, any> = any> =
    | boolean
    | {
          /**
           * Column exchange mode
           * - none - Do nothing
           * - insert - Insert (default)
           * - swap - Swap
           */
          mode?: 'none' | 'insert' | 'swap';
          /** Columns to disable dragging */
          disabled?: (col: StkTableColumn<DT>) => boolean;
      };
```

### emit
```ts
/**
 * Header column drag event
 * ```(dragStartKey: string, targetColKey: string)```
 */
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
/**
 * Header column drag start
 * ```(dragStartKey: string)```
 */
(e: 'th-drag-start', dragStartKey: string): void;
/**
 * Header column drag drop
 * ```(targetColKey: string)```
 */
(e: 'th-drop', targetColKey: string): void;
```
