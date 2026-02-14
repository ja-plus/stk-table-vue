# Emits

## API

### sort-change

Triggered when sorting changes. When defaultSort.dataIndex is not found, col will return null.

```ts
(e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>): void;
```

### row-click

Click event for a row.

```ts
(e: 'row-click', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### current-change

Triggered when a row is selected. ev returns null if not triggered by a click event.

```ts
(e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void;
```

### cell-selected

Triggered when a cell is selected. ev returns null if not triggered by a click event.

```ts
(e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | undefined }): void;
```

### row-dblclick

Double click event for a row.

```ts
(e: 'row-dblclick', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### header-row-menu

Right click event for table header.

```ts
(e: 'header-row-menu', ev: MouseEvent): void;
```

### row-menu

Right click event for table body row.

```ts
(e: 'row-menu', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### cell-click

Click event for a cell.

```ts
(e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### cell-mouseenter

Mouse enter event for a cell.

```ts
(e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseleave

Mouse leave event for a cell.

```ts
(e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseover

Mouse over event for a cell.

```ts
(e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mousedown

Mouse down event for a cell.

```ts
(e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### header-cell-click

Click event for header cell.

```ts
(e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
```

### scroll

Table scroll event.

```ts
(e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
```

### scroll-x

Table horizontal scroll event.

```ts
(e: 'scroll-x', ev: Event): void;
```

### col-order-change

Header column drag event.

```ts
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
```

### th-drag-start

Header column drag start.

```ts
(e: 'th-drag-start', dragStartKey: string): void;
```

### th-drop

Header column drag drop.

```ts
(e: 'th-drop', targetColKey: string): void;
```

### row-order-change

Row drag event.

```ts
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
```

### col-resize

Triggered when column width changes.

```ts
(e: 'col-resize', col: StkTableColumn<DT>): void;
```

### toggle-row-expand

Triggered when expanding a row.

```ts
(e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### toggle-tree-expand

Triggered when clicking to expand a tree row.

```ts
(e: 'toggle-tree-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### area-selection-change

Area selection change event.

```ts
(e: 'area-selection-change', range: AreaSelectionRange | null, data: { rows: DT[]; cols: StkTableColumn<DT>[] }): void;
```

### update:columns

Update width when v-model:columns col is resized.

```ts
(e: 'update:columns', cols: StkTableColumn<DT>[]): void;
```
