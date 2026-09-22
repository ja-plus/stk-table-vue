/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { StkTable } from '@/StkTable';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const columns = [
    { type: 'tree-node', dataIndex: 'name', title: 'Name', width: '200px' },
    { dataIndex: 'id', title: 'ID', width: '100px' },
] as any;

/** 手动可控的 Promise，便于断言“加载中/settle 后”两个时机 */
function deferred<T = any>() {
    let resolve!: (v: T) => void;
    let reject!: (e: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

/** 让异步链跑完（组件内部含 rAF/setTimeout 等宏任务，需多轮宏任务 + 渲染 tick） */
async function flush() {
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 0));
        await nextTick();
    }
}

/** 行对象会被写入 __T_EXP__ 等私有状态，每次 mount 需使用全新数据 */
function createLazyRoots() {
    return [
        { id: 'p1', name: 'p1', hasChildren: true },
        { id: 'leaf', name: 'leaf', hasChildren: false },
    ];
}

function makeLoadMethod(childrenMap: Record<string, any[]>) {
    return vi.fn((row: any) => Promise.resolve((childrenMap[row.id] || []).map(it => ({ ...it }))));
}

function mountTable(treeConfig: any, dataSource: any[]) {
    return mount(StkTable as any, {
        props: { rowKey: 'id', columns, dataSource, treeConfig },
    });
}

type Wrapper = ReturnType<typeof mountTable>;

function clickArrow(wrapper: Wrapper, rowId: string) {
    const row = (wrapper.vm as any).getTableData().find((it: any) => it.id === rowId);
    const rowIndex = (wrapper.vm as any).getRowIndex(row);
    const tr = wrapper.findAll('tbody tr')[rowIndex];
    const icon = tr.find('.stk-fold-icon');
    expect(icon.exists(), `row ${rowId} 应存在展开箭头`).toBe(true);
    icon.trigger('click');
}

const vm = (wrapper: Wrapper) => wrapper.vm as any;

describe('tree lazy load', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('可展开标志判定（isExpandable）', () => {
        test('lazy 下未加载但 hasChildren=true 显示箭头，叶子节点不显示', async () => {
            const wrapper = mountTable({ lazy: true, loadMethod: makeLoadMethod({ p1: [{ id: 'c1', name: 'c1' }] }) }, createLazyRoots());
            const rows = wrapper.findAll('tbody tr');
            // p1：hasChildren=true 未加载 → 有箭头
            expect(rows[0].find('.stk-fold-icon').exists()).toBe(true);
            // leaf：hasChildren=false → 无箭头
            expect(rows[1].find('.stk-fold-icon').exists()).toBe(false);
        });

        test('lazy=false 时 hasChildren 不生效，仅 children 存在才显示箭头', async () => {
            const wrapper = mountTable({}, createLazyRoots());
            const rows = wrapper.findAll('tbody tr');
            expect(rows[0].find('.stk-fold-icon').exists()).toBe(false);
            expect(rows[1].find('.stk-fold-icon').exists()).toBe(false);
        });
    });

    describe('展开触发取数与缓存', () => {
        test('展开未加载分支 → resolve 后子行紧随父行展示', async () => {
            const d = deferred<any[]>();
            const loadMethod = vi.fn(() => d.promise);
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            clickArrow(wrapper, 'p1');
            await flush();
            // resolve 前子行不出现
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'leaf']);

            d.resolve([{ id: 'c1', name: 'c1' }, { id: 'c2', name: 'c2' }]);
            await flush();
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'c2', 'leaf']);
        });

        test('收起再展开不重复调用 loadMethod', async () => {
            const loadMethod = makeLoadMethod({ p1: [{ id: 'c1', name: 'c1' }] });
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            clickArrow(wrapper, 'p1');
            await flush();
            expect(loadMethod).toHaveBeenCalledTimes(1);

            clickArrow(wrapper, 'p1'); // 收起
            await flush();
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'leaf']);

            clickArrow(wrapper, 'p1'); // 再展开，走缓存
            await flush();
            expect(loadMethod).toHaveBeenCalledTimes(1);
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'leaf']);
        });

        test('加载中重复点击不二次触发', async () => {
            const d = deferred<any[]>();
            const loadMethod = vi.fn(() => d.promise);
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            // 同一 tick 内连点两次（re-render 前箭头仍可点），竞态防护应复用进行中请求
            const icon = wrapper.findAll('tbody tr')[0].find('.stk-fold-icon');
            icon.trigger('click');
            icon.trigger('click');
            await flush();
            expect(loadMethod).toHaveBeenCalledTimes(1);

            d.resolve([{ id: 'c1', name: 'c1' }]);
            await flush();
            expect(loadMethod).toHaveBeenCalledTimes(1);
            // 展开意图在加载完成后生效
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'leaf']);
        });
    });

    describe('失败处理', () => {
        test('reject 保持折叠、可重试、调用 onLoadError', async () => {
            const err = new Error('network');
            let fail = true;
            const onLoadError = vi.fn();
            const loadMethod = vi.fn((row: any) => {
                if (fail) return Promise.reject(err);
                return Promise.resolve([{ id: 'c1', name: 'c1' }]);
            });
            const wrapper = mountTable({ lazy: true, loadMethod, onLoadError }, createLazyRoots());

            clickArrow(wrapper, 'p1');
            await flush();
            expect(onLoadError).toHaveBeenCalledWith(err, expect.objectContaining({ id: 'p1' }), expect.objectContaining({ type: 'tree-node' }));
            const row = vm(wrapper).getTableData().find((it: any) => it.id === 'p1');
            // 保持折叠、未标记已加载、加载态已清除
            expect(Boolean(row.__T_EXP__)).toBe(false);
            expect(Boolean(row.__T_LOADED__)).toBe(false);
            expect(Boolean(row.__T_LOADING__)).toBe(false);

            // 下次展开重试成功
            fail = false;
            clickArrow(wrapper, 'p1');
            await flush();
            expect(loadMethod).toHaveBeenCalledTimes(2);
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'leaf']);
        });
    });

    describe('加载态 UI', () => {
        test('加载中整行带 is-tree-loading 类与 loading 图标，settle 后消失', async () => {
            const d = deferred<any[]>();
            const loadMethod = vi.fn(() => d.promise);
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            clickArrow(wrapper, 'p1');
            await flush();
            const tr0 = wrapper.findAll('tbody tr')[0];
            expect(tr0.classes()).toContain('is-tree-loading');
            expect(tr0.find('.stk-tree-loading-icon').exists()).toBe(true);
            expect(tr0.find('.stk-fold-icon').exists()).toBe(false);

            d.resolve([{ id: 'c1', name: 'c1' }]);
            await flush();
            const loadedTr = wrapper.findAll('tbody tr')[0];
            expect(loadedTr.classes()).not.toContain('is-tree-loading');
            expect(loadedTr.find('.stk-tree-loading-icon').exists()).toBe(false);
            expect(loadedTr.find('.stk-fold-icon').exists()).toBe(true);
        });
    });

    describe('批量展开约束', () => {
        test('lazy 下 setTreeExpand all 遇未加载分支即停，不触发 loadMethod', async () => {
            const loadMethod = makeLoadMethod({
                p1: [{ id: 'c1', name: 'c1', hasChildren: true }],
                // c1 的子节点故意不提供：all 展开遇 c1 即停
            });
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            // 先加载 p1 一层
            clickArrow(wrapper, 'p1');
            await flush();
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'leaf']);
            loadMethod.mockClear();

            vm(wrapper).setTreeExpand('p1', { expand: true, all: true });
            await flush();
            // c1 标记可展开但子节点未加载：展开停止，MUST NOT 触发链式请求
            expect(loadMethod).not.toHaveBeenCalled();
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'leaf']);
        });

        test('defaultExpandAll 遇未加载分支即停（首次渲染不发请求）', async () => {
            const loadMethod = makeLoadMethod({});
            const wrapper = mountTable({ lazy: true, loadMethod, defaultExpandAll: true }, createLazyRoots());
            await flush();
            expect(loadMethod).not.toHaveBeenCalled();
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'leaf']);
        });
    });

    describe('parents 链式加载', () => {
        test('parents 链式加载祖先使深层目标行可见', async () => {
            const loadMethod = makeLoadMethod({
                p1: [{ id: 'c1', name: 'c1', hasChildren: true }],
                c1: [{ id: 'g1', name: 'g1' }],
            });
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            await vm(wrapper).setTreeExpand('g1', { parents: true });
            await flush();
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'g1', 'leaf']);
        });

        test('某祖先加载失败在该处中断并告警', async () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const loadMethod = vi.fn((row: any) => {
                if (row.id === 'p1') return Promise.resolve([{ id: 'c1', name: 'c1', hasChildren: true }]);
                return Promise.reject(new Error('boom'));
            });
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            await vm(wrapper).setTreeExpand('g1', { parents: true });
            await flush();
            expect(warnSpy).toHaveBeenCalledWith('treeExpandRow failed.rowKey:', 'g1');
            // 链式加载：先加载 p1→c1（成功），再尝试加载 c1 以继续寻路（失败），共 2 次
            expect(loadMethod).toHaveBeenCalledTimes(2);
            // 祖先 c1 加载失败→目标未定位，不发生任何展开
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'leaf']);
            warnSpy.mockRestore();
        });
    });

    describe('reloadTreeNode', () => {
        test('对已展开节点 reload 用新结果替换子树', async () => {
            let version = 1;
            const loadMethod = vi.fn((row: any) => {
                if (row.id !== 'p1') return Promise.resolve([{ id: 'g1', name: 'g1' }]);
                return Promise.resolve([{ id: `c${version}`, name: `c${version}`, hasChildren: true }, { id: 'keep', name: 'keep' }]);
            });
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            // 展开 p1 → c1/keep；展开 c1 → g1
            clickArrow(wrapper, 'p1');
            await flush();
            clickArrow(wrapper, 'c1');
            await flush();
            version = 2;

            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'g1', 'keep', 'leaf']);

            await vm(wrapper).reloadTreeNode('p1');
            await flush();
            // 子树被新数据替换，旧 c1 及其后代 g1 被移除；p1 保持展开
            expect(loadMethod).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }), null);
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c2', 'keep', 'leaf']);
        });

        test('对折叠节点 reload 仅更新数据不强制展开', async () => {
            const loadMethod = makeLoadMethod({ p1: [{ id: 'c1', name: 'c1' }] });
            const wrapper = mountTable({ lazy: true, loadMethod }, createLazyRoots());

            await vm(wrapper).reloadTreeNode('p1');
            await flush();
            expect(loadMethod).toHaveBeenCalledTimes(1);
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'leaf']);
            // 已缓存：之后点击展开直接展示
            clickArrow(wrapper, 'p1');
            await flush();
            expect(loadMethod).toHaveBeenCalledTimes(1);
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['p1', 'c1', 'leaf']);
        });
    });

    describe('向后兼容', () => {
        test('lazy=false 既有全量 children 树形行为不变', async () => {
            const dataSource = [
                {
                    id: 'r1',
                    name: 'r1',
                    children: [
                        { id: 'r1-1', name: 'r1-1' },
                        { id: 'r1-2', name: 'r1-2', hasChildren: true },
                    ],
                },
            ];
            const wrapper = mountTable({}, dataSource);
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['r1']);
            clickArrow(wrapper, 'r1');
            await flush();
            expect(vm(wrapper).getTableData().map((it: any) => it.id)).toEqual(['r1', 'r1-1', 'r1-2']);
            // hasChildren 在非 lazy 下不显示箭头
            const tr = wrapper.findAll('tbody tr')[2];
            expect(tr.find('.stk-fold-icon').exists()).toBe(false);
        });
    });
});
