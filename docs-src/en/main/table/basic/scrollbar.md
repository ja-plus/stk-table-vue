# Scrollbar

## Style
The component uses **native scrollbar** by default and relies entirely on browser scrollbar styles.

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

<demo vue="basic/scrollbar-style/ScrollbarStyle.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/scrollbar-style/ScrollbarStyle.vue"></demo>

Effective in browsers with `Blink` or `webkit` engines (Chrome, Safari, Opera) (refer to [::-webkit-scrollbar | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar)).

## Built-in Scrollbar (`^0.9.0`)

Built-in DOM-implemented scrollbar, enabled via `props.scrollbar`.

<span style="color: #ff9800;">Can solve scrolling white screen issues.</span>

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
::: tip Note
* Only effective when using virtual scrolling (`virtual`).
* Not effective on mobile devices. (`^0.11.13`)
:::

<demo vue="basic/scrollbar-style/CustomScrollbar.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/scrollbar-style/CustomScrollbar.vue"></demo>

### API Reference

#### ScrollbarOptions Type

```typescript
interface ScrollbarOptions {
  /** Whether to enable scrollbar */
  enabled?: boolean;
  /** Vertical scrollbar width default: 8 */
  width?: number;
  /** Horizontal scrollbar height default: 8 */
  height?: number;
  /** Scrollbar thumb minimum width default: 20 */
  minWidth?: number;
  /** Scrollbar thumb minimum height default: 20 */
  minHeight?: number;
}
```

### Style Customization

You can customize the appearance of the scrollbar using CSS variables:

```css
.stk-table {
  --scrollbar-thumb-color: #c1c1d7;
  --scrollbar-thumb-hover-color: #a8a8c1;
  --scrollbar-track-color: transparent;
}

/* Dark theme */
.stk-table.dark {
  --scrollbar-thumb-color: rgba(93, 96, 100, .9);
  --scrollbar-thumb-hover-color: #727782;
}
```

## Key Scroll

> **Preconditions**: arrow keys are intercepted only when **virtual scroll is enabled** (non-virtual uses browser default scrolling). Additionally, one of the following must hold:
>
> 1. The mouse is hovering over the table; or
> 2. **The table or one of its descendants has keyboard focus**: tab to focus the container (auto `tabindex="0"` when virtual is on), or focus a sortable header.
>
> Condition 2 lets keyboard-only users (who never touched the mouse) scroll with arrow keys.

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
