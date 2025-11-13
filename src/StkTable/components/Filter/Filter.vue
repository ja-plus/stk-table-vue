<script setup lang="ts">
import { CustomHeaderCellProps } from '@/StkTable/types';
import { FilterProps, FilterStatus } from './types';

const props = defineProps<CustomHeaderCellProps<any> & FilterProps>();
const emit = defineEmits<{
    (e: 'update:filterStatus', filterStatus: FilterStatus): void;
}>();

function handleIconClick() {
    // open panel
}
</script>

<template>
    <div class="stk-filter">
        <i class="icon-filter" @click="handleIconClick">V</i>
    </div>
</template>

<style scoped></style>
