<script setup lang="ts">
import { CustomHeaderCellProps } from '@/StkTable/types';
import { FilterProps, FilterStatus } from './types';

const props = defineProps<CustomHeaderCellProps<any> & FilterProps>();
const emit = defineEmits<{
    (e: 'update:filterStatus', filterStatus: FilterStatus): void;
}>();

function handleIconClick(e: MouseEvent) {
    e.stopPropagation();
    alert('filter');
    // open panel
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
    .icon-filter {
        &:hover {
            color: #409eff;
        }
    }
}
</style>
