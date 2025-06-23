<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../StkTable.vue';

const columns: StkTableColumn<any>[] = [
    { title: 'ID', dataIndex: 'id' },
    {
        title: 'Continent',
        dataIndex: 'continent',
        mergeCells() {
            return {
                rowspan: 5,
            };
        },
    },
    {
        title: 'Country',
        dataIndex: 'country',
        mergeCells({ row }) {
            if (row.id === 1) {
                return {
                    rowspan: 3,
                };
            }
        },
    },
    { title: 'Province', dataIndex: 'province' },
];
const dataSource = [
    { id: 1, continent: 'Asia', country: 'China', province: 'Beijing' },
    { id: 1.1, continent: 'Asia', country: 'China', province: 'Shanghai' },
    { id: 1.2, continent: 'Asia', country: 'China', province: 'Guangzhou' },
    { id: 2, continent: 'Asia', country: 'Japan', province: 'Tokyo' },
    { id: 3, continent: 'Asia', country: 'Korea', province: 'Seoul' },
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
