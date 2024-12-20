<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        text: string;
    }>(),
    {
        text: '--',
    },
);
const modelValue = defineModel<boolean>();
</script>
<template>
    <label>
        <input v-model="modelValue" type="checkbox" />
        <span>{{ props.text }}</span>
    </label>
</template>
