import { Ref, ShallowRef, onBeforeUnmount, onMounted, ref } from 'vue';
import { StkTableColumn } from './types';
import { getCalculatedColWidth } from './utils';

type ColResizeState<DT extends Record<string, any>> = {
    /** 当前被拖动的列*/
    currentCol: StkTableColumn<DT> | null;
    /** 当前被拖动列的下标 */
    currentColIndex: number;
    /** 最后一个叶子列 */
    lastCol: StkTableColumn<DT> | null;
    /** 鼠标按下开始位置 */
    startX: number;
    /** 鼠标按下时鼠标对于表格的偏移量 */
    startOffsetTableX: 0;
};

type Params<DT extends Record<string, any>> = {
    props: any;
    emits: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>;
    colResizeIndicatorRef: Ref<HTMLElement | undefined>;
    colKeyGen: (p: any) => string;
};

/** 列宽拖动 */
export function useColResize<DT extends Record<string, any>>({
    tableContainerRef,
    tableHeaderLast,
    colResizeIndicatorRef,
    props,
    emits,
    colKeyGen,
}: Params<DT>) {
    /** 列宽是否在拖动 */
    const isColResizing = ref(false);

    /** 列宽调整状态 */
    let colResizeState: ColResizeState<DT> = {
        currentCol: null,
        currentColIndex: 0,
        lastCol: null,
        startX: 0,
        startOffsetTableX: 0,
    };

    onMounted(() => {
        initColResizeEvent();
    });

    onBeforeUnmount(() => {
        clearColResizeEvent();
    });
    /** 初始化列宽拖动事件 */
    function initColResizeEvent() {
        window.addEventListener('mousemove', onThResizeMouseMove);
        window.addEventListener('mouseup', onThResizeMouseUp);
    }

    /** 清除列宽拖动事件 */
    function clearColResizeEvent() {
        window.removeEventListener('mousemove', onThResizeMouseMove);
        window.removeEventListener('mouseup', onThResizeMouseUp);
    }

    /**
     * 拖动开始
     * @param e
     * @param col 当前列配置
     * @param isPrev 是否要上一列
     */
    function onThResizeMouseDown(e: MouseEvent, col: StkTableColumn<DT>, isPrev = false) {
        if (!tableContainerRef.value) return;
        e.stopPropagation();
        e.preventDefault();
        const { clientX } = e;
        const { scrollLeft, scrollTop } = tableContainerRef.value;
        const { left } = tableContainerRef.value.getBoundingClientRect();
        /** 列下标 */
        let colIndex = tableHeaderLast.value.findIndex(it => colKeyGen(it) === colKeyGen(col));
        if (isPrev) {
            // 上一列
            colIndex -= 1;
            col = tableHeaderLast.value[colIndex];
        }
        const offsetTableX = clientX - left + scrollLeft;

        // 记录拖动状态
        isColResizing.value = true;
        Object.assign(colResizeState, {
            currentCol: col,
            currentColIndex: colIndex,
            lastCol: findLastChildCol(col),
            startX: clientX,
            startOffsetTableX: offsetTableX,
        });

        // 展示指示线，更新其位置
        if (colResizeIndicatorRef.value) {
            const style = colResizeIndicatorRef.value.style;
            style.display = 'block';
            style.left = offsetTableX + 'px';
            style.top = scrollTop + 'px';
        }
    }

    /**
     * @param {MouseEvent} e
     */
    function onThResizeMouseMove(e: MouseEvent) {
        if (!isColResizing.value) return;
        e.stopPropagation();
        e.preventDefault();
        const { lastCol, startX, startOffsetTableX } = colResizeState;
        const { clientX } = e;
        let moveX = clientX - startX;
        const currentColWidth = getCalculatedColWidth(lastCol);
        // 移动量不小于最小列宽
        if (currentColWidth + moveX < props.colMinWidth) {
            moveX = -currentColWidth;
        }

        const offsetTableX = startOffsetTableX + moveX;
        if (!colResizeIndicatorRef.value) return;
        colResizeIndicatorRef.value.style.left = offsetTableX + 'px';
    }

    /**
     * @param {MouseEvent} e
     */
    function onThResizeMouseUp(e: MouseEvent) {
        if (!isColResizing.value) return;
        const { startX, lastCol } = colResizeState;
        const { clientX } = e;
        const moveX = clientX - startX;

        // 移动量不小于最小列宽
        let width = getCalculatedColWidth(lastCol) + moveX;
        if (width < props.colMinWidth) width = props.colMinWidth;

        const curCol = tableHeaderLast.value.find(it => colKeyGen(it) === colKeyGen(lastCol));
        if (!curCol) return;
        curCol.width = width + 'px';

        emits('update:columns', [...props.columns]);

        // 隐藏指示线
        if (colResizeIndicatorRef.value) {
            const style = colResizeIndicatorRef.value.style;
            style.display = 'none';
            style.left = '0';
            style.top = '0';
        }
        // 清除拖动状态
        isColResizing.value = false;
        colResizeState = {
            currentCol: null,
            currentColIndex: 0,
            lastCol: null,
            startX: 0,
            startOffsetTableX: 0,
        };
    }

    /**获取最后一个叶子 */
    function findLastChildCol(column: StkTableColumn<DT> | null) {
        if (column?.children?.length) {
            const lastChild = column.children.at(-1) as StkTableColumn<DT>;
            return findLastChildCol(lastChild);
        }
        return column;
    }

    return {
        isColResizing,
        onThResizeMouseDown,
        onThResizeMouseMove,
        onThResizeMouseUp,
    };
}
