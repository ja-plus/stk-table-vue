<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable, StkTableColumn } from '../src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        minWidth: 100,
        width: '25%',
        fixed: 'left',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        fixed: 'left',
        width: '25%',
        minWidth: 200,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        minWidth: 500,
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        width: '10%',
        minWidth: 50,
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        width: '15%',
        minWidth: 100,
        fixed: 'right',
    },
];

const dataSource = ref(
    new Array(100).fill(0).map((_, index) => {
        return {
            name: `Jack ${index}`,
            age: 18 + index,
            address: `Beijing Forbidden City ${index}`,
            gender: index % 2 === 0 ? 'male' : 'female',
        };
    }),
);
</script>
<template>
    <h3>Simple</h3>
    <StkTable key="age" style="height: 300px" fixed-col-shadow :columns="columns" :data-source="dataSource"></StkTable>
</template>
