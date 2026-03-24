# 行、セルをハイライト

これはテーブルの特徴的な機能で、リアルタイムデータ更新後にユーザーに警告するためにハイライトを設定するために使用されます。

インスタンスメソッド `setHighlightDimRow` & `setHighlightDimCell` を呼び出すことで、行またはセルをハイライトできます。

::: tip 
* ハイライトされた行とセルはデフォルトで `animation`（el.animate()メソッドを使用してアニメーションをトリガー）を使用します。アニメーションをカスタマイズするには、`option` パラメータを渡すことができます。[Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) の詳細と互換性については [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#browser_compatibility) を参照してください。
* ハイライト色はテーマとともにリアルタイムで変更されません。
* ハイライトが動作しませんか？`props.rowKey` が指定されているかどうかを確認してください。
:::


## 組み込みハイライトアニメーション

```ts
// 行をハイライト、複数の行を一度にハイライトするためのキーの配列を渡せます（パフォーマンス向上）
stkTableRef.value?.setHighlightDimRow(['id0']); 
// セルをハイライト
stkTableRef.value?.setHighlightDimCell('id1', 'age');
```
<demo vue="advanced/highlight/Highlight.vue"></demo>

## グローバルハイライト設定
`props.highlightConfig`

```ts
type HighlightConfig = {
    /** 継続時間 */
    duration?: number;
    /** ハイライトアニメーションフレームレート */
    fps?: number;
}

```
::: tip
- ハイライトフレームレートを下げるとパフォーマンスに有利です。
- アニメーショーフレームレートを指定したい場合は、Animation API の `easing: 'step(xx)'` 実装を参照してください。（CSS animation-timing-function: step と同じ）
:::

::: warning
キーフレームをカスタマイズすると、`HighlightConfig.fps` **は無効になります**！
:::


## Animation API を通じたカスタムハイライトアニメーション
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

## CSS を通じたカスタムハイライトアニメーション
このAPIは古いアニメーション実装方法です。**便利さ**、**良い互換性**、**理解のしやすさ**などの利点があり、まだ保持されています。

```ts
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'css',
    className: 'special-highlight-row',
    duration: 2000
});
```
:::warning
ここで `duration` を `2000` に設定して、アニメーション終了後に要素から `class` をクリアします。これはCSSアニメーション継続時間と**一致する必要があります**。
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

## ~~JS を通じたカスタムハイライトアニメーション~~（`v0.7.0` で非推奨）
<details>
<summary>
    クリックして表示
</summary>
<pre>
stkTableRef.value?.setHighlightDimRow(['id1'], { 
    method: 'js',
    duration: 2000
});
</pre>
手動で色を計算する必要があり、パフォーマンスが悪いため推奨されません。`d3-interpolate` に依存します。
</details>


## API

### 行ハイライト  setHighlightDimRow
```ts
/**
 * 行をハイライトします
 * @param rowKeyValues 一意の行キーの配列
 * @param option.method css- cssレンダリングを使用、animation- animation apiを使用。デフォルトはanimation
 * @param option.className カスタムcssアニメーションクラス。
 * @param option.keyframe カスタムキーフレームが提供されている場合、highlightConfig.fps は無効になります。
 * @param option.duration アニメーション継続時間。'css' メソッドでは、class を削除するために使用されます。className が提供されている場合はカスタムアニメーション継続時間と一致する必要があります。
 */
setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {}): void;
```

### セルハイライト setHighlightDimCell
```ts
/**
 * セルをハイライトします。仮想スクロールハイライト状態メモリはまだサポートされていません。
 * @param rowKeyValue 行キー
 * @param colKeyValue 列キー
 * @param options.method css- cssレンダリングを使用、animation- animation apiを使用。デフォルトはanimation;
 * @param option.className カスタムcssアニメーションクラス。
 * @param option.keyframe カスタムキーフレームが提供されている場合、highlightConfig.fps は無効になります。
 * @param option.duration アニメーション継続時間。'css' メソッドでは、class を削除するために使用されます。className が提供されている場合はカスタムアニメーション継続時間と一致する必要があります。
 */
setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {}): void;
```
### パラメータ型

```ts
type HighlightDimBaseOption = {
    duration?: number;
};

type HighlightDimAnimationOption = HighlightDimBaseOption & {
    /** Animation API を使用 */
    method: 'animation';
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats と同じ
     */
    keyframe?: Parameters<Animatable['animate']>['0'];
};
type HighlightDimCssOption = HighlightDimBaseOption & {
    method: 'css';
    /** cssアニメーションを持つクラス名 */
    className?: string;
    /** className を削除する遅延時間を制御します */
    duration?: number;
};

export type HighlightDimCellOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;
export type HighlightDimRowOption = HighlightDimBaseOption | HighlightDimAnimationOption | HighlightDimCssOption;
```
