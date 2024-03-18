import { interpolateRgb } from 'd3-interpolate';
import { Ref, computed } from 'vue';
import { HIGHLIGHT_CELL_CLASS, HIGHLIGHT_COLOR, HIGHLIGHT_DURATION, HIGHLIGHT_FREQ, HIGHLIGHT_ROW_CLASS } from './const';
import { HighlightConfig, UniqKey } from './types';

type Params = {
    props: any;
    stkTableId: string;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
};

/**
 * 高亮单元格，行
 */
export function useHighlight({ props, stkTableId, tableContainerRef }: Params) {
    const config: HighlightConfig = props.highlightConfig;

    /** 持续时间 */
    const duration = config.duration ? config.duration * 1000 : HIGHLIGHT_DURATION;
    /** 频率 */
    const frequency = config.fps ? 1000 / config.fps : HIGHLIGHT_FREQ;
    const highlightColor = {
        light: Object.assign(HIGHLIGHT_COLOR.light, config.color?.light),
        dark: Object.assign(HIGHLIGHT_COLOR.dark, config.color?.dark),
    };
    /** 高亮开始 */
    const highlightFrom = computed(() => highlightColor[props.theme as 'light' | 'dark'].from);
    /** 高亮结束 */
    const highlightTo = computed(() => highlightColor[props.theme as 'light' | 'dark'].to);
    const highlightInter = computed(() => interpolateRgb(highlightFrom.value, highlightTo.value));

    /**
     * 存放高亮行的状态
     * @key 行唯一键
     * @value 记录高亮开始时间
     */
    const highlightDimRows = new Map<UniqKey, number>();
    /** 高亮后渐暗的行定时器 */
    const highlightDimRowsTimeout = new Map();
    /** 高亮后渐暗的单元格定时器 */
    const highlightDimCellsTimeout = new Map();
    /** 是否正在计算高亮行的循环*/
    let calcHighlightDimLoop = false;

    /**
     * 计算高亮渐暗颜色的循环
     * FIXME: 相同数据源，相同引用的情况，将颜色值挂在数据源对象上，在多个表格使用相同数据源时会出问题。
     */
    function calcRowHighlightLoop() {
        if (calcHighlightDimLoop) return;
        calcHighlightDimLoop = true;
        // js计算gradient
        const recursion = () => {
            window.setTimeout(() => {
                const nowTs = Date.now();

                highlightDimRows.forEach((highlightStart, rowKeyValue) => {
                    //   const rowKeyValue = rowKeyGen(row);
                    //   const rowEl = tableContainerRef.value?.querySelector<HTMLElement>(`[data-row-key="${rowKeyValue}"]`);
                    //   if (rowEl && row._bgc_progress === 0) {
                    //     // 开始css transition 补间
                    //     rowEl.classList.remove('highlight-row-transition');
                    //     void rowEl.offsetHeight; // reflow
                    //     rowEl.classList.add('highlight-row-transition');
                    //   }
                    /** 经过的时间 ÷ 高亮持续时间 计算出 颜色过渡进度 (0-1) */
                    const progress = (nowTs - highlightStart) / duration;
                    let bgc = '';
                    if (0 < progress && progress < 1) {
                        bgc = highlightInter.value(progress);
                    } else {
                        highlightDimRows.delete(rowKeyValue);
                    }
                    updateRowBgc(rowKeyValue, bgc);
                });

                if (highlightDimRows.size > 0) {
                    // 还有高亮的行,则下一次循环
                    recursion();
                } else {
                    // 没有则停止循环
                    calcHighlightDimLoop = false;
                    highlightDimRows.clear();
                }
            }, frequency);
        };
        recursion();
    }

    /**
     *  高亮一个单元格
     * @param rowKeyValue 一行的key
     * @param dataIndex 列key
     * @param option.className 高亮类名
     */
    function setHighlightDimCell(rowKeyValue: string, dataIndex: string, option: { className?: string } = {}) {
        // TODO: 支持动态计算高亮颜色。不易实现。需记录每一个单元格的颜色情况。
        const cellEl = tableContainerRef.value?.querySelector<HTMLElement>(`[data-row-key="${rowKeyValue}"]>[data-index="${dataIndex}"]`);
        const opt = { className: HIGHLIGHT_CELL_CLASS, ...option };
        if (!cellEl) return;
        if (cellEl.classList.contains(opt.className)) {
            cellEl.classList.remove(opt.className);
            void cellEl.offsetHeight; // 通知浏览器重绘
        }
        cellEl.classList.add(opt.className);
        window.clearTimeout(highlightDimCellsTimeout.get(rowKeyValue));
        highlightDimCellsTimeout.set(
            rowKeyValue,
            window.setTimeout(() => {
                cellEl.classList.remove(opt.className);
                highlightDimCellsTimeout.delete(rowKeyValue);
            }, duration),
        );
    }

    /**
     * 高亮一行
     * @param rowKeyValues 行唯一键的数组
     * @param option.useCss 虚拟滚动时，高亮由js控制。如果仍想使用css 关键帧控制，则配置此项
     */
    function setHighlightDimRow(rowKeyValues: UniqKey[], option: { useCss?: boolean; className?: string } = {}) {
        if (!Array.isArray(rowKeyValues)) rowKeyValues = [rowKeyValues];
        const { className, useCss } = { className: HIGHLIGHT_ROW_CLASS, useCss: false, ...option };
        if (props.virtual && !useCss) {
            // --------虚拟滚动用js计算颜色渐变的高亮方案
            const nowTs = Date.now(); // 重置渐变进度
            for (let i = 0; i < rowKeyValues.length; i++) {
                const rowKeyValue = rowKeyValues[i];
                highlightDimRows.set(rowKeyValue, nowTs);
                updateRowBgc(rowKeyValue, highlightFrom.value);
            }
            calcRowHighlightLoop();
        } else {
            // -------- 普通滚动用css @keyframes动画，实现高亮
            /**是否需要重绘 */
            let needRepaint = false;

            const rowElTemp: HTMLTableRowElement[] = [];
            for (let i = 0; i < rowKeyValues.length; i++) {
                const rowKeyValue = rowKeyValues[i];
                const rowEl = document.getElementById(stkTableId + '-' + String(rowKeyValue)) as HTMLTableRowElement | null;
                if (!rowEl) continue;
                if (rowEl.classList.contains(className)) {
                    rowEl.classList.remove(className);
                    needRepaint = true;
                }
                rowElTemp.push(rowEl);
                // 动画结束移除class
                window.clearTimeout(highlightDimRowsTimeout.get(rowKeyValue));
                highlightDimRowsTimeout.set(
                    rowKeyValue,
                    window.setTimeout(() => {
                        rowEl.classList.remove(className);
                        highlightDimRowsTimeout.delete(rowKeyValue); // 回收内存
                    }, duration),
                );
            }
            if (needRepaint) {
                void tableContainerRef.value?.offsetWidth; //强制浏览器重绘
            }
            rowElTemp.forEach(el => el.classList.add(className)); // 统一添加动画
        }
    }

    /** 更新行状态 */
    function updateRowBgc(rowKeyValue: UniqKey, color: string) {
        const rowEl = document.getElementById(stkTableId + '-' + String(rowKeyValue));
        if (!rowEl) return;
        rowEl.style.backgroundColor = color;
    }

    return {
        highlightFrom,
        setHighlightDimRow,
        setHighlightDimCell,
    };
}
