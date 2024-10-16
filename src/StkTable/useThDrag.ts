import { ComputedRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';

type Params<T extends Record<string, any>> = {
    props: any;
    emits: any;
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
};
/**
 * 列顺序拖动
 * @param param0
 * @returns
 */
export function useThDrag<DT extends Record<string, any>>({ props, emits, colKeyGen }: Params<DT>) {
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
            handleColOrderChange(dragStartKey, th.dataset.colKey);
        }
        emits('th-drop', th.dataset.colKey);
    }

    /** 列拖动交换顺序 */
    function handleColOrderChange(dragStartKey: string | undefined, dragEndKey: string | undefined) {
        if (!dragStartKey || !dragEndKey) return;
        const columns = [...props.columns];

        const dragStartIndex = columns.findIndex(col => colKeyGen.value(col) === dragStartKey);
        const dragEndIndex = columns.findIndex(col => colKeyGen.value(col) === dragEndKey);

        if (dragStartIndex === -1 || dragEndIndex === -1) return;
        const dragStartCol = columns[dragStartIndex];
        columns.splice(dragStartIndex, 1);
        columns.splice(dragEndIndex, 0, dragStartCol);

        emits('col-order-change', dragStartKey, dragEndKey);
        emits('update:columns', columns);
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
