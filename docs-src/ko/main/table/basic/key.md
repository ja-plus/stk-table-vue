# 행/열 고유 키

`rowKey`와 `colKey`를 사용하여 행과 열의 고유 키를 설정할 수 있습니다.

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable } from 'stk-table-vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

type Data = {
    id: string;
    name: string;
    age: number;
};

const columns: StkTableColumn<Data>[] = [
    { type: 'seq', title: 'No.', width: 50 },
    { title: '이름', dataIndex: 'name', key: 'name-col' },
    { title: '나이', dataIndex: 'age', key: 'age-col' },
];

const dataSource = ref<Data[]>([
    { id: 'k1', name: '김철수', age: 18 },
    { id: 'k2', name: '이영희', age: 20 },
    { id: 'k3', name: '박민수', age: 22 },
]);
</script>
<template>
    <StkTable style="height: 200px" row-key="id" col-key="name-col" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```
