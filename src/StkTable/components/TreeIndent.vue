<template>
    <span class="stk-tree-indent" :style="{ '--stk-tree-indent-cells': level }">
        <span v-if="showGuide && level" class="stk-tree-guide"></span>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    /** 行所处层级（根为 0），决定缩进宽度，也决定引导线覆盖的格数（只画祖先各格 0..level-1） */
    level: number;
    /** 是否绘制层级引导线（treeConfig.showGuide），关闭时只保留缩进 */
    showGuide?: boolean;
}>();
</script>
