/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

/** 单个根节点带两个子节点：折叠时 tbody 1 行，展开后 3 行 */
function createData() {
    return [{ id: 'r', name: 'Root', children: [{ id: 'c1', name: 'C1' }, { id: 'c2', name: 'C2' }] }];
}

const treeColBase = { type: 'tree-node', dataIndex: 'name', title: 'Name', width: '200px' } as any;

function mountTable(customCell: any) {
    return mount(StkTable as any, {
        props: {
            rowKey: 'id',
            // customCell 是组件对象，放进 reactive 的 columns 前须 markRaw，否则 Vue 会告警
            columns: [customCell ? { ...treeColBase, customCell: markRaw(customCell) } : treeColBase, { dataIndex: 'id', title: 'ID', width: '100px' }],
            dataSource: createData(),
        },
    });
}

async function flush() {
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 0));
        await nextTick();
    }
}

/** 使用方自绘的展开控件：标记属性不同，行为应当一致 */
function makeSelfDrawnCell(marker: 'attr' | 'legacy-class') {
    return defineComponent({
        name: 'SelfDrawnCell',
        props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex'],
        setup(props) {
            return () =>
                h('div', { class: 'self-cell' }, [
                    h('span', marker === 'attr' ? { class: 'my-arrow', 'data-stk-fold': '' } : { class: 'stk-fold-icon my-arrow' }),
                    h('span', { class: 'my-label' }, String(props.row?.name ?? '')),
                ]);
        },
    });
}

/** 消费内置 stkFoldIcon 插槽的自定义单元格 */
const SlotCell = defineComponent({
    name: 'SlotCell',
    props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex'],
    setup(props, { slots }) {
        return () =>
            h('div', { class: 'slot-cell' }, [
                slots.stkFoldIcon?.(),
                h('span', { class: 'slot-label' }, String(props.row?.name ?? '')),
            ]);
    },
});

function rowCount(wrapper: any) {
    return wrapper.findAll('tbody tr').length;
}

describe('展开列（type: expand）共用同一套控件契约', () => {
    const baseCol = { type: 'expand', dataIndex: '', width: 50 } as any;
    function mountExpand(customCell?: any) {
        return mount(StkTable as any, {
            props: {
                rowKey: 'id',
                expandConfig: { height: 40 },
                columns: [customCell ? { ...baseCol, customCell: markRaw(customCell) } : baseCol, { dataIndex: 'id', title: 'ID', width: '100px' }],
                dataSource: [{ id: 'r' }, { id: 'r2' }],
            },
        });
    }

    test('未接管时内置箭头切换行展开，行为不变', async () => {
        const wrapper = mountExpand();
        await flush();
        expect(rowCount(wrapper)).toBe(2);
        await wrapper.findAll('tbody tr')[0].find('[data-stk-fold]').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(3);
    });

    test('customCell 接管展开列时，自绘 data-stk-fold 控件可切换行展开', async () => {
        const wrapper = mountExpand(makeSelfDrawnCell('attr'));
        await flush();
        expect(rowCount(wrapper)).toBe(2);
        await wrapper.findAll('tbody tr')[0].find('.my-arrow').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(3);
    });
});

describe('展开控件点击契约（data-stk-fold 委托）', () => {
    test('内置箭头：点击展开、再次点击折叠（一次点击只切换一次）', async () => {
        const wrapper = mountTable(null);
        await flush();
        expect(rowCount(wrapper)).toBe(1);

        await wrapper.findAll('tbody tr')[0].find('[data-stk-fold]').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(3);

        await wrapper.findAll('tbody tr')[0].find('[data-stk-fold]').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(1);
    });

    test('自绘控件带 data-stk-fold 可切换展开', async () => {
        const wrapper = mountTable(makeSelfDrawnCell('attr'));
        await flush();
        await wrapper.findAll('tbody tr')[0].find('.my-arrow').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(3);
    });

    test('旧内置类名 stk-fold-icon 仍作为兼容判据生效', async () => {
        const wrapper = mountTable(makeSelfDrawnCell('legacy-class'));
        await flush();
        await wrapper.findAll('tbody tr')[0].find('.my-arrow').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(3);
    });

    test('命中展开控件时不再触发 cell-click / cell-selected', async () => {
        const wrapper = mountTable(makeSelfDrawnCell('attr'));
        await flush();
        await wrapper.findAll('tbody tr')[0].find('.my-arrow').trigger('click');
        await flush();
        expect(wrapper.emitted('cell-click')).toBeUndefined();
        expect(wrapper.emitted('cell-selected')).toBeUndefined();

        // 非控件区域（标签文本）点击：正常发出 cell-click，且行展开状态不变
        await wrapper.findAll('tbody tr')[0].find('.my-label').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(3);
        expect(wrapper.emitted('cell-click')).toHaveLength(1);
    });

    test('消费 stkFoldIcon 插槽时一次点击只切换一次（不与委托重复触发）', async () => {
        const wrapper = mountTable(SlotCell);
        await flush();
        expect(wrapper.findAll('tbody tr')[0].find('.stk-fold-icon').exists()).toBe(true);
        await wrapper.findAll('tbody tr')[0].find('.stk-fold-icon').trigger('click');
        await flush();
        expect(rowCount(wrapper)).toBe(3);
    });
});
