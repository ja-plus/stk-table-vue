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

### clearMergeCellsCache
清空 `mergeCells` 结果缓存并强制重新计算合并结果。

合并结果缓存仅在 `dataSource` / `columns` 变化时自动清空。如果您是**原地修改**行数据字段（行对象引用不变，如直接修改响应式行对象），且 `mergeCells` 的返回值依赖这些字段，修改后需调用此方法，否则 rowspan/colspan 仍会使用旧的缓存结果。

```ts
/**
 * 清空 mergeCells 结果缓存并强制重算合并结果
 */
clearMergeCellsCache()
```

```ts
// 原地修改行字段后，手动失效合并缓存
row.rowspan = { continent: 3 };
nextTick(() => {
    tableRef.value.clearMergeCellsCache();
});
```

::: tip
如果通过替换 `dataSource`（传入新数组）的方式更新数据，则无需调用此方法，缓存会自动清空。
:::

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
 * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。
 */
function setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {})
```

### sortCol
表格排序列 dataIndex

### sortStates
多列排序状态数组。

```ts
/**
 * 排序状态数组
 * @see SortState[]
 */
sortStates: SortState[];
```

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
滚动到指定位置。支持两种调用形式：数字重载（向后兼容）与 options 重载（可按行/列定位）。

```ts
/**
 * 设置滚动条位置
 * - 数字重载：top/left 为像素坐标，null 表示不改变对应轴，省略默认 0
 * - options 重载：每轴可传像素数字或 { index, key, px } 定位目标，省略的轴不改变位置
 */
function scrollTo(top?: number | null, left?: number | null): void;
function scrollTo(options: ScrollToOptions): void;

interface ScrollToOptions {
    /** 纵向目标：像素坐标或行定位目标 */
    top?: number | ScrollAxisTarget;
    /** 横向目标：像素坐标或列定位目标 */
    left?: number | ScrollAxisTarget;
    /** 滚动行为，同原生 ScrollToOptions.behavior，默认 'auto'（立即跳转） */
    behavior?: ScrollBehavior;
}

interface ScrollAxisTarget {
    /** 目标索引（0 起始），与 key 同时给出时 index 优先 */
    index?: number;
    /** 目标键值：top 轴为 rowKey 对应的行键值；left 轴为列的 dataIndex */
    key?: string | number;
    /** 在基准偏移之上叠加的像素偏移，可为负值。仅传 px 时基准为 0 */
    px?: number;
}
```

* 索引空间：`top` 轴的 `index` 是当前展示顺序（排序/筛选/树展开后）的行索引；`left` 轴的 `index` 是叶子列（最深层表头列）索引。
* 目标无法解析（index 越界 / key 不存在）时，该轴静默跳过，不改变位置。
* `behavior: 'smooth'` 时以动画滚动到目标位置；动画进行中发起新的 `scrollTo` 调用会取消旧动画，滚轮/触摸操作也会取消动画。

::: tip
options 重载与数字重载对「省略」的语义不同：
* options 重载：省略的轴**不改变**当前位置，`scrollTo({})` 不产生任何滚动；
* 数字重载：省略的参数默认为 **0**，`scrollTo()` 会滚动到左上角。
:::

```js
// 数字重载（向后兼容）
stkTableRef.value.scrollTo(100, 200);
stkTableRef.value.scrollTo(null, 200); // 仅改变横向

// options 重载：像素坐标
stkTableRef.value.scrollTo({ top: 100, left: 200 });

// 滚动到第 5 行（0 起始）
stkTableRef.value.scrollTo({ top: { index: 5 } });

// 滚动到 rowKey 为 'row-42' 的行
stkTableRef.value.scrollTo({ top: { key: 'row-42' } });

// 滚动到第 5 行再往下偏移 10px
stkTableRef.value.scrollTo({ top: { index: 5, px: 10 } });

// 同时定位行列，平滑滚动（列按 dataIndex 定位）
stkTableRef.value.scrollTo({ top: { index: 5 }, left: { key: 'name' }, behavior: 'smooth' });
```

### getTableData
获取表格数据，返回当前表格的排序顺序的数组

### getRowIndex
根据 rowKey 获取行索引

```ts
/**
 * 获取行索引
 * @param row rowKey 或 row 数据
 * @returns 行索引，未找到返回 -1
 */
function getRowIndex(row: UniqKey | DT): number
```

### getColumnIndex
根据 colKey 获取列索引

```ts
/**
 * 获取列索引
 * @param col colKey 或列对象
 * @returns 列索引，未找到返回 -1
 */
function getColumnIndex(col: string | StkTableColumn<DT>): number
```

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

::: tip 时机语义
设置后立即生效：该行高会立即参与滚动定位与内容总高度（scrollHeight）计算，无需等待下一次渲染测量。若行键不在当前数据中，仅暂存高度，不影响当前定位与总高。
:::

### clearAllAutoHeight
清除所有 auto-row-height 保存的高度，清除后行高回退为估算值（`expectedHeight` / `rowHeight`），内容总高度随之重新计算。

### setTreeExpand
设置树状结构展开行
```ts
/**
 * @param row rowKey / row / 或它们的数组
 * @param option.expand 是否展开，不传则根据当前状态取反
 * @param option.all 是否展开所有子节点，默认 false
 * @param option.level 展开到第几层
 * @param option.parents 将传入 row 视为目标子节点，展开/收起其所有父节点；展开时若目标行自身有子节点则一并展开，仅支持单个 rowKey / row
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean; all?: boolean; level?: number; parents?: boolean })
```
::: tip
`option.parents` 为 `true` 时，传入深层子节点的 rowKey 即可自动展开其所有父节点使该行可见，若该行自身有子节点也会一并展开（如定位行场景）。若表格当前存在筛选将某个祖先过滤掉，则展开会在该处中断。
:::

- `option.all` <Badge type="tip" text="^1.0.4" />
- `option.level` <Badge type="tip" text="^1.0.4" />
- `option.parents` <Badge type="tip" text="^1.1.0" />

### getSelectedArea
获取选中的单元格信息

```ts
function getSelectedArea(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    ranges: AreaSelectionRange[]
}
```

### setAreaSelection
设置拖选选区

```ts
/**
 * 设置拖选选区
 * @param ranges 选区范围数组
 * @param option.silent 设置 true 则不会触发 `@select-area-change`. 默认:false
 * @param option.scrollToView 设置 true 则会自动滚动到选区位置. 默认:false
 */
function setAreaSelection(ranges: AreaSelectionRange[], option?: { silent?: boolean; scrollToView?: boolean })
```

### clearSelectedArea
清除选中的单元格

### copySelectedArea
复制选区内容到剪贴板。返回复制的文本内容（TSV 格式）。

```ts
function copySelectedArea(): string
```

### setFilter(Beta)
设置筛选状态(Beta)。设置后会触发 `filter-change` 事件。

```ts
/**
 * 设置筛选状态
 * @param status 筛选状态对象，传 null 清除所有筛选
 * @param option.remote 设置 true 则不会自动触发数据过滤，适用于远程筛选场景
 * @param option.silent 设置 true 则不会触发 `filter-change` 事件，默认 false
 */
function setFilter(status: Record<UniqKey, FilterStatus> | null, option?: { remote?: boolean; silent?: boolean })
```

