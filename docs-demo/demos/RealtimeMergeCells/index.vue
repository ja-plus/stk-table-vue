<script lang="ts" setup>
import type { AreaSelectionRange, StkTableColumn } from '@/StkTable/index';
import ContextMenu from 'ja-contextmenu';
import { MenuOption } from 'ja-contextmenu/lib/types/MenuOption';
import { computed, reactive, ref } from 'vue';
import { useData } from 'vitepress';
import StkTable from '../../StkTable.vue';
import { useI18n } from '../../hooks/useI18n/index';

import 'ja-contextmenu/styles/dark.css';

const { isDark } = useData();
const { t } = useI18n();

type Row = { id: number; name: string; age: number; city: string; score: number };

const columns: StkTableColumn<Row>[] = [
    { title: 'ID', dataIndex: 'id', width: 60, mergeCells },
    { title: t('name'), dataIndex: 'name', width: 120, mergeCells },
    { title: t('age'), dataIndex: 'age', width: 100, mergeCells },
    { title: t('city'), dataIndex: 'city', width: 120, mergeCells },
    { title: t('score'), dataIndex: 'score', width: 100, mergeCells },
    ...new Array(20).fill(0).map(
        (_, i) =>
            ({
                title: `Column ${i}`,
                dataIndex: `column-${i}` as any,
                width: 100,
                mergeCells,
            }) as StkTableColumn<Row>,
    ),
];

const dataSource = ref<Row[]>(
    Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User${i + 1}`,
        age: 20 + (i % 30),
        city: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'][i % 4],
        score: 60 + (i % 40),
    })),
);

/**
 * Merge state storage
 * key: `${rowId}__${colIndex}`
 * value: { rowspan, colspan }
 */
const mergeMap = reactive(new Map<string, { rowspan: number; colspan: number }>());

function getMergeKey(rowId: number, colIndex: number) {
    return `${rowId}__${colIndex}`;
}

/** mergeCells callback for each column */
function mergeCells({ row, col }: { row: Row; col: StkTableColumn<Row> }) {
    const colIndex = columns.findIndex(c => c.dataIndex === col.dataIndex);
    const info = mergeMap.get(getMergeKey(row.id, colIndex));
    if (info) return info;
}

// ============ Area Selection ============
const selectionRanges = ref<AreaSelectionRange[]>([]);

function onSelectionChange(ranges: AreaSelectionRange[]) {
    selectionRanges.value = ranges;
}

/** Normalize range to min/max */
function normalizeRange(range: AreaSelectionRange) {
    const { begin, end } = range.index;
    return {
        minRow: Math.min(begin.row, end.row),
        maxRow: Math.max(begin.row, end.row),
        minCol: Math.min(begin.col, end.col),
        maxCol: Math.max(begin.col, end.col),
    };
}

// ============ Merge / Split ============
function mergeSelectedCells() {
    if (!selectionRanges.value.length) return;
    const range = selectionRanges.value[selectionRanges.value.length - 1];
    const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);

    const rowspan = maxRow - minRow + 1;
    const colspan = maxCol - minCol + 1;
    if (rowspan <= 1 && colspan <= 1) return;

    const startRow = dataSource.value[minRow];
    if (!startRow) return;

    // Remove conflicting merge info within the range
    for (let r = minRow; r <= maxRow; r++) {
        const row = dataSource.value[r];
        if (!row) continue;
        for (let c = minCol; c <= maxCol; c++) {
            mergeMap.delete(getMergeKey(row.id, c));
        }
    }

    // Set merge info on the top-left cell
    mergeMap.set(getMergeKey(startRow.id, minCol), { rowspan, colspan });

    // Force table re-render
    dataSource.value = dataSource.value.slice();
}

function splitSelectedCells() {
    if (!selectionRanges.value.length) return;

    for (const range of selectionRanges.value) {
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        for (let r = minRow; r <= maxRow; r++) {
            const row = dataSource.value[r];
            if (!row) continue;
            for (let c = minCol; c <= maxCol; c++) {
                mergeMap.delete(getMergeKey(row.id, c));
            }
        }
    }

    // Force table re-render
    dataSource.value = dataSource.value.slice();
}

// ============ Context Menu (ja-contextmenu) ============
const canMerge = computed(() => {
    if (!selectionRanges.value.length) return false;
    const range = selectionRanges.value[selectionRanges.value.length - 1];
    const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
    return maxRow - minRow + 1 > 1 || maxCol - minCol + 1 > 1;
});

const canSplit = computed(() => {
    if (!selectionRanges.value.length) return false;
    for (const range of selectionRanges.value) {
        const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
        for (let r = minRow; r <= maxRow; r++) {
            const row = dataSource.value[r];
            if (!row) continue;
            for (let c = minCol; c <= maxCol; c++) {
                if (mergeMap.has(getMergeKey(row.id, c))) return true;
            }
        }
    }
    return false;
});

const contextMenu = new ContextMenu({
    theme: () => (isDark.value ? 'dark' : ('' as any)),
});
const menuOption: MenuOption<any> = {
    items: [
        {
            label: () => t('mergeCells'),
            disabled: () => !canMerge.value,
            onclick: () => {
                mergeSelectedCells();
            },
        },
        {
            label: () => t('splitCells'),
            disabled: () => !canSplit.value,
            onclick: () => {
                splitSelectedCells();
            },
        },
    ],
};
const menu = contextMenu.create(menuOption);

function onRowMenu(e: MouseEvent) {
    menu.show(e);
}

const mergedCount = computed(() => mergeMap.size);
</script>

<template>
    <div class="realtime-merge-cells-demo">
        <p class="demo-tip">{{ t('realtimeMergeTip') }}</p>
        <StkTable
            style="height: 400px"
            row-key="id"
            virtual
            virtual-x
            :columns="columns"
            :data-source="dataSource"
            :area-selection="{ enabled: true }"
            @area-selection-change="onSelectionChange"
            @row-menu="onRowMenu"
        />
        <div class="demo-status">
            <span>{{ t('mergedRegions') }}: {{ mergedCount }}</span>
        </div>
    </div>
</template>

<style scoped>
.demo-tip {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--vp-c-text-2, #888);
}
.demo-status {
    margin-top: 8px;
    font-size: 13px;
    color: var(--vp-c-text-2, #888);
}
</style>
