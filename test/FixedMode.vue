<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { StkTableColumn } from '../src/StkTable/types';
const width = ref(50);
const columns: StkTableColumn<any>[] = [
    {
        dataIndex: 'id',
        title: 'id(100px)',
        width: '100px',
    },
    {
        dataIndex: 'name',
        title: 'name',
    },
    {
        dataIndex: 'address',
        title: 'address',
    },
];
const data = new Array(200).fill(0).map((it, index) => {
    return { id: index, name: 'hah', address: 'sss' };
});
</script>

<template>
    <div>
        <h3>table-layout: fixed</h3>
        <p>用于一列宽度固定，其余列平分的场景。此模式仅生效col.width</p>
        <input v-model="width" type="range" min="0" max="100" /> <span>width: {{ width }}%</span>
        <StkTable row-key="id" :width="width + '%'" style="height: 100px" fixed-mode :columns="columns" :data-source="data"></StkTable>
        <h3>headless</h3>
        <StkTable
            row-key="id"
            :width="width + '%'"
            style="height: 140px"
            virtual
            fixed-mode
            headless
            :columns="columns"
            :data-source="data"
        ></StkTable>
    </div>
</template>
