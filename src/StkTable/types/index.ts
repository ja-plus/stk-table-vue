import { Component, VNode } from 'vue';

type Sorter = boolean | Function;

export type StkTableColumn<T extends Record<string, any>> = {
  dataIndex: keyof T & string;
  title?: string;
  align?: 'right' | 'left' | 'center';
  headerAlign?: 'right' | 'left' | 'center';
  sorter?: Sorter;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  headerClassName?: string;
  className?: string;
  sortField?: keyof T;
  sortType?: 'number' | 'string';
  fixed?: 'left' | 'right' | null;

  /** private */ rowSpan?: number;
  /** private */ colSpan?: number;
  customCell?: Component | VNode;
  customHeaderCell?: Component | VNode;
  children?: StkTableColumn<T>[];
};

export type SortOption = Pick<StkTableColumn<any>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>;

export type SortState = {
  dataIndex: string;
  order: null | 'asc' | 'desc';
  sortType?: 'number' | 'string';
};

export type UniqKey = string | ((param: any) => string);

export type StkProps = Partial<{
  width: string;

  /** 最小表格宽度 */
  minWidth: string;

  /** 表格最大宽度*/
  maxWidth: string;

  /** 是否隐藏表头 */
  headless: boolean;

  /** 主题，亮、暗 */
  theme: 'light' | 'dark';

  /** 虚拟滚动 */
  virtual: boolean;

  /** x轴虚拟滚动 */
  virtualX: boolean;

  /** 表格列配置 */
  columns: StkTableColumn<any>[];

  /** 表格数据源 */
  dataSource: any[];

  /** 行唯一键 */
  rowKey: UniqKey;

  /** 列唯一键 */
  colKey: UniqKey;

  /** 空值展示文字 */
  emptyCellText: string;

  /** 暂无数据兜底高度是否撑满 */
  noDataFull: boolean;

  /** 是否展示暂无数据 */
  showNoData: boolean;

  /** 是否服务端排序，true则不排序数据 */
  sortRemote: boolean;

  /** 表头是否溢出展示... */
  showHeaderOverflow: boolean;

  /** 表体溢出是否展示... */
  showOverflow: boolean;

  /** 是否增加行hover class */
  showTrHoverClass: boolean;

  /** 表头是否可拖动 */
  headerDrag: boolean;

  /**
   * 给行附加className<br>
   * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
   */
  rowClassName: (row: any, i: number) => string;

  /**
   * 列宽是否可拖动<br>
   * **不要设置**列minWidth，**必须**设置width<br>
   * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
   */
  colResizable: boolean;

  /** 可拖动至最小的列宽 */
  colMinWidth: number;
}>;
