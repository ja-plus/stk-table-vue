<script lang="ts" setup>
import { computed } from 'vue';

/** 文件图标：按扩展名给出专属标识，未识别的扩展名回退到通用文件图标 */
const props = defineProps<{ name: string }>();

/** 取扩展名（小写），无扩展名返回空串 */
const ext = computed(() => {
    const dotIdx = props.name.lastIndexOf('.');
    return dotIdx >= 0 ? props.name.slice(dotIdx + 1).toLowerCase() : '';
});

/**
 * 扁平字形图标：仅品牌色文字/符号，不带底色方块（参考 VSCode Material 图标主题）。
 * fs 为字号（viewBox 为 32×32，取值需接近 32 才能填满图标）。
 * less / css / json 统一用花括号，仅靠颜色区分。
 */
const glyphMap: Record<string, { label: string; color: string; fs: number }> = {
    js: { label: 'JS', color: '#e9ca30', fs: 17 },
    ts: { label: 'TS', color: '#3178c6', fs: 17 },
    json: { label: '{}', color: '#cbcb41', fs: 19 },
    md: { label: 'M↓', color: '#42a5f5', fs: 15 },
    less: { label: '{}', color: '#2496b5', fs: 19 },
    css: { label: '{}', color: '#1572b7', fs: 19 },
};
const glyph = computed(() => glyphMap[ext.value] ?? null);
</script>

<template>
    <!-- .vue：Vue 官方双色三角标识 -->
    <svg
        v-if="ext === 'vue'"
        class="file-icon"
        viewBox="0 0 128 128"
        width="16"
        height="16"
        aria-hidden="true"
    >
        <path fill="#42b883" d="M78.5 25 64 0 49.5 25H0l64 98 64-98z" />
        <path fill="#35495e" d="M78.5 25 64 0 49.5 25h-19L64 77l33.5-52z" />
    </svg>
    <!-- js / ts / json / md / less / css：品牌色扁平字形（无底色方块） -->
    <svg v-else-if="glyph" class="file-icon" viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">
        <text
            x="16"
            y="17"
            :font-size="glyph.fs"
            font-weight="700"
            text-anchor="middle"
            dominant-baseline="middle"
            :fill="glyph.color"
            font-family="'Segoe UI',system-ui,sans-serif"
            >{{ glyph.label }}</text
        >
    </svg>
    <!-- 其余文件：通用文件图标，颜色跟随主题 -->
    <svg
        v-else
        class="file-icon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="currentColor"
        aria-hidden="true"
    >
        <path
            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-7V3.5L18.5 9H13z"
        />
    </svg>
</template>

<style>
.file-icon {
    display: block;
    flex-shrink: 0;
}
</style>
