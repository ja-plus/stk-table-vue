<template>
    <div style="padding: 16px">
        <div class="toolbar">
            <span>按住鼠标左键拖拽可选择连续多行，按住 Ctrl / Command 可追加不连续区间。</span>
            <button class="btn" @click="clearSelection">clearSelectedRows()</button>
        </div>
        <StkTable
            ref="stkTableRef"
            style="height: 360px"
            row-key="id"
            :row-active="false"
            :columns="columns"
            :data-source="rows"
            :row-drag-selection="true"
            @row-drag-selection-change="onSelectionChange"
        />
        <div class="result-panel">
            <pre>{{ JSON.stringify(currentSelection, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import type { StkTableColumn } from '../../../src/StkTable';

type Row = {
    id: number;
    code: string;
    name: string;
    price: number;
    volume: number;
};

const stkTableRef = useTemplateRef('stkTableRef');

const columns: StkTableColumn<Row>[] = [
    { title: 'ID', dataIndex: 'id', width: 70, fixed: 'left' },
    { title: 'Code', dataIndex: 'code', width: 120 },
    { title: 'Name', dataIndex: 'name', width: 160 },
    { title: 'Price', dataIndex: 'price', width: 120, align: 'right' },
    { title: 'Volume', dataIndex: 'volume', width: 120, align: 'right' },
];

const rows = Array.from({ length: 80 }, (_, index) => ({
    id: index + 1,
    code: `STK${String(index + 1).padStart(4, '0')}`,
    name: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'][index % 5] + ` ${index + 1}`,
    price: Number((18 + index * 0.37).toFixed(2)),
    volume: 1000 + index * 125,
}));

const currentSelection = ref({
    range: null as null | { startRowIndex: number; endRowIndex: number },
    ranges: [] as { startRowIndex: number; endRowIndex: number }[],
    count: 0,
    rowIds: [] as number[],
});

function onSelectionChange(
    range: { startRowIndex: number; endRowIndex: number } | null,
    data: { rows: Row[]; ranges: { startRowIndex: number; endRowIndex: number }[] }
) {
    currentSelection.value = {
        range,
        ranges: data.ranges,
        count: data.rows.length,
        rowIds: data.rows.map(row => row.id),
    };
}

function clearSelection() {
    stkTableRef.value?.clearSelectedRows();
    currentSelection.value = {
        range: null,
        ranges: [],
        count: 0,
        rowIds: [],
    };
}
</script>

<style scoped>
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
}

.btn {
    padding: 4px 10px;
    cursor: pointer;
}

.result-panel {
    margin-top: 12px;
}

pre {
    margin: 0;
    padding: 12px;
    white-space: pre-wrap;
}
</style>
