# Cell Merging <Badge type="tip" text="^0.8.0" /> 

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

### Row Merging in Virtual List <Badge type="tip" text="^0.8.4" /> 
<demo vue="basic/merge-cells/MergeCellsRowVirtual/index.vue"></demo>
::: tip Performance
In virtual list mode, all merged cells (mergeCells function) will be traversed, which may have a certain impact on performance.
:::
::: warning Note
This feature does not support **horizontal virtual list** yet.
:::
