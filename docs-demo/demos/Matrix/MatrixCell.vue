<template>
    <div
        class="matrix-cell up"
        :style="{ '--percent': data.percent }"
        :class="{
            up: data.bp > 0,
            down: data.bp < 0,
        }"
    >
        <div class="row">
            <span class="code">{{ data.code }}</span>
            <span class="bp"><i class="triangle"></i>{{ data.bp }}</span>
        </div>
        <div class="row">
            <span class="value">{{ data.value }}</span>
            <span class="count">{{ data.count }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CustomCellProps } from '@/StkTable/types';
import { toRef } from 'vue';
const props = defineProps<CustomCellProps<any>>();
const data = toRef(props, 'cellValue');
</script>

<style scoped lang="less">
.matrix-cell {
    --percent: 50;
    --bg-color: #f0f0f0;
    height: calc(100% - 1px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 8px;
    cursor: default;
    // align-items: center;
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
        .triangle {
            transform: rotate(180deg);
        }
    }
    .row {
        display: flex;
        justify-content: space-between;
    }
    .code {
        font-size: 12px;
    }
    .bp {
        font-size: 12px;
        color: var(--font-color);
    }
    .value {
        font-size: 16px;
        font-weight: bold;
        color: var(--font-color);
    }
    .count {
        font-size: 12px;
    }

    .triangle {
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 5px solid var(--font-color);
        margin-right: 4px;
    }
}
</style>
