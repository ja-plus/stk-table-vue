<!-- eslint-disable vue/attribute-hyphenation -->
<template>
    <div
        ref="tableContainerRef"
        class="stk-table"
        :class="{
            virtual,
            'virtual-x': virtualX,
            'vt-on': virtual_on,
            light: theme === 'light',
            dark: theme === 'dark',
            headless,
            'is-col-resizing': isColResizing,
            'col-resizable': props.colResizable,
            bordered: props.bordered,
            [`bordered-${props.bordered}`]: typeof props.bordered === 'string',
            stripe: props.stripe,
            'cell-hover': props.cellHover,
            'cell-active': props.cellActive,
            'row-hover': props.rowHover,
            'row-active': rowActiveProp.enabled,
            'text-overflow': props.showOverflow,
            'header-text-overflow': props.showHeaderOverflow,
            'fixed-relative-mode': isRelativeMode,
            'auto-row-height': props.autoRowHeight,
            'scroll-row-by-row': isSRBRActive,
            'scrollbar-on': scrollbarOptions.enabled,
            'is-cell-selecting': isCellSelecting,
        }"
        :tabindex="props.cellSelection ? 0 : void 0"
        :style="{
            '--row-height': props.autoRowHeight ? void 0 : virtualScroll.rowHeight + 'px',
            '--header-row-height': props.headerRowHeight + 'px',
            '--highlight-duration': props.highlightConfig.duration && props.highlightConfig.duration + 's',
            '--highlight-timing-function': highlightSteps ? `steps(${highlightSteps})` : void 0,
            '--sb-width': `${scrollbarOptions.width}px`,
            '--sb-height': `${scrollbarOptions.height}px`,
        }"
        @scroll="onTableScroll"
        @wheel="onTableWheel"
    >
        <div v-if="SRBRTotalHeight" class="row-by-row-table-height" :style="`height: ${SRBRTotalHeight}px`"></div>

        <div v-if="colResizable" ref="colResizeIndicatorRef" class="column-resize-indicator"></div>

        <div class="stk-table-scroll-container">
            <table
                class="stk-table-main"
                :style="{ width, minWidth, maxWidth }"
                :class="{
                    'fixed-mode': props.fixedMode,
                }"
                @dragover="onTrDragOver"
                @dragenter="onTrDragEnter"
                @dragend="onTrDragEnd"
                @click="onRowClick"
                @dblclick="onRowDblclick"
                @contextmenu="onRowMenu"
                @mouseover="onTrMouseOver"
            >
                <thead v-if="!headless">
                    <tr v-for="(row, rowIndex) in tableHeaders" :key="rowIndex" @contextmenu="onHeaderMenu($event)">
                        <th
                            v-if="virtualX_on"
                            class="vt-x-left"
                            :style="`min-width:${virtualScrollX.offsetLeft}px;width:${virtualScrollX.offsetLeft}px`"
                        ></th>
                        <th
                            v-for="(col, colIndex) in virtualX_on && rowIndex === tableHeaders.length - 1 ? virtualX_columnPart : row"
                            :key="colKeyGen(col)"
                            v-bind="getTHProps(col)"
                            @click="e => onHeaderCellClick(e, col)"
                            @dragstart="onThDragStart"
                            @drop="onThDrop"
                            @dragover="onThDragOver"
                        >
                            <div
                                v-if="colResizeOn(col) && colIndex > 0"
                                class="table-header-resizer left"
                                @mousedown="onThResizeMouseDown($event, col, true)"
                            ></div>
                            <div class="table-header-cell-wrapper" :style="virtualX_on ? null : col.__R_SP__ ? `--row-span:${col.__R_SP__}` : null">
                                <component
                                    :is="col.customHeaderCell"
                                    v-if="col.customHeaderCell"
                                    :col="col"
                                    :colIndex="colIndex"
                                    :rowIndex="rowIndex"
                                />
                                <template v-else>
                                    <slot name="tableHeader" :col="col">
                                        <span class="table-header-title">{{ col.title }}</span>
                                    </slot>
                                </template>
                                <SortIcon v-if="col.sorter" class="table-header-sorter" />
                            </div>
                            <div v-if="colResizeOn(col)" class="table-header-resizer right" @mousedown="onThResizeMouseDown($event, col)"></div>
                        </th>
                        <th v-if="virtualX_on" class="vt-x-right" :style="`min-width:${virtualX_offsetRight}px;width:${virtualX_offsetRight}px`"></th>
                    </tr>
                </thead>

                <tbody class="stk-tbody-main" @click="onCellClick" @mousedown="onCellMouseDown" @mouseover="onCellMouseOver">
                    <tr v-if="virtual_on && !isSRBRActive" :style="`height:${virtualScroll.offsetTop}px`" class="padding-top-tr">
                        <td v-if="virtualX_on && fixedMode && headless" class="vt-x-left"></td>
                        <template v-if="fixedMode && headless">
                            <td v-for="col in virtualX_columnPart" :key="colKeyGen(col)" :style="cellStyleMap[TagType.TD].get(colKeyGen(col))"></td>
                        </template>
                    </tr>
                    <tr
                        v-for="(row, rowIndex) in virtual_dataSourcePart"
                        ref="trRef"
                        :key="rowKeyGen(row)"
                        v-bind="getTRProps(row, rowIndex)"
                        @drop="onTrDrop($event, getRowIndex(rowIndex))"
                        @mouseleave="onTrMouseLeave"
                    >
                        <td v-if="virtualX_on" class="vt-x-left"></td>
                        <td v-if="row && row.__EXP_R__" :colspan="virtualX_columnPart.length">
                            <div class="table-cell-wrapper">
                                <slot name="expand" :row="row.__EXP_R__" :col="row.__EXP_C__">
                                    {{ row.__EXP_R__?.[row.__EXP_C__!.dataIndex] ?? '' }}
                                </slot>
                            </div>
                        </td>
                        <template v-else>
                            <template v-for="(col, colIndex) in virtualX_columnPart">
                                <td
                                    v-if="!hiddenCellMap || !hiddenCellMap[rowKeyGen(row)]?.has(colKeyGen(col))"
                                    :key="colKeyGen(col)"
                                    v-bind="getTDProps(row, col, rowIndex, colIndex)"
                                    @mouseenter="onCellMouseEnter"
                                    @mouseleave="onCellMouseLeave"
                                >
                                    <component
                                        :is="col.customCell"
                                        v-if="col.customCell"
                                        class="table-cell-wrapper"
                                        :col="col"
                                        :row="row"
                                        :rowIndex="getRowIndex(rowIndex)"
                                        :colIndex="colIndex"
                                        :cellValue="row && row[col.dataIndex]"
                                        :expanded="row && row.__EXP__"
                                        :tree-expanded="row && row.__T_EXP__"
                                    >
                                        <template #stkFoldIcon>
                                            <TriangleIcon @click="triangleClick($event, row, col)"></TriangleIcon>
                                        </template>
                                        <template #stkDragIcon>
                                            <DragHandle @dragstart="onTrDragStart($event, getRowIndex(rowIndex))" />
                                        </template>
                                    </component>
                                    <div v-else-if="!col.type" class="table-cell-wrapper" :title="row[col.dataIndex] || ''">
                                        {{ (row && row[col.dataIndex]) ?? getEmptyCellText(col, row) }}
                                    </div>
                                    <div v-else-if="col.type === 'seq'" class="table-cell-wrapper">
                                        {{ (props.seqConfig.startIndex || 0) + getRowIndex(rowIndex) + 1 }}
                                    </div>
                                    <TreeNodeCell
                                        v-else-if="col.type === 'tree-node'"
                                        class="table-cell-wrapper"
                                        :col="col"
                                        :row="row"
                                        @click="triangleClick($event, row, col)"
                                    ></TreeNodeCell>
                                    <div v-else class="table-cell-wrapper" :title="row[col.dataIndex] || ''">
                                        <DragHandle v-if="col.type === 'dragRow'" @dragstart="onTrDragStart($event, getRowIndex(rowIndex))" />
                                        <TriangleIcon v-else-if="col.type === 'expand'" @click="triangleClick($event, row, col)" />
                                        <span v-if="row[col.dataIndex] != null">{{ row[col.dataIndex] }}</span>
                                    </div>
                                </td>
                            </template>
                        </template>
                        <td v-if="virtualX_on" class="vt-x-right"></td>
                    </tr>
                    <tr v-if="virtual_on && !isSRBRActive" :style="`height: ${virtual_offsetBottom}px`"></tr>
                    <tr v-if="SRBRBottomHeight" :style="`height: ${SRBRBottomHeight}px`"></tr>
                </tbody>
            </table>
            <div
                v-if="scrollbarOptions.enabled && showScrollbar.y"
                class="stk-sb-thumb vertical"
                :style="{
                    height: `${scrollbar.h}px`,
                    transform: `translateY(${scrollbar.top}px)`,
                }"
                @mousedown="onVerticalScrollbarMouseDown"
                @touchstart="onVerticalScrollbarMouseDown"
            ></div>
        </div>
        <div v-if="(!dataSourceCopy || !dataSourceCopy.length) && showNoData" class="stk-table-no-data" :class="{ 'no-data-full': noDataFull }">
            <slot name="empty">暂无数据</slot>
        </div>
        <slot name="customBottom"></slot>
        <div
            v-if="scrollbarOptions.enabled && showScrollbar.x"
            class="stk-sb-thumb horizontal"
            :style="{
                width: `${scrollbar.w}px`,
                transform: `translateX(${scrollbar.left}px)`,
            }"
            @mousedown="onHorizontalScrollbarMouseDown"
            @touchstart="onHorizontalScrollbarMouseDown"
        ></div>
    </div>
</template>

<script setup lang="ts">
/**
 * @author japlus
 */
import { CSSProperties, computed, nextTick, onMounted, ref, shallowRef, toRaw, toRef, watch } from 'vue';
import DragHandle from './components/DragHandle.vue';
import SortIcon from './components/SortIcon.vue';
import TreeNodeCell from './components/TreeNodeCell.vue';
import TriangleIcon from './components/TriangleIcon.vue';
import {
    CELL_KEY_SEPARATE,
    DEFAULT_ROW_ACTIVE_CONFIG,
    DEFAULT_ROW_HEIGHT,
    DEFAULT_SMOOTH_SCROLL,
    DEFAULT_SORT_CONFIG,
    IS_LEGACY_MODE,
} from './const';
import {
    AutoRowHeightConfig,
    CellSelectionConfig,
    CellSelectionRange,
    ColResizableConfig,
    DragRowConfig,
    ExpandConfig,
    HeaderDragConfig,
    HighlightConfig,
    Order,
    PrivateRowDT,
    PrivateStkTableColumn,
    RowActiveOption,
    SeqConfig,
    SortConfig,
    SortOption,
    StkTableColumn,
    TagType,
    TreeConfig,
    UniqKey,
    UniqKeyProp,
} from './types/index';
import { useAutoResize } from './useAutoResize';
import { useColResize } from './useColResize';
import { useFixedCol } from './useFixedCol';
import { useFixedStyle } from './useFixedStyle';
import { useGetFixedColPosition } from './useGetFixedColPosition';
import { useHighlight } from './useHighlight';
import { useKeyboardArrowScroll } from './useKeyboardArrowScroll';
import { useMaxRowSpan } from './useMaxRowSpan';
import { useMergeCells } from './useMergeCells';
import { useRowExpand } from './useRowExpand';
import { useScrollbar, type ScrollbarOptions } from './useScrollbar';
import { useScrollRowByRow } from './useScrollRowByRow';
import { useThDrag } from './useThDrag';
import { useTrDrag } from './useTrDrag';
import { useTree } from './useTree';
import { useVirtualScroll } from './useVirtualScroll';
import { useWheeling } from './useWheeling';
import { useCellSelection } from './useCellSelection';
import { createStkTableId, getCalculatedColWidth, getColWidth } from './utils/constRefUtils';
import { getClosestColKey, getClosestTr, getClosestTrIndex, howDeepTheHeader, isEmptyValue, tableSort, transformWidthToStr } from './utils/index';

/** Generic stands for DataType */
type DT = any & PrivateRowDT;

/** generate table instance id */
const stkTableId = createStkTableId();

/**
 * props cannot be placed in a separate file. It will cause compilation errors with vue 2.7 compiler.
 */
const props = withDefaults(
    defineProps<{
        /** 表格宽度*/
        width?: string;
        /** 最小表格宽度 @deprecated*/
        minWidth?: string;
        /** 表格最大宽度 @deprecated*/
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
        rowActive?: boolean | RowActiveOption<DT>;
        /**
         * @deprecated
         */
        rowCurrentRevokable?: boolean;
        /** 表头行高。default = rowHeight */
        headerRowHeight?: number | string | null;
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
        /** 是否启用单元格范围选中（拖拽选区） */
        cellSelection?: CellSelectionConfig;
        /** 表头是否可拖动。支持回调函数。 */
        headerDrag?: boolean | HeaderDragConfig<DT>;
        /**
         * 给行附加className<br>
         * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
         */
        rowClassName?: (row: DT, i: number) => string | undefined;
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
        bordered?: boolean | 'h' | 'v' | 'body-v' | 'body-h';
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
        /** 树形配置 */
        treeConfig?: TreeConfig;
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
         * 是否平滑滚动。default: chrome < 85 ? true : false
         * - false: 使用 onwheel 滚动。为了防止滚动过快导致白屏。
         * - true: 不使用 onwheel 滚动。鼠标滚轮滚动时更加平滑。滚动过快时会白屏。
         */
        smoothScroll?: boolean;
        /**
         * 按整数行纵向滚动
         * - scrollbar：仅拖动滚动条生效
         */
        scrollRowByRow?: boolean | 'scrollbar';
        /**
         * 自定义滚动条配置
         * - false: 禁用自定义滚动条
         * - true: 启用默认配置的自定义滚动条
         * - ScrollbarOptions: 启用并配置自定义滚动条
         */
        scrollbar?: boolean | ScrollbarOptions;
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
        autoRowHeight: () => false,
        rowHover: true,
        rowActive: () => DEFAULT_ROW_ACTIVE_CONFIG,
        rowCurrentRevokable: true,
        headerRowHeight: DEFAULT_ROW_HEIGHT,
        virtual: false,
        virtualX: false,
        columns: () => [],
        dataSource: () => [],
        rowKey: '',
        colKey: void 0,
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
        cellSelection: false,
        headerDrag: () => false,
        rowClassName: () => '',
        colResizable: () => false,
        colMinWidth: 10,
        bordered: true,
        autoResize: true,
        fixedColShadow: false,
        optimizeVue2Scroll: false,
        sortConfig: () => DEFAULT_SORT_CONFIG,
        hideHeaderTitle: false,
        highlightConfig: () => ({}),
        seqConfig: () => ({}),
        expandConfig: () => ({}),
        dragRowConfig: () => ({}),
        treeConfig: () => ({}),
        cellFixedMode: 'sticky',
        smoothScroll: DEFAULT_SMOOTH_SCROLL,
        scrollRowByRow: false,
        scrollbar: false,
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
     * ```(ev: MouseEvent, row: DT, data: { rowIndex: number })```
     */
    (e: 'row-click', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
    /**
     * 选中一行触发。ev返回null表示不是点击事件触发的
     *
     * ```(ev: MouseEvent | null, row: DT | undefined, data: { select: boolean} })```
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
     * ```(ev: MouseEvent, row: DT, data: { rowIndex: number })```
     */
    (e: 'row-dblclick', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
    /**
     * 表头右键事件
     *
     * ```(ev: MouseEvent)```
     */
    (e: 'header-row-menu', ev: MouseEvent): void;
    /**
     * 表体行右键点击事件
     *
     * ```(ev: MouseEvent, row: DT, data: { rowIndex: number })```
     */
    (e: 'row-menu', ev: MouseEvent, row: DT, data: { rowIndex: number }): void;
    /**
     * 单元格点击事件
     *
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number })```
     */
    (e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
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
     * ```(ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number })```
     */
    (e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void;
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
     * 点击展开树行触发
     *
     * ```( data: { expanded: boolean; row: DT; col: StkTableColumn<DT> })```
     */
    (e: 'toggle-tree-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void;
    /**
     * 单元格选区变更事件
     *
     * ```(range: CellSelectionRange | null, data: { rows: DT[], cols: StkTableColumn<DT>[] })```
     */
    (e: 'cell-selection-change', range: CellSelectionRange | null, data: { rows: DT[]; cols: StkTableColumn<DT>[] }): void;
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
const currentRowKey = ref<UniqKey | undefined>();
/** 当前选中的单元格key  */
const currentSelectedCellKey = ref<string | undefined>();
/** 当前hover行 */
let currentHoverRow: DT | null = null;
/** 当前hover的行的key */
const currentHoverRowKey = ref<UniqKey | null>(null);
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
 *      [{dataIndex:'id',...}], // 第0行列配置
 *      [], // 第一行列配置
 *      //...
 * ]
 * ```
 */
const tableHeaders = shallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>([]);

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
const tableHeadersForCalc = shallowRef<PrivateStkTableColumn<PrivateRowDT>[][]>([]);

/** 最后一行的tableHeaders.内容是 props.columns 的引用集合  */
const tableHeaderLast = computed(() => tableHeadersForCalc.value.slice(-1)[0] || []);

const isTreeData = computed(() => {
    return props.columns.some(col => col.type === 'tree-node');
});

const rowActiveProp = computed<Required<RowActiveOption<DT>>>(() => {
    const { rowActive } = props;
    if (typeof rowActive === 'boolean') {
        return {
            ...DEFAULT_ROW_ACTIVE_CONFIG,
            enabled: rowActive ?? true,
            revokable: Boolean(props.rowCurrentRevokable),
        };
    } else {
        return { ...DEFAULT_ROW_ACTIVE_CONFIG, ...rowActive };
    }
});

const dataSourceCopy = shallowRef<DT[]>([]);

const rowKeyGenComputed = computed(() => {
    const { rowKey } = props;
    if (typeof rowKey === 'function') {
        return (row: DT) => (rowKey as (row: DT) => string)(row);
    } else {
        return (row: DT) => row[rowKey];
    }
});

const colKeyGen = computed<(col: StkTableColumn<DT>) => string>(() => {
    const { colKey } = props;
    if (colKey === void 0) {
        return col => col.key || col.dataIndex;
    } else if (typeof colKey === 'function') {
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

/** scroll-row-by-row total-height */
const SRBRTotalHeight = computed(() => {
    if (!isSRBRActive.value || !props.virtual) return 0;
    return (
        dataSourceCopy.value.length * virtualScroll.value.rowHeight + tableHeaderHeight.value //+
    );
});
const SRBRBottomHeight = computed(() => {
    if (!isSRBRActive.value || !props.virtual) return 0;
    const { containerHeight, rowHeight } = virtualScroll.value;
    return (containerHeight - tableHeaderHeight.value) % rowHeight;
});

const rowKeyGenCache = new WeakMap();

const { isSRBRActive } = useScrollRowByRow({ props, tableContainerRef });

const { onThDragStart, onThDragOver, onThDrop, isHeaderDraggable } = useThDrag({ props, emits, colKeyGen });

const { onTrDragStart, onTrDrop, onTrDragOver, onTrDragEnd, onTrDragEnter } = useTrDrag({ props, emits, dataSourceCopy });

const { maxRowSpan, updateMaxRowSpan } = useMaxRowSpan({ props, tableHeaderLast, rowKeyGen, dataSourceCopy });

const {
    virtualScroll,
    virtualScrollX,
    virtual_on,
    virtual_dataSourcePart,
    virtual_offsetBottom,
    virtualX_on,
    virtualX_columnPart,
    virtualX_offsetRight,
    tableHeaderHeight,
    initVirtualScroll,
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX,
    setAutoHeight,
    clearAllAutoHeight,
} = useVirtualScroll({ tableContainerRef, trRef, props, dataSourceCopy, tableHeaderLast, tableHeaders, rowKeyGen, maxRowSpan });

const { scrollbarOptions, scrollbar, showScrollbar, onVerticalScrollbarMouseDown, onHorizontalScrollbarMouseDown, updateCustomScrollbar } =
    useScrollbar({ containerRef: tableContainerRef, virtualScroll, virtualScrollX }, toRef(props, 'scrollbar'));

const {
    hiddenCellMap, //
    mergeCellsWrapper,
    hoverMergedCells,
    updateHoverMergedCells,
    activeMergedCells,
    updateActiveMergedCells,
} = useMergeCells({ rowActiveProp, tableHeaderLast, rowKeyGen, colKeyGen, virtual_dataSourcePart });

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

const { toggleExpandRow, setRowExpand } = useRowExpand({ dataSourceCopy, rowKeyGen, emits });

const { toggleTreeNode, setTreeExpand, flatTreeData } = useTree({ props, dataSourceCopy, rowKeyGen, emits });

const {
    isSelecting: isCellSelecting,
    onSelectionMouseDown,
    getCellSelectionClasses,
    getSelectedCells,
    clearSelection,
} = useCellSelection({ props, emits, tableContainerRef, dataSourceCopy, tableHeaderLast, rowKeyGen, colKeyGen, cellKeyGen });

watch(
    () => props.columns,
    () => {
        dealColumns();
        updateMaxRowSpan();
        // nextTick: initVirtualScrollX need get container width。
        nextTick(() => {
            initVirtualScrollX();
            updateFixedShadow();
            updateCustomScrollbar();
        });
    },
);
watch(
    () => props.virtual,
    () => {
        nextTick(initVirtualScrollY);
    },
);

watch(() => props.rowHeight, initVirtualScrollY);

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
        updateDataSource(val);
    },
);
watch(
    () => dataSourceCopy.value,
    () => {
        nextTick(updateCustomScrollbar);
    },
);

watch(
    () => props.fixedColShadow,
    () => updateFixedShadow(),
);

dealColumns();
initDataSource();
updateMaxRowSpan();

onMounted(() => {
    initVirtualScroll();
    updateFixedShadow();
    dealDefaultSorter();
});

function initDataSource(v = props.dataSource) {
    let dataSourceTemp = v.slice(); // shallow copy
    if (isTreeData.value) {
        // only tree data need flat
        dataSourceTemp = flatTreeData(dataSourceTemp);
    }
    dataSourceCopy.value = dataSourceTemp;
}

function dealDefaultSorter() {
    if (!props.sortConfig.defaultSort) return;
    const { key, dataIndex, order, silent } = { silent: false, ...props.sortConfig.defaultSort };
    setSorter((key || dataIndex) as string, order, { force: false, silent });
}

/**
 *  deal multi-level header
 */
function dealColumns() {
    // reset
    const tableHeadersTemp: StkTableColumn<PrivateRowDT>[][] = [];
    const tableHeadersForCalcTemp: StkTableColumn<PrivateRowDT>[][] = [];
    let copyColumn: StkTableColumn<PrivateRowDT>[] = props.columns; // do not deep clone
    // relative 模式下不支持sticky列。因此就放在左右两侧。
    if (isRelativeMode.value) {
        let leftCol: StkTableColumn<PrivateRowDT>[] = [];
        let centerCol: StkTableColumn<PrivateRowDT>[] = [];
        let rightCol: StkTableColumn<PrivateRowDT>[] = [];
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

    if (maxDeep > 0 && props.virtualX) {
        console.error('StkTableVue:多级表头不支持横向虚拟滚动!');
    }

    for (let i = 0; i <= maxDeep; i++) {
        tableHeadersTemp[i] = [];
        tableHeadersForCalcTemp[i] = [];
    }

    /**
     * flat columns
     * @param arr
     * @param depth 深度
     * @param parent 父节点引用，用于构建双向链表。
     * @param parentFixed 父节点固定列继承。
     */
    function flat(
        arr: PrivateStkTableColumn<PrivateRowDT>[],
        parent: PrivateStkTableColumn<PrivateRowDT> | null,
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
                col.__R_SP__ = rowSpan;
            }
            if (colSpan > 1) {
                col.__C_SP__ = colSpan;
            }

            allChildrenLen += colChildrenLen;
            allChildrenWidthSum += colWidth;
        });
        return [allChildrenLen, allChildrenWidthSum];
    }

    flat(copyColumn, null);
    tableHeaders.value = tableHeadersTemp;
    tableHeadersForCalc.value = tableHeadersForCalcTemp;
}

function updateDataSource(val: DT[]) {
    if (!Array.isArray(val)) {
        console.warn('invalid dataSource');
        return;
    }

    let needInitVirtualScrollY = false;
    if (dataSourceCopy.value.length !== val.length) {
        needInitVirtualScrollY = true;
    }
    initDataSource(val);
    updateMaxRowSpan();
    // if data length is not change, not init virtual scroll
    if (needInitVirtualScrollY) {
        // wait for table render,initVirtualScrollY has get `dom` operation.
        nextTick(() => initVirtualScrollY());
    }
    const sortColValue = sortCol.value;
    if (!isEmptyValue(sortColValue) && !props.sortRemote) {
        // sort
        const colKey = colKeyGen.value;
        const column = tableHeaderLast.value.find(it => colKey(it) === sortColValue);
        onColumnSort(column, false);
    }
}

/** tr key */
function rowKeyGen(row: DT | null | undefined) {
    if (!row) return row;
    let key = rowKeyGenCache.get(row) || (row as PrivateRowDT).__ROW_K__;
    if (!key) {
        key = rowKeyGenComputed.value(row);

        if (key === void 0) {
            // key为undefined时，不应该高亮行。因此重新生成key
            key = Math.random().toString(36).slice(2);
        }
        rowKeyGenCache.set(row, key);
    }
    return key;
}

/** td key */
function cellKeyGen(row: DT | null | undefined, col: StkTableColumn<DT>) {
    return rowKeyGen(row) + CELL_KEY_SEPARATE + colKeyGen.value(col);
}

const cellStyleMap = computed(() => {
    const thMap = new Map();
    const tdMap = new Map();
    const { virtualX } = props;
    for (let depth = 0; depth < tableHeaders.value.length; depth++) {
        const cols = tableHeaders.value[depth];
        for (let i = 0; i < cols.length; i++) {
            const col = cols[i];
            const width = virtualX ? getCalculatedColWidth(col) + 'px' : transformWidthToStr(col.width);
            const style: CSSProperties = {
                '--cw': width, // --cw : cell-width
                minWidth: transformWidthToStr(col.minWidth),
                maxWidth: transformWidthToStr(col.maxWidth),
            };
            const colKey = colKeyGen.value(col);
            thMap.set(colKey, Object.assign({}, style, getFixedStyle(TagType.TH, col, depth)));
            tdMap.set(colKey, Object.assign({}, style, getFixedStyle(TagType.TD, col, depth)));
        }
    }
    return {
        [TagType.TH]: thMap,
        [TagType.TD]: tdMap,
    };
});

function getRowIndex(rowIndex: number) {
    return rowIndex + virtualScroll.value.startIndex;
}
/** th title */
function getHeaderTitle(col: StkTableColumn<DT>): string {
    const colKey = colKeyGen.value(col);
    // hide title
    if (props.hideHeaderTitle === true || (Array.isArray(props.hideHeaderTitle) && props.hideHeaderTitle.includes(colKey))) {
        return '';
    }
    return col.title || '';
}

function getTRProps(row: PrivateRowDT | null | undefined, index: number) {
    const rowIndex = getRowIndex(index);
    const rowKey = rowKeyGen(row);

    let classStr = props.rowClassName(row, rowIndex) || '' + ' ' + (row?.__EXP__ ? 'expanded' : '') + ' ' + (row?.__EXP_R__ ? 'expanded-row' : '');
    if (currentRowKey.value === rowKey || row === currentRow.value) {
        classStr += ' active';
    }
    if (props.showTrHoverClass && (rowKey === currentHoverRowKey.value || row === currentHoverRow)) {
        classStr += ' hover';
    }

    const result: Record<string, number | string | null> = {
        id: stkTableId + '-' + rowKey,
        'data-row-key': rowKey,
        'data-row-i': rowIndex,
        class: classStr,
        style: null,
    };

    const needRowHeight = row?.__EXP_R__ && props.virtual && props.expandConfig?.height;

    if (needRowHeight) {
        result.style = `--row-height: ${props.expandConfig?.height}px`;
    }
    return result;
}

function getTHProps(col: PrivateStkTableColumn<DT>) {
    const colKey = colKeyGen.value(col);
    return {
        'data-col-key': colKey,
        draggable: Boolean(isHeaderDraggable(col)),
        rowspan: virtualX_on.value ? 1 : col.__R_SP__,
        colspan: col.__C_SP__,
        style: cellStyleMap.value[TagType.TH].get(colKey),
        title: getHeaderTitle(col),
        class: [
            col.sorter ? 'sortable' : '',
            colKey === sortCol.value && sortOrderIndex.value !== 0 && 'sorter-' + sortSwitchOrder[sortOrderIndex.value],
            col.headerClassName,
            fixedColClassMap.value.get(colKey),
            col.headerAlign && (col.headerAlign === 'left' ? 'text-l' : col.headerAlign === 'right' ? 'text-r' : null),
        ],
    };
}

function getTDProps(row: PrivateRowDT | null | undefined, col: StkTableColumn<PrivateRowDT>, rowIndex: number, colIndex: number) {
    const colKey = colKeyGen.value(col);
    if (!row) {
        return {
            style: cellStyleMap.value[TagType.TD].get(colKey),
        };
    }

    const cellKey = cellKeyGen(row, col);
    const classList = [col.className, fixedColClassMap.value.get(colKey)];

    if (col.align === 'center') {
        classList.push('text-c');
    } else if (col.align === 'right') {
        classList.push('text-r');
    }
    if (col.mergeCells) {
        if (hoverMergedCells.value.has(cellKey)) {
            classList.push('cell-hover');
        }
        if (activeMergedCells.value.has(cellKey)) {
            classList.push('cell-active');
        }
    }

    if (props.cellActive && currentSelectedCellKey.value === cellKey) {
        classList.push('active');
    }

    // 单元格拖选选区样式
    if (props.cellSelection) {
        const absRowIndex = getRowIndex(rowIndex);
        classList.push(...getCellSelectionClasses(cellKey, absRowIndex, colKey));
    }

    if (col.type === 'seq') {
        classList.push('seq-column');
    } else if (col.type === 'expand' && (row.__EXP__ ? colKeyGen.value(row.__EXP__) === colKey : false)) {
        classList.push('expanded');
    } else if (row.__T_EXP__ && col.type === 'tree-node') {
        classList.push('tree-expanded');
    } else if (col.type === 'dragRow') {
        classList.push('drag-row-cell');
    }

    return {
        'data-col-key': colKey,
        style: cellStyleMap.value[TagType.TD].get(colKey),
        class: classList,
        ...mergeCellsWrapper(row, col, rowIndex, colIndex),
    };
}

/**
 * 表头点击排序
 *
 * en: Sort a column
 * @param click 是否为点击表头触发
 * @param options.force sort-remote 开启后是否强制排序
 * @param options.emit 是否触发回调
 */
function onColumnSort(col: StkTableColumn<DT> | undefined | null, click = true, options: { force?: boolean; emit?: boolean } = {}) {
    if (!col) {
        console.warn('onColumnSort: not found col:', col);
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
    const prevOrder = sortSwitchOrder[sortOrderIndex.value];
    if (click) sortOrderIndex.value++;
    sortOrderIndex.value = sortOrderIndex.value % 3;

    let order = sortSwitchOrder[sortOrderIndex.value];
    const sortConfig: SortConfig<DT> = { ...DEFAULT_SORT_CONFIG, ...props.sortConfig, ...col.sortConfig };
    const { defaultSort } = sortConfig;
    const colKeyGenValue = colKeyGen.value;

    if (!order && defaultSort) {
        // if no order ,use default order
        const defaultColKey = defaultSort.key || defaultSort.dataIndex;
        if (!defaultColKey) {
            console.error('sortConfig.defaultSort key or dataIndex is required');
            return;
        }
        if (colKey === defaultColKey && prevOrder === defaultSort.order) {
            order = sortSwitchOrder.find(o => o !== defaultSort.order && o) as Order;
        } else {
            order = defaultSort.order;
        }
        sortOrderIndex.value = sortSwitchOrder.indexOf(order);
        sortCol.value = defaultColKey as string;
        col = null;
        for (const row of tableHeaders.value) {
            const c = row.find(item => colKeyGenValue(item) === defaultColKey);
            if (c) {
                col = c;
                break;
            }
        }
    }
    let dataSourceTemp: DT[] = props.dataSource.slice();
    if (!props.sortRemote || options.force) {
        const sortOption = col || defaultSort;
        if (sortOption) {
            dataSourceTemp = tableSort(sortOption, order, dataSourceTemp, sortConfig);
            dataSourceCopy.value = isTreeData.value ? flatTreeData(dataSourceTemp) : dataSourceTemp;
        }
    }
    // only emit sort-change event when click
    if (click || options.emit) {
        emits('sort-change', col, order, toRaw(dataSourceTemp), sortConfig);
    }
}

function onRowClick(e: MouseEvent) {
    const rowIndex = getClosestTrIndex(e);
    const row = dataSourceCopy.value[rowIndex];
    if (!row) return;
    emits('row-click', e, row, { rowIndex });
    if (rowActiveProp.value.disabled?.(row)) return;
    const isCurrentRow = props.rowKey ? currentRowKey.value === rowKeyGen(row) : currentRow.value === row;
    if (isCurrentRow) {
        if (!rowActiveProp.value.revokable) {
            return;
        }
        setCurrentRow(void 0, { silent: true });
    } else {
        setCurrentRow(row, { silent: true });
    }
    emits('current-change', e, row, { select: !isCurrentRow });
}

function onRowDblclick(e: MouseEvent) {
    const rowIndex = getClosestTrIndex(e);
    const row = dataSourceCopy.value[rowIndex];
    if (!row) return;
    emits('row-dblclick', e, row, { rowIndex });
}

function onHeaderMenu(e: MouseEvent) {
    emits('header-row-menu', e);
}

function onRowMenu(e: MouseEvent) {
    const rowIndex = getClosestTrIndex(e);
    const row = dataSourceCopy.value[rowIndex];
    if (!row) return;
    emits('row-menu', e, row, { rowIndex });
}

function triangleClick(e: MouseEvent, row: DT, col: StkTableColumn<DT>) {
    if (col.type === 'expand') {
        toggleExpandRow(row, col);
    } else if (col.type === 'tree-node') {
        toggleTreeNode(row, col);
    }
}

function onCellClick(e: MouseEvent) {
    const rowIndex = getClosestTrIndex(e);
    const row = dataSourceCopy.value[rowIndex];
    if (!row) return;
    const colKey = getClosestColKey(e);
    const col = tableHeaderLast.value.find(item => colKeyGen.value(item) === colKey);
    if (!col) return;
    if (props.cellActive) {
        const cellKey = cellKeyGen(row, col);
        const result = { row, col, select: false, rowIndex };
        if (props.selectedCellRevokable && currentSelectedCellKey.value === cellKey) {
            currentSelectedCellKey.value = void 0;
        } else {
            currentSelectedCellKey.value = cellKey;
            result.select = true;
        }
        emits('cell-selected', e, result);
    }
    emits('cell-click', e, row, col, { rowIndex });
}

function getCellEventData(e: MouseEvent) {
    const rowIndex = getClosestTrIndex(e) || 0;
    const row = dataSourceCopy.value[rowIndex];
    const colKey = getClosestColKey(e);
    const col = tableHeaderLast.value.find(item => colKeyGen.value(item) === colKey) as any;
    return { row, col, rowIndex };
}

/** th click */
function onHeaderCellClick(e: MouseEvent, col: StkTableColumn<DT>) {
    onColumnSort(col);
    emits('header-cell-click', e, col);
}

/** td mouseenter */
function onCellMouseEnter(e: MouseEvent) {
    const { row, col } = getCellEventData(e);
    emits('cell-mouseenter', e, row, col);
}

/** td mouseleave */
function onCellMouseLeave(e: MouseEvent) {
    const { row, col } = getCellEventData(e);
    emits('cell-mouseleave', e, row, col);
}
/** td mouseover event */
function onCellMouseOver(e: MouseEvent) {
    const { row, col } = getCellEventData(e);
    emits('cell-mouseover', e, row, col);
}

function onCellMouseDown(e: MouseEvent) {
    const { row, col, rowIndex } = getCellEventData(e);
    emits('cell-mousedown', e, row, col, { rowIndex });
    // 单元格拖选
    if (props.cellSelection) {
        onSelectionMouseDown(e);
    }
}

// isWheeling: true when wheel event is triggered, auto reset to false after 200ms
const [isWheeling, setIsWheeling] = useWheeling();

/**
 * proxy scroll, prevent white screen
 * @param e
 */
function onTableWheel(e: WheelEvent) {
    // Mark wheel event as active, will reset to false after 200ms of inactivity

    if (props.smoothScroll) return;
    // if is resizing, not allow scroll
    if (isColResizing.value) {
        e.stopPropagation();
        return;
    }
    const dom = tableContainerRef.value as HTMLElement;

    const { deltaY, deltaX, shiftKey } = e;

    if (virtual_on.value && deltaY && !shiftKey) {
        const { containerHeight, scrollTop, scrollHeight } = virtualScroll.value;
        const isScrollBottom = scrollHeight - containerHeight - scrollTop < 10;
        // If scrolling down and not at bottom, or at bottom but still actively wheeling
        // If scrolling up and not at top, or at top but still actively wheeling
        if ((deltaY > 0 && !isScrollBottom) || (deltaY < 0 && scrollTop > 0)) {
            setIsWheeling(true);
            e.preventDefault(); // Prevent parent element scroll when actively wheeling at boundaries
        }
        if (isWheeling()) {
            e.preventDefault();
        }
        dom.scrollTop += deltaY;
    }
    if (virtualX_on.value) {
        const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
        const isScrollRight = scrollWidth - containerWidth - scrollLeft < 10;
        let distance = deltaX;
        if (shiftKey && deltaY) {
            distance = deltaY;
        }
        // If scrolling right and not at right, or at right but still actively wheeling
        // If scrolling left and not at left, or at left but still actively wheeling
        if ((distance > 0 && !isScrollRight) || (distance < 0 && scrollLeft > 0)) {
            setIsWheeling(true);
            e.preventDefault(); // Prevent parent element scroll when actively wheeling at boundaries
        }
        if (isWheeling()) {
            e.preventDefault();
        }
        dom.scrollLeft += distance;
    }
}

/**
 * @param e scrollEvent
 */
function onTableScroll(e: Event) {
    if (!e?.target) return;
    // const target = e.target;
    requestAnimationFrame(() => {
        const { scrollTop, scrollLeft } = e.target as HTMLElement;
        const { scrollTop: vScrollTop } = virtualScroll.value;
        const { scrollLeft: vScrollLeft } = virtualScrollX.value;
        const isYScroll = scrollTop !== vScrollTop;
        const isXScroll = scrollLeft !== vScrollLeft;

        if (isYScroll) {
            updateVirtualScrollY(scrollTop);
        }

        if (isXScroll) {
            if (virtualX_on.value) {
                updateVirtualScrollX(scrollLeft);
            } else {
                // 非虚拟滚动也记录一下滚动条位置。用于判断isXScroll
                virtualScrollX.value.scrollLeft = scrollLeft;
            }
            updateFixedShadow(virtualScrollX);
        }

        if (isYScroll) {
            const { startIndex, endIndex } = virtualScroll.value;
            emits('scroll', e, { startIndex, endIndex });
        }
        if (isXScroll) {
            emits('scroll-x', e);
        }

        updateCustomScrollbar();
    });
}

/** tr hover */
function onTrMouseOver(e: MouseEvent) {
    const tr = getClosestTr(e);
    if (!tr) return;
    const rowIndex = Number(tr.dataset.rowI);
    const row = dataSourceCopy.value[rowIndex];
    if (currentHoverRow === row) return;
    currentHoverRow = row;
    const rowKey = tr.dataset.rowKey;
    if (props.showTrHoverClass) {
        currentHoverRowKey.value = rowKey || null;
    }
    if (props.rowHover) {
        updateHoverMergedCells(rowKey);
    }
}

function onTrMouseLeave(e: MouseEvent) {
    if ((e.target as HTMLElement).tagName !== 'TR') return;
    currentHoverRow = null;
    if (props.showTrHoverClass) {
        currentHoverRowKey.value = null;
    }
    if (props.rowHover) {
        updateHoverMergedCells(void 0);
    }
}

/**
 * 选中一行
 *
 * en: Select a row
 * @param {string} rowKeyOrRow selected rowKey, undefined to unselect
 * @param {boolean} option.silent if set true not emit `current-change`. default:false
 * @param {boolean} option.deep if set true, deep search in children. default:false
 */
function setCurrentRow(rowKeyOrRow: string | undefined | DT, option: { silent?: boolean; deep?: boolean } = { silent: false, deep: false }) {
    const select = rowKeyOrRow !== void 0;
    const currentRowTemp = currentRow.value;
    if (!select) {
        currentRow.value = void 0;
        currentRowKey.value = void 0;
        updateActiveMergedCells(true);
    } else if (typeof rowKeyOrRow === 'string') {
        const findRowByKey = (data: DT[], key: string): DT | null => {
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (rowKeyGen(item) === key) {
                    return item;
                }
                if (option.deep && item.children?.length) {
                    const found = findRowByKey(item.children, key);
                    if (found) {
                        return found;
                    }
                }
            }
            return null;
        };

        currentRowKey.value = rowKeyOrRow;
        updateActiveMergedCells(false, currentRowKey.value);
        const row = findRowByKey(dataSourceCopy.value || [], rowKeyOrRow);
        if (!row) {
            console.warn('setCurrentRow failed.rowKey:', rowKeyOrRow);
            return;
        }
        currentRow.value = row;
    } else {
        currentRow.value = rowKeyOrRow;
        currentRowKey.value = rowKeyGen(rowKeyOrRow);
        updateActiveMergedCells(false, currentRowKey.value);
    }
    if (!option.silent) {
        emits('current-change', /** no Event */ null, select ? currentRow.value : currentRowTemp, { select });
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
    const colKeyGenValue = colKeyGen.value;

    if (newOption.sort && dataSourceCopy.value?.length) {
        const column = newOption.sortOption || tableHeaderLast.value.find(it => colKeyGenValue(it) === sortCol.value);
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
    /**
     * 设置树节点展开状态
     *
     * en: Set tree node expand state
     * @see {@link setTreeExpand}
     */
    setTreeExpand,
    /**
     * 获取拖选选中的单元格信息
     *
     * en: Get selected cells info (cellSelection=true)
     * @see {@link getSelectedCells}
     */
    getSelectedCells,
    /**
     * 清空拖选选区
     *
     * en: Clear cell selection range (cellSelection=true)
     * @see {@link clearSelection}
     */
    clearSelection,
});
</script>
