<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { getDataSource, columns } from './config';
const dataSource = getDataSource();
const tableRef = ref<InstanceType<typeof StkTable>>();

function handleToggleAll() {
    tableRef.value?.setTreeExpand(dataSource, { all: true });
}
function handleCollapseAll() {
    tableRef.value?.setTreeExpand(dataSource, { all: true, expand: false });
}

function handleToggleAsia() {
    tableRef.value?.setTreeExpand(['Asia']);
}
function handleExpandAllAsia() {
    tableRef.value?.setTreeExpand(['Asia'], { expand: true, all: true });
}
function handleCollapseAllAsia() {
    tableRef.value?.setTreeExpand(['Asia'], { expand: false, all: true });
}
function handleExpandToLevel2() {
    tableRef.value?.setTreeExpand(['Asia'], { expand: true, level: 2 });
}
function handleCollapseToLevel1() {
    tableRef.value?.setTreeExpand(['Asia'], { expand: false, level: 1 });
}
function handleExpandZhejiangParents() {
    tableRef.value?.setTreeExpand(['Zhejiang'], { expand: true, parents: true });
}
function handleCollapseZhejiangParents() {
    tableRef.value?.setTreeExpand(['Zhejiang'], { expand: false, parents: true });
}
</script>
<template>
    <div style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 8px">
        <button class="btn" @click="handleToggleAll">Toggle All</button>
        <button class="btn" @click="handleCollapseAll">Collapse All</button>
        <button class="btn" @click="handleToggleAsia">Toggle Asia</button>
        <button class="btn" @click="handleExpandAllAsia">Expand All Asia</button>
        <button class="btn" @click="handleCollapseAllAsia">Collapse All Asia</button>
        <button class="btn" @click="handleExpandToLevel2">Expand Asia to Level 2</button>
        <button class="btn" @click="handleCollapseToLevel1">Collapse Asia to Level 1</button>
        <button class="btn" @click="handleExpandZhejiangParents">Expand Parents of Zhejiang</button>
        <button class="btn" @click="handleCollapseZhejiangParents">
            Collapse Parents of Zhejiang
        </button>
    </div>
    <StkTable
        ref="tableRef"
        style="max-height: 300px"
        row-key="area"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
