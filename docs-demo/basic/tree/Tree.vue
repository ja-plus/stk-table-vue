<script lang="ts" setup>
import StkTable from '../../StkTable.vue';
import { getDataSource, columns } from './config';
const dataSource = getDataSource();
</script>
<template>
    <StkTable style="max-height: 300px" :columns="columns" :data-source="dataSource"></StkTable>
</template>
