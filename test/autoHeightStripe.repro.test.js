/**
 * @vitest-environment happy-dom
 *
 * 复现：不定高（autoRowHeight）虚拟列表 + stripe 时，可视区上方保留行的 td 被剔除，
 * 行高无法正常撑开。
 *
 * 根因：stripe 模式下 updateVirtualScrollY 会把奇数 startIndex 减 1 对齐偶数行，
 * 视口上方因此多出 1 行（startIndex < viewportStartIndex）。getBodyColumns 对该区域
 * 做了「剔除 td」优化（依赖空 tr 通过 CSS height: var(--row-height) 保持高度），
 * 但未排除 autoRowHeight 模式——不定高模式下 tr 高度靠 td 内容撑开，td 被删后行塌陷，
 * 塌陷高度还会被 DOM 测量写入行高缓存（永不过期），污染后续定位。
 *
 * 修复：td 剔除优化仅在 canMergeEmptyRows（virtual && !autoRowHeight）时启用。
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

const ROW_HEIGHT = 28;

function nextFrame() {
    return new Promise(resolve => setTimeout(resolve, 35));
}

async function scrollYTo(wrapper, top) {
    const container = wrapper.element;
    container.scrollTop = top;
    container.dispatchEvent(new Event('scroll'));
    await nextFrame();
    await wrapper.vm.$nextTick();
}

function mockContainerHeight(wrapper, height) {
    Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: height });
    wrapper.vm.initVirtualScrollY();
    // pageSize = ceil(height/rowHeight) - 表头行数(1)
    return Math.ceil(height / ROW_HEIGHT) - 1;
}

const columns = [
    { title: 'id', dataIndex: 'id', width: 100 },
    { title: 'name', dataIndex: 'name', width: 120 },
    { title: 'value', dataIndex: 'value' },
];

const data = new Array(200).fill(0).map((_, i) => ({ id: i, name: `name-${i}`, value: `value-${i}` }));

function mountTable() {
    return mount(StkTable, {
        props: { rowKey: 'id', virtual: true, stripe: true, autoRowHeight: true, columns, dataSource: data },
    });
}

/** 校验 tbody 中所有数据行都渲染了完整 td（无空数据行、无占位 td/占位 tr） */
function checkNoStrippedRows(wrapper) {
    const errors = [];
    const trs = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key]');
    for (const tr of trs) {
        const tdCount = tr.findAll('td').length;
        if (tdCount !== columns.length) {
            errors.push(`tr[data-row-key="${tr.attributes('data-row-key')}"] td 数量 ${tdCount} != ${columns.length}`);
        }
    }
    if (wrapper.find('tbody.stk-tbody-main td.vt-above-viewport-ph').exists()) {
        errors.push('autoRowHeight 模式不应渲染视口上方占位 td（vt-above-viewport-ph）');
    }
    if (wrapper.find('tbody.stk-tbody-main tr.vt-above-viewport-ph-row').exists()) {
        errors.push('autoRowHeight 模式不应渲染视口上方占位 tr（vt-above-viewport-ph-row）');
    }
    return errors;
}

describe('autoRowHeight + stripe 虚拟列表：视口上方行不能剔除 td', () => {
    test('stripe 修正（奇数 startIndex -1）保留的视口上方行应渲染完整 td', async () => {
        const wrapper = mountTable();
        mockContainerHeight(wrapper, 300); // pageSize = 10

        // scrollTop=154：累计高度扫描得 startIndex=5（奇数），stripe 修正为 4，
        // 行 4 成为视口上方保留行（viewportStartIndex=5）
        await scrollYTo(wrapper, 154);

        // stripe 修正前提：视口首行索引 5（奇数 startIndex 被减 1），其上方保留行 4
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="4"]').exists()).toBe(true);
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="5"]').exists()).toBe(true);

        // 修复前：行 4 的 td 全部被剔除（空 tr，行高塌陷）；修复后：渲染完整 3 列
        const aboveRow = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="4"]');
        expect(aboveRow.findAll('td').length, '视口上方保留行应渲染完整 td').toBe(columns.length);

        expect(checkNoStrippedRows(wrapper)).toEqual([]);
    });

    test('全量滚动扫描：任何滚动位置下数据行都不允许被剔除 td', async () => {
        const wrapper = mountTable();
        mockContainerHeight(wrapper, 300);

        const maxScrollTop = data.length * ROW_HEIGHT - 300;
        const allErrors = [];
        for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT) {
            await scrollYTo(wrapper, top);
            const errors = checkNoStrippedRows(wrapper);
            if (errors.length) {
                allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
            }
        }
        expect(allErrors).toEqual([]);
    }, 60_000);
});
