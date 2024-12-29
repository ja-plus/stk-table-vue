<script lang="ts" setup>
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name', width: 100 },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Gender', dataIndex: 'gender' },
    { title: 'Address', dataIndex: 'address', maxWidth: 200 },
    // 5000 个列
    ...new Array(5000).fill(0).map((_, i) => ({ title: `Column ${i}`, dataIndex: `column-${i}` })),
];

const dataSource = [
    {
        name: `Jack`,
        age: 18,
        address: `Beijing`,
        gender: 'male',
    },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
];
</script>
<template>
    <StkTable virtual-x :columns="columns" :data-source="dataSource"></StkTable>
</template>
