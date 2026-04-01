<script lang="ts" setup>
import { layout, prepare } from '@chenglou/pretext';
import { onMounted, useTemplateRef } from 'vue';
import { StkTable } from '../src/StkTable/index';
import { StkTableColumn } from '../src/StkTable/types';

const stkTableRef = useTemplateRef('stkTableRef');

const columns: StkTableColumn<any>[] = [
    { dataIndex: 'id', title: 'ID', width: 50 },
    { dataIndex: 'name', title: 'Pretext 计算', width: 200 },
];

const data = new Array(1000).fill(0).map((it, index) => {
    return { id: index, name: getCellContent(), address: 'sss' };
});

onMounted(() => {
    preCalculateAllRowHeights(data);
});

function getCellContent() {
    const randomLength = Math.floor(Math.random() * 10) + 1; // 1-10 个重复单元
    const baseText = '这是一段测试文本';
    return `${baseText.repeat(randomLength)}`;
}

function calculateHeightWithPretext(text: string, width: number): number {
    const prepared = prepare(text, '14px system-ui');
    const { height } = layout(prepared, width, 18);
    return Math.max(height, 28);
}

// 预计算所有行的行高
function preCalculateAllRowHeights(data: any[]) {
    const columnWidth = 184; // 列宽
    data.forEach(row => {
        const height = calculateHeightWithPretext(row.name, columnWidth);
        stkTableRef.value?.setAutoHeight(row.id, height);
    });
}
</script>
<template>
    <div>
        <h3>Auto Row Height Virtual Table with Pretext</h3>
        <StkTable
            ref="stkTableRef"
            row-key="id"
            style="height: 500px; width: 250px"
            stripe
            virtual
            :row-height="30"
            auto-row-height
            :columns="columns"
            :data-source="data"
        ></StkTable>
    </div>
</template>
<style scoped>
.stk-table {
    line-height: 18px;
}
</style>
