/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
    bump,
    cancelEdit,
    clipboard,
    commitEdit,
    copy,
    createNode,
    cut,
    draggingRow,
    dropOn,
    editing,
    findParent,
    isDescendant,
    isFolder,
    moveNode,
    paste,
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

describe('fileTreeStore 查询', () => {
    test('isFolder / findParent / isDescendant', () => {
        expect(isFolder(byName('src'))).toBe(true);
        expect(isFolder(byName('README.md'))).toBe(false);
        expect(findParent(byName('StkTable.vue'))?.name).toBe('StkTable');
        expect(findParent(byName('src'))).toBeNull();
        expect(isDescendant(byName('src'), byName('StkTable.vue'))).toBe(true);
        expect(isDescendant(byName('StkTable'), byName('src'))).toBe(false);
    });
});

describe('fileTreeStore 新建', () => {
    test('新建文件追加到目录末尾，名称同名去重', () => {
        const parent = byName('StkTable');
        const node = createNode(parent, 'file', 'index.ts');
        expect(node).not.toBeNull();
        expect(parent.children?.map(it => it.name)).toEqual(['components', 'StkTable.vue', 'index.ts', 'index.ts 1']);
    });

    test('新建文件夹带 children 数组（否则表格不认为可展开）', () => {
        const parent = byName('StkTable');
        const folder = createNode(parent, 'folder', '新建文件夹')!;
        expect(folder.name).toBe('新建文件夹');
        expect(isFolder(folder)).toBe(true);
        expect(folder.children).toEqual([]);
        // 再次新建同名会去重
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
});

describe('fileTreeStore 行内重命名', () => {
    test('提交后改名', () => {
        const row = byName('README.md');
        startRename(row);
        expect(editing.value).toEqual({ row, isNew: false });
        commitEdit(row, ' README.vue ');
        expect(row.name).toBe('README.vue');
        expect(editing.value).toBeNull();
    });

    test('空名视为取消，保持原值', () => {
        const row = byName('README.md');
        startRename(row);
        commitEdit(row, '   ');
        expect(row.name).toBe('README.md');
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
        expect(editing.value).toBeNull();

        const parent = byName('docs-demo');
        const node = createNode(parent, 'file', '新建文件')!;
        startEdit(node, true);
        cancelEdit();
        expect(parent.children?.map(it => it.name)).toEqual(['basic', 'advanced']);
    });
});

describe('fileTreeStore 删除', () => {
    test('删除文件与文件夹（连带子树）', () => {
        removeNode(byName('SortIcon.vue'));
        expect(byName('components').children?.map(it => it.name)).toEqual(['TreeFoldIcon.vue', 'TreeIndent.vue']);
        removeNode(byName('docs-demo'));
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'package.json', 'README.md']);
    });

    test('删除剪切中的行会清空剪贴板', () => {
        const row = byName('README.md');
        cut(row);
        removeNode(row);
        expect(clipboard.value).toBeNull();
    });
});

describe('fileTreeStore 移动', () => {
    test('移入文件夹末尾', () => {
        moveNode(byName('README.md'), byName('docs-demo'), 'into');
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['basic', 'advanced', 'README.md']);
        expect(findParent(byName('README.md'))?.name).toBe('docs-demo');
    });

    test('插入到目标文件之前 / 之后（同级）', () => {
        moveNode(byName('package.json'), byName('README.md'), 'before');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
        moveNode(byName('package.json'), byName('README.md'), 'after');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'README.md', 'package.json']);
    });

    test('同表内向前移动时下标不偏移', () => {
        moveNode(byName('README.md'), byName('package.json'), 'before');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'README.md', 'package.json']);
    });

    test('阻止把文件夹移入自己的子孙', () => {
        moveNode(byName('src'), byName('StkTable.vue'), 'before');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
        moveNode(byName('src'), byName('StkTable'), 'into');
        expect(findParent(byName('src'))).toBeNull();
    });
});

describe('fileTreeStore 剪切 / 复制 / 粘贴', () => {
    test('剪切后粘贴为移动，并清空剪贴板', () => {
        cut(byName('README.md'));
        paste(byName('docs-demo'));
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['basic', 'advanced', 'README.md']);
        expect(clipboard.value).toBeNull();
    });

    test('复制后粘贴为深拷贝，名称加 copy，改副本不影响原件', () => {
        copy(byName('StkTable'));
        paste(byName('docs-demo'));
        const pasted = byName('StkTable copy');
        expect(isFolder(pasted)).toBe(true);
        expect(pasted.children?.map(it => it.name)).toEqual(['components', 'StkTable.vue', 'index.ts']);
        pasted.children![1].name = 'changed.vue';
        expect(byName('StkTable.vue').name).toBe('StkTable.vue');
        // 剪贴板保留，可再次粘贴（名称去重）
        paste(byName('docs-demo'));
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual([
            'basic',
            'advanced',
            'StkTable copy',
            'StkTable copy 1',
        ]);
    });

    test('同名文件复制粘贴时 copy 后缀加在扩展名之前', () => {
        copy(byName('README.md'));
        paste(byName('docs-demo'));
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['basic', 'advanced', 'README copy.md']);
    });

    test('阻止把文件夹粘进自己的子孙', () => {
        cut(byName('src'));
        paste(byName('StkTable'));
        expect(findParent(byName('src'))).toBeNull();
        expect(clipboard.value?.mode).toBe('cut');
    });
});

describe('fileTreeStore 整格拖拽落点', () => {
    test('落点为文件夹：移入其中、清空拖拽源并揭示', () => {
        const reveal = vi.fn();
        registerReveal(reveal);
        draggingRow.value = byName('README.md');
        dropOn(byName('docs-demo'), 'into');
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['basic', 'advanced', 'README.md']);
        expect(draggingRow.value).toBeNull();
        expect(reveal).toHaveBeenCalledWith(byName('docs-demo'));
    });

    test('落点为文件：按 before / after 插入到目标两侧', () => {
        draggingRow.value = byName('package.json');
        dropOn(byName('README.md'), 'after');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'README.md', 'package.json']);
        draggingRow.value = byName('package.json');
        dropOn(byName('README.md'), 'before');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
    });

    test('阻止把文件夹拖到自己的子孙行上', () => {
        draggingRow.value = byName('src');
        dropOn(byName('StkTable.vue'), 'after');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
        expect(draggingRow.value).toBeNull();
    });

    test('没有拖拽源 / 落点是自己时不动', () => {
        dropOn(byName('docs-demo'), 'into');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'docs-demo', 'package.json', 'README.md']);
        draggingRow.value = byName('docs-demo');
        dropOn(byName('docs-demo'), 'into');
        expect(byName('docs-demo').children?.map(it => it.name)).toEqual(['basic', 'advanced']);
    });

    test('落点为文件夹却传 before / after 时按同级插入处理', () => {
        draggingRow.value = byName('package.json');
        dropOn(byName('docs-demo'), 'before');
        expect(treeData.value.map(it => it.name)).toEqual(['src', 'package.json', 'docs-demo', 'README.md']);
    });
});

describe('fileTreeStore bump', () => {
    test('bump 更换数据引用，供 StkTable 重新展平树', () => {
        const before = treeData.value;
        bump();
        expect(treeData.value).not.toBe(before);
        expect(treeData.value.map(it => it.name)).toEqual(before.map(it => it.name));
    });
});
