<template>
    <div class="stk-tree-cell" :title="row[col.dataIndex] || ''">
        <TreeIndent :level="level" :expandable="expandable" :show-guide="showGuide" />
        <TreeFoldIcon :row="row" :col="col" :expandable="expandable" />
        <span>
            {{ row[col.dataIndex] ?? '' }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PrivateStkTableColumn } from '../types';
import TreeFoldIcon from './TreeFoldIcon.vue';
import TreeIndent from './TreeIndent.vue';

const props = defineProps<{
    col: PrivateStkTableColumn<any>;
    row: any;
    /** 是否可展开（唯一口径 useTree.isExpandable：children 已存在或懒加载标记有子节点） */
    expandable?: boolean;
    /** 是否按层级绘制竖向引导线（treeConfig.showGuide），关闭时保持既有纯缩进行为 */
    showGuide?: boolean;
}>();

/** 行所处层级（根为 0） */
const level = computed(() => props.row?.__T_LV__ || 0);
</script>
