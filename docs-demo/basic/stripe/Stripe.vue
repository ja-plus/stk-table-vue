<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';
const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
];

const dataSource = ref([
    { name: `Jack`, age: 18, address: `Beijing Forbidden City `, gender: 'male' },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
]);
</script>
<template>
    <StkTable stripe :columns="columns" :data-source="dataSource"></StkTable>
</template>
