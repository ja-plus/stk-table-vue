<template>
    <div>
        <button class="btn" @click="updateCell">更新第一个单元格</button>
        <StkTable
            ref="stkTableRef"
            row-key="rowTitle"
            :row-height="60"
            cell-hover
            cell-active
            :row-hover="false"
            :row-active="false"
            :columns="columns"
            :data-source="tableData"
        />
    </div>
</template>

<script setup lang="ts">
import type { StkTableColumn } from '@/StkTable/index'; // 请替换为实际的导入路径
import { ref, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import MatrixCell from './MatrixCell.vue';
import { CellDataType, RowDataType } from './type';

const stkTableRef = useTemplateRef('stkTableRef');

const columns: StkTableColumn<any>[] = [
    { title: '', dataIndex: 'rowTitle', className: 'col-title', width: 100 },
    { title: '1M', dataIndex: 'm1', className: 'no-padding', customCell: MatrixCell },
    { title: '3M', dataIndex: 'm3', className: 'no-padding', customCell: MatrixCell },
    { title: '6M', dataIndex: 'm6', className: 'no-padding', customCell: MatrixCell },
    { title: '1Y', dataIndex: 'y1', className: 'no-padding', customCell: MatrixCell },
];

const colTitle = ['AAA+', 'AAA', 'AA+', 'AA', 'AA-及以下'];

const tableData = ref<RowDataType[]>([]);
initTableData();

function initTableData() {
    tableData.value = colTitle.map(title => {
        let row: any = {
            rowTitle: title,
        };
        columns.forEach((col, colIndex) => {
            if (colIndex === 0) return;
            row[col.dataIndex] = createCellData();
        });
        return row as RowDataType;
    });
}

function createCellData(): CellDataType {
    return {
        code: Math.floor(Math.random() * 1000000) + '.IB',
        value: (Math.random() * 100).toFixed(4),
        count: Math.floor(Math.random() * 100),
        percent: Math.random() * 100,
        // 随机正负数
        bp: (Math.random() * 4 - 2).toFixed(2),
    };
}

function updateCell() {
    tableData.value[0].m1 = createCellData();
    stkTableRef.value?.setHighlightDimCell('AAA+', 'm1');
}
</script>

<style scoped lang="less">
:deep(.col-title) {
    color: var(--th-color);
    background-color: var(--th-bgc);
    font-weight: bold;
}
.stk-table {
    :deep(.stk-table-main) {
        height: 100%; // 重要，这里必须加高度
    }
    :deep(.no-padding) {
        padding: 0; // 去除表格默认的padding
    }
}
</style>
