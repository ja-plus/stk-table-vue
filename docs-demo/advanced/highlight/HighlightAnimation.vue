<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { columns, dataSource as dataSourceRaw } from './const';

const stkTableRef = useTemplateRef('stkTableRef');
const dataSource = shallowRef([...dataSourceRaw]);

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
        addRowAnimation(id);
    });
}

function addRowAnimation(id: string) {
    stkTableRef.value?.setHighlightDimRow([id], {
        keyframe: [
            {
                backgroundColor: '#1e4c99',
                transform: 'translateY(-30px) scale(0.6)',
                opacity: 0,
                easing: 'cubic-bezier(.11,.1,.03,.98)',
            },
            { backgroundColor: '#1B1B24', transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
        duration: 1000,
    });
}
</script>
<template>
    <button class="btn" @click="addData">Add data</button>
    <StkTable
        ref="stkTableRef"
        style="height: 200px"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
