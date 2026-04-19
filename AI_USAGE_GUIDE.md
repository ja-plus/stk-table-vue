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
import type { StkTableColumn, Order, SortConfig, SortState } from 'stk-table-vue';
import 'stk-table-vue/lib/style.css'; // 引入样式，一般在 main.js(全局) 引入一次。
```

其他可导出项：

```typescript
// 工具函数
import { tableSort, insertToOrderedArray, strCompare, binarySearch } from 'stk-table-vue';
// 按需特性
import { useAreaSelection, registerFeature, useFilter } from 'stk-table-vue';
import type { FilterStatus, UseFilterOptions } from 'stk-table-vue';
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
| `headerRowHeight` | `number \| string \| null`           | `28`    | 表头行高                              |
| `footerRowHeight` | `number \| string \| null`           | `28`    | 表尾行高                              |

### 行交互

| Prop               | 类型                               | 默认值                                  | 说明             |
| ------------------ | -------------------------------- | ------------------------------------ | -------------- |
| `rowHover`         | `boolean`                        | `true`                               | hover 高亮行      |
| `rowActive`        | `boolean \| RowActiveOption<DT>` | `{ enabled: true, revokable: true }` | 点击选中行高亮        |
| `rowClassName`     | `(row: DT, i: number) => string` | `() => ''`                           | 行 className 回调 |
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
| `emptyCellText` | `string \| ((option) => string)`  | `'--'`      | 空值展示文字                               |

### 虚拟滚动

| Prop         | 类型                        | 默认值     | 说明             |
| ------------ | ------------------------- | ------- | -------------- |
| `virtual`    | `boolean`                 | `false` | Y 轴虚拟滚动        |
| `virtualX`   | `boolean`                 | `false` | X 轴虚拟滚动（横向虚拟滚动按需设置列宽） |
| `autoResize` | `boolean \| (() => void)` | `true`  | 自动重算虚拟滚动尺寸     |

### 固定列

| Prop             | 类型                       | 默认值        | 说明      |
| ---------------- | ------------------------ | ---------- | ------- |
| `cellFixedMode`  | `'sticky' \| 'relative'` | `'sticky'` | 固定列实现方式 |
| `fixedColShadow` | `boolean`                | `false`    | 固定列阴影   |

### 排序

| Prop              | 类型                    | 默认值     | 说明          |
| ----------------- | --------------------- | ------- | ----------- |
| `sortRemote`      | `boolean`             | `false` | 服务端排序(不排数据) |
| `sortConfig`      | `SortConfig<DT>`      | 见下方     | 排序配置        |
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
| `dragRowConfig`   | `{ mode?: 'none'\|'insert'\|'swap' }` | `{}`                     | 行拖动配置                  |
| `treeConfig`      | `TreeConfig`                          | `{}`                     | 树形配置                   |
| `highlightConfig` | `{ duration?: number; fps?: number }` | `{}`                     | 高亮配置(duration 秒)       |
| `footerData`      | `DT[]`                                | `[]`                     | 底部合计行数据                |
| `footerConfig`    | `{ position?: 'bottom'\|'top' }`      | `{ position: 'bottom' }` | 底部配置                   |
| `scrollRowByRow`  | `boolean \| 'scrollbar'`              | `false`                  | 整行滚动                   |
| `smoothScroll`    | `boolean`                             | `chrome < 85 ? true : false` | 平滑滚动（低版本浏览器默认true）   |
| `scrollbar`       | `boolean \| ScrollbarOptions`         | `false`                  | 自定义滚动条                 |
| `showNoData`      | `boolean`                             | `true`                   | 显示暂无数据                 |
| `noDataFull`      | `boolean`                             | `false`                  | 暂无数据撑满高度               |
| `experimental`    | `{ scrollY?: boolean }`               | `{}`                     | 实验性功能                  |

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

  // 自定义渲染（返回 VNode，使用 h 函数）
  customCell?: (props: {
    row: T; col: StkTableColumn<T>; cellValue: any;
    rowIndex: number; colIndex: number;
  }) => VNode;
  customHeaderCell?: (props: {
    col: StkTableColumn<T>; rowIndex: number; colIndex: number;
  }) => VNode;
  customFooterCell?: (props: {
    col: StkTableColumn<T>; row: T; cellValue: any;
    rowIndex: number; colIndex: number;
  }) => VNode;

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
| `sort-change`           | `(col, order, data, sortConfig)` | 排序变化               |
| `row-click`             | `(ev, row, { rowIndex })`        | 行点击                |
| `row-dblclick`          | `(ev, row, { rowIndex })`        | 行双击                |
| `current-change`        | `(ev, row, { select })`          | 选中行变化              |
| `cell-selected`         | `(ev, { select, row, col })`     | 选中单元格变化            |
| `cell-click`            | `(ev, row, col, { rowIndex })`   | 单元格点击              |
| `cell-mouseenter`       | `(ev, row, col)`                 | 单元格鼠标进入            |
| `cell-mouseleave`       | `(ev, row, col)`                 | 单元格鼠标离开            |
| `cell-mouseover`        | `(ev, row, col)`                 | 单元格悬浮              |
| `cell-mousedown`        | `(ev, row, col, { rowIndex })`   | 单元格鼠标按下            |
| `header-cell-click`     | `(ev, col)`                      | 表头单元格点击            |
| `header-row-menu`       | `(ev)`                           | 表头右键               |
| `row-menu`              | `(ev, row, { rowIndex })`        | 行右键                |
| `scroll`                | `(ev, { startIndex, endIndex })` | 纵向滚动               |
| `scroll-x`              | `(ev)`                           | 横向滚动               |
| `col-order-change`      | `(dragStartKey, targetColKey)`   | 列拖拽排序完成            |
| `th-drag-start`         | `(dragStartKey)`                 | 列拖拽开始              |
| `th-drop`               | `(targetColKey)`                 | 列拖拽放下              |
| `row-order-change`      | `(dragStartKey, targetRowKey)`   | 行拖拽排序完成            |
| `col-resize`            | `(col)`                          | 列宽变化               |
| `toggle-row-expand`     | `({ expanded, row, col })`       | 行展开/收起（col可能为null） |
| `toggle-tree-expand`    | `({ expanded, row, col })`       | 树节点展开/收起（col可能为null） |
| `area-selection-change` | `(range, { rows, cols })`        | 选区变化               |
| `filter-change`         | `(status)`                       | 筛选变化(Beta)         |
| `update:columns`        | `(cols)`                         | v-model:columns 更新 |

***

## Slots 插槽

| 插槽名            | 作用域            | 说明        |
| -------------- | -------------- | --------- |
| `tableHeader`  | `{ col }`      | 自定义表头单元格  |
| `empty`        | 无              | 自定义空数据展示  |
| `expand`       | `{ row, col }` | 展开行内容     |
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
| `initVirtualScrollY`  | `() => void`                              | 重算虚拟滚动高度                                           |
| `setCurrentRow`       | `(rowKeyOrRow, option?) => void`          | 选中行。option: `{ silent?: boolean; deep?: boolean }` |
| `setSelectedCell`     | `(row?, col?, option?) => void`           | 选中单元格(cellActive=true)                             |
| `setHighlightDimCell` | `(rowKey, colKey) => void`                | 高亮闪烁单元格                                            |
| `setHighlightDimRow`  | `(rowKeys[]) => void`                     | 高亮闪烁行                                              |
| `setSorter`           | `(dataIndex, order, option?) => void`     | 设排序。option: `{ append?: boolean }`(多列排序追加)         |
| `resetSorter`         | `() => void`                              | 重置排序                                               |
| `getSortColumns`      | `() => { dataIndex, sortField, order }[]` | 获取排序信息                                             |
| `scrollTo`            | `(top, left) => void`                     | 滚动到位置(null=不变)                                     |
| `getTableData`        | `() => DT[]`                              | 获取排序/过滤后数据                                         |
| `setRowExpand`        | `(row, col, expand?) => void`             | 设置行展开                                              |
| `setAutoHeight`       | `(row, height) => void`                   | 更新可变行高                                             |
| `clearAllAutoHeight`  | `() => void`                              | 清除行高缓存                                             |
| `setTreeExpand`       | `(row, expanded) => void`                 | 设置树节点展开                                            |
| `getSelectedArea`     | `() => { range, rows, cols } \| null`     | 获取选区信息                                             |
| `clearSelectedArea`   | `() => void`                              | 清空选区                                               |
| `copySelectedArea`    | `() => void`                              | 复制选区到剪贴板                                           |
| `setFilter`           | `(status, option?) => void`               | 设置筛选。option: `{ remote?: boolean }`                |
| `sortCol`             | `ComputedRef<SortState \| null>`          | 当前排序列状态(属性)                                        |
| `sortStates`          | `Ref<SortState[]>`                        | 排序状态数组(属性)                                         |

***

## 类型定义速查

```typescript
type Order = null | 'asc' | 'desc';

type DefaultSortConfig<T> = {
  key?: StkTableColumn<T>['key'];
  dataIndex: string;
  order: Order;
  sortField?: keyof T;
  sortType?: 'number' | 'string';
  sorter?: boolean | ((data: T[], option: { order: Order; column: any }) => T[]);
  silent?: boolean;
};

type SortConfig<T> = {
  defaultSort?: DefaultSortConfig<T>;
  emptyToBottom?: boolean;
  stringLocaleCompare?: boolean;
  sortChildren?: boolean;
  multiSort?: boolean;
  multiSortLimit?: number;
};

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
  enabled?: boolean;
  formatCellForClipboard?: (row: T, col: StkTableColumn<T>, rawValue: any) => string;
  keyboard?: boolean;
};

type HeaderDragConfig<T> = {
  mode?: 'none' | 'insert' | 'swap';
  disabled?: (col: StkTableColumn<T>) => boolean;
};

type ColResizableConfig<T> = {
  disabled: (col: StkTableColumn<T>) => boolean;
};

type AutoRowHeightConfig<T> = {
  expectedHeight?: number | ((row: T) => number);
};

type ScrollbarOptions = {
  enabled?: boolean;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
};

type HighlightConfig = {
  duration?: number; // 秒
  fps?: number;
};

type FooterConfig = {
  position?: 'bottom' | 'top';
};

type ExperimentalConfig = {
  scrollY?: boolean;
};
```

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

> 注意：父容器必须有固定高度，虚拟滚动才能生效。

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
// 高亮单元格
tableRef.value?.setHighlightDimCell('row-key-1', 'age');
// 高亮行
tableRef.value?.setHighlightDimRow(['row-key-1', 'row-key-2']);
```

### 13. 单元格选区(Area Selection)

```vue
<StkTable
  row-key="id"
  :area-selection="{ enabled: true, keyboard: true }"
  :columns="columns"
  :data-source="dataSource"
  @area-selection-change="onSelection"
/>
```

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
  // 服务端排序模式下，组件不排序数据，需自行请求
  const res = await fetch(`/api/data?sort=${col.dataIndex}&order=${order}`);
  dataSource.value = await res.json();
}
```

### 21. CSS 变量自定义样式

StkTable 支持通过 CSS 变量自定义表格的样式外观。可以在父容器或根元素上定义这些变量：

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
  /* 边框变量 */
  --border-color: #e0e0e0;               /* 边框颜色 */
  --border-width: 1px;                    /* 边框宽度 */

  /* 单元格变量 */
  --td-bgc: #ffffff;                     /* 单元格背景色 */
  --td-hover-color: #f5f5f5;              /* 单元格悬停色 */
  --td-active-color: #e3f2fd;            /* 单元格激活色 */

  /* 表头/表尾变量 */
  --th-bgc: #fafafa;                     /* 表头背景色 */
  --tf-bgc: #f5f5f5;                     /* 表尾背景色 */
  --th-color: #333333;                   /* 表头文字色 */

  /* 行状态变量 */
  --tr-hover-bgc: #f5f5f5;               /* 行悬停背景色 */
  --tr-active-bgc: #e3f2fd;             /* 行激活背景色 */
  --stripe-bgc: #fafafa;                 /* 斑马纹背景色 */

  /* 排序箭头变量 */
  --sort-arrow-color: #999999;           /* 排序箭头颜色 */
  --sort-arrow-hover-color: #666666;      /* 排序箭头悬停色 */
  --sort-arrow-active-color: #1890ff;   /* 排序箭头激活色 */
  --sort-arrow-active-sub-color: #cccccc; /* 排序箭头激活次要颜色 */

  /* 折叠图标变量 */
  --fold-icon-color: #999999;            /* 折叠图标颜色 */
  --fold-icon-hover-color: #666666;      /* 折叠图标悬停色 */

  /* 列宽调整变量 */
  --col-resize-indicator-color: #1890ff;  /* 列宽调整指示器颜色 */

  /* 固定列变量 */
  --fixed-col-shadow-color-from: rgba(0, 0, 0, 0.1);  /* 固定列阴影起始颜色 */
  --fixed-col-shadow-color-to: rgba(0, 0, 0, 0);      /* 固定列阴影结束颜色 */

  /* 拖拽变量 */
  --drag-handle-hover-color: #d9d9d9;    /* 拖拽手柄悬停颜色 */

  /* 滚动条变量 */
  --sb-thumb-color: #c1c1c1;             /* 滚动条颜色 */
  --sb-thumb-hover-color: #a8a8a8;       /* 滚动条悬停色 */

  /* 选区变量 */
  --cs-bgc: #d3eafd;                    /* 选区背景色 */
  --cs-bc: #2196f3;                     /* 选区边框色 */
}
</style>
```

> 注意：行高（`rowHeight`、`headerRowHeight`、`footerRowHeight`）等尺寸相关配置请使用组件的 Props，详见上方 Props 参考中的「行高」章节，不要通过 CSS 变量来修改。其他样式相关的 CSS 变量可按需使用。

> 提示：查看完整的 CSS 变量演示，可以访问组件的 CssVarsDemo 页面，那里提供了交互式的变量配置工具，可以实时预览效果并导出修改后的变量配置。

***

## 重要注意事项

1. **虚拟滚动不需要固定高度的父容器**，直接修改 StkTable 组件的 style 即可调整高度。
2. **横向虚拟滚动(`virtualX`)建议为所有列设置** **`width`**，未设置时默认列宽为 100。
3. **列宽拖拽(`colResizable`)和表头拖拽(`headerDrag`)需要配合** **`v-model:columns`** **使用**。
4. **`rowKey`** **强烈建议设置**，大多数功能依赖行唯一标识。
5. **`customCell`** **使用 Vue 的** **`h()`** **函数**返回 VNode，不是 JSX/模板。
6. **排序列需要设置** **`sorter: true`**，并推荐设置 `sortType: 'number' | 'string'`。
7. **固定列(`fixed`)建议配合设置** **`width`**。
8. **树形数据的子节点字段名为** **`children`**。
9. **暗色主题使用** **`theme="dark"`**，组件内置了暗色样式。
10. **展开行在虚拟滚动下需设置** **`expandConfig.height`** 指定展开区域高度。

