# StkTable (Sticky Table)

Vue3 简易虚拟滚动表格。用于实时数据展示，新数据行高亮渐暗动效。

Vue2.7支持引入源码(**ts**)使用。

[Stk Table Vue 文档](https://ja-plus.github.io/stk-table-vue/)

## License
MIT
repo(求 star🌟): 
- [Github](https://github.com/ja-plus/stk-table-vue)
- [Gitee](https://gitee.com/japlus/stk-table-vue) 🇨🇳

[<span style="font-size: 16px;font-weight: bold;">Online Demo</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## Feature TODO:
* [x] 高亮行，单元格。
  - [x] 使用 `Web Animations API` 实现高亮。(`v0.3.4` 变更为默认值)
  - [x] 支持配置高亮参数（持续时间，颜色，频率）。(`v0.2.9`)
  - [x] `setHighlightDimRow`/`setHighlightCellRow`支持自定义高亮css类名。(`v0.2.9`)
* [x] 虚拟列表。
  - [x] 纵向。
  - [x] 横向（必须设置列宽）。
  - [x] 支持不定行高。（`v0.6.0`）
* [x] 列固定。
  - [x] 固定列阴影。
    - [x] 多级表头固定列阴影。
    - [x] sticky column 动态计算阴影位置。(`v0.4.0`)
* [x] 行展开。(`v0.5.0`)
* [x] 行拖动。(`v0.5.0`)
* [] 列筛选。
* [x] 斑马纹。
* [x] 拖动更改列顺序。
* [x] 拖动调整列宽。
* [x] 排序
  - [x] 支持配置 `null` | `undefined` 永远排最后。
  - [x] 支持配置 string 使用 `String.prototype.localCompare` 排序。
* [x] 多级表头。
  - [] 横向虚拟滚动。
* [x] 支持table-layout: fixed 配置。
* [x] 鼠标悬浮在表格上，键盘滚动虚拟表格。
  - [x] 键盘 `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight`/`PageUp`/ `PageDown` 按键支持。
* [] 非虚拟滚动时，大数据分批加载。
* [x] vue2.7支持（引入源码使用）。
  - [x] `props.optimizeVue2Scroll` 优化vue2虚拟滚动流畅度。(`v0.2.0`)
* [x] 支持配置序号列。`StkTableColumn['type']`。(`v0.3.0`)
* [x] `props.cellHover`单元格悬浮样式。(`v0.3.2`)
* [] 惯性滚动优化。


## Usage
> npm install stk-table-vue

```html
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref, useTemplateRef } from 'vue'
const stkTableRef = ref<InstanceType<typeof StkTable>>();
// or Vue 3.5 useTemplateRef
const stkTableRef = useTemplateRef('stkTableRef');

// highlight row
stkTableRef.value.setHighlightDimRow([rowKey]，{
  method: 'css'|'js'|'animation',// 默认 animation。
  className: 'custom-class-name', // method css 时生效。
  keyframe: [{backgroundColor:'#aaa'}, {backgroundColor: '#222'}],//same as https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
  duration: 2000,// 动画时长。
});
 // highlight cell
stkTableRef.value.setHighlightDimCell(rowKey, colDataIndex, {
  method: 'css'|'animation',
  className:'custom-class-name', // method css 时生效。
  keyframe: [{backgroundColor:'#aaa'}, {backgroundColor: '#222'}], // method animation 时生效。
  duration: 2000,// 动画时长。
});

const columns = [
  {title: 'name', dataIndex: 'name'},
  {title: 'age', dataIndex: 'age'},
  {title: 'address', dataIndex: 'address'},
];

const dataSource = [
  {id: 1, name: 'John', age: 32, address: 'New York'},
  {id: 2, name: 'Jim', age: 42, address: 'London'},
  {id: 3, name: 'Joe', age: 52, address: 'Tokyo'},
  {id: 4, name: 'Jack', age: 62, address: 'Sydney'},
  {id: 5, name: 'Jill', age: 72, address: 'Paris'},
]

</script>

<template>
    <StkTable ref='stkTableRef' row-key="id" :data-source="dataSource" :columns="columns" ></StkTable>
</template>

```

### Vue2.7 Usage
vue2.7 支持引入源码使用。依赖`less`。
```html
<script>
  import { StkTable } from 'stk-table-vue/src/StkTable/index'; // include less
</script>
```
Use `css`
```html
<script>
  import StkTable from 'stk-table-vue/src/StkTable/StkTable.vue';
  import 'stk-table-vue/lib/style.css';
</script>
```
#### webpack TS
##### webpack.config.js
```js
 rules:[{ 
  test: /\.ts$/,
  loader:'swc-loader'
 }]
```
##### .swcrc
```json
{
  "jsc":{
    "parser":{
      "syntax":"typescript",
    }
  }
}
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
  /**
   * 行高
   * - `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。
   */
  rowHeight?: number;
  /**
   * 是否可变行高
   * - 设置为 `true` 时, `props.rowHeight` 将表示为期望行高，用于计算。不再影响实际行高。
   */
  autoRowHeight?: boolean | {
    /** 预估行高(优先级高于rowHeight) */
    expectedHeight?: number | ((row: DT, index: number) => number);
  };
  /** 是否高亮鼠标悬浮的行 */
  rowHover?: boolean;
  /** 是否高亮选中的行 */
  rowActive?: boolean;
  /** 当前行再次点击否可以取消 (rowActive=true)*/
  rowCurrentRevokable?: boolean;
  /** 表头行高。default = rowHeight */
  headerRowHeight?: number | null;
  /** 虚拟滚动 */
  virtual?: boolean;
  /** x轴虚拟滚动(必须设置列宽)*/
  virtualX?: boolean;
  /** 表格列配置 */
  columns?: StkTableColumn<any>[];
  /** 表格数据源 */
  dataSource?: any[];
  /** 行唯一键 (行唯一值不能为undefined）*/
  rowKey?: UniqKeyProp;
  /** 列唯一键。默认`dataIndex`*/
  colKey?: UniqKeyProp;
  /** 空值展示文字 */
  emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string);
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
  /** 是否高亮鼠标悬浮的单元格 */
  cellHover?: boolean;
  /** 是否高亮选中的单元格 */
  cellActive?: boolean;
  /** 单元格再次点击否可以取消选中 (cellActive=true)*/
  selectedCellRevokable?: boolean;
  /** 表头是否可拖动。支持回调函数。 */
  headerDrag?:
    | boolean
    | {
        /**
         * 列交换模式
         * - none - 不做任何事
         * - insert - 插入(默认值)
         * - swap - 交换
         */
        mode?: 'none' | 'insert' | 'swap';
        /** 禁用拖动的列 */
        disabled?: (col: StkTableColumn<DT>) => boolean;
      };
  /**
   * 给行附加className<br>
   * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
   */
  rowClassName?: (row: any, i: number) => string;
  /**
   * 列宽是否可拖动(需要设置v-model:columns)<br>
   * **不要设置**列minWidth，**必须**设置width<br>
   * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
   * - 会自动更新props.columns中的with属性
   */
  colResizable?: boolean | ColResizableConfig;
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
  /** 是否展示固定列阴影。为节省性能，默认false。 */
  fixedColShadow?: boolean;
  /** 优化vue2 滚动 */
  optimizeVue2Scroll?: boolean;
  /** 排序配置 */
  sortConfig?: {
    /** 空值是否排最下面 */
    emptyToBottom: boolean,
    /** 默认排序（1.初始化时触发 2.排序方向为null时触发) */
    defaultSort?: {
        dataIndex: keyof T;
        order: Order;
    };
    /**
     * string排序是否使用 String.prototype.localCompare
     * 默认true (历史设计问题，为了兼容，默认true)
     */
    stringLocaleCompare?: boolean;
  },
  /** 隐藏头部鼠标悬浮title。可传入dataIndex数组 */
  hideHeaderTitle?: boolean | string[];
  /** 高亮配置 */
  highlightConfig?: {
    /** 高亮持续时间(s) */
    duration?: number;
    /** 高亮帧率*/
    fps?: number;
  };
  /** 序号列配置 */
  seqConfig?: {
    /** 序号列起始下标 用于适配分页 */
    startIndex?: number;
  };
  /** 展开行配置 */
  expandConfig?: {
    height?: number;
  };
  /** 行拖动配置 */
  dragRowConfig?: {
    mode?: 'none' | 'insert' | 'swap';
  };
  /**
   * 固定头，固定列实现方式。
   * [非响应式]
   * relative：固定列只能放在props.columns的两侧。
   * - 如果列宽会变动则谨慎使用。
   * - 多级表头固定列慎用
   * 
   * 低版本浏览器只能为'relative', 
   */
  cellFixedMode?: 'sticky' | 'relative';
  /**
   * 是否平滑滚动
   * - default: chrome < 85 ? true : false
   * - false: 使用 wheel 事件滚动。为了防止滚动过快导致白屏。
   * - true: 不使用 wheel 事件滚动。滚轮滚动时更加平滑。滚动过快时会白屏。
   */
  smoothScroll?: boolean;
};
```

#### Emits
```js
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

#### Slots

| slots | props | describe |
| ---- | ---- | ---- |
| `tableHeader` | `{col}` | table header slot |
| `empty` | -- | no data status |
| `expand` |  `{col, row}` | expand row |


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

### StkTableColumn 列配置
``` ts
type Sorter<T> = boolean | ((data: T[], option: { order: Order; column: any }) => T[]);
export type StkTableColumn<T extends Record<string, any>> = {
   /**
     * 用于区分相同dataIndex 的列。
     * 需要自行配置colKey="(col: StkTableColumn<any>) => col.key ?? col.dataIndex"
     */
    key?: any;
    /**
     * 列类型
     * - seq 序号列
     * - expand 展开列
     * - dragRow 拖拽列(使用sktTableRef.getTableData 获取改变后的顺序)
     */
    type?: 'seq' | 'expand' | 'dragRow';
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
    width?: string | number;
    /** 最小列宽。非x虚拟滚动生效。 */
    minWidth?: string | number;
    /** 最大列宽。非x虚拟滚动生效。 */
    maxWidth?: string | number;
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
    /**
     * 自定义 td 渲染内容。
     *
     * 组件prop入参:
     * @param props.row 一行的记录。
     * @param props.col 列配置
     * @param props.cellValue row[col.dataIndex] 的值
     * @param props.rowIndex 行索引
     * @param props.colIndex 列索引
     */
    customCell?: Component<CustomCellProps<T>> | string;
    /**
     * 自定义 th 渲染内容
     *
     * 组件prop入参:
     * @param props.col 列配置
     * @param props.rowIndex 行索引
     * @param props.colIndex 列索引
     */
    customHeaderCell?: Component<CustomHeaderCellProps<T>> | string;
    /** 二级表头 */
    children?: StkTableColumn<T>[];
    /** private 父节点引用 */
    __PARENT__?: StkTableColumn<T> | null;
    /** private 保存计算的宽度。横向虚拟滚动用。 */
    __WIDTH__?: number;
};
```


### StkTableColumn.SortConfig
```ts
/** 排序配置 */
export type SortConfig<T extends Record<string, any>> = {
    /** 空值始终排在列表末尾 */
    emptyToBottom?: boolean;
    /**
     * 默认排序（1.初始化时触发 2.排序方向为null时触发)
     * 类似onMounted时，调用setSorter点了下表头。
     */
    defaultSort?: {
        dataIndex: keyof T;
        order: Order;
        /** 是否禁止触发sort-change事件。默认false，表示触发事件。 */
        silent?: boolean;
    };
    /**
     * string排序是否使用 String.prototype.localCompare
     * 默认true ($*$应该false)
     */
    stringLocaleCompare?: boolean;
};
```

### setHighlightDimCell & setHighlightDimRow
#### setHighlightDimCell
```ts
  setHighlightDimCell(
    rowKeyValues: UniqKey[],
      option: {
        method?: 'css' | 'animation' | 'js';
        /** @deprecated use method */
        useCss?: boolean;
        className?: string;
        keyframe?: Parameters<Animatable['animate']>['0'];
        duration?: number;
    } = {},
    )
```
#### setHighlightDimRow
```ts
  setHighlightDimRow(
    rowKeyValues: UniqKey[],
      option: {
        method?: 'css' | 'animation' | 'js';  
        /** @deprecated use method */
        useCss?: boolean;
        className?: string;
        keyframe?: Parameters<Animatable['animate']>['0'];
        duration?: number;
    }
  )
```
#### option
| key |value| default |desc |
| ---- | ---- | ---- | ---- |
| method | `css` `animation` `js` | `animation` | 设置高亮方式。 |
| ~~useCss~~  `deprecated` | `boolean`| false | ~~是否使用css~~ |
| className | `string` | `highlight-row`/`highlight-cell` | 自定义 css 动画。method == 'css' 生效 |
| keyframe | `Parameters<Animatable['animate']>['0']` | ... | 自定义高亮动画。method == 'animation' 生效。 |
| duration | `number` | 2000 | 设置高亮动画持续时间ms。 method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。|

##### option.method
| `option.method`| desc |
| ---- | ---- |
| animation | animation api 实现高亮。(default) |
| css | css @keyframes 实现高亮。 |
| js | js 循环计算颜色实现高亮。 |

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
    fixed-col-shadow
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
    @scroll-x="onTableScrollX"
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
          return () => <div></div> // vue jsx
        }
      })
    },
  ]
</script>
```

## Special Example
### 鼠标悬浮表头时，不展示title
* 将 `StkTableColumn` 中的 `title` 字段置为 "" 空字符串。这样th中就没有title了。
* 使用 `StkTableColumn` 中的 `customHeaderCell` 属性中，自定义表头渲染。
### Filter过滤器
* 暂不支持。用户可以自行通过 `customHeaderCell` 实现功能。

## Performance optimization
### highlight
* 配置 `props.highlightConfig.fps` 指定高亮帧率。降低帧率有利于性能。
### relative fixed
* 配置 `props.cellFixedMode` 为 `relative` 时，将使用相对定位实现固定列与固定表头，相较于`sticky`的实现，渲染合成层更少。
* 问题：若开启了纵向虚拟滚动，不开启横向虚拟滚动，且不设置某些列宽时。如果纵向滚动导致某些列宽变化，则会导致右侧固定列计算错误。
### tr 分层
* 通过css选择器将 stk-table tbody tr 配置 `transform:translateZ(0)` 对每行 tr 进行分层。对性能有帮助。
  - 提升合成层可能导致黑底红字字体颜色发生变化。
  - 以下情况尝试开启此功能。
    - 在 `customCell` 较多且复杂时。
    - 大量 highlight 动画时。
### props.autoResize
* 手动设置为 `props.autoResize=false`。可取消监听的性能消耗。适用于宽度高度不变的表格。

### props.smoothScroll
* 高版本浏览器滚动默认有惯性。会频繁触发 `onscroll` 回调。因此 chrome > 85 默认关闭，使用 `onwheel` 代理滚动，且可防止滚动白屏。

## Tips
### props.fixedMode
* **低版本浏览器** 需要设置 `props.width`（default: width=fit-content不生效）。否则列宽不设宽度会变为0。


## Other
* `$*$` 兼容注释


### Planed removal APi
* `setHighlightDimRow` 中的 `method="js"`。观察animation Api 是否足够满足使用场景。若足够满足计划在后期移除，并且可以移除 `d3-interpolate` 依赖。
