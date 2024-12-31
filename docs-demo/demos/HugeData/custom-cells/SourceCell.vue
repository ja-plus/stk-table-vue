<script setup lang="ts">
import type { CustomCellProps } from '@/StkTable/types/index';
import { DataType } from '../types';
const props = defineProps<CustomCellProps<DataType>>();
const sourceNameMap: any = {
    1: 'Aa',
    2: 'Bb',
    3: 'Cc',
    4: 'Dd',
    5: 'Ee',
    6: 'Ff',
};
</script>
<template>
    <div class="source-cell" :class="['source-' + props.cellValue]">{{ sourceNameMap[props.cellValue] }}</div>
</template>
