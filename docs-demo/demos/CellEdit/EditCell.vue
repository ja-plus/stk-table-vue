<template>
    <div class="edit-cell" :title="editing ? '回车保存' : '双击编辑'" @dblclick="startEditing">
        <template v-if="!editing"> {{ props.cellValue }} </template>
        <input
            v-else
            ref="inputRef"
            class="edit-input"
            :value="editValue"
            @blur="cancelEditing"
            @change="finishEditing"
            @keyup.enter="finishEditing"
            @keyup.esc="cancelEditing"
        />
    </div>
</template>

<script lang="ts" setup>
import { CustomCellProps } from '@/StkTable/types';
import { computed, ref, watch } from 'vue';
import { RowDataType } from './type';

const props = defineProps<CustomCellProps<RowDataType>>();

const editValue = ref(props.cellValue);
const inputRef = ref<HTMLInputElement | null>(null);

watch(
    () => props.cellValue,
    v => {
        editValue.value = v;
    },
);
const isEditing = ref(false);

const editing = computed(() => props.row._isEditing || isEditing.value);

function startEditing() {
    isEditing.value = true;
    // 延迟设置焦点，确保输入框已经渲染
    setTimeout(() => {
        inputRef.value?.focus();
    }, 0);
}

function finishEditing(e: Event) {
    isEditing.value = false;
    setCellValue((e.target as HTMLInputElement).value);
}

function cancelEditing() {
    if (!isEditing.value) return;
    isEditing.value = false;
    setCellValue(editValue.value);
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
