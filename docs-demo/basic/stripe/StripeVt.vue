<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];

// 模拟500条数据
const dataSource = ref(
    Array.from({ length: 500 }, (_, i) => ({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
        gender: i % 2 === 0 ? 'male' : 'female',
    })),
);
</script>
<template>
    <StkTable style="height: 200px" virtual stripe :columns="columns" :data-source="dataSource"></StkTable>
</template>
