<template>
    <div
        class="matrix-cell up"
        :style="{ '--percent': 50 }"
        :class="{
            up: props.cellValue > 0,
            down: props.cellValue < 0,
        }"
    >
        {{ props.cellValue }}
    </div>
</template>

<script lang="ts" setup>
import { CustomCellProps } from '@/StkTable/types';
const props = defineProps<CustomCellProps<any>>();
</script>

<style scoped lang="less">
.matrix-cell {
    --percent: 100;
    --bg-color: #f0f0f0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
        90deg,
        var(--bg-color-from),
        var(--bg-color-to) calc(var(--percent) * 1%),
        transparent calc(var(--percent) * 1%)
    );

    &.up {
        --font-color: #ff2b48;
        --bg-color-from: rgba(255, 43, 72, 0.15);
        --bg-color-to: rgba(255, 43, 72, 0.3);
    }

    &.down {
        --font-color: #2fc87b;
        --bg-color-from: rgba(47, 200, 123, 0.15);
        --bg-color-to: rgba(47, 200, 123, 0.3);
    }
}
</style>
