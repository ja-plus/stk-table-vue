# Emits 事件

## API

### sort-change

排序变更触发。defaultSort.dataIndex 找不到时，col 将返回 null。

```ts
(e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>): void;
```

### row-click

一行点击事件。

```ts
(e: 'row-click', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### current-change

选中一行触发。ev 返回 null 表示不是点击事件触发的。

```ts
(e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void;
```

### cell-selected

选中单元格触发。ev 返回 null 表示不是点击事件触发的。

```ts
(e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | undefined }): void;
```

### row-dblclick

行双击事件。

```ts
(e: 'row-dblclick', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### header-row-menu

表头右键事件。

```ts
(e: 'header-row-menu', ev: MouseEvent): void;
```

### row-menu

表体行右键点击事件。

```ts
(e: 'row-menu', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### cell-click

单元格点击事件。

```ts
(e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### cell-mouseenter

单元格鼠标进入事件。

```ts
(e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseleave

单元格鼠标移出事件。

```ts
(e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseover

单元格悬浮事件。

```ts
(e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mousedown

单元格鼠标按下事件。

```ts
(e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### header-cell-click

表头单元格点击事件。

```ts
(e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
```

### scroll

表格滚动事件。

```ts
(e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
```

### scroll-x

表格横向滚动事件。

```ts
(e: 'scroll-x', ev: Event): void;
```

### col-order-change

表头列拖动事件。

```ts
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
```

### th-drag-start

表头列拖动开始。

```ts
(e: 'th-drag-start', dragStartKey: string): void;
```

### th-drop

表头列拖动 drop。

```ts
(e: 'th-drop', targetColKey: string): void;
```

### row-order-change

行拖动事件。

```ts
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
```

### col-resize

列宽变动时触发。

```ts
(e: 'col-resize', col: StkTableColumn<DT>): void;
```

### toggle-row-expand

展开行触发。

```ts
(e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### toggle-tree-expand

点击展开树行触发。

```ts
(e: 'toggle-tree-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### area-selection-change

单元格选区变更事件。

```ts
(e: 'area-selection-change', range: AreaSelectionRange | null, data: { rows: DT[]; cols: StkTableColumn<DT>[] }): void;
```

### update:columns

v-model:columns col resize 时更新宽度。

```ts
(e: 'update:columns', cols: StkTableColumn<DT>[]): void;
```