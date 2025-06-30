<script lang="ts" setup>
import { ref } from 'vue';
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../StkTable.vue';

const rowSpanCount = {
    asia: 5,
    china: 3,
};

const columns: StkTableColumn<any>[] = [
    {
        title: 'Continent',
        dataIndex: 'continent',
        mergeCells({ row }) {
            if (row.id === '1-1-1') {
                return { rowspan: rowSpanCount.asia };
            } else if (row.id === '2-1-1') {
                return { rowspan: 2 };
            }
        },
    },
    {
        title: 'Country',
        dataIndex: 'country',
        mergeCells({ row }) {
            if (row.id === '1-1-1') {
                return { rowspan: rowSpanCount.china };
            }
        },
    },
    { title: 'Province', dataIndex: 'province' },
];
const dataSource = ref([
    { id: '1-1-1', continent: 'Asia', country: 'China', province: 'Beijing' },
    { id: '1-1-2', continent: 'Asia', country: 'China', province: 'Shanghai' },
    { id: '1-1-3', continent: 'Asia', country: 'China', province: 'Guangzhou' },
    { id: '1-2-1', continent: 'Asia', country: 'Japan', province: 'Tokyo' },
    { id: '1-3-1', continent: 'Asia', country: 'Korea', province: 'Seoul' },
    { id: '2-1-1', continent: 'Europe', country: 'France', province: 'Paris' },
    { id: '2-2-1', continent: 'Europe', country: 'England', province: 'England' },
]);
function deleteARow() {
    const temp: any = JSON.parse(JSON.stringify(dataSource.value));
    const i = temp.findIndex((it: any) => it.id === '1-1-3');
    if (i < 0) return;
    temp.splice(i, 1);
    rowSpanCount.asia = 4;
    rowSpanCount.china = 2;
    dataSource.value = temp;
}
</script>
<template>
    <button class="btn" @click="deleteARow">Delete 'Guangzhou' row</button>
    <StkTable
        style="max-height: 300px"
        cell-hover
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
