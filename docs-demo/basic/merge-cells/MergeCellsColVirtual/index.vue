<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../../StkTable.vue';
import { useI18n } from '../../../hooks/useI18n/index';

const { t } = useI18n();
const columns: StkTableColumn<any>[] = [
    { title: t('id'), dataIndex: 'id', width: 80 },
    {
        title: t('name'),
        dataIndex: 'name',
        width: 100,
        mergeCells: ({ row }) => {
            return row.colspan ? { colspan: row.colspan } : void 0;
        },
    },
    { title: t('age'), dataIndex: 'age', width: 80 },
    {
        title: t('gender'),
        dataIndex: 'gender',
        width: 80,
        mergeCells: ({ row }) => {
            return row.colspan ? { colspan: row.colspan } : void 0;
        },
    },
    // 30 个列，撑出横向滚动
    ...new Array(30)
        .fill(0)
        .map((_, i) => ({ title: `Column ${i}`, dataIndex: `column-${i}`, width: 100 })),
];
const dataSource = new Array(20).fill(0).map((_, i) => ({
    id: i,
    name: `Name ${i}`,
    age: 18 + (i % 10),
    gender: i % 2 ? 'male' : 'female',
    colspan: i % 2 ? 2 : void 0, // 奇数行 name 列合并 2 列
}));
</script>
<template>
    <StkTable
        style="max-height: 300px"
        virtual
        virtual-x
        cell-hover
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
