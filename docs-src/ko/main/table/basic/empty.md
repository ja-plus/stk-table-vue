# 빈 데이터

데이터가 없을 때 빈 상태를 표시합니다.

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

const dataSource = ref<Data[]>([]);
</script>
<template>
    <StkTable style="height: 200px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```
