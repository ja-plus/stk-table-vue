<script setup lang="ts">
import { layout, prepare } from '@chenglou/pretext';
import mockjs from 'mockjs';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import { StkTableColumn } from '@/StkTable/index';
import StkTable from '../../../StkTable.vue';
import type { DataType } from './types';
import { getIsZH } from '../../../hooks/getIsZH';

const isZH = getIsZH();
const stkTableRef = useTemplateRef('stkTableRef');

const columns: StkTableColumn<DataType>[] = [
    { dataIndex: 'id', title: 'ID', width: 26, align: 'center' },
    { dataIndex: 'content', title: 'Content', width: 200 },
    { dataIndex: 'date', title: 'Date', width: 70, align: 'center' },
];

const data = new Array(100).fill(0).map((_, i) => ({
    id: i,
    content: isZH ? mockjs.Random.cparagraph(1, 8) : mockjs.Random.paragraph(1, 3),
    date: isZH ? mockjs.Random.datetime('yyyy-MM-dd') : mockjs.Random.datetime('MM/dd/yyyy'),
}));

/** 内容列实际可用的文本宽度，由 ResizeObserver 推送（读取它不会触发布局） */
let contentTextWidth = 0;
let contentCellObserver: ResizeObserver | null = null;

onMounted(() => {
    observeContentCell();
});

onBeforeUnmount(() => {
    contentCellObserver?.disconnect();
    contentCellObserver = null;
});

/**
 * 用 ResizeObserver 获取内容列的**真实**文本宽度。
 *
 * - 不能按列配置推算：表格是 auto 布局，列配置里的 width 只是下限。示例中 `width: 200` 的
 *   内容列会被拉伸到容器宽度对应的实际列宽（可能 450px+），按 200 算会严重高估行高，
 *   表现为滚动到中间时可视区底部出现空白（预计算行高比真实行高大，渲染行填不满视口）。
 * - 不能读 `clientWidth` / `getBoundingClientRect()`：会强制同步布局（回流）。
 *   ResizeObserver 的 `contentRect` 由布局阶段直接推送，读取它不触发布局。
 */
function observeContentCell() {
    // 表头单元格纵向滚动时不会被销毁，且与表体同列共享列宽，适合作为长期观察目标；
    // 无表头时退回首个表体单元格（注意它可能随滚动被销毁，只用于兜底）。
    const headerCell = document.querySelector<HTMLElement>('.pretext-table th[data-col-key="content"]');
    const firstBodyCell = document.querySelector<HTMLElement>(
        '.pretext-table [data-col-key="content"] .table-cell-wrapper',
    );
    const firstCell = headerCell || firstBodyCell;
    if (!firstCell || !window.ResizeObserver) return;
    contentCellObserver = new ResizeObserver(entries => {
        const width = entries[0]?.contentRect.width ?? 0;
        if (!width || width === contentTextWidth) return;
        contentTextWidth = width;
        preCalculateAllRowHeights();
        // setAutoHeight 只更新行高树，避免逐行触发重算；这里统一刷新一次虚拟滚动几何
        requestAnimationFrame(() => stkTableRef.value?.initVirtualScrollY());
    });
    contentCellObserver.observe(firstCell);
}

/**
 * 读取内容列**真实生效**的字体 / 行高 / 上下 padding。
 * pretext 的高度按传入的 font、lineHeight、maxWidth 计算；这些值只要和 CSS 不一致，
 * 预计算行高就会与真实渲染行高产生偏差。它们都是样式级计算值，不依赖布局。
 */
function getContentCellMetrics() {
    if (!contentTextWidth) return null;
    const firstCell = document.querySelector<HTMLElement>(
        '.pretext-table [data-col-key="content"] .table-cell-wrapper',
    );
    if (!firstCell) return null;
    const cellStyle = getComputedStyle(firstCell);
    const tdStyle = getComputedStyle(firstCell.parentElement || firstCell);
    const fontSize = parseFloat(cellStyle.fontSize) || 14;
    return {
        width: contentTextWidth,
        // canvas font 语法：字号 + 实际字体族（页面可能用的是 Inter 而不是 system-ui）
        font: `${cellStyle.fontSize} ${cellStyle.fontFamily}`,
        lineHeight: parseFloat(cellStyle.lineHeight) || Math.round(fontSize * 1.2),
        // td 的上下 padding（默认 --cell-padding-y: 0，真实行高里没有这部分）
        paddingY: (parseFloat(tdStyle.paddingTop) || 0) + (parseFloat(tdStyle.paddingBottom) || 0),
    };
}

/**
 * 使用 pretext 计算文本在指定宽度下的高度
 */
function calculateHeightWithPretext(text: string, metrics: NonNullable<ReturnType<typeof getContentCellMetrics>>): number {
    const prepared = prepare(text, metrics.font);
    const { height } = layout(prepared, metrics.width, metrics.lineHeight);
    // 行高 = 文本高度 + 单元格上下 padding；至少包含一行
    return Math.max(height + metrics.paddingY, metrics.lineHeight + metrics.paddingY);
}

/**
 * 预计算所有行的行高
 */
function preCalculateAllRowHeights() {
    const metrics = getContentCellMetrics();
    if (!metrics) return;
    data.forEach(row => {
        const height = calculateHeightWithPretext(row.content, metrics);
        stkTableRef.value?.setAutoHeight(row.id, height);
    });
}

function autoResize() {
    preCalculateAllRowHeights();
}
</script>

<template>
    <StkTable
        ref="stkTableRef"
        class="pretext-table"
        row-key="id"
        style="height: 400px"
        stripe
        virtual
        scrollbar
        auto-row-height
        :row-height="50"
        :columns="columns"
        :data-source="data"
        :auto-resize="autoResize"
    ></StkTable>
</template>
<style scoped>
:deep(.v-head) {
    background-color: #333;
    font-weight: bold;
}

.stk-table {
    line-height: 20px;
    /* 与 calculateHeightWithPretext 读取的 paddingY 保持一致；默认值是 0 */
    --cell-padding-y: 8px;
}
</style>
