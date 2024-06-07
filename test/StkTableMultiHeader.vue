<script setup>
import { StkTable } from '../src/StkTable/index';
const columns = [
    {
        dataIndex: 'Basic',
        title: 'Basic',
        fixed: 'left',
        children: [
            { dataIndex: 'id', title: 'ID', width: '100px', fixed: 'left' },
            {
                dataIndex: 'lv2',
                title: 'Lv 2',
                children: [
                    { dataIndex: 'lv2_1', title: 'Lv 2.1', width: '100px' },
                    { dataIndex: 'lv2_2', title: 'Lv 2.2', width: '100px' },
                ],
            },
        ],
    },
    { dataIndex: 'age', title: 'Age', width: '50px' },
    { dataIndex: 'email', title: 'Email', width: '130px' },
    {
        dataIndex: 'other',
        title: 'Other',
        children: new Array(2).fill(0).map((it, i) => {
            return {
                dataIndex: 'other' + i,
                title: 'Other ' + i,
                width: '100px',
            };
        }),
    },
    {
        dataIndex: 'right',
        title: 'Right',
        fixed: 'right',
        children: [
            { dataIndex: 'right-1', title: 'right-1', width: '50px', fixed: 'right' },
            { dataIndex: 'right-2', title: 'right-2', width: '100px', fixed: 'right' },
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
    <div>
        多级表头处理
        <StkTable style="height: 200px; width: 600px" row-key="id" fixed-col-shadow virtual :columns="columns" :data-source="dataSource"> </StkTable>
    </div>
</template>
