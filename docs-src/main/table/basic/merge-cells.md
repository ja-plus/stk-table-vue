# 单元格合并 <Badge type="tip" text="^0.8.0" /> 

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
<demo vue="basic/merge-cells/MergeCellsCol.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsCol.vue"></demo>

### 列合并虚拟列表 <Badge type="tip" text="^1.1.0" />
#### 简单合并
<demo vue="basic/merge-cells/MergeCellsColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/index.vue"></demo>
代码中，定义了 `mergeCells` 函数，将一行中的`colspan`字段作为合并数量。
```ts
mergeCells: ({ row }) => {
    return row.colspan ? { colspan: row.colspan } : void 0;
}
```

::: tip
横向虚拟列表模式下，合并单元格（colspan）的锚点列滚出可视区域时，会自动扩展可视列范围，保证合并单元格完整渲染。
:::

#### 不规律合并
<demo vue="basic/merge-cells/MergeCellsColVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/Special.vue"></demo>

#### 超长 colspan
当 `colspan` 非常大（如合并 150 列）时，横向虚拟滚动依然可以正确工作：合并区域与可视区相交期间，可视列范围会扩展到整个合并区域，保证合并单元格完整渲染；滚出合并区域后恢复正常渲染。
<demo vue="basic/merge-cells/MergeCellsColVirtual/HugeColspan.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/HugeColspan.vue"></demo>

## 行合并
<demo vue="basic/merge-cells/MergeCellsRow.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
如果表格数据有变化，则会重新调用 `mergeCells` 函数计算。

注意：若是**原地修改**行字段（行对象引用不变，未重新传入 `dataSource`）且 `mergeCells` 依赖这些字段，修改后需调用实例方法 [`clearMergeCellsCache`](/main/api/expose.html#clearmergecellscache) 手动失效合并结果缓存。
:::

### 行合并虚拟列表 <Badge type="tip" text="^0.8.4" /> 
#### 简单合并
<demo vue="basic/merge-cells/MergeCellsRowVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/index.vue"></demo>
代码中，定义了 `mergeCells` 函数，将一行中的`rowspan`字段作为合并数量。
```ts
function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}
```
这样就可以在数据中直接定义合并数量，而不需要在 `mergeCells` 函数中判断。
```ts
{
    id: '1-1-1', continent: 'Asia', country: 'China', province: 'Beijing',
    rowspan: { continent: 12, country: 6, }
}
```
::: tip mergeCells性能
虚拟列表模式下，会遍历**所有**的合并单元格(mergeCells函数)，对性能有一定影响。
:::

#### 不规律合并
<demo vue="basic/merge-cells/MergeCellsRowVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/Special.vue"></demo>

#### 超长 rowspan
当 `rowspan` 非常大（如 1000~2000 行）时，虚拟列表仍会渲染该合并单元格覆盖的所有行，可能导致性能下降。以下示例展示了这种极端场景。
<demo vue="basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue"></demo>

::: tip 性能优化
如果有很大的rowspan或colspan, 可以考虑用 **普通单元格** + **隐藏border** 的方式，来**模拟**合并单元格的效果。
::: 

## 行列合并 <Badge type="tip" text="^1.1.0" />
行合并（`rowspan`）与列合并（`colspan`）可以同时使用，并且兼容 `virtual` 与 `virtual-x` 虚拟滚动。
<demo vue="basic/merge-cells/MergeCellsRowColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowColVirtual/index.vue"></demo>


## 实时合并单元格
如需通过用户交互（区域选取 + 右键菜单）动态合并/拆分单元格，请参考[实时合并单元格](/demos/realtime-merge-cells)。

