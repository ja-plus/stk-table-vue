/**
 * @vitest-environment happy-dom
 *
 * createCheckboxCell cascade（树形勾选级联）行为测试：
 * 1. 勾选父行 → 递归写入全部子孙行；
 * 2. 勾选子行 → 自底向上重算祖先（全勾才勾、部分勾显示半选）；
 * 3. 表头全选/半选按叶子行（无 children 的行）统计，父行不重复计数；
 * 4. cascade=false 保持既有行为（互不影响、表头只看顶层）。
 */
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { StkTable, createCheckboxCell } from '@/StkTable';
import { describe, expect, test, vi } from 'vitest';

/**
 * 树结构（defaultExpandAll 后展平顺序）：
 * p1 ├ c1
 *    └ c2 ├ g1
 *         └ g2
 * p2 └ c3
 * 叶子行：c1 / g1 / g2 / c3，共 4 行。
 * 行对象会被写入 __T_EXP__ 等私有状态，每次 mount 需使用全新数据。
 */
function createTree() {
    return [
        {
            id: 'p1',
            name: 'p1',
            children: [
                { id: 'c1', name: 'c1' },
                {
                    id: 'c2',
                    name: 'c2',
                    children: [
                        { id: 'g1', name: 'g1' },
                        { id: 'g2', name: 'g2' },
                    ],
                },
            ],
        },
        { id: 'p2', name: 'p2', children: [{ id: 'c3', name: 'c3' }] },
    ];
}

const onChangeSpy = vi.fn();

function mountTable(cascade: boolean, tree: Record<string, any>[]) {
    const { CheckboxCell, CheckboxAllCell } = createCheckboxCell({ cascade, onChange: onChangeSpy });
    const columns = [
        { dataIndex: 'checkbox', align: 'center', width: 60, customCell: CheckboxCell(), customHeaderCell: CheckboxAllCell() },
        { type: 'tree-node', dataIndex: 'name', title: 'Name', width: 200 },
    ] as any;
    return mount(StkTable as any, {
        props: {
            rowKey: 'id',
            columns,
            // reactive 保证级联写入行 field 后，父行/子孙行/表头的 computed 能响应更新
            dataSource: reactive(tree),
            treeConfig: { defaultExpandAll: true },
        },
    });
}

/** 取某行的 checkbox input（thead 内为表头全选框） */
function findCheckbox(wrapper: ReturnType<typeof mountTable>, rowId: string) {
    return wrapper.find(`tbody tr[data-row-key="${rowId}"] input`);
}

function headerCheckbox(wrapper: ReturnType<typeof mountTable>) {
    return wrapper.find('thead input');
}

describe('createCheckboxCell cascade', () => {
    test('勾选父行递归勾选全部子孙；取消父行递归取消', async () => {
        const tree = createTree();
        const wrapper = mountTable(true, tree);

        await findCheckbox(wrapper, 'p1').setValue(true);
        for (const id of ['p1', 'c1', 'c2', 'g1', 'g2']) {
            expect((findCheckbox(wrapper, id).element as HTMLInputElement).checked, `${id} 应被级联勾选`).toBe(true);
        }
        expect((findCheckbox(wrapper, 'c3').element as HTMLInputElement).checked).toBe(false);

        await findCheckbox(wrapper, 'p1').setValue(false);
        for (const id of ['p1', 'c1', 'c2', 'g1', 'g2']) {
            expect((findCheckbox(wrapper, id).element as HTMLInputElement).checked, `${id} 应被级联取消`).toBe(false);
        }
    });

    test('勾选叶子行：祖先逐级半选 → 全部子孙勾选后父行转为勾选', async () => {
        const tree = createTree();
        const wrapper = mountTable(true, tree);

        // 勾 c1：p1 半选（部分子孙勾选）
        await findCheckbox(wrapper, 'c1').setValue(true);
        const p1 = findCheckbox(wrapper, 'p1').element as HTMLInputElement;
        expect(p1.checked).toBe(false);
        expect(p1.indeterminate).toBe(true);

        // 取消 c1：半选可逆，回到全不选
        await findCheckbox(wrapper, 'c1').setValue(false);
        const p1Reset = findCheckbox(wrapper, 'p1').element as HTMLInputElement;
        expect(p1Reset.checked).toBe(false);
        expect(p1Reset.indeterminate).toBe(false);

        // 勾孙子 g1：c2 半选，p1 逐级半选
        await findCheckbox(wrapper, 'g1').setValue(true);
        const c2 = findCheckbox(wrapper, 'c2').element as HTMLInputElement;
        expect(c2.checked).toBe(false);
        expect(c2.indeterminate).toBe(true);
        expect((findCheckbox(wrapper, 'p1').element as HTMLInputElement).indeterminate).toBe(true);

        // 勾 g2：c2 转为勾选；p1 因 c1 未勾仍为半选
        await findCheckbox(wrapper, 'g2').setValue(true);
        const c2Full = findCheckbox(wrapper, 'c2').element as HTMLInputElement;
        expect(c2Full.checked).toBe(true);
        expect(c2Full.indeterminate).toBe(false);
        expect((findCheckbox(wrapper, 'p1').element as HTMLInputElement).indeterminate).toBe(true);

        // 勾 c1：p1 全部子孙勾选 → 转为勾选
        await findCheckbox(wrapper, 'c1').setValue(true);
        const p1After = findCheckbox(wrapper, 'p1').element as HTMLInputElement;
        expect(p1After.checked).toBe(true);
        expect(p1After.indeterminate).toBe(false);
    });

    test('表头按叶子行统计：部分叶子勾选半选、全部勾选转全选（父行不重复计数）', async () => {
        const tree = createTree();
        const wrapper = mountTable(true, tree);

        // 勾 p1 级联勾 3 个叶子（c1/g1/g2），共 4 叶子：部分勾选 → 半选
        await findCheckbox(wrapper, 'p1').setValue(true);
        let header = headerCheckbox(wrapper).element as HTMLInputElement;
        expect(header.checked).toBe(false);
        expect(header.indeterminate).toBe(true);

        // 勾 p2 级联勾 c3：4/4 叶子全部勾选 → 表头全选
        await findCheckbox(wrapper, 'p2').setValue(true);
        header = headerCheckbox(wrapper).element as HTMLInputElement;
        expect(header.checked).toBe(true);
        expect(header.indeterminate).toBe(false);
    });

    test('表头全选递归写全树（含父行 field），取消全选清空', async () => {
        const tree = createTree();
        const wrapper = mountTable(true, tree);

        await headerCheckbox(wrapper).setValue(true);
        for (const id of ['p1', 'c1', 'c2', 'g1', 'g2', 'p2', 'c3']) {
            expect((findCheckbox(wrapper, id).element as HTMLInputElement).checked, `${id} 应被全选写入`).toBe(true);
        }
        // 数据层父行 field 也为 true（维持「父勾 ⇔ 全部子孙勾」不变量）
        expect(tree[0]._isChecked).toBe(true);

        await headerCheckbox(wrapper).setValue(false);
        for (const id of ['p1', 'c1', 'c2', 'g1', 'g2', 'p2', 'c3']) {
            expect((findCheckbox(wrapper, id).element as HTMLInputElement).checked, `${id} 应被取消全选`).toBe(false);
        }
    });

    test('onChange 回调收到的是用户实际点击的行（级联行不单独回调）', async () => {
        onChangeSpy.mockClear();
        const tree = createTree();
        const wrapper = mountTable(true, tree);

        await findCheckbox(wrapper, 'p1').setValue(true);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(true, expect.objectContaining({ id: 'p1' }));
        expect((onChangeSpy.mock.calls[0][1] as any)._isChecked).toBe(true);
    });

    test('cascade=false 向后兼容：勾选不级联、表头只统计顶层行', async () => {
        const tree = createTree();
        const wrapper = mountTable(false, tree);

        await findCheckbox(wrapper, 'p1').setValue(true);
        expect((findCheckbox(wrapper, 'c1').element as HTMLInputElement).checked).toBe(false);
        // 顶层 2 行勾了 1 行 → 半选
        let header = headerCheckbox(wrapper).element as HTMLInputElement;
        expect(header.checked).toBe(false);
        expect(header.indeterminate).toBe(true);

        await findCheckbox(wrapper, 'p2').setValue(true);
        header = headerCheckbox(wrapper).element as HTMLInputElement;
        expect(header.checked).toBe(true);
    });
});
