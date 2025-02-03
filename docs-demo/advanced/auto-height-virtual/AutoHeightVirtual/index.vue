<script setup lang="ts">
import mockjs from 'mockjs';
import { StkTableColumn } from '@/StkTable/index';
import StkTable from '../../../StkTable.vue';
import type { DataType } from './types';

const columns: StkTableColumn<DataType>[] = [
    { dataIndex: 'id', title: 'ID', width: 26, align: 'center' },
    { dataIndex: 'title', title: '标题', width: 100 },
    { dataIndex: 'content', title: '内容', width: 200 },
    { dataIndex: 'date', title: '日期', width: 70, align: 'center' },
];
const data = new Array(50).fill(0).map((_, i) => ({
    id: i,
    title: mockjs.Random.csentence(2, 15),
    content: mockjs.Random.cparagraph(1, 5),
    date: mockjs.Random.datetime('yyyy-MM-dd HH:mm'),
}));
</script>

<template>
    <StkTable row-key="id" style="height: 400px" stripe virtual auto-row-height :row-height="50" :columns="columns" :data-source="data"></StkTable>
</template>
<style scoped>
:deep(.v-head) {
    background-color: #333;
    font-weight: bold;
}
</style>
