<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from '../../hooks/useI18n/index';
import type { CustomCellProps } from '@/StkTable/types/index';
import type { FileTreeNode } from './fileTreeData';
import { draggingRow } from './fileTreeStore';
import { useCellDrag } from './useCellDrag';

const props = defineProps<CustomCellProps<FileTreeNode>>();
const { t } = useI18n();

/** 与自绘图标变体同一套整格拖拽 */
const { dropPos, inDropSubtree, isDropTarget, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop } = useCellDrag(
    () => props.row,
    () => Boolean(props.treeExpanded)
);
const isDragging = computed(() => draggingRow.value === props.row);
</script>

<template>
    <!--
        同一个摆放契约；这里保留内置箭头（stkFoldIcon），只给目录加了个标签。
        整格同样带 draggable，与第一张表一致。
    -->
    <div
        class="tag-tree-cell"
        :class="{
            'tag-tree-cell--dragging': isDragging,
            'tag-tree-cell--subtree': inDropSubtree,
            'tag-tree-cell--into': isDropTarget,
            'tag-tree-cell--before': dropPos === 'before',
            'tag-tree-cell--after': dropPos === 'after',
        }"
        :title="String(cellValue ?? '')"
        draggable="true"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <slot name="stkTreeIndent" />
        <slot name="stkFoldIcon" />
        <span v-if="expandable" class="tag-tree-cell__tag">{{ t('fileTagDir') }}</span>
        <span>{{ cellValue }}</span>
    </div>
</template>

<style>
.tag-tree-cell {
    height: 100%;
    display: flex;
    align-items: center;
    user-select: none;
}
.tag-tree-cell--dragging {
    opacity: 0.5;
}
.tag-tree-cell--subtree {
    background: var(--vp-c-brand-soft, rgba(59, 130, 246, 0.1));
}
.tag-tree-cell--into {
    background: var(--vp-c-brand-soft, rgba(59, 130, 246, 0.22));
}
.tag-tree-cell--before {
    box-shadow: inset 0 2px 0 var(--vp-c-brand, #3b82f6);
}
.tag-tree-cell--after {
    box-shadow: inset 0 -2px 0 var(--vp-c-brand, #3b82f6);
}
.tag-tree-cell__tag {
    margin-right: 4px;
    padding: 0 4px;
    border-radius: 2px;
    font-size: 10px;
    color: var(--fold-icon-color);
    border: 1px solid var(--border-color);
}
</style>
