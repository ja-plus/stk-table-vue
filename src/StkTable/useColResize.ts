import { ComputedRef, Ref, ShallowRef, computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { StkTableColumn, UniqKey } from './types';
import { getCalculatedColWidth } from './utils/constRefUtils';

type ColResizeState<DT extends Record<string, any>> = {
    /** 当前被拖动的列*/
    currentCol: StkTableColumn<DT> | null;
    /** 最后一个叶子列 */
    lastCol: StkTableColumn<DT> | null;
    /** 鼠标按下开始位置 */
    startX: number;
    /** 鼠标按下时鼠标对于表格的偏移量 */
    startOffsetTableX: 0;
    /** 是否反向计算，true:左增右减。false:左减右增 */
    revertMoveX: boolean;
};

type Params<DT extends Record<string, any>> = {
    props: any;
    emits: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>;
    colResizeIndicatorRef: Ref<HTMLElement | undefined>;
    colKeyGen: ComputedRef<(p: any) => UniqKey>;
    fixedCols: Ref<StkTableColumn<DT>[]>;
};

/** 列宽拖动 */
export function useColResize<DT extends Record<string, any>>({
    tableContainerRef,
    tableHeaderLast,
    colResizeIndicatorRef,
    props,
    emits,
    colKeyGen,
    fixedCols,
}: Params<DT>) {
    /** 列宽是否在拖动 */
    const isColResizing = ref(false);

    /** 列宽调整状态 */
    let colResizeState: ColResizeState<DT> = {
        currentCol: null,
        lastCol: null,
        startX: 0,
        startOffsetTableX: 0,
        revertMoveX: false,
    };

    /** 是否可拖动 */
    const colResizeOn = computed(() => {
        if (Object.prototype.toString.call(props.colResizable) === '[object Object]') {
            return (col: StkTableColumn<DT>) => !props.colResizable.disabled(col);
        }
        return () => props.colResizable;
    });

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
     * @param leftHandle 是否是左侧的拖动条
     */
    function onThResizeMouseDown(e: MouseEvent, col: StkTableColumn<DT>, leftHandle = false) {
        if (!tableContainerRef.value) return;
        e.stopPropagation();
        e.preventDefault();
        const { clientX } = e;
        const { scrollLeft, scrollTop } = tableContainerRef.value;
        const { left } = tableContainerRef.value.getBoundingClientRect();
        const tableHeaderLastValue = tableHeaderLast.value;
        let revertMoveX = false;
        const colKey = colKeyGen.value;
        /** 列下标 */
        const colIndex = tableHeaderLastValue.findIndex(it => colKey(it) === colKey(col));
        const fixedIndex = fixedCols.value.indexOf(col);
        /** 是否正在被固定 */
        const isFixed = fixedIndex !== -1;

        if (leftHandle) {
            // 左侧拖动条
            if (isFixed && col.fixed === 'right') {
                // 对于固定右侧的列，拖动左侧的把，需要反向计算
                revertMoveX = true;
            } else {
                // 取上一列
                if (colIndex - 1 >= 0) {
                    col = tableHeaderLastValue[colIndex - 1];
                }
            }
        } else {
            // 右侧拖动条
            if (isFixed && col.fixed === 'right') {
                // 对于固定右侧的列，拖动右侧的把，需要拖动下一固定的列
                revertMoveX = true;
                col = fixedCols.value[fixedIndex + 1] || col;
            }
        }

        const offsetTableX = clientX - left + scrollLeft;

        // 记录拖动状态
        isColResizing.value = true;
        Object.assign(colResizeState, {
            currentCol: col,
            lastCol: findLastChildCol(col),
            startX: clientX,
            startOffsetTableX: offsetTableX,
            revertMoveX,
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
        const minWidth = lastCol?.minWidth ?? props.colMinWidth;
        // 移动量不小于最小列宽
        if (currentColWidth + moveX < minWidth) {
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
        const { startX, lastCol, revertMoveX } = colResizeState;
        const { clientX } = e;
        const moveX = revertMoveX ? startX - clientX : clientX - startX;

        // 移动量不小于最小列宽
        let width = getCalculatedColWidth(lastCol) + moveX;
        if (width < props.colMinWidth) width = props.colMinWidth;

        const colKey = colKeyGen.value;

        const curCol = tableHeaderLast.value.find(it => colKey(it) === colKey(lastCol));
        if (!curCol) return;
        curCol.width = width + 'px';

        emits('update:columns', props.columns.slice());
        emits('col-resize', { ...curCol });

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
            lastCol: null,
            startX: 0,
            startOffsetTableX: 0,
            revertMoveX: false,
        };
    }

    /**获取最后一个叶子 */
    function findLastChildCol(column: StkTableColumn<DT> | null) {
        if (column?.children?.length) {
            const lastChild = column.children.slice(-1)[0] as StkTableColumn<DT>;
            return findLastChildCol(lastChild);
        }
        return column;
    }

    return {
        colResizeOn,
        isColResizing,
        onThResizeMouseDown,
    };
}
