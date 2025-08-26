<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../../StkTable.vue';
import { dataSource } from './dataSource';



const columns: StkTableColumn<any>[] = [
    { title: 'ID', dataIndex: 'id', width: 100, },
    { title: 'Continent', dataIndex: 'continent', width: 100, mergeCells, },
    { title: 'Country', dataIndex: 'country', width: 120, mergeCells, },
    { title: 'Province', dataIndex: 'province' },
];

function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}

function addMoreData() {
    // add 1000 row
    const last = dataSource.value.at(-1);
    const id = last?.id.split('-') || [];
    const startIndex = Number(id[0] || 0);
    const data = [];
    let childCount = 10;
    for (let i = startIndex; i < startIndex + 100; i++) {
        for (let j = 0; j < childCount; j++) {
            const row:any = {
                id: i + '-' + j,
                continent: 'Asia'+i,
                country: 'China',
                province: 'Beijing',
            }
            if(j === 0){
                row.rowspan = {
                    continent: childCount,
                };
            }
            data.push(row);
        }
    }
    dataSource.value = dataSource.value.concat(data);
}
</script>
<template>
    <button class="btn" @click="addMoreData">Add 1000 row</button>
    <StkTable style="max-height: 300px" virtual cell-hover row-key="id" :columns="columns" :data-source="dataSource">
    </StkTable>
</template>
