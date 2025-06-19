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
const emit = defineEmits<{
    (e: 'change', value: boolean): void;
}>();
function handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    emit('change', target.checked);
}
</script>
<template>
    <label>
        <input v-model="modelValue" type="checkbox" @change="handleChange" />
        <span>{{ props.text }}</span>
    </label>
</template>
