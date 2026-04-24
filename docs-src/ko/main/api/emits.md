# Emits 이벤트

## API

### sort-change

정렬 변경 시トリ거. defaultSort.dataIndex를 찾을 수 없으면 col은 null 반환.

```ts
(e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>): void;
```

### row-click

행 클릭 이벤트.

```ts
(e: 'row-click', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### current-change

행 선택 시トリ거. ev가 null 반환되면 클릭 이벤트가 아닌 것을 의미.

```ts
(e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void;
```

### cell-selected

셀 선택 시トリ거. ev가 null 반환되면 클릭 이벤트가 아닌 것을 의미.

```ts
(e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | undefined }): void;
```

### row-dblclick

행 더블 클릭 이벤트.

```ts
(e: 'row-dblclick', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### header-row-menu

헤더 우클릭 이벤트.

```ts
(e: 'header-row-menu', ev: MouseEvent): void;
```

### row-menu

본문 행 우클릭 이벤트.

```ts
(e: 'row-menu', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### cell-click

셀 클릭 이벤트.

```ts
(e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### cell-mouseenter

셀 마우스 진입 이벤트.

```ts
(e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseleave

셀 마우스 이탈 이벤트.

```ts
(e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseover

셀 호버 이벤트.

```ts
(e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mousedown

셀 마우스 누름 이벤트.

```ts
(e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### header-cell-click

헤더 셀 클릭 이벤트.

```ts
(e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
```

### scroll

테이블 스크롤 이벤트.

```ts
(e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
```

### scroll-x

테이블 가로 스크롤 이벤트.

```ts
(e: 'scroll-x', ev: Event): void;
```

### col-order-change

헤더 열 드래그 이벤트.

```ts
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
```

### th-drag-start

헤더 열 드래그 시작.

```ts
(e: 'th-drag-start', dragStartKey: string): void;
```

### th-drop

헤더 열 드래그 드롭.

```ts
(e: 'th-drop', targetColKey: string): void;
```

### row-order-change

행 드래그 이벤트.

```ts
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
```

### col-resize

열 너비 변경 시トリ거.

```ts
(e: 'col-resize', col: StkTableColumn<DT>): void;
```

### toggle-row-expand

확장 행 트리거.

```ts
(e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### toggle-tree-expand

트리 행 확장 클릭 트리거.

```ts
(e: 'toggle-tree-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### area-selection-change

셀 선택 영역 변경 이벤트.

```ts
(e: 'area-selection-change', range: AreaSelectionRange | null, data: { rows: DT[]; cols: StkTableColumn<DT>[] }): void;
```

### row-drag-selection-change

행 드래그 선택 영역 변경 이벤트.

```ts
(e: 'row-drag-selection-change', range: RowDragSelectionRange | null, data: { rows: DT[]; ranges: RowDragSelectionRange[] }): void;
```

### update:columns

v-model:columns col resize 시 너비 업데이트.

```ts
(e: 'update:columns', cols: StkTableColumn<DT>[]): void;
```
