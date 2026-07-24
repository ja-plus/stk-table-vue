import type { CustomCellProps } from '../../types';
import { defineComponent, h, markRaw } from 'vue';
import { formatNumber, type FormatNumberOptions } from '../utils/formatNumber';

/** createChangeCell 配置选项 */
export interface CreateChangeCellOptions extends FormatNumberOptions {
    /** 涨跌颜色是否反转：false=A股(涨红跌绿，默认)，true=国际(涨绿跌红) */
    colorReverse?: boolean;
    /** 是否显示涨跌箭头 ▲/▼，默认 false */
    arrow?: boolean;
    /** 自定义上涨颜色（覆盖默认配色，传入后不受 colorReverse 影响） */
    riseColor?: string;
    /** 自定义下跌颜色 */
    fallColor?: string;
    /** 自定义平盘颜色 */
    flatColor?: string;
}

/** 涨跌方向：涨 / 跌 / 平（含空值） */
type ChangeDir = 'rise' | 'fall' | 'flat';

/** 根据原始值判断涨跌方向 */
function resolveDir(rawValue: any): ChangeDir {
    const num = rawValue === '' || rawValue == null ? NaN : Number(rawValue);
    if (Number.isNaN(num) || num === 0) return 'flat';
    return num > 0 ? 'rise' : 'fall';
}

/**
 * 涨跌单元格工厂函数
 *
 * 在 {@link formatNumber} 的基础上叠加涨跌染色与箭头。染色按 `cellValue` 正负判断，
 * 颜色方向可通过 `colorReverse` 切换（A股 / 国际），也可用 `riseColor` 等自定义。
 * 数字对齐请在列配置上设置 `align: 'right'`。
 *
 * @param options 格式化 + 染色/箭头选项
 * @returns `ChangeCell` 组件构造函数，使用时需调用一次：`customCell: ChangeCell()`
 *
 * @example
 * ```ts
 * const { ChangeCell } = createChangeCell({ decimals: 2, showSign: true, arrow: true });
 * const ChangeCellComp = ChangeCell();
 * const columns = [
 *   { title: '涨跌额', dataIndex: 'change', align: 'right', customCell: ChangeCellComp },
 * ];
 * ```
 */
export function createChangeCell(options: CreateChangeCellOptions = {}) {
    const { colorReverse = false, arrow = false, riseColor, fallColor, flatColor } = options;

    /** 单元格组件 - 用于 customCell */
    function ChangeCell() {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex', 'expanded', 'treeExpanded'],
                setup(props: CustomCellProps<any>) {
                    return () => {
                        const raw = props.cellValue;
                        const dir = resolveDir(raw);

                        // 颜色 class：涨=红/跌=绿（colorReverse 时互换），平=中性
                        let colorClass = 'stk-change-cell--flat';
                        if (dir === 'rise') colorClass = colorReverse ? 'stk-change-cell--green' : 'stk-change-cell--red';
                        else if (dir === 'fall') colorClass = colorReverse ? 'stk-change-cell--red' : 'stk-change-cell--green';

                        // 自定义颜色（若传）直接内联覆盖
                        const customColor = dir === 'rise' ? riseColor : dir === 'fall' ? fallColor : flatColor;

                        // 箭头：涨 ▲ / 跌 ▼，平及空值不显示
                        const arrowChar = arrow && dir !== 'flat' ? (dir === 'rise' ? '▲' : '▼') : ''; // TODO: 支持自定义箭头

                        return h(
                            'span',
                            {
                                class: ['stk-change-cell', colorClass],
                                style: customColor ? { color: customColor } : undefined,
                            },
                            [arrowChar ? h('span', { class: 'stk-change-cell__arrow' }, arrowChar) : null, formatNumber(raw, options)],
                        );
                    };
                },
            }),
        );
    }

    return {
        ChangeCell,
    };
}
