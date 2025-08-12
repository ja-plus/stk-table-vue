# Vue2 Scroll Optimization

## Introduction
Due to the `diff` mechanism (double-ended diff) of Vue 2's virtual DOM, when scrolling down in a virtual list in Vue 2, all tr elements in the table will be updated.

When scrolling up, new tr elements are added at the top of the table, and tr elements are removed from the end of the table, which is correct.

Scrolling down feels noticeably more laggy than scrolling up.

Therefore, this optimization is implemented to ensure that scrolling up and down with the mouse wheel feel consistent.

## Configuration
Use `props.optimizeVue2Scroll` to enable Vue 2 scroll optimization.
```vue
<StkTable optimize-vue2-scroll></StkTable>
```
## Optimization Principle
Scrolling down is decomposed into two actions:
1. Add new tr elements at the bottom of the table.
2. Remove tr elements from the top after a short delay.

That is, first keep the `startIndex` of the virtual list unchanged, then change it to the target value after a short time. This is beneficial to Vue 2's diff mechanism, reducing unnecessary DOM updates to improve scrolling performance.

::: tip
When dragging the scrollbar with the mouse for **large-scale** dragging, applying this optimization scheme would generate a large number of nodes. To control the number of DOM nodes, this operation **will not be optimized**.
:::