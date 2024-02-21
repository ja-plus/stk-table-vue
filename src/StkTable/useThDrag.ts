import { StkTableColumn } from './types';

type Params = {
    props: any;
    emits: any;
};
/**
 * 列顺序拖动
 * @param param0
 * @returns
 */
export function useThDrag<DT extends Record<string, any>>({ props, emits }: Params) {
    let dragStartKey: string | undefined = void 0;

    function findParentTH(el: HTMLElement | Node) {
        let n: any = el;
        while (n) {
            if (n.tagName === 'TH') return n;
            n = n.parentElement;
        }
    }
    /** 开始拖动记录th位置 */
    function onThDragStart(e: MouseEvent) {
        // const i = Array.prototype.indexOf.call(e.target.parentNode.children, e.target); // 得到是第几个子元素
        const th = findParentTH(e.target as HTMLElement | Node);
        if (!th) return;

        dragStartKey = th.dataset.colKey;
        emits('th-drag-start', dragStartKey);
    }

    function onThDragOver(e: MouseEvent) {
        const th = findParentTH(e.target as HTMLElement | Node);
        if (!th) return;

        const isHeaderDraggable = th.getAttribute('draggable') === 'true';
        if (!isHeaderDraggable) {
            // 不可drag的表头不可被覆盖
            return;
        }
        e.preventDefault();
    }

    /** th拖动释放时 */
    function onThDrop(e: MouseEvent) {
        const th = findParentTH(e.target as HTMLElement | Node);
        if (!th) return;

        // const i = Array.prototype.indexOf.call(th.parentNode.children, th); // 得到是第几个子元素
        if (dragStartKey !== th.dataset.colKey) {
            emits('col-order-change', dragStartKey, th.dataset.colKey);
        }
        emits('th-drop', th.dataset.colKey);
    }

    const isHeaderDragFun = typeof props.headerDrag === 'function';
    /** 是否可拖拽 */
    function isHeaderDraggable(col: StkTableColumn<DT>) {
        if (isHeaderDragFun) {
            return props.headerDrag(col);
        } else {
            return props.headerDrag;
        }
    }

    return {
        onThDragStart,
        onThDragOver,
        onThDrop,
        isHeaderDraggable,
    };
}
