# 滚动条

## 样式
组件 **不提供** 内置的滚动条样式，完全依赖浏览器的滚动条样式。

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
