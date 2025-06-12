<script setup lang="ts">
const props = defineProps<{
    label: string;
    suffix?: string;
}>();

const modelValue = defineModel<number>('modelValue');
</script>
<template>
    <div style="display: inline-flex; align-items: center; margin-right: 10px">
        <span>{{ props.label }}</span>
        <input v-model="modelValue" type="range" v-bind="$attrs" />
        <span>{{ modelValue }} {{ props.suffix }}</span>
    </div>
</template>
