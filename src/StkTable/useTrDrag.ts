import { computed, ShallowRef } from 'vue';
import { DragRowConfig } from './types';

type Params = {
    props: any;
    emits: any;
    dataSourceCopy: ShallowRef<any[]>;
};

const TR_DRAGGING_CLASS = 'tr-dragging';
const TR_DRAG_OVER_CLASS = 'tr-dragging-over';
const DATA_TRANSFER_FORMAT = 'text/plain';

/**
 * 拖拽行
 * TODO: 不在虚拟滚动的情况下，从上面拖拽到下面，跨页的时候，滚动条会自适应位置。没有顶上去
 */
export function useTrDrag({ props, emits, dataSourceCopy }: Params) {
    let trDragFlag = false;

    const dragRowConfig = computed<DragRowConfig>(() => {
        return { mode: 'insert', ...props.dragRowConfig };
    });

    function getClosestTr(e: DragEvent) {
        const target = e.target as HTMLElement;
        const tr = target?.closest('tr');
        return tr;
    }

    function onTrDragStart(e: DragEvent, rowIndex: number) {
        const tr = getClosestTr(e);
        if (tr) {
            const trRect = tr.getBoundingClientRect();
            const x = e.clientX - (trRect.left ?? 0);
            e.dataTransfer?.setDragImage(tr, x, trRect.height / 2);
            tr.classList.add(TR_DRAGGING_CLASS);
        }
        const dt = e.dataTransfer;
        if (dt) {
            dt.effectAllowed = 'move';
            dt.setData(DATA_TRANSFER_FORMAT, String(rowIndex));
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
        const tr = getClosestTr(e);
        if (oldTr && oldTr !== tr) {
            // 两个tr不一样说明移动到了另一个tr中
            oldTr.classList.remove(TR_DRAG_OVER_CLASS);
        }
        if (tr) {
            oldTr = tr;
            tr.classList.add(TR_DRAG_OVER_CLASS);
        }
    }

    function onTrDragEnd(e: DragEvent) {
        if (!trDragFlag) return;
        const tr = getClosestTr(e);
        if (tr) {
            tr.classList.remove(TR_DRAGGING_CLASS);
        }
        if (oldTr) {
            oldTr.classList.remove(TR_DRAG_OVER_CLASS);
            oldTr = null;
        }
        trDragFlag = false;
    }

    function onTrDrop(e: DragEvent, rowIndex: number) {
        if (!trDragFlag) return;
        const dt = e.dataTransfer;
        if (!dt) return;
        const mode = dragRowConfig.value.mode;
        const sourceIndex = Number(dt.getData(DATA_TRANSFER_FORMAT));
        // dt.clearData(DATA_TRANSFER_FORMAT); // firefox not work
        const endIndex = rowIndex;
        if (sourceIndex === endIndex) return;

        if (mode !== 'none') {
            const dataSourceTemp = dataSourceCopy.value.slice();
            const sourceRow = dataSourceTemp[sourceIndex];
            if (mode === 'swap') {
                dataSourceTemp[sourceIndex] = dataSourceTemp[endIndex];
                dataSourceTemp[endIndex] = sourceRow;
            } else {
                dataSourceTemp.splice(sourceIndex, 1);
                dataSourceTemp.splice(endIndex, 0, sourceRow);
            }
            dataSourceCopy.value = dataSourceTemp;
        }
        emits('row-order-change', sourceIndex, endIndex);
    }

    return {
        dragRowConfig,
        onTrDragStart,
        onTrDragEnter,
        onTrDragOver,
        onTrDrop,
        onTrDragEnd,
    };
}
