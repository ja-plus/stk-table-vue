# スクロールバー

## スタイル
コンポーネントはデフォルトで**ネイティブスクロールバー**を使用し、ブラウザのスクロールバースタイルに完全に依存します。

スクロールバースタイルをカスタマイズする必要がある場合は、CSS介して行うことができます。`class` を `StkTable` ノードに追加します。

```vue
<StkTable class="scrollbar"></StkTable>
```
```css
.scrollbar::-webkit-scrollbar {
    /* ..... */
}
```

以下の例では `::-webkit-scrollbar` を使用してスクロールバーのスタイルを設定しています。

<demo vue="basic/scrollbar-style/ScrollbarStyle.vue"></demo>

`Blink` または `webkit` エンジンを使用するブラウザ（Chrome、Safari、Opera）で効果的です（[::-webkit-scrollbar | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar) を参照）。

## 組み込みスクロールバー（`^0.9.0`）

DOM実装の組み込みスクロールバー、`props.scrollbar` を介して有効にします。

<span style="color: #ff9800;">スクロール時の白屏問題を解決できます。</span>

```ts 
<StkTable
  virtual
  scrollbar //[!code ++]
></StkTable>
<StkTable
  virtual 
  :scrollbar="{ width: 10, height: 10 }" // [!code ++]
></StkTable>
```
::: tip
仮想スクロール（`virtual`）を使用している場合にのみ効果的です。
:::

<demo vue="basic/scrollbar-style/CustomScrollbar.vue"></demo>

### APIリファレンス

#### ScrollbarOptions 型

```typescript
interface ScrollbarOptions {
  /** スクロールバーを有効にするかどうか */
  enabled?: boolean;
  /** 垂直スクロールバーの幅 デフォルト: 8 */
  width?: number;
  /** 水平スクロールバーの高さ デフォルト: 8 */
  height?: number;
  /** スクロールバーサム最小幅 デフォルト: 20 */
  minWidth?: number;
  /** スクロールバーサム最小高さ デフォルト: 20 */
  minHeight?: number;
}
```

### スタイルカスタマイズ

CSS変数を使用してスクロールバーの外観をカスタマイズできます：

```css
.stk-table {
  --scrollbar-thumb-color: #c1c1d7;
  --scrollbar-thumb-hover-color: #a8a8c1;
  --scrollbar-track-color: transparent;
}

/* ダークテーマ */
.stk-table.dark {
  --scrollbar-thumb-color: rgba(93, 96, 100, .9);
  --scrollbar-thumb-hover-color: #727782;
}
```

## キースクロール

| キー | 説明 | 機能 |
| --- | --- | --- |
| `ArrowUp` | 上矢印キー | 1行上にスクロール |
| `ArrowDown`| 下矢印キー | 1行下にスクロール |
| `ArrowLeft`| 左矢印キー | 50px左にスクロール |
| `ArrowRight`| 右矢印キー | 50px右にスクロール |
| `PageUp`| -- | 1ページ上にスクロール |
| `PageDown`| -- | 1ページ下にスクロール |
| `Home`| -- | 先頭までスクロール |
| `End`| -- | 末尾までスクロール |
