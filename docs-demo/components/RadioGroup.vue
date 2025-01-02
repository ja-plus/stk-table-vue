<script lang="ts" setup generic="T">
const props = withDefaults(
    defineProps<{
        text: string;
        options: { label: string; value: T }[];
        name?: string;
    }>(),
    {
        options: () => [],
        name: () => /**hash */ Math.random().toString(36).substring(7),
    },
);
const emits = defineEmits<{
    (e: 'change', value: T | undefined): void;
}>();
const modelValue = defineModel<T>();

function handleInputChange() {
    emits('change', modelValue.value);
}
</script>
<template>
    <div class="radio-group">
        <span class="main-label">{{ props.text }}:</span>
        <label v-for="(option, i) in options" :key="i">
            <input v-model="modelValue" type="radio" :value="option.value" @change="handleInputChange" />
            <span>{{ option.label }}</span>
        </label>
    </div>
</template>
<style scoped>
.main-label {
    font-weight: bold;
}
</style>
