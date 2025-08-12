# Highlight Row, Cell

This is a distinctive feature of the table, used to set highlights after real-time data updates to alert users.

You can highlight rows or cells by calling the instance methods `setHighlightDimRow` & `setHighlightDimCell`.

::: tip 
* Highlighted rows and cells use `animation` (el.animate() method to trigger animation) by default. To customize the animation, you can pass the `option` parameter. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) for `Animation API` details, and [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#browser_compatibility) for compatibility.
* Highlight colors do not change in real-time with the theme.
* Highlight not working? Check if `props.rowKey` is specified.
:::


## Built-in Highlight Animation

```ts
// Highlight rows, can pass an array of keys to highlight multiple rows at once for better performance
stkTableRef.value?.setHighlightDimRow(['id0']); 
// Highlight cell
stkTableRef.value?.setHighlightDimCell('id1', 'age');
```
<demo vue="advanced/highlight/Highlight.vue"></demo>

## Global Highlight Configuration
`props.highlightConfig`

```ts
type HighlightConfig = {
    /** Duration */
    duration?: number;
    /** Highlight animation frame rate */
    fps?: number;
}

```
::: tip
- Reducing the highlight frame rate is beneficial for performance.
- If you want to specify the animation frame rate, refer to the `easing: 'step(xx)'` implementation of the Animation API. (Same as CSS animation-timing-function: step)
:::

::: warning
If you customize the keyframe, `HighlightConfig.fps` **will be invalid**!
:::



## Custom Highlight Animation via Animation API
```ts
stkTableRef.value?.setHighlightDimRow([id], {
    keyframe: [
        { backgroundColor: '#1e4c99', transform: 'translateY(-30px) scale(0.6)', opacity: 0, easing: 'cubic-bezier(.11,.1,.03,.98)' },
        { backgroundColor: '#1B1B24', transform: 'translateY(0) scale(1)', opacity: 1 },
    ],
    duration: 1000,
});

stkTableRef.value?.setHighlightDimCell('id1', 'age', {
    keyframe: {
        color: ['#fff', '#C70000', '#fff'],
        transform: ['scale(1)', 'scale(1.1)', 'scale(1)'],
        boxShadow: ['unset', '0 0 10px #aaa', 'unset'],
        easing: 'cubic-bezier(.11,.1,.03,.98)',
    },
});
```

<demo vue="advanced/highlight/HighlightAnimation.vue"></demo>

## Custom Highlight Animation via CSS
This API is an older animation implementation method. It is still retained due to the advantages of `css` animations such as **convenience**, **good compatibility**, and **ease of understanding**.

```ts
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'css',
    className: 'special-highlight-row',
    duration: 2000
});
```
:::warning
Here `duration` is set to `2000` to clear the `class` from the element after the animation ends, which needs to be **consistent** with the CSS animation duration.
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

## ~~Custom Highlight Animation via JS~~ (deprecated in `v0.7.0`)
<details>
<summary>
    Click to view
</summary>
<pre>
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'js',
    duration: 2000
});
</pre>
Not recommended as it requires manual color calculation and has poor performance. Depends on `d3-interpolate`.
</details>


## API

### Highlight Row  setHighlightDimRow
```ts
/**
 * Highlight a row
 * @param rowKeyValues Array of unique row keys
 * @param option.method css-use css rendering, animation-use animation api. Default animation
 * @param option.className Custom css animation class.
 * @param option.keyframe If custom keyframe is provided, highlightConfig.fps will be invalid.
 * @param option.duration Animation duration. In 'css' method, used to remove class, needs to be consistent with custom animation duration if className is provided.
 */
setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {}): void;
```

### Highlight Cell setHighlightDimCell
```ts
/**
 * Highlight a cell. Virtual scroll highlight state memory is not supported yet.
 * @param rowKeyValue Row key
 * @param colKeyValue Column key
 * @param options.method css-use css rendering, animation-use animation api. Default animation;
 * @param option.className Custom css animation class.
 * @param option.keyframe If custom keyframe is provided, highlightConfig.fps will be invalid.
 * @param option.duration Animation duration. In 'css' method, used to remove class, needs to be consistent with custom animation duration if className is provided.
 */
setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {}): void;
```
### Parameter Types

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

export type HighlightDimCellOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;
export type HighlightDimRowOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;

```
