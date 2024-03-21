<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable, StkTableColumn } from '../src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    {
        title: '姓名',
        dataIndex: 'name',
        minWidth: 100,
        width: '25%',
        fixed: 'left',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        fixed: 'left',
        width: '25%',
        minWidth: 200,
    },
    {
        title: '住址',
        dataIndex: 'address',
        minWidth: 500,
    },
    {
        title: '性别',
        dataIndex: 'gender',
        width: '10%',
        minWidth: 50,
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
        minWidth: 100,
        fixed: 'right',
    },
];

const dataSource = ref(
    new Array(100).fill(0).map((_, index) => {
        return {
            name: `张三${index}`,
            age: 18 + index,
            address: `北京市朝阳区${index}`,
            gender: index % 2 === 0 ? '男' : '女',
        };
    }),
);
</script>
<template>
    <h2>simple table</h2>
    <StkTable key="age" style="height: 300px" fixed-col-shadow :columns="columns" :data-source="dataSource"></StkTable>
</template>
