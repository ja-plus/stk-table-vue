<template>
    <div style="padding: 16px">
        <CheckItem v-model="keyboard" :text="t('keyboardSelect') + `(v0.11.0)`"></CheckItem>
        <StkTable
            style="height: 400px"
            row-key="id"
            :row-active="false"
            :data-source="rows"
            :columns="cols"
            :area-selection="{ enabled: true, formatCellForClipboard: formatCell, keyboard }"
            @area-selection-change="onSelectionChange"
        />
        <div style="margin-top: 12px">
            <pre style="white-space: pre-wrap">{{ JSON.stringify(currentRange, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { useI18n } from '../../hooks/useI18n/index';
import CheckItem from '../../components/CheckItem.vue';

const { t } = useI18n();

type Row = { id: number; name: string; age: number; city: string };

const keyboard = ref(true);

const cols = [
    { title: 'ID', dataIndex: 'id', fixed: 'left', width: 50 },
    { title: 'Name', dataIndex: 'name', width: 120 },
    { title: 'Age', dataIndex: 'age', width: 80 },
    { title: 'City', dataIndex: 'city', width: 120 },
    { title: 'City', dataIndex: 'city1', width: 120 },
    { title: 'City', dataIndex: 'city2', width: 120 },
    { title: 'City', dataIndex: 'city3', width: 120 },
    { title: 'City', dataIndex: 'city4', width: 120 },
];

const rows = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User${i + 1}`,
    age: 20 + (i % 30),
    city: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'][i % 4],
}));

const currentRange = ref(null as any);

function onSelectionChange(range: any, data: any) {
    currentRange.value = {
        range,
        rows: data.rows?.length ?? 0,
        cols: data.cols?.length ?? 0,
    };
}

function formatCell(row: Row, col: any, raw: any) {
    return raw === null ? '' : String(raw);
}
</script>

<style scoped>
pre {
    padding: 8px;
}
</style>
