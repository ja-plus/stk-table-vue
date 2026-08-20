# Stk Table Vue - Examples

Common usage patterns and code examples for stk-table-vue.

## 1. Basic Table

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'

const columns = [
  { title: 'Name', dataIndex: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', width: 100 },
  { title: 'Address', dataIndex: 'address' },
]
const dataSource = ref([
  { id: 1, name: 'John', age: 32, address: 'New York' },
  { id: 2, name: 'Jim', age: 42, address: 'London' },
  { id: 3, name: 'Joe', age: 52, address: 'Tokyo' },
])
</script>

<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    style="height: 400px"
  />
</template>
```

## 2. Virtual Scroll (Large Data)

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref, onMounted } from 'vue'

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: 'Name', dataIndex: 'name', width: 200 },
  { title: 'Value', dataIndex: 'value', width: 120 },
  { title: 'Status', dataIndex: 'status', width: 100 },
  { title: 'Description', dataIndex: 'desc' },
]

const dataSource = ref([])

onMounted(() => {
  // Generate 100,000 rows
  dataSource.value = Array.from({ length: 100000 }, (_, i) => ({
    id: i + 1,
    name: `Row ${i + 1}`,
    value: Math.random().toFixed(4),
    status: i % 3 === 0 ? 'active' : 'inactive',
    desc: `Description for row ${i + 1}`,
  }))
})
</script>

<template>
  <StkTable
    virtual
    virtual-x
    row-key="id"
    :row-height="28"
    :columns="columns"
    :data-source="dataSource"
    style="height: 500px"
  />
</template>
```

## 3. Fixed Columns & Header

```vue
<script setup>
import { StkTable } from 'stk-table-vue'

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80, fixed: 'left' },
  { title: 'Name', dataIndex: 'name', width: 150, fixed: 'left' },
  // ... middle columns (no fixed)
  { title: 'Col A', dataIndex: 'a', width: 120 },
  { title: 'Col B', dataIndex: 'b', width: 120 },
  { title: 'Col C', dataIndex: 'c', width: 120 },
  { title: 'Action', dataIndex: 'action', width: 100, fixed: 'right' },
]
</script>

<template>
  <StkTable
    virtual
    virtual-x
    row-key="id"
    :row-height="28"
    :columns="columns"
    :data-source="dataSource"
    fixed-col-shadow
    style="height: 400px"
  />
</template>
```

## 4. Sorting

### Single Column Sort

```vue
<script setup>
import { StkTable } from 'stk-table-vue'

const columns = [
  { title: 'Name', dataIndex: 'name', sorter: true },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: true,
    sortType: 'number',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    // Custom sort function
    sorter: (data, { order }) => {
      return data.slice().sort((a, b) => {
        return order === 'asc' ? a.score - b.score : b.score - a.score
      })
    },
  },
]

function onSortChange(col, order, data, sortConfig) {
  console.log('Sorted by:', col?.dataIndex, 'order:', order)
}
</script>

<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    :sort-config="{ defaultSort: { dataIndex: 'age', order: 'asc' } }"
    @sort-change="onSortChange"
  />
</template>
```

### Multi-Column Sort

```vue
<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    :sort-config="{ multiSort: true, multiSortLimit: 3 }"
  />
</template>
```

### Remote Sort (Server-side)

```vue
<script setup>
async function onSortChange(col, order) {
  const res = await fetch(`/api/data?sort=${col.dataIndex}&order=${order}`)
  dataSource.value = await res.json()
}
</script>

<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    sort-remote
    @sort-change="onSortChange"
  />
</template>
```

### Programmatic Sort

```vue
<script setup>
import { ref } from 'vue'

const tableRef = ref()

function sortByAge() {
  tableRef.value.setSorter('age', 'asc')
}

function resetSort() {
  tableRef.value.resetSorter()
}
</script>
```

## 5. Tree Table

```vue
<script setup>
import { StkTable, ref } from 'vue'

const tableRef = ref()

const columns = [
  { title: 'Name', dataIndex: 'name', type: 'tree-node' },
  { title: 'Size', dataIndex: 'size' },
  { title: 'Type', dataIndex: 'type' },
]

const dataSource = [
  {
    id: '1', name: 'src', size: '--', type: 'folder',
    children: [
      { id: '1-1', name: 'index.ts', size: '2KB', type: 'file' },
      {
        id: '1-2', name: 'components', size: '--', type: 'folder',
        children: [
          { id: '1-2-1', name: 'Button.vue', size: '1KB', type: 'file' },
        ]
      },
    ]
  },
  { id: '2', name: 'package.json', size: '500B', type: 'file' },
]

function expandAll() {
  tableRef.value.setTreeExpand(dataSource.map(r => r.id), { expand: true, all: true })
}

function collapseAll() {
  tableRef.value.setTreeExpand(dataSource.map(r => r.id), { expand: false })
}

// Expand parents to make a deep node visible
function showNode(rowKey) {
  tableRef.value.setTreeExpand(rowKey, { parents: true })
  tableRef.value.scrollTo({ top: { key: rowKey } })
}
</script>

<template>
  <StkTable
    ref="tableRef"
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    :tree-config="{ defaultExpandAll: true }"
  />
</template>
```

## 6. Expand Row

```vue
<script setup>
import { StkTable } from 'stk-table-vue'

const columns = [
  { type: 'expand', width: 40 },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
]
</script>

<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    :expand-config="{ height: 100 }"
  >
    <template #expand="{ row }">
      <div style="padding: 12px">
        <p>Detail: {{ row.detail }}</p>
      </div>
    </template>
  </StkTable>
</template>
```

## 7. Cell Highlight Animation

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'

const tableRef = ref()

// Highlight a row with default animation
function flashRow(rowKey) {
  tableRef.value.setHighlightDimRow([rowKey], {
    method: 'animation',  // 'animation' | 'css' | 'js'
    duration: 2000,
  })
}

// Highlight a cell with custom keyframe
function flashCell(rowKey, colKey) {
  tableRef.value.setHighlightDimCell(rowKey, colKey, {
    method: 'animation',
    keyframe: [
      { backgroundColor: '#ffeb3b' },
      { backgroundColor: 'transparent' }
    ],
    duration: 3000,
  })
}

// Highlight with CSS class
function flashRowCSS(rowKey) {
  tableRef.value.setHighlightDimRow([rowKey], {
    method: 'css',
    className: 'my-highlight-animation',
    duration: 2000,
  })
}
</script>

<template>
  <StkTable ref="tableRef" row-key="id" :columns="columns" :data-source="dataSource" />
</template>

<style>
.my-highlight-animation {
  animation: myHighlight 2s ease-out;
}
@keyframes myHighlight {
  0% { background-color: #ffeb3b; }
  100% { background-color: transparent; }
}
</style>
```

## 8. Area Selection + Keyboard Navigation

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'

const tableRef = ref()

function onSelectionChange(ranges) {
  console.log('Selected ranges:', ranges)
}

function copySelection() {
  const text = tableRef.value.copySelectedArea()
  navigator.clipboard.writeText(text)
}

// Programmatic selection
function selectRange() {
  tableRef.value.setAreaSelection([
    {
      index: {
        x: [0, 2],  // @deprecated
        y: [0, 5],  // @deprecated
        begin: { row: 0, col: 0 },
        end: { row: 5, col: 2 },
      }
    }
  ], { scrollToView: true })
}
</script>

<template>
  <StkTable
    ref="tableRef"
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    :area-selection="{ keyboard: true, ctrl: true, shift: true }"
    @area-selection-change="onSelectionChange"
  />
</template>
```

## 9. Custom Cell (customCell)

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { defineComponent, h } from 'vue'

// Functional component (simplest approach)
const statusCell = (props) => {
  const color = props.cellValue === 'active' ? '#52c41a' : '#ff4d4f'
  return h('span', { style: { color } }, props.cellValue)
}

// defineComponent for reactive/complex cells
const actionCell = defineComponent({
  props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex'],
  setup(props) {
    function onClick() {
      console.log('Edit row:', props.row)
    }
    return () => h('button', { onClick }, 'Edit')
  }
})

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Status', dataIndex: 'status', customCell: statusCell },
  { title: 'Action', dataIndex: 'action', customCell: actionCell, width: 100 },
]
</script>

<template>
  <StkTable row-key="id" :columns="columns" :data-source="dataSource" />
</template>
```

### Custom Header Cell

```ts
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  customHeaderCell: (props) => h('div', { class: 'my-header' }, [
    h('span', props.col.title),
    h('button', { onClick: () => console.log('filter') }, 'Filter'),
  ])
}]
```

## 10. Column Resize + Header Drag

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'

const columns = ref([
  { title: 'Name', dataIndex: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', width: 100 },
  { title: 'Address', dataIndex: 'address', width: 200 },
])

function onColResize(col) {
  console.log('Column resized:', col.dataIndex, 'new width:', col.width)
}

function onColOrderChange(dragKey, targetKey) {
  console.log('Column moved:', dragKey, '->', targetKey)
}
</script>

<template>
  <StkTable
    row-key="id"
    v-model:columns="columns"
    :data-source="dataSource"
    col-resizable
    :header-drag="{ mode: 'insert' }"
    :col-min-width="60"
    @col-resize="onColResize"
    @col-order-change="onColOrderChange"
  />
</template>
```

**Note**: `colResizable` requires `v-model:columns` and each column must have `width` set.

## 11. Merge Cells

```vue
<script setup>
import { StkTable } from 'stk-table-vue'

const columns = [
  { title: 'Category', dataIndex: 'category', width: 120 },
  { title: 'Name', dataIndex: 'name', width: 150 },
  { title: 'Value', dataIndex: 'value', width: 100 },
]

const dataSource = [
  { id: 1, category: 'A', name: 'Item 1', value: 10 },
  { id: 2, category: 'A', name: 'Item 2', value: 20 },
  { id: 3, category: 'A', name: 'Item 3', value: 30 },
  { id: 4, category: 'B', name: 'Item 4', value: 40 },
  { id: 5, category: 'B', name: 'Item 5', value: 50 },
]

// Merge cells in the 'category' column when adjacent rows share the same value
function mergeCells({ row, col, rowIndex, colIndex }) {
  if (col.dataIndex === 'category') {
    // Count consecutive rows with same category
    let rowspan = 1
    for (let i = rowIndex + 1; i < dataSource.length; i++) {
      if (dataSource[i].category === row.category) rowspan++
      else break
    }
    // Only the first row in the group shows the cell
    if (rowIndex > 0 && dataSource[rowIndex - 1].category === row.category) {
      return { rowspan: 0, colspan: 1 }
    }
    return { rowspan, colspan: 1 }
  }
}
</script>

<template>
  <StkTable
    row-key="id"
    virtual
    :row-height="28"
    :columns="columns"
    :data-source="dataSource"
    :merge-cells="mergeCells"
    style="height: 300px"
  />
</template>
```

**Important**: If you mutate row data in-place (same object reference), call `tableRef.value.clearMergeCellsCache()` after the change.

## 12. Variable Row Height (autoRowHeight)

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'

const tableRef = ref()

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: 'Content', dataIndex: 'content' },
]

const dataSource = ref([
  { id: 1, content: 'Short text' },
  { id: 2, content: 'Very long text that wraps to multiple lines. '.repeat(10) },
  { id: 3, content: 'Medium length content here' },
])

// If you know the height changed, update it manually
function updateRowHeight(rowKey, newHeight) {
  tableRef.value.setAutoHeight(rowKey, newHeight)
}

// Clear all cached heights (e.g., after font size change)
function resetHeights() {
  tableRef.value.clearAllAutoHeight()
}
</script>

<template>
  <StkTable
    ref="tableRef"
    virtual
    row-key="id"
    :row-height="28"
    :auto-row-height="{ expectedHeight: 50 }"
    :columns="columns"
    :data-source="dataSource"
    style="height: 400px"
  />
</template>
```

## 13. Row Drag

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'

const columns = [
  { type: 'dragRow', width: 40 },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Priority', dataIndex: 'priority' },
]

function onRowOrderChange(dragKey, targetKey) {
  console.log('Row moved:', dragKey, '->', targetKey)
  // Get updated order
  const newData = tableRef.value.getTableData()
}
</script>

<template>
  <StkTable
    ref="tableRef"
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    :drag-row-config="{ mode: 'insert' }"
    @row-order-change="onRowOrderChange"
  />
</template>
```

## 14. Multi-Level Header

```vue
<script setup>
import { StkTable } from 'stk-table-vue'

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  {
    title: 'Personal Info',
    children: [
      { title: 'Name', dataIndex: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', width: 80 },
    ]
  },
  {
    title: 'Contact',
    children: [
      { title: 'Email', dataIndex: 'email', width: 200 },
      {
        title: 'Address',
        children: [
          { title: 'City', dataIndex: 'city', width: 120 },
          { title: 'Street', dataIndex: 'street', width: 200 },
        ]
      },
    ]
  },
]
</script>

<template>
  <StkTable
    virtual
    virtual-x
    row-key="id"
    :row-height="28"
    :columns="columns"
    :data-source="dataSource"
    style="height: 400px"
  />
</template>
```

## 15. Dark Theme + Stripe

```vue
<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
    theme="dark"
    stripe
    bordered="h"
    style="height: 400px"
  />
</template>
```
