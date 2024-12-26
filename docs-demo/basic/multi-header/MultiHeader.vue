<script setup lang="ts">
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
const columns: StkTableColumn<any>[] = [
    {
        dataIndex: 'Basic',
        title: 'Basic',
        children: [
            { dataIndex: 'id', title: 'ID', width: 100 },
            {
                dataIndex: 'lv2',
                title: 'Lv 2',
                width: 100,
                children: [
                    { dataIndex: 'lv2_1', title: 'Lv 2.1', width: 100 },
                    { dataIndex: 'lv2_2', title: 'Lv 2.2', width: 100 },
                ],
            },
        ],
    },
    {
        dataIndex: 'age',
        title: 'Age',
        width: '50px',
        children: [
            { dataIndex: 'id3', title: 'ID', width: 50 },
            {
                dataIndex: 'lv5',
                title: 'Lv 2',
                width: 100,
            },
        ],
    },
    { dataIndex: 'email', title: 'Email', width: '130px' },
    {
        dataIndex: 'other',
        title: 'Other',
        children: new Array(2).fill(0).map((it, i) => {
            return {
                dataIndex: 'other' + i,
                title: 'Other ' + i,
                width: 100,
            };
        }),
    },
    {
        dataIndex: 'right',
        title: 'Right',
        children: [
            { dataIndex: 'right-1', title: 'right-1', width: 50 },
            { dataIndex: 'right-2', title: 'right-2', width: 100 },
        ],
    },
];
const dataSource = new Array(50).fill(0).map((it, i) => {
    return {
        id: i,
        lv2_1: 'lv2.1',
        lv2_2: 'lv2.2',
        age: i,
        email: i + '@qq.com',
    };
});
</script>
<template>
    <StkTable style="height: 200px" row-key="id" fixed-col-shadow virtual :columns="columns" :data-source="dataSource"> </StkTable>
</template>
