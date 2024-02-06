# StkTable (Sticky Table)

Vue3 简易虚拟滚动表格。用于实时数据展示，新数据行高亮渐暗动效。
js体积(未压缩44kb)

## Feature TODO:
* [x] 高亮行，单元格。
* [x] 横向虚拟滚动。
* [x] 列固定。
* [x] 表头拖动更改顺序。
* [x] 表头列宽拖动调整宽度。
* 多级表头。
  - [x] 支持最多`2级`表头。
  - [x] 支持更多级表头
  - [] 多级表头固定列横向滚动
  - [] 横向虚拟滚动。
* [x] 支持table-layout: fixed 配置。
* 鼠标悬浮在表格上，键盘滚动虚拟表格。
  - [x] 键盘 `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` 按键支持。
  - [x] 键盘 `PageUp`/ `PageDown` 按键支持。
* [x] 斑马纹。
* [x] 列固定阴影。
  - [] 多级表头固定列阴影。
  - [] sticky column 动态计算阴影位置。
* [] 不传row-key 时，自动按序号生成id。
* [] 列筛选。
* [] 非虚拟滚动时，大数据分批加载。

## Usage
> npm install stk-table-vue

```html
<script>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'
const stkTable = ref<InstanceType<typeof StkTable>>();
// highlight
stkTable.value.setHighlightDimRow([rowId]);// highlight row
stkTable.value.setHighlightDimCell(rowId, colId) // highlight cell
</script>

<template>
    <StkTable row-key="id" :data-source="[]" :columns="[]" />
</template>

```

## Notice
注意，组件会改动 `props.columns` 中的对象。如果多个组件 `columns` 数组元素存在引用同一个 `StkTableColumn` 对象。则考虑赋值 `columns` 前进行深拷贝。

## API
### StkTable Component 
#### Props
```ts
export type StkProps = {
  width?: string;
  /** 最小表格宽度 */
  minWidth?: string;
  /** 表格最大宽度*/
  maxWidth?: string;
  /** 斑马线条纹 */
  stripe?: boolean;
  /** 是否使用 table-layout:fixed */
  fixedMode?: boolean;
  /** 是否隐藏表头 */
  headless?: boolean;
  /** 主题，亮、暗 */
  theme?: 'light' | 'dark';
  /** 行高 */
  rowHeight?: number;
  /** 表头行高。default = rowHeight */
  headerRowHeight?: number | null;
  /** 虚拟滚动 */
  virtual?: boolean;
  /** x轴虚拟滚动 */
  virtualX?: boolean;
  /** 表格列配置 */
  columns?: StkTableColumn<any>[];
  /** 表格数据源 */
  dataSource?: any[];
  /** 行唯一键 */
  rowKey?: UniqKey;
  /** 列唯一键 */
  colKey?: UniqKey;
  /** 空值展示文字 */
  emptyCellText?: string;
  /** 暂无数据兜底高度是否撑满 */
  noDataFull?: boolean;
  /** 是否展示暂无数据 */
  showNoData?: boolean;
  /** 是否服务端排序，true则不排序数据 */
  sortRemote?: boolean;
  /** 表头是否溢出展示... */
  showHeaderOverflow?: boolean;
  /** 表体溢出是否展示... */
  showOverflow?: boolean;
  /** 是否增加行hover class */
  showTrHoverClass?: boolean;
  /** 表头是否可拖动 */
  headerDrag?: boolean;
  /**
   * 给行附加className<br>
   * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
   */
  rowClassName?: (row: any, i: number) => string;
  /**
   * 列宽是否可拖动<br>
   * **不要设置**列minWidth，**必须**设置width<br>
   * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
   */
  colResizable?: boolean;
  /** 可拖动至最小的列宽 */
  colMinWidth?: number;
  /**
   * 单元格分割线。
   * 默认横竖都有
   * "h" - 仅展示横线
   * "v" - 仅展示竖线
   * "body-v" - 仅表体展示竖线
   */
  bordered?: boolean | 'h' | 'v' | 'body-v';
  /**
   * 自动重新计算虚拟滚动高度宽度。默认true
   * [非响应式]
   * 传入方法表示resize后的回调
   */
  autoResize?: boolean | (() => void);
  /** 是否展示固定列阴影。默认不展示。 */
  fixedColShadow?: boolean;
};
```
#### Emits
```js
  {
    /**
     * 排序变更触发
     * ```(col: StkTableColumn<DT>, order: Order, data: DT[])```
     */
    (e: 'sort-change', col: StkTableColumn<DT>, order: Order, data: DT[]): void;
    /**
     * 一行点击事件
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-click', ev: MouseEvent, row: DT): void;
    /**
     * 选中一行触发。ev返回null表示不是点击事件触发的
     * ```(ev: MouseEvent | null, row: DT)```
     */
    (e: 'current-change', ev: MouseEvent | null, row: DT): void;
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
    /** v-model:columns col resize 时更新宽度*/
    (e: 'update:columns', cols: StkTableColumn<DT>[]): void;
}
```

#### Expose
```js
defineExpose({
  /** 初始化横向纵向虚拟滚动 */
  initVirtualScroll,
  /** 初始化横向虚拟滚动 */
  initVirtualScrollX,
  /** 初始化纵向虚拟滚动 */
  initVirtualScrollY,
  /** 设置当前选中行 */
  setCurrentRow,
  /** 设置高亮渐暗单元格 */
  setHighlightDimCell,
  /** 设置高亮渐暗行 */
  setHighlightDimRow,
  /** 表格排序列dataIndex */
  sortCol,
  /** 设置排序 */
  setSorter,
  /** 重置排序 */
  resetSorter,
  /** 滚动至 */
  scrollTo,
  /** 获取表格数据 */
  getTableData,
});
```

### StkTableColumn 列配置
``` ts
type Sorter<T> = boolean | ((data: T[], option: { order: Order; column: any }) => T[]);
/** 表格列配置 */
export type StkTableColumn<T extends Record<string, any>> = {
    /** 取值id */
    dataIndex: keyof T & string;
    /** 表头文字 */
    title?: string;
    /** 列内容对齐方式 */
    align?: 'right' | 'left' | 'center';
    /** 表头内容对齐方式 */
    headerAlign?: 'right' | 'left' | 'center';
    /** 筛选 */
    sorter?: Sorter<T>;
    /** 列宽。横向虚拟滚动时必须设置。 */
    width?: string;
    /** 最小列宽。非x虚拟滚动生效。 */
    minWidth?: string;
    /** 最大列宽。非x虚拟滚动生效。 */
    maxWidth?: string;
    /**th class */
    headerClassName?: string;
    /** td class */
    className?: string;
    /** 排序字段。default: dataIndex */
    sortField?: keyof T;
    /** 排序方式。按数字/字符串 */
    sortType?: 'number' | 'string';
    /** 固定列 */
    fixed?: 'left' | 'right' | null;
    /** private */ rowSpan?: number;
    /** private */ colSpan?: number;
    /**自定义 td 渲染内容 */
    customCell?: Component | VNode | CustomCellFunc<T>;
    /** 自定义 th 渲染内容 */
    customHeaderCell?: Component | VNode | CustomHeaderCellFunc<T>;
    /** 二级表头 */
    children?: StkTableColumn<T>[];
};
```


### Example
```vue
<template>
 <StkTable
    ref="stkTable"
    row-key="name"
    v-model:columns="columns"
    :style="{height:props.height}"
    theme='dark'
    height='200px'
    bordered="h"
    :row-height="28"
    :show-overflow="false"
    :show-header-overflow="false"
    :sort-remote="false"
    col-resizable
    header-drag
    virtual
    virtual-x
    no-data-full
    col-resizable
    auto-resize
    :col-min-width="10"
    :headless="false"
    :data-source="dataSource"
    @current-change="onCurrentChange"
    @row-menu="onRowMenu"
    @header-row-menu="onHeaderRowMenu"
    @row-click="onRowClick"
    @row-dblclick="onRowDblclick"
    @sort-change="handleSortChange"
    @cell-click="onCellClick"
    @header-cell-click="onHeaderCellClick"
    @scroll="onTableScroll"
    @col-order-change="onColOrderChange"
  />
</template>
<script setup>
  import { h, defineComponent } from 'vue';
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      fixed: 'left',
      width: '200px',
      headerClassName: 'my-th',
      className: 'my-td',
      sorter: true,
      customHeaderCell: function FunctionalComponent(props){
          return h(
              'span',
              { style: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap' },
              props.col.title + '(render) text-overflow,',
          );
      },
      customCell: defineComponent({
        setup(){
          //...
          return () => <div></div>
        }
      })
    },
  ]
</script>
```
