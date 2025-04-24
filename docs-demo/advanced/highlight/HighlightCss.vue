<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { columns, dataSource } from './const';

const stkTableRef = useTemplateRef('stkTableRef');

let intervals: number[] = [];
onMounted(() => {
    const interval1 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimRow(['id0'], { method: 'css' });
    }, 1000);
    const interval2 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimRow(['id1'], {
            method: 'css',
            className: 'special-highlight-row',
            duration: 2000,
        });
    }, 1600);
    const interval3 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimCell('id2', 'name', {
            method: 'css',
            className: 'special-highlight-cell',
            duration: 1000,
        });
    }, 2300);
    const interval4 = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimCell('id3', 'age', {
            method: 'css',
            className: 'special-highlight-cell-red',
            duration: 1500,
        });
    }, 2600);
    intervals.push(interval1, interval2, interval3, interval4);
});

onBeforeUnmount(() => {
    intervals.forEach(n => window.clearInterval(n));
});
</script>
<template>
    <StkTable
        ref="stkTableRef"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
<style scoped>
@keyframes my-highlight-row {
    from {
        background-color: #bd7201;
    }
}
@keyframes my-highlight-cell {
    from {
        background-color: #5fa95f;
    }
}
@keyframes my-highlight-cell-red {
    from {
        background-color: #b14949;
    }
}
:deep(.special-highlight-row) {
    animation: my-highlight-row 2s linear;
}
:deep(.special-highlight-cell) {
    animation: my-highlight-cell 1s linear;
}
:deep(.special-highlight-cell-red) {
    animation: my-highlight-cell-red 1.5s linear;
}
</style>
