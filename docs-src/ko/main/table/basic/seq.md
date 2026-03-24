# 시퀀스 열

`type: 'seq'`를 사용하여 번호 열을 추가할 수 있습니다.

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
    { type: 'seq', title: 'No.', width: 60 },
    { title: '이름', dataIndex: 'name' },
    { title: '나이', dataIndex: 'age' },
];

const dataSource = ref<Data[]>([
    { name: '김철수', age: 18 },
    { name: '이영희', age: 20 },
    { name: '박민수', age: 22 },
]);
</script>
<template>
    <StkTable style="height: 200px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```
