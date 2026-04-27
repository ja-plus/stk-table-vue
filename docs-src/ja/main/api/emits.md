# Emits

## API

### sort-change

排序が変更されたときにトリガーされます。defaultSort.dataIndexが見つからない場合、colはnullを返します。

```ts
(e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>): void;
```

### row-click

行のクリックイベント。

```ts
(e: 'row-click', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### current-change

行が選択されたときにトリガーされます。evはクリックイベントでトリガーされていない場合はnullを返します。

```ts
(e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void;
```

### cell-selected

セルが選択されたときにトリガーされます。evはクリックイベントでトリガーされていない場合はnullを返します。

```ts
(e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | undefined }): void;
```

### row-dblclick

行のダブルクリックイベント。

```ts
(e: 'row-dblclick', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### header-row-menu

テーブルヘッダーの右クリックイベント。

```ts
(e: 'header-row-menu', ev: MouseEvent): void;
```

### row-menu

テーブルボディ行の右クリックイベント。

```ts
(e: 'row-menu', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
```

### cell-click

セルのクリックイベント。

```ts
(e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### cell-mouseenter

セルのマウスエンターイベント。

```ts
(e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseleave

セルのマウスリーブイベント。

```ts
(e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mouseover

セルのマウスオーバイベント。

```ts
(e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
```

### cell-mousedown

セルのマウストラッグイベント。

```ts
(e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
```

### header-cell-click

ヘッダーセルのクリックイベント。

```ts
(e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
```

### scroll

テーブルスクロールイベント。

```ts
(e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
```

### scroll-x

テーブル横スクロールイベント。

```ts
(e: 'scroll-x', ev: Event): void;
```

### col-order-change

ヘッダー列ドラッグイベント。

```ts
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
```

### th-drag-start

ヘッダー列ドラッグ開始。

```ts
(e: 'th-drag-start', dragStartKey: string): void;
```

### th-drop

ヘッダー列ドラッグドロップ。

```ts
(e: 'th-drop', targetColKey: string): void;
```

### row-order-change

行ドラッグイベント。

```ts
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
```

### col-resize

列幅が変更されたときにトリガーされます。

```ts
(e: 'col-resize', col: StkTableColumn<DT>): void;
```

### toggle-row-expand

行を展開ときにトリガーされます。

```ts
(e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### toggle-tree-expand

ツリー行を展開するためにクリックしたときにトリガーされます。

```ts
(e: 'toggle-tree-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
```

### area-selection-change

エリア選択変更イベント。

```ts
(e: 'area-selection-change', ranges: AreaSelectionRange[]): void;
```

#### AreaSelectionRange

セル選択範囲の型。各選択範囲は `index` フィールドでテーブル内のセル範囲を表します。

```ts
type AreaSelectionRange = {
    index: {
        /** 列インデックス範囲 [開始列, 終了列]（両端を含む） */
        x: [number, number];
        /** 行インデックス範囲 [開始行, 終了行]（両端を含む） */
        y: [number, number];
    };
};
```

| フィールド | 型 | 説明 |
| --- | --- | --- |
| index.x | `[number, number]` | 選択範囲が覆う列インデックス範囲、`[開始列, 終了列]`、両端を含む |
| index.y | `[number, number]` | 選択範囲が覆う行インデックス範囲、`[開始行, 終了行]`、両端を含む |

Ctrl 複数選択または Shift 範囲選択を使用する場合、`ranges` には複数の選択範囲が含まれる可能性があります。

### update:columns

v-model:columns列のサイズ変更時に幅を更新します。

```ts
(e: 'update:columns', cols: StkTableColumn<DT>[]): void;
```
