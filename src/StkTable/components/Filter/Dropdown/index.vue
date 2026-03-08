<script setup lang="ts">
import { StkTableColumn } from '@/StkTable/types';
import { h, onMounted, onUnmounted, ref } from 'vue';
import StkTable from '../../../StkTable.vue';
import type { FilterOption } from '../types';

const theme = ref<'light' | 'dark'>('light');
const checkedTempValue = ref<Set<FilterOption['value']>>(new Set());

const columns = ref<StkTableColumn<FilterOption>[]>([
    {
        title: '',
        dataIndex: 'value',
        className: 'stk-filter-dropdown-checkbox',
        customCell: ({ row }) =>
            h('input', {
                type: 'checkbox',
                checked: checkedTempValue.value.has(row.value),
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
function clear() {
    options.value = [];
    checkedTempValue.value.clear();
    confirm();
}

async function handleClickOutside(e: MouseEvent) {
    if (!visible.value || dropdownEl.value?.contains(e.target as Node)) return;
    hide();
}

function initChecked() {
    checkedTempValue.value = new Set(options.value.filter(opt => opt.selected).map(opt => opt.value));
}

function updateChecked(checked: boolean, row: FilterOption) {
    if (checked) {
        checkedTempValue.value.add(row.value);
    } else {
        checkedTempValue.value.delete(row.value);
    }
}

function confirm() {
    options.value.forEach(opt => (opt.selected = checkedTempValue.value.has(opt.value)));
    onConfirmFn(Array.from(checkedTempValue.value));
    hide();
}
function hide() {
    visible.value = false;
}
function handleRowClick(e: MouseEvent, row: FilterOption) {
    const selected = checkedTempValue.value.has(row.value);
    updateChecked(!selected, row);
}

function setTheme(t: 'light' | 'dark') {
    theme.value = t;
}

defineExpose({ visible, show, clear, hide, setTheme });
</script>
<template>
    <div
        ref="dropdownEl"
        class="stk-filter-dropdown"
        :class="[`stk-filter-dropdown--${theme}`]"
        :style="{ top: position.y + 'px', left: position.x + 'px', display: visible ? void 0 : 'none' }"
        @click.stop
    >
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
        >
        </StkTable>
        <footer>
            <button @click="clear">✗</button>
            <button @click="confirm">✓</button>
        </footer>
    </div>
</template>
