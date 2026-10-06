<template>
    <div class="stk-tree-cell" :title="row[col.dataIndex] || ''">
        <TreeIndent :level="level ?? 0" :show-guide="showGuide" :offset="offset" />
        <TreeFoldIcon :expandable="expandable" :loading="treeLoading" :expanded="treeExpanded" />
        <span>
            {{ cellValue ?? row[col.dataIndex] ?? '' }}
        </span>
    </div>
</template>

<script setup lang="ts">
import type { CustomCellProps } from '../types';
import TreeFoldIcon from './TreeFoldIcon.vue';
import TreeIndent from './TreeIndent.vue';

defineProps<
    CustomCellProps<any> & {
        /** 是否按层级绘制竖向引导线（treeConfig.showGuide），关闭时保持既有纯缩进行为 */
        showGuide?: boolean;
        /** 引导线左偏移量，CSS 长度（如 `4px`）：把线校正到居中自定义展开图标的中心，不影响缩进与标签 */
        offset?: string;
    }
>();
</script>
