import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import StkTable from '../src/StkTable/StkTable.vue';

/** 构造测试用 wrapper 的快捷函数 */
function createWrapper(extraProps = {}) {
    return mount(StkTable, {
        props: {
            columns: [
                { title: 'Name', dataIndex: 'name', sorter: true },
                { title: 'Age', dataIndex: 'age', sorter: true },
                { title: 'Score', dataIndex: 'score', sorter: true },
            ],
            dataSource: [
                { key: '1', name: 'John', age: 30, score: 80 },
                { key: '2', name: 'Jane', age: 25, score: 95 },
                { key: '3', name: 'Bob', age: 35, score: 70 },
            ],
            ...extraProps,
        },
    });
}

describe('setSorter', () => {
    // ─── force 参数 ───────────────────────────────────────────────
    describe('force parameter', () => {
        it('sortRemote=true 时不传 force，不执行本地排序', () => {
            const wrapper = createWrapper({ sortRemote: true });
            const result = wrapper.vm.setSorter('age', 'desc');
            expect(result).toEqual([
                { key: '1', name: 'John', age: 30, score: 80 },
                { key: '2', name: 'Jane', age: 25, score: 95 },
                { key: '3', name: 'Bob', age: 35, score: 70 },
            ]);
        });

        it('sortRemote=true 且 force=true 时，强制执行本地排序', () => {
            const wrapper = createWrapper({ sortRemote: true });
            const result = wrapper.vm.setSorter('age', 'desc', { force: true });
            expect(result).toEqual([
                { key: '3', name: 'Bob', age: 35, score: 70 },
                { key: '1', name: 'John', age: 30, score: 80 },
                { key: '2', name: 'Jane', age: 25, score: 95 },
            ]);
        });

        it('sortRemote=false 时，无论 force 取值都执行本地排序', () => {
            const wrapper = createWrapper({ sortRemote: false });
            const result1 = wrapper.vm.setSorter('age', 'desc');
            expect(result1).toEqual([
                { key: '3', name: 'Bob', age: 35, score: 70 },
                { key: '1', name: 'John', age: 30, score: 80 },
                { key: '2', name: 'Jane', age: 25, score: 95 },
            ]);
            const result2 = wrapper.vm.setSorter('age', 'asc', { force: true });
            expect(result2).toEqual([
                { key: '2', name: 'Jane', age: 25, score: 95 },
                { key: '1', name: 'John', age: 30, score: 80 },
                { key: '3', name: 'Bob', age: 35, score: 70 },
            ]);
        });
    });

    // ─── order: asc / desc ────────────────────────────────────────
    describe('order direction', () => {
        it('asc 正序排列', () => {
            const wrapper = createWrapper();
            const result = wrapper.vm.setSorter('age', 'asc');
            expect(result.map(r => r.age)).toEqual([25, 30, 35]);
        });

        it('desc 倒序排列', () => {
            const wrapper = createWrapper();
            const result = wrapper.vm.setSorter('age', 'desc');
            expect(result.map(r => r.age)).toEqual([35, 30, 25]);
        });

        it('order 为 null/falsy 时清空排序状态并还原数据', () => {
            const wrapper = createWrapper();
            wrapper.vm.setSorter('age', 'desc');
            const result = wrapper.vm.setSorter('age', null);
            // sortStates 应被清空
            expect(wrapper.vm.sortStates).toEqual([]);
            // 数据恢复原始顺序
            expect(result.map(r => r.key)).toEqual(['1', '2', '3']);
        });
    });

    // ─── sort 参数 ────────────────────────────────────────────────
    describe('sort parameter', () => {
        it('sort=false 时更新排序状态但不重新排序数据', () => {
            const wrapper = createWrapper();
            // 先执行一次真实排序建立基准
            wrapper.vm.setSorter('age', 'desc');
            const sortedResult = wrapper.vm.dataSourceCopy;

            // sort=false 时切换方向但不重新计算
            wrapper.vm.setSorter('age', 'asc', { sort: false });
            // 数据不变
            expect(wrapper.vm.dataSourceCopy).toEqual(sortedResult);
            // 但排序状态已更新
            expect(wrapper.vm.sortStates[0].order).toBe('asc');
        });
    });

    // ─── silent 参数 ──────────────────────────────────────────────
    describe('silent parameter', () => {
        it('silent=true（默认）不触发 sort-change 事件', () => {
            const wrapper = createWrapper();
            wrapper.vm.setSorter('age', 'desc');
            expect(wrapper.emitted('sort-change')).toBeFalsy();
        });

        it('silent=false 时触发 sort-change 事件', () => {
            const wrapper = createWrapper();
            wrapper.vm.setSorter('age', 'desc', { silent: false });
            expect(wrapper.emitted('sort-change')).toBeTruthy();
            expect(wrapper.emitted('sort-change').length).toBe(1);
        });
    });

    // ─── sortOption 参数 ──────────────────────────────────────────
    describe('sortOption parameter', () => {
        it('通过 sortOption 对不在 columns 中的列排序', () => {
            const wrapper = createWrapper();
            // 使用自定义 sortOption，指向 score 字段但用一个不存在的 colKey
            const result = wrapper.vm.setSorter('__hidden__', 'desc', {
                sortOption: { dataIndex: 'score' },
            });
            expect(result.map(r => r.score)).toEqual([95, 80, 70]);
        });
    });

    // ─── 排序状态管理 ─────────────────────────────────────────────
    describe('sortStates management', () => {
        it('单列模式下，新列覆盖旧列的排序状态', () => {
            const wrapper = createWrapper();
            wrapper.vm.setSorter('age', 'desc');
            wrapper.vm.setSorter('score', 'asc');
            expect(wrapper.vm.sortStates).toHaveLength(1);
            expect(wrapper.vm.sortStates[0].dataIndex).toBe('score');
        });

        it('多列排序模式下，append=true 追加排序列', () => {
            const wrapper = createWrapper({ sortConfig: { multiSort: true } });
            wrapper.vm.setSorter('age', 'desc', { append: true });
            wrapper.vm.setSorter('score', 'asc', { append: true });
            expect(wrapper.vm.sortStates).toHaveLength(2);
            // 最新追加的排在最前（优先级最高）
            expect(wrapper.vm.sortStates[0].dataIndex).toBe('score');
            expect(wrapper.vm.sortStates[1].dataIndex).toBe('age');
        });

        it('多列排序模式下，重复设置同一列时更新而非重复添加', () => {
            const wrapper = createWrapper({ sortConfig: { multiSort: true } });
            wrapper.vm.setSorter('age', 'desc', { append: true });
            wrapper.vm.setSorter('age', 'asc', { append: true });
            expect(wrapper.vm.sortStates).toHaveLength(1);
            expect(wrapper.vm.sortStates[0].order).toBe('asc');
        });

        it('多列排序超出 multiSortLimit 时，移除最低优先级的列', () => {
            const wrapper = createWrapper({
                sortConfig: { multiSort: true, multiSortLimit: 2 },
            });
            wrapper.vm.setSorter('age', 'desc', { append: true });
            wrapper.vm.setSorter('score', 'asc', { append: true });
            wrapper.vm.setSorter('name', 'asc', { append: true });
            // 超出 limit=2，最旧的 age 被移除
            expect(wrapper.vm.sortStates).toHaveLength(2);
            const keys = wrapper.vm.sortStates.map(s => s.dataIndex);
            expect(keys).not.toContain('age');
        });
    });

    // ─── 返回值 ───────────────────────────────────────────────────
    describe('return value', () => {
        it('返回当前表格数据（dataSourceCopy）', () => {
            const wrapper = createWrapper();
            const result = wrapper.vm.setSorter('age', 'asc');
            expect(result).toBe(wrapper.vm.dataSourceCopy);
        });
    });
});
