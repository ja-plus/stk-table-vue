<template>
    <StkTable
        :row-height="50"
        cell-hover
        cell-active
        :row-hover="false"
        :row-active="false"
        :columns="columns"
        :data-source="tableData"
    />
</template>

<script setup lang="ts">
import StkTable from '../../StkTable.vue';
import type { StkTableColumn } from '@/StkTable/index'; // 请替换为实际的导入路径
import MatrixCell from './MatrixCell.vue';

const columns: StkTableColumn<any>[] = [
    { title: '', dataIndex: 'rowTitle', className: 'col-title', width: 100 },
    { title: '1M', dataIndex: 'm1', customCell: MatrixCell },
    { title: '3M', dataIndex: 'm3', customCell: MatrixCell },
    { title: '6M', dataIndex: 'm6', customCell: MatrixCell },
    { title: '1Y', dataIndex: 'y1', customCell: MatrixCell },
    { title: '2Y', dataIndex: 'y2', customCell: MatrixCell },
];

const tableData = [
    {
        rowTitle: 'AAA+',
        m1: '数据1-1',
        m3: '数据1-2',
        m6: '数据1-3',
        y1: '数据1-4',
        y2: '数据1-5',
    },
    {
        rowTitle: 'AAA',
        m1: '数据2-1',
        m3: '数据2-2',
        m6: '数据2-3',
        y1: '数据2-4',
        y2: '数据2-5',
    },
    {
        rowTitle: 'AA+',
        m1: '数据3-1',
        m3: '数据3-2',
        m6: '数据3-3',
        y1: '数据3-4',
        y2: '数据3-5',
    },
    {
        rowTitle: 'AA',
        m1: '数据4-1',
        m3: '数据4-2',
        m6: '数据4-3',
        y1: '数据4-4',
        y2: '数据4-5',
    },
    {
        rowTitle: 'AA-及以下',
        m1: '数据5-1',
        m3: '数据5-2',
        m6: '数据5-3',
        y1: '数据5-4',
        y2: '数据5-5',
    },
];
</script>

<style scoped>
:deep(.col-title) {
    color: var(--th-color);
    background-color: var(--th-bgc);
    font-weight: bold;
}
</style>
