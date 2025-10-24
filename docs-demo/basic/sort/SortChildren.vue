<script lang="ts" setup>
import StkTable from '../../StkTable.vue';
import { getDataSource, columns } from '../tree/config';
const dataSource = getDataSource();
</script>
<template>
    <StkTable
        style="max-height: 300px"
        :tree-config="{
            defaultExpandAll: true,
        }"
        :sort-config="{
            sortChildren: true,
        }"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
