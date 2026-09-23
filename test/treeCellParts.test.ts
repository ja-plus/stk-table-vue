/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

async function flush() {
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 0));
        await nextTick();
    }
}

/** 根(可展开) -> c1(可展开) -> g1(叶子)，配 defaultExpandAll 后四层可见 */
function createTreeData() {
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

function mountTree(treeConfig: any, columns: any) {
    return mount(StkTable as any, { props: { rowKey: 'id', columns, dataSource: createTreeData(), treeConfig } });
}

const treeCol = { type: 'tree-node', dataIndex: 'name', title: 'Name', width: '200px' } as any;

function trById(wrapper: any, id: string) {
    const rows = (wrapper.vm as any).getTableData();
    return wrapper.findAll('tbody tr')[rows.findIndex((it: any) => it.id === id)];
}

describe('内置树单元格组成件（TreeIndent / TreeFoldIcon）', () => {
    test('缩进格数按层级给出，可展开行是箭头、叶子行是占位格', async () => {
        const wrapper = mountTree({ defaultExpandAll: true }, [treeCol]);
        await flush();

        // 根行：无缩进（0 格），控件位是箭头且带公开契约属性
        const rootTr = trById(wrapper, 'r');
        expect(rootTr.find('.stk-tree-indent').attributes('style')).toContain('--stk-tree-indent-cells: 0');
        expect(rootTr.find('.stk-fold-icon').attributes('data-stk-fold')).toBe('');
        expect(rootTr.find('.stk-fold-holder').exists()).toBe(false);

        // 第 1 层可展开行：缩进 1 格
        expect(trById(wrapper, 'c1').find('.stk-tree-indent').attributes('style')).toContain('--stk-tree-indent-cells: 1');

        // 第 2 层叶子行：缩进 2 格 + 占位格（不再有箭头）
        const leafTr = trById(wrapper, 'g1');
        expect(leafTr.find('.stk-tree-indent').attributes('style')).toContain('--stk-tree-indent-cells: 2');
        expect(leafTr.find('.stk-fold-holder').exists()).toBe(true);
        expect(leafTr.find('[data-stk-fold]').exists()).toBe(false);
    });

    test('showGuide 关闭时仍有缩进格、无引导线', async () => {
        const wrapper = mountTree({ defaultExpandAll: true }, [treeCol]);
        await flush();
        const c1 = trById(wrapper, 'c1');
        expect(c1.find('.stk-tree-indent').exists()).toBe(true);
        expect(c1.find('.stk-tree-guide').exists()).toBe(false);
    });

    test('懒加载加载中：控件位换成 loading 且不再作为展开控件', async () => {
        let pending: any = null;
        const wrapper = mount(StkTable as any, {
            props: {
                rowKey: 'id',
                columns: [treeCol],
                // 标记有子节点但无 children：懒加载模式下可展开、展开时才取数
                dataSource: [{ id: 'r', name: 'Root', hasChildren: true }],
                treeConfig: { lazy: true, loadMethod: () => new Promise(res => (pending = res)) },
            },
        });
        await flush();
        await wrapper.findAll('tbody tr')[0].find('[data-stk-fold]').trigger('click');
        await flush();

        const rootTr = wrapper.findAll('tbody tr')[0];
        expect(rootTr.find('.stk-tree-loading-icon').exists()).toBe(true);
        // loading 态不是展开控件，故不带 data-stk-fold
        expect(rootTr.find('[data-stk-fold]').exists()).toBe(false);

        pending([{ id: 'c1', name: 'C1' }]);
        await flush();
        expect(wrapper.findAll('tbody tr')[0].find('.stk-tree-loading-icon').exists()).toBe(false);
    });
});

describe('customCell 的树上下文与内置插槽', () => {
    /** 记录每次渲染收到的 props，便于断言注入值 */
    const seen: any[] = [];
    const ProbeCell = markRaw(
        defineComponent({
            name: 'ProbeCell',
            props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex', 'expanded', 'treeExpanded', 'level', 'expandable', 'treeLoading'],
            setup(props) {
                return () => {
                    seen.push({ id: props.row.id, level: props.level, expandable: props.expandable, treeLoading: props.treeLoading });
                    return h('span', String(props.cellValue ?? ''));
                };
            },
        }),
    );

    test('tree-node 列的 customCell 收到 level/expandable/treeLoading', async () => {
        seen.length = 0;
        const wrapper = mountTree({ defaultExpandAll: true }, [{ ...treeCol, customCell: ProbeCell }]);
        await flush();

        const byId = (id: string) => seen.filter(it => it.id === id).pop();
        expect(byId('r')).toMatchObject({ level: 0, expandable: true, treeLoading: false });
        expect(byId('g1')).toMatchObject({ level: 2, expandable: false, treeLoading: false });
    });

    test('普通列的 customCell 不注入树相关值，既有 props 不变', async () => {
        seen.length = 0;
        const wrapper = mount(StkTable as any, {
            props: {
                rowKey: 'id',
                columns: [{ dataIndex: 'name', title: 'Name', customCell: ProbeCell }],
                dataSource: [{ id: 'r', name: 'Root' }],
            },
        });
        await flush();
        const last = seen.pop();
        expect(last).toMatchObject({ id: 'r', level: undefined, expandable: undefined, treeLoading: undefined });
        expect(wrapper.findAll('tbody tr')[0].find('.stk-tree-indent').exists()).toBe(false);
    });

    test('消费 stkTreeIndent 插槽时缩进与引导线随内置一致；不消费则无残留', async () => {
        const IndentCell = markRaw(
            defineComponent({
                name: 'IndentCell',
                props: ['row', 'cellValue'],
                setup(props, { slots }) {
                    return () => h('div', { class: 'cell-with-indent' }, [slots.stkTreeIndent?.(), h('span', String(props.cellValue ?? ''))]);
                },
            }),
        );
        const wrapper = mountTree({ defaultExpandAll: true, showGuide: true }, [{ ...treeCol, customCell: IndentCell }]);
        await flush();
        const c1 = trById(wrapper, 'c1');
        expect(c1.find('.stk-tree-indent').attributes('style')).toContain('--stk-tree-indent-cells: 1');
        expect(c1.find('.stk-tree-indent .stk-tree-guide').exists()).toBe(true);

        // 上一个用例（ProbeCell）未消费该插槽，故整表无引导线残留
        const plain = mountTree({ defaultExpandAll: true, showGuide: true }, [{ ...treeCol, customCell: ProbeCell }]);
        await flush();
        expect(plain.find('.stk-tree-indent').exists()).toBe(false);
        expect(plain.find('.stk-tree-guide').exists()).toBe(false);
    });
});
