<script lang="ts" setup>
import StkTable from '../../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';
import { DataType } from './types';
import YieldCell from './YieldCell.vue';

const columns: StkTableColumn<DataType>[] = [
    { title: 'Code', dataIndex: 'code' },
    { title: '收益率', dataIndex: 'yield', align: 'right', customCell: YieldCell },
];

const dataSource: DataType[] = [
    { code: '000001', yield: 0.05352 },
    { code: '000002', yield: -0.03524 },
    { code: '000003', yield: 0.024982 },
    { code: '000004', yield: -0.014415 },
    { code: '000005', yield: 0.045481 },
    { code: '000006', yield: 0 },
];
</script>
<template>
    <StkTable row-key="code" :columns="columns" :data-source="dataSource"></StkTable>
</template>
