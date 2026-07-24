import type { CustomCellProps, StkTableColumn } from '../../types';
import { defineComponent, h, markRaw } from 'vue';
import { formatNumber, type FormatNumberOptions } from '../utils/formatNumber';

/** createNumberCell 配置选项（等同于格式化选项） */
export interface CreateNumberCellOptions extends FormatNumberOptions {}

/**
 * 数字格式化单元格工厂函数
 *
 * 纯展示型单元格：将 `cellValue` 经 {@link formatNumber} 格式化为文本。
 * 数字对齐请在列配置上设置 `align: 'right'`。
 *
 * @param options 格式化选项
 * @returns
 * - `NumberCell` 组件构造函数，使用时需调用一次：`customCell: NumberCell()`
 * - `formatCopyText` 配套的复制文本格式化回调，挂到列上以保证复制内容与展示一致
 *
 * @example
 * ```ts
 * const { NumberCell, formatCopyText } = createNumberCell({ decimals: 2 });
 * const NumberCellComp = NumberCell();
 * const columns = [
 *   { title: '现价', dataIndex: 'price', align: 'right', customCell: NumberCellComp, formatCopyText },
 * ];
 * ```
 */
export function createNumberCell(options?: CreateNumberCellOptions) {
    /** 单元格组件 - 用于 customCell */
    function NumberCell() {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex', 'expanded', 'treeExpanded'],
                setup(props: CustomCellProps<any>) {
                    return () => h('span', { class: 'stk-number-cell' }, formatNumber(props.cellValue, options));
                },
            }),
        );
    }

    /** 复制文本格式化：保证区域选取/复制得到的文本与展示一致 */
    function formatCopyText(_row: Record<string, any>, _col: StkTableColumn<any>, rawValue: any) {
        return formatNumber(rawValue, options);
    }

    return {
        NumberCell,
        formatCopyText,
    };
}
