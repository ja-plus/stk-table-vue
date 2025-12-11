<script lang="ts" setup>
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import { StkTableColumn } from '../../src/StkTable/index';
import StkTable from '../StkTable.vue';
import { useI18n } from '../hooks/useI18n/index';

const { t } = useI18n();

const stkTableRef = useTemplateRef('stkTableRef'); // vue3.5+
// const stkTableRef = ref<InstanceType<typeof StkTable>>(); //vue3.2

type DataType = {
    id: string;
    name: string;
    age: number;
    address: string;
};
const columns: StkTableColumn<DataType>[] = [
    { title: t('name'), dataIndex: 'name', key: 'name' },
    { title: t('age'), dataIndex: 'age', key: 'age', align: 'right' },
    { title: t('address'), dataIndex: 'address', key: 'address' },
];
const dataSource: DataType[] = [
    { id: 'k1', name: 'Tom', age: 18, address: 'Beijing' },
    { id: 'k2', name: 'Jerry', age: 19, address: 'Shanghai' },
    { id: 'k3', name: 'Jack', age: 20, address: 'London' },
    { id: 'k4', name: 'Rose', age: 22, address: 'New York' },
];

let interval = 0;
onMounted(() => {
    interval = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimRow(['k1']); // highlight row
    }, 2000);
});

onBeforeUnmount(() => {
    window.clearInterval(interval);
});
</script>
<template>
    <StkTable
        ref="stkTableRef"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
