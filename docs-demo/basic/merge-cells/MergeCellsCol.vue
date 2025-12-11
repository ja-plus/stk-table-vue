<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../StkTable.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();
const columns: StkTableColumn<any>[] = [
    { title: t('id'), dataIndex: 'id' },
    {
        title: t('name'),
        dataIndex: 'name',
        mergeCells: ({ rowIndex }) => {
            return {
                colspan: rowIndex % 2 ? 2 : void 0, // 合并偶数行
            };
        },
    },
    { title: t('age'), dataIndex: 'age' },
    { title: t('gender'), dataIndex: 'gender' },
];
const dataSource = [
    { id: 1, name: 'Tom', age: 18, gender: 'male' },
    { id: 2, name: 'Jerry', age: 19, gender: 'female' },
    { id: 3, name: 'Jack', age: 20, gender: 'male' },
    { id: 4, name: 'Rose', age: 21, gender: 'female' },
    { id: 5, name: 'Zhou', age: 22, gender: 'male' },
    { id: 6, name: 'Wu', age: 23, gender: 'female' },
];
</script>
<template>
    <StkTable
        style="max-height: 300px"
        cell-hover
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
