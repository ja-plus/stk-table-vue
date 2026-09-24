<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from '../../hooks/useI18n/index';
import type { CustomCellProps } from '@/StkTable/types/index';
import type { FileTreeNode } from './fileTreeData';
import { draggingRow } from './fileTreeStore';
import { useCellDrag } from './useCellDrag';
import { useInlineRename } from './useInlineRename';

const props = defineProps<CustomCellProps<FileTreeNode>>();
const { t } = useI18n();

/** 与自绘图标变体同一套整格拖拽 */
const { dropPos, inDropSubtree, isDropTarget, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop } = useCellDrag(
    () => props.row,
    () => Boolean(props.treeExpanded)
);
const isDragging = computed(() => draggingRow.value === props.row);

/** 行内重命名 / 新建输入框（第二张表）：输入框同样在格子内部 */
const { inputRef, draft, isEditing, commit, cancel } = useInlineRename(props, 'B');
</script>

<template>
    <!--
        同一个摆放契约；这里保留内置箭头（stkFoldIcon），只给目录加了个标签。
        整格同样带 draggable，与第一张表一致。
    -->
    <div
        class="tag-tree-cell"
        :class="{
            'tag-tree-cell--editing': isEditing,
            'tag-tree-cell--dragging': isDragging,
            'tag-tree-cell--subtree': inDropSubtree,
            'tag-tree-cell--into': isDropTarget,
            'tag-tree-cell--before': dropPos === 'before',
            'tag-tree-cell--after': dropPos === 'after',
        }"
        :draggable="!isEditing"
        :title="isEditing ? '' : String(cellValue ?? '')"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <slot name="stkTreeIndent" />
        <slot name="stkFoldIcon" />
        <span v-if="expandable && !isEditing" class="tag-tree-cell__tag">{{ t('fileTagDir') }}</span>
        <span v-if="!isEditing">{{ cellValue }}</span>
        <input
            v-else
            ref="inputRef"
            v-model="draft"
            class="tag-tree-cell__input"
            type="text"
            @keydown.enter.prevent="commit"
            @keydown.esc.prevent="cancel"
            @blur="commit"
            @click.stop
            @contextmenu.stop
        />
    </div>
</template>

<style>
.tag-tree-cell {
    height: 100%;
    display: flex;
    align-items: center;
    user-select: none;
}
.tag-tree-cell--editing,
.tag-tree-cell--editing input {
    /* 重命名输入框需要正常选字 */
    user-select: text;
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
.tag-tree-cell__input {
    flex: 1;
    min-width: 0;
    margin-left: 2px;
    padding: 1px 4px;
    font: inherit;
    font-size: 13px;
    line-height: 18px;
    color: var(--vp-c-text-1, #333);
    background: var(--vp-c-bg, #fff);
    border: 1px solid var(--vp-c-brand, #3b82f6);
    border-radius: 2px;
    outline: none;
}
</style>
