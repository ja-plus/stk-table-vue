<script setup lang="ts">
import { StkTableColumn } from '@/StkTable/types';
import { h, onMounted, onUnmounted, ref } from 'vue';
import StkTable from '../../../StkTable.vue';
import type { FilterOption } from '../types';

const columns = ref<StkTableColumn<FilterOption>[]>([
    { title: '', dataIndex: 'value', className: 'stk-filter-dropdown-checkbox', customCell: ({ row }) => h('input', { type: 'checkbox', checked: row.selected, onChange: e => handleSelectChange(e, row) }) },
    { title: '', dataIndex: 'label', customCell: ({ row }) => h('span', {}, [row.label, row.selected ? '（已选）' : '']) },
]);

const visible = ref(false);
const position = ref<{ x: number; y: number; }>({ x: 0, y: 0 });
const options = ref<FilterOption[]>([]);

const dropdownEl = ref<HTMLDivElement>();
const checkedTempValue = ref<Set<FilterOption['value']>>(new Set());

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});


function show(pos: { x: number; y: number; }, opt?: FilterOption[]) {
    visible.value = true;
    position.value = pos;
    options.value = opt || [];
    initChecked();
}
function hide() {
    visible.value = false;
    options.value = [];
    checkedTempValue.value.clear();
}

async function handleClickOutside(e: MouseEvent) {
    if (!visible.value || dropdownEl.value?.contains(e.target as Node)) return;
    hide();
};

function initChecked() {
    checkedTempValue.value = new Set(options.value.filter(opt => opt.selected).map(opt => opt.value));
}

function handleSelectChange(e: Event, row: FilterOption) {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
        checkedTempValue.value.add(row.value);
    } else {
        checkedTempValue.value.delete(row.value);
    }
}

function confirm() {
    options.value.forEach(opt => opt.selected = checkedTempValue.value.has(opt.value));
    hide();
}


defineExpose({ show, hide });

</script>
<template>
    <div ref="dropdownEl" class="stk-filter-dropdown"
        :style="{ top: position.y + 'px', left: position.x + 'px', display: visible ? void 0 : 'none' }" @click.stop>
        <StkTable row-key="id" theme="dark" :row-active="false" :row-height="20" headless virtual no-data-full
            :bordered="false" :columns="columns" :data-source="options">
        </StkTable>
        <footer>
            <button @click="hide">❌</button>
            <button @click="confirm">✔️</button>
        </footer>
    </div>
</template>
