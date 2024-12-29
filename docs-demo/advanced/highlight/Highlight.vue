<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { columns, dataSource } from './const';

const stkTableRef = useTemplateRef('stkTableRef');

let intervals: number[] = [];
onMounted(() => {
    const interval1 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimCell('id1', 'age');
    }, 2500);
    const interval2 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimCell('id2', 'gender');
    }, 1200);
    const interval3 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimRow(['id0']);
    }, 3000);
    intervals.push(interval1, interval2, interval3);
});

onBeforeUnmount(() => {
    intervals.forEach(n => window.clearInterval(n));
});
</script>
<template>
    <StkTable ref="stkTableRef" row-key="id" :columns="columns" :data-source="dataSource"></StkTable>
</template>
