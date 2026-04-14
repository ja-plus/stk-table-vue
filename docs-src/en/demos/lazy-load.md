# Lazy Load Implementation

When dealing with very large datasets (e.g., millions of records), rendering all data at once can cause performance issues. Although `StkTable` has built-in virtual scrolling optimization, loading all data into memory at once still consumes significant resources.

By listening to the table's `scroll` event, you can get the `startIndex` and `endIndex` of the current visible area, enabling a lazy loading solution that loads data on demand.

## Implementation Approach

1. Create a large placeholder array and pass it to `dataSource`
2. Listen to the `scroll` event to get `startIndex` and `endIndex`
3. Calculate which data pages need to be loaded based on scroll position
4. Fetch data from the API on demand and fill it into the corresponding positions

<demo vue="demos/LazyLoad/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/LazyLoad/index.vue"></demo>

## Implementation Details

### Core Logic

```typescript
// Assume total data is 100,000 records, 100 per page
const totalCount = 100000;
const pageSize = 100;

// Create placeholder array
const tableData = ref<Array<Record<string, any>>>(
  Array(totalCount).fill(null).map((_, i) => ({ id: i + 1, __placeholder: true }))
);

// Listen to scroll event
function onScroll(ev: Event, data: { startIndex: number; endIndex: number }) {
  const { startIndex, endIndex } = data;
  
  // Calculate the page range to load
  const startPage = Math.floor(startIndex / pageSize);
  const endPage = Math.floor(endIndex / pageSize);
  
  // Load data pages within range
  for (let page = startPage; page <= endPage; page++) {
    loadDataPage(page);
  }
}

// Load data for a specific page
async function loadDataPage(page: number) {
  // Check if already loaded
  const startIndex = page * pageSize;
  if (!tableData.value[startIndex]?.__placeholder) return;
  
  // Fetch data from API
  const response = await fetchData(page, pageSize);
  
  // Fill into corresponding positions
  response.forEach((item, index) => {
    tableData.value[startIndex + index] = item;
  });
}
```

::: tip Boundary Case Handling
When the scroll position is exactly between two pages (e.g., `startIndex=95, endIndex=105`), you need to load both pages simultaneously (page 0 and page 1) to ensure complete data display in the visible area.
:::

::: warning Important Notes
1. The placeholder array must be pre-allocated to ensure virtual scrolling can correctly calculate scroll height
2. Loaded data should be cached properly to avoid duplicate requests
3. Consider adding loading state indicators to improve user experience
:::
