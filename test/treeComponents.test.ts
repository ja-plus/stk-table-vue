/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { markRaw, nextTick } from 'vue';
import { describe, expect, test } from 'vitest';
import { StkTable, StkTreeCell, StkTreeFoldIcon, StkTreeIndent } from '@/StkTable';

describe('public tree components', () => {
    test('exports and renders the indent component', () => {
        const wrapper = mount(StkTreeIndent, { props: { level: 2, showGuide: true } });

        expect(wrapper.find('.stk-tree-indent').attributes('style')).toContain('--stk-tree-indent-cells: 2');
        expect(wrapper.find('.stk-tree-guide').exists()).toBe(true);
    });

    test('indent offset shifts only the guide line, keeping the indent width', () => {
        const wrapper = mount(StkTreeIndent, { props: { level: 2, showGuide: true, offset: '4px' } });
        const style = wrapper.find('.stk-tree-indent').attributes('style');

        expect(style).toContain('--stk-tree-guide-offset: 4px');
        // 偏移只作用于引导线：缩进格数（决定宽度）不变
        expect(style).toContain('--stk-tree-indent-cells: 2');
        expect(wrapper.find('.stk-tree-guide').exists()).toBe(true);

        const noOffset = mount(StkTreeIndent, { props: { level: 2, showGuide: true } });
        // 未传 offset 时不写入该变量，由样式表的 var(--stk-tree-guide-offset, 0px) 兜底
        expect(noOffset.find('.stk-tree-indent').attributes('style')).not.toContain('--stk-tree-guide-offset');
    });

    test('renders fold icon states from public props', () => {
        const expanded = mount(StkTreeFoldIcon, { props: { expandable: true, expanded: true } });
        expect(expanded.find('[data-stk-fold]').exists()).toBe(true);
        expect(expanded.find('.stk-fold-icon').classes()).toContain('is-expanded');
        expect(expanded.find('.stk-fold-icon').attributes('aria-expanded')).toBe('true');

        const loading = mount(StkTreeFoldIcon, { props: { expandable: true, loading: true } });
        expect(loading.find('.stk-tree-loading-icon').exists()).toBe(true);
        expect(loading.find('[data-stk-fold]').exists()).toBe(false);

        const leaf = mount(StkTreeFoldIcon);
        expect(leaf.find('.stk-fold-holder').exists()).toBe(true);
    });

    test('uses custom cell context without private tree fields', () => {
        const wrapper = mount(StkTreeCell, {
            props: {
                row: { name: 'Node' },
                col: { dataIndex: 'name' },
                cellValue: 'Node',
                rowIndex: 0,
                colIndex: 0,
                level: 1,
                expandable: true,
                treeLoading: false,
                treeExpanded: true,
                showGuide: true,
            },
        });

        expect(wrapper.find('.stk-tree-indent').attributes('style')).toContain('--stk-tree-indent-cells: 1');
        expect(wrapper.find('.stk-tree-guide').exists()).toBe(true);
        expect(wrapper.find('[data-stk-fold]').exists()).toBe(true);
        expect(wrapper.text()).toContain('Node');
    });

    test('works as a StkTable customCell without emitting ordinary cell clicks', async () => {
        const wrapper = mount(StkTable as any, {
            props: {
                rowKey: 'id',
                columns: [{ type: 'tree-node', dataIndex: 'name', customCell: markRaw(StkTreeCell) }],
                dataSource: [{ id: 'r', name: 'Root', children: [{ id: 'c', name: 'Child' }] }],
            },
        });

        await nextTick();
        await wrapper.find('[data-stk-fold]').trigger('click');
        await nextTick();

        expect(wrapper.findAll('tbody tr')).toHaveLength(2);
        expect(wrapper.emitted('cell-click')).toBeUndefined();
    });
});
