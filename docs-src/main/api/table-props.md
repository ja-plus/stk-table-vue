# Table Props 表格配置

```ts
export type StkProps = {
  width?: string;
  /** 最小表格宽度 @deprecated 0.9.1 使用css选择器`.stk-table-main`设置*/
  minWidth?: string;
  /** 表格最大宽度 @deprecated 0.9.1 使用css选择器`.stk-table-main`设置*/
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
    expectedHeight?: number | ((row: DT) => number);
  };
  /** 是否高亮鼠标悬浮的行 */
  rowHover?: boolean;
  /** 是否高亮选中的行 boolean | RowActiveOption */
  rowActive?: boolean | {
    /** 是否启用行选中功能 default: true */
    enabled?: boolean;
    /** 是否禁用行选中 default: () => false */
    disabled?: (row: DT) => boolean;
    /** 是否可以取消选中 default: true */
    revokable?: boolean;
  };
  /** 表头行高。default = rowHeight */
  headerRowHeight?: number | null;
  /** 虚拟滚动 */
  virtual?: boolean;
  /** x轴虚拟滚动(必须设置列宽)*/
  virtualX?: boolean;
  /** 
   * 表格列配置 
   * 
   * 浅层监听，变更时请修改其引用
   */
  columns?: StkTableColumn<any>[];
  /** 
   * 数据源 
   * 
   * 浅层监听，变更时请修改其引用
   */
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
  /** 是否启用单元格范围选中（拖拽选区） */
  cellSelection?: boolean | {
    /**
     * 复制时的单元格文本格式化回调。
     * 如果你使用了 customCell 自定义渲染，应该提供此回调以确保复制内容与展示内容一致。
     * @param row 行数据
     * @param col 列配置
     * @param rawValue row[col.dataIndex] 的原始值
     * @returns 复制到剪贴板的文本
     */
    formatCellForClipboard?: (row: DT, col: StkTableColumn<DT>, rawValue: any) => string;
  };
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
   * - default: chrome < 85 || chrome > 120 ? true : false
   * - false: 使用 wheel 事件滚动。为了防止滚动过快导致白屏。
   * - true: 不使用 wheel 事件滚动。滚轮滚动时更加平滑。滚动过快时会白屏。
   */
  smoothScroll?: boolean;
  /**
   * 按整数行纵向滚动
   * - scrollbar：仅拖动滚动条生效,可用于处理拖动白屏问题(v0.7.2)
   */
  scrollRowByRow?: boolean | 'scrollbar';
  /**
   * 自定义滚动条配置
   * - false: 禁用自定义滚动条
   * - true: 启用默认配置的自定义滚动条
   * - ScrollbarOptions: 启用并配置自定义滚动条
   */
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
};
```