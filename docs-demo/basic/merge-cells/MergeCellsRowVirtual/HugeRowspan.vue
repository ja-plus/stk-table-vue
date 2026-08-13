<script lang="ts" setup>
import { ref } from 'vue';
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../../StkTable.vue';
import { useI18n } from '../../../hooks/useI18n/index';

const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { title: t('id'), dataIndex: 'id', width: 80 },
    { title: t('continent'), dataIndex: 'continent', width: 120, mergeCells },
    { title: t('country'), dataIndex: 'country', width: 120, mergeCells },
    { title: t('province'), dataIndex: 'province' },
];

function mergeCells({ row, col }: { row: any; col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}

// 生成 5000 行数据，其中包含 rowspan=1000 / 2000 的超长合并
const dataSource = ref(
    (() => {
        const rows: any[] = [];
        const groups = [
            { continent: 'Asia', country: 'China', rowspan: 1000 },
            { continent: 'Europe', country: 'France', rowspan: 2000 },
            { continent: 'America', country: 'United States', rowspan: 1000 },
            { continent: 'Africa', country: 'Egypt', rowspan: 500 },
            { continent: 'Oceania', country: 'Australia', rowspan: 500 },
        ];
        let id = 0;
        for (const g of groups) {
            const provinces = generateProvinces(g.rowspan);
            for (let i = 0; i < g.rowspan; i++) {
                const row: any = {
                    id: id++,
                    continent: g.continent,
                    country: g.country,
                    province: provinces[i],
                };
                if (i === 0) {
                    row.rowspan = { continent: g.rowspan, country: Math.floor(g.rowspan / 2) };
                } else if (i === Math.floor(g.rowspan / 2)) {
                    row.rowspan = { country: Math.ceil(g.rowspan / 2) };
                }
                rows.push(row);
            }
        }
        return rows;
    })(),
);

function generateProvinces(count: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        result.push(`Province ${i}`);
    }
    return result;
}
</script>

<template>
    <p style="margin: 8px 0; color: var(--vp-c-text-2); font-size: 13px">
        {{ t('id') }}: 1-5000 / continent rowspan: 1000~2000
    </p>
    <StkTable
        style="max-height: 300px"
        virtual
        cell-hover
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
    >
    </StkTable>
</template>
