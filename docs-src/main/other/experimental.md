# 实验性功能

## experimental.scrollY

基于 transform 的垂直滚动模拟减少了布局抖动。在某些场景下提升滚动性能。

### 用法

```vue
<template>
  <StkTable
    virtual
    scroll-row-by-row
    :experimental="{ scrollY: true }"
    :data-source="dataSource"
    :columns="columns"
  />
</template>
```


### 注意事项

- 这是实验性功能，未来版本可能会发生变化
- 与 `scrollRowByRow` 结合使用时，transform 偏移会被禁用以避免冲突
- 该功能需要启用 `props.virtual` 以获得最佳性能
