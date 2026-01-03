<script setup lang="ts">
import { CustomHeaderCellProps } from '@/StkTable/types';
import { getDropdownIns } from './Dropdown/index';
import { FilterOption, FilterProps } from './types';

const props = defineProps<CustomHeaderCellProps<any> & FilterProps>();
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
        ins.show({ x: pos.left, y: pos.bottom }, props.filterOptions);
    });
}

function handleConfirm(value: FilterOption['value'][]) {
    emit('update:filterStatus', value);
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
