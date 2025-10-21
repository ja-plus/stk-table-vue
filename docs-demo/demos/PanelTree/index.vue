<template>
    <div>
        <StkTable 
            row-key="id" 
            bordered="h"
            show-overflow
            :empty-cell-text="({row}) => row.children ? '' : '--'"
            :tree-config="{defaultExpandAll: true}"
            :selected-cell-revokable="false" 
            :columns="columns"
            :data-source="tableData" />
    </div>
</template>

<script setup lang="ts">
import type { StkTableColumn } from '@/StkTable/index';
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { RowDataType } from './type';

// 定义表格列
const columns: StkTableColumn<RowDataType>[] = [
    { title: 'ID', dataIndex: 'id', width: 50, type: 'tree-node', className: 'panel-title' },
    { title: 'Name', dataIndex: 'name', width: 100, },
    { title: 'Age', dataIndex: 'age', width: 80, },
    { title: 'Address', dataIndex: 'address',width: 200 },
];

// 初始化表格数据
const tableData = ref<RowDataType[]>([
    {
        id: 'China',
        children: [
            { id: '1', name: 'Beijing', age: 28, address: '北京市海淀区' },
        ]
    },
    {
        id: 'America',
        children: [
            { id: '1', name: 'New York', age: 35, address: '纽约市曼哈顿区' },
        ]
    },
]);
</script>
<style lang="less" scoped>
.panel-title .table-cell-wrapper {
    font-weight: bold;
    overflow: initial;
}
</style>
