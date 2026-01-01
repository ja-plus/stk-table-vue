<script setup lang="ts">
import { StkTableColumn } from '@/StkTable/types';
import { h, onMounted, onUnmounted, ref } from 'vue';
import StkTable from '../../../StkTable.vue';
import type { FilterOption } from '../types';

const columns = ref<StkTableColumn<FilterOption>[]>([
    { title: '', dataIndex: 'label', customCell: ({ row }) => h('input', { type: 'checkbox', checked: row.selected }) },
    { title: '', dataIndex: 'value' },
]);

const visible = ref(false);
const position = ref<{ x: number; y: number; }>({ x: 0, y: 0 });
const options = ref<FilterOption[]>([]);

const dropdownEl = ref<HTMLDivElement>();

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
}
function hide() {
    visible.value = false;
    options.value = []
}

async function handleClickOutside(e: MouseEvent) {
    if (!visible.value || dropdownEl.value?.contains(e.target as Node)) return;
    hide();
};

defineExpose({ show, hide });

</script>
<template>
    <div ref="dropdownEl" class="stk-filter-dropdown"
        :style="{ top: position.y + 'px', left: position.x + 'px', display: visible ? void 0 : 'none' }" @click.stop>
        <StkTable row-key="id" theme="dark" :row-active="false" :row-height="20" headless virtual no-data-full
            :bordered="false" :columns="columns" :data-source="options">
        </StkTable>
    </div>
</template>
