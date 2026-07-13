<template>
    <div class="stk-checkbox-cell">
        <component
            :is="customComponent"
            v-if="customComponent"
            :model-value="checked"
            :checked="checked"
            :indeterminate="indeterminate"
            @update:model-value="handleChange"
            @update:checked="handleChange"
            @change="handleChange"
            @click.stop
        />
        <input
            v-else
            type="checkbox"
            :checked="checked"
            :indeterminate.prop="indeterminate"
            class="stk-checkbox-native"
            @change="handleChange"
            @click.stop
        />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    /** 当前是否选中 */
    checked?: boolean;
    /** 是否半选状态 */
    indeterminate?: boolean;
    /** 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox） */
    customComponent?: any;
}>();

const emit = defineEmits<{
    (e: 'change', checked: boolean): void;
}>();

/** 防重保护：部分 UI 库（Element Plus / Arco Design）会同时触发多个事件 */
let _lastValue: boolean | undefined;

function handleChange(e: any) {
    let checked: boolean;
    if (typeof e === 'boolean') {
        checked = e;
    } else if (e?.target?.checked !== undefined) {
        checked = e.target.checked;
    } else {
        checked = !!e;
    }
    if (checked === _lastValue) return;
    _lastValue = checked;
    emit('change', checked);
}
</script>
