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
    { title: 'Name', dataIndex: 'name', sorter: true },
    { title: 'Age', dataIndex: 'age', align: 'right', sortType: 'number', sorter: true },
];

const dataSource = ref<DataType[]>([
    { key: '1', name: 'John Brown', age: 365 },
    { key: '2', name: 'Tom', age: 60 },
    { key: '3', name: 'Jerry', age: 90 },
    { key: '4', name: 'Nicolas', age: null },
    { key: '5', name: 'Kitty', age: 730 },
]);
</script>
<template>
    <StkTable
        style="height: 200px"
        row-key="key"
        :sort-config="{
            emptyToBottom: true,
            defaultSort: {
                dataIndex: 'age',
                order: 'desc',
                sortType: 'number',
            },
        }"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
