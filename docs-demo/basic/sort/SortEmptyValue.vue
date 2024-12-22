<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

type DataType = {
    key: string;
    name: string;
    age: number | null;
};

const columns: StkTableColumn<DataType>[] = [
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age', align: 'right', sortType: 'number', sorter: true },
];

const dataSource = ref<DataType[]>([
    { key: '1', name: 'John Brown', age: 365 },
    { key: '2', name: 'John Brown', age: 60 },
    { key: '3', name: 'John Brown', age: 90 },
    { key: '4', name: 'John Brown', age: null },
    { key: '5', name: 'John Brown', age: 730 },
]);
</script>
<template>
    <StkTable style="height: 200px" row-key="key" :sort-config="{ emptyToBottom: true }" :columns="columns" :data-source="dataSource"></StkTable>
</template>
