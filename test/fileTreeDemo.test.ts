/**
 * @vitest-environment happy-dom
 *
 * 文件管理树 demo 的运行时冒烟：挂载整个 demo 组件，验证单列 + 无头渲染、
 * 默认展开层级、单击行展开、右键菜单（ja-contextmenu）、行内重命名、新建、
 * 剪切 / 粘贴，以及整格拖拽移动。
 */
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// demo 内使用了 vitepress 的 useData（语言 / 暗色），单测里打桩
vi.mock('vitepress', () => ({
    useData: () => ({ lang: { value: 'zh' }, isDark: { value: false } }),
}));

import FileTreeDemo from '../docs-demo/demos/FileTree/index.vue';
import { clipboard, draggingRow, editing, treeData } from '../docs-demo/demos/FileTree/fileTreeStore';
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
    document.body.innerHTML = '';
});

function allNames(): string[] {
    const walk = (list: FileTreeNode[]): string[] =>
        list.flatMap(it => (it.children ? [it.name, ...walk(it.children)] : [it.name]));
    return walk(treeData.value);
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

/** 把 fromText 行拖到 toText 行上；文件行需指定落在上半区还是下半区 */
async function dragRowOnto(wrapper: any, fromText: string, toText: string, position: 'into' | 'before' | 'after') {
    const from = cellRoot(wrapper, 0, fromText);
    const to = cellRoot(wrapper, 0, toText);
    await fireDrag(from.element, 'dragstart');
    expect(draggingRow.value?.name).toBe(fromText);
    if (position !== 'into') {
        await fireDrag(to.element, 'dragover', { clientY: position === 'after' ? 20 : 8, cellHeight: 28 });
        expect(to.classes()).toContain(`file-tree__name--${position}`);
    } else {
        await fireDrag(to.element, 'dragover', { cellHeight: 28 });
        expect(to.classes()).toContain('file-tree__name--into');
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
    test('单列 + headless：无表头、只有名称列', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const tables = wrapper.findAll('.stk-table');
        expect(tables.length).toBe(2);
        for (const table of tables) {
            expect(table.find('thead').exists()).toBe(false); // headless 隐藏头部
            const headerCells = table.findAll('tbody tr')[0].findAll('td');
            expect(headerCells.length).toBe(1); // 只有名称一列
        }
        // 不再有内置拖拽把手列
        expect(wrapper.findAll('.drag-row-handle').length).toBe(0);
    });

    test('整格可拖拽：单元格根元素带 draggable', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const cell = cellRoot(wrapper, 0, 'README.md');
        expect(cell.attributes('draggable')).toBe('true');
        const tagCell = cellRoot(wrapper, 1, 'README.md');
        expect(tagCell.attributes('draggable')).toBe('true');
    });

    test('默认只展开第一层（defaultExpandLevel: 1）', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        const visible = wrapper.findAll('.stk-table')[0].findAll('tbody tr').map((tr: any) => tr.text());
        const text = visible.join('|');
        expect(text).toContain('src');
        expect(text).toContain('StkTable'); // 第一层子节点可见
        expect(text).not.toContain('components'); // 第二层不可见
        expect(text).not.toContain('SortIcon.vue');
    });

    test('单击文件夹行展开 / 折叠，且两张表同步', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        let text = wrapper.findAll('.stk-table')[0].findAll('tbody tr').map((tr: any) => tr.text()).join('|');
        expect(text).toContain('components');
        // 第二张表同步展开
        text = wrapper.findAll('.stk-table')[1].findAll('tbody tr').map((tr: any) => tr.text()).join('|');
        expect(text).toContain('components');
        // 再点一次折叠
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

        // 文件行：新建文件 / 新建文件夹 / 粘贴均不显示
        const tr = rowOf(wrapper, 0, 'README.md');
        await tr.trigger('contextmenu');
        const menuEl2 = document.querySelector('.ja-contextmenu') as HTMLElement;
        const newFileItem2 = Array.from(menuEl2.querySelectorAll('li')).find(li => li.textContent?.trim() === '新建文件');
        expect((newFileItem2 as HTMLElement).style.display).toBe('none');
    });

    test('右键重命名：输入框在格子内，Enter 提交', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'README.md', '重命名');
        const inputs = wrapper.findAll('input.file-tree__rename-input');
        expect(inputs.length).toBe(1); // 只有第一张表渲染输入框
        await inputs[0].setValue('README.vue');
        await inputs[0].trigger('keydown.enter');
        await flush();
        expect(allNames()).toContain('README.vue');
        expect(allNames()).not.toContain('README.md');
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
        expect(allNames()).toContain('README.md');
        expect(wrapper.findAll('input.file-tree__rename-input').length).toBe(0);
    });

    test('右键文件夹新建文件：追加到末尾并直接进入行内重命名', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'docs-demo', '新建文件');
        const inputs = wrapper.findAll('input.file-tree__rename-input');
        expect(inputs.length).toBe(1);
        const node = treeData.value.find(it => it.name === 'docs-demo')!;
        expect(node.children?.map(it => it.name)).toEqual(['basic', 'advanced', '新建文件']);
        // 提交后落盘
        await inputs[0].setValue('a.vue');
        await inputs[0].trigger('keydown.enter');
        await flush();
        expect(node.children?.map(it => it.name)).toEqual(['basic', 'advanced', 'a.vue']);
    });

    test('剪切后行置灰，粘贴到文件夹为移动', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'README.md', '剪切');
        expect(clipboard.value?.mode).toBe('cut');
        const cutTr = rowOf(wrapper, 0, 'README.md');
        expect(cutTr.classes()).toContain('file-tree-row--cut');
        await clickMenuItem(wrapper, 0, 'docs-demo', '粘贴');
        const docsDemo = treeData.value.find(it => it.name === 'docs-demo')!;
        expect(docsDemo.children?.map(it => it.name)).toEqual(['basic', 'advanced', 'README.md']);
        expect(clipboard.value).toBeNull();
        // 根层已无该文件
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json']);
    });

    test('整格拖拽：拖到文件夹行上移入该文件夹', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await dragRowOnto(wrapper, 'README.md', 'docs-demo', 'into');
        const docsDemo = treeData.value.find(it => it.name === 'docs-demo')!;
        expect(docsDemo.children?.map(it => it.name)).toEqual(['basic', 'advanced', 'README.md']);
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json']);
    });

    test('整格拖拽：拖到文件行上，向下插到其后、向上插到其前', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        // 向下拖（package.json 在 README.md 之前）：插入到目标行之后
        await dragRowOnto(wrapper, 'package.json', 'README.md', 'after');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'README.md', 'package.json']);
        // 向上拖（package.json 在 README.md 之后）：插入到目标行之前
        await dragRowOnto(wrapper, 'package.json', 'README.md', 'before');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
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
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json']);
        expect(treeData.value.find(it => it.name === 'docs-demo')!.children?.map(it => it.name)).toEqual([
            'basic',
            'advanced',
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
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
        expect(draggingRow.value).toBeNull();
    });

    test('整格拖拽：阻止把文件夹拖到自己的子孙行上', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        // 先展开 src，让 StkTable.vue 可见
        await cellOf(wrapper, 0, 'StkTable').trigger('click');
        await flush();
        await dragRowOnto(wrapper, 'src', 'StkTable.vue', 'after');
        // src 仍在根层，结构未变
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
    });

    test('右键删除文件与文件夹', async () => {
        const wrapper = mount(FileTreeDemo);
        await flush();
        await clickMenuItem(wrapper, 0, 'README.md', '删除');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json']);
        await clickMenuItem(wrapper, 0, 'docs-demo', '删除');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'package.json']);
    });
});
