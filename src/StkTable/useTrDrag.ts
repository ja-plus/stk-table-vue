import { ShallowRef } from 'vue';

type Params = {
    dataSourceCopy: ShallowRef<any[]>;
};

/**
 * 拖拽行
 */
export function useTrDrag({ dataSourceCopy }: Params) {
    let trDragFlag = false;
    function onTrDragStart(e: DragEvent, rowIndex: number) {
        const target = e.target as HTMLElement;
        const tr = target?.closest('tr');
        if (tr) {
            e.dataTransfer?.setDragImage(tr, 0, 0);
            tr.style.opacity = '0.5';
        }
        const dt = e.dataTransfer;
        if (dt) {
            dt.effectAllowed = 'move';
            dt.setData('text/plain', rowIndex.toString());
        }
        trDragFlag = true;
    }

    function onTrDragOver(e: DragEvent) {
        if (!trDragFlag) return;
        e.preventDefault(); // 阻止默认行为，否则不会触发 drop 事件

        const dt = e.dataTransfer;
        if (dt) {
            dt.dropEffect = 'move';
        }
    }

    let oldTr: HTMLElement | null = null;
    function onTrDragEnter(e: DragEvent) {
        if (!trDragFlag) return;
        e.preventDefault();
        const target = e.target as HTMLElement;
        const tr = target.closest('tr');
        if (oldTr && oldTr !== tr) {
            // 两个tr不一样说明移动到了另一个tr中
            oldTr.style.removeProperty('background');
        }
        if (tr) {
            oldTr = tr;
            tr.style.background = 'var(--tr-hover-bgc)';
        }
    }

    function onTrDragEnd(e: DragEvent) {
        if (!trDragFlag) return;
        const target = e.target as HTMLElement;
        const tr = target.closest('tr');
        if (tr) {
            tr.style.opacity = '1';
        }
        if (oldTr) {
            oldTr.style.removeProperty('background');
            oldTr = null;
        }
        trDragFlag = false;
    }

    function onTrDrop(e: DragEvent, rowIndex: number) {
        if (!trDragFlag) return;

        const dt = e.dataTransfer;
        if (dt) {
            const sourceIndex = parseInt(dt.getData('text/plain'), 10);
            const endIndex = rowIndex;
            if (sourceIndex !== endIndex) {
                const temp = dataSourceCopy.value[sourceIndex];
                dataSourceCopy.value.splice(sourceIndex, 1);
                dataSourceCopy.value.splice(endIndex, 0, temp);
                dataSourceCopy.value = [...dataSourceCopy.value];
            }
        }
    }
    return {
        onTrDragStart,
        onTrDragOver,
        onTrDrop,
        onTrDragEnter,
        onTrDragEnd,
    };
}
