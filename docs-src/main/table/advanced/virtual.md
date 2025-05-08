# 虚拟列表
用于大量数据渲染时，提升性能。

## 配置
props:

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| virtual | `boolean` | `false` | 是否启用虚拟列表 |
| virtualX | `boolean` | `false` | 是否启用横向虚拟列表 |
| autoResize | `boolean`\| `() => void` | `true` | 是否自动重新计算可视区域。如果传递回调函数，则此函数会在resize后被调用 |


## 纵向虚拟列表
::: warning
行高将不再被内容影响。 具体移至[行高](/main/table/basic/row-height)章节。
:::
```vue
<StkTable virtual></StkTable>
```
<demo vue="advanced/virtual/VirtualY.vue"></demo>

## 横向虚拟列表
::: warning
`StkTableColumn['width']` 将有默认值 `100px`。
:::

```vue
<StkTable virtual-x></StkTable>
```
<demo vue="advanced/virtual/VirtualX.vue"></demo>

## 重新计算可视区域 autoResize
很多情况下，虚拟列表区域的宽高会因为各种原因发生变化，这时需要重新计算可视区域。

组件内部已基于 `ResizeObserver` 监听 `StkTable` 的尺寸变化，当尺寸变化时，会自动重新计算可视区域，该功能默认打开。


::: warning
不支持 `ResizeObserver` 的浏览器会使用 `onresize`兜底。
:::

某些情况下，仍需要手动重新计算虚拟列表的可视区域，此时可以调用组件expose的方法。

```ts
/**
 * 初始化纵向虚拟列表的可视区域
 * @param {number} [height] 虚拟滚动的高度
 */
initVirtualScrollY(height?: number)
/**
 * 初始化横向虚拟列表的可视区域
 */
initVirtualScrollX()
/**
 * 初始化纵向和横向虚拟列表的可视区域
 */
initVirtualScroll(height?: number)
```
`initVirtualScroll` 等价于 `initVirtualScrollY` + `initVirtualScrollX`

### 关闭自动计算
```vue
<StkTable :autoResize="false"></StkTable>
```

## 单列表
请移步至[虚拟单列表](/demos/virtual-list.html)

