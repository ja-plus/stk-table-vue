# Espose

```ts
defineExpose({
  /** 初始化横向纵向虚拟滚动 */
  initVirtualScroll,
  /** 初始化横向虚拟滚动 */
  initVirtualScrollX,
  /** 初始化纵向虚拟滚动 */
  initVirtualScrollY,
  /** 设置当前选中行 */
  setCurrentRow,
  /** 设置当前选中单元格 (props.cellActive=true)*/
  setSelectedCell,
  /** 设置高亮渐暗单元格 */
  setHighlightDimCell,
  /** 设置高亮渐暗行 */
  setHighlightDimRow,
  /** 表格排序列dataIndex */
  sortCol,
  /** 获取当前排序状态 */
  getSortColumns,
  /** 设置排序 */
  setSorter,
  /** 重置排序 */
  resetSorter,
  /** 滚动至 */
  scrollTo,
  /** 获取表格数据 */
  getTableData,
  /** 设置展开行*/
  setRowExpand,
  /** 设置指定行的 auto-row-height 保存的高度，如果行高度有变化，则可以调用此方法清除或变更行高 */
  setAutoHeight,
  /** 清除所有 auto-row-height 保存的高度 */
  clearAllAutoHeight,
});
```