<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../../StkTable.vue';
import { specialDataSource } from './dataSource';

const columns: StkTableColumn<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 50,align: 'center' },
    { title: 'A', dataIndex: 'a', width: 100, mergeCells, },
    { title: 'B', dataIndex: 'b', width: 120, mergeCells, },
    { title: 'C', dataIndex: 'c', mergeCells },
];

function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}

</script>
<template>
    <StkTable style="max-height: 300px" virtual cell-hover row-key="id" :columns="columns" :data-source="specialDataSource">
    </StkTable>
</template>
