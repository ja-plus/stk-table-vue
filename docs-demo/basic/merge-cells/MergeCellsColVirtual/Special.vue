<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../../StkTable.vue';

const columns: StkTableColumn<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 50, align: 'center' },
    { title: 'A', dataIndex: 'a', width: 100, mergeCells },
    { title: 'B', dataIndex: 'b', width: 120, mergeCells },
    { title: 'C', dataIndex: 'c', width: 100, mergeCells },
    { title: 'D', dataIndex: 'd', width: 100, mergeCells },
    { title: 'E', dataIndex: 'e', width: 100, mergeCells },
    { title: 'F', dataIndex: 'f', width: 100, mergeCells },
    // 20 个列，撑出横向滚动
    ...new Array(20)
        .fill(0)
        .map((_, i) => ({ title: `Column ${i}`, dataIndex: `column-${i}`, width: 100, mergeCells })),
];

function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.colspan) return;
    return { colspan: row.colspan[col.dataIndex] || 1 };
}

const COL_KEYS = ['a', 'b', 'c', 'd', 'e', 'f'];
function createRow(id: string, colspan?: Record<string, number>) {
    const row: any = { id };
    COL_KEYS.forEach((key, i) => {
        row[key] = String(i + 1);
    });
    new Array(20).fill(0).forEach((_, i) => {
        row[`column-${i}`] = `${i}`;
    });
    if (colspan) row.colspan = colspan;
    return row;
}

const dataSource = [
    createRow('01', { a: 2 }),
    createRow('02', { b: 3, 'column-0': 4 }),
    createRow('03', { a: 3, e: 2 }),
    createRow('04', { 'column-5': 6 }),
    createRow('05', { c: 4 }),
    createRow('06', { a: 2, d: 3, 'column-10': 5 }),
    createRow('07', { f: 4 }),
    createRow('08', { a: 6 }),
    createRow('09', { 'column-2': 8 }),
    createRow('10', { b: 2, e: 2 }),
    createRow('11', { d: 4, 'column-14': 6 }),
    createRow('12', { a: 4 }),
    createRow('13', { 'column-7': 5 }),
    createRow('14', { c: 3 }),
    createRow('15', { e: 3, 'column-16': 4 }),
    createRow('16', { a: 2, c: 2 }),
    createRow('17', { 'column-1': 6 }),
    createRow('18', { b: 4, f: 5 }),
    createRow('19', { a: 3 }),
    createRow('20', { 'column-12': 8 }),
];
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
