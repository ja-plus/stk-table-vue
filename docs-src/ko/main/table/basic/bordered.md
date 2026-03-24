# 테두리

`bordered` 속성을 사용하여 테이블 테두리를 설정할 수 있습니다.

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
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
];

const dataSource = ref<Data[]>([
    { name: 'Jack', age: 18 },
    { name: 'Tom', age: 20 },
    { name: 'Lucy', age: 22 },
]);
</script>
<template>
    <StkTable bordered style="height: 200px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```
