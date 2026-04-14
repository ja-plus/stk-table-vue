# 懒加载实现

当数据量非常大时（如百万级），直接渲染所有数据会导致性能问题。虽然 `StkTable` 内置了虚拟滚动优化，但如果一次性加载所有数据到内存，仍然会占用大量资源。

通过监听表格的 `scroll` 事件，您可以获取当前可视区域的 `startIndex` 和 `endIndex`，从而实现按需加载数据的懒加载方案。

## 实现思路

1. 创建一个大的占位数组传入 `dataSource`
2. 监听 `scroll` 事件获取 `startIndex` 和 `endIndex`
3. 根据滚动位置计算需要加载的数据页
4. 从接口按需获取数据并填充到对应位置

<demo vue="demos/LazyLoad/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/LazyLoad/index.vue"></demo>

## 实现说明

### 核心逻辑

```typescript
// 假设总数据量为 100000 条，每页 100 条
const totalCount = 100000;
const pageSize = 100;

// 创建占位数组
const tableData = ref<Array<Record<string, any>>>(
  Array(totalCount).fill(null).map((_, i) => ({ id: i + 1, __placeholder: true }))
);

// 监听滚动事件
function onScroll(ev: Event, data: { startIndex: number; endIndex: number }) {
  const { startIndex, endIndex } = data;
  
  // 计算需要加载的页码范围
  const startPage = Math.floor(startIndex / pageSize);
  const endPage = Math.floor(endIndex / pageSize);
  
  // 加载范围内的数据页
  for (let page = startPage; page <= endPage; page++) {
    loadDataPage(page);
  }
}

// 加载指定页的数据
async function loadDataPage(page: number) {
  // 检查是否已加载
  const startIndex = page * pageSize;
  if (!tableData.value[startIndex]?.__placeholder) return;
  
  // 从接口获取数据
  const response = await fetchData(page, pageSize);
  
  // 填充到对应位置
  response.forEach((item, index) => {
    tableData.value[startIndex + index] = item;
  });
}
```

::: tip 边界情况处理
当滚动位置恰好在两页之间时（例如 `startIndex=95, endIndex=105`），需要同时加载两页数据（第0页和第1页），确保可视区域内的数据完整显示。
:::

::: warning 注意事项
1. 占位数组需要预先分配，确保虚拟滚动能正确计算滚动高度
2. 已加载的数据应做好缓存，避免重复请求
3. 可以考虑添加加载状态提示，提升用户体验
:::
