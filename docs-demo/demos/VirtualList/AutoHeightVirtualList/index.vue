<script setup lang="ts">
import { StkTableColumn } from '@/StkTable/index';
import mockjs from 'mockjs';
import { useI18n } from '../../../hooks/useI18n/index';
import StkTable from '../../../StkTable.vue';
import Panel from './Panel.vue';
import type { DataType } from './types';

const { isZH } = useI18n();
const columns: StkTableColumn<DataType>[] = [{ dataIndex: 'title', title: '', customCell: Panel }];
const data = new Array(10).fill(0).map((_, i) => ({
    id: i,
    title: isZH.value ? mockjs.Random.csentence(3, 15) : mockjs.Random.sentence(1, 5),
    content: isZH.value ? mockjs.Random.cparagraph(0.5, 20) : mockjs.Random.paragraph(1, 20),
    date: isZH.value
        ? mockjs.Random.datetime('yyyy-MM-dd HH:mm')
        : mockjs.Random.datetime('MM/dd/yyyy HH:mm'),
}));
</script>

<template>
    <StkTable
        row-key="id"
        style="height: 400px"
        virtual
        headless
        :auto-row-height="{
            expectedHeight: 200,
        }"
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
