# 实时合并单元格

通过 `area-selection`（区域选取）功能选择多个单元格后，右键呼出菜单，可以实时合并或拆分单元格。

## 实现思路

1. 开启 `area-selection` 区域选取功能，监听 `area-selection-change` 事件获取选区范围
2. 监听 `row-menu` 事件（右键），弹出自定义上下文菜单
3. 点击"合并单元格"时，将选区范围转换为 `rowspan`/`colspan` 信息存储到 Map 中
4. 列配置的 `mergeCells` 回调从 Map 中读取合并信息并返回
5. 点击"拆分单元格"时，删除选区范围内的合并信息

<demo vue="demos/RealtimeMergeCells/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/RealtimeMergeCells/index.vue"></demo>

## 核心逻辑

```typescript
// 合并状态存储 key: `${rowId}__${colIndex}` value: { rowspan, colspan }
const mergeMap = reactive(new Map<string, { rowspan: number; colspan: number }>());

// 列配置中的 mergeCells 回调
function mergeCells({ row, col }) {
  const colIndex = columns.findIndex(c => c.dataIndex === col.dataIndex);
  return mergeMap.get(`${row.id}__${colIndex}`);
}

// 合并选中的单元格
function mergeSelectedCells() {
  const range = selectionRanges.at(-1);
  const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
  const startRow = dataSource.value[minRow];

  // 清除范围内已有的合并信息，避免冲突
  for (let r = minRow; r <= maxRow; r++)
    for (let c = minCol; c <= maxCol; c++)
      mergeMap.delete(`${dataSource.value[r].id}__${c}`);

  // 在左上角单元格设置合并信息
  mergeMap.set(`${startRow.id}__${minCol}`, {
    rowspan: maxRow - minRow + 1,
    colspan: maxCol - minCol + 1,
  });

  // 强制表格重新渲染
  dataSource.value = dataSource.value.slice();
}

// 拆分选中的单元格
function splitSelectedCells() {
  for (const range of selectionRanges) {
    const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
    for (let r = minRow; r <= maxRow; r++)
      for (let c = minCol; c <= maxCol; c++)
        mergeMap.delete(`${dataSource.value[r].id}__${c}`);
  }
  dataSource.value = dataSource.value.slice();
}
```

::: tip 提示
1. 合并后仅保留左上角单元格的内容，被覆盖的单元格数据仍保留在数据源中，拆分后会恢复显示
2. 新合并操作会自动清除选区范围内已有的合并信息，避免冲突
3. 该方案同样适用于虚拟滚动模式
:::
