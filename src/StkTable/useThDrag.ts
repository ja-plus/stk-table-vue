import { computed } from 'vue';
import { ColKeyGen, StkTableColumn } from './types';
import { isEmptyValue } from './utils';

type Params = {
    props: any;
    emits: any;
    colKeyGen: ColKeyGen;
};
/**
 * 列顺序拖动
 * @returns
 */
export function useThDrag({ props, emits, colKeyGen }: Params) {
    const findParentTH = (e: DragEvent) => (e.target as HTMLElement).closest('th');

    const dragConfig = computed(() => {
        const headerDrag = props.headerDrag;
        const draggable = headerDrag !== false; // true or object
        return {
            draggable,
            mode: 'insert',
            disabled: () => false,
            ...headerDrag,
        };
    });

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
        if (isEmptyValue(dragStartKey) || isEmptyValue(dragEndKey)) return;

        if (dragConfig.value.mode !== 'none') {
            const columns: StkTableColumn<any>[] = props.columns.slice();

            const dragStartIndex = columns.findIndex(col => colKeyGen.value(col) === dragStartKey);
            const dragEndIndex = columns.findIndex(col => colKeyGen.value(col) === dragEndKey);

            if (dragStartIndex === -1 || dragEndIndex === -1) return;

            const dragStartCol = columns[dragStartIndex];
            // if mode is none, do nothing
            if (dragConfig.value.mode === 'swap') {
                columns[dragStartIndex] = columns[dragEndIndex];
                columns[dragEndIndex] = dragStartCol;
            } else {
                // default is insert
                columns.splice(dragStartIndex, 1);
                columns.splice(dragEndIndex, 0, dragStartCol);
            }
            emits('update:columns', columns);
        }

        emits('col-order-change', dragStartKey, dragEndKey);
    }

    return {
        onThDragStart,
        onThDragOver,
        onThDrop,
        /** 是否可拖拽 */
        isHeaderDraggable: (col: StkTableColumn<any>) => dragConfig.value.draggable && !dragConfig.value.disabled(col),
    };
}
