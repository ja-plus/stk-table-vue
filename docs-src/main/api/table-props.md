# Table Props 表格配置
```ts
<StkTable
  ...[props]
/>
```
## API

### width

表格宽度

```ts
width?: string;
```

### minWidth

最小表格宽度 @deprecated 0.9.1 使用css选择器`.stk-table-main`设置

```ts
minWidth?: string;
```

### maxWidth

表格最大宽度 @deprecated 0.9.1 使用css选择器`.stk-table-main`设置

```ts
maxWidth?: string;
```

### stripe

斑马线条纹

```ts
stripe?: boolean;
```

### fixedMode

是否使用 table-layout:fixed

```ts
fixedMode?: boolean;
```

### headless

是否隐藏表头

```ts
headless?: boolean;
```

### theme

主题，亮、暗

```ts
theme?: 'light' | 'dark';
```

### rowHeight

行高
- `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。
- 支持动态修改，修改后自动重算可视区行数与滚动高度（行高由 `--row-height` 控制，会同步更新）。

```ts
rowHeight?: number;
```

### autoRowHeight

是否可变行高
- 设置为 `true` 时, `props.rowHeight` 将表示为期望行高，用于计算。不再影响实际行高。

```ts
autoRowHeight?: boolean | {
  /** 预估行高(优先级高于rowHeight) */
  expectedHeight?: number | ((row: DT) => number);
};
```

### rowHover

是否高亮鼠标悬浮的行

```ts
rowHover?: boolean;
```

### rowActive

是否高亮选中的行

```ts
rowActive?: boolean | {
  /** 是否启用行选中功能 default: true */
  enabled?: boolean;
  /** 是否禁用行选中 default: () => false */
  disabled?: (row: DT) => boolean;
  /** 是否可以取消选中 default: true */
  revokable?: boolean;
};
```

### headerRowHeight

表头行高。default = rowHeight
- 支持动态修改，表头占用的表体行数（`pageSize`）随之重算。

```ts
headerRowHeight?: number | null;
```

### footerRowHeight

表尾行高。default = rowHeight
- 支持动态修改。表尾行悬浮于滚动区底部，不计入虚拟滚动的总高度。

```ts
footerRowHeight?: number | string | null;
```

### virtual

虚拟滚动

```ts
virtual?: boolean;
```

### virtualX

x轴虚拟滚动(必须设置列宽)

```ts
virtualX?: boolean;
```

### columns

表格列配置

浅层监听，变更时请修改其引用

```ts
columns?: StkTableColumn<any>[];
```

### dataSource

数据源

浅层监听，变更时请修改其引用

```ts
dataSource?: any[];
```

### rowKey

行唯一键 (行唯一值不能为undefined）

```ts
rowKey?: UniqKeyProp;
```

### colKey

列唯一键。默认`dataIndex`

```ts
colKey?: UniqKeyProp;
```

### emptyCellText

空值展示文字

```ts
emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string);
```

### noDataFull

暂无数据兜底高度是否撑满

```ts
noDataFull?: boolean;
```

### showNoData

是否展示暂无数据

```ts
showNoData?: boolean;
```

### sortRemote

是否服务端排序，true则不排序数据

```ts
sortRemote?: boolean;
```

### showHeaderOverflow

表头是否溢出展示...

```ts
showHeaderOverflow?: boolean;
```

### showOverflow

表体溢出是否展示...

```ts
showOverflow?: boolean;
```

### showTrHoverClass

是否增加行hover class

```ts
showTrHoverClass?: boolean;
```

### cellHover

是否高亮鼠标悬浮的单元格

```ts
cellHover?: boolean;
```

### cellActive

是否高亮选中的单元格

```ts
cellActive?: boolean;
```

### selectedCellRevokable

单元格再次点击否可以取消选中 (cellActive=true)

```ts
selectedCellRevokable?: boolean;
```

### areaSelection

是否启用单元格范围选中（拖拽选区）

```ts
areaSelection?: boolean | {
    /** 是否启用区域选择，默认: true */
    enabled?: boolean;
    /** 复制时的单元格文本格式化回调 */
    formatCellForClipboard?: (row, col, rawValue) => string;
    /** 是否启用键盘控制选区移动，默认: true */
    keyboard?: boolean;
    /** 是否启用 Ctrl 多选功能，默认: true */
    ctrl?: boolean;
    /** 是否启用 Shift 扩选功能，默认: true */
    shift?: boolean;
};
```

### headerDrag

表头是否可拖动。支持回调函数。

```ts
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
```

### rowClassName

给行附加className

```ts
rowClassName?: (row: any, i: number) => string;
```

### colResizable

列宽是否可拖动(需要设置v-model:columns)
**不要设置**列minWidth，**必须**设置width
列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
- 会自动更新props.columns中的with属性

```ts
colResizable?: boolean | {
  /** 禁用拖动的列 */
  disabled?: (col: StkTableColumn<DT>) => boolean;
};
```

### colMinWidth

可拖动至最小的列宽

```ts
colMinWidth?: number;
```

### bordered

单元格分割线。
默认横竖都有
"h" - 仅展示横线
"v" - 仅展示竖线
"body-v" - 仅表体展示竖线
"body-h" - 仅表体展示横线

```ts
bordered?: boolean | 'h' | 'v' | 'body-v' | 'body-h';
```

### autoResize

自动重新计算虚拟滚动高度宽度。默认true
[非响应式]
传入方法表示resize后的回调

```ts
autoResize?: boolean | (() => void);
```

### fixedColShadow

是否展示固定列阴影。为节省性能，默认false。

```ts
fixedColShadow?: boolean;
```

### optimizeVue2Scroll

优化vue2 滚动

```ts
optimizeVue2Scroll?: boolean;
```

### sortConfig

排序配置

```ts
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
```

### hideHeaderTitle

隐藏头部鼠标悬浮title。可传入dataIndex数组

```ts
hideHeaderTitle?: boolean | string[];
```

### highlightConfig

高亮配置

```ts
highlightConfig?: {
  /** 高亮持续时间(s) */
  duration?: number;
  /** 高亮帧率*/
  fps?: number;
};
```

### seqConfig

序号列配置

```ts
seqConfig?: {
  /** 序号列起始下标 用于适配分页 */
  startIndex?: number;
};
```

### expandConfig

展开行配置

```ts
expandConfig?: {
  height?: number;
};
```

### dragRowConfig

行拖动配置

```ts
dragRowConfig?: {
  mode?: 'none' | 'insert' | 'swap';
};
```

### cellFixedMode

固定头，固定列实现方式。
[非响应式]
relative：固定列只能放在props.columns的两侧。
- 如果列宽会变动则谨慎使用。
- 多级表头固定列慎用

低版本浏览器只能为'relative',

```ts
cellFixedMode?: 'sticky' | 'relative';
```

### smoothScroll

是否平滑滚动
- default: chrome < 85 || chrome > 120 ? true : false
- false: 使用 wheel 事件滚动。为了防止滚动过快导致白屏。
- true: 不使用 wheel 事件滚动。滚轮滚动时更加平滑。滚动过快时会白屏。

```ts
smoothScroll?: boolean;
```

### scrollRowByRow

按整数行纵向滚动
- scrollbar：仅拖动滚动条生效,可用于处理拖动白屏问题(v0.7.2)

```ts
scrollRowByRow?: boolean | 'scrollbar';
```

### scrollbar

自定义滚动条配置
- false: 禁用自定义滚动条
- true: 启用默认配置的自定义滚动条
- ScrollbarOptions: 启用并配置自定义滚动条

```ts
scrollbar?: boolean | {
  /** 是否启用滚动条 */
  enabled?: boolean;
  /** 垂直滚动条宽度 default: 8 */
  width?: number;
  /** 水平滚动条高度 default: 8 */
  height?: number;
  /** 滚动条滑块最小宽度 default: 20 */
  minWidth?: number;
  /** 滚动条滑块最小高度 default: 20 */
  minHeight?: number;
};
```

### treeConfig

树形配置

```ts
treeConfig?: {
  /** 默认展开所有树节点 */
  defaultExpandAll?: boolean;
  /** 默认展开的节点key */
  defaultExpandKeys?: UniqKey[];
  /** 默认展开到第几层 */
  defaultExpandLevel?: number;
  /** 是否开启子节点懒加载，默认 false <Badge type="tip" text="^1.2.7" /> */
  lazy?: boolean;
  /** 懒加载取数函数，返回 resolve 为子行数组的 Promise <Badge type="tip" text="^1.2.7" /> */
  loadMethod?: (row: DT, col: StkTableColumn<DT>) => Promise<DT[]>;
  /** 懒加载下判定“行是否有子节点”的字段名，默认 'hasChildren' <Badge type="tip" text="^1.2.7" /> */
  hasChildField?: string;
  /** 懒加载取数失败（Promise reject）时的回调 <Badge type="tip" text="^1.2.7" /> */
  onLoadError?: (error: unknown, row: DT, col: StkTableColumn<DT>) => void;
  /** 是否在 tree-node 列缩进区域按层级绘制竖向引导线，默认 false <Badge type="tip" text="^1.2.7" /> */
  showGuide?: boolean;
};
```

::: tip 懒加载（`lazy`）
- 开启后，展开一个“标记有子节点但尚未加载”的行时，组件调用 `loadMethod(row, col)` 拉取子节点，resolve 后自动并入展平数据；使用方只需提供取数函数。
- 可展开判定：行 `children` 已存在 **或** `row[hasChildField]`（默认 `hasChildren`）为真时显示展开箭头，两者皆无视为叶子节点。
- 加载期间行上会注入 `@private` 字段 `__T_LOADING__`，对应**整行（`<tr>`）**附 `is-tree-loading` 类名并在箭头位置显示内置 loading 图标；加载成功缓存（不重复请求），失败则保持折叠可重试并触发 `onLoadError`。
- `lazy` 为真时，`defaultExpandAll` / `defaultExpandLevel` 与 `setTreeExpand(..., { all: true } / { level })` 遇到未加载分支即停止展开，不会隐式发起链式加载；`setTreeExpand(row, { parents: true })` 则会按需链式 `await loadMethod` 加载未加载的祖先。

详见[树形 - 懒加载子节点](/main/table/basic/tree.html#懒加载子节点)。
:::

::: tip 层级引导线（`showGuide`）
- 开启后，`tree-node` 列在每行缩进区域按层级各绘制一根竖向引导线，帮助识别子行所属层级；只覆盖祖先各格，行自身的控件格不画线；默认 `false`，关闭时保持既有纯缩进行为。
- 引导线为“每层级一根贯穿竖线”风格，并非精确的 last-child 截断 / T 型树连接线。
- 外观可用 CSS 变量覆盖：`--tree-guide-color`（颜色）、`--tree-guide-width`（线宽，默认 `1px`）、`--tree-guide-mask`（虚线遮罩，默认 `none` 即实线，设为纵向 repeating 渐变取交集画虚线，如 `repeating-linear-gradient(to bottom, #000 0 4px, transparent 4px 8px)`），暗色主题有各自默认值。
- 换更宽的箭头/图标时覆盖 `--tree-indent-width`（默认 `16px`），缩进格、控件占位格与引导线步长会一起缩放。`tree-node` 列配 `customCell` 整格自绘（含文件夹开合图标示例）见[文件管理树](/demos/file-tree)。

详见[树形 - 层级引导线](/main/table/basic/tree.html#层级引导线)。
:::

### experimental

实验性功能配置

```ts
experimental?: {
  /** 使用 transform 模拟滚动 */
  scrollY?: boolean;
};
```

### footerData

表格底部合计行数据

```ts
footerData?: DT[];
```
