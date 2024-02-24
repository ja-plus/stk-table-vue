import { interpolateRgb } from 'd3-interpolate';
import { Ref, computed, ref } from 'vue';
import { Highlight_Color, Highlight_Color_Change_Freq, Highlight_Duration } from './const';
import { UniqKey } from './types';

type Params = {
    props: { theme: 'light' | 'dark'; virtual: boolean; dataSource: any[] };
    tableContainer: Ref<HTMLElement | undefined>;
};

/** 高亮行保存的东西 */
type HighlightRowStore = {
    bgc: string;
    bgc_progress_ms: number;
    bgc_progress: number;
};

/** 高亮行class */
const HIGHLIGHT_ROW_CLASS = 'highlight-row';
/** 高连单元格class */
const HIGHLIGHT_CELL_CLASS = 'highlight-cell';

/**
 * 高亮单元格，行
 * row中新增_bgc_progress_ms 属性控制高亮状态,_bgc控制颜色
 */
export function useHighlight({ props, tableContainer }: Params) {
    /**
     * 高亮行记录 key-rowKey, value-obj
     */
    const highlightRowStore = ref<Record<UniqKey, HighlightRowStore>>({});

    const highlightFrom = Highlight_Color[props.theme].from;
    const highlightTo = Highlight_Color[props.theme].to;
    const highlightInter = computed(() => interpolateRgb(highlightFrom, highlightTo));

    /** 存放高亮行的key*/
    const highlightDimRowKeys = new Set<UniqKey>();
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
    function calcHighlightLoop() {
        if (calcHighlightDimLoop) return;
        calcHighlightDimLoop = true;
        // js计算gradient
        // raf 太频繁。TODO: 考虑setTimeout分段设置颜色，过渡靠css transition 补间
        const recursion = () => {
            window.setTimeout(() => {
                const nowTs = Date.now();

                highlightDimRowKeys.forEach(rowKeyValue => {
                    //   const rowKeyValue = rowKeyGen(row);
                    //   const rowEl = tableContainer.value?.querySelector<HTMLElement>(`[data-row-key="${rowKeyValue}"]`);
                    //   if (rowEl && row._bgc_progress === 0) {
                    //     // 开始css transition 补间
                    //     rowEl.classList.remove('highlight-row-transition');
                    //     void rowEl.offsetHeight; // reflow
                    //     rowEl.classList.add('highlight-row-transition');
                    //   }
                    const highlightItem = highlightRowStore.value[rowKeyValue];
                    /** 经过的时间 ÷ 高亮持续时间 计算出 颜色过渡进度 (0-1) */
                    const progress = (nowTs - highlightItem.bgc_progress_ms) / Highlight_Duration;
                    if (0 < progress && progress < 1) {
                        highlightItem.bgc = highlightInter.value(progress);
                    } else {
                        highlightItem.bgc = ''; // 清空颜色
                        highlightDimRowKeys.delete(rowKeyValue);
                    }
                });

                if (highlightDimRowKeys.size > 0) {
                    // 还有高亮的行,则下一次循环
                    recursion();
                } else {
                    // 没有则停止循环
                    calcHighlightDimLoop = false;
                }
            }, Highlight_Color_Change_Freq);
        };
        recursion();
    }

    /** 高亮一个单元格 */
    function setHighlightDimCell(rowKeyValue: string, dataIndex: string) {
        // TODO: 支持动态计算高亮颜色。不易实现。需记录每一个单元格的颜色情况。
        const cellEl = tableContainer.value?.querySelector<HTMLElement>(`[data-row-key="${rowKeyValue}"]>[data-index="${dataIndex}"]`);
        if (!cellEl) return;
        if (cellEl.classList.contains(HIGHLIGHT_CELL_CLASS)) {
            cellEl.classList.remove(HIGHLIGHT_CELL_CLASS);
            void cellEl.offsetHeight; // 通知浏览器重绘
        }
        cellEl.classList.add(HIGHLIGHT_CELL_CLASS);
        window.clearTimeout(highlightDimCellsTimeout.get(rowKeyValue));
        highlightDimCellsTimeout.set(
            rowKeyValue,
            window.setTimeout(() => {
                cellEl.classList.remove(HIGHLIGHT_CELL_CLASS);
                highlightDimCellsTimeout.delete(rowKeyValue);
            }, Highlight_Duration),
        );
    }

    /**
     * 高亮一行
     * @param rowKeyValues
     */
    function setHighlightDimRow(rowKeyValues: UniqKey[]) {
        if (!Array.isArray(rowKeyValues)) rowKeyValues = [rowKeyValues];
        if (props.virtual) {
            // --------虚拟滚动用js计算颜色渐变的高亮方案
            const nowTs = Date.now(); // 重置渐变进度
            for (let i = 0; i < rowKeyValues.length; i++) {
                const rowKeyValue = rowKeyValues[i];
                highlightRowStore.value[rowKeyValue] = {
                    bgc: '',
                    bgc_progress: 0,
                    bgc_progress_ms: nowTs,
                };
                highlightDimRowKeys.add(rowKeyValue);
            }
            calcHighlightLoop();
        } else {
            // -------- 普通滚动用css @keyframes动画，实现高亮
            /**是否需要重绘 */
            let needRepaint = false;

            const rowElTemp: HTMLTableRowElement[] = [];
            for (let i = 0; i < rowKeyValues.length; i++) {
                const rowKeyValue = rowKeyValues[i];
                const rowEl = tableContainer.value?.querySelector<HTMLTableRowElement>(`[data-row-key="${rowKeyValue}"]`);
                if (!rowEl) continue;
                if (rowEl.classList.contains(HIGHLIGHT_ROW_CLASS)) {
                    rowEl.classList.remove(HIGHLIGHT_ROW_CLASS);
                    needRepaint = true;
                }
                rowElTemp.push(rowEl);
                // 动画结束移除class
                window.clearTimeout(highlightDimRowsTimeout.get(rowKeyValue));
                highlightDimRowsTimeout.set(
                    rowKeyValue,
                    window.setTimeout(() => {
                        rowEl.classList.remove(HIGHLIGHT_ROW_CLASS);
                        highlightDimRowsTimeout.delete(rowKeyValue); // 回收内存
                    }, Highlight_Duration),
                );
            }
            if (needRepaint) {
                void tableContainer.value?.offsetWidth; //强制浏览器重绘
            }
            rowElTemp.forEach(el => el.classList.add(HIGHLIGHT_ROW_CLASS)); // 统一添加动画
        }
    }

    return {
        highlightRowStore,
        setHighlightDimRow,
        setHighlightDimCell,
    };
}
