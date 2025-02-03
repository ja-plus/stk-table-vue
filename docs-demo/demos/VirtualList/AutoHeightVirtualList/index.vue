<script setup lang="ts">
import mockjs from 'mockjs';
import { StkTableColumn } from '@/StkTable/index';
import StkTable from '../../../StkTable.vue';
import Panel from './Panel.vue';
import type { DataType } from './types';

const columns: StkTableColumn<DataType>[] = [{ dataIndex: 'title', title: '', customCell: Panel }];
const data = new Array(20).fill(0).map((_, i) => ({
    id: i,
    title: mockjs.Random.csentence(3, 15),
    content: mockjs.Random.cparagraph(1, 10),
    date: mockjs.Random.datetime('yyyy-MM-dd HH:mm'),
}));
</script>

<template>
    <StkTable
        row-key="id"
        style="height: 400px"
        virtual
        headless
        auto-row-height
        :row-height="200"
        :row-active="false"
        :bordered="false"
        :row-hover="false"
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
