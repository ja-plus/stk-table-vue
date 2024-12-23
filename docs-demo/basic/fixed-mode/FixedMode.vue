<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
const width = ref(50);
const columns: StkTableColumn<any>[] = [
    { dataIndex: 'id', title: 'id(100px)', width: '100px' },
    { dataIndex: 'name', title: 'name' },
    { dataIndex: 'address', title: 'address' },
];
const data = new Array(200).fill(0).map((it, index) => {
    return { id: index, name: 'hah', address: 'sss' };
});
</script>

<template>
    <div>
        <input v-model="width" type="range" min="0" max="100" /> <span>width: {{ width }}%</span>
        <StkTable style="height: 150px" row-key="id" :width="width + '%'" fixed-mode :columns="columns" :data-source="data"></StkTable>
        <div>headless</div>
        <StkTable
            style="height: 140px"
            row-key="id"
            virtual
            fixed-mode
            headless
            :width="width + '%'"
            :columns="columns"
            :data-source="data"
        ></StkTable>
    </div>
</template>
