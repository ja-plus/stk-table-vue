import { FormatNumberOptions } from '../utils/formatNumber';

/** createNumberCell 配置选项（等同于格式化选项） */
export interface CreateNumberCellOptions extends FormatNumberOptions {
}
/**
 * 数字格式化单元格工厂函数
 *
 * 纯展示型单元格：将 `cellValue` 经 {@link formatNumber} 格式化为文本。
 * 数字对齐请在列配置上设置 `align: 'right'`。
 *
 * @param options 格式化选项
 * @returns `NumberCell` 组件构造函数，使用时需调用一次：`customCell: NumberCell()`
 *
 * @example
 * ```ts
 * const { NumberCell } = createNumberCell({ decimals: 2 });
 * const NumberCellComp = NumberCell();
 * const columns = [
 *   { title: '现价', dataIndex: 'price', align: 'right', customCell: NumberCellComp },
 * ];
 * ```
 */
export declare function createNumberCell(options?: CreateNumberCellOptions): {
    NumberCell: () => import('vue').Raw<import('vue').DefineComponent<{
        row: any;
        col: import('../..').StkTableColumn<any>;
        cellValue: any;
        rowIndex: number;
        colIndex: number;
        expanded?: import('../..').StkTableColumn<any> | undefined;
        treeExpanded?: boolean | undefined;
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
    }> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>>;
};
