<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import RangeInput from '../../components/RangeInput.vue';

const height = ref(300);

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Address', dataIndex: 'address', maxWidth: 200 },
];

const dataSource = ref([
    { name: `Jack`, address: `Beijing Forbidden City` },
    { name: `Tom`, address: `Shanghai` },
    { name: `Lucy`, address: `Guangzhou` },
    { name: `Lily`, address: `Shenzhen` },
]);
</script>
<template>
    <div class="container" :style="{ height: height + 'px' }">
        <RangeInput v-model="height" min="0" max="600" label="height" suffix="px"></RangeInput>
        <StkTable header-row-height="50" :columns="columns" :data-source="dataSource"></StkTable>
    </div>
</template>
<style scoped>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
}
:deep(.stk-table) {
    flex: 1;
}
:deep(.stk-table .stk-table-main) {
    height: 100%;
}
</style>
