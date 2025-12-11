<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

type DataType = {
    key: string;
    name: string;
    age: number;
    gender: string;
};

const columns: StkTableColumn<DataType>[] = [
    { title: t('name'), dataIndex: 'name', width: 100, sorter: true },
    { title: t('age'), dataIndex: 'age', sorter: true },
    { title: t('gender'), dataIndex: 'gender', sorter: true },
];

const dataSource = ref<DataType[]>(
    // 100 个假数据
    Array.from({ length: 100 }, (_, i) => ({
        key: i.toString(),
        name: `Name ${i}`,
        age: Math.round(Math.random() * 100),
        gender: i % 2 === 0 ? 'Male' : 'Female',
    })),
);
</script>
<template>
    <StkTable
        style="height: 200px"
        row-key="key"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
