# Cell Merging <Badge type="tip" text="^0.8.0" /> 
::: warning Note
This feature is not available in **virtual list** mode.
:::

Specify cells to be merged through the `StkTableColumns['mergeCells']` function.

```ts
function mergeCells(data: {
    row: any,
    col: StkTableColumn<any>,
    rowIndex: number,
    colIndex: number
}): {
    /** Number of columns to merge */
    colspan:number, 
    /** Number of rows to merge */
    rowspan:number
}
```
Return `{ colspan: number, rowspan: number }` to indicate the number of cells to merge, `colspan` for columns and `rowspan` for rows.

## Column Merging
<demo vue="basic/merge-cells/MergeCellsCol.vue"></demo>

## Row Merging
<demo vue="basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
If the table data changes, the `mergeCells` function will be called again to recalculate.
:::
