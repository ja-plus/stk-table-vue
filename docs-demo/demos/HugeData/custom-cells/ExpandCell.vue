<script setup lang="ts">
import type { CustomCellProps } from '@/StkTable/types/index';
import { emitter } from '../event';
import { DataType } from '../types';
const props = defineProps<CustomCellProps<DataType>>();
function handleClick() {
    emitter.emit('toggle-expand', props.row);
}
</script>
<template>
    <div class="expand-cell" @click="handleClick">
        <span class="triangle-arrow" :class="{ expand: props.row._isExpand }"></span>
        <span class="text">最优</span>
    </div>
</template>
<style scoped lang="less">
.expand-cell {
    cursor: pointer;
}
.triangle-arrow {
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 5px solid;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    &.expand {
        transform: rotate(90deg);
    }
}
.text {
    margin-left: 5px;
}
</style>
