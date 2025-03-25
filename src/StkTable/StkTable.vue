<!-- eslint-disable vue/attribute-hyphenation -->
<template>
    <div
        ref="tableContainerRef"
        class="stk-table"
        :class="{
            virtual,
            'virtual-x': virtualX,
            'vt-on': virtual_on,
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
            'cell-active': props.cellActive,
            'row-hover': props.rowHover,
            'row-active': props.rowActive,
            'text-overflow': props.showOverflow,
            'header-text-overflow': props.showHeaderOverflow,
            'fixed-relative-mode': isRelativeMode,
            'auto-row-height': props.autoRowHeight,
            'scroll-row-by-row': props.scrollRowByRow,
        }"
        :style="{
            '--row-height': props.autoRowHeight ? void 0 : virtualScroll.rowHeight + 'px',
            '--header-row-height': props.headerRowHeight + 'px',
            '--highlight-duration': props.highlightConfig.duration && props.highlightConfig.duration + 's',
            '--highlight-timing-function': highlightSteps ? `steps(${highlightSteps})` : '',
        }"
        @scroll="onTableScroll"
        @wheel="onTableWheel"
    >
        <!-- 这个元素用于整数行虚拟滚动时，撑开父容器的高度） -->
        <div
            v-if="props.scrollRowByRow && virtual"
            class="row-by-row-table-height"
            :style="{ height: dataSourceCopy.length * virtualScroll.rowHeight + 'px' }"
        ></div>

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
                        class="vt-x-left"
                        :style="`min-width:${virtualScrollX.offsetLeft}px;width:${virtualScrollX.offsetLeft}px`"
                    ></th>
                    <!-- v for中最后一行才用 切割。TODO:不支持多级表头虚拟横向滚动 -->
                    <th
                        v-for="(col, colIndex) in virtualX_on && rowIndex === tableHeaders.length - 1 ? virtualX_columnPart : row"
                        :key="colKeyGen(col)"
                        :data-col-key="colKeyGen(col)"
                        :draggable="isHeaderDraggable(col) ? 'true' : 'false'"
                        :rowspan="virtualX_on ? 1 : col.rowSpan"
                        :colspan="col.colSpan"
                        :style="cellStyleMap[TagType.TH].get(colKeyGen(col))"
                        :title="getHeaderTitle(col)"
                        :class="[
                            col.sorter ? 'sortable' : '',
                            colKeyGen(col) === sortCol && sortOrderIndex !== 0 && 'sorter-' + sortSwitchOrder[sortOrderIndex],
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
                        <div class="table-header-cell-wrapper" :style="{ '--row-span': virtualX_on ? 1 : col.rowSpan }">
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
                                <SortIcon />
                            </span>
                            <!-- 列宽拖动handler -->
                            <div
                                v-if="colResizeOn(col) && colIndex > 0"
                                class="table-header-resizer left"
                                @mousedown="e => onThResizeMouseDown(e, col, true)"
                            ></div>
                            <div v-if="colResizeOn(col)" class="table-header-resizer right" @mousedown="e => onThResizeMouseDown(e, col)"></div>
                        </div>
                    </th>
                    <!-- 这个th用于横向虚拟滚动表格右边距 width、maxWidth 用于兼容低版本浏览器-->
                    <th v-if="virtualX_on" class="vt-x-right" :style="`min-width:${virtualX_offsetRight}px;width:${virtualX_offsetRight}px`"></th>
                </tr>
            </thead>

            <!-- 用于虚拟滚动表格内容定位 @deprecated 有兼容问题-->
            <!-- <tbody v-if="virtual_on" :style="{ height: `${virtualScroll.offsetTop}px` }"></tbody> -->
            <!-- <tbody :style="{ transform: `translateY(${virtualScroll.offsetTop}px)` }"> -->
            <tbody class="stk-tbody-main" @dragover="onTrDragOver" @dragenter="onTrDragEnter" @dragend="onTrDragEnd">
                <tr v-if="virtual_on && !props.scrollRowByRow" :style="`height:${virtualScroll.offsetTop}px`" class="padding-top-tr">
                    <!--这个td用于配合虚拟滚动的th对应，防止列错位-->
                    <td v-if="virtualX_on && fixedMode && headless" class="vt-x-left"></td>
                    <template v-if="fixedMode && headless">
                        <td v-for="col in virtualX_columnPart" :key="colKeyGen(col)" :style="cellStyleMap[TagType.TD].get(colKeyGen(col))"></td>
                    </template>
                </tr>
                <tr
                    v-for="(row, rowIndex) in virtual_dataSourcePart"
                    :id="stkTableId + '-' + (rowKey ? rowKeyGen(row) : (virtual_on ? virtualScroll.startIndex : 0) + rowIndex)"
                    ref="trRef"
                    :key="rowKey ? rowKeyGen(row) : (virtual_on ? virtualScroll.startIndex : 0) + rowIndex"
                    :data-row-key="rowKey ? rowKeyGen(row) : (virtual_on ? virtualScroll.startIndex : 0) + rowIndex"
                    :class="{
                        active: rowKey ? rowKeyGen(row) === currentRowKey : row === currentRow,
                        hover: props.showTrHoverClass && (rowKey ? rowKeyGen(row) === currentHoverRowKey : row === currentHoverRowKey),
                        [rowClassName(row, (virtual_on ? virtualScroll.startIndex : 0) + rowIndex)]: true,
                        expanded: row?.__EXPANDED__,
                        'expanded-row': row && row.__EXPANDED_ROW__,
                    }"
                    :style="{
                        '--row-height':
                            row && row.__EXPANDED_ROW__ && props.virtual && props.expandConfig?.height && props.expandConfig?.height + 'px',
                    }"
                    @click="e => onRowClick(e, row)"
                    @dblclick="e => onRowDblclick(e, row)"
                    @contextmenu="e => onRowMenu(e, row)"
                    @mouseover="e => onTrMouseOver(e, row)"
                    @drop="e => onTrDrop(e, (virtual_on ? virtualScroll.startIndex : 0) + rowIndex)"
                >
                    <!--这个td用于配合虚拟滚动的th对应，防止列错位-->
                    <td v-if="virtualX_on" class="vt-x-left"></td>
                    <td v-if="row && row.__EXPANDED_ROW__" :colspan="virtualX_columnPart.length">
                        <!-- TODO: support wheel -->
                        <div class="table-cell-wrapper">
                            <slot name="expand" :row="row.__EXPANDED_ROW__" :col="row.__EXPANDED_COL__">
                                {{ row.__EXPANDED_ROW__?.[row.__EXPANDED_COL__.dataIndex] ?? '' }}
                            </slot>
                        </div>
                    </td>
                    <template v-else>
                        <td
                            v-for="(col, colIndex) in virtualX_columnPart"
                            :key="colKeyGen(col)"
                            :data-cell-key="cellKeyGen(row, col)"
                            :style="cellStyleMap[TagType.TD].get(colKeyGen(col))"
                            :class="[
                                col.className,
                                fixedColClassMap.get(colKeyGen(col)),
                                {
                                    'seq-column': col.type === 'seq',
                                    active: currentSelectedCellKey === cellKeyGen(row, col),
                                    'expand-cell': col.type === 'expand',
                                    expanded: col.type === 'expand' && colKeyGen(row?.__EXPANDED__) === colKeyGen(col),
                                    'drag-row-cell': col.type === 'dragRow',
                                },
                            ]"
                            @click="e => onCellClick(e, row, col)"
                            @mousedown="e => onCellMouseDown(e, row, col)"
                            @mouseenter="e => onCellMouseEnter(e, row, col)"
                            @mouseleave="e => onCellMouseLeave(e, row, col)"
                            @mouseover="e => onCellMouseOver(e, row, col)"
                        >
                            <component
                                :is="col.customCell"
                                v-if="col.customCell"
                                class="table-cell-wrapper"
                                :col="col"
                                :row="row"
                                :rowIndex="(virtual_on ? virtualScroll.startIndex : 0) + rowIndex"
                                :colIndex="colIndex"
                                :cellValue="row?.[col.dataIndex]"
                                :expanded="row?.__EXPANDED__ || null"
                            />
                            <div
                                v-else
                                class="table-cell-wrapper"
                                :class="{ 'expanded-cell-wrapper': col.type === 'expand' }"
                                :title="col.type !== 'seq' ? row?.[col.dataIndex] : ''"
                            >
                                <template v-if="col.type === 'seq'">
                                    {{ (props.seqConfig.startIndex || 0) + (virtual_on ? virtualScroll.startIndex : 0) + rowIndex + 1 }}
                                </template>
                                <span v-else-if="col.type === 'expand'">
                                    {{ row?.[col.dataIndex] ?? '' }}
                                </span>
                                <template v-else-if="col.type === 'dragRow'">
                                    <DragHandle @dragstart="e => onTrDragStart(e, (virtual_on ? virtualScroll.startIndex : 0) + rowIndex)" />
                                    <span>
                                        {{ row?.[col.dataIndex] ?? '' }}
                                    </span>
                                </template>
                                <template v-else>
                                    {{ row?.[col.dataIndex] ?? getEmptyCellText(col, row) }}
                                </template>
                            </div>
                        </td>
                    </template>
                </tr>
                <tr v-if="virtual_on && !props.scrollRowByRow" :style="`height: ${virtual_offsetBottom}px`"></tr>
            </tbody>
        </table>
        <div v-if="(!dataSourceCopy || !dataSourceCopy.length) && showNoData" class="stk-table-no-data" :class="{ 'no-data-full': noDataFull }">
            <slot name="empty">暂无数据</slot>
        </div>
        <slot name="customBottom"></slot>
    </div>
</template>

<script setup lang="ts">
/**
 * @author japlus
 */
import { CSSProperties, computed, nextTick, onMounted, ref, shallowRef, toRaw, watch } from 'vue';
import DragHandle from './components/DragHandle.vue';
import SortIcon from './components/SortIcon.vue';
import { CELL_KEY_SEPARATE, DEFAULT_ROW_HEIGHT, DEFAULT_SMOOTH_SCROLL, EXPANDED_ROW_KEY_PREFIX, IS_LEGACY_MODE } from './const';
import {
    AutoRowHeightConfig,
    DragRowConfig,
    ExpandConfig,
    ExpandedRow,
    HeaderDragConfig,
    HighlightConfig,
    Order,
    PrivateRowDT,
    PrivateStkTableColumn,
    SeqConfig,
    SortConfig,
    SortOption,
    StkTableColumn,
    TagType,
    UniqKeyProp,
    ColResizableConfig,
} from './types/index';
import { useAutoResize } from './useAutoResize';
import { useColResize } from './useColResize';
import { useFixedCol } from './useFixedCol';
import { useFixedStyle } from './useFixedStyle';
import { useGetFixedColPosition } from './useGetFixedColPosition';
import { useHighlight } from './useHighlight';
import { useKeyboardArrowScroll } from './useKeyboardArrowScroll';
import { useThDrag } from './useThDrag';
import { useTrDrag } from './useTrDrag';
import { useVirtualScroll } from './useVirtualScroll';
import { createStkTableId, getCalculatedColWidth, getColWidth } from './utils/constRefUtils';
import { howDeepTheHeader, tableSort, transformWidthToStr } from './utils/index';

/** Generic stands for DataType */
type DT = any & PrivateRowDT;

/** generate table instance id */
const stkTableId = createStkTableId();

/**
 * props cannot be placed in a separate file. It will cause compilation errors with vue 2.7 compiler.
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
        /**
         * 行高
         * - `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。
         */
        rowHeight?: number;
        /**
         * 是否可变行高
         * - 设置为 `true` 时, `props.rowHeight` 将表示为期望行高，用于计算。不再影响实际行高。
         */
        autoRowHeight?: boolean | AutoRowHeightConfig<DT>;
        /** 是否高亮鼠标悬浮的行 */
        rowHover?: boolean;
        /** 是否高亮选中的行 */
        rowActive?: boolean;
        /** 当前行再次点击否可以取消 (rowActive=true)*/
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
        /** 是否高亮选中的单元格 */
        cellActive?: boolean;
        /** 单元格再次点击否可以取消选中 (cellActive=true)*/
        selectedCellRevokable?: boolean;
        /** 表头是否可拖动。支持回调函数。 */
        headerDrag?: HeaderDragConfig;
        /**
         * 给行附加className<br>
         * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
         */
        rowClassName?: (row: DT, i: number) => string;
        /**
         * 列宽是否可拖动(需要设置v-model:columns)<br>
         * **不要设置**列minWidth，**必须**设置width<br>
         * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
         * - 会自动更新props.columns中的with属性
         */
        colResizable?: boolean | ColResizableConfig<DT>;
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
        /** 隐藏头部title。可传入colKey数组 */
        hideHeaderTitle?: boolean | string[];
        /** 高亮配置 */
        highlightConfig?: HighlightConfig;
        /** 序号列配置 */
        seqConfig?: SeqConfig;
        /** 展开行配置 */
        expandConfig?: ExpandConfig;
        /** 行拖动配置 */
        dragRowConfig?: DragRowConfig;
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
        /**
         * 是否平滑滚动。default: chrome < 85 || chrome > 120 ? true : false
         * - false: 使用 onwheel 滚动。为了防止滚动过快导致白屏。
         * - true: 不使用 onwheel 滚动。鼠标滚轮滚动时更加平滑。滚动过快时会白屏。
         */
        smoothScroll?: boolean;
        /** 按整数行纵向滚动 */
        scrollRowByRow?: boolean;
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
        autoRowHeight: false,
        rowHover: true,
        rowActive: true,
        rowCurrentRevokable: true,
        headerRowHeight: DEFAULT_ROW_HEIGHT,
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
        cellActive: false,
        selectedCellRevokable: true,
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
            stringLocaleCompare: false,
        }),
        hideHeaderTitle: false,
        highlightConfig: () => ({}),
        seqConfig: () => ({}),
        expandConfig: () => ({}),
        dragRowConfig: () => ({}),
        cellFixedMode: 'sticky',
        smoothScroll: DEFAULT_SMOOTH_SCROLL,
        scrollRowByRow: false,
    },
);

const emits = defineEmits<{
    /**
     * 排序变更触发。defaultSort.dataIndex 找不到时，col 将返回null。
     *
     * ```(col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>)```
     */
    (e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>): void;
    /**
     * 一行点击事件
     *
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-click', ev: MouseEvent, row: DT): void;
    /**
     * 选中一行触发。ev返回null表示不是点击事件触发的
     *
     * ```(ev: MouseEvent | null, row: DT | undefined, data: { select: boolean })```
     */
    (e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void;
    /**
     * 选中单元格触发。ev返回null表示不是点击事件触发的
     *
     * ```(ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | null })```
     */
    (e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | undefined }): void;
    /**
     * 行双击事件
     *
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-dblclick', ev: MouseEvent, row: DT): void;
    /**
     * 表头右键事件
     *
     * ```(ev: MouseEvent)```
     */
    (e: 'header-row-menu', ev: MouseEvent): void;
    /**
     * 表体行右键点击事件
     *
     * ```(ev: MouseEvent, row: DT)```
     */
    (e: 'row-menu', ev: MouseEvent, row: DT): void;
    /**
     * 单元格点击事件
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格鼠标进入事件
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格鼠标移出事件
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格悬浮事件
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 单元格鼠标按下事件
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>)```
     */
    (e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void;
    /**
     * 表头单元格点击事件
     *
     * ```(ev: MouseEvent, col: StkTableColumn<DT>)```
     */
    (e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void;
    /**
     * 表格滚动事件
     *
     * ```(ev: Event, data: { startIndex: number; endIndex: number })```
     */
    (e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void;
    /**
     * 表格横向滚动事件
     *
     * ```(ev: Event)```
     */
    (e: 'scroll-x', ev: Event): void;
    /**
     * 表头列拖动事件
     *
     * ```(dragStartKey: string, targetColKey: string)```
     */
    (e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
    /**
     * 表头列拖动开始
     *
     * ```(dragStartKey: string)```
     */
    (e: 'th-drag-start', dragStartKey: string): void;
    /**
     * 表头列拖动drop
     *
     * ```(targetColKey: string)```
     */
    (e: 'th-drop', targetColKey: string): void;
    /**
     * 行拖动事件
     *
     * ```(dragStartKey: string, targetRowKey: string)```
     */
    (e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
    /**
     * 列宽变动时触发
     *
     *  ```(col: StkTableColumn<DT>)```
     */
    (e: 'col-resize', col: StkTableColumn<DT>): void;
    /**
     * 展开行触发
     *
     * ```( data: { expanded: boolean; row: DT; col: StkTableColumn<DT> })```
     */
    (e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
    /**
     * v-model:columns col resize 时更新宽度
     */
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
const trRef = ref<HTMLTableRowElement[]>();

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
const currentRowKey = ref<any>(void 0);
/** 当前选中的单元格key  */
const currentSelectedCellKey = ref<any>(void 0);
/** 当前hover行 */
let currentHoverRow: DT | null = null;
/** 当前hover的行的key */
const currentHoverRowKey = ref(null);
/** 当前hover的列的key */
// const currentColHoverKey = ref(null);

/** sort colKey*/
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

/**
 * 用于计算多级表头的tableHeaders。模拟rowSpan 位置的辅助数组。用于计算固定列。
 * @eg
 * ```
 * |             colspan3               |
 * | rowspan2 |       colspan2          |
 * | rowspan2 |  colspan1 |  colspan1   |
 * ```
 * ---
 * expect arr:
 * ```
 * const arr = [
 *  [col],
 *  [col2, col3],
 *  [col2, col4, col5],
 * ]
 * ```
 */
const tableHeadersForCalc = shallowRef<PrivateStkTableColumn<DT>[][]>([]);

const dataSourceCopy = shallowRef<DT[]>(props.dataSource.slice());

const rowKeyGenComputed = computed(() => {
    const { rowKey } = props;
    if (typeof rowKey === 'function') {
        return (row: DT) => (rowKey as (row: DT) => string)(row);
    } else {
        return (row: DT) => (row as any)[rowKey];
    }
});

const colKeyGen = computed<(col: StkTableColumn<DT>) => string>(() => {
    const { colKey } = props;
    if (typeof colKey === 'function') {
        return col => (colKey as (col: StkTableColumn<DT>) => string)(col);
    } else {
        return col => (col as any)[colKey];
    }
});

const getEmptyCellText = computed(() => {
    const { emptyCellText } = props;
    if (typeof emptyCellText === 'string') {
        return () => emptyCellText;
    } else {
        return (col: StkTableColumn<DT>, row: DT) => emptyCellText({ row, col });
    }
});

/** rowKey缓存 */
const rowKeyGenStore = new WeakMap();

const { onThDragStart, onThDragOver, onThDrop, isHeaderDraggable } = useThDrag({ props, emits, colKeyGen });

const { onTrDragStart, onTrDrop, onTrDragOver, onTrDragEnd, onTrDragEnter } = useTrDrag({ props, emits, dataSourceCopy });

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
    setAutoHeight,
    clearAllAutoHeight,
} = useVirtualScroll({ tableContainerRef, trRef, props, dataSourceCopy, tableHeaderLast, tableHeaders, rowKeyGen });

/** 获取固定列的位置 */
const getFixedColPosition = useGetFixedColPosition({ colKeyGen, tableHeadersForCalc });

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
const { fixedCols, fixedColClassMap, updateFixedShadow } = useFixedCol({
    props,
    colKeyGen,
    getFixedColPosition,
    tableContainerRef,
    tableHeaders,
    tableHeadersForCalc,
});

const { isColResizing, onThResizeMouseDown, colResizeOn } = useColResize({
    props,
    emits,
    colKeyGen,
    colResizeIndicatorRef,
    tableContainerRef,
    tableHeaderLast,
    fixedCols,
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
    () => props.virtual,
    () => {
        nextTick(() => {
            initVirtualScrollY();
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
        dataSourceCopy.value = val.slice(); // 浅拷贝
        // 数据长度没变则不计算虚拟滚动
        if (needInitVirtualScrollY) {
            // 表格渲染后再执行。initVirtualScrollY 中有获取dom的操作。
            nextTick(() => initVirtualScrollY());
        }

        if (sortCol.value) {
            // 排序
            const column = tableHeaderLast.value.find(it => colKeyGen.value(it) === sortCol.value);
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
    const { key, dataIndex, order, silent } = { silent: false, ...props.sortConfig.defaultSort };
    setSorter((key || dataIndex) as string, order, { force: false, silent });
}

/**
 * 处理多级表头
 */
function dealColumns() {
    // reset
    const tableHeadersTemp: StkTableColumn<DT>[][] = [];
    const tableHeadersForCalcTemp: StkTableColumn<DT>[][] = [];
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
        copyColumn = leftCol.concat(centerCol).concat(rightCol);
    }
    const maxDeep = howDeepTheHeader(copyColumn);
    const tempHeaderLast: StkTableColumn<DT>[] = [];

    if (maxDeep > 0 && props.virtualX) {
        console.error('多级表头不支持横向虚拟滚动');
    }

    for (let i = 0; i <= maxDeep; i++) {
        tableHeadersTemp[i] = [];
        tableHeadersForCalcTemp[i] = [];
    }

    /**
     * 展开columns
     * @param arr
     * @param depth 深度
     * @param parent 父节点引用，用于构建双向链表。
     * @param parentFixed 父节点固定列继承。
     */
    function flat(
        arr: PrivateStkTableColumn<DT>[],
        parent: PrivateStkTableColumn<DT> | null,
        depth = 0 /* , parentFixed: 'left' | 'right' | null = null */,
    ) {
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
                tableHeadersForCalcTemp[depth].push(col);
            } else {
                colWidth = getColWidth(col);
                tempHeaderLast.push(col); // 没有children的列作为colgroup
                for (let i = depth; i <= maxDeep; i++) {
                    // 如有rowSpan 向下复制一个表头col，用于计算固定列
                    tableHeadersForCalcTemp[i].push(col);
                }
            }
            // 回溯
            col.__WIDTH__ = colWidth; //记录计算的列宽
            tableHeadersTemp[depth].push(col);
            const rowSpan = col.children ? 1 : maxDeep - depth + 1;
            const colSpan = colChildrenLen;
            if (rowSpan > 1) {
                col.rowSpan = rowSpan;
            }
            if (colSpan > 1) {
                col.colSpan = colSpan;
            }

            allChildrenLen += colChildrenLen;
            allChildrenWidthSum += colWidth;
        });
        return [allChildrenLen, allChildrenWidthSum];
    }

    flat(copyColumn, null);
    tableHeaders.value = tableHeadersTemp;
    tableHeaderLast.value = tempHeaderLast;
    tableHeadersForCalc.value = tableHeadersForCalcTemp;
}

/**
 * 行唯一值生成
 */
function rowKeyGen(row: DT | null | undefined) {
    if (!row) return row;
    let key = rowKeyGenStore.get(row) || (row as PrivateRowDT).__ROW_KEY__;
    if (!key) {
        key = rowKeyGenComputed.value(row);

        if (key === void 0) {
            // key为undefined时，不应该高亮行。因此重新生成key
            key = Math.random().toString();
        }
        rowKeyGenStore.set(row, key);
    }
    return key;
}

/** 单元格唯一值 */
function cellKeyGen(row: DT | null | undefined, col: StkTableColumn<DT>) {
    return rowKeyGen(row) + CELL_KEY_SEPARATE + colKeyGen.value(col);
}

/** 单元格样式 */
const cellStyleMap = computed(() => {
    const thMap = new Map();
    const tdMap = new Map();
    const { virtualX, colResizable } = props;
    tableHeaders.value.forEach((cols, depth) => {
        cols.forEach(col => {
            const colKey = colKeyGen.value(col);
            const width = virtualX ? getCalculatedColWidth(col) + 'px' : transformWidthToStr(col.width);
            const style: CSSProperties = {
                width,
            };
            if (colResizable) {
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
    const colKey = colKeyGen.value(col);
    // 不展示title
    if (props.hideHeaderTitle === true || (Array.isArray(props.hideHeaderTitle) && props.hideHeaderTitle.includes(colKey))) {
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
function onColumnSort(col: StkTableColumn<DT> | undefined | null, click = true, options: { force?: boolean; emit?: boolean } = {}) {
    if (!col) {
        console.warn('onColumnSort: col is not found');
        return;
    }
    if (!col.sorter && click) {
        // 点击表头触发的排序，如果列没有配置sorter则不处理。setSorter 触发的排序则保持通行。
        return;
    }
    options = { force: false, emit: false, ...options };
    const colKey = colKeyGen.value(col);
    if (sortCol.value !== colKey) {
        // 改变排序的列时，重置排序
        sortCol.value = colKey;
        sortOrderIndex.value = 0;
    }
    if (click) sortOrderIndex.value++;
    sortOrderIndex.value = sortOrderIndex.value % 3;

    let order = sortSwitchOrder[sortOrderIndex.value];
    const sortConfig = { ...props.sortConfig, ...col.sortConfig };
    const defaultSort = sortConfig.defaultSort;

    if (!order && defaultSort) {
        // if no order ,use default order
        const colKey = defaultSort.key || defaultSort.dataIndex;
        if (!colKey) {
            console.error('sortConfig.defaultSort key or dataIndex is required');
            return;
        }
        order = defaultSort.order || 'desc';
        sortOrderIndex.value = sortSwitchOrder.indexOf(order);
        sortCol.value = colKey as string;
        col = null;
        for (const row of tableHeaders.value) {
            const c = row.find(item => colKeyGen.value(item) === colKey);
            if (c) {
                col = c;
                break;
            }
        }
    }
    if (!props.sortRemote || options.force) {
        const sortOption = col || defaultSort;
        if (sortOption) {
            dataSourceCopy.value = tableSort(sortOption, order, props.dataSource, sortConfig);
        }
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

/**
 * proxy events
 */
// function onTbodyClick(e: MouseEvent, type: 1 | 2) {
//     const el = (e.target as HTMLElement).closest<HTMLElement>('td,tr');
//     if (!el) return;
//     if (el.tagName === 'TD') {
//         const [rowKey, colKey] = el.dataset.cellKey?.split(CELL_KEY_SEPARATE) || [];
//         const row = dataSourceCopy.value.find(item => rowKeyGen(item) === rowKey);
//         const col = tableHeaderLast.value.find(item => colKeyGen.value(item) === colKey);
//         if (col) {
//             if (col.type === 'expand') {
//                 toggleExpandRow(row, col);
//             }
//             if (type === 1) {
//                 onCellClick(e, row, col);
//             } else if (type === 2) {
//                 onCellMouseDown(e, row, col);
//             }
//         }
//         if (type === 1) {
//             onRowClick(e, row);
//         }
//     } else if (el.tagName === 'TR') {
//         const rowKey = el.dataset.rowKey;
//         const row = dataSourceCopy.value.find(item => rowKeyGen(item) === rowKey);
//         onRowClick(e, row);
//     }
// }

/** 单元格单击 */
function onCellClick(e: MouseEvent, row: DT, col: StkTableColumn<DT>) {
    col.type === 'expand' && toggleExpandRow(row, col);
    if (props.cellActive) {
        const cellKey = cellKeyGen(row, col);
        if (props.selectedCellRevokable && currentSelectedCellKey.value === cellKey) {
            currentSelectedCellKey.value = void 0;
            emits('cell-selected', e, { select: false, row, col });
        } else {
            currentSelectedCellKey.value = cellKey;
            emits('cell-selected', e, { select: true, row, col });
        }
    }
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

function onCellMouseDown(e: MouseEvent, row: DT, col: StkTableColumn<DT>) {
    emits('cell-mousedown', e, row, col);
}

/**
 * 鼠标滚轮事件监听。代理滚轮事件，防止滚动过快出现白屏。
 * @param e
 */
function onTableWheel(e: WheelEvent) {
    if (props.smoothScroll) {
        return;
    }
    if (isColResizing.value) {
        // 正在调整列宽时，不允许用户滚动
        e.stopPropagation();
        return;
    }
    // #region ---- 控制滚动，防止出现白屏--
    const dom = tableContainerRef.value;
    if (!dom) return;
    const { containerHeight, scrollTop, scrollHeight } = virtualScroll.value;
    const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
    /** 是否滚动在下面 */
    const isScrollBottom = scrollHeight - containerHeight - scrollTop < 10;
    /** 是否滚动在右侧 */
    const isScrollRight = scrollWidth - containerWidth - scrollLeft < 10;
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

/** tr hover */
function onTrMouseOver(_e: MouseEvent, row: DT) {
    if (currentHoverRow === row) return;
    currentHoverRow = row;
    currentHoverRowKey.value = rowKeyGen(row);
}

/**
 * 选中一行
 * @param {string} rowKeyOrRow selected rowKey, undefined to unselect
 * @param {boolean} option.silent if set true not emit `current-change`. default:false
 */
function setCurrentRow(rowKeyOrRow: string | undefined | DT, option = { silent: false }) {
    if (!dataSourceCopy.value.length) return;
    const select = rowKeyOrRow !== void 0;
    if (!select) {
        currentRow.value = void 0;
        currentRowKey.value = void 0;
    } else if (typeof rowKeyOrRow === 'string') {
        const row = dataSourceCopy.value.find(it => rowKeyGen(it) === rowKeyOrRow);
        if (!row) {
            console.warn('setCurrentRow failed.rowKey:', rowKeyOrRow);
            return;
        }
        currentRow.value = row;
        currentRowKey.value = rowKeyOrRow;
    } else {
        currentRow.value = rowKeyOrRow;
        currentRowKey.value = rowKeyGen(rowKeyOrRow);
    }
    if (!option.silent) {
        emits('current-change', /** no Event */ null, currentRow.value, { select });
    }
}

/**
 * set highlight active cell (props.cellActive=true)
 * @param row row if undefined, clear highlight
 * @param col column
 * @param option.silent if emit current-change. default:false(not emit `current-change`)
 */
function setSelectedCell(row?: DT, col?: StkTableColumn<DT>, option = { silent: false }) {
    if (!dataSourceCopy.value.length) return;
    const select = row !== void 0 && col !== void 0;
    currentSelectedCellKey.value = select ? cellKeyGen(row, col) : void 0;
    if (!option.silent) {
        emits('cell-selected', /** no Event */ null, { row, col, select });
    }
}

/**
 * 设置表头排序状态。
 * @param colKey 列唯一键字段。如果你想要取消排序状态，请使用`resetSorter`
 * @param order 正序倒序
 * @param option.sortOption 指定排序参数。同 StkTableColumn 中排序相关字段。建议从columns中find得到。
 * @param option.sort 是否触发排序-默认true
 * @param option.silent 是否禁止触发回调-默认true
 * @param option.force 是否触发排序-默认true
 * @return 表格数据
 */
function setSorter(colKey: string, order: Order, option: { sortOption?: SortOption<DT>; force?: boolean; silent?: boolean; sort?: boolean } = {}) {
    const newOption = { silent: true, sortOption: null, sort: true, ...option };
    sortCol.value = colKey;
    sortOrderIndex.value = sortSwitchOrder.indexOf(order);

    if (newOption.sort && dataSourceCopy.value?.length) {
        // 如果表格有数据，则进行排序
        const column = newOption.sortOption || tableHeaderLast.value.find(it => colKeyGen.value(it) === sortCol.value);
        if (column) onColumnSort(column, false, { force: option.force ?? true, emit: !newOption.silent });
        else console.warn('Can not find column by key:', sortCol.value);
    }
    return dataSourceCopy.value;
}

function resetSorter() {
    sortCol.value = void 0;
    sortOrderIndex.value = 0;
    dataSourceCopy.value = props.dataSource.slice();
}

/**
 * set scroll bar position
 * @param top null to not change
 * @param left null to not change
 */
function scrollTo(top: number | null = 0, left: number | null = 0) {
    if (!tableContainerRef.value) return;
    if (top !== null) tableContainerRef.value.scrollTop = top;
    if (left !== null) tableContainerRef.value.scrollLeft = left;
}

/** get current table data */
function getTableData() {
    return toRaw(dataSourceCopy.value);
}

/**
 * get current sort info
 * @return {{key:string,order:Order}[]}
 */
function getSortColumns() {
    const sortOrder = sortSwitchOrder[sortOrderIndex.value];
    if (!sortOrder) return [];
    return [{ key: sortCol.value, order: sortOrder }];
}

/** click expended icon to toggle expand row */
function toggleExpandRow(row: DT, col: StkTableColumn<DT>) {
    const isExpand = row?.__EXPANDED__ === col ? !row?.__EXPANDED__ : true;
    setRowExpand(row, isExpand, { col });
}

/**
 *
 * @param rowKeyOrRow rowKey or row
 * @param expand expand or collapse
 * @param data { col?: StkTableColumn<DT> }
 * @param data.silent if set true, not emit `toggle-row-expand`, default:false
 */
function setRowExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: { col?: StkTableColumn<DT>; silent?: boolean }) {
    let rowKey: string;
    if (typeof rowKeyOrRow === 'string') {
        rowKey = rowKeyOrRow;
    } else {
        rowKey = rowKeyGen(rowKeyOrRow);
    }
    const tempData = dataSourceCopy.value.slice();
    const index = tempData.findIndex(it => rowKeyGen(it) === rowKey);
    if (index === -1) {
        console.warn('expandRow failed.rowKey:', rowKey);
        return;
    }

    // delete other expanded row below the target row
    for (let i = index + 1; i < tempData.length; i++) {
        const item: PrivateRowDT = tempData[i];
        const rowKey = item.__ROW_KEY__;
        if (rowKey?.startsWith(EXPANDED_ROW_KEY_PREFIX)) {
            tempData.splice(i, 1);
            i--;
        } else {
            break;
        }
    }

    const row = tempData[index];
    const col = data?.col || null;

    if (expand) {
        // insert new expanded row
        const newExpandRow: ExpandedRow = {
            __ROW_KEY__: EXPANDED_ROW_KEY_PREFIX + rowKey,
            __EXPANDED_ROW__: row,
            __EXPANDED_COL__: col,
        };
        tempData.splice(index + 1, 0, newExpandRow);
    }

    if (row) {
        row.__EXPANDED__ = expand ? col : null;
    }

    dataSourceCopy.value = tempData;
    if (!data?.silent) {
        emits('toggle-row-expand', { expanded: Boolean(expand), row, col });
    }
}

defineExpose({
    /**
     * 重新计算虚拟列表宽高
     *
     * en: calc virtual scroll x & y info
     * @see {@link initVirtualScroll}
     */
    initVirtualScroll,
    /**
     * 重新计算虚拟列表宽度
     *
     * en: calc virtual scroll x
     * @see {@link initVirtualScrollX}
     */
    initVirtualScrollX,
    /**
     * 重新计算虚拟列表高度
     *
     * en: calc virtual scroll y
     * @see {@link initVirtualScrollY}
     */
    initVirtualScrollY,
    /**
     * 选中一行
     *
     * en：select a row
     * @see {@link setCurrentRow}
     */
    setCurrentRow,
    /**
     * 取消选中单元格
     *
     * en: set highlight active cell (props.cellActive=true)
     * @see {@link setSelectedCell}
     */
    setSelectedCell,
    /**
     * 设置高亮单元格
     *
     * en: Set highlight cell
     * @see {@link setHighlightDimCell}
     */
    setHighlightDimCell,
    /**
     * 设置高亮行
     *
     * en: Set highlight row
     * @see {@link setHighlightDimRow}
     */
    setHighlightDimRow,
    /**
     * 表格排序列colKey
     *
     * en: Table sort column colKey
     */
    sortCol,
    /**
     * 表格排序列顺序
     *
     * en: get current sort info
     * @see {@link getSortColumns}
     */
    getSortColumns,
    /**
     * 设置表头排序状态
     *
     * en: Set the sort status of the table header
     * @see {@link setSorter}
     */
    setSorter,
    /**
     * 重置sorter状态
     *
     * en: Reset the sorter status
     * @see {@link resetSorter}
     */
    resetSorter,
    /**
     * 滚动至
     *
     * en: Scroll to
     * @see {@link scrollTo}
     */
    scrollTo,
    /**
     * 获取表格数据
     *
     * en: Get table data
     * @see {@link getTableData}
     */
    getTableData,
    /**
     * 设置展开的行
     *
     * en: Set expanded rows
     * @see {@link setRowExpand}
     */
    setRowExpand,
    /**
     * 不定行高时，如果行高有变化，则调用此方法更新行高。
     *
     * en: When the row height is not fixed, call this method to update the row height if the row height changes.
     * @see {@link setAutoHeight}
     */
    setAutoHeight,
    /**
     * 清除所有行高
     *
     * en: Clear all row heights
     * @see {@link clearAllAutoHeight}
     */
    clearAllAutoHeight,
});
</script>
