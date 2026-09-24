<template>
    <span class="stk-tree-indent" :style="{ '--stk-tree-indent-cells': level, '--stk-tree-guide-offset': offset }">
        <span v-if="showGuide && level" class="stk-tree-guide"></span>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    /** 行所处层级（根为 0），决定缩进宽度，也决定引导线覆盖的格数（只画祖先各格 0..level-1） */
    level: number;
    /** 是否绘制层级引导线（treeConfig.showGuide），关闭时只保留缩进 */
    showGuide?: boolean;
    /**
     * 引导线左偏移量，CSS 长度（如 `4px`）。内置箭头中心在缩进格内 4px 处，引导线默认与之对齐；
     * 换成居中的自定义展开图标后图标中心移到格中央，用本偏移把线校正到图标中心。
     * 只移动引导线，不改变缩进宽度、标签位置与节拍。
     */
    offset?: string;
}>();
</script>
