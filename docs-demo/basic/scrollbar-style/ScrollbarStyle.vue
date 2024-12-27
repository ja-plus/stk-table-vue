<script lang="ts" setup>
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';

const columns: StkTableColumn<any>[] = [
    { type: 'seq', width: 50, dataIndex: '', title: '序号' },
    { title: 'Name', dataIndex: 'name', sorter: true },
    { title: 'Age', dataIndex: 'age', sorter: true },
    { title: 'Address', dataIndex: 'address', sorter: true },
    { title: 'Gender', dataIndex: 'gender', sorter: true },
];

const dataSource = new Array(100).fill(0).map((_, index) => {
    return {
        name: `Jack ${index}`,
        age: 18 + index,
        address: `Beijing Forbidden City ${index}`,
        gender: index % 2 === 0 ? 'male' : 'female',
    };
});
</script>
<template>
    <StkTable style="height: 200px" class="scrollbar" :columns="columns" virtual :data-source="dataSource"></StkTable>
</template>
<style scoped>
.scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
.scrollbar::-webkit-scrollbar-thumb {
    background-color: #b0b0b0;
    border-radius: 4px;
}
.scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a0a0a0;
}
.scrollbar::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 4px;
}
</style>
