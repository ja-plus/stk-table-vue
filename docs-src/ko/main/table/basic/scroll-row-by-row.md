# 행 단위 스크롤

`scrollRowByRow` 속성을 사용하여 행 단위로 스크롤할 수 있습니다.

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable } from 'stk-table-vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

type Data = {
    name: string;
    age: number;
};

const columns: StkTableColumn<Data>[] = [
    { type: 'seq', title: 'No.', width: 50 },
    { title: '이름', dataIndex: 'name' },
    { title: '나이', dataIndex: 'age' },
];

const dataSource = ref<Data[]>(
    Array.from({ length: 50 }, (_, i) => ({ name: `사용자${i + 1}`, age: 18 + i }))
);
</script>
<template>
    <StkTable scroll-row-by-row style="height: 300px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```
