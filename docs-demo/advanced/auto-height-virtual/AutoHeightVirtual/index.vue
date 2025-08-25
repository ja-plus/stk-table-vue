<script setup lang="ts">
import mockjs from 'mockjs';
import { StkTableColumn } from '@/StkTable/index';
import StkTable from '../../../StkTable.vue';
import type { DataType } from './types';
import { getIsZH } from '../../../hooks/getIsZH';

const isZH = getIsZH();

const columns: StkTableColumn<DataType>[] = [
    { dataIndex: 'id', title: 'ID', width: 26, align: 'center' },
    { dataIndex: 'title', title: 'Title', width: 100 },
    { dataIndex: 'content', title: 'Content', width: 200 },
    { dataIndex: 'date', title: 'Date', width: 70, align: 'center' },
];
const data = new Array(50).fill(0).map((_, i) => ({
    id: i,
    title: isZH ? mockjs.Random.csentence(1, 5) : mockjs.Random.sentence(1, 5),
    content:  isZH ? mockjs.Random.cparagraph(2, 15) : mockjs.Random.paragraph(1, 5),
    date:  isZH ? mockjs.Random.datetime('yyyy-MM-dd HH:mm') : mockjs.Random.datetime('MM/dd/yyyy HH:mm'),
}));
</script>

<template>
    <StkTable
        row-key="id"
        style="height: 400px"
        stripe
        virtual
        auto-row-height
        :row-height="50"
        :columns="columns"
        :data-source="data"
    ></StkTable>
</template>
<style scoped>
:deep(.v-head) {
    background-color: #333;
    font-weight: bold;
}
</style>
