import { ref } from 'vue';
import type { FileTreeNode } from './fileTreeData';
import { fileTreeData } from './fileTreeData';

/**
 * 文件管理树的状态与操作（demo 内的“文件管理器”模型层）。
 *
 * 所有改动都落在 treeData 上，改完调用 bump() 让 StkTable 依据新的数据引用重新展平树：
 * 各节点已记住的展开态会保留，新节点默认收起。
 */
export const treeData = ref<FileTreeNode[]>(fileTreeData);

/** 行内重命名 / 新建输入框状态：row 为正在编辑的行，isNew 表示这是新建且未提交的行 */
export const editing = ref<{ row: FileTreeNode; isNew: boolean } | null>(null);

/** 剪切 / 复制剪贴板 */
export const clipboard = ref<{ mode: 'cut' | 'copy'; row: FileTreeNode } | null>(null);

/**
 * 正在拖拽的行。整个名称格都是拖拽热区与放置目标（不用内置 dragRow 把手列），
 * 由单元格自己派发原生拖拽事件，源行记录在这里供落点判断使用。
 */
export const draggingRow = ref<FileTreeNode | null>(null);

/** 数据引用换新，触发 StkTable 的 dataSource watch 重新展平 */
export function bump() {
    treeData.value = treeData.value.slice();
}

export function isFolder(row?: FileTreeNode | null): boolean {
    return Array.isArray(row?.children);
}

/** 找节点的父节点；位于根层时返回 null */
export function findParent(node: FileTreeNode): FileTreeNode | null {
    const walk = (list: FileTreeNode[]): FileTreeNode | null => {
        for (const item of list) {
            if (item.children?.includes(node)) return item;
            const found = item.children && walk(item.children);
            if (found) return found;
        }
        return null;
    };
    return walk(treeData.value);
}

/** node 是否位于 ancestor 的子树中（用于阻止把文件夹拖进 / 粘进自己的子孙） */
export function isDescendant(ancestor: FileTreeNode, node: FileTreeNode): boolean {
    const walk = (list?: FileTreeNode[]): boolean => {
        if (!list) return false;
        for (const item of list) {
            if (item === node) return true;
            if (walk(item.children)) return true;
        }
        return false;
    };
    return walk(ancestor.children);
}

/** 同名去重：base 已存在时依次追加序号 */
function uniqueName(siblings: FileTreeNode[], base: string): string {
    if (!siblings.some(it => it.name === base)) return base;
    let i = 1;
    while (siblings.some(it => it.name === `${base} ${i}`)) i++;
    return `${base} ${i}`;
}

/** 深拷贝节点（只复制业务字段，不带上表格私有字段） */
function cloneNode(node: FileTreeNode): FileTreeNode {
    const copy: FileTreeNode = { name: node.name };
    if (node.children) copy.children = node.children.map(cloneNode);
    return copy;
}

/** 复制粘贴时的命名：参考 VSCode，主名后加 copy */
function copyName(name: string): string {
    const dot = name.lastIndexOf('.');
    return dot > 0 ? `${name.slice(0, dot)} copy${name.slice(dot)}` : `${name} copy`;
}

/**
 * index.vue 注册的“揭示”回调：展开目标目录（scrollToRow 可选，指定滚动到该行）。
 * 单元格（自定义单元格组件）拿不到表格实例，需要展开 / 揭示时经此回调转交。
 */
let revealRow: ((expandRow: FileTreeNode, scrollToRow?: FileTreeNode) => void) | null = null;
export function registerReveal(fn: (expandRow: FileTreeNode, scrollToRow?: FileTreeNode) => void) {
    revealRow = fn;
}

/** 进入行内编辑；isNew 为 true 时取消编辑会删除该行（新建未提交） */
export function startEdit(row: FileTreeNode, isNew = false) {
    editing.value = { row, isNew };
}

/** 右键「重命名」 */
export function startRename(row: FileTreeNode) {
    startEdit(row);
}

/**
 * 新建文件 / 文件夹（参考 VSCode）：追加到目录末尾并返回新节点，
 * 由调用方展开目录、滚动可见并进入行内重命名。
 */
export function createNode(parent: FileTreeNode, kind: 'file' | 'folder', defaultName: string): FileTreeNode | null {
    if (!isFolder(parent)) return null;
    const children = (parent.children ||= []);
    // 新文件夹必须带 children 数组，否则表格不认为它可展开（isExpandable 的口径是 children 是否存在）
    const node: FileTreeNode = { name: uniqueName(children, defaultName) };
    if (kind === 'folder') node.children = [];
    children.push(node);
    bump();
    // 目标目录可能是折叠的：展开并滚动到新行，保证输入框可见
    revealRow?.(parent, node);
    return node;
}

/** 提交行内编辑：空名视为取消；与同级同名则阻止提交（保持编辑态） */
export function commitEdit(row: FileTreeNode, name: string) {
    const current = editing.value;
    if (!current || current.row !== row) return;
    const trimmed = name.trim();
    if (!trimmed) {
        cancelEdit();
        return;
    }
    const siblings = findParent(row)?.children ?? treeData.value;
    if (siblings.some(it => it !== row && it.name === trimmed)) return;
    editing.value = null;
    row.name = trimmed;
    bump();
}

/** 取消行内编辑：新建未提交的行直接删除，重命名则保持原值 */
export function cancelEdit() {
    const current = editing.value;
    editing.value = null;
    if (current?.isNew) removeNode(current.row);
}

/** 删除节点（文件夹连带其子树） */
export function removeNode(row: FileTreeNode) {
    const parent = findParent(row);
    const list = parent ? parent.children! : treeData.value;
    const index = list.indexOf(row);
    if (index > -1) list.splice(index, 1);
    if (clipboard.value?.row === row) clipboard.value = null;
    bump();
}

export function cut(row: FileTreeNode) {
    clipboard.value = { mode: 'cut', row };
}

export function copy(row: FileTreeNode) {
    clipboard.value = { mode: 'copy', row };
}

/** 粘贴到目标文件夹：剪切为移动，复制为深拷贝（名字加 copy） */
export function paste(target: FileTreeNode) {
    const clip = clipboard.value;
    if (!clip || !isFolder(target)) return;
    const children = (target.children ||= []);
    if (clip.mode === 'cut') {
        if (clip.row === target || isDescendant(clip.row, target)) return;
        moveNode(clip.row, target, 'into');
        clipboard.value = null;
    } else {
        const node = cloneNode(clip.row);
        node.name = uniqueName(children, copyName(node.name));
        children.push(node);
        bump();
    }
    revealRow?.(target);
}

/**
 * 移动节点（拖动行 / 剪切粘贴共用）：
 * - into：移入目标文件夹末尾；
 * - before / after：插入到目标行之前 / 之后，与目标同级。
 * 阻止把文件夹移入自己的子孙。
 */
export function moveNode(source: FileTreeNode, target: FileTreeNode, how: 'into' | 'before' | 'after') {
    if (source === target) return;
    if (isDescendant(source, target)) return;
    // 先从原位置取出，再按目标位置插入（取出的 index 在取出后计算，避免同表移动时下标偏移）
    const fromParent = findParent(source);
    const fromList = fromParent ? fromParent.children! : treeData.value;
    const fromIndex = fromList.indexOf(source);
    if (fromIndex > -1) fromList.splice(fromIndex, 1);
    if (how === 'into') {
        (target.children ||= []).push(source);
    } else {
        const toParent = findParent(target);
        const toList = toParent ? toParent.children! : treeData.value;
        const index = toList.indexOf(target);
        const at = index < 0 ? toList.length : how === 'after' ? index + 1 : index;
        toList.splice(at, 0, source);
    }
    if (clipboard.value?.row === source) clipboard.value = null;
    bump();
}

/**
 * 拖拽落点：把 draggingRow 移动到 target 的 into / before / after 位置。
 * 落点为文件夹时移入其中并揭示（展开 + 滚动可见）。
 */
export function dropOn(target: FileTreeNode, position: 'into' | 'before' | 'after') {
    const source = draggingRow.value;
    draggingRow.value = null;
    if (!source || source === target) return;
    if (position === 'into' && !isFolder(target)) return;
    moveNode(source, target, position);
    if (position === 'into') revealRow?.(target);
}
