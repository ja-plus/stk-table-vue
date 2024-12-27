# 滚动条样式

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

下面这个例子使用 ::--webkit-scrollbar 来设置滚动条的样式。在chrome内核的浏览器中生效。

<demo vue="basic/scrollbar-style/ScrollbarStyle.vue"></demo>
