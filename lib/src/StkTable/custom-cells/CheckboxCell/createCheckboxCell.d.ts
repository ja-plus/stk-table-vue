/** createCheckboxCell 配置选项 */
export interface createCheckboxCellOptions<T = any> {
    /**
     * 行数据中表示选中状态的字段名
     * @default '_isChecked'
     */
    field?: string;
    /**
     * 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox）
     * 不传则使用原生 input[type=checkbox]
     */
    checkboxComponent?: any;
    /**
     * 树形数据（children）下开启勾选级联：勾选父行会递归勾选/取消全部子孙行；
     * 父行勾选态由子孙推导（全部子孙勾选才视为勾选，部分勾选时父行显示半选态）；
     * 表头全选/半选按叶子行（无 children 的行）统计，父行不重复计数。
     * 关闭时各行勾选状态相互独立（默认，向后兼容）。
     * en: Enable checkbox cascade for tree data (children): checking a parent cascades to all
     * descendants, parent state is derived from children (indeterminate when partially checked),
     * and the header counts leaf rows only. Default false keeps row states independent.
     * @default false
     */
    cascade?: boolean;
    /**
     * 单元格 checkbox 状态变更回调
     * @param checked 是否选中
     * @param row 当前行数据（cascade 模式下为用户实际点击的行，级联写入的行不单独回调）
     */
    onChange?: (checked: boolean, row: T) => void;
    /**
     * 全选 checkbox 状态变更回调
     * @param checked 是否全选
     */
    onSelectAll?: (checked: boolean) => void;
}
/**
 * Checkbox 工厂函数
 *
 * 用于快速创建多选框单元格和表头单元格组件。
 *
 * @param options 配置选项
 * @returns 包含 CheckboxCell 和 CheckboxAllCell 组件的对象
 *
 * @example
 * ```ts
 * const { CheckboxCell, CheckboxAllCell } = createCheckboxCell({
 *   field: '_isChecked',
 *   onChange: (checked, row) => { row._isChecked = checked },
 * });
 *
 * const columns = [
 *   {
 *     dataIndex: 'checkbox',
 *     width: 50,
 *     customCell: CheckboxCell,
 *     customHeaderCell: CheckboxAllCell,
 *   },
 *   // ...other columns
 * ];
 * ```
 */
export declare function createCheckboxCell<T extends Record<string, any> = any>(options?: createCheckboxCellOptions<T>): {
    CheckboxCell: () => import('vue').Raw<import('vue').DefineComponent<{
        row: any;
        col: import('../..').StkTableColumn<any>;
        cellValue: any;
        rowIndex: number;
        colIndex: number;
        expanded?: import('../..').StkTableColumn<any> | undefined;
        treeExpanded?: boolean | undefined;
        level?: number | undefined;
        expandable?: boolean | undefined;
        treeLoading?: boolean | undefined;
        showGuide?: boolean | undefined;
    }, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
        row: any;
        col: import('../..').StkTableColumn<any>;
        cellValue: any;
        rowIndex: number;
        colIndex: number;
        expanded?: import('../..').StkTableColumn<any> | undefined;
        treeExpanded?: boolean | undefined;
        level?: number | undefined;
        expandable?: boolean | undefined;
        treeLoading?: boolean | undefined;
        showGuide?: boolean | undefined;
    }> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>>;
    CheckboxAllCell: () => import('vue').Raw<import('vue').DefineComponent<{
        col?: any;
        rowIndex?: any;
        colIndex?: any;
    }, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
        col?: any;
        rowIndex?: any;
        colIndex?: any;
    }> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>>;
};
