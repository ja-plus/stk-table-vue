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
<demo vue="basic/merge-cells/MergeCellsCol.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsCol.vue"></demo>

### Column Merging in Virtual List <Badge type="tip" text="^1.1.0" />
<demo vue="basic/merge-cells/MergeCellsColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/index.vue"></demo>

::: tip
In horizontal virtual list mode, when the anchor column of a merged cell (colspan) scrolls out of the viewport, the visible column range is automatically expanded so that the merged cell is fully rendered.
:::

## Row Merging
<demo vue="basic/merge-cells/MergeCellsRow.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
If the table data changes, the `mergeCells` function will be called again to recalculate.
:::

### Row Merging in Virtual List <Badge type="tip" text="^0.8.4" /> 
#### Simple Merging
<demo vue="basic/merge-cells/MergeCellsRowVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/index.vue"></demo>
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
::: tip mergeCells Performance
In virtual list mode, all merged cells (mergeCells function) will be traversed, which may have a certain impact on performance.
:::

#### Irregular Merging
<demo vue="basic/merge-cells/MergeCellsRowVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/Special.vue"></demo>

#### Huge Rowspan
When `rowspan` is very large (e.g. 1000~2000 rows), the virtual list still renders all rows covered by the merged cell, which may cause performance degradation. The following example demonstrates this extreme scenario.
<demo vue="basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue"></demo>

::: tip Performance Optimization
If you have a very large rowspan or colspan, consider using **regular cells** + **hidden borders** to **simulate** the merged cell effect.
:::

## Row and Column Merging <Badge type="tip" text="^1.1.0" />
Row merging (`rowspan`) and column merging (`colspan`) can be used together, and are compatible with `virtual` and `virtual-x` virtual scrolling.
<demo vue="basic/merge-cells/MergeCellsRowColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowColVirtual/index.vue"></demo>

## Realtime Merge Cells
If you need to dynamically merge/split cells through user interaction (area selection + context menu), refer to [Realtime Merge Cells](/en/demos/realtime-merge-cells).
