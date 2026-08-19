<script setup lang="ts">
import mockjs from 'mockjs';
import { StkTableColumn } from '@/StkTable/index';
import StkTable from '../../docs-demo/StkTable.vue';

const isZH = true;

const columns: StkTableColumn<any>[] = [
    { dataIndex: 'id', title: 'ID', width: 26, align: 'center' },
    { dataIndex: 'title', title: 'Title', width: 100 },
    { dataIndex: 'content', title: 'Content', width: 200 },
    { dataIndex: 'date', title: 'Date', width: 70, align: 'center' },
];
const data = new Array(50).fill(0).map((_, i) => ({
    id: i,
    title: isZH ? mockjs.Random.csentence(1, 5) : mockjs.Random.sentence(1, 5),
    content: isZH ? mockjs.Random.cparagraph(2, 15) : mockjs.Random.paragraph(1, 5),
    date: isZH ? mockjs.Random.datetime('yyyy-MM-dd HH:mm') : mockjs.Random.datetime('MM/dd/yyyy HH:mm'),
}));
</script>

<template>
    <div>
        <h3>stripe + auto-row-height + virtual</h3>
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
    </div>
</template>
