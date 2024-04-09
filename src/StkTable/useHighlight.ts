import { interpolateRgb } from 'd3-interpolate';
import { Ref, computed } from 'vue';
import { HIGHLIGHT_CELL_CLASS, HIGHLIGHT_COLOR, HIGHLIGHT_DURATION, HIGHLIGHT_FREQ, HIGHLIGHT_ROW_CLASS } from './const';
import { HighlightConfig, UniqKey } from './types';

type Params = {
    props: any;
    stkTableId: string;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
};
/** 存放高亮行信息 */
type HighlightDimRowStore = {
    /** 动画开始时间戳 */
    readonly ts: number;
    /** 行是否可见 */
    visible: boolean;
    /** 动画关键帧 */
    keyframe: Parameters<Animatable['animate']>['0'];
    /** 动画初始持续时间 */
    readonly duration: number;
};

/**
 * 高亮单元格，行
 */
export function useHighlight({ props, stkTableId, tableContainerRef }: Params) {
    const config: HighlightConfig = props.highlightConfig;

    /** 持续时间 */
    const highlightDuration = config.duration ? config.duration * 1000 : HIGHLIGHT_DURATION;
    /** 高亮频率（仅虚拟滚动生效） */
    const highlightFrequency = config.fps ? 1000 / config.fps : HIGHLIGHT_FREQ;
    /** 高亮颜色 */
    const highlightColor = {
        light: HIGHLIGHT_COLOR.light,
        dark: HIGHLIGHT_COLOR.dark,
    };

    /** css 高亮的次数，用于css animation steps() */
    const highlightSteps = Math.round(highlightDuration / highlightFrequency);
    /** 高亮开始 */
    const highlightFrom = computed(() => highlightColor[props.theme as 'light' | 'dark'].from);
    /** 高亮结束 */
    const highlightTo = computed(() => highlightColor[props.theme as 'light' | 'dark'].to);
    const highlightInter = computed(() => interpolateRgb(highlightFrom.value, highlightTo.value));

    /**
     * 存放高亮行的状态-使用js计算颜色
     * @key 行唯一键
     * @value 记录高亮开始时间
     */
    const highlightDimRowsJs = new Map<UniqKey, number>();
    /** 是否正在计算高亮行的循环-使用js计算颜色 */
    let calcHighlightDimLoopJs = false;
    /**
     * 存放高亮行的状态-使用animation api实现
     * @key 行唯一键
     * @value 记录高亮配置
     */
    const highlightDimRowsAnimation = new Map<UniqKey, HighlightDimRowStore>();
    /** 是否正在计算高亮行的循环-使用animation api实现 */
    let calcHighlightDimLoopAnimation = false;

    /** 高亮后渐暗的行定时器 */
    const highlightDimRowsTimeout = new Map();
    /** 高亮后渐暗的单元格定时器 */
    const highlightDimCellsTimeout = new Map();

    /**
     * 计算高亮渐暗颜色的循环
     */
    function calcRowHighlightLoop() {
        if (calcHighlightDimLoopAnimation) return;
        calcHighlightDimLoopAnimation = true;
        const recursion = () => {
            window.requestAnimationFrame(
                () => {
                    const nowTs = Date.now();
                    highlightDimRowsAnimation.forEach((store, rowKeyValue) => {
                        const { ts, duration } = store;
                        const timeOffset = nowTs - ts;
                        if (nowTs - ts < duration) {
                            updateRowBgc(rowKeyValue, store, timeOffset);
                        } else {
                            highlightDimRowsAnimation.delete(rowKeyValue);
                        }
                    });

                    if (highlightDimRowsAnimation.size > 0) {
                        // 还有高亮的行,则下一次循环
                        recursion();
                    } else {
                        // 没有则停止循环
                        calcHighlightDimLoopAnimation = false;
                        highlightDimRowsAnimation.clear();
                    }
                } /* , highlightFrequency */,
            );
        };
        recursion();
    }

    /**
     * js计算高亮渐暗颜色的循环
     */
    function calcRowHighlightLoopJs() {
        if (calcHighlightDimLoopJs) return;
        calcHighlightDimLoopJs = true;
        // js计算gradient
        const recursion = () => {
            window.setTimeout(() => {
                const nowTs = Date.now();
                highlightDimRowsJs.forEach((highlightStart, rowKeyValue) => {
                    /** 经过的时间 ÷ 高亮持续时间 计算出 颜色过渡进度 (0-1) */
                    const progress = (nowTs - highlightStart) / highlightDuration;
                    let bgc = '';
                    if (0 <= progress && progress <= 1) {
                        bgc = highlightInter.value(progress);
                    } else {
                        highlightDimRowsJs.delete(rowKeyValue);
                    }
                    updateRowBgcJs(rowKeyValue, bgc);
                });

                if (highlightDimRowsJs.size > 0) {
                    // 还有高亮的行,则下一次循环
                    recursion();
                } else {
                    // 没有则停止循环
                    calcHighlightDimLoopJs = false;
                    highlightDimRowsJs.clear(); // TODO: 是否需要 清除
                }
            }, highlightFrequency);
        };
        recursion();
    }

    /** 高亮函数的默认参数 */
    const defaultHighlightDimOption = {
        keyframe: [{ backgroundColor: highlightFrom.value }, { backgroundColor: highlightTo.value }],
        duration: highlightDuration,
    };

    /**
     *  高亮一个单元格
     * @param rowKeyValue 一行的key
     * @param dataIndex 列key
     * @param options.method css-使用css渲染，animation-使用animation api。默认css;
     * @param option.className 自定义css动画的class。
     * @param option.keyframe 同Keyframe https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
     * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。
     */
    function setHighlightDimCell(
        rowKeyValue: string,
        dataIndex: string,
        option: { className?: string; method?: 'css' | 'animation'; keyframe?: Parameters<Animatable['animate']>['0']; duration?: number } = {},
    ) {
        // TODO: 支持动态计算高亮颜色。不易实现。需记录每一个单元格的颜色情况。
        const cellEl = tableContainerRef.value?.querySelector<HTMLElement>(`[data-row-key="${rowKeyValue}"]>[data-index="${dataIndex}"]`);
        const { className, method, duration, keyframe } = {
            className: HIGHLIGHT_CELL_CLASS,
            method: 'css',
            ...defaultHighlightDimOption,
            ...option,
        };
        if (!cellEl) return;
        if (method === 'animation') {
            cellEl.animate(keyframe, duration);
        } else {
            highlightCellsInCssKeyFrame(cellEl, rowKeyValue, className, duration);
        }
    }

    /**
     * 高亮一行
     * @param rowKeyValues 行唯一键的数组
     * @param option.method css-使用css渲染，animation-使用animation api，js-使用js计算颜色
     * @param option.className 自定义css动画的class。
     * @param option.keyframe 同Keyframe,无法控制帧率。 https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
     * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。。
     */
    function setHighlightDimRow(
        rowKeyValues: UniqKey[],
        option: {
            method?: 'css' | 'animation' | 'js';
            /** @deprecated 请使用method */
            useCss?: boolean;
            className?: string;
            keyframe?: Parameters<Animatable['animate']>['0'];
            duration?: number;
        } = {},
    ) {
        if (!Array.isArray(rowKeyValues)) rowKeyValues = [rowKeyValues];
        const { className, method, useCss, keyframe, duration } = {
            className: HIGHLIGHT_ROW_CLASS,
            method: props.virtual ? 'js' : 'css',
            ...defaultHighlightDimOption,
            ...option,
        };

        if (method === 'css' || useCss) {
            // -------- use css keyframe
            highlightRowsInCssKeyframe(rowKeyValues, className, duration);
        } else if (method === 'animation') {
            if (props.virtual) {
                // -------- 用animation 接口实现动画
                const nowTs = Date.now();
                for (let i = 0; i < rowKeyValues.length; i++) {
                    const rowKeyValue = rowKeyValues[i];
                    const store: HighlightDimRowStore = { ts: nowTs, visible: false, keyframe, duration };
                    highlightDimRowsAnimation.set(rowKeyValue, store);
                    updateRowBgc(rowKeyValue, store, 0);
                }
                calcRowHighlightLoop();
            } else {
                // -------- use Element.animate
                for (let i = 0; i < rowKeyValues.length; i++) {
                    const rowEl = document.getElementById(stkTableId + '-' + String(rowKeyValues[i])) as HTMLTableRowElement | null;
                    if (!rowEl) continue;
                    rowEl.animate(keyframe, duration);
                }
            }
        } else if (method === 'js') {
            // -------- 用js计算颜色渐变的高亮方案
            const nowTs = Date.now();
            for (let i = 0; i < rowKeyValues.length; i++) {
                const rowKeyValue = rowKeyValues[i];
                highlightDimRowsJs.set(rowKeyValue, nowTs);
                updateRowBgcJs(rowKeyValue, highlightFrom.value);
            }
            calcRowHighlightLoopJs();
        }
    }

    /**
     * 使用css @keyframes动画，实现高亮行动画
     * 此方案作为兼容方式。v0.3.0 将使用Element.animate 接口实现动画。
     */
    function highlightRowsInCssKeyframe(rowKeyValues: UniqKey[], className: string, duration: number) {
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

    /**
     * 使用css @keyframes动画，实现高亮单元格动画
     * 此方案作为兼容方式。v0.3.0 将使用Element.animate 接口实现动画。
     */
    function highlightCellsInCssKeyFrame(cellEl: HTMLElement, rowKeyValue: UniqKey, className: string, duration: number) {
        if (cellEl.classList.contains(className)) {
            cellEl.classList.remove(className);
            void cellEl.offsetHeight; // 通知浏览器重绘
        }
        cellEl.classList.add(className);
        window.clearTimeout(highlightDimCellsTimeout.get(rowKeyValue));
        highlightDimCellsTimeout.set(
            rowKeyValue,
            window.setTimeout(() => {
                cellEl.classList.remove(className);
                highlightDimCellsTimeout.delete(rowKeyValue);
            }, duration),
        );
    }

    /**
     *  更新行状态
     * @param rowKeyValue 行唯一键
     * @param store highlightDimRowStore 的引用对象
     * @param timeOffset 距动画开始经过的时长
     */
    function updateRowBgc(rowKeyValue: UniqKey, store: HighlightDimRowStore, timeOffset: number) {
        const rowEl = document.getElementById(stkTableId + '-' + String(rowKeyValue));
        const { visible, keyframe, duration: initialDuration } = store;
        if (!rowEl) {
            if (visible) {
                store.visible = false; // 标记为不可见
            }
            return;
        }
        // 只有元素 不可见 -> 可见 时才需要更新
        if (!visible) {
            store.visible = true; // 标记为可见
            /** 经过的时间 ÷ 高亮持续时间 计算出 颜色过渡进度 (0-1) */
            const iterationStart = timeOffset / initialDuration;
            rowEl.animate(keyframe, {
                duration: initialDuration - timeOffset,
                /** 从什么时候开始，0-1 */
                iterationStart,
                /** 持续多久 0-1 */
                iterations: 1 - iterationStart,
            });
        }
    }

    /** 更新行状态 */
    function updateRowBgcJs(rowKeyValue: UniqKey, color: string) {
        const rowEl = document.getElementById(stkTableId + '-' + String(rowKeyValue));
        if (!rowEl) return;
        rowEl.style.backgroundColor = color;
    }

    return {
        highlightSteps,
        setHighlightDimRow,
        setHighlightDimCell,
    };
}
