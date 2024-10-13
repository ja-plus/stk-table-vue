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
    function findParentTH(e: DragEvent) {
        const el = e.target as HTMLElement;
        return el.closest('th');
    }
    /** 开始拖动记录th位置 */
    function onThDragStart(e: DragEvent) {
        const th = findParentTH(e);
        if (!th) return;
        const dragStartKey = th.dataset.colKey || '';
        const dt = e.dataTransfer;
        if (dt) {
            dt.effectAllowed = 'move';
            dt.setData('text/plain', dragStartKey);
        }

        emits('th-drag-start', dragStartKey);
    }

    function onThDragOver(e: DragEvent) {
        const th = findParentTH(e);
        if (!th) return;

        const isHeaderDraggable = th.getAttribute('draggable') === 'true';
        if (!isHeaderDraggable) return;

        const dt = e.dataTransfer;
        if (dt) {
            dt.dropEffect = 'move';
        }
        e.preventDefault();
    }

    /** th拖动释放时 */
    function onThDrop(e: DragEvent) {
        const th = findParentTH(e);
        if (!th) return;
        const dragStartKey = e.dataTransfer?.getData('text');

        if (dragStartKey !== th.dataset.colKey) {
            emits('col-order-change', dragStartKey, th.dataset.colKey);
        }
        emits('th-drop', th.dataset.colKey);
    }

    const headerDragProp = props.headerDrag;

    /** 是否可拖拽 */
    const isHeaderDraggable: (col: StkTableColumn<DT>) => boolean = typeof headerDragProp === 'function' ? headerDragProp : () => headerDragProp;

    return {
        onThDragStart,
        onThDragOver,
        onThDrop,
        isHeaderDraggable,
    };
}
