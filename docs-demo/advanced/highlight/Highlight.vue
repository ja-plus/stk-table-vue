<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { columns, dataSource as dataSourceRaw } from './const';

const stkTableRef = useTemplateRef('stkTableRef');
const dataSource = shallowRef([...dataSourceRaw]);

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

function addData() {
    const id = 'id' + dataSource.value.length;
    dataSource.value.unshift({
        id,
        name: 'name' + dataSource.value.length,
        age: dataSource.value.length,
        gender: dataSource.value.length % 2 === 0 ? 'male' : 'female',
    });

    dataSource.value = [...dataSource.value]; // trigger shallowRef

    nextTick(() => {
        stkTableRef.value?.setHighlightDimRow([id]);
    });
}
</script>
<template>
    <button class="btn" @click="addData">添加数据</button>
    <StkTable
        ref="stkTableRef"
        row-key="id"
        style="height: 200px"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
<style scoped>
.btn:hover {
    color: #1890ff;
}
</style>
