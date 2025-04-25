<script lang="ts" setup>
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';

const columns: StkTableColumn<any>[] = [
    { type: 'seq', width: 50, dataIndex: '', title: '序号', width: 50 },
    { title: 'Name', dataIndex: 'name', sorter: true, width: 100 },
    { title: 'Age', dataIndex: 'age', sorter: true, width: 100 },
    { title: 'Address', dataIndex: 'address', sorter: true, width: 300 },
    { title: 'Gender', dataIndex: 'gender', sorter: true, width: 100 },
    ...new Array(10).fill(0).map((_, index) => {
        return { title: `Column ${index}`, dataIndex: `column${index}`, sorter: true, width: 100 };
    }),
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
    <StkTable
        style="height: 200px"
        class="scrollbar"
        :columns="columns"
        virtual
        :data-source="dataSource"
    ></StkTable>
</template>
<style scoped>
.scrollbar.light {
    --scrollbar-thumb-color: #b0b0b0;
    --scrollbar-thumb-hover-color: #888;
}
.scrollbar.dark {
    --scrollbar-thumb-color: #393838;
    --scrollbar-thumb-hover-color: #555;
}

.scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
.scrollbar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    border: 2px solid transparent;
    box-shadow: inset 0 0 0 4px var(--scrollbar-thumb-color);
}
.scrollbar::-webkit-scrollbar-thumb:hover {
    box-shadow: inset 0 0 0 4px var(--scrollbar-thumb-hover-color);
}
.scrollbar::-webkit-scrollbar-track {
    background-color: transparent;
    border: 1px solid var(--border-color);
    border-bottom: none;
    border-right: none;
}
.scrollbar::-webkit-scrollbar-corner {
    background-color: transparent;
    border-right: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
}
</style>
