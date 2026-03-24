# table-layout: fixed

`fixedMode` 속성을 사용하여 table-layout: fixed 모드를 활성화할 수 있습니다.

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
    { title: '이름', dataIndex: 'name', width: 100 },
    { title: '나이', dataIndex: 'age', width: 100 },
];

const dataSource = ref<Data[]>([
    { name: '김철수', age: 18 },
    { name: '이영희', age: 20 },
    { name: '박민수', age: 22 },
]);
</script>
<template>
    <StkTable fixed-mode style="height: 200px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```
