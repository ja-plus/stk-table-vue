我正在实现表头筛选的功能。
已经实现了一部分了，在src/StkTable/index.ts 中导出为useFilter。

期望的使用方式为:

```vue
<template>
    <StkTable
        :columns="columns"
        :dataSource="dataSource"
    />
</template>
<script>
const Filter = useFilter();
const columns = [{
    title: '1',
    dataIndex: '1',
    customHeaderCell: Filter({options: [{label: '1',value:'1'}]});
    }
]
const dataSource = []
</script>
```
useFilter 保留自己作用域的筛选状态。
触发筛选时，会向上查找到最近的StkTable组件实例，调用其setFilter方法，将筛选状态传递给StkTable组件。
StkTable 组件内部对数据筛选。