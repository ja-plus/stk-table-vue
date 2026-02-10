# Expose 实例方法
## API
### initVirtualScroll
初始化虚拟列表可视区的行数和列数。相当于同时调用 `initVirtualScrollX` 和 `initVirtualScrollY`。

表格的 `props.autoResize` 默认为 `true`，因此在宽高变化时会自动调用该函数。

您也可以通过调用此函数，重新计算虚拟列表可视区。比如在用户手动拖动调整宽高的时候，鼠标抬起事件后调用。

参数height, 不传则默认使用表格容器的高度。如果您想多渲染几行，则可在获取容器高度后，再加上几行的高度。


```ts
/**
 * 初始化虚拟滚动参数
 * @param {number} [height] 虚拟滚动的高度
 */
initVirtualScroll(height?: number)
```

### initVirtualScrollX
初始化横向虚拟滚动列数。

```ts
/**
 * 初始化横向虚拟滚动参数
 */
initVirtualScrollX()
```

### initVirtualScrollY
初始化纵向虚拟滚动行数。

```ts
/**
 * 初始化纵向虚拟滚动参数
 * @param {number} [height] 虚拟滚动的高度
 */
initVirtualScrollY(height?: number)
```

### setCurrentRow
设置当前选中行。

```ts
/**
 * 选中一行
 * @param {string} rowKeyOrRow selected rowKey, undefined 为取消选中
 * @param {boolean} option.silent 设置 true 则不会触发 `@current-change`. 默认:false
 * @param {boolean} option.deep 设置 true 则会递归选中子行。默认:false
 */
function setCurrentRow(rowKeyOrRow: string | undefined | DT, option = { silent: false, deep: false })
```

### setSelectedCell
设置当前选中单元格 (props.cellActive=true 时生效)。

```ts
/**
 * 设置当前选中单元格 (props.cellActive=true)
 * @param row  设置高亮单元格, undefined  则为清除选中
 * @param col 列对象
 * @param option.silent 设置 true 则不会触发 `@current-change`. 默认:false
 */
function setSelectedCell(row?: DT, col?: StkTableColumn<DT>, option = { silent: false })
```

### setHighlightDimCell

设置高亮渐暗单元格。

```ts
/**
 * 高亮一个单元格。暂不支持虚拟滚动高亮状态记忆。
 * @param rowKeyValue 一行的key
 * @param colKeyValue 列key
 * @param options.method css-使用css渲染，animation-使用animation api。默认animation;
 * @param option.className 自定义css动画的class。
 * @param option.keyframe 如果自定义keyframe，则 highlightConfig.fps 将会失效。Keyframe：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats 
 * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。
 */
function setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {})
```

### setHighlightDimRow
设置高亮渐暗行。

```ts
/**
 * 高亮一行
 * @param rowKeyValues 行唯一键的数组
 * @param option.method css-使用css渲染，animation-使用animation api，js-使用js计算颜色。默认animation
 * @param option.className 自定义css动画的class。
 * @param option.keyframe 如果自定义keyframe，则 highlightConfig.fps 将会失效。Keyframe：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。。
 */
function setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {})
```

### sortCol
表格排序列dataIndex

### getSortColumns
获取排序列的信息 `{key:string,order:Order}[]`

### setSorter
```ts
/**
 * 设置表头排序状态。
 * @param colKey 列唯一键字段。如果你想要取消排序状态，请使用`resetSorter`
 * @param order 正序倒序 'asc'|'desc'|null
 * @param option.sortOption 指定排序参数。同 StkTableColumn 中排序相关字段。建议从columns中find得到。
 * @param option.sort 是否触发排序-默认true
 * @param option.silent 是否禁止触发回调-默认true
 * @param option.force 是否触发排序-默认true
 * @returns 返回当前表格数据
 */
function setSorter(
    colKey: string, 
    order: Order,
    option: { 
        sortOption?: SortOption<DT>; 
        force?: boolean; 
        silent?: boolean; 
        sort?: boolean 
    } = {}
): DT[];
```

* `option.force` 为 true 时，即使 `props.sortRemote` 为true，也会触发排序。
* `option.silent` 为 true 时，不会触发 `@sort-change` 回调。
* `option.sortOption` 的作用的是，如果 传入的 `colKey` 不在 `columns` 中，可以指定排序参数。在隐藏某一列时，但仍然要按照那一列的字段排序的情况下有用。
    - 优先级最高，如果配置了这个，则不会用 `colKey` 去找对应的列排序。

### resetSorter
重置排序状态

### scrollTo
滚动到指定位置

```ts
/**
 * 设置滚动条位置
 * @param top 设置null则不改变位置 
 * @param left 设置null则不改变位置
 */
function scrollTo(top: number | null = 0, left: number | null = 0) 
```

### getTableData
获取表格数据，返回当前表格的排序顺序的数组

### setRowExpand
设置展开行

```ts
/**
 *
 * @param rowKeyOrRow rowKey or row
 * @param expand 是否展开
 * @param data { col?: StkTableColumn<DT> }
 * @param data.silent 设置 true 则不会触发 `@toggle-row-expand`. 默认:false
 */
function setRowExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: { col?: StkTableColumn<DT>; silent?: boolean })
```

### setAutoHeight
可变行高虚拟列表下，设置指定行的 auto-row-height 保存的高度，如果行高度有变化，则可以调用此方法清除或变更行高
```ts
function setAutoHeight(rowKey: UniqKey, height?: number | null)
```

### clearAllAutoHeight
清除所有 auto-row-height 保存的高度

### setTreeExpand
设置树状结构展开行
```ts
/**
 * @param row rowKey or row or row
 * @param option.expand 不传则根据当前状态取反
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean })
```

### getSelectedCells 
获取选中的单元格信息

```ts
function getSelectedCells(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    range: CellSelectionRange
}
```

### clearSelectedCells
清除选中的单元格