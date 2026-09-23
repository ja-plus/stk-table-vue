<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import type { CustomCellProps } from '@/StkTable/types/index';
import type { FileTreeNode } from './fileTreeData';
import { cancelEdit, commitEdit, draggingRow, editing } from './fileTreeStore';
import { useCellDrag } from './useCellDrag';

const props = defineProps<CustomCellProps<FileTreeNode>>();

const inputRef = useTemplateRef<HTMLInputElement>('inputRef');
const draft = ref('');

/** 本行是否处于行内重命名 / 新建输入状态 */
const isEditing = computed(() => editing.value?.row === props.row);

/** 整格拖拽热区 / 放置目标（不用内置 dragRow 把手列） */
const { dropPos, inDropSubtree, isDropTarget, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop } = useCellDrag(
    () => props.row,
    () => Boolean(props.treeExpanded)
);
const isDragging = computed(() => draggingRow.value === props.row);

/** 进入编辑：预填当前名称，聚焦后选中主文件名（不含扩展名），与 VSCode 一致 */
function enterEdit() {
    draft.value = String(props.cellValue ?? '');
    nextTick(() => {
        const el = inputRef.value;
        if (!el) return;
        el.focus();
        const name = draft.value;
        const dot = name.lastIndexOf('.');
        el.setSelectionRange(0, dot > 0 ? dot : name.length);
    });
}

// 两种进入编辑的时机：单元格先渲染后再开始编辑（watch），以及新建行渲染时已在编辑态（onMounted）
watch(isEditing, value => value && enterEdit());
onMounted(() => isEditing.value && enterEdit());

function commit() {
    if (!isEditing.value) return;
    commitEdit(props.row, draft.value);
}

function cancel() {
    if (!isEditing.value) return;
    cancelEdit();
}
</script>

<template>
    <!--
        摆放契约：height:100% 的 flex 行，内置缩进格才能撑满整行、引导线不被截断。
        整格带 draggable：编辑时关掉，避免输入框无法选字。
    -->
    <div
        class="file-tree__name"
        :class="{
            'file-tree__name--editing': isEditing,
            'file-tree__name--dragging': isDragging,
            'file-tree__name--subtree': inDropSubtree,
            'file-tree__name--into': isDropTarget,
            'file-tree__name--before': dropPos === 'before',
            'file-tree__name--after': dropPos === 'after',
        }"
        :draggable="!isEditing"
        :title="isEditing ? '' : String(cellValue ?? '')"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <!-- 内置「按层级缩进 + 引导线」：由本布局决定它摆在最左侧 -->
        <slot name="stkTreeIndent" />

        <!-- 目录：自绘展开控件，必须带 data-stk-fold（表体按该属性委托切换），开合两态由 treeExpanded 决定 -->
        <span v-if="expandable" class="file-tree__icon file-tree__icon--dir" data-stk-fold>
            <svg v-if="treeExpanded" viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path
                    d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"
                />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
        </span>
        <!-- 文件：占据同一格，但不是展开控件（不带 data-stk-fold） -->
        <span v-else class="file-tree__icon file-tree__icon--file">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path
                    d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-7V3.5L18.5 9H13z"
                />
            </svg>
        </span>

        <!-- 行内重命名输入框：就在格子内部，不新开弹窗（参考 VSCode） -->
        <input
            v-if="isEditing"
            ref="inputRef"
            v-model="draft"
            class="file-tree__rename-input"
            type="text"
            @keydown.enter.prevent="commit"
            @keydown.esc.prevent="cancel"
            @blur="commit"
            @click.stop
            @contextmenu.stop
        />
        <span v-else class="file-tree__name-text">{{ cellValue }}</span>
    </div>
</template>

<style>
.file-tree__name {
    height: 100%;
    display: flex;
    align-items: center;
    /* 整格可拖拽时避免拖出文本选中的蓝底 */
    user-select: none;
}
.file-tree__name--editing,
.file-tree__name--editing input {
    /* 重命名输入框需要正常选字 */
    user-select: text;
}
.file-tree__name--dragging {
    opacity: 0.5;
}
/* 落点提示：悬浮到文件夹上时高亮它自身与所有后代行（自身再深一档），文件行画插入线 */
.file-tree__name--subtree {
    background: var(--vp-c-brand-soft, rgba(59, 130, 246, 0.1));
}
.file-tree__name--into {
    background: var(--vp-c-brand-soft, rgba(59, 130, 246, 0.22));
}
.file-tree__name--before {
    box-shadow: inset 0 2px 0 var(--vp-c-brand, #3b82f6);
}
.file-tree__name--after {
    box-shadow: inset 0 -2px 0 var(--vp-c-brand, #3b82f6);
}
.file-tree__icon {
    display: inline-flex;
    flex-shrink: 0;
    /* 与内置同宽：随 --tree-indent-width 一起缩放，引导线才能落在格与格的缝隙上 */
    width: var(--tree-indent-width);
    align-items: center;
    justify-content: center;
}
.file-tree__icon--dir {
    cursor: pointer;
    color: #d8a127;
}
.file-tree__icon--file {
    color: var(--fold-icon-color);
}
.file-tree__name-text {
    margin-left: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.file-tree__rename-input {
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
