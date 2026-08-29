<template>
    <div ref="rootRef" class="stk-editable-cell" @dblclick="onTrigger" @click="onTrigger">
        <template v-if="!editing">{{ displayValue }}</template>
        <input v-else ref="inputRef" class="stk-editable-cell-input" :value="editValue" @blur="onBlur" @input="onInput" @keydown="onKeydown" />
    </div>
</template>

<script lang="ts" setup vapor generic="T extends Record<string, any>">
import type { CustomCellProps } from '../../types';
import { computed, nextTick, ref, watch } from 'vue';

const props = withDefaults(defineProps<CustomCellProps<T> & { trigger?: 'dblclick' | 'click'; onChange?: (newValue: any) => void }>(), {
    trigger: 'dblclick',
});

const editValue = ref<any>(props.cellValue);
const isEditing = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const rootRef = ref<HTMLElement | null>(null);

const editing = computed(() => isEditing.value);

const displayValue = computed(() => {
    const v = props.cellValue;
    return v !== undefined && v !== null ? v : '';
});

watch(
    () => props.cellValue,
    v => {
        if (!isEditing.value) {
            editValue.value = v;
        }
    },
);

function onTrigger(e: MouseEvent) {
    if (e.type !== props.trigger) return;
    startEditing();
}

function startEditing() {
    editValue.value = props.cellValue;
    isEditing.value = true;
    nextTick(() => {
        inputRef.value?.focus();
    });
}

function finishEditing() {
    isEditing.value = false;
    const newValue = editValue.value;
    setCellValue(newValue);
    props.onChange?.(newValue);
    refocusContainer();
}

function cancelEditing() {
    isEditing.value = false;
    editValue.value = props.cellValue;
    refocusContainer();
}

function onBlur() {
    if (!isEditing.value) return;
    finishEditing();
}

function onInput(e: Event) {
    editValue.value = (e.target as HTMLInputElement).value;
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        finishEditing();
    } else if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        e.stopPropagation();
        cancelEditing();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.stopPropagation();
    } else if (e.key === 'Tab') {
        finishEditing();
    } else {
        e.stopPropagation();
    }
}

function setCellValue(v: any) {
    const { row, col } = props;
    (row[col.dataIndex] as any) = v;
}

function refocusContainer() {
    const el = rootRef.value?.closest?.('.stk-table') as HTMLElement | null;
    el?.focus();
}
</script>
