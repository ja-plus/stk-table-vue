<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n';
const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
];

// 模拟500条数据
const dataSource = ref(
    Array.from({ length: 500 }, (_, i) => ({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
        gender: i % 2 === 0 ? 'male' : 'female',
    })),
);
</script>
<template>
    <StkTable
        style="height: 200px"
        virtual
        stripe
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
