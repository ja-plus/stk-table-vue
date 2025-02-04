# Vue2 滚动优化

## 简介
由于vue2 虚拟dom 的 `diff` 机制（双端diff）原因。在vue2中，虚拟列表向下滚动时，表格所有的tr都会更新。

向上滚动时则在表格最上方新增tr，表格末尾删除tr，这样才是正确的。

向下滚动在体感上会明显比向上滚动要卡一点。

因此，为这种情况进行优化，在用鼠标滚轮滚动时，向上与向下滚动的体感保持一致。

## 配置
`props.optimizeVue2Scroll`开启vue2 滚动优化。
```vue
<StkTable optimize-vue2-scroll></StkTable>
```
## 优化原理
将向下滚动的动作分解成两个
1. 向表格下方新增tr。
2. 短暂延迟后删除上方tr。

也就是，先保持虚拟列表的 `startIndex` 不变化，短暂时间后再变化为目标值。这样做有利于vue2的diff机制，减少不必要的dom更新，以提升滚动性能。

::: tip
在鼠标拖动滚动条进行**大范围**拖动时，如果适用此优化方案将生成大量节点，为了控制dom数量，这次操作将**不会被优化**。
:::