# Emits

```ts
 {
    /**
     * Triggered when sorting changes. When defaultSort.dataIndex is not found, col will return null.
     *
     * ```(col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>)```
     */
    (e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>): void;
    /**
     * Click event for a row
     *
     * ```(ev: MouseEvent, row: DT, data: { rowIndex: number })```
     */
    (e: 'row-click', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
    /**
     * Triggered when a row is selected. ev returns null if not triggered by a click event
     *
     * ```(ev: MouseEvent | null, row: DT | undefined, data: { select: boolean } })```
     */
    (e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void;
    /**
     * Triggered when a cell is selected. ev returns null if not triggered by a click event
     *
     * ```(ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | null })```
     */
    (e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | undefined }): void;
    /**
     * Double click event for a row
     *
     * ```(ev: MouseEvent, row: DT, data: { rowIndex: number })```
     */
    (e: 'row-dblclick', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
    /**
     * Right click event for table header
     *
     * ```(ev: MouseEvent)```
     */
    (e: 'header-row-menu', ev: MouseEvent): void;
    /**
     * Right click event for table body row
     *
     * ```(ev: MouseEvent, row: DT, data: { rowIndex: number })```
     */
    (e: 'row-menu', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
    /**
     * Click event for a cell
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number })```
     */
    (e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
    /**
     * Mouse enter event for a cell
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * Mouse leave event for a cell
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * Mouse over event for a cell
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * Mouse down event for a cell
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number })```
     */
    (e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
    /**
     * Click event for header cell
     *
     * ```(ev: MouseEvent, col: StkTableColumn<DT>)```
     */
    (e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
    /**
     * Table scroll event
     *
     * ```(ev: Event, data: { startIndex: number; endIndex: number })```
     */
    (e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
    /**
     * Table horizontal scroll event
     *
     * ```(ev: Event)```
     */
    (e: 'scroll-x', ev: Event): void;
    /**
     * Header column drag event
     *
     * ```(dragStartKey: string, targetColKey: string)```
     */
    (e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
    /**
     * Header column drag start
     *
     * ```(dragStartKey: string)```
     */
    (e: 'th-drag-start', dragStartKey: string): void;
    /**
     * Header column drag drop
     *
     * ```(targetColKey: string)```
     */
    (e: 'th-drop', targetColKey: string): void;
    /**
     * Row drag event
     *
     * ```(dragStartKey: string, targetRowKey: string)```
     */
    (e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
    /**
     * Triggered when column width changes
     *
     *  ```(col: StkTableColumn<DT>)```
     */
    (e: 'col-resize', col: StkTableColumn<DT>): void;
    /**
     * Triggered when expanding a row
     *
     * ```( data: { expanded: boolean; row: DT; col: StkTableColumn<DT>|null })```
     */
    (e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
    /**
     * Triggered when clicking to expand a tree row
     *
     * ```( data: { expanded: boolean; row: DT; col: StkTableColumn<DT>|null })```
     */
    (e: 'toggle-tree-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
     /**
     * Area selection change event
     *
     * ```(range: AreaSelectionRange | null, data: { rows: DT[], cols: StkTableColumn<DT>[] })```
     */
    (e: 'area-selection-change', range: AreaSelectionRange | null, data: { rows: DT[], cols: StkTableColumn<DT>[] }): void;
    /**
     * Update width when v-model:columns col is resized
     */
    (e: 'update:columns', cols: StkTableColumn<DT>[]): void;
}
```
