/**
 * @vitest-environment happy-dom
 *
 * 文件管理树 demo 的运行时冒烟：挂载整个 demo 组件，验证单列 + 无头渲染、
 * 默认展开层级、单击行展开、右键菜单（ja-contextmenu）、行内重命名、新建、
 * 剪切 / 粘贴，以及整格拖拽（跨文件夹、悬浮 1s 自动展开、子树高亮）。
 */
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// demo 内使用了 vitepress 的 useData（语言 / 暗色），单测里打桩
vi.mock('vitepress', () => ({
    useData: () => ({ lang: { value: 'zh' }, isDark: { value: false } }),
}));

import FileTreeDemo from '../docs-demo/demos/FileTree/index.vue';
import { clipboard, draggingRow, dropTargetFolder, editing, treeData } from '../docs-demo/demos/FileTree/fileTreeStore';
import type { FileTreeNode } from '../docs-demo/demos/FileTree/fileTreeData';

async function flush() {
    for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 0));
        await Promise.resolve();
    }
}

beforeEach(async () => {
    // 重置 demo 的模块级状态（store 为单例）
    const { fileTreeData } = await import('../docs-demo/demos/FileTree/fileTreeData');
    treeData.value = JSON.parse(JSON.stringify(fileTreeData));
    editing.value = null;
    clipboard.value = null;
    draggingRow.value = null;
    dropTargetFolder.value = null;
    document.body.innerHTML = '';
});

function allNames(): string[] {
    const walk = (list: FileTreeNode[]): string[] =>
        list.flatMap(it => (it.children ? [it.name, ...walk(it.children)] : [it.name]));
    return walk(treeData.value);
}

function rootNames(): string[] {
    return treeData.value.map(it => it.name);
}

/** 按名称递归查找节点（demo 数据内名称唯一） */
function byName(name: string): FileTreeNode {
    const walk = (list: FileTreeNode[]): FileTreeNode | undefined => {
        for (const it of list) {
            if (it.name === name) return it;
            const found = it.children && walk(it.children);
            if (found) return found;
        }
    };
    const found = walk(treeData.value);
    if (!found) throw new Error(`node not found: ${name}`);
    return found;
}

/** 取指定表里名称包含 text 的行 */
function rowOf(wrapper: any, tableIndex: number, text: string) {
    return wrapper.findAll('.stk-table')[tableIndex].findAll('tbody tr').find((tr: any) => tr.text().includes(text));
}

/** 取指定表里名称包含 text 的行的自绘单元格根元素（拖拽事件挂在它上面） */
function cellRoot(wrapper: any, tableIndex: number, text: string) {
    const tr = rowOf(wrapper, tableIndex, text);
    expect(tr, `row "${text}" not found`).toBeTruthy();
    return tableIndex === 0 ? tr.find('.file-tree__name') : tr.find('.tag-tree-cell');
}

/** 取指定表里名称包含 text 的行中的 td（避开展开控件与输入框） */
function cellOf(wrapper: any, tableIndex: number, text: string) {
    const tr = rowOf(wrapper, tableIndex, text);
    return tr.findAll('td').find((td: any) => td.text().includes(text)) ?? tr.findAll('td')[1];
}

/** 在元素上派发带 dataTransfer / clientY 的拖拽事件 */
async function fireDrag(el: any, type: string, init: { clientY?: number; cellHeight?: number } = {}) {
    const e = new Event(type, { bubbles: true, cancelable: true }) as any;
    e.dataTransfer = { setData: () => {}, dropEffect: '', effectAllowed: '' };
    if (init.clientY !== undefined) e.clientY = init.clientY;
    if (init.cellHeight !== undefined) {
        // happy-dom 的 getBoundingClientRect 全是 0，按格子高度打桩以便计算上半 / 下半区
        el.getBoundingClientRect = () => ({ top: 0, height: init.cellHeight, left: 0, right: 100, bottom: init.cellHeight, width: 100 });
    }
    el.dispatchEvent(e);
    await flush();
    return e;
}

/**
 * 把 fromText 行拖到 toText 行上。
 * 文件夹行 → into；文件行需指定落在上半区（before）还是下半区（after）。
 */
async function dragRowOnto(wrapper: any, fromText: string, toText: string, position: 'into' | 'before' | 'after') {
    const from = cellRoot(wrapper, 0, fromText);
    const to = cellRoot(wrapper, 0, toText);
    await fireDrag(from.element, 'dragstart');
    expect(draggingRow.value?.name).toBe(fromText);
    if (position === 'into') {
        await fireDrag(to.element, 'dragover', { cellHeight: 28 });
    } else {
        await fireDrag(to.element, 'dragover', { clientY: position === 'after' ? 20 : 8, cellHeight: 28 });
    }
    await fireDrag(to.element, 'drop');
    await fireDrag(from.element, 'dragend');
    expect(draggingRow.value).toBeNull();
}

/** 打开右键菜单并点击指定菜单项；每次挂载都会生成一个菜单元素，取有菜单项的那个 */
async function clickMenuItem(wrapper: any, tableIndex: number, rowText: string, itemText: string) {
    const tr = rowOf(wrapper, tableIndex, rowText);
    expect(tr, `row "${rowText}" not found`).toBeTruthy();
    await tr.trigger('contextmenu');
    const menus = Array.from(document.querySelectorAll('.ja-contextmenu')) as HTMLElement[];
    const menuEl = menus.reverse().find(m => m.querySelectorAll('li').length > 0);
    expect(menuEl, 'context menu not shown').toBeTruthy();
    const item = Array.from(menuEl!.querySelectorAll('li')).find(li => li.textContent?.trim() === itemText);
    expect(item, `menu item "${itemText}" not found`).toBeTruthy();
    (item as HTMLElement).click();
    await flush();
    return menuEl!;
}

describe('文件管理树 demo', () => {
    test('单列 + headless：无表头、只有名称列、无内置拖拽把手', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const tables = wrapper.findAll('.stk-table');
        expect(tables.length).toBe(2);
        for (const table of tables) {
            expect(table.find('thead').exists()).toBe(false); // headless 隐藏头部
            expect(table.findAll('tbody tr')[0].findAll('td').length).toBe(1); // 只有名称一列
        }
        expect(wrapper.findAll('.drag-row-handle').length).toBe(0);
    });

    test('整格可拖拽：单元格根元素带 draggable', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        expect(cellRoot(wrapper, 0, 'README.md').attributes('draggable')).toBe('true');
        expect(cellRoot(wrapper, 1, 'README.md').attributes('draggable')).toBe('true');
    });

    test('默认只展开第一层（defaultExpandLevel: 1）', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const text = wrapper.findAll('.stk-table')[0].findAll('tbody tr').map((tr: any) => tr.text()).join('|');
        expect(text).toContain('src');
        expect(text).toContain('StkTable'); // 第一层子节点可见
        expect(text).not.toContain('components'); // 第二层不可见
        expect(text).not.toContain('SortIcon.vue');
    });

    test('初始即按名称字符串排序', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const names = wrapper.findAll('.stk-table')[0].findAll('tbody tr').map((tr: any) => tr.text().trim());
        // 根层：docs-demo < package.json < README.md < src；src 内：StkTable < style.less < VirtualTree.vue
        expect(names).toEqual([
            'docs-demo',
            'advanced',
            'basic',
            'package.json',
            'README.md',
            'src',
            'StkTable',
            'style.less',
            'VirtualTree.vue',
        ]);
    });

    test('单击文件夹行展开 / 折叠，且两张表同步', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        let text = wrapper.findAll('.stk-table')[0].findAll('tbody tr').map((tr: any) => tr.text()).join('|');
        expect(text).toContain('components');
        text = wrapper.findAll('.stk-table')[1].findAll('tbody tr').map((tr: any) => tr.text()).join('|');
        expect(text).toContain('components');
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        text = wrapper.findAll('.stk-table')[0].findAll('tbody tr').map((tr: any) => tr.text()).join('|');
        expect(text).not.toContain('components');
    });

    test('右键菜单：文件夹行有新建项，文件行没有', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const menuEl = await clickMenuItem(wrapper, 0, 'docs-demo', '复制');
        const newFileItem = Array.from(menuEl.querySelectorAll('li')).find(li => li.textContent?.trim() === '新建文件');
        expect((newFileItem as HTMLElement).style.display).toBe('');

        const tr = rowOf(wrapper, 0, 'README.md');
        await tr.trigger('contextmenu');
        const menuEl2 = document.querySelector('.ja-contextmenu') as HTMLElement;
        const newFileItem2 = Array.from(menuEl2.querySelectorAll('li')).find(li => li.textContent?.trim() === '新建文件');
        expect((newFileItem2 as HTMLElement).style.display).toBe('none');
    });

    test('右键重命名：输入框在格子内，Enter 提交后按名称重排', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'README.md', '重命名');
        const inputs = wrapper.findAll('input.file-tree__rename-input');
        expect(inputs.length).toBe(1); // 只有第一张表渲染输入框
        await inputs[0].setValue('aaa.md');
        await inputs[0].trigger('keydown.enter');
        await flush();
        // 改名为 aaa.md 后从最后一位排到最前
        expect(rootNames()).toEqual(['aaa.md', 'docs-demo', 'package.json', 'src']);
        expect(wrapper.findAll('input.file-tree__rename-input').length).toBe(0);
    });

    test('重命名按 Esc 取消，保持原值', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'README.md', '重命名');
        const input = wrapper.find('input.file-tree__rename-input');
        await input.setValue('whatever.md');
        await input.trigger('keydown.esc');
        await flush();
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'README.md', 'src']);
        expect(wrapper.findAll('input.file-tree__rename-input').length).toBe(0);
    });

    test('右键文件夹新建文件：按排序位插入并进入行内重命名', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        // StkTable 默认折叠，先展开
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        await clickMenuItem(wrapper, 0, 'StkTable', '新建文件');
        const inputs = wrapper.findAll('input.file-tree__rename-input');
        expect(inputs.length).toBe(1);
        // '新建文件' 按 localeCompare 排在最前（中文先于拉丁字母）
        expect(byName('StkTable').children?.map(it => it.name)).toEqual(['新建文件', 'components', 'index.ts', 'StkTable.vue']);
        await inputs[0].setValue('a.vue');
        await inputs[0].trigger('keydown.enter');
        await flush();
        expect(byName('StkTable').children?.map(it => it.name)).toEqual(['a.vue', 'components', 'index.ts', 'StkTable.vue']);
    });

    test('剪切后行置灰，粘贴到文件夹为移动并重排', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'README.md', '剪切');
        expect(clipboard.value?.mode).toBe('cut');
        expect(rowOf(wrapper, 0, 'README.md').classes()).toContain('file-tree-row--cut');
        await clickMenuItem(wrapper, 0, 'docs-demo', '粘贴');
        expect(treeData.value.find(it => it.name === 'docs-demo')!.children?.map(it => it.name)).toEqual([
            'advanced',
            'basic',
            'README.md',
        ]);
        expect(clipboard.value).toBeNull();
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'src']);
    });

    test('整格拖拽：拖到文件夹行上移入该文件夹', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await dragRowOnto(wrapper, 'package.json', 'docs-demo', 'into');
        expect(treeData.value.find(it => it.name === 'docs-demo')!.children?.map(it => it.name)).toEqual([
            'advanced',
            'basic',
            'package.json',
        ]);
        expect(rootNames()).toEqual(['docs-demo', 'README.md', 'src']);
    });

    test('整格拖拽：拖到文件行上跨文件夹插入，并按排序落位', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        // 展开 StkTable，让 index.ts 可见
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        // README.md（根层）→ StkTable 内的 index.ts 之前
        await dragRowOnto(wrapper, 'README.md', 'index.ts', 'before');
        expect(byName('StkTable').children?.map(it => it.name)).toEqual([
            'components',
            'index.ts',
            'README.md',
            'StkTable.vue',
        ]);
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'src']);
    });

    test('整格拖拽：同一文件夹内不能调整位置', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        // package.json 与 README.md 同在根层：拖动不产生变化，也没有落点提示
        const from = cellRoot(wrapper, 0, 'package.json');
        const to = cellRoot(wrapper, 0, 'README.md');
        await fireDrag(from.element, 'dragstart');
        await fireDrag(to.element, 'dragover', { clientY: 20, cellHeight: 28 });
        expect(to.classes()).not.toContain('file-tree__name--after');
        expect(to.classes()).not.toContain('file-tree__name--before');
        expect(dropTargetFolder.value).toBeNull();
        await fireDrag(to.element, 'drop');
        await fireDrag(from.element, 'dragend');
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'README.md', 'src']);

        // StkTable 内的 index.ts ↔ StkTable.vue 同在 StkTable 下，同样不能调整
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        await dragRowOnto(wrapper, 'index.ts', 'StkTable.vue', 'after');
        expect(byName('StkTable').children?.map(it => it.name)).toEqual([
            'components',
            'index.ts',
            'StkTable.vue',
        ]);
    });

    test('整格拖拽：悬浮到未展开的文件夹上超过 1s 自动展开', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const visible = () => wrapper.findAll('.stk-table')[0].findAll('tbody tr').map((tr: any) => tr.text()).join('|');
        expect(visible()).not.toContain('components'); // StkTable 默认折叠
        const from = cellRoot(wrapper, 0, 'README.md');
        const to = cellRoot(wrapper, 0, 'StkTable');
        await fireDrag(from.element, 'dragstart');
        await fireDrag(to.element, 'dragover', { cellHeight: 28 });
        expect(visible()).not.toContain('components'); // 1s 内不展开
        await new Promise(r => setTimeout(r, 1100));
        await flush();
        expect(visible()).toContain('components'); // 超过 1s 自动展开
        await fireDrag(from.element, 'dragend');
    });

    test('整格拖拽：悬浮到文件夹上高亮它所有行的背景，放下后消失', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        const from = cellRoot(wrapper, 0, 'README.md');
        const target = cellRoot(wrapper, 0, 'StkTable');
        await fireDrag(from.element, 'dragstart');
        await fireDrag(target.element, 'dragover', { cellHeight: 28 });
        // 文件夹行自身（深一档）+ 所有子行都高亮
        expect(target.classes()).toContain('file-tree__name--subtree');
        expect(target.classes()).toContain('file-tree__name--into');
        expect(cellRoot(wrapper, 0, 'components').classes()).toContain('file-tree__name--subtree');
        expect(cellRoot(wrapper, 0, 'index.ts').classes()).toContain('file-tree__name--subtree');
        expect(cellRoot(wrapper, 0, 'StkTable.vue').classes()).toContain('file-tree__name--subtree');
        // 其它文件夹的行不高亮
        expect(cellRoot(wrapper, 0, 'docs-demo').classes()).not.toContain('file-tree__name--subtree');
        // 第二张表同步高亮
        expect(cellRoot(wrapper, 1, 'index.ts').classes()).toContain('tag-tree-cell--subtree');
        // 放下后高亮消失
        await fireDrag(target.element, 'drop');
        expect(target.classes()).not.toContain('file-tree__name--subtree');
        expect(cellRoot(wrapper, 0, 'components').classes()).not.toContain('file-tree__name--subtree');
        expect(dropTargetFolder.value).toBeNull();
    });

    test('整格拖拽：拖到第二张表上同样生效（两张表共用数据）', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const from = cellRoot(wrapper, 0, 'README.md');
        const to = cellRoot(wrapper, 1, 'docs-demo');
        await fireDrag(from.element, 'dragstart');
        await fireDrag(to.element, 'dragover', { cellHeight: 28 });
        await fireDrag(to.element, 'drop');
        await fireDrag(from.element, 'dragend');
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'src']);
        expect(treeData.value.find(it => it.name === 'docs-demo')!.children?.map(it => it.name)).toEqual([
            'advanced',
            'basic',
            'README.md',
        ]);
    });

    test('整格拖拽：拖到自己身上不生效', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const cell = cellRoot(wrapper, 0, 'README.md');
        await fireDrag(cell.element, 'dragstart');
        await fireDrag(cell.element, 'dragover', { cellHeight: 28 });
        await fireDrag(cell.element, 'drop');
        await fireDrag(cell.element, 'dragend');
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'README.md', 'src']);
        expect(draggingRow.value).toBeNull();
    });

    test('整格拖拽：阻止把文件夹拖到自己的子孙行上', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        await dragRowOnto(wrapper, 'src', 'StkTable.vue', 'after');
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'README.md', 'src']);
        expect(findParentOf('src')).toBeNull();
    });

    test('右键删除文件与文件夹', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'README.md', '删除');
        expect(rootNames()).toEqual(['docs-demo', 'package.json', 'src']);
        await clickMenuItem(wrapper, 0, 'docs-demo', '删除');
        expect(rootNames()).toEqual(['package.json', 'src']);
    });
});

/** src 仍在根层（未被移进自己的子孙） */
function findParentOf(name: string): string | null {
    const walk = (list: FileTreeNode[]): string | null => {
        for (const it of list) {
            if (it.children?.some(c => c.name === name)) return it.name;
            const found = it.children && walk(it.children);
            if (found) return found;
        }
        return null;
    };
    return walk(treeData.value);
}
