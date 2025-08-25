<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../../StkTable.vue';
import { dataSource } from './dataSource';



const columns: StkTableColumn<any>[] = [
    {
        title: 'Continent',
        dataIndex: 'continent',
        mergeCells,
    },
    {
        title: 'Country',
        dataIndex: 'country',
        mergeCells,
    },
    { title: 'Province', dataIndex: 'province' },
];

function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 }
}

</script>
<template>
    <StkTable style="max-height: 300px" virtual cell-hover row-key="id" :columns="columns" :data-source="dataSource"></StkTable>
</template>
