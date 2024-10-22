<script lang="ts" setup>
import { h } from 'vue';
import { StkTable } from '../src/StkTable/index';
import { StkTableColumn } from '../src/StkTable/types';
const columns: StkTableColumn<any>[] = [
    {
        dataIndex: 'id',
        title: 'id(100px)',
        width: '100px',
        customCell({ cellValue, rowIndex }) {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const height = 50 + ((rowIndex * 5) % 50) + 'px';
            return h('div', { style: { height, backgroundColor: '#' + randomColor } }, 'id:' + cellValue + ',' + height);
        },
    },
];
const data = new Array(200).fill(0).map((it, index) => {
    return { id: index, name: 'hah', address: 'sss' };
});
</script>
<template>
    <div>
        <h3>Variable Row Height Virtual Table</h3>
        <StkTable row-key="id" style="height: 300px" virtual auto-row-height :columns="columns" :data-source="data"></StkTable>
    </div>
</template>
