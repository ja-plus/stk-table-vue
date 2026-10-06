<script lang="ts" setup>
import { computed, nextTick, ref, toRaw, useTemplateRef } from 'vue';
import { useData } from 'vitepress';
import ContextMenu from 'ja-contextmenu';
import { MenuOption } from 'ja-contextmenu/lib/types/MenuOption';
import StkTable from '../../StkTable.vue';
import { useI18n } from '../../hooks/useI18n/index';
import type { StkTableColumn } from '@/StkTable/types/index';
import NameCell from './NameCell.vue';
import type { FileTreeNode } from './fileTreeData';
import {
    canPaste,
    clipboard,
    copy,
    createNode,
    cut,
    isFolder,
    paste,
    registerExpand,
    registerHighlight,
    registerReveal,
    removeNode,
    startEdit,
    startRename,
    treeData,
} from './fileTreeStore';

import 'ja-contextmenu/styles/dark.css';

const { t } = useI18n();
const { isDark } = useData();

/** demo 里用到的 StkTable 实例方法（expose） */
type FileTreeTableInstance = {
    setTreeExpand: (
        row: FileTreeNode | FileTreeNode[],
        option: { expand: boolean; all?: boolean },
    ) => void;
    setCurrentRow: (row: FileTreeNode) => void;
    setHighlightDimRow: (rowKeys: string[]) => void;
    getRowIndex: (row: FileTreeNode) => number;
    scrollTo: (options: { top: { index: number } }) => void;
};

const tableARef = useTemplateRef<FileTreeTableInstance>('tableARef');

/**
 * 行唯一键：按行对象身份生成稳定 id（不往数据里塞字段）。
 * 表格默认用行对象自身作 key，但 setHighlightDimRow 只收 key，这里自己发一份。
 *
 * 注意 toRaw 归一化：ref() 会把存入树里的对象包一层 reactive 代理，表格渲染的是
 * 代理对象，而 store 的局部变量持有的是裸对象——不归一化两者会拿到不同的 key。
 */
const rowKeyMap = new WeakMap<FileTreeNode, string>();
let rowKeySeq = 0;
function rowKey(row: FileTreeNode): string {
    const raw = toRaw(row) as FileTreeNode;
    let key = rowKeyMap.get(raw);
    if (!key) rowKeyMap.set(raw, (key = `node-${++rowKeySeq}`));
    return key;
}

/** 单列：名称列整格自绘（图标 + 行内重命名输入框），整格可拖拽 */
const folderColumns: StkTableColumn<FileTreeNode>[] = [
    { type: 'tree-node', title: t('fileName'), dataIndex: 'name', customCell: NameCell },
];

/** 默认只展开第一层目录（不使用 defaultExpandAll） */
const treeConfig = { showGuide: true, defaultExpandLevel: 1 };

/**
 * 登记各行展开态：defaultExpandLevel 已展开第一层，先登记根目录；
 * 之后内置箭头切换经 toggle-tree-expand 回写，单击行切换时在此取反。
 */
const expandedRows = new Set<FileTreeNode>();
for (const root of treeData.value) {
    if (isFolder(root)) expandedRows.add(root);
}

/** 剪切中的行置灰，参考 VSCode */
const cutRow = computed(() => (clipboard.value?.mode === 'cut' ? clipboard.value.row : null));
const rowClassName = (row: FileTreeNode) => (row === cutRow.value ? 'file-tree-row--cut' : '');

/** 展开 / 折叠一行：setTreeExpand 重建表内展平结果 */
function setExpand(row: FileTreeNode, expand: boolean) {
    if (expand) expandedRows.add(row);
    else expandedRows.delete(row);
    tableARef.value?.setTreeExpand(row, { expand });
}

/** 单击行（未命中展开控件时）切换展开，参考资源管理器 */
function onCellClick(e: MouseEvent, row: FileTreeNode) {
    // 行内重命名输入框上的点击不触发展开
    if ((e.target as HTMLElement)?.closest('input')) return;
    if (!isFolder(row)) return;
    setExpand(row, !expandedRows.has(row));
}

/** 内置箭头切换后回写展开态 */
function onToggleTreeExpand({ expanded, row }: { expanded: boolean; row: FileTreeNode }) {
    if (expanded) expandedRows.add(row);
    else expandedRows.delete(row);
}

/** 收集树中全部目录节点（含嵌套），用于展开 / 收起全部 */
function collectFolders(list: FileTreeNode[], acc: FileTreeNode[] = []): FileTreeNode[] {
    for (const node of list) {
        if (isFolder(node)) {
            acc.push(node);
            collectFolders(node.children!, acc);
        }
    }
    return acc;
}

/** 展开全部 / 收起全部（性能测试用）：一次性对根节点递归展开/收起整棵树 */
const allExpanded = ref(false);
function toggleExpandAll() {
    const expand = !allExpanded.value;
    allExpanded.value = expand;
    // setTreeExpand 为静默模式，不触发 toggle-tree-expand，这里手动同步 demo 自身维护的展开态
    for (const folder of collectFolders(treeData.value)) {
        if (expand) expandedRows.add(folder);
        else expandedRows.delete(folder);
    }
    tableARef.value?.setTreeExpand(treeData.value.filter(isFolder), { expand, all: true });
}

/**
 * 展开目标目录并滚动可见，供 store 的新建 / 粘贴 / 拖拽移入回调。
 * 单元格组件拿不到表格实例，需要展开 / 揭示时经此回调转交。
 */
registerReveal((expandRow: FileTreeNode, scrollToRow?: FileTreeNode) => {
    nextTick(() => {
        setExpand(expandRow, true);
        const row = scrollToRow ?? expandRow;
        const index = tableARef.value?.getRowIndex(row) ?? -1;
        if (index >= 0) tableARef.value?.scrollTo({ top: { index } });
    });
});

/** 悬浮超过 1s 自动展开（拖动中） */
registerExpand((row: FileTreeNode, expand: boolean) => setExpand(row, expand));

/** 粘贴后高亮落盘的那一行（背景闪烁） */
/** 粘贴后高亮落盘的那一行（背景闪烁） */
registerHighlight((row: FileTreeNode) => {
    // 等揭示（展开目标目录）引发的重渲染落地后再高亮，否则行可能还没进 DOM
    nextTick(() => {
        nextTick(() => tableARef.value?.setHighlightDimRow([rowKey(row)]));
    });
});

// ============ 右键菜单（ja-contextmenu，参考 VSCode 资源管理器） ============
const contextMenu = new ContextMenu({
    theme: () => (isDark.value ? 'dark' : ('' as any)),
});
const menuOption: MenuOption<FileTreeNode> = {
    items: [
        {
            label: () => t('fileMenuNewFile'),
            show: row => isFolder(row),
            onclick: (_e, row) => onCreate(row, 'file'),
        },
        {
            label: () => t('fileMenuNewFolder'),
            show: row => isFolder(row),
            onclick: (_e, row) => onCreate(row, 'folder'),
        },
        { type: 'hr', show: row => isFolder(row) },
        { label: () => t('fileMenuCut'), onclick: (_e, row) => cut(row) },
        { label: () => t('fileMenuCopy'), onclick: (_e, row) => copy(row) },
        {
            label: () => t('fileMenuPaste'),
            // 常驻显示：任意行都可作粘贴落点——文件夹行粘进该文件夹，文件行粘进它所在的目录；
            // 仅剪贴板为空、或剪切源已在目标目录内时置灰
            disabled: row => !canPaste(row),
            onclick: (_e, row) => paste(row),
        },
        { type: 'hr' },
        { label: () => t('fileMenuRename'), onclick: (_e, row) => startRename(row) },
        { type: 'hr' },
        { label: () => t('fileMenuDelete'), onclick: (_e, row) => removeNode(row) },
    ],
};
const menu = contextMenu.create(menuOption);

/** 右键菜单：选中该行后弹出 */
function onRowMenu(e: MouseEvent, row: FileTreeNode) {
    tableARef.value?.setCurrentRow(row);
    menu.show(e, row);
}

/** 新建文件 / 文件夹：插入到排序位，展开、滚动可见，并直接进入行内重命名 */
function onCreate(parent: FileTreeNode | undefined, kind: 'file' | 'folder') {
    if (!parent) return;
    const defaultName = kind === 'folder' ? t('fileNewFolderDefault') : t('fileNewFileDefault');
    const node = createNode(parent, kind, defaultName);
    if (!node) return;
    nextTick(() => startEdit(node, true));
}
</script>

<template>
    <p class="demo-tip">{{ t('fileTreeTip') }}</p>
    <div class="demo-toolbar">
        <button type="button" class="demo-btn" @click="toggleExpandAll">
            {{ allExpanded ? t('fileTreeCollapseAll') : t('fileTreeExpandAll') }}
        </button>
    </div>
    <h3>StkTableVue</h3>
    <StkTable
        ref="tableARef"
        virtual
        headless
        bordered="v"
        :row-active="{
            revokable: false
        }"
        :style="{ maxHeight: '600px', '--tree-indent-width': '20px' }"
        :tree-config="treeConfig"
        :row-key="rowKey"
        :columns="folderColumns"
        :data-source="treeData"
        :row-class-name="rowClassName"
        @row-menu="onRowMenu"
        @cell-click="onCellClick"
        @toggle-tree-expand="onToggleTreeExpand"
    ></StkTable>
</template>

<style scoped>
.stk-table {
    --cell-padding-x: 0;
    --cell-padding-y: 0;
}
.demo-tip {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--vp-c-text-2, #888);
}
.demo-toolbar {
    display: flex;
    gap: 8px;
    margin: 0 0 8px;
}
.demo-btn {
    padding: 4px 12px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--vp-c-text-1, #333);
    cursor: pointer;
    background: var(--vp-c-bg-soft, #f6f6f6);
    border: 1px solid var(--vp-c-divider, #e0e0e0);
    border-radius: 6px;
}
.demo-btn:hover {
    color: var(--vp-c-brand-1, #3451b2);
    border-color: var(--vp-c-brand-1, #3451b2);
}
/* 悬浮行显示手型光标 */
.stk-table :deep(tbody tr) {
    cursor: pointer;
}
/* 剪切中的行：参考 VSCode 置灰 */
.file-tree-row--cut {
    opacity: 0.5;
}
</style>
