<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

type DataType = {
    key: string;
    name: string;
    age: number;
    gender: string;
};

const columns: StkTableColumn<DataType>[] = [
    { title: 'Name', dataIndex: 'name', width: 100, sorter: true },
    { title: 'Age', dataIndex: 'age', sorter: true },
    { title: 'Gender', dataIndex: 'gender', sorter: true },
];

const dataSource = ref<DataType[]>(
    // 100 个假数据
    Array.from({ length: 100 }, (_, i) => ({
        key: i.toString(),
        name: `Name ${i}`,
        age: Math.round(Math.random() * 100),
        gender: i % 2 === 0 ? 'Male' : 'Female',
    })),
);
</script>
<template>
    <StkTable style="height: 200px" row-key="key" :columns="columns" :data-source="dataSource"></StkTable>
</template>
