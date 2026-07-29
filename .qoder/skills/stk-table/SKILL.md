---
name: stk-table
description: StkTable Vue 虚拟滚动表格组件的完整 API 参考与使用指南。当需要生成、修改 StkTable 相关代码，或回答 StkTable 的用法、Props、Events、Slots、Methods、类型定义等问题时使用。
---

# StkTable Vue 组件 - AI 使用指南

> 本文档专为 AI 编码助手设计，帮助 AI 理解并生成 StkTable 相关代码。

## 快速概览

- **包名**: `stk-table-vue`
- **框架**: Vue 3 / Vue 2.7
- **用途**: 高性能虚拟滚动表格组件
- **TypeScript**: 完整类型支持

## 安装与引入

```bash
npm install stk-table-vue
```

```typescript
import { StkTable } from 'stk-table-vue';
import type { StkTableColumn, Order, SortConfig, SortState, SortOption } from 'stk-table-vue';
import 'stk-table-vue/lib/style.css'; // 引入样式，一般在 main.js(全局) 引入一次。
```

其他可导出项：

```typescript
// 工具函数
import { tableSort, insertToOrderedArray, strCompare, binarySearch, formatNumber } from 'stk-table-vue';
// 按需特性（Area Selection 需先注册再使用）
import { useAreaSelection, registerFeature } from 'stk-table-vue';
// 内置自定义单元格工厂函数
import { createFilterCell, createEditableCell, createCheckboxCell, createNumberCell, createChangeCell } from 'stk-table-vue';
import type {
  FilterStatus, FilterOption, CreateFilterCellOption,
  CreateEditableCellOptions, createCheckboxCellOptions,
  CreateNumberCellOptions, CreateChangeCellOptions, FormatNumberOptions,
} from 'stk-table-vue';
```

***

## 最简示例

```vue
<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { StkTable } from 'stk-table-vue';
import type { StkTableColumn } from 'stk-table-vue';
import 'stk-table-vue/lib/style.css';

interface RowData {
  id: number;
  name: string;
  age: number;
}

const columns: StkTableColumn<RowData>[] = [
  { title: '名称', dataIndex: 'name', width: 150 },
  { title: '年龄', dataIndex: 'age', width: 100 },
];

const dataSource = ref<RowData[]>([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
]);
</script>
```

***

## Props 完整参考

### 基础样式

| Prop                 | 类型                                              | 默认值       | 说明                                                    |
| -------------------- | ----------------------------------------------- | --------- | ----------------------------------------------------- |
| `width`              | `string`                                        | `''`      | 表格宽度                                                  |
| `stripe`             | `boolean`                                       | `false`   | 斑马线条纹                                                 |
| `theme`              | `'light' \| 'dark'`                             | `'light'` | 主题                                                    |
| `bordered`           | `boolean \| 'h' \| 'v' \| 'body-v' \| 'body-h'` | `true`    | 边框线。`'h'`仅横线,`'v'`仅竖线,`'body-v'`仅表体竖线,`'body-h'`仅表体横线 |
| `showOverflow`       | `boolean`                                       | `false`   | 表体溢出省略号                                               |
| `showHeaderOverflow` | `boolean`                                       | `false`   | 表头溢出省略号                                               |
| `fixedMode`          | `boolean`                                       | `false`   | 是否 table-layout:fixed                                 |
| `headless`           | `boolean`                                       | `false`   | 隐藏表头                                                  |

### 行高

| Prop              | 类型                                   | 默认值     | 说明                                |
| ----------------- | ------------------------------------ | ------- | --------------------------------- |
| `rowHeight`       | `number`                             | `28`    | 行高(px)。`autoRowHeight=true`时为期望行高 |
| `autoRowHeight`   | `boolean \| AutoRowHeightConfig<DT>` | `false` | 可变行高                              |
| `headerRowHeight` | `number \| string`                   | `28`    | 表头行高                              |
| `footerRowHeight` | `number \| string`                   | `28`    | 表尾行高                              |

### 行交互

| Prop               | 类型                               | 默认值                                  | 说明             |
| ------------------ | -------------------------------- | ------------------------------------ | -------------- |
| `rowHover`         | `boolean`                        | `true`                               | hover 高亮行      |
| `rowActive`        | `boolean \| RowActiveOption<DT>` | `{ enabled: true, disabled: ()=>false, revokable: true }` | 点击选中行高亮 |
| `rowClassName`     | `(row: DT, i: number) => string \| undefined` | `() => ''`                | 行 className 回调 |
| `showTrHoverClass` | `boolean`                        | `false`                              | 行 hover class  |

### 单元格交互

| Prop                    | 类型        | 默认值     | 说明          |
| ----------------------- | --------- | ------- | ----------- |
| `cellHover`             | `boolean` | `false` | hover 高亮单元格 |
| `cellActive`            | `boolean` | `false` | 点击选中高亮单元格   |
| `selectedCellRevokable` | `boolean` | `true`  | 再次点击取消选中    |

### 数据与列

| Prop            | 类型                                | 默认值         | 说明                                   |
| --------------- | --------------------------------- | ----------- | ------------------------------------ |
| `columns`       | `StkTableColumn<DT>[]`            | `[]`        | **必填**。列配置数组                         |
| `dataSource`    | `DT[]`                            | `[]`        | **必填**。数据源                           |
| `rowKey`        | `string \| ((row: DT) => string)` | `''`        | **推荐**。行唯一键                          |
| `colKey`        | `string \| ((col) => string)`     | `undefined` | 列唯一键，默认取 `col.key` 或 `col.dataIndex` |
| `emptyCellText` | `string \| ((option: {row, col}) => string)` | `'--'` | 空值展示文字                      |

### 虚拟滚动

| Prop         | 类型                        | 默认值     | 说明             |
| ------------ | ------------------------- | ------- | -------------- |
| `virtual`    | `boolean`                 | `false` | Y 轴虚拟滚动        |
| `virtualX`   | `boolean`                 | `false` | X 轴虚拟滚动（横向虚拟滚动按需设置列宽） |
| `autoResize` | `boolean \| (() => void)` | `true`  | 自动重算虚拟滚动尺寸（非响应式） |

### 固定列

| Prop             | 类型                       | 默认值        | 说明      |
| ---------------- | ------------------------ | ---------- | ------- |
| `cellFixedMode`  | `'sticky' \| 'relative'` | `'sticky'` | 固定列实现方式(非响应式) |
| `fixedColShadow` | `boolean`                | `false`    | 固定列阴影   |

### 排序

| Prop              | 类型                    | 默认值     | 说明          |
| ----------------- | --------------------- | ------- | ----------- |
| `sortRemote`      | `boolean`             | `false` | 服务端排序(不排数据) |
| `sortConfig`      | `SortConfig<DT>`      | `{ emptyToBottom: false, stringLocaleCompare: false, sortChildren: false }` | 排序配置 |
| `hideHeaderTitle` | `boolean \| string[]` | `false` | 隐藏表头 title  |

### 拖拽与选区

| Prop            | 类型                                  | 默认值     | 说明                                      |
| --------------- | ----------------------------------- | ------- | --------------------------------------- |
| `headerDrag`    | `boolean \| HeaderDragConfig<DT>`   | `false` | 表头拖拽排序(需 `v-model:columns`)             |
| `colResizable`  | `boolean \| ColResizableConfig<DT>` | `false` | 列宽可拖动(需 `v-model:columns` + 设列 `width`) |
| `colMinWidth`   | `number`                            | `10`    | 拖动最小列宽                                  |
| `areaSelection` | `boolean \| AreaSelectionConfig`    | `false` | 单元格拖拽选区                                 |

### 特殊功能

| Prop              | 类型                                    | 默认值                      | 说明                     |
| ----------------- | ------------------------------------- | ------------------------ | ---------------------- |
| `seqConfig`       | `{ startIndex?: number }`             | `{}`                     | 序号列配置                  |
| `expandConfig`    | `{ height?: number }`                 | `{}`                     | 展开行配置(虚拟模式下需指定 height) |
| `dragRowConfig`   | `DragRowConfig`                       | `{}`                     | 行拖动配置                  |
| `treeConfig`      | `TreeConfig`                          | `{}`                     | 树形配置                   |
| `highlightConfig` | `HighlightConfig`                     | `{}`                     | 高亮配置(duration 秒)       |
| `footerData`      | `DT[]`                                | `[]`                     | 底部合计行数据                |
| `footerConfig`    | `FooterConfig`                        | `{ position: 'bottom' }` | 底部配置                   |
| `scrollRowByRow`  | `boolean \| 'scrollbar'`              | `false`                  | 整行滚动                   |
| `smoothScroll`    | `boolean`                             | `chrome < 85 ? true : false` | 平滑滚动（低版本浏览器默认true）   |
| `scrollbar`       | `boolean \| ScrollbarOptions`         | `false`                  | 自定义滚动条                 |
| `showNoData`      | `boolean`                             | `true`                   | 显示暂无数据                 |
| `noDataFull`      | `boolean`                             | `false`                  | 暂无数据撑满高度               |
| `experimental`    | `ExperimentalConfig`                  | `{}`                     | 实验性功能                  |

***

## Column 配置 (`StkTableColumn<T>`)

```typescript
type StkTableColumn<T> = {
  // 基础
  dataIndex: keyof T & string;         // 必填，取值字段名
  title?: string;                       // 表头文字
  key?: any;                            // 列唯一键，默认取 dataIndex
  type?: 'seq' | 'expand' | 'dragRow' | 'tree-node'; // 特殊列类型
  hidden?: boolean;                     // 隐藏列

  // 尺寸
  width?: string | number;             // 列宽（横向虚拟滚动按需设置，未设置时默认100）
  minWidth?: string | number;          // 最小列宽
  maxWidth?: string | number;          // 最大列宽

  // 对齐
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';

  // 样式
  className?: string;
  headerClassName?: string;

  // 排序
  sorter?: boolean | ((data: T[], option: { order: Order; column: any }) => T[]);
  sortField?: keyof T;                 // 排序字段(默认 dataIndex)
  sortType?: 'number' | 'string';
  sortConfig?: Omit<SortConfig<T>, 'defaultSort'>;

  // 固定
  fixed?: 'left' | 'right' | null;

  // 自定义渲染（返回 VNode，使用 h 函数或 Vue SFC 组件）
  customCell?: CustomCell<CustomCellProps<T>, T>;
  customHeaderCell?: CustomCell<CustomHeaderCellProps<T>, T>;
  customFooterCell?: CustomCell<CustomFooterCellProps<T>, T>;

  // 多级表头
  children?: StkTableColumn<T>[];

  // 合并单元格
  mergeCells?: (data: {
    row: T; col: StkTableColumn<T>;
    rowIndex: number; colIndex: number;
  }) => { rowspan?: number; colspan?: number } | undefined;
};
```

### 特殊列类型说明

| type          | 用途         | dataIndex |
| ------------- | ---------- | --------- |
| `'seq'`       | 序号列        | 设为 `''`   |
| `'expand'`    | 展开行        | 设为 `''`   |
| `'dragRow'`   | 行拖拽把手      | 设为 `''`   |
| `'tree-node'` | 树节点(带展开箭头) | 对应的数据字段   |

***

## Events 事件

| 事件名                     | 回调参数                             | 说明                 |
| ----------------------- | -------------------------------- | ------------------ |
| `sort-change`           | `(col: StkTableColumn<DT> \| null, order: Order, data: DT[], sortConfig: SortConfig<DT>)` | 排序变化 |
| `row-click`             | `(ev: MouseEvent, row: DT, { rowIndex: number })`        | 行点击                |
| `row-dblclick`          | `(ev: MouseEvent, row: DT, { rowIndex: number })`        | 行双击                |
| `current-change`        | `(ev: MouseEvent \| null, row: DT \| undefined, { select: boolean })` | 选中行变化 |
| `cell-selected`         | `(ev: MouseEvent \| null, { select: boolean, row: DT \| undefined, col: StkTableColumn<DT> \| undefined })` | 选中单元格变化 |
| `cell-click`            | `(ev: MouseEvent, row: DT, col: StkTableColumn<DT>, { rowIndex: number })` | 单元格点击 |
| `cell-mouseenter`       | `(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)`    | 单元格鼠标进入            |
| `cell-mouseleave`       | `(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)`    | 单元格鼠标离开            |
| `cell-mouseover`        | `(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)`    | 单元格悬浮              |
| `cell-mousedown`        | `(ev: MouseEvent, row: DT, col: StkTableColumn<DT>, { rowIndex: number })` | 单元格鼠标按下 |
| `header-cell-click`     | `(ev: MouseEvent, col: StkTableColumn<DT>)`             | 表头单元格点击            |
| `header-row-menu`       | `(ev: MouseEvent)`                                     | 表头右键               |
| `row-menu`              | `(ev: MouseEvent, row: DT, { rowIndex: number })`       | 行右键                |
| `scroll`                | `(ev: Event, { startIndex: number, endIndex: number })` | 纵向滚动               |
| `scroll-x`              | `(ev: Event)`                                          | 横向滚动               |
| `col-order-change`      | `(dragStartKey: string, targetColKey: string)`          | 列拖拽排序完成            |
| `th-drag-start`         | `(dragStartKey: string)`                                | 列拖拽开始              |
| `th-drop`               | `(targetColKey: string)`                                | 列拖拽放下              |
| `row-order-change`      | `(dragStartKey: string, targetRowKey: string)`          | 行拖拽排序完成            |
| `col-resize`            | `(col: StkTableColumn<DT>)`                             | 列宽变化               |
| `toggle-row-expand`     | `({ expanded: boolean, row: DT, col: StkTableColumn<DT> \| null })` | 行展开/收起 |
| `toggle-tree-expand`    | `({ expanded: boolean, row: DT, col: StkTableColumn<DT> \| null })` | 树节点展开/收起 |
| `area-selection-change` | `(ranges: AreaSelectionRange[])`                        | 选区变化               |
| `filter-change`         | `(status: Record<UniqKey, FilterStatus>)`               | 筛选变化(Beta)         |
| `update:columns`        | `(cols: StkTableColumn<DT>[])`                          | v-model:columns 更新 |

***

## Slots 插槽

| 插槽名            | 作用域            | 说明        |
| -------------- | -------------- | --------- |
| `tableHeader`  | `{ col: StkTableColumn<DT> }` | 自定义表头单元格 |
| `empty`        | 无              | 自定义空数据展示  |
| `expand`       | `{ row: DT, col: StkTableColumn<DT> }` | 展开行内容 |
| `customBottom` | 无              | 表格底部自定义区域 |

***

## Exposed Methods（ref 方法）

通过 `ref` 获取组件实例后调用：

```typescript
const tableRef = ref<InstanceType<typeof StkTable>>();
```

| 方法                    | 签名                                        | 说明                                                 |
| --------------------- | ----------------------------------------- | -------------------------------------------------- |
| `initVirtualScroll`   | `() => void`                              | 重算虚拟滚动宽高                                           |
| `initVirtualScrollX`  | `() => void`                              | 重算虚拟滚动宽度                                           |
| `initVirtualScrollY`  | `(height?: number) => void`               | 重算虚拟滚动高度，可指定高度                                    |
| `setCurrentRow`       | `(rowKeyOrRow: string \| undefined \| DT, option?: { silent?: boolean; deep?: boolean }) => void` | 选中行 |
| `setSelectedCell`     | `(row?: DT, col?: StkTableColumn<DT>, option?: { silent?: boolean }) => void` | 选中单元格(cellActive=true) |
| `setHighlightDimCell` | `(rowKey: UniqKey, colKey: string, option?: HighlightDimCellOption) => void` | 高亮闪烁单元格 |
| `setHighlightDimRow`  | `(rowKeys: UniqKey[], option?: HighlightDimRowOption) => void` | 高亮闪烁行 |
| `setSorter`           | `(colKey: string, order: Order, option?: { append?: boolean; force?: boolean; silent?: boolean; sort?: boolean; sortOption?: SortOption<DT> }) => DT[]` | 设排序，返回排序后数据。option.append=true 时多列排序追加 |
| `resetSorter`         | `() => void`                              | 重置排序                                               |
| `getSortColumns`      | `() => { key: keyof DT \| undefined, order: Order }[]` | 获取排序信息                                  |
| `scrollTo`            | `(top?: number \| null, left?: number \| null) => void` | 滚动到位置(null=不变)                              |
| `getTableData`        | `() => DT[]`                              | 获取排序/过滤后数据                                         |
| `getRowIndex`         | `(row: DT) => number`                     | 获取行索引                                              |
| `getColumnIndex`      | `(column: PrivateStkTableColumn<DT>) => number` | 获取列索引                                        |
| `setRowExpand`        | `(rowKeyOrRow: string \| undefined \| DT, expand?: boolean \| null, data?: { col?: StkTableColumn<DT>; silent?: boolean }) => void` | 设置行展开 |
| `setAutoHeight`       | `(rowKey: UniqKey, height?: number \| null) => void` | 更新可变行高，传 null 则清除该行行高                          |
| `clearAllAutoHeight`  | `() => void`                              | 清除所有行高缓存                                           |
| `setTreeExpand`       | `(row: (UniqKey \| DT) \| (UniqKey \| DT)[], option?: { expand?: boolean }) => void` | 设置树节点展开 |
| `getSelectedArea`     | `() => { rows: DT[], cols: StkTableColumn<DT>[], ranges: AreaSelectionRange[] } \| null` | 获取选区信息 |
| `setAreaSelection`    | `(ranges?: AreaSelectionSetterRange<DT>, option?: { silent?: boolean; scrollToView?: boolean }) => AreaSelectionRange[]` | 设置选区范围 |
| `clearSelectedArea`   | `() => void`                              | 清空选区                                               |
| `copySelectedArea`    | `() => string`                            | 复制选区到剪贴板，返回复制文本                                    |
| `setFilter`           | `(status: Record<UniqKey, FilterStatus> \| null, option?: { remote?: boolean }) => void` | 设置筛选 |
| `sortCol`             | `ComputedRef<keyof DT \| undefined>`      | 当前排序列 dataIndex(属性)                                 |
| `sortStates`          | `Ref<SortState<DT>[]>`                    | 排序状态数组(属性)                                          |

***

## 类型定义速查

```typescript
type Order = null | 'asc' | 'desc';

type DefaultSortConfig<T> = {
  key?: StkTableColumn<T>['key'];
  dataIndex: StkTableColumn<T>['dataIndex'];
  order: Order;
  sortField?: StkTableColumn<T>['sortField'];
  sortType?: StkTableColumn<T>['sortType'];
  sorter?: StkTableColumn<T>['sorter'];
  silent?: boolean;
};

type SortConfig<T> = {
  defaultSort?: DefaultSortConfig<T>;
  emptyToBottom?: boolean;          // 默认 false
  stringLocaleCompare?: boolean;     // 默认 false
  sortChildren?: boolean;            // 默认 false
  multiSort?: boolean;               // 默认 false
  multiSortLimit?: number;           // 默认 3
};

type SortState<T> = {
  key?: any;
  dataIndex: keyof T & string;
  sortField?: keyof T;
  sortType?: 'number' | 'string';
  order: Order;
};

type SortOption<T> = Pick<StkTableColumn<T>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>;

type RowActiveOption<T> = {
  enabled?: boolean;
  disabled?: (row: T) => boolean;
  revokable?: boolean;
};

type TreeConfig = {
  defaultExpandAll?: boolean;
  defaultExpandKeys?: (string | number)[];
  defaultExpandLevel?: number;
};

type AreaSelectionConfig<T> = {
  enabled?: boolean;                  // 默认 true（当 areaSelection 为 true 时）
  formatCellForClipboard?: (row: T, col: StkTableColumn<T>, rawValue: any) => string;
  keyboard?: boolean;                 // 默认 false
  ctrl?: boolean;                     // 默认 true
  shift?: boolean;                    // 默认 true
  highlight?: {
    cell?: boolean;                   // 默认 true
    row?: boolean;                    // 默认 false
  };
};

type AreaSelectionRange = {
  index: {
    x: [number, number];              // @deprecated
    y: [number, number];              // @deprecated
    begin: { row: number; col: number };
    end: { row: number; col: number };
  };
};

type AreaSelectionSetterRange<T> = {
  begin: { row: number | T; col?: number | StkTableColumn<T> };
  end?: { row: number | T; col?: number | StkTableColumn<T> };
};

type HeaderDragConfig<T> = {
  mode?: 'none' | 'insert' | 'swap';  // 默认 'insert'
  disabled?: (col: StkTableColumn<T>) => boolean;
};

type ColResizableConfig<T> = {
  disabled: (col: StkTableColumn<T>) => boolean;
};

type DragRowConfig = {
  mode?: 'none' | 'insert' | 'swap';  // 默认 'insert'
};

type AutoRowHeightConfig<T> = {
  expectedHeight?: number | ((row: T) => number);
};

type ScrollbarOptions = {
  enabled?: boolean;
  width?: number;      // 默认 8
  height?: number;     // 默认 8
  minWidth?: number;   // 默认 20
  minHeight?: number;  // 默认 20
};

type HighlightConfig = {
  duration?: number;   // 秒
  fps?: number;
};

type HighlightDimCellOption = {
  method?: 'animation' | 'css';   // 默认 'animation'
  duration?: number;
  className?: string;             // method='css' 时使用
  keyframe?: Keyframe[];          // method='animation' 时自定义关键帧
};

type HighlightDimRowOption = {
  method?: 'animation' | 'css';   // 默认 'animation'
  duration?: number;
  className?: string;             // method='css' 时使用
  keyframe?: Keyframe[];          // method='animation' 时自定义关键帧
};

type SeqConfig = { startIndex?: number };
type ExpandConfig = { height?: number };
type FooterConfig = { position?: 'bottom' | 'top' };
type ExperimentalConfig = { scrollY?: boolean };

type UniqKey = string | number;

// ===== FilterCell 相关类型 =====

/** 筛选选项 */
type FilterOption = {
  label: string;
  value: any;
  selected?: boolean;
};

/** 筛选状态 */
type FilterStatus = {
  value: FilterOption['value'][];
  /** 自定义筛选逻辑，返回 true 保留记录 */
  filter?: (args: { row: any; cellValue: any; filterValues: FilterOption['value'][] }) => boolean;
};

/** FilterComponent 配置（传给 Filter() 的第一个参数） */
type FilterComponentConfig = {
  options?: FilterOption[];
  filter?: FilterStatus['filter'];
  /** 是否自动从数据中提取筛选选项，默认 false */
  autoOptions?: boolean;
};

/** createFilterCell 选项 */
type CreateFilterCellOption = {
  /** 是否远程筛选 */
  remote?: boolean;
  /** 筛选状态改变时触发 */
  onChange?: (data: { colKey: UniqKey; status: FilterStatus }) => void;
};

// ===== 内置单元格工厂函数选项 =====

type CreateEditableCellOptions = {
  trigger?: 'dblclick' | 'click';  // 默认 'dblclick'
  onChange?: (newValue: any, row: Record<string, any>, dataIndex: string) => void;
};

type createCheckboxCellOptions<T = any> = {
  /** 行数据中选中状态字段名，默认 '_isChecked' */
  field?: string;
  /** 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox），不传用原生 input */
  checkboxComponent?: any;
  onChange?: (checked: boolean, row: T) => void;
  onSelectAll?: (checked: boolean) => void;
};

/** NumberCell 选项（等同于 FormatNumberOptions） */
type CreateNumberCellOptions = FormatNumberOptions;

type CreateChangeCellOptions = FormatNumberOptions & {
  /** 涨跌颜色反转：false=A股(涨红跌绿，默认)，true=国际(涨绿跌红) */
  colorReverse?: boolean;
  /** 显示涨跌箭头 ▲/▼，默认 false */
  arrow?: boolean;
  riseColor?: string;   // 自定义上涨颜色
  fallColor?: string;   // 自定义下跌颜色
  flatColor?: string;   // 自定义平盘颜色
};

type FormatNumberOptions = {
  decimals?: number;        // 小数位数
  thousands?: boolean;      // 千分位，默认 true
  prefix?: string;          // 前缀
  suffix?: string;          // 后缀
  showSign?: boolean;       // 正数显示'+'，默认 false
  percent?: boolean;        // 百分比模式，与 abbr 互斥
  abbr?: 'cn' | 'en';      // 单位缩放（万/亿 或 K/M/B）
  abbrDecimals?: number;    // 缩放后小数位，默认 2
  placeholder?: string;     // 空值占位符，默认 '--'
};
```

***

## 自定义单元格完整指南

StkTable 提供三种自定义单元格渲染方式：
- `customCell` - 自定义**表体**单元格
- `customHeaderCell` - 自定义**表头**单元格
- `customFooterCell` - 自定义**表尾**单元格

### 类型定义

> 注意：`CustomCellProps`、`CustomHeaderCellProps`、`CustomFooterCellProps` 类型未从 `stk-table-vue` 包导出，需自行定义或使用 `InstanceType` 推导。

```typescript
// customCell props（组件内部传入）
type CustomCellProps<T> = {
    row: T;                    // 当前行数据
    col: StkTableColumn<T>;    // 列配置
    cellValue: any;            // row[col.dataIndex] 的值
    rowIndex: number;          // 行索引
    colIndex: number;          // 列索引
    expanded?: StkTableColumn<any>;  // 展开行配置（未展开为null）
    treeExpanded?: boolean;    // 树节点是否展开
};

// customHeaderCell props
type CustomHeaderCellProps<T> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};

// customFooterCell props
type CustomFooterCellProps<T> = {
    col: StkTableColumn<T>;
    row: T;                    // 表尾行数据
    cellValue: any;
    rowIndex: number;
    colIndex: number;
};
```

### 方式一：使用 h 渲染函数

适用于简单的单元格内容定制：

```typescript
import { h } from 'vue';
import type { StkTableColumn } from 'stk-table-vue';

interface RowData {
    name: string;
    yield: number;
    status: 'active' | 'inactive';
}

const columns: StkTableColumn<RowData>[] = [
    // 基础格式化：添加单位
    {
        title: '收益率',
        dataIndex: 'yield',
        customCell: ({ cellValue }) => h('span', `${(cellValue * 100).toFixed(2)}%`),
    },
    // 条件样式
    {
        title: '状态',
        dataIndex: 'status',
        customCell: ({ cellValue }) => h('span', {
            style: { color: cellValue === 'active' ? '#52c41a' : '#ff4d4f' }
        }, cellValue === 'active' ? '启用' : '禁用'),
    },
    // 复杂内容
    {
        title: '名称',
        dataIndex: 'name',
        customCell: ({ row, cellValue }) => h('div', {
            style: { display: 'flex', alignItems: 'center', gap: '8px' }
        }, [
            h('span', { class: 'avatar' }),
            h('strong', cellValue),
        ]),
    },
    // 表头自定义
    {
        title: '操作',
        dataIndex: 'action',
        customHeaderCell: () => h('span', { style: { color: '#ff4d4f' } }, '⚠ 操作'),
    },
    // 表尾自定义
    {
        title: '数量',
        dataIndex: 'count',
        customFooterCell: ({ cellValue }) => h('strong', `合计: ${cellValue}`),
    },
];
```

### 方式二：使用 Vue SFC 组件

适用于复杂的单元格逻辑，支持完整的 Vue 组件能力：

::: 文件结构示例
```
columns/
├── index.ts          # 列配置
├── YieldCell.vue     # 收益率单元格组件
├── StatusCell.vue    # 状态单元格组件
└── types.ts          # 数据类型定义
```
:::

```typescript
// columns/index.ts
import type { StkTableColumn } from 'stk-table-vue';
import type { RowData } from './types';
import YieldCell from './YieldCell.vue';
import StatusCell from './StatusCell.vue';

export const columns: StkTableColumn<RowData>[] = [
    { title: '代码', dataIndex: 'code' },
    { title: '收益率', dataIndex: 'yield', align: 'right', customCell: YieldCell },
    { title: '状态', dataIndex: 'status', customCell: StatusCell },
];
```

```vue
<!-- columns/YieldCell.vue -->
<script lang="ts" setup>
import { computed } from 'vue';

// 注意：CustomCellProps 未从包中导出，需自行定义 props
const props = defineProps<{
    row: RowData;
    col: any;
    cellValue: any;
    rowIndex: number;
    colIndex: number;
}>();

const displayValue = computed(() => {
    const val = props.cellValue * 100;
    return val > 0 ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`;
});

const colorClass = computed(() => {
    if (props.cellValue > 0) return 'color-up';
    if (props.cellValue < 0) return 'color-down';
    return '';
});
</script>

<template>
    <span :class="colorClass">{{ displayValue }}</span>
</template>

<style scoped>
.color-up { color: #52c41a; }
.color-down { color: #ff4d4f; }
</style>
```

### 方式三：使用 JSX

适用于熟悉 JSX 语法的开发者：

```tsx
import type { StkTableColumn } from 'stk-table-vue';

interface RowData {
    name: string;
    score: number;
}

const columns: StkTableColumn<RowData>[] = [
    {
        title: '姓名',
        dataIndex: 'name',
        customCell: ({ cellValue }) => (
            <span style={{ color: '#1890ff' }}>{cellValue}</span>
        ),
    },
    {
        title: '分数',
        dataIndex: 'score',
        customCell: ({ cellValue }) => {
            const color = cellValue >= 90 ? '#52c41a' : cellValue >= 60 ? '#faad14' : '#ff4d4f';
            return <span style={{ color, fontWeight: 'bold' }}>{cellValue}</span>;
        },
    },
];
```

### 方式四：使用内置 createEditableCell 工厂函数

快速创建可编辑单元格：

```typescript
import { createEditableCell } from 'stk-table-vue';
import type { StkTableColumn } from 'stk-table-vue';

const { EditableCell } = createEditableCell({
    trigger: 'dblclick', // 触发编辑的事件，默认 'dblclick'，可选 'click'
    onChange: (newValue, row, dataIndex) => {
        console.log(`行 ${row.id} 的 ${dataIndex} 变更为 ${newValue}`);
    },
});

const columns: StkTableColumn<RowData>[] = [
    { title: '名称', dataIndex: 'name', customCell: EditableCell },
    { title: '年龄', dataIndex: 'age', customCell: EditableCell },
];
```

### 方式五：使用内置 createCheckboxCell 工厂函数

快速创建多选框单元格（含表头全选）：

```typescript
import { createCheckboxCell } from 'stk-table-vue';
import type { StkTableColumn } from 'stk-table-vue';

const { CheckboxCell, CheckboxAllCell } = createCheckboxCell({
    field: '_isChecked', // 行数据中表示选中状态的字段名，默认 '_isChecked'
    // checkboxComponent: ElCheckbox, // 可选：自定义 checkbox 组件（如 Element Plus / Ant Design Vue），不传使用原生 input
    onChange: (checked, row) => {
        console.log(`行 ${row.id} 选中状态: ${checked}`);
    },
    onSelectAll: (checked) => {
        console.log(`全选: ${checked}`);
    },
});

const columns: StkTableColumn<RowData>[] = [
    {
        dataIndex: 'checkbox',
        width: 50,
        customCell: CheckboxCell,
        customHeaderCell: CheckboxAllCell, // 表头全选（自动处理半选状态）
    },
    { title: '名称', dataIndex: 'name' },
];
```

> **说明**：
> - `CheckboxAllCell` 会自动查找最近的 StkTable 实例，基于 `dataSource` 计算全选/半选状态。
> - 点击全选时会直接修改 `dataSource` 中所有行的 `field` 字段。
> - 支持通过 `checkboxComponent` 传入第三方 UI 库的 Checkbox 组件。

### 方式六：使用内置 createNumberCell 工厂函数

快速创建数字格式化单元格：

```typescript
import { createNumberCell } from 'stk-table-vue';
import type { StkTableColumn } from 'stk-table-vue';

const { NumberCell } = createNumberCell({ decimals: 2, thousands: true });
const NumberCellComp = NumberCell(); // 注意：需调用一次获取组件

const columns: StkTableColumn<RowData>[] = [
    { title: '现价', dataIndex: 'price', align: 'right', customCell: NumberCellComp },
];
```

### 方式七：使用内置 createChangeCell 工厂函数

快速创建涨跌染色单元格（金融场景）：

```typescript
import { createChangeCell } from 'stk-table-vue';
import type { StkTableColumn } from 'stk-table-vue';

const { ChangeCell } = createChangeCell({
    decimals: 2,
    showSign: true,    // 正数显示 '+'
    arrow: true,       // 显示涨跌箭头 ▲/▼
    // colorReverse: true, // 国际配色（涨绿跌红），默认 A 股配色（涨红跌绿）
    // riseColor: '#ff4d4f',  // 自定义上涨颜色
    // fallColor: '#52c41a',  // 自定义下跌颜色
    // flatColor: '#999',     // 自定义平盘颜色
});
const ChangeCellComp = ChangeCell(); // 注意：需调用一次获取组件

const columns: StkTableColumn<RowData>[] = [
    { title: '涨跌额', dataIndex: 'change', align: 'right', customCell: ChangeCellComp },
    { title: '涨跌幅', dataIndex: 'changePercent', align: 'right', customCell: ChangeCellComp },
];
```

> **说明**：涨跌方向按 `cellValue` 正负判断：正数=涨，负数=跌，0/空值=平盘。

### 工具函数：formatNumber

`formatNumber` 是 NumberCell / ChangeCell 共享的数字格式化纯函数，也可独立使用：

```typescript
import { formatNumber } from 'stk-table-vue';

formatNumber(1234567.891);                          // '1,234,567.891'
formatNumber(1234567.891, { decimals: 2 });         // '1,234,567.89'
formatNumber(0.156, { percent: true, decimals: 1 }); // '15.6%'
formatNumber(356000000, { abbr: 'cn' });            // '3.56亿'
formatNumber(3560000, { abbr: 'en' });              // '3.56M'
formatNumber(42, { prefix: '+', showSign: true });  // '+42'
formatNumber(null);                                  // '--'
formatNumber(null, { placeholder: 'N/A' });         // 'N/A'
```

**FormatNumberOptions 配置：**

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `decimals` | `number` | 不强制 | 小数位数（四舍五入） |
| `thousands` | `boolean` | `true` | 千分位分隔符 |
| `prefix` | `string` | `''` | 前缀，如 '¥'、'$' |
| `suffix` | `string` | `''` | 后缀，如 '元'、'股' |
| `showSign` | `boolean` | `false` | 正数强制显示 '+' 号 |
| `percent` | `boolean` | `false` | 百分比模式（值×100追加'%'），与 abbr 互斥 |
| `abbr` | `'cn' \| 'en'` | 不缩放 | 单位缩放：'cn'=万/亿，'en'=K/M/B，与 percent 互斥 |
| `abbrDecimals` | `number` | `2` | 缩放后保留小数位 |
| `placeholder` | `string` | `'--'` | 空值/非数字占位符 |

### 重要注意事项

1. **建议包裹元素**：`customCell` 返回的 VNode 建议用元素（div/span 等）包裹，否则 `TextNode` 作为 `<td>` 子节点可能导致布局问题。

2. **谨慎使用行内元素**：`customCell` 的根元素请谨慎设置为 `inline`/`inline-block`/`inline-flex` 等行内元素，此布局在**虚拟列表**中可能会撑开行高。

3. **组件类型兼容**：`customCell` 类型直接定义 `Component<Props>` 时，如果 Props 属性为必选，则通过 `defineComponent` 创建的组件必须要定义所有的 Prop。建议将所有 Props 定义为可选，或使用函数式组件。

4. **选区复制格式化**：如果使用了 `customCell` 自定义渲染，应该配合 `areaSelection.formatCellForClipboard` 回调以确保复制内容与展示内容一致。

***

## 常见场景代码模板

### 1. 虚拟滚动大数据表格

```vue
<template>
  <div style="height: 500px">
    <StkTable
      virtual
      row-key="id"
      :row-height="36"
      :columns="columns"
      :data-source="dataSource"
    />
  </div>
</template>
```

> 注意：虚拟滚动需要容器具有确定高度（通过父容器固定高度或组件自身 CSS 均可）。

### 2. 横向+纵向虚拟滚动

```vue
<StkTable virtual virtual-x row-key="id" :columns="columns" :data-source="dataSource" />
```

> 横向虚拟滚动要求所有列必须设置 `width`。

### 3. 排序

```vue
<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    @sort-change="onSortChange"
  />
</template>

<script setup>
const columns = [
  { title: '名称', dataIndex: 'name', sorter: true, sortType: 'string' },
  { title: '年龄', dataIndex: 'age', sorter: true, sortType: 'number' },
];

function onSortChange(col, order, sortedData, config) {
  console.log(`按 ${col?.dataIndex} ${order} 排序`);
}
</script>
```

### 4. 多列排序

```vue
<StkTable
  ref="tableRef"
  :sort-config="{ multiSort: true, multiSortLimit: 3 }"
  :columns="columns"
  :data-source="dataSource"
/>
```

```typescript
// 编程式设置多列排序
tableRef.value?.setSorter('department', 'asc');
tableRef.value?.setSorter('age', 'desc', { append: true });
```

### 5. 固定列

```vue
<StkTable fixed-col-shadow :columns="columns" :data-source="dataSource" />
```

```typescript
const columns = [
  { title: 'ID', dataIndex: 'id', fixed: 'left', width: 80 },
  { title: '名称', dataIndex: 'name', width: 200 },
  // ... 更多列
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 120 },
];
```

### 6. 自定义单元格渲染

```typescript
import { h } from 'vue';

const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    customCell: ({ row, cellValue }) => {
      return h('span', {
        style: { color: cellValue === 'active' ? 'green' : 'red' },
      }, cellValue);
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    customCell: ({ row }) => {
      return h('div', [
        h('button', { onClick: () => handleEdit(row) }, '编辑'),
        h('button', { onClick: () => handleDelete(row) }, '删除'),
      ]);
    },
  },
];
```

### 7. 树形数据

```vue
<StkTable
  row-key="id"
  :columns="columns"
  :data-source="treeData"
  :tree-config="{ defaultExpandLevel: 1 }"
  @toggle-tree-expand="onToggle"
/>
```

```typescript
const columns = [
  { type: 'tree-node', title: '名称', dataIndex: 'name' },
  { title: '值', dataIndex: 'value' },
];

// 数据中用 children 字段表示子节点
const treeData = [
  { id: 1, name: '节点1', value: 100, children: [
    { id: 11, name: '子节点1-1', value: 50 },
  ]},
];
```

### 8. 行展开

```vue
<StkTable row-key="id" :columns="columns" :data-source="dataSource">
  <template #expand="{ row }">
    <div style="padding: 10px">详情：{{ row.detail }}</div>
  </template>
</StkTable>
```

```typescript
const columns = [
  { type: 'expand', dataIndex: '', width: 50 },
  { title: '名称', dataIndex: 'name' },
];
```

### 9. 行拖拽

```vue
<StkTable
  row-key="id"
  :columns="columns"
  :data-source="dataSource"
  :drag-row-config="{ mode: 'insert' }"
  @row-order-change="onRowDrag"
/>
```

```typescript
const columns = [
  { type: 'dragRow', dataIndex: '', width: 60, title: '拖拽' },
  { title: '名称', dataIndex: 'name' },
];
```

### 10. 表头列拖拽重排

```vue
<StkTable
  v-model:columns="columns"
  header-drag
  row-key="id"
  :data-source="dataSource"
/>
```

### 11. 列宽拖拽调整

```vue
<StkTable
  v-model:columns="columns"
  col-resizable
  row-key="id"
  :data-source="dataSource"
/>
```

> 列宽拖拽要求每列都设置 `width`。

### 12. 高亮闪烁

```vue
<StkTable
  ref="tableRef"
  row-key="id"
  :highlight-config="{ duration: 2, fps: 0 }"
  :columns="columns"
  :data-source="dataSource"
/>
```

```typescript
// 高亮单元格（支持第三个参数 option 自定义动画方式）
tableRef.value?.setHighlightDimCell('row-key-1', 'age');
// 高亮行（支持第二个参数 option 自定义动画方式）
tableRef.value?.setHighlightDimRow(['row-key-1', 'row-key-2']);
```

### 12.1 行选中配置

```vue
<template>
  <StkTable
    row-key="id"
    :row-active="{ enabled: true, revokable: true, disabled: row => row.locked }"
    :columns="columns"
    :data-source="dataSource"
    @current-change="onCurrentChange"
  />
</template>

<script setup>
const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '名称', dataIndex: 'name' },
  { title: '状态', dataIndex: 'status' },
];

const dataSource = [
  { id: 1, name: '张三', status: 'active' },
  { id: 2, name: '李四', status: 'locked', locked: true }, // 此行不能被点击选中
];

function onCurrentChange(event, row, { select }) {
  console.log('当前行:', row);
  console.log('选中状态:', select); // true=选中, false=取消选中
}
</script>
```

> **提示**:
> - `rowActive` 设为 `false` 仅隐藏内部样式，`tr` 上仍会添加 `active` 类，方便自定义样式。
> - `rowActive.disabled` 禁用的行仍可通过 `setCurrentRow()` 方法选中。
> - `revokable: true` 表示再次点击当前行可以取消选中。

### 13. 单元格选区(Area Selection)

> 注意：Area Selection 是按需注册的特性，需先调用 `registerFeature(useAreaSelection)` 才能使用。

```vue
<StkTable
  row-key="id"
  :area-selection="{ enabled: true, keyboard: true }"
  :columns="columns"
  :data-source="dataSource"
  @area-selection-change="onSelection"
/>
```

#### 完整配置示例：

```vue
<StkTable
  row-key="id"
  :area-selection="{
    enabled: true,
    keyboard: true,
    ctrl: true,
    shift: true,
    formatCellForClipboard: (row, col, rawValue) => {
      if (col.dataIndex === 'status') {
        return rawValue === 1 ? '正常' : '异常';
      }
      return String(rawValue);
    },
    highlight: {
      cell: true,
      row: false,
    }
  }"
  :columns="columns"
  :data-source="dataSource"
/>
```

#### 配置参数说明：

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `enabled` | `boolean` | `false` | 是否启用区域选择 |
| `keyboard` | `boolean` | `false` | 是否启用键盘导航（方向键/Tab/Shift+Tab） |
| `ctrl` | `boolean` | `true` | 是否启用 Ctrl/Cmd 多选不连续区域 |
| `shift` | `boolean` | `true` | 是否启用 Shift 扩选功能 |
| `formatCellForClipboard` | `Function` | `undefined` | 复制到剪贴板时的格式化回调 |
| `highlight.cell` | `boolean` | `true` | 是否启用单元格高亮与选中边框 |
| `highlight.row` | `boolean` | `false` | 是否启用整行高亮 |

### 14. 序号列

```typescript
const columns = [
  { type: 'seq', title: '#', dataIndex: '', width: 50 },
  // ...其他列
];
```

### 15. 表尾合计行

```vue
<StkTable
  :columns="columns"
  :data-source="dataSource"
  :footer-data="[{ name: '合计', amount: 10000 }]"
  :footer-config="{ position: 'bottom' }"
/>
```

### 16. 多级表头

```typescript
const columns = [
  {
    title: '基本信息',
    dataIndex: '',
    children: [
      { title: '名称', dataIndex: 'name', width: 100 },
      { title: '年龄', dataIndex: 'age', width: 80 },
    ],
  },
  { title: '备注', dataIndex: 'remark' },
];
```

### 17. 单元格合并

```typescript
const columns = [
  {
    title: '部门',
    dataIndex: 'dept',
    mergeCells: ({ row, rowIndex }) => {
      if (rowIndex === 0) return { rowspan: 2, colspan: 1 };
      if (rowIndex === 1) return { rowspan: 0 }; // 被合并，设为0隐藏
    },
  },
];
```

### 18. 暗色主题

```vue
<StkTable theme="dark" :columns="columns" :data-source="dataSource" />
```

### 19. 自定义空状态

```vue
<StkTable :columns="columns" :data-source="[]">
  <template #empty>
    <div class="my-empty">暂无数据，请添加</div>
  </template>
</StkTable>
```

### 20. 服务端排序

```vue
<StkTable
  sort-remote
  :columns="columns"
  :data-source="dataSource"
  @sort-change="onSortChange"
/>
```

```typescript
async function onSortChange(col, order) {
  const res = await fetch(`/api/data?sort=${col.dataIndex}&order=${order}`);
  dataSource.value = await res.json();
}
```

### 21. CSS 变量自定义样式

StkTable 支持通过 CSS 变量自定义表格的样式外观：

```vue
<template>
  <div class="my-table-container">
    <StkTable
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
    />
  </div>
</template>

<style>
.my-table-container {
  --border-color: #e0e0e0;
  --border-width: 1px;
  --td-bgc: #ffffff;
  --td-hover-color: #f5f5f5;
  --td-active-color: #e3f2fd;
  --th-bgc: #fafafa;
  --tf-bgc: #f5f5f5;
  --th-color: #333333;
  --tr-hover-bgc: #f5f5f5;
  --tr-active-bgc: #e3f2fd;
  --stripe-bgc: #fafafa;
  --sort-arrow-color: #999999;
  --sort-arrow-hover-color: #666666;
  --sort-arrow-active-color: #1890ff;
  --sort-arrow-active-sub-color: #cccccc;
  --fold-icon-color: #999999;
  --fold-icon-hover-color: #666666;
  --col-resize-indicator-color: #1890ff;
  --fixed-col-shadow-color-from: rgba(0, 0, 0, 0.1);
  --fixed-col-shadow-color-to: rgba(0, 0, 0, 0);
  --drag-handle-hover-color: #d9d9d9;
  --sb-thumb-color: #c1c1c1;
  --sb-thumb-hover-color: #a8a8a8;
  --cs-bgc: #d3eafd;
  --cs-bc: #2196f3;
}
</style>
```

> 注意：行高（`rowHeight`、`headerRowHeight`、`footerRowHeight`）等尺寸相关配置请使用组件的 Props，不要通过 CSS 变量来修改。

***

## 重要注意事项

1. **虚拟滚动需要容器具有确定高度**，可通过父容器固定高度或组件自身 CSS 设置。
2. **横向虚拟滚动(`virtualX`)建议为所有列设置** **`width`**，未设置时默认列宽为 100。
3. **列宽拖拽(`colResizable`)和表头拖拽(`headerDrag`)需要配合** **`v-model:columns`** **使用**。
4. **`rowKey`** **强烈建议设置**，大多数功能依赖行唯一标识。
5. **`customCell`** **使用 Vue 的** **`h()`** **函数**返回 VNode，不是 JSX/模板（除非在 JSX 文件中）。
6. **排序列需要设置** **`sorter: true`**，并推荐设置 `sortType: 'number' | 'string'`。
7. **固定列(`fixed`)建议配合设置** **`width`**。
8. **树形数据的子节点字段名为** **`children`**。
9. **暗色主题使用** **`theme="dark"`**，组件内置了暗色样式。
10. **展开行在虚拟滚动下需设置** **`expandConfig.height`** 指定展开区域高度。
11. **Area Selection 需先注册**：`registerFeature(useAreaSelection)` 后再使用 `areaSelection` prop。
12. **`CustomCellProps` 等类型未从包导出**，SFC 组件中需自行定义 props 或使用泛型推导。
13. **内置单元格工厂函数**：`createNumberCell`/`createChangeCell` 返回的组件构造函数需调用一次（如 `NumberCell()`）才能赋给 `customCell`；`createCheckboxCell`/`createEditableCell` 返回的可直接作为 `customCell` 使用。
14. **`formatNumber` 可独立使用**，是 NumberCell/ChangeCell 的格式化内核，支持千分位、百分比、万亿/KMB 缩放等。
