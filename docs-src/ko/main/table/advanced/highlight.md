# 행/셀 강조

이것은 테이블의 특색 기능으로, 실시간 데이터 업데이트 후 설정을 강조하여 사용자에게 알리는 데 사용됩니다.

인스턴스 메서드 `setHighlightDimRow` & `setHighlightDimCell`를 호출하면 행 또는 셀을 강조할 수 있습니다.

::: tip 
* 행/셀 강조, 기본값으로 `animation`(el.animate() 메서드로 애니메이션 트리거) 방식을 사용합니다. 커스텀 애니메이션을 원하시면 `option` 매개변수를 전달할 수 있습니다. `Animation API` 자세한 내용은 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API), [호환성 MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animate#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)을 참고하세요.
* 강조 색상이 테마에 따라 실시간으로 변경되지 않습니다.
* 강조가 작동하지 않나요? `props.rowKey`를 지정했는지 확인하세요.
:::


## 내장 강조 애니메이션

```ts
// 행 강조, 키 배열을 전달할 수 있으며 한 번에 여러 행을 강조할 수 있어 성능에 유리합니다
stkTableRef.value?.setHighlightDimRow(['id0']); 
// 셀 강조
stkTableRef.value?.setHighlightDimCell('id1', 'age');
```
<demo vue="advanced/highlight/Highlight.vue"></demo>

## 전역 설정 강조
`props.highlightConfig`

```ts
type HighlightConfig = {
    /** 지속 시간 */
    duration?: number;
    /** 강조 애니메이션 프레임레이트 */
    fps?: number;
}
```
::: tip
- 강조 프레임레이트를 낮추면 성능 향상에 도움이 됩니다.
- 애니메이션 프레임레이트를 지정하려면 Animation API의 `easing: 'step(xx)'` 구현을 참고하세요. (css animation-timing-function: step과 동일)
:::

::: warning
커스텀 키프레임을 설정하면 `HighlightConfig.fps`가 **失效됩니다**!
:::



## animation api를 통해 커스텀 강조 애니메이션 정의
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

## css를 통해 커스텀 강조 애니메이션 정의
이 api는旧版动画实现方式입니다. `css` 애니메이션의 **便捷함**, **호환성** 좋음, **이해하기 쉬움** 등의优点으로 인해 여전히 이 api를 유지합니다.

```ts
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'css',
    className: 'special-highlight-row',
    duration: 2000
});
```
:::warning
여기서 `duration`을 `2000`으로 설정하는 것은 애니메이션结束后요소에 있는 `class`를清除하기 위함이며, css 애니메이션 시간과 **일치해야 합니다**.
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

## ~~js를 통해 커스텀 강조 애니메이션 정의~~ (`v0.7.0`已废弃)
<details>
<summary>
    클릭하여 보기
</summary>
<pre>
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'js',
    duration: 2000
});
</pre>
사용을 권장하지 않습니다. 색상을手動計算해야 하고 성능이 좋지 않습니다. `d3-interpolate`에 의존합니다.
</details>


## API

### 행 강조  setHighlightDimRow
```ts
/**
 * 한 행 강조
 * @param rowKeyValues 행 고유 키의 배열
 * @param option.method css-css 렌더링 사용, animation-animation API 사용. 기본값 animation
 * @param option.className 커스텀 css 애니메이션 클래스.
 * @param option.keyframe 커스텀 키프레임 설정 시 highlightConfig.fps가失效됩니다.
 * @param option.duration 애니메이션 시간. method='css' 상태에서 class 제거용, className을 전달하면 커스텀 애니메이션 시간과一致해야 합니다.
 */
setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {}): void;
```

### 셀 강조 setHighlightDimCell
```ts
/**
 * 하나의 셀 강조. 가상 스크롤 강조 상태 기억은 아직 미지원.
 * @param rowKeyValue 행의 키
 * @param colKeyValue 열 키
 * @param options.method css-css 렌더링 사용, animation-animation API 사용. 기본값 animation;
 * @param option.className 커스텀 css 애니메이션 클래스.
 * @param option.keyframe 커스텀 키프레임 설정 시 highlightConfig.fps가失效됩니다.
 * @param option.duration 애니메이션 시간. method='css' 상태에서 class 제거용, className을 전달하면 커스텀 애니메이션 시간과一致해야 합니다.
 */
setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {}): void;
```

### 매개변수 타입

```ts
type HighlightDimBaseOption = {
    duration?: number;
};

type HighlightDimAnimationOption = HighlightDimBaseOption & {
    /** Animation API 사용 */
    method: 'animation';
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats와 동일
     */
    keyframe?: Parameters<Animatable['animate']>['0'];
};
type HighlightDimCssOption = HighlightDimBaseOption & {
    method: 'css';
    /** css 애니메이션이 포함된 클래스 이름 */
    className?: string;
    /** className 제거 지연 시간 제어 */
    duration?: number;
};

export type HighlightDimCellOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;
export type HighlightDimRowOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;

```
