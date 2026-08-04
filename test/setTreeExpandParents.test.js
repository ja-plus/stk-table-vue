/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test, vi } from 'vitest';

describe('setTreeExpand option.parents', () => {
    const columns = [
        { type: 'tree-node', dataIndex: 'name', title: 'Name', width: '200px' },
        { dataIndex: 'id', title: 'ID', width: '100px' },
    ];
    // 行对象会被写入 __T_EXP__ 等私有状态，每次 mount 需使用全新数据
    function createDataSource() {
        return [
            {
                id: 'root1',
                name: 'root1',
                children: [
                    {
                        id: 'child1',
                        name: 'child1',
                        children: [
                            { id: 'grandchild1', name: 'grandchild1' },
                            { id: 'grandchild2', name: 'grandchild2' },
                        ],
                    },
                    { id: 'child2', name: 'child2' },
                ],
            },
            { id: 'root2', name: 'root2' },
        ];
    }

    function mountTable() {
        return mount(StkTable, {
            props: {
                rowKey: 'id',
                columns,
                dataSource: createDataSource(),
            },
        });
    }

    test('expand all ancestors of a deep child node', async () => {
        const wrapper = mountTable();
        // initially only root nodes visible
        expect(wrapper.vm.getTableData().map(it => it.id)).toEqual(['root1', 'root2']);

        wrapper.vm.setTreeExpand('grandchild1', { parents: true });
        await wrapper.vm.$nextTick();

        const visibleIds = wrapper.vm.getTableData().map(it => it.id);
        // ancestors root1 & child1 expanded, grandchild1 visible, child2 visible as root1's direct child
        expect(visibleIds).toEqual(['root1', 'child1', 'grandchild1', 'grandchild2', 'child2', 'root2']);
        // target has no children, stays collapsed
        const target = wrapper.vm.getTableData().find(it => it.id === 'grandchild1');
        expect(Boolean(target.__T_EXP__)).toBe(false);
    });

    test('expand ancestors and the target itself when target has children', async () => {
        const wrapper = mountTable();
        wrapper.vm.setTreeExpand('child1', { parents: true });
        await wrapper.vm.$nextTick();

        // root1 expanded, child1 itself expanded since it has children, grandchildren visible
        expect(wrapper.vm.getTableData().map(it => it.id)).toEqual(['root1', 'child1', 'grandchild1', 'grandchild2', 'child2', 'root2']);
        const target = wrapper.vm.getTableData().find(it => it.id === 'child1');
        expect(Boolean(target.__T_EXP__)).toBe(true);
    });

    test('collapse all ancestors of a deep child node', async () => {
        const wrapper = mountTable();
        wrapper.vm.setTreeExpand('grandchild1', { parents: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.getTableData().map(it => it.id)).toContain('grandchild1');

        wrapper.vm.setTreeExpand('grandchild1', { parents: true, expand: false });
        await wrapper.vm.$nextTick();

        // all ancestors collapsed, target hidden, only root nodes visible
        expect(wrapper.vm.getTableData().map(it => it.id)).toEqual(['root1', 'root2']);
    });

    test('warn when target rowKey not found', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountTable();

        expect(() => wrapper.vm.setTreeExpand('not-exist', { parents: true })).not.toThrow();
        expect(warnSpy).toHaveBeenCalledWith('treeExpandRow failed.rowKey:', 'not-exist');
        expect(wrapper.vm.getTableData().map(it => it.id)).toEqual(['root1', 'root2']);
        warnSpy.mockRestore();
    });

    test('target is a root node with children, expand itself', async () => {
        const wrapper = mountTable();
        wrapper.vm.setTreeExpand('root1', { parents: true });
        await wrapper.vm.$nextTick();
        // no ancestors, but root1 itself has children so it gets expanded
        expect(wrapper.vm.getTableData().map(it => it.id)).toEqual(['root1', 'child1', 'child2', 'root2']);
    });
});
