<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../StkTable.vue';
const columns: StkTableColumn<any>[] = [
    { title: 'ID', dataIndex: 'id' },
    {
        title: 'Name',
        dataIndex: 'name',
        mergeCells: ({ rowIndex }) => {
            return {
                colspan: rowIndex % 2 ? 2 : void 0, // 合并偶数行
            };
        },
    },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Gender', dataIndex: 'gender' },
];
const dataSource = [
    { id: 1, name: 'Tom', age: 18, gender: 'male' },
    { id: 2, name: 'Jerry', age: 19, gender: 'female' },
    { id: 3, name: 'Jack', age: 20, gender: 'male' },
    { id: 4, name: 'Rose', age: 21, gender: 'female' },
    { id: 5, name: 'Zhou', age: 22, gender: 'male' },
    { id: 6, name: 'Wu', age: 23, gender: 'female' },
];
</script>
<template>
    <StkTable
        style="max-height: 300px"
        cell-hover
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
