<script lang="ts" setup>
import { CustomCellProps } from '@/StkTable/types';
import type { DataType } from './types';
import { computed } from 'vue';

const props = defineProps<CustomCellProps<DataType>>();

const row = computed(() => props.row);
</script>
<template>
    <div class="panel">
        <header>{{ row.title }}</header>
        <article>{{ row.content }}</article>
        <footer>{{ row.date }}</footer>
    </div>
</template>
<style scoped>
.panel {
    height: calc(100% - 16px);
    padding: 16px;
    border-radius: 5px;
    box-shadow: 0 2px 4px 2px rgba(200, 200, 200, 0.4);
    display: flex;
    flex-direction: column;
}
header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}
article {
    text-indent: 2em;
    margin-bottom: 10px;
    flex: 1;
}
footer {
    font-size: 12px;
    text-align: right;
    color: #aaa;
}
</style>
