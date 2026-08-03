<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { getDataSource, columns } from './config';
const dataSource = getDataSource();
const tableRef = ref<InstanceType<typeof StkTable>>();

function handleToggleChina() {
    tableRef.value?.setTreeExpand(['China']);
}
</script>
<template>
    <div style="margin-bottom: 12px">
        <button class="btn" @click="handleToggleChina">Toggle China</button>
    </div>
    <StkTable
        ref="tableRef"
        style="max-height: 250px"
        row-key="area"
        :tree-config="{
            defaultExpandKeys: ['Asia', 'China', 'Zhejiang'],
        }"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
