<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../../StkTable.vue';
import { useI18n } from '../../../hooks/useI18n/index';

const { t } = useI18n();

const COL_COUNT = 200;
const HUGE_COLSPAN = 150;

const columns: StkTableColumn<any>[] = [
    { title: t('id'), dataIndex: 'id', width: 80 },
    ...new Array(COL_COUNT - 1)
        .fill(0)
        .map((_, i) => ({ title: `Column ${i}`, dataIndex: `c${i}`, width: 100 })),
];
// 第二列作为锚点列，合并 HUGE_COLSPAN 列
columns[1].mergeCells = ({ row }: { row: any }) =>
    row.colspan ? { colspan: row.colspan } : void 0;

// 30 行数据，偶数行超长合并（colspan=150），奇数行不合并
const dataSource = new Array(30).fill(0).map((_, i) => ({
    id: i,
    c0: i % 2 === 0 ? `colspan = ${HUGE_COLSPAN}` : `Normal ${i}`,
    colspan: i % 2 === 0 ? HUGE_COLSPAN : void 0,
}));
</script>
<template>
    <p style="margin: 8px 0; color: var(--vp-c-text-2); font-size: 13px">
        {{ t('id') }}: 1-30 / {{ COL_COUNT }} columns / colspan: {{ HUGE_COLSPAN }}
    </p>
    <StkTable
        style="max-height: 300px"
        virtual
        virtual-x
        cell-hover
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
