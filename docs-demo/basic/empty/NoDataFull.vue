<script lang="ts" setup>
import { ref } from 'vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import StkTable from '../../StkTable.vue';

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];
const noDataFull = ref(true);
</script>
<template>
    <label>
        <input v-model="noDataFull" type="checkbox" />
        <span>no-data-full</span>
    </label>
    <StkTable style="height: 200px" :no-data-full="noDataFull" :columns="columns" :data-source="[]"></StkTable>
</template>
