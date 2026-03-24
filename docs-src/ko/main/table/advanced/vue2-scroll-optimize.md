# Vue 2 스크롤 최적화

`optimizeVue2Scroll` 속성을 사용하여 Vue 2 환경에서 스크롤 성능을 최적화할 수 있습니다.

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable } from 'stk-table-vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

type Data = {
    id: number;
    name: string;
    age: number;
};

const columns: StkTableColumn<Data>[] = [
    { type: 'seq', title: 'No.', width: 60 },
    { title: '이름', dataIndex: 'name' },
    { title: '나이', dataIndex: 'age' },
];

const dataSource = ref<Data[]>(
    Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `사용자${i + 1}`,
        age: 18 + (i % 50),
    }))
);
</script>
<template>
    <StkTable 
        virtual
        optimize-vue2-scroll
        style="height: 400px" 
        row-key="id" 
        :columns="columns" 
        :data-source="dataSource"
    ></StkTable>
</template>
```
