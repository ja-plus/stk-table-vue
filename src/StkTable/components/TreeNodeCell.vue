<template>
    <div :title="row[col.dataIndex] || ''" :style="row.__T_LV__ ? `padding-left:${row.__T_LV__ * 16}px` : ''">
        <span v-if="row.__T_LOADING__" class="stk-tree-loading-icon"></span>
        <TriangleIcon v-else-if="expandable" @click="emit('click')" />
        <span :style="!expandable ? 'padding-left: 16px;' : null">
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
    /** 是否可展开（唯一口径 useTree.isExpandable：children 已存在或懒加载标记有子节点） */
    expandable?: boolean;
}>();
const emit = defineEmits(['click']);
</script>
