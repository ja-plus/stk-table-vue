<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

const stkTableRef = useTemplateRef('stkTableRef');

type DataType = {
    key: string;
    name: string;
    age: number;
    score: number;
    department: string;
};

const columns: StkTableColumn<DataType>[] = [
    { title: 'No.', dataIndex: '' as any, type: 'seq', width: 50 },
    { title: 'Name', dataIndex: 'name', sorter: true, width: 120 },
    { title: 'Age', dataIndex: 'age', sorter: true, sortType: 'number', width: 100 },
    { title: 'Score', dataIndex: 'score', sorter: true, sortType: 'number', width: 100 },
    { title: 'Department', dataIndex: 'department', sorter: true, width: 120 },
];

const dataSource = ref<DataType[]>([
    { key: '1', name: 'Alice', age: 25, score: 85, department: 'Engineering' },
    { key: '2', name: 'Bob', age: 30, score: 92, department: 'Sales' },
    { key: '3', name: 'Charlie', age: 25, score: 78, department: 'Engineering' },
    { key: '4', name: 'David', age: 30, score: 85, department: 'Marketing' },
    { key: '5', name: 'Eve', age: 25, score: 92, department: 'Sales' },
    { key: '6', name: 'Frank', age: 35, score: 78, department: 'Engineering' },
    { key: '7', name: 'Grace', age: 30, score: 85, department: 'Marketing' },
    { key: '8', name: 'Henry', age: 25, score: 78, department: 'Sales' },
    { key: '9', name: 'Ivy', age: 35, score: 92, department: 'Engineering' },
    { key: '10', name: 'Jack', age: 30, score: 78, department: 'Marketing' },
]);

const sortConfig = {
    multiSort: true,
    multiSortLimit: 3,
};

function getSortInfo() {
    const sortColumns = stkTableRef.value?.getSortColumns();
    const sortStates = stkTableRef.value?.sortStates;
    alert(
        `Current Sort: ${JSON.stringify(sortColumns, null, 2)}, 
        Sort States: ${JSON.stringify(sortStates, null, 2)}`,
    );
}

// 使用 setMultiSorter 设置多列排序
function setMultiSort() {
    // 先按 Department 升序，再按 Age 降序
    stkTableRef.value?.setSorter('department', 'asc');
    stkTableRef.value?.setSorter('age', 'desc', { append: true });
}

// 使用 setSorter 设置单列排序（在多列排序模式下会清除其他排序）
function setSingleSort() {
    stkTableRef.value?.setSorter('score', 'desc');
}

// 重置排序
function resetSort() {
    stkTableRef.value?.resetSorter();
}
</script>

<template>
    <div class="multi-sort-demo">
        <div class="toolbar">
            <button class="btn" @click="setMultiSort">Set (Age↓, Dept↑)</button>
            <button class="btn" @click="setSingleSort">Set (Score↓)</button>
            <button class="btn" @click="getSortInfo">Get Sort Info</button>
            <button class="btn" @click="resetSort">Reset</button>
        </div>

        <StkTable
            ref="stkTableRef"
            style="height: 200px"
            row-key="key"
            :sort-config="sortConfig"
            :columns="columns"
            :data-source="dataSource"
        />
    </div>
</template>

<style scoped>
.multi-sort-demo {
    padding: 16px;
}
.toolbar {
    margin-bottom: 12px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}
</style>
