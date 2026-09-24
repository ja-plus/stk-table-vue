import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import type { CustomCellProps } from '@/StkTable/types/index';
import type { FileTreeNode } from './fileTreeData';
import { cancelEdit, commitEdit, editing } from './fileTreeStore';

/**
 * 行内重命名 / 新建输入框：输入框直接渲染在单元格内（参考 VSCode），不新开弹窗。
 *
 * 两张表各有一份编辑态（editing.table），因此同一行在两张表里不会同时出现输入框——
 * 在哪张表右键，输入框就只出现在哪张表。
 */
export function useInlineRename(props: CustomCellProps<FileTreeNode>, table: 'A' | 'B') {
    const inputRef = useTemplateRef<HTMLInputElement>('inputRef');
    const draft = ref('');

    /** 本行是否处于行内重命名 / 新建输入状态 */
    const isEditing = computed(() => editing.value?.row === props.row && editing.value.table === table);

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

    return { inputRef, draft, isEditing, commit, cancel };
}
