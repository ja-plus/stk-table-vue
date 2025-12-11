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
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

// 定义表格列
const columns: StkTableColumn<RowDataType>[] = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: t('name'), dataIndex: 'name', width: 100, customCell: EditCell<RowDataType> },
    { title: t('age'), dataIndex: 'age', width: 80, customCell: EditCell<RowDataType> },
    { title: t('address'), dataIndex: 'address', customCell: EditCell<RowDataType> },
    { title: t('edit'), dataIndex: '_isEditing', width: 80, customCell: EditRowSwitch },
];

// 初始化表格数据
const tableData = ref<RowDataType[]>([
    { id: 1, name: '张三', age: 28, address: '北京市海淀区' },
    { id: 2, name: '李四', age: 32, address: '上海市浦东新区', _isEditing: true },
    { id: 3, name: 'Jack', age: 45, address: 'London' },
    { id: 4, name: 'Rose', age: 22, address: 'New York' },


]);
</script>
