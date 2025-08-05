<template>
    <div class="editable-status-cell">
        <input v-model="row._isEditing" type="checkbox" @change="handleChange" />
    </div>
</template>

<script setup lang="ts">
import { CustomCellProps } from '@/StkTable/types';
import { defineProps } from 'vue';
import type { RowDataType } from './type';

const props = defineProps<CustomCellProps<RowDataType>>();

function handleChange(e: Event) {
    const isChecked = (e.target as HTMLInputElement).checked;
    const { row } = props;
    row._isEditing = isChecked;
}
</script>

<style scoped lang="less">
.editable-status-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>
