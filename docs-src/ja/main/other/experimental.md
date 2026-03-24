# 実験的機能

これは実験的な機能であり、将来のバージョンで変更される可能性があります。

## experimental.scrollY <Badge type="tip" text="^0.10.0" />

Transformベースの縦スクロールシミュレーション。

ブラウザのDOM要素の高さの制限により、非常に大きなデータセットを表示すると問題が発生する可能性があります。transformを使用してスクロールをシミュレートすると、この問題が解決されます。

### 使用方法

```js
<template>
  <StkTable
    virtual
    scroll-row-by-row
    :experimental="{ scrollY: true }" //[!code ++]
    :data-source="dataSource"
    :columns="columns"
  />
</template>
```
