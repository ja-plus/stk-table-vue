<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { columns, dataSource } from './const';

const stkTableRef = useTemplateRef('stkTableRef');

let intervals: number[] = [];
onMounted(() => {
    const interval1 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimCell('id1', 'age', {
            keyframe: {
                color: ['#fff', '#C70000', '#fff'],
                transform: ['scale(1)', 'scale(1.1)', 'scale(1)'],
                boxShadow: ['unset', '0 0 10px #aaa', 'unset'],
                easing: 'cubic-bezier(.11,.1,.03,.98)',
            },
            duration: 1000,
        });
    }, 1790);
    intervals.push(interval1);
});

onBeforeUnmount(() => {
    intervals.forEach(n => window.clearInterval(n));
});
</script>
<template>
    <StkTable ref="stkTableRef" row-key="id" :columns="columns" :data-source="dataSource"></StkTable>
</template>
