# 仮想リスト
大量データのレンダリング時にパフォーマンスを向上させるために使用されます。

## 設定
props:

| プロパティ | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| virtual | `boolean` | `false` | 仮想リストを有効にするかどうか |
| virtualX | `boolean` | `false` | 横方向仮想リストを有効にするかどうか |
| autoResize | `boolean`\| `() => void` | `true` | 可視領域を自動再計算するかどうか。コールバック関数を渡すと、リサイズ後に呼び出されます |


## 縦方向仮想リスト
::: warning
行の高さはもうコンテンツの影響を受けなくなります。詳細については、[行の高さ](/ja/main/table/basic/row-height) セクションを参照してください。
:::
```vue
<StkTable virtual></StkTable>
```
<demo vue="advanced/virtual/VirtualY.vue"></demo>

## 横方向仮想リスト
::: warning
`StkTableColumn['width']` はデフォルトで `100px` になります。
:::

```vue
<StkTable virtual-x></StkTable>
```
<demo vue="advanced/virtual/VirtualX.vue"></demo>

## 可視領域の再計算 autoResize
多くの場合、仮想リスト領域の幅と高さはさまざまな理由で変化し、可視領域を再計算する必要があります。

コンポーネントは内部的に `ResizeObserver` を使用して `StkTable` のサイズ変更を監視します。サイズが変更されると、自動的に可視領域を再計算します。この機能はデフォルトで有効になっています。


::: warning
`ResizeObserver` をサポートしていないブラウザは `onresize` を代替として使用します。
:::

一部のケースでは、仮想リスト的可視領域を手動で再計算する必要があります。この場合、コンポーネントが公開するメソッドを呼び出すことができます。

```ts
/**
 * 縦方向仮想リスト可視領域を初期化します
 * @param {number} [height] 仮想スクロールの高さ
 */
initVirtualScrollY(height?: number)
/**
 * 横方向仮想リスト可視領域を初期化します
 */
initVirtualScrollX()
/**
 * 縦方向と横方向の両方の仮想リスト可視領域を初期化します
 */
initVirtualScroll(height?: number)
```
`initVirtualScroll` は `initVirtualScrollY` + `initVirtualScrollX` と同等です

### 自動計算を無効化
```vue
<StkTable :autoResize="false"></StkTable>
```

## 単位列リスト
[仮想単位リスト](/ja/demos/virtual-list.html) を参照してください。
