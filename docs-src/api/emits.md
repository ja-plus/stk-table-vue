# Emits

```ts
 {
    /**
     * 排序变更触发。defaultSort.dataIndex 找不到时，col 将返回null。
     * ```(col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>)```
     */
    (e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig): void;
    /**
     * 一行点击事件
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-click', ev: MouseEvent, row: DT): void;
    /**
     * 选中一行触发。ev返回null表示不是点击事件触发的
     * ```(ev: MouseEvent | null, row: DT | undefined,, data: { select: boolean })```
     */
    (e: 'current-change', ev: MouseEvent | null, row: DT | undefined,, data: { select: boolean }): void;
    /**
     * 选中单元格触发。ev返回null表示不是点击事件触发的
     * ```(ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | null })```
     */
    (e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | null }): void;
    /**
     * 行双击事件
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-dblclick', ev: MouseEvent, row: DT): void;
    /**
     * 表头右键事件
     * ```(ev: MouseEvent)```
     */
    (e: 'header-row-menu', ev: MouseEvent): void;
    /**
     * 表体行右键点击事件
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-menu', ev: MouseEvent, row: DT): void;
    /**
     * 单元格点击事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格鼠标进入事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格鼠标移出事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格悬浮事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 表头单元格点击事件
     * ```(ev: MouseEvent, col: StkTableColumn<DT>)```
     */
    (e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
    /**
     * 表格滚动事件
     * ```(ev: Event, data: { startIndex: number; endIndex: number })```
     */
    (e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
    /**
     * 表格横向滚动事件
     * ```(ev: Event)```
     */
    (e: 'scroll-x', ev: Event): void;
    /**
     * 表头列拖动事件
     * ```(dragStartKey: string, targetColKey: string)```
     */
    (e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
    /**
     * 表头列拖动开始
     * ```(dragStartKey: string)```
     */
    (e: 'th-drag-start', dragStartKey: string): void;
    /**
     * 表头列拖动drop
     * ```(targetColKey: string)```
     */
    (e: 'th-drop', targetColKey: string): void;
    /**
     * 行拖动事件
     * ```(dragStartKey: string, targetRowKey: string)```
     */
    (e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
    /**
     * 列宽变动时触发
     */
    (e: 'col-resize', cols: StkTableColumn<DT>): void;
    /**
     * 展开行触发
     * ```( data: { expanded: boolean; row: DT; col: StkTableColumn<DT> })```
     */
    (e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
    /** 
     * v-model:columns col resize 时更新宽度
     */
    (e: 'update:columns', cols: StkTableColumn<DT>[]): void;
}
```