# Column Resizable

## Configuration
* `props.colResizable` to enable column width adjustment.
* `props.columns` needs to be modified to `v-model` modifier. After adjusting column width, the value of `StkTableColumn['width']` will change directly.
* `columns` needs to be wrapped with `ref` to support responsiveness.

```js
<StkTable
    col-resizable // [!code ++]
    :columns="columns" // [!code --]
    v-model:columns="columns" // [!code ++]
></StkTable>
```

::: warning
After enabling column width adjustment, columns will not fill the container by default. The table's `width` will be set to `fit-content`. If there are any issues, please check if `props.width` is passed in.
:::

<demo vue="advanced/column-resize/ColResizable.vue"></demo>


## Change Column Width via Event
```ts
/**
 * Triggered when column width changes
 *
 *  ```(col: StkTableColumn<DT>)```
 */
(e: 'col-resize', col: StkTableColumn<DT>): void;
```

This way, you don't need to add the `v-model` modifier before `columns`; you can manually update the value of `StkTableColumn['width']`.

## Hack to Make Columns Fill Container
If you want columns to fill the container, you can manually set `props.width` to `unset`, so the table will fill the container.

Then replace `width` with `minWidth` for a column, and this column will automatically occupy the remaining width, while other columns remain at their set widths.

Disable width adjustment for the last column via `props.colResizable.disabled`.

The demo below sets minWidth for the last column.
<demo vue="advanced/column-resize/ColResizableFullHack.vue"></demo>


## API
### props.colResizable:
| type | Description |
| --- | --- | 
| boolean | Whether to enable column width adjustment |
| ColResizableConfig | Configuration |

### ColResizableConfig
| Property | Type | Default | Description |
| --- | --- | ---- | --- |
| disabled | `(col:StkTableColumn) => boolean` | -- | Whether to enable column width adjustment for specific columns |


