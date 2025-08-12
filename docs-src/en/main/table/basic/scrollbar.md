# Scrollbar

## Style
The component **does not provide** built-in scrollbar styles and relies entirely on browser scrollbar styles.

If you need to customize scrollbar styles, you can do so through CSS. Add the `class` to the `StkTable` node.

```vue
<StkTable class="scrollbar"></StkTable>
```
```css
.scrollbar::-webkit-scrollbar {
    /* ..... */
}
```

The following example uses `::-webkit-scrollbar` to style the scrollbar.

<demo vue="basic/scrollbar-style/ScrollbarStyle.vue"></demo>

Effective in browsers with `Blink` or `webkit` engines (Chrome, Safari, Opera) (refer to [::-webkit-scrollbar | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar)).
## Key Scroll

| Key | Description | Function |
| --- | --- | --- |
| `ArrowUp` | Up arrow key | Scroll up one row |
| `ArrowDown`| Down arrow key | Scroll down one row |
| `ArrowLeft`| Left arrow key | Scroll left 50px |
| `ArrowRight`| Right arrow key | Scroll right 50px |
| `PageUp`| -- | Scroll up one page |
| `PageDown`| -- | Scroll down one page |
| `Home`| -- | Scroll to top |
| `End`| -- | Scroll to bottom |
