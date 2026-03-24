# 기본

* `props.columns` 열 설정.
* `props.dataSource` 데이터 소스 설정.
* `props.rowKey` 행 고유 식별자 설정.
* css style 테이블 높이 설정.

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable } from 'stk-table-vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

type Data = {
    name: string;
    age: number;
    address: string;
    gender: 'male' | 'female';
};

const columns: StkTableColumn<Data>[] = [
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age', headerAlign: 'right', align: 'right' },
    { title: 'Gender', dataIndex: 'gender', align: 'center' },
    { title: 'Address', dataIndex: 'address' },
];

const dataSource = ref<Data[]>([
    { name: `Jack`, age: 18, address: `Beijing Forbidden City `, gender: 'male' },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
]);
</script>
<template>
    <StkTable style="height: 200px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```

<demo vue="basic/Basic.vue"></demo>
