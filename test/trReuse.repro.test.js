/**
 * @vitest-environment happy-dom
 *
 * 回归用例：纵向滚动时视口内保留行的 tr 元素必须被复用（keyed diff 生效）。
 * 背景：bodyRenderItems 的 v-for 模板含多个条件分支，若 :key 写在子 tr 而非 template 上，
 * Fragment 无 key 会退化为 unkeyed diff，滚动时整行重建导致卡顿。
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { expect, test } from 'vitest';

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
    return Math.ceil(height / ROW_HEIGHT) - 1;
}

const columns = [
    { title: 'id', dataIndex: 'id', width: 100 },
    { title: 'name', dataIndex: 'name', width: 120 },
    { title: 'value', dataIndex: 'value' },
];

const data = new Array(200).fill(0).map((_, i) => ({ id: i, name: `name-${i}`, value: `value-${i}` }));

test('滚动一行：视口内保留行的 tr 元素应被复用（不重建）', async () => {
    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, columns, dataSource: data },
    });
    mockContainerHeight(wrapper, 300); // pageSize = 10

    await scrollYTo(wrapper, 5 * ROW_HEIGHT);
    const tbodyEl = wrapper.find('tbody.stk-tbody-main').element;
    const tableEl = wrapper.find('table').element;
    const padTrEl = wrapper.find('tbody.stk-tbody-main > tr.padding-top-tr').element;
    const before = new Map();
    wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key]').forEach(tr => {
        before.set(tr.attributes('data-row-key'), tr.element);
    });

    await scrollYTo(wrapper, 6 * ROW_HEIGHT);
    const after = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key]');

    let reused = 0;
    let recreated = 0;
    after.forEach(tr => {
        const key = tr.attributes('data-row-key');
        const oldEl = before.get(key);
        if (!oldEl) return; // 新进入视口的行
        if (oldEl === tr.element) {
            reused++;
        } else {
            recreated++;
        }
    });

    expect(recreated, '共同行的 tr 元素应全部被复用').toBe(0);
    expect(reused).toBeGreaterThan(0);
    expect(tableEl === wrapper.find('table').element).toBe(true);
    expect(tbodyEl === wrapper.find('tbody.stk-tbody-main').element).toBe(true);
    expect(padTrEl === wrapper.find('tbody.stk-tbody-main > tr.padding-top-tr').element).toBe(true);
});
