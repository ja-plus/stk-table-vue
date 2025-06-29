import { Ref, computed } from 'vue';
import { HIGHLIGHT_CELL_CLASS, HIGHLIGHT_COLOR, HIGHLIGHT_DURATION, HIGHLIGHT_ROW_CLASS } from './const';
import { HighlightConfig, UniqKey } from './types';
import { HighlightDimCellOption, HighlightDimRowOption } from './types/highlightDimOptions';
import { pureCellKeyGen } from './utils';

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

    /** 高亮颜色 */
    const highlightColor = {
        light: HIGHLIGHT_COLOR.light,
        dark: HIGHLIGHT_COLOR.dark,
    };
    /** 持续时间 */
    const highlightDuration = computed(() => (config.duration ? config.duration * 1000 : HIGHLIGHT_DURATION));
    /** 高亮频率*/
    const highlightFrequency = computed(() => (config.fps && config.fps > 0 ? 1000 / config.fps : null));
    /** 高亮帧数（非帧率），用于 timing-function: steps() */
    const highlightSteps = computed(() => (highlightFrequency.value ? Math.round(highlightDuration.value / highlightFrequency.value) : null));
    /** 高亮开始 */
    const highlightFrom = computed(() => highlightColor[props.theme as 'light' | 'dark'].from);

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

    /** 高亮函数的默认参数 */
    const defaultHighlightDimOption = computed(() => {
        const keyframe: PropertyIndexedKeyframes = { backgroundColor: [highlightFrom.value, ''] };
        if (highlightSteps.value) {
            keyframe.easing = `steps(${highlightSteps.value})`;
        }
        return { duration: highlightDuration.value, keyframe };
    });

    /**
     * 计算高亮渐暗颜色的循环
     */
    function calcRowHighlightLoop() {
        if (calcHighlightDimLoopAnimation) return;
        calcHighlightDimLoopAnimation = true;
        const recursion = () => {
            window.requestAnimationFrame(
                () => {
                    const nowTs = performance.now();
                    highlightDimRowsAnimation.forEach((store, rowKeyValue) => {
                        const { ts, duration } = store;
                        const timeOffset = nowTs - ts;
                        if (nowTs - ts < duration) {
                            updateRowAnimation(rowKeyValue, store, timeOffset);
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
     * 高亮一个单元格。暂不支持虚拟滚动高亮状态记忆。
     * @param rowKeyValue 一行的key
     * @param colKeyValue 列key
     * @param options.method css-使用css渲染，animation-使用animation api。默认animation;
     * @param option.className 自定义css动画的class。
     * @param option.keyframe 如果自定义keyframe，则 highlightConfig.fps 将会失效。Keyframe：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
     * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。
     */
    function setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {}) {
        const cellEl = tableContainerRef.value?.querySelector<HTMLElement>(`[data-cell-key="${pureCellKeyGen(rowKeyValue, colKeyValue)}"]`);
        if (!cellEl) return;
        const { className, method, duration, keyframe } = {
            className: HIGHLIGHT_CELL_CLASS,
            method: 'animation',
            ...defaultHighlightDimOption.value,
            ...option,
        };
        if (method === 'animation') {
            cellEl.animate(keyframe, duration);
        } else {
            highlightCellsInCssKeyFrame(cellEl, rowKeyValue, className, duration);
        }
    }

    /**
     * 高亮一行
     * @param rowKeyValues 行唯一键的数组
     * @param option.method css-使用css渲染，animation-使用animation api，js-使用js计算颜色。默认animation
     * @param option.className 自定义css动画的class。
     * @param option.keyframe 如果自定义keyframe，则 highlightConfig.fps 将会失效。Keyframe：https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats。
     * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。。
     */
    function setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {}) {
        if (!Array.isArray(rowKeyValues)) rowKeyValues = [rowKeyValues];
        if (!rowKeyValues.length) return;
        const { className, method, keyframe, duration } = {
            className: HIGHLIGHT_ROW_CLASS,
            method: 'animation',
            ...defaultHighlightDimOption.value,
            ...option,
        };

        if (method === 'animation') {
            if (props.virtual) {
                // -------- 用animation 接口实现动画
                const nowTs = performance.now();
                for (let i = 0; i < rowKeyValues.length; i++) {
                    const rowKeyValue = rowKeyValues[i];
                    const store: HighlightDimRowStore = { ts: nowTs, visible: false, keyframe, duration };
                    highlightDimRowsAnimation.set(rowKeyValue, store);
                    updateRowAnimation(rowKeyValue, store, 0);
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
        } else {
            // -------- use css keyframe
            highlightRowsInCssKeyframe(rowKeyValues, className, duration);
        }
    }

    /**
     * 使用css @keyframes动画，实现高亮行动画
     * 此方案作为兼容方式。v0.3.4 将使用Element.animate 接口实现动画。
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
     * 此方案作为兼容方式。v0.3.4 将使用Element.animate 接口实现动画。
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
    function updateRowAnimation(rowKeyValue: UniqKey, store: HighlightDimRowStore, timeOffset: number) {
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

    return {
        highlightSteps,
        setHighlightDimRow,
        setHighlightDimCell,
    };
}
