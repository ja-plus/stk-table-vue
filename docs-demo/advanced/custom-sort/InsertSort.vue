<template>
    <button class="btn" @click="addRow">插入一行</button>
    <button class="btn" @click="clear">清除数据</button>
    <StkTable
        ref="stkTableRef"
        row-key="id"
        style="height: 200px"
        max-width="max-content"
        sort-remote
        :columns="columns"
        :data-source="dataSource"
        :sort-config="{
            emptyToBottom: true,
            defaultSort: defaultSort,
        }"
        @sort-change="handleSortChange"
    ></StkTable>
</template>
<script setup lang="ts">
import { StkTableColumn } from '@/StkTable/index';
import { insertToOrderedArray, tableSort } from '../../../src/StkTable/index';
import { Order, SortConfig, SortState } from '@/StkTable/types';
import { nextTick, ref, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';

const stkTableRef = useTemplateRef('stkTableRef');

type DataType = {
    id: number;
    name: string | null;
    age: number | null;
    gender: number;
};

const columns: StkTableColumn<DataType>[] = [
    { title: 'id', dataIndex: 'id', width: '50px', sorter: true },
    { title: 'name', dataIndex: 'name', width: '200px', sorter: true },
    { title: 'age(default desc)', dataIndex: 'age', width: '200px', sorter: true, sortType: 'number' },
    { title: 'gender', dataIndex: 'gender' },
];
const dataSource = ref<DataType[]>(
    new Array(5).fill(null).map((it, i) => {
        return {
            id: i,
            name: i % 2 === 0 ? null : 'name' + i,
            age: i % 2 === 0 ? null : i,
            gender: i + 1,
        };
    }),
);
const defaultSort: SortState<DataType> = {
    dataIndex: 'age',
    order: 'desc',
};
const tableSortStore: SortState<DataType> = {
    ...defaultSort,
};
function handleSortChange(col: StkTableColumn<DataType>, order: Order, data: DataType[], sortConfig: SortConfig<DataType>) {
    dataSource.value = tableSort(col, order, data, sortConfig);
    tableSortStore.dataIndex = col.dataIndex;
    tableSortStore.order = order;
}
let count = dataSource.value.length;
function addRow() {
    const random = Math.random() * 10;
    const item: DataType = {
        id: count++,
        name: 'name' + random,
        age: random,
        gender: random,
    };
    dataSource.value = insertToOrderedArray(tableSortStore, item, dataSource.value);
    nextTick(() => {
        stkTableRef.value?.setHighlightDimRow([item.id]);
    });
}

function clear() {
    dataSource.value = [];
}
</script>
