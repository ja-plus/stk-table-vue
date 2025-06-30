# 单元格合并 
`v0.8.0` 新增
::: warning 注意
此功能在 **虚拟列表** 模式下不可用。
:::

通过 `StkTableColumns['mergeCells']` 函数指定需要合并的单元格。

```ts
function mergeCells(data: { 
    row: any,
    col: StkTableColumn<any>,
    rowIndex: number,
    colIndex: number
}): {
    /** 列合并数量 */
    colspan:number, 
    /** 行合并数量 */
    rowspan:number
}
```
返回 `{ colspan: number, rowspan: number }` 表示合并单元格的数量，`colspan` 表示列合并数量，`rowspan` 表示行合并数量。

## 列合并
<demo vue="basic/merge-cells/MergeCellsCol.vue"></demo>

## 行合并
<demo vue="basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
如果表格数据有变化，则会重新调用 `mergeCells` 函数计算。
:::
