# 高亮行、单元格

通过调用实例方法`setHighlightDimRow` & `setHighlightDimCell`，可以设置高亮行或高亮单元格。

::: tip 
高亮行、单元格，默认使用`animation`方式，如果需要自定义动画，可以传入`option`参数。

`Animation API` 详见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API)
:::

使用 el.animate() 方法触发动画，兼容性 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animate#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)

## 内置的高亮动画

```ts
// 高亮行，可传入key数组，一次性高亮多行，利于性能
stkTableRef.value?.setHighlightDimRow(['id0']); 
// 高亮单元格
stkTableRef.value?.setHighlightDimCell('id1', 'age');
```
<demo vue="advanced/highlight/Highlight.vue"></demo>

## 通过 animation api 自定义高亮动画
animation api 拥有较强的灵活性，推荐使用此方式自定义动画。

<demo vue="advanced/highlight/HighlightAnimation.vue"></demo>



## 通过css自定义高亮动画
此api为旧版动画实现方式。出于`css`动画的**便捷**、**兼容性**好、**易于理解**等优点，依然保留此api。

```ts
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'css',
    className: 'special-highlight-row',
    duration: 2000
});
```
:::warning
这里 `duration` 设置为 `2000` 是用于在动画结束后清除元素上的 `class`，需要与css动画时间**一致**。
:::
```css
@keyframes my-highlight-row {
    from { background-color: #bd7201; }
}
.special-highlight-row {
    animation: my-highlight-row 2s linear;
}

```
<demo vue="advanced/highlight/HighlightCss.vue"></demo>

## 通过js自定义高亮动画
```ts
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'js',
    duration: 2000
});
```
不推荐使用，因为需要手动计算颜色，且性能较差。依赖 `d3-interpolate`。在后续版本中，如果 `animation` 方式能满足所有需求，会将此api移除。


## API

### 高亮行  setHighlightDimRow
```ts
/**
 * 高亮一行
 * @param rowKeyValues 行唯一键的数组
 * @param option.method css-使用css渲染，animation-使用animation api，js-使用js计算颜色。默认animation
 * @param option.className 自定义css动画的class。
 * @param option.keyframe 同Keyframe。 https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。。
 */
setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {}): void;
```

### 高亮单元格 setHighlightDimCell
```ts
/**
 * 高亮一个单元格。暂不支持虚拟滚动高亮状态记忆。
 * @param rowKeyValue 一行的key
 * @param colKeyValue 列key
 * @param options.method css-使用css渲染，animation-使用animation api。默认animation;
 * @param option.className 自定义css动画的class。
 * @param option.keyframe 同Keyframe https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration 动画时长。method='css'状态下，用于移除class，如果传入了className则需要与自定义的动画时间一致。
 */
setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {}): void;
```
### 参数类型

```ts
type HighlightDimBaseOption = {
    duration?: number;
};

type HighlightDimAnimationOption = HighlightDimBaseOption & {
    /** use Animation API */
    method: 'animation';
    /**
     * same as https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
     */
    keyframe?: Parameters<Animatable['animate']>['0'];
};
type HighlightDimCssOption = HighlightDimBaseOption & {
    method: 'css';
    /** class name with css animation */
    className?: string;
    /** control delay time to remove className */
    duration?: number;
};
type HighlightDimJsOption = HighlightDimBaseOption & {
    /** use d3-interpolate js to change background color */
    method: 'js';
};

export type HighlightDimCellOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;
export type HighlightDimRowOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption | HighlightDimJsOption;

```
