<template>
    <div
        ref="tableContainer"
        class="stk-table"
        :class="{
            virtual,
            'virtual-x': virtualX,
            dark: theme === 'dark',
            headless,
            'is-col-resizing': isColResizing,
            'col-resizable': props.colResizable,
            border: props.bordered,
            'border-h': props.bordered === 'h',
            'border-v': props.bordered === 'v',
            'border-body-v': props.bordered === 'body-v',
        }"
        :style="virtual && { '--row-height': virtualScroll.rowHeight + 'px' }"
        @scroll="onTableScroll"
        @wheel="onTableWheel"
    >
        <!-- 横向滚动时固定列的阴影，TODO: 覆盖一层在整个表上，使用linear-gradient 绘制阴影-->
        <!-- <div
        :class="showFixedLeftShadow && 'stk-table-fixed-left-col-box-shadow'"
        :style="{ width: fixedLeftColWidth + 'px' }"
      ></div> -->
        <!-- 这个元素用于虚拟滚动时，撑开父容器的高度 （已弃用，因为滚动条拖动过快，下方tr为加载出来时，会导致表头sticky闪动）
        <div
          v-if="virtual"
          class="virtual-table-height"
          :style="{ height: dataSourceCopy.length * virtualScroll.rowHeight + 'px' }"
        ></div>
      -->
        <div v-show="colResizable" ref="colResizeIndicator" class="column-resize-indicator"></div>
        <!-- 表格主体 -->
        <table
            class="stk-table-main"
            :style="{ width, minWidth, maxWidth }"
            :class="{
                'fixed-mode': props.fixedMode,
            }"
        >
            <!-- transform: virtualX_on ? `translateX(${virtualScrollX.offsetLeft}px)` : null, 用transform控制虚拟滚动左边距，sticky会有问题 -->
            <thead v-if="!headless">
                <tr v-for="(row, rowIndex) in tableHeaders" :key="rowIndex" @contextmenu="e => onHeaderMenu(e)">
                    <!-- 这个th用于横向虚拟滚动表格左边距,width、maxWidth 用于兼容低版本浏览器 -->
                    <th
                        v-if="virtualX_on"
                        class="virtual-x-left"
                        :style="{
                            minWidth: virtualScrollX.offsetLeft + 'px',
                            width: virtualScrollX.offsetLeft + 'px',
                        }"
                    ></th>
                    <!-- v for中最后一行才用 切割。TODO:不支持多级表头虚拟横向滚动 -->
                    <th
                        v-for="(col, colIndex) in virtualX_on && rowIndex === tableHeaders.length - 1 ? virtualX_columnPart : row"
                        :key="col.dataIndex"
                        :data-col-key="colKeyGen(col)"
                        :draggable="headerDrag ? 'true' : 'false'"
                        :rowspan="virtualX_on ? 1 : col.rowSpan"
                        :colspan="col.colSpan"
                        :style="getCellStyle(1, col)"
                        :title="col.title"
                        :class="[
                            col.sorter ? 'sortable' : '',
                            col.dataIndex === sortCol && sortOrderIndex !== 0 && 'sorter-' + sortSwitchOrder[sortOrderIndex],
                            showHeaderOverflow ? 'text-overflow' : '',
                            col.headerClassName,
                            col.fixed ? 'fixed-cell' : '',
                            col.fixed ? 'fixed-cell--' + col.fixed : '',
                        ]"
                        @click="
                            e => {
                                onColumnSort(col);
                                onHeaderCellClick(e, col);
                            }
                        "
                        @dragstart="onThDragStart"
                        @drop="onThDrop"
                        @dragover="onThDragOver"
                    >
                        <div class="table-header-cell-wrapper">
                            <component :is="col.customHeaderCell" v-if="col.customHeaderCell" :col="col" />
                            <template v-else>
                                <slot name="tableHeader" :column="col">
                                    <span class="table-header-title">{{ col.title }}</span>
                                </slot>
                            </template>

                            <!-- 排序图图标 -->
                            <span v-if="col.sorter" class="table-header-sorter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16">
                                    <g id="sort-btn">
                                        <polygon id="arrow-up" fill="#757699" points="8 2 4.8 6 11.2 6"></polygon>
                                        <polygon
                                            id="arrow-down"
                                            transform="translate(8, 12) rotate(-180) translate(-8, -12) "
                                            points="8 10 4.8 14 11.2 14"
                                        ></polygon>
                                    </g>
                                </svg>
                            </span>
                            <!-- 列宽拖动handler -->
                            <div
                                v-if="colResizable && colIndex > 0"
                                class="table-header-resizer left"
                                @mousedown="e => onThResizeMouseDown(e, col, true)"
                            ></div>
                            <div v-if="colResizable" class="table-header-resizer right" @mousedown="e => onThResizeMouseDown(e, col)"></div>
                        </div>
                    </th>
                    <!-- 这个th用于横向虚拟滚动表格右边距 width、maxWidth 用于兼容低版本浏览器-->
                    <th
                        v-if="virtualX_on"
                        style="padding: 0"
                        :style="{
                            minWidth: virtualX_offsetRight + 'px',
                            width: virtualX_offsetRight + 'px',
                        }"
                    ></th>
                </tr>
            </thead>

            <!-- 用于虚拟滚动表格内容定位 @deprecated 有兼容问题-->
            <!-- <tbody v-if="virtual_on" :style="{ height: `${virtualScroll.offsetTop}px` }">
          <!==这个tr兼容火狐==>
          <tr></tr>
        </tbody> -->
            <!-- <td
            v-for="col in virtualX_on ? virtualX_columnPart : tableHeaderLast"
            :key="col.dataIndex"
            class="perch-td top"
          ></td> -->
            <!-- <tbody :style="{ transform: `translateY(${virtualScroll.offsetTop}px)` }"> -->
            <tbody>
                <tr v-if="virtual_on" :style="{ height: `${virtualScroll.offsetTop}px` }" class="padding-top-tr">
                    <!--这个td用于配合虚拟滚动的th对应，防止列错位-->
                    <td v-if="virtualX_on && fixedMode && headless" class="virtual-x-left" style="padding: 0"></td>
                    <template v-if="fixedMode && headless">
                        <td v-for="col in virtualX_columnPart" :key="col.dataIndex" :style="getCellStyle(2, col)"></td
                    ></template>
                </tr>
                <tr
                    v-for="(row, i) in virtual_dataSourcePart"
                    :key="rowKey ? rowKeyGen(row) : i"
                    :data-row-key="rowKey ? rowKeyGen(row) : i"
                    :class="{
                        active: rowKey ? rowKeyGen(row) === (currentItem && rowKeyGen(currentItem)) : row === currentItem,
                        hover: rowKey ? rowKeyGen(row) === currentHover : row === currentHover,
                        [rowClassName(row, i)]: true,
                    }"
                    :style="{
                        backgroundColor: row._bgc,
                    }"
                    @click="e => onRowClick(e, row)"
                    @dblclick="e => onRowDblclick(e, row)"
                    @contextmenu="e => onRowMenu(e, row)"
                    @mouseover="e => onTrMouseOver(e, row)"
                >
                    <!--这个td用于配合虚拟滚动的th对应，防止列错位-->
                    <td v-if="virtualX_on" class="virtual-x-left" style="padding: 0"></td>
                    <td
                        v-for="col in virtualX_columnPart"
                        :key="col.dataIndex"
                        :data-index="col.dataIndex"
                        :class="[
                            col.className,
                            showOverflow ? 'text-overflow' : '',
                            col.fixed ? 'fixed-cell' : '',
                            col.fixed ? 'fixed-cell--' + col.fixed : '',
                        ]"
                        :style="getCellStyle(2, col)"
                        @click="e => onCellClick(e, row, col)"
                    >
                        <component :is="col.customCell" v-if="col.customCell" :col="col" :row="row" :cell-value="row[col.dataIndex]" />
                        <div v-else class="table-cell-wrapper" :title="row[col.dataIndex]">
                            {{ row[col.dataIndex] ?? emptyCellText }}
                        </div>
                    </td>
                </tr>
                <tr v-if="virtual_on" :style="{ height: `${virtual_offsetBottom}px` }"></tr>
            </tbody>
        </table>
        <div v-if="(!dataSourceCopy || !dataSourceCopy.length) && showNoData" class="stk-table-no-data" :class="{ 'no-data-full': noDataFull }">
            <slot name="empty">暂无数据</slot>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * @author JA+
 * 不支持低版本浏览器非虚拟滚动表格的表头固定，列固定，因为会卡。
 * TODO:存在的问题：
 * [] column.dataIndex 作为唯一键，不能重复
 * [] 计算的高亮颜色，挂在数据源上对象上，若多个表格使用同一个数据源对象会有问题。需要深拷贝。(解决方案：获取组件uid)
 * [] highlight-row 颜色不能恢复到active的颜色
 */
import { CSSProperties, computed, onMounted, ref, shallowRef, toRaw, watch } from 'vue';
import { Order, SortOption, StkProps, StkTableColumn } from './types/index';
import { useAutoResize } from './useAutoResize';
import { useColResize } from './useColResize';
import { useFixedStyle } from './useFixedStyle';
import { useHighlight } from './useHighlight';
import { useKeyboardArrowScroll } from './useKeyboardArrowScroll';
import { useThDrag } from './useThDrag';
import { useVirtualScroll } from './useVirtualScroll';
import { howDeepTheColumn, tableSort } from './utils';

const props = withDefaults(defineProps<StkProps>(), {
    width: '',
    fixedMode: false,
    minWidth: '',
    maxWidth: '',
    headless: false,
    theme: 'light',
    virtual: false,
    virtualX: false,
    columns: () => [],
    dataSource: () => [],
    rowKey: '',
    colKey: 'dataIndex',
    emptyCellText: '--',
    noDataFull: false,
    showNoData: true,
    sortRemote: false,
    showHeaderOverflow: false,
    showOverflow: false,
    showTrHoverClass: false,
    headerDrag: false,
    rowClassName: () => '',
    colResizable: false,
    colMinWidth: 10,
    bordered: true,
    autoResize: true,
});

const emit = defineEmits([
    'sort-change',
    'row-click',
    'current-change',
    'row-dblclick',
    'header-row-menu',
    'row-menu',
    'cell-click',
    'header-cell-click',
    'scroll',
    'col-order-change',
    'th-drop',
    'th-drag-start',
    'columns',
]);

const tableContainer = ref<HTMLDivElement>();
const colResizeIndicator = ref<HTMLDivElement>();
/** 当前选中的一行*/
const currentItem = ref(null);
/** 当前hover的行 */
const currentHover = ref(null);

/** 排序的列dataIndex*/
let sortCol = ref<string | null>();
let sortOrderIndex = ref(0);

/** 排序切换顺序 */
const sortSwitchOrder: Order[] = [null, 'desc', 'asc'];

/** 表头.内容是 props.columns 的引用集合 */
const tableHeaders = ref<StkTableColumn<any>[][]>([]);
/** 若有多级表头时，最后一行的tableHeaders.内容是 props.columns 的引用集合  */
const tableHeaderLast = ref<StkTableColumn<any>[]>([]);

const dataSourceCopy = shallowRef([...props.dataSource]);

/**高亮帧间隔 
const highlightStepDuration = Highlight_Color_Change_Freq / 1000 + 's';*/

/** rowKey缓存 */
const rowKeyGenStore = new WeakMap();

const { isColResizing, onThResizeMouseDown } = useColResize({
    props,
    emit,
    colKeyGen,
    colResizeIndicator,
    tableContainer,
    tableHeaderLast,
});

const { onThDragStart, onThDragOver, onThDrop } = useThDrag({ emit });

const {
    virtualScroll,
    virtualScrollX,
    virtual_on,
    virtual_dataSourcePart,
    virtual_offsetBottom,
    virtualX_on,
    virtualX_columnPart,
    virtualX_offsetRight,
    initVirtualScroll,
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX,
} = useVirtualScroll({ tableContainer, props, dataSourceCopy, tableHeaderLast });

const { getFixedStyle } = useFixedStyle({
    tableHeaderLast,
    virtualScroll,
    virtualScrollX,
    virtualX_on,
    virtualX_offsetRight,
});

/**
 * 高亮行，高亮单元格
 */
const { setHighlightDimCell, setHighlightDimRow } = useHighlight({ props, tableContainer, rowKeyGen });

if (props.autoResize) {
    useAutoResize({ tableContainer, initVirtualScroll, scrollTo, props, debounceMs: 500 });
}

/** 键盘箭头滚动 */
useKeyboardArrowScroll(tableContainer, {
    scrollTo,
    virtualScroll,
    virtualScrollX,
});

watch(
    () => props.columns,
    () => {
        dealColumns();
        initVirtualScrollX();
    },
);

dealColumns();

watch(
    () => props.dataSource,
    val => {
        if (!val) {
            console.warn('invalid dataSource');
            return;
        }
        // dealColumns(val);
        let needInitVirtualScrollY = false;
        if (dataSourceCopy.value.length !== val.length) {
            needInitVirtualScrollY = true;
        }
        dataSourceCopy.value = [...val];
        // 数据长度没变则不计算虚拟滚动
        if (needInitVirtualScrollY) initVirtualScrollY();

        if (sortCol.value) {
            // 排序
            const column = tableHeaderLast.value.find(it => it.dataIndex === sortCol.value);
            onColumnSort(column, false);
        }
    },
    {
        deep: false,
    },
);
onMounted(() => {
    initVirtualScroll();
});

/**
 * 处理多级表头
 * FIXME: 仅支持到两级表头。不支持多级。
 */
function dealColumns() {
    // reset
    tableHeaders.value = [];
    tableHeaderLast.value = [];
    const copyColumn = props.columns; // do not deep clone
    const deep = howDeepTheColumn(copyColumn);
    const tmpHeaderLast: StkTableColumn<any>[] = [];

    if (deep > 1 && props.virtualX) {
        console.error('多级表头不支持横向虚拟滚动');
    }

    // 展开columns
    (function flat(arr: StkTableColumn<any>[], depth = 0) {
        if (!tableHeaders.value[depth]) {
            tableHeaders.value[depth] = [];
        }
        arr.forEach(col => {
            col.rowSpan = col.children ? 1 : deep - depth;
            col.colSpan = col.children?.length;
            if (col.rowSpan === 1) delete col.rowSpan;
            if (col.colSpan === 1) delete col.colSpan;
            tableHeaders.value[depth].push(col);
            if (!props.virtualX && col.children) {
                flat(col.children, depth + 1);
            } else {
                tmpHeaderLast.push(col); // 没有children的列作为colgroup
            }
        });
    })(copyColumn);

    tableHeaderLast.value = tmpHeaderLast;
}

/**
 * 行唯一值生成
 */
function rowKeyGen(row: any) {
    let key = rowKeyGenStore.get(row);
    if (!key) {
        key = typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey];
        rowKeyGenStore.set(row, key);
    }
    return key;
}

/**
 * 列唯一键
 * @param col
 */
function colKeyGen(col: StkTableColumn<any>) {
    return typeof props.colKey === 'function' ? props.colKey(col) : (col as any)[props.colKey];
}

/** 获取列宽度样式 */
function getColWidthStyle(col: StkTableColumn<any>) {
    const style: CSSProperties = {
        width: col.width,
        minWidth: col.minWidth,
        maxWidth: col.maxWidth,
    };
    if (props.colResizable) {
        style.minWidth = col.width;
        style.maxWidth = col.width;
    } else {
        style.minWidth = col.minWidth === void 0 ? col.width : col.minWidth;
        style.maxWidth = col.maxWidth === void 0 ? col.width : col.maxWidth;
    }

    return style;
}

/**
 * 性能优化，缓存style行内样式
 *
 * FIXME: col变化时仍从缓存拿style。watch col?
 * @param {1|2} tagType 1-th 2-td
 * @param {StkTableColumn} col
 */
function getCellStyle(tagType: 1 | 2, col: StkTableColumn<any>): CSSProperties {
    const style: CSSProperties = {
        ...getColWidthStyle(col),
        ...getFixedStyle(tagType, col),
    };
    if (tagType === 1) {
        // TH
        style.textAlign = col.headerAlign;
    } else if (tagType === 2) {
        // TD
        style.textAlign = col.align;
    }

    return style;
}

/**
 * 表头点击排序
 * @param {boolean} options.force sort-remote 开启后是否强制排序
 * @param {boolean} options.emit 是否触发回调
 */
function onColumnSort(col?: StkTableColumn<any>, click = true, options: { force?: boolean; emit?: boolean } = {}) {
    if (!col?.sorter) return;
    options = { force: false, emit: false, ...options };
    if (sortCol.value !== col.dataIndex) {
        // 改变排序的列时，重置排序
        sortCol.value = col.dataIndex;
        sortOrderIndex.value = 0;
    }
    if (click) sortOrderIndex.value++;
    sortOrderIndex.value = sortOrderIndex.value % 3;

    const order = sortSwitchOrder[sortOrderIndex.value];

    if (!props.sortRemote || options.force) {
        dataSourceCopy.value = tableSort(col, order, props.dataSource);
    }
    // 只有点击才触发事件
    if (click || options.emit) {
        emit('sort-change', col, order, toRaw(dataSourceCopy.value));
    }
}

function onRowClick(e: MouseEvent, row: any) {
    emit('row-click', e, row);
    // 选中同一行不触发current-change 事件
    if (currentItem.value === row) return;
    currentItem.value = row;
    emit('current-change', e, row);
}

function onRowDblclick(e: MouseEvent, row: any) {
    emit('row-dblclick', e, row);
}

/** 表头行右键 */
function onHeaderMenu(e: MouseEvent) {
    emit('header-row-menu', e);
}

/** 表体行右键 */
function onRowMenu(e: MouseEvent, row: any) {
    emit('row-menu', e, row);
}

/** 单元格单击 */
function onCellClick(e: MouseEvent, row: any, col: StkTableColumn<any>) {
    emit('cell-click', e, row, col);
}

/** 表头单元格单击 */
function onHeaderCellClick(e: MouseEvent, col: StkTableColumn<any>) {
    emit('header-cell-click', e, col);
}

/**
 * 鼠标滚轮事件监听
 * @param {MouseEvent} e
 */
function onTableWheel(e: MouseEvent) {
    if (isColResizing.value) {
        // 正在调整列宽时，不允许用户滚动
        e.preventDefault();
        e.stopPropagation();
        return;
    }
}

/**
 * 滚动条监听
 * @param {Event} e scrollEvent
 */
function onTableScroll(e: Event) {
    if (!e?.target) return;

    // 此处可优化，因为访问e.target.scrollXX消耗性能
    const { scrollTop, scrollLeft } = e.target as HTMLElement;
    // 纵向滚动有变化
    if (scrollTop !== virtualScroll.value.scrollTop) virtualScroll.value.scrollTop = scrollTop;
    if (virtual_on.value) {
        updateVirtualScrollY(scrollTop);
    }

    // 横向滚动有变化
    if (scrollLeft !== virtualScrollX.value.scrollLeft) virtualScrollX.value.scrollLeft = scrollLeft;
    if (virtualX_on.value) {
        updateVirtualScrollX(scrollLeft);
    }
    emit('scroll', e);
}

/** tr hover事件 */
function onTrMouseOver(e: MouseEvent, row: any) {
    if (props.showTrHoverClass) {
        currentHover.value = rowKeyGen(row);
    }
}

/**
 * 选中一行，
 * @param {string} rowKey
 * @param {boolean} option.silent 是否触发回调
 */
function setCurrentRow(rowKey: string, option = { silent: false }) {
    if (!dataSourceCopy.value.length) return;
    currentItem.value = dataSourceCopy.value.find(it => rowKeyGen(it) === rowKey);
    if (!option.silent) {
        emit('current-change', null, currentItem.value);
    }
}

/**
 * 设置表头排序状态
 * @param {string} dataIndex 列字段
 * @param {'asc'|'desc'|null} order
 * @param {object} option.sortOption 指定排序参数
 * @param {boolean} option.sort 是否触发排序
 * @param {boolean} option.silent 是否触发回调
 */
function setSorter(dataIndex: string, order: null | 'asc' | 'desc', option: { sortOption?: SortOption; silent?: boolean; sort?: boolean } = {}) {
    const newOption = { silent: true, sortOption: null, sort: true, ...option };
    sortCol.value = dataIndex;
    sortOrderIndex.value = sortSwitchOrder.findIndex(it => it === order);

    if (newOption.sort && dataSourceCopy.value?.length) {
        // 如果表格有数据，则进行排序
        const column = newOption.sortOption || tableHeaderLast.value.find(it => it.dataIndex === sortCol.value);
        if (column) onColumnSort(column, false, { force: true, emit: !newOption.silent });
        else console.warn('Can not find column by dataIndex:', sortCol.value);
    }
    return dataSourceCopy.value;
}

/** 重置排序 */
function resetSorter() {
    sortCol.value = null;
    sortOrderIndex.value = 0;
    dataSourceCopy.value = [...props.dataSource];
}

/**
 * 设置滚动条位置
 * @param top 传null 则不变动位置
 * @param left 传null 则不变动位置
 */
function scrollTo(top: number | null = 0, left: number | null = 0) {
    if (!tableContainer.value) return;
    if (top !== null) tableContainer.value.scrollTop = top;
    if (left !== null) tableContainer.value.scrollLeft = left;
}

/** 获取当前状态的表格数据 */
function getTableData() {
    return toRaw(dataSourceCopy.value);
}

defineExpose({
    initVirtualScroll,
    initVirtualScrollX,
    initVirtualScrollY,
    setCurrentRow,
    setHighlightDimCell,
    setHighlightDimRow,
    sortCol,
    setSorter,
    resetSorter,
    scrollTo,
    getTableData,
});
</script>
