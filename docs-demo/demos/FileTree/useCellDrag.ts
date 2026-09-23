import { ref } from 'vue';
import type { FileTreeNode } from './fileTreeData';
import { draggingRow, dropOn, isFolder } from './fileTreeStore';

/**
 * 单元格级拖拽：整个名称格既是拖拽热区也是放置目标，不使用内置 dragRow 把手列。
 *
 * - dragstart 时把源行记入 draggingRow；
 * - dragover 时阻止默认行为（否则不触发 drop），并按目标行类型与指针位置计算落点：
 *   文件夹行 → into（移入），文件行 → 指针在上半区插到前、下半区插到后；
 * - drop 时按落点移动节点。
 */
export function useCellDrag(row: () => FileTreeNode) {
    /** 当前格子的落点提示：into 高亮整格，before / after 画插入线 */
    const dropPos = ref<'into' | 'before' | 'after' | null>(null);

    function onDragStart(e: DragEvent) {
        draggingRow.value = row();
        // 部分浏览器必须 setData 才会真正进入拖拽
        e.dataTransfer?.setData('text/plain', 'file-tree');
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    }

    function onDragEnd() {
        draggingRow.value = null;
        dropPos.value = null;
    }

    function onDragOver(e: DragEvent) {
        const source = draggingRow.value;
        // 没有拖拽 / 拖到自己身上：不阻止默认，即不可放置
        if (!source || source === row()) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        if (isFolder(row())) {
            dropPos.value = 'into';
        } else {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            dropPos.value = e.clientY - rect.top > rect.height / 2 ? 'after' : 'before';
        }
    }

    function onDragLeave(e: DragEvent) {
        // 移到格子内的子元素（图标 / 文本）不算离开
        if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
        dropPos.value = null;
    }

    function onDrop(e: DragEvent) {
        // 阻止冒泡：表体 tbody 上也挂着 drop 委托（内置拖拽用），这里自行处理
        e.preventDefault();
        e.stopPropagation();
        const pos = dropPos.value;
        dropPos.value = null;
        if (pos) dropOn(row(), pos);
    }

    return { dropPos, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop };
}
