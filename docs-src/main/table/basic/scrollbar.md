# 滚动条

## 设置滚动条样式
组件默认使用**原生滚动条**，完全依赖浏览器的滚动条样式。

如果需要自定义滚动条样式，可以通过CSS来实现。将`class`加在 `StkTable` 节点上即可

```vue
<StkTable class="scrollbar"></StkTable>
```
```css
.scrollbar::-webkit-scrollbar {
    /* ..... */
}
```

下面这个例子使用 `::-webkit-scrollbar` 来设置滚动条的样式。

<demo vue="basic/scrollbar-style/ScrollbarStyle.vue"></demo>

在 `Blink`或`webkit`内核的浏览器(Chrome, Safari, Opera)中生效（参考[::-webkit-scrollbar | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-webkit-scrollbar)）。

## 内置的滚动条(`^0.9.0`)

内置DOM实现的滚动条，通过 `props.scrollbar` 启用。

<span style="color: #ff9800;">可以解决滚动白屏问题。</span>

```ts 
<StkTable 
  scrollbar //[!code ++]
></StkTable>
<StkTable 
  :scrollbar="{ width: 10, height: 10 }" // [!code ++]
></StkTable>
```

<demo vue="basic/scrollbar-style/CustomScrollbar.vue"></demo>

### API 参考

#### ScrollbarOptions 类型

```typescript
interface ScrollbarOptions {
  /** 是否启用滚动条 */
  enabled?: boolean;
  /** 垂直滚动条宽度 default: 8 */
  width?: number;
  /** 水平滚动条高度 default: 8 */
  height?: number;
  /** 滚动条滑块最小宽度 default: 20 */
  minWidth?: number;
  /** 滚动条滑块最小高度 default: 20 */
  minHeight?: number;
}
```

### 样式定制

可以通过 CSS 变量自定义滚动条的外观：

```css
.stk-table {
  --scrollbar-thumb-color: #c1c1d7;
  --scrollbar-thumb-hover-color: #a8a8c1;
  --scrollbar-track-color: transparent;
}

/* 深色主题 */
.stk-table.dark {
  --scrollbar-thumb-color: rgba(93, 96, 100, .9);
  --scrollbar-thumb-hover-color: #727782;
}
```

## 按键滚动

| 按键 | 描述 | 功能 |
| --- | --- | --- |
| `ArrowUp` | 上方向键 | 向上滚动一行 |
| `ArrowDown`| 下方向键 | 向下滚动一行 |
| `ArrowLeft`| 左方向键 | 向左滚动50px |
| `ArrowRight`| 右方向键 | 向右滚动50px |
| `PageUp`| -- | 向上滚动一页 |
| `PageDown`| -- | 向下滚动一页 |
| `Home`| -- | 滚动到顶部 |
| `End`| -- | 滚动到底部 |