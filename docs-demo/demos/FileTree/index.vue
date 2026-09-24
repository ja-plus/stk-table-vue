<script lang="ts" setup>
import { computed, nextTick, toRaw, useTemplateRef } from 'vue';
import { useData } from 'vitepress';
import ContextMenu from 'ja-contextmenu';
import { MenuOption } from 'ja-contextmenu/lib/types/MenuOption';
import { MenuItemOption } from 'ja-contextmenu/lib/types/MenuItemOption';
import StkTable from '../../StkTable.vue';
import { useI18n } from '../../hooks/useI18n/index';
import type { StkTableColumn } from '@/StkTable/types/index';
import NameCell from './NameCell.vue';
import TagNameCell from './TagNameCell.vue';
import type { FileTreeNode } from './fileTreeData';
import {
    bump,
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
    setTreeExpand: (row: FileTreeNode, option: { expand: boolean }) => void;
    setCurrentRow: (row: FileTreeNode) => void;
    setHighlightDimRow: (rowKeys: string[]) => void;
    getRowIndex: (row: FileTreeNode) => number;
    scrollTo: (options: { top: { index: number } }) => void;
};

const tableARef = useTemplateRef<FileTreeTableInstance>('tableARef');
const tableBRef = useTemplateRef<FileTreeTableInstance>('tableBRef');

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
/** 变体二：保留内置箭头与引导线，只给目录名加标签 */
const tagColumns: StkTableColumn<FileTreeNode>[] = [
    { type: 'tree-node', title: t('fileName'), dataIndex: 'name', customCell: TagNameCell },
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

/**
 * 展开 / 折叠并同步两张表：setTreeExpand 只重建当前表内的展平结果，
 * bump() 换新数据引用后另一张表会按各节点记住的展开态重新展平。
 */
function setExpand(row: FileTreeNode, expand: boolean, table: typeof tableARef.value) {
    if (expand) expandedRows.add(row);
    else expandedRows.delete(row);
    table?.setTreeExpand(row, { expand });
    bump();
}

/** 单击行（未命中展开控件时）切换展开，参考资源管理器 */
function onCellClick(e: MouseEvent, row: FileTreeNode, table: typeof tableARef.value) {
    // 行内重命名输入框上的点击不触发展开
    if ((e.target as HTMLElement)?.closest('input')) return;
    if (!isFolder(row)) return;
    setExpand(row, !expandedRows.has(row), table);
}
const onCellClickA = (e: MouseEvent, row: FileTreeNode) => onCellClick(e, row, tableARef.value);
const onCellClickB = (e: MouseEvent, row: FileTreeNode) => onCellClick(e, row, tableBRef.value);

/** 内置箭头切换后回开展开态，并同步另一张表 */
function onToggleTreeExpand({ expanded, row }: { expanded: boolean; row: FileTreeNode }) {
    if (expanded) expandedRows.add(row);
    else expandedRows.delete(row);
    bump();
}

/**
 * 展开目标目录并滚动可见，供 store 的新建 / 粘贴 / 拖拽移入回调。
 * 单元格组件拿不到表格实例，需要展开 / 揭示时经此回调转交。
 */
registerReveal((expandRow: FileTreeNode, scrollToRow?: FileTreeNode) => {
    nextTick(() => {
        setExpand(expandRow, true, tableARef.value);
        const row = scrollToRow ?? expandRow;
        const index = tableARef.value?.getRowIndex(row) ?? -1;
        if (index >= 0) tableARef.value?.scrollTo({ top: { index } });
    });
});

/** 悬浮超过 1s 自动展开（拖动中）：同样同步两张表 */
registerExpand((row: FileTreeNode, expand: boolean) => setExpand(row, expand, tableARef.value));

/** 粘贴后高亮落盘的那一行（背景闪烁） */
/** 粘贴后高亮落盘的那一行（背景闪烁） */
registerHighlight((row: FileTreeNode) => {
    // 等揭示（展开目标目录）引发的重渲染落地后再高亮，否则行可能还没进 DOM
    nextTick(() => {
        nextTick(() => tableARef.value?.setHighlightDimRow([rowKey(row)]));
    });
});

// ============ 右键菜单（ja-contextmenu，参考 VSCode 资源管理器） ============
/** 最近一次在哪张表上右键：菜单动作（重命名 / 新建）据此把编辑态落到对应表 */
let activeTable: 'A' | 'B' = 'A';

const contextMenu = new ContextMenu({
    theme: () => (isDark.value ? 'dark' : ('' as any)),
});
/**
 * ja-contextmenu 对 `type: 'hr'` 的分割线不处理 `show`（MenuItem.init 里直接 `h('li.divide')` 返回），
 * 靠 `show` 隐藏分割线无效。故每次 show 前按行类型重建 items：
 * Menu 持有的是本对象引用，且 show 时会重新 renderMenuItem，直接赋值即可。
 */
const menuOption: MenuOption<FileTreeNode> = { items: [] };

function buildMenuItems(row: FileTreeNode): MenuItemOption<FileTreeNode>[] {
    const items: MenuItemOption<FileTreeNode>[] = [];
    // 新建类只对文件夹行可见，连同上方的分割线一起按行生成
    if (isFolder(row)) {
        items.push(
            { label: () => t('fileMenuNewFile'), onclick: (_e, r) => onCreate(r, 'file') },
            { label: () => t('fileMenuNewFolder'), onclick: (_e, r) => onCreate(r, 'folder') },
            { type: 'hr' },
        );
    }
    items.push(
        { label: () => t('fileMenuCut'), onclick: (_e, r) => cut(r) },
        { label: () => t('fileMenuCopy'), onclick: (_e, r) => copy(r) },
        {
            label: () => t('fileMenuPaste'),
            // 常驻显示：任意行都可作粘贴落点——文件夹行粘进该文件夹，文件行粘进它所在的目录；
            // 仅剪贴板为空、或剪切源已在目标目录内时置灰
            disabled: r => !canPaste(r),
            onclick: (_e, r) => paste(r),
        },
        { type: 'hr' },
        { label: () => t('fileMenuRename'), onclick: (_e, r) => startRename(r, activeTable) },
        { type: 'hr' },
        { label: () => t('fileMenuDelete'), onclick: (_e, r) => removeNode(r) },
    );
    return items;
}
const menu = contextMenu.create(menuOption);

/** 两张表共用一套菜单：记录来源表，并选中该行 */
function onRowMenu(e: MouseEvent, row: FileTreeNode, table: 'A' | 'B') {
    activeTable = table;
    (table === 'A' ? tableARef.value : tableBRef.value)?.setCurrentRow(row);
    menuOption.items = buildMenuItems(row);
    menu.show(e, row);
}
const onRowMenuA = (e: MouseEvent, row: FileTreeNode) => onRowMenu(e, row, 'A');
const onRowMenuB = (e: MouseEvent, row: FileTreeNode) => onRowMenu(e, row, 'B');

/** 新建文件 / 文件夹：插入到排序位，展开、滚动可见，并直接进入行内重命名 */
function onCreate(parent: FileTreeNode | undefined, kind: 'file' | 'folder') {
    if (!parent) return;
    const defaultName = kind === 'folder' ? t('fileNewFolderDefault') : t('fileNewFileDefault');
    const node = createNode(parent, kind, defaultName);
    if (!node) return;
    nextTick(() => startEdit(node, true, activeTable));
}
</script>

<template>
    <p class="demo-tip">{{ t('fileTreeTip') }}</p>
    <p class="file-tree__title">{{ t('fileTreeSelfDrawn') }}</p>
    <StkTable
        ref="tableARef"
        headless
        bordered="v"
        :style="{ maxHeight: '260px', '--tree-indent-width': '20px' }"
        :tree-config="treeConfig"
        :row-key="rowKey"
        :columns="folderColumns"
        :data-source="treeData"
        :row-class-name="rowClassName"
        @row-menu="onRowMenuA"
        @cell-click="onCellClickA"
        @toggle-tree-expand="onToggleTreeExpand"
    ></StkTable>
    <p class="file-tree__title">{{ t('fileTreeSlotVariant') }}</p>
    <StkTable
        ref="tableBRef"
        headless
        bordered="v"
        style="max-height: 260px"
        :tree-config="treeConfig"
        :row-key="rowKey"
        :columns="tagColumns"
        :data-source="treeData"
        :row-class-name="rowClassName"
        @row-menu="onRowMenuB"
        @cell-click="onCellClickB"
        @toggle-tree-expand="onToggleTreeExpand"
    ></StkTable>
</template>

<style>
.demo-tip {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--vp-c-text-2, #888);
}
.file-tree__title {
    margin: 16px 0 4px;
    font-size: 13px;
}
/* 剪切中的行：参考 VSCode 置灰 */
.file-tree-row--cut {
    opacity: 0.5;
}
</style>
