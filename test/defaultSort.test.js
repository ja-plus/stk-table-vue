import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import StkTable from '../src/StkTable/StkTable.vue';

/** 构造测试用 wrapper 的快捷函数 */
function createWrapper(extraProps = {}) {
    return mount(StkTable, {
        props: {
            columns: [
                { title: 'Name', dataIndex: 'name', sorter: true },
                { title: 'Age', dataIndex: 'age', sorter: true, sortType: 'number' },
                { title: 'Score', dataIndex: 'score', sorter: true },
            ],
            dataSource: [
                { key: '1', name: 'John', age: 30, score: 80 },
                { key: '2', name: 'Jane', age: 25, score: 95 },
                { key: '3', name: 'Bob', age: 35, score: 70 },
                { key: '4', name: 'Alice', age: null, score: 85 },
            ],
            ...extraProps,
        },
    });
}

describe('defaultSort 排序切换', () => {
    // ─── defaultSort: asc ───────────────────────────────────────────────
    describe('当 defaultSort.order 为 asc 时', () => {
        it('首次点击应该切换到 null（取消排序）', async () => {
            const wrapper = createWrapper({
                sortConfig: {
                    defaultSort: {
                        dataIndex: 'age',
                        order: 'asc',
                        sortType: 'number',
                    },
                },
            });

            // 等待组件初始化完成
            await wrapper.vm.$nextTick();

            // 初始状态应该是 asc
            expect(wrapper.vm.sortStates[0]?.dataIndex).toBe('age');
            expect(wrapper.vm.sortStates[0]?.order).toBe('asc');

            // 找到 age 列的表头并点击
            const ageHeader = wrapper.findAll('th').find(th => th.text().includes('Age'));
            expect(ageHeader).toBeDefined();

            // 点击表头：按照循环顺序 null → desc → asc → null，从 asc 点击后应该切换到 null
            await ageHeader.trigger('click');

            // 应该切换到 null（取消排序）
            expect(wrapper.vm.sortStates).toHaveLength(0);
        });

        it('第二次点击应该切换到 desc', async () => {
            const wrapper = createWrapper({
                sortConfig: {
                    defaultSort: {
                        dataIndex: 'age',
                        order: 'asc',
                        sortType: 'number',
                    },
                },
            });

            await wrapper.vm.$nextTick();

            // 第一次点击：asc → null
            const ageHeader = wrapper.findAll('th').find(th => th.text().includes('Age'));
            await ageHeader.trigger('click');
            expect(wrapper.vm.sortStates).toHaveLength(0);

            // 第二次点击：null → desc
            await ageHeader.trigger('click');

            // 应该切换到 desc
            expect(wrapper.vm.sortStates[0]?.dataIndex).toBe('age');
            expect(wrapper.vm.sortStates[0]?.order).toBe('desc');
        });

        it('第三次点击应该切换到 asc', async () => {
            const wrapper = createWrapper({
                sortConfig: {
                    defaultSort: {
                        dataIndex: 'age',
                        order: 'asc',
                        sortType: 'number',
                    },
                },
            });

            await wrapper.vm.$nextTick();

            const ageHeader = wrapper.findAll('th').find(th => th.text().includes('Age'));

            // 第 1 次点击：asc → null
            await ageHeader.trigger('click');
            expect(wrapper.vm.sortStates).toHaveLength(0);

            // 第 2 次点击：null → desc
            await ageHeader.trigger('click');
            expect(wrapper.vm.sortStates[0]?.order).toBe('desc');

            // 第 3 次点击：desc → asc
            await ageHeader.trigger('click');
            expect(wrapper.vm.sortStates[0]?.order).toBe('asc');
        });
    });

    // ─── defaultSort: desc ───────────────────────────────────────────────
    describe('当 defaultSort.order 为 desc 时', () => {
        it('首次点击应该切换到 asc', async () => {
            const wrapper = createWrapper({
                sortConfig: {
                    defaultSort: {
                        dataIndex: 'age',
                        order: 'desc',
                        sortType: 'number',
                    },
                },
            });

            await wrapper.vm.$nextTick();

            // 初始状态应该是 desc
            expect(wrapper.vm.sortStates[0]?.dataIndex).toBe('age');
            expect(wrapper.vm.sortStates[0]?.order).toBe('desc');

            // 点击 age 列的表头：按照循环顺序 null → desc → asc → null，从 desc 点击后应该切换到 asc
            const ageHeader = wrapper.findAll('th').find(th => th.text().includes('Age'));
            await ageHeader.trigger('click');

            // 应该切换到 asc
            expect(wrapper.vm.sortStates[0]?.dataIndex).toBe('age');
            expect(wrapper.vm.sortStates[0]?.order).toBe('asc');
        });

        it('完整循环：desc → asc → null → desc', async () => {
            const wrapper = createWrapper({
                sortConfig: {
                    defaultSort: {
                        dataIndex: 'age',
                        order: 'desc',
                        sortType: 'number',
                    },
                },
            });

            await wrapper.vm.$nextTick();

            const ageHeader = wrapper.findAll('th').find(th => th.text().includes('Age'));

            // 初始：desc
            expect(wrapper.vm.sortStates[0]?.order).toBe('desc');

            // 第 1 次点击：desc → asc
            await ageHeader.trigger('click');
            expect(wrapper.vm.sortStates[0]?.order).toBe('asc');

            // 第 2 次点击：asc → null
            await ageHeader.trigger('click');
            expect(wrapper.vm.sortStates).toHaveLength(0);

            // 第 3 次点击：null → desc
            await ageHeader.trigger('click');
            expect(wrapper.vm.sortStates[0]?.order).toBe('desc');
        });
    });

    // ─── 非 defaultSort 列 ───────────────────────────────────────────────
    describe('非 defaultSort 配置的列', () => {
        it('应该从 desc 开始正常循环（null → desc → asc → null）', async () => {
            const wrapper = createWrapper({
                sortConfig: {
                    defaultSort: {
                        dataIndex: 'age',
                        order: 'asc',
                    },
                },
            });

            await wrapper.vm.$nextTick();

            // 点击 name 列（不是 defaultSort 配置的列）
            const nameHeader = wrapper.findAll('th').find(th => th.text().includes('Name'));

            // 第 1 次点击：null → desc
            await nameHeader.trigger('click');
            expect(wrapper.vm.sortStates[0]?.dataIndex).toBe('name');
            expect(wrapper.vm.sortStates[0]?.order).toBe('desc');

            // 第 2 次点击：desc → asc
            await nameHeader.trigger('click');
            expect(wrapper.vm.sortStates[0]?.order).toBe('asc');

            // 第 3 次点击：asc → null
            await nameHeader.trigger('click');
            expect(wrapper.vm.sortStates).toHaveLength(0);

            // 第 4 次点击：null → desc
            await nameHeader.trigger('click');
            expect(wrapper.vm.sortStates[0]?.order).toBe('desc');
        });
    });

    // ─── sort-change 事件 ───────────────────────────────────────────────
    describe('sort-change 事件', () => {
        it('defaultSort 为 asc 时，首次点击应该触发 sort-change 事件且 order 为 null', async () => {
            const wrapper = createWrapper({
                sortConfig: {
                    defaultSort: {
                        dataIndex: 'age',
                        order: 'asc',
                        sortType: 'number',
                    },
                },
            });

            await wrapper.vm.$nextTick();

            const ageHeader = wrapper.findAll('th').find(th => th.text().includes('Age'));
            await ageHeader.trigger('click');

            // 检查事件是否触发
            expect(wrapper.emitted('sort-change')).toBeTruthy();
            expect(wrapper.emitted('sort-change')).toHaveLength(1);

            // 检查事件参数
            const eventArgs = wrapper.emitted('sort-change')[0];
            const [col, order] = eventArgs;
            expect(col.dataIndex).toBe('age');
            expect(order).toBe(null);
        });
    });
});
