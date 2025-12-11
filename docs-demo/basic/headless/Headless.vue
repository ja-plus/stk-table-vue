<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
import { useI18n } from '../../hooks/useI18n';
const { t } = useI18n();

const headless = ref(true);
const columns: StkTableColumn<any>[] = [
    { dataIndex: 'vHead', title: t('vHead'), className: 'v-head', width: 100 },
    { dataIndex: 'col1', title: t('col1') },
    { dataIndex: 'vHead2', title: t('vHead2'), className: 'v-head', width: 100 },
    { dataIndex: 'col2', title: t('col2') },
];
const data = [
    { vHead: 'Name', col1: 'Jack', vHead2: 'Birthday', col2: '1990-01-01' },
    { vHead: 'Age', col1: '24', vHead2: 'School', col2: 'University' },
    { vHead: 'Address', col1: 'Beijing', vHead2: 'ID Card', col2: '1234567890' },
];
</script>

<template>
    <CheckItem v-model="headless" :text="t('headless')"></CheckItem>
    <StkTable
        row-key="id"
        :row-active="false"
        :row-hover="false"
        :headless="headless"
        :columns="columns"
        :data-source="data"
    ></StkTable>
</template>
<style scoped>
.stk-table :deep(.v-head) {
    background-color: #eee;
}
.stk-table.dark :deep(.v-head) {
    background-color: #333;
}
:deep(.v-head) {
    font-weight: bold;
}
</style>
