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

/**
 * 行内重命名 / 新建输入框状态：row 为正在编辑的行，isNew 表示这是新建且未提交的行，
 * table 记录是在哪张表触发的（两张表各有一份编辑态，不会同时出现两个输入框）。
 */
export const editing = ref<{ row: FileTreeNode; isNew: boolean; table: 'A' | 'B' } | null>(null);

/** 剪切 / 复制剪贴板 */
export const clipboard = ref<{ mode: 'cut' | 'copy'; row: FileTreeNode } | null>(null);

/**
 * 正在拖拽的行。整个名称格都是拖拽热区与放置目标（不用内置 dragRow 把手列），
 * 由单元格自己派发原生拖拽事件，源行记录在这里供落点判断使用。
 */
export const draggingRow = ref<FileTreeNode | null>(null);

/** 拖拽悬浮的目标文件夹：悬浮期间高亮它自身与所有后代行，放下 / 离开后清除 */
export const dropTargetFolder = ref<FileTreeNode | null>(null);

/** 数据引用换新，触发 StkTable 的 dataSource watch 重新展平 */
export function bump() {
    treeData.value = treeData.value.slice();
}

export function isFolder(row?: FileTreeNode | null): boolean {
    return Array.isArray(row?.children);
}

/** 按名称字符串排序（资源管理器默认排序）：文件夹优先，同类内按名称 localeCompare */
function sortByName(list?: FileTreeNode[]) {
    list?.sort((a, b) => {
        if (isFolder(a) !== isFolder(b)) return isFolder(a) ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

/** 节点所在的容器：父级的 children，根层为 treeData.value */
function containerOf(node: FileTreeNode): FileTreeNode[] {
    const parent = findParent(node);
    return parent ? parent.children! : treeData.value;
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

/**
 * 落点是否合法：只能跨文件夹拖动。
 * - 落到自己身上、或把文件夹落进自己的子孙：不合法；
 * - into：目标文件夹不能是源行当前的父级（同文件夹内不调整顺序）；
 * - before / after：目标行的父级不能是源行当前的父级。
 */
export function canDrop(source: FileTreeNode, target: FileTreeNode, position: 'into' | 'before' | 'after'): boolean {
    if (source === target) return false;
    if (isDescendant(source, target)) return false;
    if (position === 'into') {
        if (!isFolder(target)) return false;
        return findParent(source) !== target;
    }
    return findParent(target) !== findParent(source);
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

/** index.vue 注册的展开 / 折叠回调（悬浮自动展开用） */
let expandRowFn: ((row: FileTreeNode, expand: boolean) => void) | null = null;
export function registerExpand(fn: (row: FileTreeNode, expand: boolean) => void) {
    expandRowFn = fn;
}

/** 展开 / 折叠一行（单元格内触发，经 index.vue 转到表格实例） */
export function expandRow(row: FileTreeNode, expand: boolean) {
    expandRowFn?.(row, expand);
}

/** 进入行内编辑；isNew 为 true 时取消编辑会删除该行（新建未提交） */
export function startEdit(row: FileTreeNode, isNew = false, table: 'A' | 'B' = 'A') {
    editing.value = { row, isNew, table };
}

/** 右键「重命名」 */
export function startRename(row: FileTreeNode, table: 'A' | 'B' = 'A') {
    startEdit(row, false, table);
}

/**
 * 新建文件 / 文件夹（参考 VSCode）：插入后按名称排序，并返回新节点，
 * 由调用方展开目录、滚动可见并进入行内重命名。
 */
export function createNode(parent: FileTreeNode, kind: 'file' | 'folder', defaultName: string): FileTreeNode | null {
    if (!isFolder(parent)) return null;
    const children = (parent.children ||= []);
    // 新文件夹必须带 children 数组，否则表格不认为它可展开（isExpandable 的口径是 children 是否存在）
    const node: FileTreeNode = { name: uniqueName(children, defaultName) };
    if (kind === 'folder') node.children = [];
    children.push(node);
    sortByName(children);
    bump();
    // 目标目录可能是折叠的：展开并滚动到新行，保证输入框可见
    revealRow?.(parent, node);
    return node;
}

/** 提交行内编辑：空名视为取消；与同级同名则阻止提交（保持编辑态）；改名后按名称重排 */
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
    sortByName(siblings);
    bump();
}

/** 取消行内编辑：新建未提交的行直接删除，重命名则保持原值 */
export function cancelEdit() {
    const current = editing.value;
    editing.value = null;
    if (current?.isNew) removeNode(current.row);
}

/** 删除节点（文件夹连带其子树） */
export function removeNode(row?: FileTreeNode) {
    if (!row) return;
    const parent = findParent(row);
    const list = parent ? parent.children! : treeData.value;
    const index = list.indexOf(row);
    if (index > -1) list.splice(index, 1);
    if (clipboard.value?.row === row) clipboard.value = null;
    bump();
}

export function cut(row?: FileTreeNode) {
    if (!row) return;
    clipboard.value = { mode: 'cut', row };
}

export function copy(row?: FileTreeNode) {
    if (!row) return;
    clipboard.value = { mode: 'copy', row };
}

/** 粘贴到目标文件夹：剪切为移动，复制为深拷贝（名字加 copy）；落盘后按名称重排 */
/**
 * 目标行能否作为粘贴落点：
 * - 剪贴板为空 → 不可以；
 * - 复制 → 任意行都可以（文件夹行粘进该文件夹，文件行粘进它所在的目录）；
 * - 剪切 → 还不能粘进源行当前所在的目录（同目录内不调整顺序），
 *   也不能把文件夹粘进自己的子孙。
 */
export function canPaste(target: FileTreeNode): boolean {
    const clip = clipboard.value;
    if (!clip) return false;
    const destFolder = isFolder(target) ? target : findParent(target);
    if (clip.mode === 'copy') return true;
    if (findParent(clip.row) === destFolder) return false;
    if (destFolder && (clip.row === destFolder || isDescendant(clip.row, destFolder))) return false;
    return true;
}

/** 粘贴到目标行：文件夹行粘进该文件夹，文件行粘进它所在的目录（根层文件则粘到根） */
export function paste(target: FileTreeNode) {
    if (!canPaste(target)) return;
    const clip = clipboard.value!;
    const destFolder = isFolder(target) ? target : findParent(target);
    const container = destFolder ? (destFolder.children ||= []) : treeData.value;

    if (clip.mode === 'cut') {
        const source = clip.row;
        // 从原容器取出，放进目标容器末尾
        const fromList = containerOf(source);
        const fromIndex = fromList.indexOf(source);
        if (fromIndex > -1) fromList.splice(fromIndex, 1);
        container.push(source);
        sortByName(fromList);
        sortByName(container);
        clipboard.value = null;
    } else {
        const node = cloneNode(clip.row);
        node.name = uniqueName(container, copyName(node.name));
        container.push(node);
        sortByName(container);
    }
    bump();
    // 目标是文件夹时才需要展开揭示；粘到根层无需操作
    if (destFolder) revealRow?.(destFolder);
}

/**
 * 移动节点（拖动行 / 剪切粘贴共用）：
 * - into：移入目标文件夹；
 * - before / after：插入到目标行之前 / 之后，与目标同级。
 * 只能跨文件夹移动（同文件夹内位置由排序决定），落盘后按名称重排。
 */
export function moveNode(source: FileTreeNode, target: FileTreeNode, how: 'into' | 'before' | 'after') {
    if (!canDrop(source, target, how)) return;
    // 先从原位置取出，再按目标位置插入（取出的 index 在取出后计算，避免同表移动时下标偏移）
    const fromList = containerOf(source);
    const fromIndex = fromList.indexOf(source);
    if (fromIndex > -1) fromList.splice(fromIndex, 1);
    if (how === 'into') {
        (target.children ||= []).push(source);
    } else {
        const toList = containerOf(target);
        const index = toList.indexOf(target);
        const at = index < 0 ? toList.length : how === 'after' ? index + 1 : index;
        toList.splice(at, 0, source);
    }
    // 位置只由排序决定：源与目标容器都重排
    sortByName(fromList);
    sortByName(containerOf(source));
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
    dropTargetFolder.value = null;
    if (!source || !canDrop(source, target, position)) return;
    moveNode(source, target, position);
    if (position === 'into') revealRow?.(target);
}
