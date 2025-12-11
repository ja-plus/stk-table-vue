<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const columns = ref<StkTableColumn<any>[]>([
    { title: t('name'), dataIndex: 'name', width: 100, fixed: 'left' },
    { title: t('age'), dataIndex: 'age', width: 60 },
    { title: t('gender'), dataIndex: 'gender', width: 80 },
    { title: t('address'), dataIndex: 'address', width: 200 },
    { title: t('operate'), dataIndex: '', width: 100, fixed: 'right' },
]);

const dataSource = [
    {
        name: `Jack`,
        age: 18,
        address: `Beijing Forbidden City, ${' Long text'.repeat(20)}`,
        gender: 'male',
    },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
    ...new Array(5000).fill(0).map((_, i) => ({
        name: `Jack${i}`,
        age: 18,
        address: `Beijing Forbidden City `,
        gender: 'male',
    })),
];
</script>
<template>
    <StkTable
        v-model:columns="columns"
        row-key="name"
        style="height: 200px"
        virtual
        col-resizable
        fixed-col-shadow
        :data-source="dataSource"
    ></StkTable>
</template>
