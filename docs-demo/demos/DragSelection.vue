<template>
    <div style="padding: 16px">
        <StkTable
            :data-source="rows"
            :columns="cols"
            :row-key="rowKey"
            :cell-selection="{ formatCellForClipboard: formatCell }"
            style="height: 400px; border: 1px solid #e6e6e6"
            @cell-selection-change="onSelectionChange"
        />

        <div style="margin-top: 12px">
            <strong>当前选区：</strong>
            <pre style="white-space: pre-wrap">{{ JSON.stringify(currentRange, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../StkTable.vue';

type Row = { id: number; name: string; age: number; city: string };

const rowKey = (r: Row) => r.id;

const cols = [
    { title: 'ID', dataIndex: 'id' },
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '城市', dataIndex: 'city' },
];

const rows = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    city: ['北京', '上海', '广州', '深圳'][i % 4],
}));

const currentRange = ref(null as any);

function onSelectionChange(range: any, payload: any) {
    currentRange.value = {
        range,
        rows: payload.rows?.length ?? 0,
        cols: payload.cols?.length ?? 0,
    };
}

function formatCell(row: Row, col: any, raw: any) {
    return raw === null ? '' : String(raw);
}
</script>

<style scoped>
pre {
    background: #fafafa;
    padding: 8px;
    border: 1px solid #eee;
}
</style>
