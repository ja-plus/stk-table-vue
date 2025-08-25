<script setup lang="ts">
import { HighlightConfig } from '@/StkTable/types';
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import RangeInput from '../../components/RangeInput.vue';
import StkTable from '../../StkTable.vue';
import { columns, dataSource as dataSourceRaw } from './const';

const stkTableRef = useTemplateRef('stkTableRef');
const dataSource = shallowRef([...dataSourceRaw]);

const highlightConfig = ref<HighlightConfig>({
    duration: 2,
    fps: 0,
});

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
    <button class="btn" style="margin-right: 20px" @click="addData">Add data</button>
    <RangeInput
        v-model="highlightConfig.duration"
        min="0.1"
        max="5"
        step="0.1"
        label="Duration"
        suffix="s"
    ></RangeInput>
    <RangeInput
        v-model="highlightConfig.fps"
        min="0"
        max="30"
        label="FPS"
        suffix="fps"
    ></RangeInput>
    <StkTable
        ref="stkTableRef"
        row-key="id"
        style="height: 200px"
        :highlight-config="highlightConfig"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
