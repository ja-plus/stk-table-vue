<script setup lang="ts">
import { CustomHeaderCellProps } from '@/StkTable/types';
import { getDropdownIns } from './Dropdown/index';
import { FilterProps, FilterStatus } from './types';

const props = defineProps<CustomHeaderCellProps<any> & FilterProps>();
const emit = defineEmits<{
    (e: 'update:filterStatus', filterStatus: FilterStatus): void;
}>();

function handleIconClick(e: MouseEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const pos = target.getBoundingClientRect();
    getDropdownIns().then(ins => {
        ins.show({ x: pos.left, y: pos.bottom }, props.filterOptions)   
    });
}
</script>

<template>
    <div class="stk-filter">
        {{ props.col.title }}
        <i class="icon-filter" @click="handleIconClick">V</i>
    </div>
</template>

<style scoped lang="less">
.stk-filter {
}
.icon-filter {
    &:hover {
        color: #409eff;
    }
}
</style>
