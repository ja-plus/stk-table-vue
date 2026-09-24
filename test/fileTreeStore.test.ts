/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
    bump,
    cancelEdit,
    canDrop,
    canPaste,
    clipboard,
    commitEdit,
    copy,
    createNode,
    cut,
    draggingRow,
    dropOn,
    dropTargetFolder,
    editing,
    expandRow,
    findParent,
    isDescendant,
    isFolder,
    moveNode,
    paste,
    registerExpand,
    registerReveal,
    removeNode,
    startEdit,
    startRename,
    treeData,
} from '../docs-demo/demos/FileTree/fileTreeStore';
import { fileTreeData } from '../docs-demo/demos/FileTree/fileTreeData';
import type { FileTreeNode } from '../docs-demo/demos/FileTree/fileTreeData';

/** 模块级状态是单例，每例前用一份全新的数据重置 */
beforeEach(() => {
    treeData.value = JSON.parse(JSON.stringify(fileTreeData));
    editing.value = null;
    clipboard.value = null;
    draggingRow.value = null;
    dropTargetFolder.value = null;
});

/** 按名称找节点（demo 数据内名称唯一） */
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

/** 根层名称顺序（初始数据即按名称字符串排序） */
function rootNames(): string[] {
    return treeData.value.map(it => it.name);
}

describe('fileTreeStore 查询', () => {
    test('isFolder / findParent / isDescendant', () => {
        expect(isFolder(byName('src'))).toBe(true);
        expect(isFolder(byName('README.md'))).toBe(false);
        expect(findParent(byName('StkTable.vue'))?.name).toBe('StkTable');
        expect(findParent(byName('src'))).toBeNull();
        expect(isDescendant(byName('src'), byName('StkTable.vue'))).toBe(true);
        expect(isDescendant(byName('StkTable'), byName('src'))).toBe(false);
    });

    test('初始数据按文件夹优先 + 名称排序', () => {
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json', 'README.md']);
        expect(byName('StkTable').children?.map(it => it.name)).toEqual(['components', 'index.ts', 'StkTable.vue']);
    });
});

describe('fileTreeStore 排序', () => {
    test('改名后按名称自动重排', () => {
        const row = byName('components');
        startRename(row);
        commitEdit(row, 'zzz');
        expect(byName('StkTable').children?.map(it => it.name)).toEqual(['zzz', 'index.ts', 'StkTable.vue']);
    });

    test('新建后按名称插入到排序位', () => {
        const parent = byName('StkTable');
        const node = createNode(parent, 'file', 'aaa.ts')!;
        expect(node.name).toBe('aaa.ts');
        expect(parent.children?.map(it => it.name)).toEqual(['components', 'aaa.ts', 'index.ts', 'StkTable.vue']);
    });

    test('新建同名去重后同样参与排序', () => {
        const parent = byName('StkTable');
        createNode(parent, 'file', 'index.ts');
        expect(parent.children?.map(it => it.name)).toEqual(['components', 'index.ts', 'index.ts 1', 'StkTable.vue']);
    });

    test('文件夹优先于文件，同类内按名称排序', () => {
        const parent = byName('StkTable');
        // 名称靠后的文件夹依旧排在所有文件之前
        createNode(parent, 'folder', 'zzz');
        expect(parent.children?.map(it => it.name)).toEqual(['components', 'zzz', 'index.ts', 'StkTable.vue']);
        // 根层同理：docs-demo、src 在 package.json、README.md 之前
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json', 'README.md']);
    });

    test('移动后源容器与目标容器都重排', () => {
        moveNode(byName('README.md'), byName('docs-demo'), 'into');
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json']);
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['advanced', 'basic', 'README.md']);
    });

    test('粘贴后目标容器重排', () => {
        copy(byName('README.md'));
        paste(byName('docs-demo'));
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['advanced', 'basic', 'README copy.md']);
    });
});

describe('fileTreeStore 只能跨文件夹拖动', () => {
    test('同文件夹内 before / after 不合法', () => {
        // package.json 与 README.md 同在根层
        expect(canDrop(byName('package.json'), byName('README.md'), 'before')).toBe(false);
        expect(canDrop(byName('package.json'), byName('README.md'), 'after')).toBe(false);
    });

    test('移入自己当前的父级不合法', () => {
        expect(canDrop(byName('StkTable.vue'), byName('StkTable'), 'into')).toBe(false);
    });

    test('跨文件夹 before / after / into 合法', () => {
        expect(canDrop(byName('README.md'), byName('index.ts'), 'before')).toBe(true);
        expect(canDrop(byName('README.md'), byName('index.ts'), 'after')).toBe(true);
        expect(canDrop(byName('README.md'), byName('docs-demo'), 'into')).toBe(true);
    });

    test('落到自己身上、落进自己的子孙、into 非文件夹均不合法', () => {
        expect(canDrop(byName('src'), byName('src'), 'into')).toBe(false);
        expect(canDrop(byName('src'), byName('StkTable.vue'), 'after')).toBe(false);
        expect(canDrop(byName('src'), byName('StkTable'), 'into')).toBe(false);
        expect(canDrop(byName('README.md'), byName('package.json'), 'into')).toBe(false);
    });

    test('同文件夹内拖动不产生任何变化', () => {
        draggingRow.value = byName('package.json');
        dropOn(byName('README.md'), 'after');
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json', 'README.md']);
        expect(draggingRow.value).toBeNull();
        expect(dropTargetFolder.value).toBeNull();
    });

    test('跨文件夹拖动：插到目标行两侧 / 移入文件夹', () => {
        draggingRow.value = byName('README.md');
        dropOn(byName('index.ts'), 'before');
        expect(byName('StkTable').children?.map(it => it.name)).toEqual(['components', 'index.ts', 'README.md', 'StkTable.vue']);
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json']);

        draggingRow.value = byName('package.json');
        dropOn(byName('docs-demo'), 'into');
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['advanced', 'basic', 'package.json']);
        expect(rootNames()).toEqual(['docs-demo', 'src']);
    });

    test('moveNode 对非法落点直接返回', () => {
        moveNode(byName('package.json'), byName('README.md'), 'after');
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json', 'README.md']);
        moveNode(byName('src'), byName('StkTable'), 'into');
        expect(findParent(byName('src'))).toBeNull();
    });
});

describe('fileTreeStore 新建 / 重命名 / 删除', () => {
    test('新建文件追加并去重，新建文件夹带 children', () => {
        const parent = byName('StkTable');
        const folder = createNode(parent, 'folder', '新建文件夹')!;
        expect(isFolder(folder)).toBe(true);
        expect(folder.children).toEqual([]);
        expect(createNode(parent, 'folder', '新建文件夹')!.name).toBe('新建文件夹 1');
    });

    test('对文件行新建返回 null', () => {
        expect(createNode(byName('README.md'), 'file', 'x')).toBeNull();
    });

    test('新建后触发揭示回调（展开目录并滚动到新行）', () => {
        const reveal = vi.fn();
        registerReveal(reveal);
        const parent = byName('docs-demo');
        const node = createNode(parent, 'file', '新建文件')!;
        expect(reveal).toHaveBeenCalledWith(parent, node);
    });

    test('提交后改名；空名视为取消', () => {
        const row = byName('README.md');
        startRename(row);
        expect(editing.value).toEqual({ row, isNew: false, table: 'A' });
        commitEdit(row, ' README.vue ');
        expect(row.name).toBe('README.vue');
        expect(editing.value).toBeNull();

        const row2 = byName('package.json');
        startRename(row2);
        commitEdit(row2, '   ');
        expect(row2.name).toBe('package.json');
        expect(editing.value).toBeNull();
    });

    test('与同级同名则阻止提交，保持编辑态', () => {
        const row = byName('StkTable.vue');
        startRename(row);
        commitEdit(row, 'index.ts');
        expect(row.name).toBe('StkTable.vue');
        expect(editing.value?.row).toBe(row);
    });

    test('取消重命名保持原值；取消新建则删除该行', () => {
        const renamed = byName('README.md');
        startRename(renamed);
        cancelEdit();
        expect(renamed.name).toBe('README.md');

        const parent = byName('docs-demo');
        const node = createNode(parent, 'file', '新建文件')!;
        startEdit(node, true);
        cancelEdit();
        expect(parent.children?.map(it => it.name)).toEqual(['advanced', 'basic']);
    });

    test('删除文件与文件夹（连带子树），并清空相关剪贴板', () => {
        cut(byName('README.md'));
        removeNode(byName('SortIcon.vue'));
        expect(byName('components').children?.map(it => it.name)).toEqual(['TreeFoldIcon.vue', 'TreeIndent.vue']);
        removeNode(byName('docs-demo'));
        expect(rootNames()).toEqual(['src', 'package.json', 'README.md']);
        removeNode(byName('README.md'));
        expect(clipboard.value).toBeNull();
    });
});

describe('fileTreeStore 剪切 / 复制 / 粘贴', () => {
    test('剪切后粘贴为移动，并清空剪贴板', () => {
        cut(byName('README.md'));
        paste(byName('docs-demo'));
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['advanced', 'basic', 'README.md']);
        expect(clipboard.value).toBeNull();
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json']);
    });

    test('复制后粘贴为深拷贝，名称加 copy，改副本不影响原件', () => {
        copy(byName('StkTable'));
        paste(byName('docs-demo'));
        const pasted = byName('StkTable copy');
        expect(isFolder(pasted)).toBe(true);
        expect(pasted.children?.map(it => it.name)).toEqual(['components', 'index.ts', 'StkTable.vue']);
        pasted.children![1].name = 'changed.vue';
        expect(byName('StkTable.vue').name).toBe('StkTable.vue');
        // 剪贴板保留，可再次粘贴（名称去重 + 排序）
        paste(byName('docs-demo'));
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual([
            'StkTable copy',
            'StkTable copy 1',
            'advanced',
            'basic',
        ]);
    });

    test('同名文件复制粘贴时 copy 后缀加在扩展名之前', () => {
        copy(byName('README.md'));
        paste(byName('docs-demo'));
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['advanced', 'basic', 'README copy.md']);
    });

    test('阻止把文件夹粘进自己的子孙，剪贴板保留', () => {
        cut(byName('src'));
        paste(byName('StkTable'));
        expect(findParent(byName('src'))).toBeNull();
        expect(clipboard.value?.mode).toBe('cut');
    });

    test('canPaste：空剪贴板不可用；复制后任意行可用', () => {
        expect(canPaste(byName('docs-demo'))).toBe(false);
        expect(canPaste(byName('package.json'))).toBe(false);
        copy(byName('README.md'));
        expect(canPaste(byName('docs-demo'))).toBe(true);
        expect(canPaste(byName('package.json'))).toBe(true);
    });

    test('canPaste：剪切后粘到源行所在目录内置灰', () => {
        cut(byName('package.json'));
        // package.json 在根层：右键根层任意行都算同一目录
        expect(canPaste(byName('README.md'))).toBe(false);
        expect(canPaste(byName('src'))).toBe(true);
        // StkTable.vue 在 StkTable 内：右键同目录行置灰，跨目录可用
        cut(byName('StkTable.vue'));
        expect(canPaste(byName('index.ts'))).toBe(false);
        expect(canPaste(byName('docs-demo'))).toBe(true);
        // 不能把文件夹粘进自己的子孙
        cut(byName('src'));
        expect(canPaste(byName('StkTable.vue'))).toBe(false);
        expect(canPaste(byName('StkTable'))).toBe(false);
    });

    test('右键文件行粘贴：粘到该文件所在的目录', () => {
        copy(byName('README.md'));
        // 右键 StkTable 内的 index.ts → 粘进 StkTable
        paste(byName('index.ts'));
        expect(byName('StkTable').children?.map(it => it.name)).toEqual(['components', 'index.ts', 'README copy.md', 'StkTable.vue']);
        // 右键根层的 package.json → 粘到根
        copy(byName('README.md'));
        paste(byName('package.json'));
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json', 'README copy.md', 'README.md']);
    });

    test('剪切后右键文件行：跨目录时粘到该文件所在目录', () => {
        cut(byName('README.md'));
        // 根层 → StkTable 内（右键 index.ts）
        paste(byName('index.ts'));
        expect(byName('StkTable').children?.map(it => it.name)).toEqual(['components', 'index.ts', 'README.md', 'StkTable.vue']);
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json']);
        expect(clipboard.value).toBeNull();
    });

    test('剪切后右键同目录文件行：不产生变化', () => {
        cut(byName('package.json'));
        paste(byName('README.md'));
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json', 'README.md']);
        expect(clipboard.value?.mode).toBe('cut');
    });
});

describe('fileTreeStore 拖拽状态与展开回调', () => {
    test('dropOn 落点为文件夹时触发揭示回调', () => {
        const reveal = vi.fn();
        registerReveal(reveal);
        draggingRow.value = byName('README.md');
        dropOn(byName('docs-demo'), 'into');
        expect(reveal).toHaveBeenCalledWith(byName('docs-demo'));
    });

    test('expandRow 经注册的回转展开 / 折叠', () => {
        const expand = vi.fn();
        registerExpand(expand);
        expandRow(byName('StkTable'), true);
        expect(expand).toHaveBeenCalledWith(byName('StkTable'), true);
    });

    test('没有拖拽源 / 落点是自己时不动', () => {
        dropOn(byName('docs-demo'), 'into');
        expect(rootNames()).toEqual(['docs-demo', 'src', 'package.json', 'README.md']);
        draggingRow.value = byName('docs-demo');
        dropOn(byName('docs-demo'), 'into');
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['advanced', 'basic']);
    });
});

describe('fileTreeStore bump', () => {
    test('bump 更换数据引用，供 StkTable 重新展平树', () => {
        const before = treeData.value;
        bump();
        expect(treeData.value).not.toBe(before);
        expect(rootNames()).toEqual(before.map(it => it.name));
    });
});
