/** createEditableCell 配置选项 */
export interface CreateEditableCellOptions {
    /** 触发编辑的事件，默认 'dblclick' */
    trigger?: 'dblclick' | 'click';
    /** 值变更回调 */
    onChange?: (newValue: any, row: Record<string, any>, dataIndex: string) => void;
}
/**
 * 可编辑单元格工厂函数
 * @param option 配置选项
 * @returns EditableCell 组件
 */
export declare function createEditableCell(option?: CreateEditableCellOptions): {
    EditableCell: () => import('vue').Raw<import('vue').DefineComponent<{
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
};
