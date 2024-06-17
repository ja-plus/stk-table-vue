<template>
    <div>
        <p>插入表格排序</p>
        <button @click="addRow">add row</button>

        <StkTable
            ref="stkTable"
            row-key="id"
            style="height: 200px"
            max-width="max-content"
            :columns="columns"
            :data-source="dataSource"
            sort-remote
            :sort-config="{
                emptyToBottom: true,
                defaultSort: defaultSort,
            }"
            @sort-change="handleSortChange"
        ></StkTable>
    </div>
</template>
<script setup>
import { StkTable, insertToOrderedArray, tableSort } from '../src/StkTable/index';
import { nextTick, ref } from 'vue';

const stkTable = ref();

const columns = [
    { title: 'id', dataIndex: 'id', width: '50px', sorter: true },
    { title: 'name', dataIndex: 'name', width: '200px', sorter: true },
    { title: 'age(default desc)', dataIndex: 'age', width: '200px', sorter: true, sortType: 'number' },
    { title: 'gender', dataIndex: 'gender', width: '100px' },
];
const dataSource = ref(
    new Array(5).fill(null).map((it, i) => {
        return {
            id: i,
            name: i % 2 === 0 ? null : 'name' + i,
            age: i % 2 === 0 ? null : i,
            gender: i + 1,
        };
    }),
);
const defaultSort = {
    dataIndex: 'age',
    order: 'desc',
};
const tableSortStore = {
    ...defaultSort,
    // sortType: 'number',
};
function handleSortChange(col, order, data, sortConfig) {
    console.log('🚀 ~ handleSortChange ~ col:', col, order);
    dataSource.value = tableSort(col, order, data, sortConfig);
    tableSortStore.dataIndex = col.dataIndex;
    tableSortStore.order = order;
}
let count = dataSource.value.length;
function addRow() {
    const random = Math.random() * 10;
    const item = {
        id: count++,
        name: 'name' + random,
        age: random,
        gender: random,
    };
    // dataSource.value.push(item);
    // dataSource.value = [...dataSource.value];
    dataSource.value = insertToOrderedArray(tableSortStore, item, dataSource.value);
    nextTick(() => {
        stkTable.value.setHighlightDimRow([item.id]);
    });
}
</script>
