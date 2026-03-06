<script setup lang="ts">
import { CustomHeaderCellProps } from '@/StkTable/types';
import { getDropdownIns } from './Dropdown/index';
import { FilterOption } from './types';

const props = defineProps<
    CustomHeaderCellProps<any> & {
        active?: boolean; // 是否激活筛选
        options?: FilterOption[]; // 自定义筛选选项
    }
>();
const emit = defineEmits<{
    (e: 'update:filterStatus', value: FilterOption['value'][]): void;
}>();

function handleIconClick(e: MouseEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const pos = target.getBoundingClientRect();
    getDropdownIns(handleConfirm).then(ins => {
        if (ins.visible) {
            ins.hide();
            return;
        }
        ins.show({ x: pos.left, y: pos.bottom }, props.options);
    });
}

function handleConfirm(value: FilterOption['value'][]) {
    emit('update:filterStatus', value);
}
</script>

<template>
    <div class="stk-filter" :class="{ 'stk-filter--active': props.active }">
        {{ props.col.title }}
        <svg class="stk-filter-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024" @click="handleIconClick">
            <path fill="currentColor" d="M609.508 463.246H414.492l-243.825-292.58h682.666zm0 48.754v212.878L414.492 853.333V512z" />
        </svg>
    </div>
</template>
