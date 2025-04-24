<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

type DataType = {
    key: string;
    name: string;
    period: string;
    periodNumber: number;
};

const columns: StkTableColumn<DataType>[] = [
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },
    { title: 'Name', dataIndex: 'name' },
    {
        title: 'Period',
        dataIndex: 'period',
        align: 'right',
        sorter: true,
        sortField: 'periodNumber',
    },
    { title: 'PeriodNumber', dataIndex: 'periodNumber', align: 'right' },
];

const dataSource = ref<DataType[]>([
    { key: '1', name: 'John Brown', period: '1Y', periodNumber: 365 },
    { key: '2', name: 'John Brown', period: '2M', periodNumber: 60 },
    { key: '3', name: 'John Brown', period: '3M', periodNumber: 90 },
    { key: '4', name: 'John Brown', period: '6M', periodNumber: 180 },
    { key: '5', name: 'John Brown', period: '2Y', periodNumber: 730 },
    { key: '6', name: 'John Brown', period: '2M', periodNumber: 60 },
    { key: '7', name: 'John Brown', period: '4M', periodNumber: 120 },
    { key: '8', name: 'John Brown', period: '49D', periodNumber: 49 },
    { key: '9', name: 'John Brown', period: '180D', periodNumber: 180 },
    { key: '10', name: 'John Brown', period: '1.5Y', periodNumber: 547 },
]);
</script>
<template>
    <StkTable
        style="height: 200px"
        row-key="key"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
