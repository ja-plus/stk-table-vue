<script lang="ts" setup>
import { computed } from 'vue';
import { getFileIcon } from './fileIcons';

/**
 * 文件图标：复刻 VSCode 内置默认文件图标主题 Seti（字形与映射见 ./fileIcons）。
 * 配色经 CSS 变量随暗 / 亮主题切换两套 Seti 色板，与 VSCode 暗 / 亮下的表现一致。
 */
const props = defineProps<{ name: string }>();

const icon = computed(() => getFileIcon(props.name));
</script>

<template>
    <svg class="file-icon" :viewBox="icon.viewBox" width="16" height="16" aria-hidden="true">
        <path
            v-for="(p, i) in icon.paths"
            :key="i"
            :d="p.d"
            :opacity="p.opacity"
            :fill-rule="p.fillRule"
            :style="{ fill: `var(--seti-${icon.color})` }"
        />
    </svg>
</template>

<style>
.file-icon {
    display: block;
    flex-shrink: 0;
    /* Seti 亮色色板（VSCode 浅色主题下的 fontColor） */
    --seti-blue: #498ba7;
    --seti-green: #7fae42;
    --seti-orange: #cc6d2e;
    --seti-pink: #dd4b78;
    --seti-purple: #9068b0;
    --seti-red: #b8383d;
    --seti-yellow: #b7b73b;
    --seti-grey: #455155;
    --seti-greyLight: #627379;
    --seti-ignore: #3b4b52;
    --seti-white: #bfc2c1;
}
html.dark .file-icon {
    /* Seti 暗色色板（seti-ui 九色板原值） */
    --seti-blue: #519aba;
    --seti-green: #8dc149;
    --seti-orange: #e37933;
    --seti-pink: #f55385;
    --seti-purple: #a074c4;
    --seti-red: #cc3e44;
    --seti-yellow: #cbcb41;
    --seti-grey: #4d5a5e;
    --seti-greyLight: #6d8086;
    --seti-ignore: #41535b;
    --seti-white: #d4d7d6;
}
</style>
