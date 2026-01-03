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
        <i class="icon-filter" @click="handleIconClick">V</i>
    </div>
</template>
