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
const modelValue = defineModel<T>();
</script>
<template>
    <div class="radio-group">
        <span class="main-label">{{ props.text }}:</span>
        <label v-for="(option, i) in options" :key="i">
            <input v-model="modelValue" type="radio" :value="option.value" />
            <span>{{ option.label }}</span>
        </label>
    </div>
</template>
<style scoped>
.main-label {
    font-weight: bold;
}
</style>
