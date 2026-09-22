/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

const columns = [
    { type: 'tree-node', dataIndex: 'name', title: 'Name', width: '200px' },
    { dataIndex: 'id', title: 'ID', width: '100px' },
] as any;

/** 三层嵌套，defaultExpandAll 后展平顺序：r(0) c1(1) g1(2) c2(1) */
function createData() {
    return [
        {
            id: 'r',
            name: 'Root',
            children: [
                { id: 'c1', name: 'C1', children: [{ id: 'g1', name: 'G1' }] },
                { id: 'c2', name: 'C2' },
            ],
        },
    ];
}

async function flush() {
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 0));
        await nextTick();
    }
}

function mountTable(treeConfig: any, extraProps: any = {}) {
    return mount(StkTable as any, {
        props: { rowKey: 'id', columns, dataSource: createData(), treeConfig, ...extraProps },
    });
}

/** 找到某个 id 对应的 tbody tr */
function trOf(wrapper: any, id: string) {
    const rows = (wrapper.vm as any).getTableData();
    const index = rows.findIndex((it: any) => it.id === id);
    expect(index, `row ${id} 应存在`).toBeGreaterThanOrEqual(0);
    return wrapper.findAll('tbody tr')[index];
}

describe('tree indent guide lines (treeConfig.showGuide)', () => {
    test('关闭时（默认）tree-node 单元格不渲染任何引导线（零回归）', async () => {
        const wrapper = mountTable({ defaultExpandAll: true });
        await flush();
        for (const tr of wrapper.findAll('tbody tr')) {
            expect(tr.find('.stk-tree-guide').exists()).toBe(false);
        }
    });

    test('开启后按层级渲染引导线：根层 0 条、第 N 层引导区宽 N*16px', async () => {
        const wrapper = mountTable({ defaultExpandAll: true, showGuide: true });
        await flush();

        // 根层无引导线
        expect(trOf(wrapper, 'r').find('.stk-tree-guide').exists()).toBe(false);

        // 第 1 层：引导区宽 16px
        const c1Guide = trOf(wrapper, 'c1').find('.stk-tree-guide');
        expect(c1Guide.exists()).toBe(true);
        expect(c1Guide.attributes('style')).toContain('width: 16px');

        // 第 2 层：引导区宽 32px
        const g1Guide = trOf(wrapper, 'g1').find('.stk-tree-guide');
        expect(g1Guide.exists()).toBe(true);
        expect(g1Guide.attributes('style')).toContain('width: 32px');

        // 另一个第 1 层兄弟同样 16px
        expect(trOf(wrapper, 'c2').find('.stk-tree-guide').attributes('style')).toContain('width: 16px');
    });

    test('虚拟滚动下随可见行动态渲染引导线', async () => {
        const wrapper = mountTable({ defaultExpandAll: true, showGuide: true }, { virtual: true, height: '120px' });
        await flush();

        // 折叠后再展开，可见子行随行动态创建引导线
        (wrapper.vm as any).setTreeExpand('r', { expand: false });
        await flush();
        expect(trOf(wrapper, 'r').find('.stk-tree-guide').exists()).toBe(false);

        (wrapper.vm as any).setTreeExpand('r', { expand: true, all: true });
        await flush();
        expect(trOf(wrapper, 'g1').find('.stk-tree-guide').exists()).toBe(true);
    });
});
