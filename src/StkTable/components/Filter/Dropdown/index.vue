<script setup lang="ts">
import { StkTableColumn } from '@/StkTable/types';
import { h, onMounted, onUnmounted, reactive, ref } from 'vue';
import StkTable from '../../../StkTable.vue';
import type { FilterOption } from '../types';

const theme = ref<'light' | 'dark'>('light');
const checkedTempValueSet = reactive<Set<FilterOption['value']>>(new Set());

const columns = ref<StkTableColumn<FilterOption>[]>([
    {
        title: '',
        dataIndex: 'value',
        width: 30,
        className: 'stk-filter-dropdown-checkbox',
        customCell: ({ row }) =>
            h('input', {
                type: 'checkbox',
                checked: checkedTempValueSet.has(row.value),
                onClick: e => e.preventDefault(),
            }),
    },
    { title: '', dataIndex: 'label', customCell: ({ row }) => h('span', [row.label]) },
]);

const visible = ref(false);
const position = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const options = ref<FilterOption[]>([]);

const dropdownEl = ref<HTMLDivElement>();

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

let onConfirmFn: (values: FilterOption['value'][]) => void;

function show(pos: { x: number; y: number }, opt: FilterOption[], onConfirm: (values: FilterOption['value'][]) => void) {
    visible.value = true;
    position.value = pos;
    options.value = opt || [];
    initChecked();
    onConfirmFn = onConfirm;
}

async function handleClickOutside(e: MouseEvent) {
    if (!visible.value || dropdownEl.value?.contains(e.target as Node)) return;
    hide();
}

function initChecked() {
    options.value.forEach(opt => {
        if (opt.selected) {
            checkedTempValueSet.add(opt.value);
        }
    });
}

function updateChecked(checked: boolean, row: FilterOption) {
    if (checked) {
        checkedTempValueSet.add(row.value);
    } else {
        checkedTempValueSet.delete(row.value);
    }
}

function confirm() {
    options.value.forEach(opt => (opt.selected = checkedTempValueSet.has(opt.value)));
    onConfirmFn(Array.from(checkedTempValueSet));
    hide();
}
function hide() {
    visible.value = false;
    options.value = [];
    checkedTempValueSet.clear();
}
function handleRowClick(e: MouseEvent, row: FilterOption) {
    const selected = checkedTempValueSet.has(row.value);
    updateChecked(!selected, row);
}

function setTheme(t: 'light' | 'dark') {
    theme.value = t;
}

function handleClear() {
    checkedTempValueSet.clear();
}

defineExpose({ visible, show, hide, setTheme });
</script>
<template>
    <div
        ref="dropdownEl"
        class="stk-filter-dropdown"
        :class="[`stk-filter-dropdown--${theme}`]"
        :style="{ top: position.y + 'px', left: position.x + 'px', display: visible ? void 0 : 'none' }"
        @click.stop
    >
        <div style="padding: 4px">Filter (Beta)</div>
        <StkTable
            row-key="id"
            headless
            virtual
            no-data-full
            :theme="theme"
            :row-active="false"
            :row-height="20"
            :bordered="false"
            :columns="columns"
            :data-source="options"
            @row-click="handleRowClick"
        />
        <footer>
            <button @click="handleClear">↺</button>
            <button @click="confirm">✓</button>
        </footer>
    </div>
</template>
