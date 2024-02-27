<template>
    <StkTable style="height: 300px; width: 100%" row-key="id" virtual :columns="columns" :data-source="dataSource" @scroll="handleScroll"></StkTable>
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { StkTable, StkTableColumn } from '../src/StkTable';
const columns = ref<StkTableColumn<any>[]>([
    { dataIndex: 'id', title: 'ID' },
    ...new Array(50).fill(0).map((it, i) => {
        return { dataIndex: 'col' + i, title: 'Col' + i };
    }),
]);

const dataSource = shallowRef(
    new Array(100000).fill(0).map((it, i) => {
        return {
            id: i,
            col0: i,
        };
    }),
);
let debounceTimeout = 0;
function handleScroll(e, { startIndex, endIndex }) {
    if (debounceTimeout) {
        window.clearTimeout(debounceTimeout);
    }
    debounceTimeout = window.setTimeout(() => {
        for (let i = startIndex; i < endIndex; i++) {
            Object.assign(dataSource.value[i], { id: i, col0: i, col1: i, col2: i });
        }
        console.time('触发shallowRef更新耗时');
        dataSource.value = [...dataSource.value];
        // triggerRef(dataSource);
        console.timeEnd('触发shallowRef更新耗时');
        debounceTimeout = 0;
    }, 200);
}
</script>
