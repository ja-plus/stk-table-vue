<template>
    <div class="stk-tree-cell" :title="row[col.dataIndex] || ''" :style="level ? `padding-left:${level * 16}px` : ''">
        <span v-if="showGuide && level > 0" class="stk-tree-guide" :style="{ width: level * 16 + 'px' }"></span>
        <span v-if="row.__T_LOADING__" class="stk-tree-loading-icon"></span>
        <TriangleIcon v-else-if="expandable" @click="emit('click')" />
        <span :style="!expandable ? 'padding-left: 16px;' : null">
            {{ row[col.dataIndex] ?? '' }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PrivateStkTableColumn } from '../types';
import TriangleIcon from './TriangleIcon.vue';

const props = defineProps<{
    col: PrivateStkTableColumn<any>;
    row: any;
    /** 是否可展开（唯一口径 useTree.isExpandable：children 已存在或懒加载标记有子节点） */
    expandable?: boolean;
    /** 是否按层级绘制竖向引导线（treeConfig.showGuide），关闭时保持既有纯缩进行为 */
    showGuide?: boolean;
}>();
const emit = defineEmits(['click']);

/** 行所处层级（根为 0），引导线条数与其一致 */
const level = computed(() => props.row?.__T_LV__ || 0);
</script>
