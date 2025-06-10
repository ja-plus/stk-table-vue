<script lang="ts" setup>
import StkTable from '../../StkTable.vue';
import { getDataSource, columns } from './config';
const dataSource = getDataSource();
function handleToggleTreeExpand(data: { row: any; expanded: boolean }) {
    console.log('toggle tree expand', data);
}
</script>
<template>
    <StkTable
        style="max-height: 300px"
        :columns="columns"
        :data-source="dataSource"
        @toggle-tree-expand="handleToggleTreeExpand"
    ></StkTable>
</template>
