<template>
    <div>
        <StkTable
            row-key="id"
            cell-active
            :selected-cell-revokable="false"
            :row-height="40"
            :columns="columns"
            :data-source="tableData"
        />
        <div>data-source:</div>
        <div>
            <div>[</div>
            <div v-for="row in tableData" :key="row.id" style="padding-left: 16px">{{ row }},</div>
            <div>]</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { StkTableColumn } from '@/StkTable/index';
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import EditCell from './EditCell.vue';
import EditRowSwitch from './EditRowSwitch.vue';
import { RowDataType } from './type';

// 定义表格列
const columns: StkTableColumn<RowDataType>[] = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '姓名', dataIndex: 'name', width: 100, customCell: EditCell<RowDataType> },
    { title: '年龄', dataIndex: 'age', width: 80, customCell: EditCell<RowDataType> },
    { title: '地址', dataIndex: 'address', customCell: EditCell<RowDataType> },
    { title: '编辑行', dataIndex: '_isEditing', width: 80, customCell: EditRowSwitch },
];

// 初始化表格数据
const tableData = ref<RowDataType[]>([
    { id: 1, name: '张三', age: 28, address: '北京市海淀区' },
    { id: 2, name: '李四', age: 32, address: '上海市浦东新区', _isEditing: true },
    { id: 3, name: '王五', age: 45, address: '广州市天河区' },
    { id: 4, name: '赵六', age: 22, address: '深圳市南山区' },
]);
</script>
