<script setup lang="ts">
import StkTable from '../../../StkTable.vue';
import { StkTableColumn } from '../../../../src/StkTable/index';
import type { DataType } from './types';
import Panel from './Panel.vue';
import { Random } from 'mockjs';

const columns: StkTableColumn<DataType>[] = [{ dataIndex: 'title', title: '', customCell: Panel }];
const data = new Array(20).fill(0).map((_, i) => ({
    id: i,
    title: Random.csentence(3, 15),
    content: Random.cparagraph(1, 10),
    date: Random.datetime('yyyy-MM-dd HH:mm'),
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
