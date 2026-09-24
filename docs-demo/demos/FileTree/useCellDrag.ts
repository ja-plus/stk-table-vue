import { computed, ref } from 'vue';
import type { FileTreeNode } from './fileTreeData';
import {
    canDrop,
    dropOn,
    dropTargetFolder,
    draggingRow,
    expandRow,
    isDescendant,
    isFolder,
} from './fileTreeStore';

/** 悬浮在未展开的文件夹上多久自动展开（参考 VSCode） */
const HOVER_EXPAND_DELAY = 500;

/** 悬浮自动展开的定时器：只在同一个文件夹上连续悬浮才计时，换行 / 离开即取消 */
let hoverTimer: ReturnType<typeof setTimeout> | null = null;
let hoveredRow: FileTreeNode | null = null;

function clearHoverTimer() {
    if (hoverTimer !== null) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
    }
    hoveredRow = null;
}

/**
 * 单元格级拖拽：整个名称格既是拖拽热区也是放置目标，不使用内置 dragRow 把手列。
 *
 * - dragstart 时把源行记入 draggingRow；
 * - dragover 时阻止默认行为（否则不触发 drop），并按目标行类型与指针位置计算落点：
 *   文件夹行 → into（移入），文件行 → 指针在上半区插到前、下半区插到后；
 *   只能跨文件夹拖动（同文件夹内位置由排序决定），非法落点不给任何提示；
 *   悬浮在未展开的文件夹上超过 1s 自动展开；
 *   落点为文件夹时经 dropTargetFolder 高亮它自身与所有后代行的背景；
 * - drop 时按落点移动节点。
 */
export function useCellDrag(row: () => FileTreeNode, isExpanded: () => boolean) {
    /** 当前格子的插入线提示（仅文件行落点） */
    const dropPos = ref<'before' | 'after' | null>(null);

    /** 本行是否属于当前悬浮目标文件夹的子树（含文件夹自身）——高亮由所有格子共享 */
    const inDropSubtree = computed(() => {
        const folder = dropTargetFolder.value;
        return !!folder && (row() === folder || isDescendant(folder, row()));
    });

    /** 本行是否就是当前悬浮的目标文件夹（子树高亮中它的背景再深一档） */
    const isDropTarget = computed(() => dropTargetFolder.value === row());

    /** 按指针位置计算落点：文件夹行移入，文件行插到上 / 下半区对应的一侧 */
    function calcPosition(el: HTMLElement, clientY: number): 'into' | 'before' | 'after' {
        const target = row();
        if (isFolder(target)) return 'into';
        const rect = el.getBoundingClientRect();
        return clientY - rect.top > rect.height / 2 ? 'after' : 'before';
    }

    function onDragStart(e: DragEvent) {
        draggingRow.value = row();
        // 部分浏览器必须 setData 才会真正进入拖拽
        e.dataTransfer?.setData('text/plain', 'file-tree');
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    }

    function onDragEnd() {
        draggingRow.value = null;
        dropTargetFolder.value = null;
        dropPos.value = null;
        clearHoverTimer();
    }

    function onDragOver(e: DragEvent) {
        const source = draggingRow.value;
        // 没有拖拽 / 拖到自己身上：不阻止默认，即不可放置
        if (!source || source === row()) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

        const target = row();
        const position = calcPosition(e.currentTarget as HTMLElement, e.clientY);

        // 只能跨文件夹拖动：同文件夹内不给出落点提示
        if (!canDrop(source, target, position)) {
            dropPos.value = null;
            if (dropTargetFolder.value === target) dropTargetFolder.value = null;
            clearHoverTimer();
            return;
        }

        if (position === 'into') {
            dropPos.value = null;
            dropTargetFolder.value = target;
            // 悬浮在未展开的文件夹上：开始 / 续计 1s 自动展开
            if (isExpanded()) {
                clearHoverTimer();
            } else if (hoveredRow !== target) {
                clearHoverTimer();
                hoveredRow = target;
                hoverTimer = setTimeout(() => {
                    hoverTimer = null;
                    hoveredRow = null;
                    expandRow(target, true);
                }, HOVER_EXPAND_DELAY);
            }
        } else {
            dropPos.value = position;
            if (dropTargetFolder.value === target) dropTargetFolder.value = null;
            clearHoverTimer();
        }
    }

    function onDragLeave(e: DragEvent) {
        // 移到格子内的子元素（图标 / 文本）不算离开
        if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
        dropPos.value = null;
        clearHoverTimer();
        // 只有离开的是当前高亮的文件夹行时才取消子树高亮
        if (dropTargetFolder.value === row()) dropTargetFolder.value = null;
    }

    function onDrop(e: DragEvent) {
        // 阻止冒泡：表体 tbody 上也挂着 drop 委托（内置拖拽用），这里自行处理
        e.preventDefault();
        e.stopPropagation();
        const target = row();
        const position = calcPosition(e.currentTarget as HTMLElement, e.clientY);
        dropPos.value = null;
        dropTargetFolder.value = null;
        clearHoverTimer();
        dropOn(target, position);
    }

    return {
        dropPos,
        inDropSubtree,
        isDropTarget,
        onDragStart,
        onDragEnd,
        onDragOver,
        onDragLeave,
        onDrop,
    };
}
