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
#### Simple Merging
<demo vue="basic/merge-cells/MergeCellsRowVirtual/index.vue"></demo>
In the code, the `mergeCells` function is defined to use the `rowspan` field in a row as the merge count.
```ts
function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}
```
This allows you to directly define merge counts in the data without additional judgment in the `mergeCells` function.
```ts
{
    id: '1-1-1', continent: 'Asia', country: 'China', province: 'Beijing',
    rowspan: { continent: 12, country: 6, }
}
```
::: tip Performance
In virtual list mode, all merged cells (mergeCells function) will be traversed, which may have a certain impact on performance.
:::
::: warning Note
This feature does not support **horizontal virtual list** yet.
:::

#### Irregular Merging
<demo vue="basic/merge-cells/MergeCellsRowVirtual/Special.vue"></demo>
