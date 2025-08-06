<template>
    <div class="edit-cell" :title="editing ? '回车保存' : '双击编辑'" @dblclick="startEditing">
        <template v-if="!editing"> {{ props.cellValue }} </template>
        <input
            v-else
            ref="inputRef"
            class="edit-input"
            :value="editValue"
            @blur="cancelEditing"
            @change="handleChange"
            @keyup.enter="finishEditing"
            @keyup.esc="cancelEditing"
        />
    </div>
</template>

<script lang="ts" setup generic="T extends { _isEditing?: boolean }">
import { CustomCellProps } from '@/StkTable/types';
import { computed, ref, watch, useTemplateRef } from 'vue';

const props = defineProps<CustomCellProps<T>>();

const editValue = ref(props.cellValue);
const inputRef = useTemplateRef('inputRef');

watch(
    () => props.cellValue,
    v => {
        editValue.value = v;
    },
);
const isEditing = ref(false);
/**是否在行编辑模式 */
const isEditMode = computed(() => props.row._isEditing);

const editing = computed(() => isEditMode.value || isEditing.value);

function startEditing() {
    isEditing.value = true;
    // 延迟设置焦点，确保输入框已经渲染
    setTimeout(() => {
        inputRef.value?.focus();
    }, 0);
}

function finishEditing(e: Event) {
    isEditing.value = false;
    const newValue = (e.target as HTMLInputElement).value;
    setCellValue(newValue);
}

function cancelEditing() {
    // 行编辑模式不用取消
    if (isEditMode.value) return;
    if (!isEditing.value) return;
    isEditing.value = false;
    if (inputRef.value) {
        inputRef.value.value = editValue.value;
    }
}

/** 如果在编辑模式，则实时更新 */
function handleChange(e: Event) {
    if (isEditMode.value) {
        finishEditing(e);
    }
}

function setCellValue(v: string) {
    const { row, col } = props;
    (row[col.dataIndex] as any) = v;
}
</script>

<style scoped lang="less">
.edit-cell {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: default;

    .edit-input {
        width: 100%;
        font-size: inherit;
        line-height: 2;
        box-sizing: border-box;
        outline: none;
        padding: 0 8px;
    }
}
</style>
