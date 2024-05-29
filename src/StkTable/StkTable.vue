<template>
    <div
        ref="tableContainerRef"
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
            stripe: props.stripe,
            'cell-hover': props.cellHover,
            'row-hover': props.rowHover,
            'row-active': props.rowActive,
            'text-overflow': props.showOverflow,
            'header-text-overflow': props.showHeaderOverflow,
            'fixed-relative-mode': isRelativeMode,
        }"
        :style="{
            '--row-height': virtualScroll.rowHeight + 'px',
            '--header-row-height': (props.headerRowHeight || props.rowHeight) + 'px',
            '--highlight-duration': props.highlightConfig.duration && props.highlightConfig.duration + 's',
            '--highlight-timing-function': highlightSteps ? `steps(${highlightSteps})` : '',
        }"
        @scroll="onTableScroll"
        @wheel="onTableWheel"
    >
        <!-- 这个元素用于虚拟滚动时，撑开父容器的高度 （已弃用，因为滚动条拖动过快，下方tr为加载出来时，会导致表头sticky闪动）
        <div
          v-if="virtual"
          class="virtual-table-height"
          :style="{ height: dataSourceCopy.length * virtualScroll.rowHeight + 'px' }"
        ></div>
      -->
        <div v-if="colResizable" ref="colResizeIndicatorRef" class="column-resize-indicator"></div>
        <!-- 表格主体 -->
        <table
            class="stk-table-main"
            :style="{ width, minWidth, maxWidth }"
            :class="{
                'fixed-mode': props.fixedMode,
            }"
        >
            <!-- transform: virtualX_on ? `translateX(${virtualScrollX.offsetLeft}px)` : null, 用transform控制虚拟滚动左边距，sticky会有问题 -->
            <thead v-if="!headless" ref="theadRef">
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
                        :draggable="isHeaderDraggable(col) ? 'true' : 'false'"
                        :rowspan="virtualX_on ? 1 : col.rowSpan"
                        :colspan="col.colSpan"
                        :style="cellStyleMap[TagType.TH].get(colKeyGen(col))"
                        :title="getHeaderTitle(col)"
                        :class="[
                            col.sorter ? 'sortable' : '',
                            col.dataIndex === sortCol && sortOrderIndex !== 0 && 'sorter-' + sortSwitchOrder[sortOrderIndex],
                            col.headerClassName,
                            fixedColClassMap.get(colKeyGen(col)),
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
                            <component :is="col.customHeaderCell" v-if="col.customHeaderCell" :col="col" :colIndex="colIndex" :rowIndex="rowIndex" />
                            <template v-else-if="col.type === 'seq'">
                                <span class="table-header-title">{{ col.title }}</span>
                            </template>
                            <template v-else>
                                <slot name="tableHeader" :col="col">
                                    <span class="table-header-title">{{ col.title }}</span>
                                </slot>
                            </template>

                            <!-- 排序图图标 -->
                            <span v-if="col.sorter" class="table-header-sorter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16">
                                    <polygon class="arrow-up" fill="#757699" points="8 2 4.8 6 11.2 6"></polygon>
                                    <polygon
                                        class="arrow-down"
                                        transform="translate(8, 12) rotate(-180) translate(-8, -12) "
                                        points="8 10 4.8 14 11.2 14"
                                    ></polygon>
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
                        class="virtual-x-right"
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
            <tbody v-if="virtual_on" class="virtual-top">
                <!-- 由于斑马纹选择器nth-child 原因，占位tr单独包在tbody中 -->
                <tr :style="{ height: `${virtualScroll.offsetTop}px` }" class="padding-top-tr">
                    <!--这个td用于配合虚拟滚动的th对应，防止列错位-->
                    <td v-if="virtualX_on && fixedMode && headless" class="virtual-x-left"></td>
                    <template v-if="fixedMode && headless">
                        <td v-for="col in virtualX_columnPart" :key="col.dataIndex" :style="cellStyleMap[TagType.TD].get(colKeyGen(col))"></td>
                    </template>
                </tr>
            </tbody>
            <tbody class="stk-tbody-main">
                <tr
                    v-for="(row, rowIndex) in virtual_dataSourcePart"
                    :id="stkTableId + '-' + (rowKey ? rowKeyGen(row) : rowIndex)"
                    :key="rowKey ? rowKeyGen(row) : rowIndex"
                    :data-row-key="rowKey ? rowKeyGen(row) : rowIndex"
                    :class="{
                        active: rowKey ? rowKeyGen(row) === rowKeyGen(currentRow) : row === currentRow,
                        hover: props.showTrHoverClass && (rowKey ? rowKeyGen(row) === currentHoverRowKey : row === currentHoverRowKey),
                        [rowClassName(row, rowIndex)]: true,
                    }"
                    @click="e => onRowClick(e, row)"
                    @dblclick="e => onRowDblclick(e, row)"
                    @contextmenu="e => onRowMenu(e, row)"
                    @mouseover="e => onTrMouseOver(e, row)"
                >
                    <!--这个td用于配合虚拟滚动的th对应，防止列错位-->
                    <td v-if="virtualX_on" class="virtual-x-left"></td>
                    <td
                        v-for="(col, colIndex) in virtualX_columnPart"
                        :key="col.dataIndex"
                        :data-index="col.dataIndex"
                        :style="cellStyleMap[TagType.TD].get(colKeyGen(col))"
                        :class="[col.className, fixedColClassMap.get(colKeyGen(col)), col.type === 'seq' ? 'seq-column' : '']"
                        @click="e => onCellClick(e, row, col)"
                        @mouseenter="e => onCellMouseEnter(e, row, col)"
                        @mouseleave="e => onCellMouseLeave(e, row, col)"
                        @mouseover="e => onCellMouseOver(e, row, col)"
                    >
                        <component
                            :is="col.customCell"
                            v-if="col.customCell"
                            :col="col"
                            :row="row"
                            :rowIndex="rowIndex"
                            :colIndex="colIndex"
                            :cellValue="row?.[col.dataIndex]"
                        />
                        <div v-else class="table-cell-wrapper" :title="!col.type ? row?.[col.dataIndex] : ''">
                            <template v-if="col.type === 'seq'">
                                {{ (props.seqConfig.startIndex || 0) + rowIndex + 1 }}
                            </template>
                            <template v-else>
                                {{ row?.[col.dataIndex] ?? getEmptyCellText(col, row) }}
                            </template>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody v-if="virtual_on" class="virtual-bottom">
                <tr :style="{ height: `${virtual_offsetBottom}px` }"></tr>
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
 * TODO:存在的问题：
 * [] column.dataIndex 作为唯一键，不能重复
 */
import { CSSProperties, computed, nextTick, onMounted, ref, shallowRef, toRaw, watch } from 'vue';
import { DEFAULT_ROW_HEIGHT, IS_LEGACY_MODE } from './const';
import { HighlightConfig, Order, SeqConfig, SortConfig, SortOption, SortState, StkTableColumn, TagType, UniqKeyProp } from './types/index';
import { useAutoResize } from './useAutoResize';
import { useColResize } from './useColResize';
import { useFixedCol } from './useFixedCol';
import { useFixedStyle } from './useFixedStyle';
import { useGetFixedColPosition } from './useGetFixedColPosition';
import { useHighlight } from './useHighlight';
import { useKeyboardArrowScroll } from './useKeyboardArrowScroll';
import { useThDrag } from './useThDrag';
import { useVirtualScroll } from './useVirtualScroll';
import { createStkTableId, getCalculatedColWidth, getColWidth, howDeepTheHeader, tableSort, transformWidthToStr } from './utils/index';

/** Generic stands for DataType */
type DT = Record<string | number, any>;
/** 自己生成实例id */
const stkTableId = createStkTableId();
/**
 * props 不能放在单独的文件中。vue2.7 compiler 构建会出错。
 */
const props = withDefaults(
    defineProps<{
        width?: string;
        /** 最小表格宽度 */
        minWidth?: string;
        /** 表格最大宽度*/
        maxWidth?: string;
        /** 斑马线条纹 */
        stripe?: boolean;
        /** 是否使用 table-layout:fixed(低版本浏览器需要设置table) */
        fixedMode?: boolean;
        /** 是否隐藏表头 */
        headless?: boolean;
        /** 主题，亮、暗 */
        theme?: 'light' | 'dark';
        /** 行高 */
        rowHeight?: number;
        /** 是否高亮鼠标悬浮的行 */
        rowHover?: boolean;
        /** 是否高亮选中的行 */
        rowActive?: boolean;
        /** 当前行再次点击否可以取消 */
        rowCurrentRevokable?: boolean;
        /** 表头行高。default = rowHeight */
        headerRowHeight?: number | null;
        /** 虚拟滚动 */
        virtual?: boolean;
        /** x轴虚拟滚动(必须设置列宽)*/
        virtualX?: boolean;
        /** 表格列配置 */
        columns?: StkTableColumn<DT>[];
        /** 表格数据源 */
        dataSource?: DT[];
        /** 行唯一键 （行唯一值不能为undefined） */
        rowKey?: UniqKeyProp;
        /** 列唯一键 */
        colKey?: UniqKeyProp;
        /** 空值展示文字 */
        emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string);
        /** 暂无数据兜底高度是否撑满 */
        noDataFull?: boolean;
        /** 是否展示暂无数据 */
        showNoData?: boolean;
        /** 是否服务端排序，true则不排序数据 */
        sortRemote?: boolean;
        /** 表头是否溢出展示... */
        showHeaderOverflow?: boolean;
        /** 表体溢出是否展示... */
        showOverflow?: boolean;
        /** 是否增加行hover class $*$ rename*/
        showTrHoverClass?: boolean;
        /** 是否高亮鼠标悬浮的单元格 */
        cellHover?: boolean;
        /** 表头是否可拖动。支持回调函数。 */
        headerDrag?: boolean | ((col: StkTableColumn<DT>) => boolean);
        /**
         * 给行附加className<br>
         * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
         */
        rowClassName?: (row: DT, i: number) => string;
        /**
         * 列宽是否可拖动<br>
         * **不要设置**列minWidth，**必须**设置width<br>
         * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
         */
        colResizable?: boolean;
        /** 可拖动至最小的列宽 */
        colMinWidth?: number;
        /**
         * 单元格分割线。
         * 默认横竖都有
         * "h" - 仅展示横线
         * "v" - 仅展示竖线
         * "body-v" - 仅表体展示竖线
         */
        bordered?: boolean | 'h' | 'v' | 'body-v';
        /**
         * 自动重新计算虚拟滚动高度宽度。默认true
         * [非响应式]
         * 传入方法表示resize后的回调
         */
        autoResize?: boolean | (() => void);
        /** 是否展示固定列阴影。为节省性能，默认false。 */
        fixedColShadow?: boolean;
        /** 优化vue2 滚动 */
        optimizeVue2Scroll?: boolean;
        /** 排序配置 */
        sortConfig?: SortConfig<DT>;
        /** 隐藏头部title。可传入dataIndex数组 */
        hideHeaderTitle?: boolean | string[];
        /** 高亮配置 */
        highlightConfig?: HighlightConfig;
        /** 序号列配置 */
        seqConfig?: SeqConfig;
        /**
         * 固定头，固定列实现方式。(非响应式)
         *
         * relative：固定列只会放在props.columns的两侧。
         * - 如果列宽会变动则谨慎使用。
         * - 多级表头固定列慎用
         *
         * 低版本浏览器强制为'relative'，
         */
        cellFixedMode?: 'sticky' | 'relative';
    }>(),
    {
        width: '',
        fixedMode: false,
        stripe: false,
        minWidth: '',
        maxWidth: '',
        headless: false,
        theme: 'light',
        rowHeight: DEFAULT_ROW_HEIGHT,
        rowHover: true,
        rowActive: true,
        rowCurrentRevokable: true,
        headerRowHeight: null,
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
        cellHover: false,
        headerDrag: false,
        rowClassName: () => '',
        colResizable: false,
        colMinWidth: 10,
        bordered: true,
        autoResize: true,
        fixedColShadow: false,
        optimizeVue2Scroll: false,
        sortConfig: () => ({
            emptyToBottom: false,
            stringLocaleCompare: true,
        }),
        hideHeaderTitle: false,
        highlightConfig: () => ({}),
        seqConfig: () => ({}),
        cellFixedMode: 'sticky',
    },
);

const emits = defineEmits<{
    /**
     * 排序变更触发
     * ```(col: StkTableColumn<DT>, order: Order, data: DT[])```
     */
    (e: 'sort-change', col: StkTableColumn<DT>, order: Order, data: DT[], sortConfig: SortConfig<DT>): void;
    /**
     * 一行点击事件
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-click', ev: MouseEvent, row: DT): void;
    /**
     * 选中一行触发。ev返回null表示不是点击事件触发的
     * ```(ev: MouseEvent | null, row: DT | undefined, data: { select: boolean })```
     */
    (e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void;
    /**
     * 行双击事件
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-dblclick', ev: MouseEvent, row: DT): void;
    /**
     * 表头右键事件
     * ```(ev: MouseEvent)```
     */
    (e: 'header-row-menu', ev: MouseEvent): void;
    /**
     * 表体行右键点击事件
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-menu', ev: MouseEvent, row: DT): void;
    /**
     * 单元格点击事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格鼠标进入事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格鼠标移出事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格悬浮事件
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 表头单元格点击事件
     * ```(ev: MouseEvent, col: StkTableColumn<DT>)```
     */
    (e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
    /**
     * 表格滚动事件
     * ```(ev: Event, data: { startIndex: number; endIndex: number })```
     */
    (e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
    /**
     * 表格横向滚动事件
     * ```(ev: Event)```
     */
    (e: 'scroll-x', ev: Event): void;
    /**
     * 表头列拖动事件
     * ```(dragStartKey: string, targetColKey: string)```
     */
    (e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
    /**
     * 表头列拖动开始
     * ```(dragStartKey: string)```
     */
    (e: 'th-drag-start', dragStartKey: string): void;
    /**
     * 表头列拖动drop
     * ```(targetColKey: string)```
     */
    (e: 'th-drop', targetColKey: string): void;
    /** v-model:columns col resize 时更新宽度*/
    (e: 'update:columns', cols: StkTableColumn<DT>[]): void;
}>();

// 仅支持vue3.3+
// const slots = defineSlots<{
//     /** 表头插槽 */
//     tableHeader(props: { col: StkTableColumn<DT> }): void;
//     /** 空状态插槽 */
//     empty(): void;
// }>();

const tableContainerRef = ref<HTMLDivElement>();
const theadRef = ref<HTMLElement>();
const colResizeIndicatorRef = ref<HTMLDivElement>();

/** 是否使用 relative 固定头和列 */
const isRelativeMode = ref(IS_LEGACY_MODE ? true : props.cellFixedMode === 'relative');

/**
 * 当前选中的一行
 * - shallowRef： 使 currentRow.value === row 地址相同。防止rowKeyGen 的WeakMap key不一致。
 */
const currentRow = shallowRef<DT>();
/**
 * 保存当前选中行的key<br>
 * 原因：vue3 不用ref包dataSource时，row为原始对象，与currentItem（Ref）相比会不相等。
 */
const currentRowKey = ref<any>(null);
/** 当前hover行 */
let currentHoverRow: DT | null = null;
/** 当前hover的行的key */
const currentHoverRowKey = ref(null);
/** 当前hover的列的key */
// const currentColHoverKey = ref(null);

/** 排序的列dataIndex*/
let sortCol = ref<keyof DT>();
let sortOrderIndex = ref(0);

/** 排序切换顺序 */
const sortSwitchOrder: Order[] = [null, 'desc', 'asc'];

/**
 * 表头.内容是 props.columns 的引用集合
 * @eg
 * ```js
 * [
 *      [{dataInex:'id',...}], // 第0行列配置
 *      [], // 第一行列配置
 *      //...
 * ]
 * ```
 */
const tableHeaders = shallowRef<StkTableColumn<DT>[][]>([]);
/** 若有多级表头时，最后一行的tableHeaders.内容是 props.columns 的引用集合  */
const tableHeaderLast = shallowRef<StkTableColumn<DT>[]>([]);

const dataSourceCopy = shallowRef<DT[]>([...props.dataSource]);

/**
 * 列唯一键
 * @param col
 */
const colKeyGen = computed(() => {
    if (typeof props.colKey === 'function') {
        return (col: StkTableColumn<DT>) => (props.colKey as (col: StkTableColumn<DT>) => string)(col);
    } else {
        return (col: StkTableColumn<DT>) => (col as any)[props.colKey as string];
    }
});

/**高亮帧间隔 
const highlightStepDuration = Highlight_Color_Change_Freq / 1000 + 's';*/

/** 空单元格占位字符 */
const getEmptyCellText = computed(() => {
    if (typeof props.emptyCellText === 'string') {
        return () => props.emptyCellText;
    } else {
        return (col: StkTableColumn<DT>, row: DT) => (props.emptyCellText as any)({ row, col });
    }
});

/** rowKey缓存 */
const rowKeyGenStore = new WeakMap();

const { isColResizing, onThResizeMouseDown } = useColResize({
    props,
    emits,
    colKeyGen,
    colResizeIndicatorRef,
    tableContainerRef,
    tableHeaderLast,
});

const { onThDragStart, onThDragOver, onThDrop, isHeaderDraggable } = useThDrag({ props, emits });

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
} = useVirtualScroll({ tableContainerRef, theadRef, props, dataSourceCopy, tableHeaderLast, tableHeaders });

/** 获取固定列的位置 */
const getFixedColPosition = useGetFixedColPosition({ colKeyGen, tableHeaders });

const getFixedStyle = useFixedStyle<DT>({
    props,
    isRelativeMode,
    getFixedColPosition,
    virtualScroll,
    virtualScrollX,
    virtualX_on,
    virtualX_offsetRight,
});

/**
 * 高亮行，高亮单元格
 */
const { highlightSteps, setHighlightDimCell, setHighlightDimRow } = useHighlight({ props, stkTableId, tableContainerRef });

if (props.autoResize) {
    useAutoResize({ tableContainerRef, initVirtualScroll, props, debounceMs: 200 });
}

/** 键盘箭头滚动 */
useKeyboardArrowScroll(tableContainerRef, {
    props,
    scrollTo,
    virtualScroll,
    virtualScrollX,
    tableHeaders,
    virtual_on,
});

/** 固定列处理 */
const { fixedColClassMap, updateFixedShadow } = useFixedCol({
    props,
    colKeyGen,
    getFixedColPosition,
    tableContainerRef,
    tableHeaders,
    tableHeaderLast,
});

watch(
    () => props.columns,
    () => {
        dealColumns();
        // initVirtualScrollX 需要获取容器滚动宽度等。必须等渲染完成后再调用。因此使用nextTick。
        nextTick(() => {
            initVirtualScrollX();
            updateFixedShadow();
        });
    },
);
watch(
    () => props.virtualX,
    () => {
        dealColumns();
        // initVirtualScrollX 需要获取容器滚动宽度等。必须等渲染完成后再调用。因此使用nextTick。
        nextTick(() => {
            initVirtualScrollX();
            updateFixedShadow();
        });
    },
);

watch(
    () => props.dataSource,
    val => {
        if (!val) {
            console.warn('invalid dataSource');
            return;
        }
        /** 是否需要更新ScrollY，这里由于watch newValue与oldValue 的长度一样，因此需要这样使用 */
        let needInitVirtualScrollY = false;
        if (dataSourceCopy.value.length !== val.length) {
            needInitVirtualScrollY = true;
        }
        dataSourceCopy.value = [...val];
        // 数据长度没变则不计算虚拟滚动
        if (needInitVirtualScrollY) {
            // 表格渲染后再执行。initVirtualScrollY 中有获取dom的操作。
            nextTick(() => initVirtualScrollY());
        }

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

watch(
    () => props.fixedColShadow,
    () => updateFixedShadow(),
);

dealColumns();

onMounted(() => {
    initVirtualScroll();
    updateFixedShadow();
    dealDefaultSorter();
});

/** 处理默认排序 */
function dealDefaultSorter() {
    if (!props.sortConfig.defaultSort) return;
    const { dataIndex, order, silent } = { silent: false, ...props.sortConfig.defaultSort };
    setSorter(dataIndex as string, order, { force: false, silent });
}

/**
 * 处理多级表头
 */
function dealColumns() {
    // reset
    let tableHeadersTemp: StkTableColumn<DT>[][] = [];
    let copyColumn = props.columns; // do not deep clone
    // relative 模式下不支持sticky列。因此就放在左右两侧。
    if (isRelativeMode.value) {
        let leftCol: StkTableColumn<DT>[] = [];
        let centerCol: StkTableColumn<DT>[] = [];
        let rightCol: StkTableColumn<DT>[] = [];
        copyColumn.forEach(col => {
            if (col.fixed === 'left') {
                leftCol.push(col);
            } else if (col.fixed === 'right') {
                rightCol.push(col);
            } else {
                centerCol.push(col);
            }
        });
        copyColumn = [...leftCol, ...centerCol, ...rightCol];
    }
    const deep = howDeepTheHeader(copyColumn);
    const tempHeaderLast: StkTableColumn<DT>[] = [];

    if (deep > 1 && props.virtualX) {
        console.error('多级表头不支持横向虚拟滚动');
    }

    /**
     * 展开columns
     * @param arr
     * @param depth 深度
     * @param parent 父节点引用，用于构建双向链表。
     * @param parentFixed 父节点固定列继承。
     */
    function flat(arr: StkTableColumn<DT>[], parent: StkTableColumn<DT> | null, depth = 0 /* , parentFixed: 'left' | 'right' | null = null */) {
        if (!tableHeadersTemp[depth]) {
            tableHeadersTemp[depth] = [];
        }
        /** 所有子节点数量 */
        let allChildrenLen = 0;
        let allChildrenWidthSum = 0;
        arr.forEach(col => {
            // TODO: 继承父节点固定列配置
            // if (parentFixed) {
            //     col.fixed = parentFixed;
            // }
            // 构建指向父节点的引用
            col.__PARENT__ = parent;
            /** 一列中的子节点数量 */
            let colChildrenLen = 1;
            /** 多级表头的父节点宽度，通过叶子节点宽度计算得到 */
            let colWidth = 0;
            if (col.children) {
                // DFS
                const [len, widthSum] = flat(col.children, col, depth + 1 /* , col.fixed */);
                colChildrenLen = len;
                colWidth = widthSum;
            } else {
                colWidth = getColWidth(col);
                tempHeaderLast.push(col); // 没有children的列作为colgroup
            }
            // 回溯
            tableHeadersTemp[depth].push(col);
            const rowSpan = col.children ? 1 : deep - depth;
            const colSpan = colChildrenLen;
            if (rowSpan !== 1) {
                col.rowSpan = rowSpan;
            }
            if (colSpan !== 1) {
                col.colSpan = colSpan;
            }
            col.__WIDTH__ = colWidth; //记录计算的列宽
            allChildrenLen += colChildrenLen;
            allChildrenWidthSum += colWidth;
        });
        return [allChildrenLen, allChildrenWidthSum];
    }

    flat(copyColumn, null);

    tableHeaders.value = tableHeadersTemp;
    tableHeaderLast.value = tempHeaderLast;
}

/**
 * 行唯一值生成
 */
function rowKeyGen(row: DT | null | undefined) {
    if (!row) return row;
    let key = rowKeyGenStore.get(row);
    if (!key) {
        key = typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey];

        if (key === void 0) {
            // key为undefined时，不应该高亮行。因此重新生成key
            key = Math.random().toString();
        }
        rowKeyGenStore.set(row, key);
    }
    return key;
}

/** 单元格样式 */
const cellStyleMap = computed(() => {
    const thMap = new Map();
    const tdMap = new Map();
    tableHeaders.value.forEach((cols, depth) => {
        cols.forEach(col => {
            const colKey = colKeyGen.value(col);
            const width = props.virtualX ? getCalculatedColWidth(col) + 'px' : transformWidthToStr(col.width);
            const style: CSSProperties = {
                width,
            };
            if (props.colResizable) {
                // 如果要调整列宽，列宽必须固定。
                style.minWidth = width;
                style.maxWidth = width;
            } else {
                style.minWidth = transformWidthToStr(col.minWidth) ?? width;
                style.maxWidth = transformWidthToStr(col.maxWidth) ?? width;
            }

            thMap.set(colKey, {
                ...style,
                ...getFixedStyle(TagType.TH, col, depth),
                textAlign: col.headerAlign,
            });
            tdMap.set(colKey, {
                ...style,
                ...getFixedStyle(TagType.TD, col, depth),
                textAlign: col.align,
            });
        });
    });
    return {
        [TagType.TH]: thMap,
        [TagType.TD]: tdMap,
    };
});

/** th title */
function getHeaderTitle(col: StkTableColumn<DT>): string {
    // 不展示title
    if (props.hideHeaderTitle === true || (Array.isArray(props.hideHeaderTitle) && props.hideHeaderTitle.includes(col.dataIndex))) {
        return '';
    }
    return col.title || '';
}

/**
 * 表头点击排序
 * @param click 是否为点击表头触发
 * @param options.force sort-remote 开启后是否强制排序
 * @param options.emit 是否触发回调
 */
function onColumnSort(col?: StkTableColumn<DT>, click = true, options: { force?: boolean; emit?: boolean } = {}) {
    if (!col?.sorter) return;
    options = { force: false, emit: false, ...options };
    if (sortCol.value !== col.dataIndex) {
        // 改变排序的列时，重置排序
        sortCol.value = col.dataIndex;
        sortOrderIndex.value = 0;
    }
    if (click) sortOrderIndex.value++;
    sortOrderIndex.value = sortOrderIndex.value % 3;

    let order = sortSwitchOrder[sortOrderIndex.value];
    const sortConfig = props.sortConfig;
    const defaultSort = sortConfig.defaultSort;

    if (!order && defaultSort) {
        // 没有排序时变成默认排序
        order = defaultSort.order;
        sortOrderIndex.value = sortSwitchOrder.indexOf(order);
        sortCol.value = defaultSort.dataIndex as string;
    }
    if (!props.sortRemote || options.force) {
        dataSourceCopy.value = tableSort(col, order, props.dataSource, sortConfig);
    }
    // 只有点击才触发事件
    if (click || options.emit) {
        emits('sort-change', col, order, toRaw(dataSourceCopy.value), sortConfig);
    }
}

function onRowClick(e: MouseEvent, row: DT) {
    emits('row-click', e, row);
    const isCurrentRow = props.rowKey ? currentRowKey.value === rowKeyGen(row) : currentRow.value === row;
    if (isCurrentRow) {
        if (!props.rowCurrentRevokable) {
            // 不可取消
            return;
        }
        // 点击同一行，取消当前选中行。
        currentRow.value = void 0;
        currentRowKey.value = void 0;
        emits('current-change', e, row, { select: false });
    } else {
        currentRow.value = row;
        currentRowKey.value = rowKeyGen(row);
        emits('current-change', e, row, { select: true });
    }
}

function onRowDblclick(e: MouseEvent, row: DT) {
    emits('row-dblclick', e, row);
}

/** 表头行右键 */
function onHeaderMenu(e: MouseEvent) {
    emits('header-row-menu', e);
}

/** 表体行右键 */
function onRowMenu(e: MouseEvent, row: DT) {
    emits('row-menu', e, row);
}

/** 单元格单击 */
function onCellClick(e: MouseEvent, row: DT, col: StkTableColumn<DT>) {
    emits('cell-click', e, row, col);
}

/** 表头单元格单击 */
function onHeaderCellClick(e: MouseEvent, col: StkTableColumn<DT>) {
    emits('header-cell-click', e, col);
}

/** td mouseenter */
function onCellMouseEnter(e: MouseEvent, row: DT, col: StkTableColumn<DT>) {
    // currentColHoverKey.value = colKeyGen(col);
    emits('cell-mouseenter', e, row, col);
}

/** td mouseleave */
function onCellMouseLeave(e: MouseEvent, row: DT, col: StkTableColumn<DT>) {
    // currentColHoverKey.value = null;
    emits('cell-mouseleave', e, row, col);
}

/** td mouseover event */
function onCellMouseOver(e: MouseEvent, row: DT, col: StkTableColumn<DT>) {
    emits('cell-mouseover', e, row, col);
}

/**
 * 鼠标滚轮事件监听。代理滚轮事件，防止滚动过快出现白屏。
 * @param e
 */
function onTableWheel(e: WheelEvent) {
    if (isColResizing.value) {
        // 正在调整列宽时，不允许用户滚动
        e.stopPropagation();
        return;
    }
    // #region ---- 控制滚动，防止出现白屏--
    const dom = tableContainerRef.value;
    if (!dom) return;
    const { containerHeight, scrollTop, scrollHeight, rowHeight } = virtualScroll.value;
    const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
    /** 是否滚动在下面 */
    const isScrollBottom = scrollHeight - containerHeight - scrollTop < rowHeight;
    /** 是否滚动在右侧 */
    const isScrollRight = scrollWidth - containerWidth - scrollLeft < 100;
    const { deltaY, deltaX } = e;

    /**
     * 只有虚拟滚动时，才要用 wheel 代理scroll，防止滚动过快导致的白屏。
     * 滚动条在边界情况时，not preventDefault 。因为会阻塞父级滚动条滚动。
     */
    if (virtual_on && deltaY) {
        if ((deltaY > 0 && !isScrollBottom) || (deltaY < 0 && scrollTop > 0)) {
            e.preventDefault();
        }
        dom.scrollTop += deltaY;
    }
    if (virtualX_on && deltaX) {
        if ((deltaX > 0 && !isScrollRight) || (deltaX < 0 && scrollLeft > 0)) {
            e.preventDefault();
        }
        dom.scrollLeft += deltaX;
    }
    //#endregion
}

/**
 * 滚动条监听
 * @param e scrollEvent
 */
function onTableScroll(e: Event) {
    if (!e?.target) return;

    const { scrollTop, scrollLeft } = e.target as HTMLElement;
    const { scrollTop: vScrollTop } = virtualScroll.value;
    const { scrollLeft: vScrollLeft } = virtualScrollX.value;
    const isYScroll = scrollTop !== vScrollTop;
    const isXScroll = scrollLeft !== vScrollLeft;

    // 纵向滚动有变化
    if (isYScroll) {
        updateVirtualScrollY(scrollTop);
    }

    // 横向滚动有变化
    if (isXScroll) {
        if (virtualX_on.value) {
            updateVirtualScrollX(scrollLeft);
        } else {
            // 非虚拟滚动也记录一下滚动条位置。用于判断isXScroll
            virtualScrollX.value.scrollLeft = scrollLeft;
        }
        updateFixedShadow(virtualScrollX);
    }

    const { startIndex, endIndex } = virtualScroll.value;
    const data = { startIndex, endIndex };
    if (isYScroll) {
        emits('scroll', e, data);
    }
    if (isXScroll) {
        emits('scroll-x', e);
    }
}

/** tr hover事件 */
function onTrMouseOver(_e: MouseEvent, row: DT) {
    if (currentHoverRow === row) return;
    currentHoverRow = row;
    currentHoverRowKey.value = rowKeyGen(row);
}

/**
 * 选中一行，
 * @param {string} rowKey selected rowKey, null to unselect
 * @param {boolean} option.silent 是否触发回调
 */
function setCurrentRow(rowKey: string, option = { silent: false }) {
    if (!dataSourceCopy.value.length) return;
    currentRow.value = dataSourceCopy.value.find(it => rowKeyGen(it) === rowKey);
    currentRowKey.value = rowKeyGen(currentRow.value);
    if (!option.silent) {
        emits('current-change', /** no Event */ null, currentRow.value, { select: Boolean(currentRowKey.value) });
    }
}

/**
 * 设置表头排序状态
 * @param dataIndex 列字段
 * @param order 正序倒序
 * @param option.sortOption 指定排序参数。同 StkTableColumn 中排序相关字段。建议从columns中find得到。
 * @param option.sort 是否触发排序-默认true
 * @param option.silent 是否禁止触发回调-默认true
 * @param option.force 是否触发排序-默认true
 */
function setSorter(dataIndex: string, order: Order, option: { sortOption?: SortOption<DT>; force?: boolean; silent?: boolean; sort?: boolean } = {}) {
    const newOption = { silent: true, sortOption: null, sort: true, ...option };
    sortCol.value = dataIndex;
    sortOrderIndex.value = sortSwitchOrder.indexOf(order);

    if (newOption.sort && dataSourceCopy.value?.length) {
        // 如果表格有数据，则进行排序
        const column = newOption.sortOption || tableHeaderLast.value.find(it => it.dataIndex === sortCol.value);
        if (column) onColumnSort(column, false, { force: option.force ?? true, emit: !newOption.silent });
        else console.warn('Can not find column by dataIndex:', sortCol.value);
    }
    return dataSourceCopy.value;
}

/** 重置排序 */
function resetSorter() {
    sortCol.value = void 0;
    sortOrderIndex.value = 0;
    dataSourceCopy.value = [...props.dataSource];
}

/**
 * 设置滚动条位置
 * @param top 传null 则不变动位置
 * @param left 传null 则不变动位置
 */
function scrollTo(top: number | null = 0, left: number | null = 0) {
    if (!tableContainerRef.value) return;
    if (top !== null) tableContainerRef.value.scrollTop = top;
    if (left !== null) tableContainerRef.value.scrollLeft = left;
}

/** 获取当前状态的表格数据 */
function getTableData() {
    return toRaw(dataSourceCopy.value);
}

/** 获取当前排序列的信息 */
function getSortColumns(): Partial<SortState<DT>>[] {
    const sortOrder = sortSwitchOrder[sortOrderIndex.value];
    if (!sortOrder) return [];
    return [{ dataIndex: sortCol.value, order: sortOrder }];
}

defineExpose({
    /** 初始化横向纵向虚拟滚动 */
    initVirtualScroll,
    /** 初始化横向虚拟滚动 */
    initVirtualScrollX,
    /** 初始化纵向虚拟滚动 */
    initVirtualScrollY,
    /** 设置当前选中行 */
    setCurrentRow,
    /** 设置高亮渐暗单元格 */
    setHighlightDimCell,
    /** 设置高亮渐暗行 */
    setHighlightDimRow,
    /** 表格排序列dataIndex */
    sortCol,
    /** 获取当前排序状态 */
    getSortColumns,
    /** 设置排序 */
    setSorter,
    /** 重置排序 */
    resetSorter,
    /** 滚动至 */
    scrollTo,
    /** 获取表格数据 */
    getTableData,
});
</script>
