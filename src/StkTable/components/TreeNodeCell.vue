<template>
    <div :title="row[col.dataIndex] || ''" :style="row.__T_LV__ ? `padding-left:${row.__T_LV__ * 16}px` : ''">
        <TriangleIcon v-if="row.children !== void 0" @click="emit('click')" />
        <span :style="!row.children ? 'padding-left: 16px;' : null">
            {{ row[col.dataIndex] ?? '' }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { PrivateStkTableColumn } from '../types';
import TriangleIcon from './TriangleIcon.vue';

defineProps<{
    col: PrivateStkTableColumn<any>;
    row: any;
}>();
const emit = defineEmits(['click']);
</script>
