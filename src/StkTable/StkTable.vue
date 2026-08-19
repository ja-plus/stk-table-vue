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
            'area-selection': areaSelectionConfig.enabled,
            'is-area-selecting': isAreaSelecting,
            'exp-scroll-y': isExperimentalScrollY,
        }"
        :tabindex="areaSelectionConfig.enabled ? 0 : void 0"
        :style="{
            '--row-height': props.autoRowHeight ? void 0 : virtualScroll.rowHeight + 'px',
            '--header-row-height': props.headerRowHeight + 'px',
            '--footer-row-height': props.footerRowHeight + 'px',
            '--highlight-duration': props.highlightConfig.duration && props.highlightConfig.duration + 's',
            '--highlight-timing-function': highlightSteps ? `steps(${highlightSteps})` : void 0,
            '--sb-width': `${scrollbarOptions.width}px`,
            '--sb-height': `${scrollbarOptions.height}px`,
        }"
        @scroll="onTableScroll"
        @wheel="onTableWheel"
    >
        <div v-if="!isExperimentalScrollY && SRBRTotalHeight" class="row-by-row-table-height" :style="`height: ${SRBRTotalHeight}px`"></div>

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
                <!-- table-layout:fixed 下浏览器仅依据首行/colgroup 决定列宽，多级表头时子列宽度位于非首行会被忽略。
                     故固定模式下通过 colgroup 显式声明每个叶子列宽度，保证子列 width 生效。 -->
                <colgroup v-if="props.fixedMode && !virtualX_on">
                    <col v-for="col in tableHeaderLast" :key="colKeyGen(col)" :style="getColGroupColStyle(col)" />
                </colgroup>
                <thead v-if="!headless">
                    <tr
                        v-for="(row, rowIndex) in virtualX_on ? virtualX_tableHeaders : tableHeaders"
                        :key="rowIndex"
                        @contextmenu="onHeaderMenu($event)"
                    >
                        <th
                            v-if="virtualX_on"
                            class="vt-x-left"
                            :style="`min-width:${theadVirtualX.offsetLeft}px;width:${theadVirtualX.offsetLeft}px`"
                        ></th>
                        <th
                            v-for="(col, colIndex) in row"
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
                            <div class="table-header-cell-wrapper" :style="col.__R_SP__ ? `--row-span:${col.__R_SP__}` : null">
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

                <component
                    :is="footerTagName"
                    v-if="footerData && footerData.length > 0"
                    class="stk-footer"
                    :style="isFooterTop ? `top:${tableHeaderHeight}px` : ''"
                >
                    <tr v-for="(footRow, footRowIndex) in footerData" :key="footRowIndex">
                        <td
                            v-if="virtualX_on"
                            class="vt-x-left"
                            :style="`min-width:${theadVirtualX.offsetLeft}px;width:${theadVirtualX.offsetLeft}px`"
                        ></td>
                        <template v-for="(col, _colIdx) in virtualX_columnPart" :key="col.__VT_C_SP__ ? `spacer-${_colIdx}` : colKeyGen(col)">
                            <td v-if="col.__VT_C_SP__" class="vt-x-spacer" :colspan="col.__VT_C_SP__"></td>
                            <td v-else v-bind="getTFProps(col)">
                                <component
                                    :is="col.customFooterCell"
                                    v-if="col.customFooterCell"
                                    class="table-cell-wrapper"
                                    tabindex="-1"
                                    :col="col"
                                    :row="footRow"
                                    :rowIndex="footRowIndex"
                                    :cellValue="footRow[col.dataIndex]"
                                />
                                <div class="table-cell-wrapper" tabindex="-1" :title="footRow[col.dataIndex] || ''">
                                    <span v-if="footRow[col.dataIndex] != null">{{ footRow[col.dataIndex] }}</span>
                                </div>
                            </td>
                        </template>
                        <td v-if="virtualX_on" class="vt-x-right" :style="`min-width:${virtualX_offsetRight}px;width:${virtualX_offsetRight}px`"></td>
                    </tr>
                </component>

                <tbody
                    class="stk-tbody-main"
                    :style="isExperimentalScrollY ? `transform:translateY(${virtualScroll.translateY}px)` : ''"
                    @click="onCellClick"
                    @mousedown="onCellMouseDown"
                    @mouseover="onCellMouseOver"
                    @mouseout="onTbodyMouseOut"
                    @drop="onBodyDrop"
                >
                    <tr v-if="!isExperimentalScrollY && virtual_on && !isSRBRActive" :style="paddingTopStyle" class="padding-top-tr">
                        <template v-if="fixedMode && headless">
                            <td
                                v-if="virtualX_on"
                                class="vt-x-left"
                                :style="`min-width:${theadVirtualX.offsetLeft}px;width:${theadVirtualX.offsetLeft}px`"
                            ></td>
                            <template v-for="(col, _colIdx) in virtualX_columnPart" :key="col.__VT_C_SP__ ? `spacer-${_colIdx}` : colKeyGen(col)">
                                <td v-if="col.__VT_C_SP__" class="vt-x-spacer" :colspan="col.__VT_C_SP__"></td>
                                <td v-else :style="cellStyleMap[TagType.TD].get(colKeyGen(col))"></td>
                            </template>
                            <td
                                v-if="virtualX_on"
                                class="vt-x-right"
                                :style="`min-width:${virtualX_offsetRight}px;width:${virtualX_offsetRight}px`"
                            ></td>
                        </template>
                    </tr>
                    <!-- tbody 渲染列表（异构）：
                         - row: 数据行（视口行 + 视口上方保留的锚点行/孤立空行）
                         - above-ph: 视口上方连续空行（无 td）合并的占位段
                         - below-ph: 视口下方行（rowspan 修正产生的 viewportEndIndex ~ endIndex 区域）
                           按跨界 rowspan 结束行切分的占位段
                         占位 tr 以 height: calc(var(--row-height) * 行数) 保持总高度，大 rowspan 场景显著减少 DOM 节点数 -->
                    <!-- key 必须在 template 上：v-for 模板含多个条件分支时子节点 key 不会提升到 Fragment，
                         会导致 Fragment 无 key 走 unkeyed diff，滚动时整行重建 -->
                    <template v-for="item in bodyRenderItems" :key="item.key">
                        <tr v-if="item.type === 'row'" ref="trRef" v-bind="getTRProps(item.row, item.rowIndex)">
                            <td v-if="item.row && item.row.__EXP_R__" :colspan="expandRowColspan">
                                <div class="table-cell-wrapper" tabindex="-1">
                                    <slot name="expand" :row="item.row.__EXP_R__" :col="item.row.__EXP_C__">
                                        {{ (item.row.__EXP_R__ && item.row.__EXP_C__ && item.row.__EXP_R__[item.row.__EXP_C__.dataIndex]) || '' }}
                                    </slot>
                                </div>
                            </td>
                            <template v-else>
                                <td v-if="virtualX_on" class="vt-x-left"></td>
                                <template
                                    v-for="(col, _colIdx) in getBodyColumns(item.row, item.rowIndex)"
                                    :key="col.__VT_C_SP__ ? `spacer-${_colIdx}` : col.__VT_PH__ ? `ph-${_colIdx}` : colKeyGen(col)"
                                >
                                    <td v-if="col.__VT_C_SP__" class="vt-x-spacer" :colspan="col.__VT_C_SP__"></td>
                                    <td v-else-if="col.__VT_PH__" class="vt-above-viewport-ph" :colspan="col.__VT_PH__"></td>
                                    <td
                                        v-else-if="!shouldHideCell(item.row, col)"
                                        v-bind="getTDProps(item.row, col, item.rowIndex, (col as PrivateStkTableColumn<DT>).__LF_S__ ?? 0)"
                                    >
                                        <component
                                            :is="col.customCell"
                                            v-if="col.customCell"
                                            class="table-cell-wrapper"
                                            tabindex="-1"
                                            :col="col"
                                            :row="item.row"
                                            :rowIndex="getAbsoluteRowIndex(item.rowIndex)"
                                            :colIndex="(col as PrivateStkTableColumn<DT>).__LF_S__ ?? 0"
                                            :cellValue="item.row && item.row[col.dataIndex]"
                                            :expanded="item.row && item.row.__EXP__"
                                            :tree-expanded="item.row && item.row.__T_EXP__"
                                        >
                                            <template #stkFoldIcon>
                                                <TriangleIcon @click="triangleClick($event, item.row, col)"></TriangleIcon>
                                            </template>
                                            <template #stkDragIcon>
                                                <DragHandle @dragstart="onTrDragStart($event, getAbsoluteRowIndex(item.rowIndex))" />
                                            </template>
                                        </component>
                                        <div v-else-if="!col.type" class="table-cell-wrapper" tabindex="-1" :title="item.row[col.dataIndex] || ''">
                                            {{
                                                (item.row && item.row[col.dataIndex]) != null
                                                    ? item.row && item.row[col.dataIndex]
                                                    : getEmptyCellText(col, item.row)
                                            }}
                                        </div>
                                        <div v-else-if="col.type === 'seq'" class="table-cell-wrapper" tabindex="-1">
                                            {{ (props.seqConfig.startIndex || 0) + getAbsoluteRowIndex(item.rowIndex) + 1 }}
                                        </div>
                                        <TreeNodeCell
                                            v-else-if="col.type === 'tree-node'"
                                            class="table-cell-wrapper"
                                            tabindex="-1"
                                            :col="col"
                                            :row="item.row"
                                        ></TreeNodeCell>
                                        <div v-else class="table-cell-wrapper" tabindex="-1" :title="item.row[col.dataIndex] || ''">
                                            <DragHandle
                                                v-if="col.type === 'dragRow'"
                                                @dragstart="onTrDragStart($event, getAbsoluteRowIndex(item.rowIndex))"
                                            />
                                            <TriangleIcon v-else-if="col.type === 'expand'" />
                                            <span v-if="item.row[col.dataIndex] != null">{{ item.row[col.dataIndex] }}</span>
                                        </div>
                                    </td>
                                </template>
                                <td v-if="virtualX_on" class="vt-x-right"></td>
                            </template>
                        </tr>
                        <tr
                            v-else-if="item.type === 'above-ph'"
                            class="vt-above-viewport-ph-row"
                            :data-above-count="item.count"
                            :style="`height: calc(var(--row-height) * ${item.count})`"
                        ></tr>
                        <tr
                            v-else
                            class="vt-below-viewport-ph"
                            :data-below-count="item.count"
                            :style="`height: calc(var(--row-height) * ${item.count})`"
                        ></tr>
                    </template>
                    <template v-if="!isExperimentalScrollY">
                        <tr v-if="virtual_on && !isSRBRActive" :style="offsetBottomStyle"></tr>
                        <tr v-if="SRBRBottomHeight" :style="SRBRBottomStyle"></tr>
                    </template>
                </tbody>
            </table>
            <div
                v-if="scrollbarOptions.enabled && showScrollbar.y"
                class="stk-sb-thumb vertical"
                :style="`height:${scrollbar.h}px;transform:translateY(${scrollbar.t}px)`"
                @mousedown="onVerticalScrollbarMouseDown"
                @touchstart.passive="onVerticalScrollbarMouseDown"
            ></div>
        </div>
        <div v-if="(!dataSourceCopy || !dataSourceCopy.length) && showNoData" class="stk-table-no-data" :class="{ 'no-data-full': noDataFull }">
            <slot name="empty">暂无数据</slot>
        </div>
        <slot name="customBottom"></slot>
        <div
            v-if="scrollbarOptions.enabled && showScrollbar.x"
            class="stk-sb-thumb horizontal"
            :style="`width:${scrollbar.w}px;transform:translateX(${scrollbar.l}px)`"
            @mousedown="onHorizontalScrollbarMouseDown"
            @touchstart.passive="onHorizontalScrollbarMouseDown"
        ></div>
    </div>
</template>

<!-- Vue 2.7 compatible: add component name -->
<script lang="ts">
export default {
    name: 'StkTable',
};
</script>

<script setup lang="ts">
/**
 * @author japlus
 */
import { computed, nextTick, onMounted, provide, ref, shallowRef, toRaw, toRef, watch } from 'vue';
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
import type { FilterStatus } from './custom-cells/FilterCell/types';
import { useAreaSelectionName } from './features';
import { ON_DEMAND_FEATURE } from './registerFeature';
import {
    AreaSelectionConfig,
    AreaSelectionRange,
    AutoRowHeightConfig,
    ColResizableConfig,
    DragRowConfig,
    ExpandConfig,
    ExperimentalConfig,
    FooterConfig,
    HeaderDragConfig,
    HighlightConfig,
    Order,
    PrivateRowDT,
    PrivateStkTableColumn,
    RowActiveOption,
    SeqConfig,
    SortConfig,
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
import { createMergeCellsCache } from './mergeCellsCache';
import { useMergeCells } from './useMergeCells';
import { useRowExpand } from './useRowExpand';
import { useScrollbar, type ScrollbarOptions } from './useScrollbar';
import { useScrollRowByRow } from './useScrollRowByRow';
import { useSorter } from './useSorter';
import { useTableColumns } from './useTableColumns';
import { useThDrag } from './useThDrag';
import { useTrDrag } from './useTrDrag';
import { useTree } from './useTree';
// import { useIndexResolver } from './useIndexResolver';
import { useVirtualScroll } from './useVirtualScroll';
import { useWheeling } from './useWheeling';
import { createStkTableId, getCalculatedColWidth } from './utils/constRefUtils';
import { getClosestColKey, getClosestTd, getClosestTr, getClosestTrIndex, rafThrottle, transformWidthToStr } from './utils/index';

/** Generic stands for DataType */
type DT = any & PrivateRowDT;

/** generate table instance id */
const stkTableId = createStkTableId();

// Vue 2.7 compatible: use export default instead of defineOptions
// defineOptions({ name: 'StkTable' });
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
        headerRowHeight?: number | string;
        /** 表尾行高。default = rowHeight */
        footerRowHeight?: number | string;
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
        areaSelection?: boolean | AreaSelectionConfig;
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
        /**
         * 实验性功能配置
         */
        experimental?: ExperimentalConfig;
        /** 表格底部合计行数据 */
        footerData?: DT[];
        /** 表格底部配置 */
        footerConfig?: FooterConfig;
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
        footerData: () => [],
        rowHover: true,
        rowActive: () => DEFAULT_ROW_ACTIVE_CONFIG,
        rowCurrentRevokable: true,
        headerRowHeight: DEFAULT_ROW_HEIGHT,
        footerRowHeight: DEFAULT_ROW_HEIGHT,
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
        areaSelection: false,
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
        experimental: () => ({}),
        footerConfig: () => ({ position: 'bottom' }),
    },
);

provide('stkTheme', toRef(props, 'theme'));

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
     * ```(ranges: AreaSelectionRange[])```
     */
    (e: 'area-selection-change', ranges: AreaSelectionRange[]): void;
    /**
     * 筛选变更触发(Beta)
     *
     * ```(status: Record<UniqKey, FilterStatus>)```
     */
    (e: 'filter-change', status: Record<UniqKey, FilterStatus>): void;
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

/** 表格底部是否吸附在顶部 */
const isFooterTop = computed(() => props.footerConfig?.position === 'top');

/** 表格底部标签名：顶部吸附用 tbody，底部吸附用 tfoot */
const footerTagName = computed(() => (isFooterTop.value ? 'tbody' : 'tfoot'));

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

const [tableHeaders, tableHeadersForCalc, dealColumns] = useTableColumns<DT>(props.virtualX, isRelativeMode);

const filterStatus = ref<Record<UniqKey, FilterStatus>>({});

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

const scrollbarOptions = computed(() => ({
    enabled: true,
    minHeight: 20,
    minWidth: 20,
    width: 8,
    height: 8,
    ...(typeof props.scrollbar === 'boolean' ? { enabled: props.scrollbar } : props.scrollbar),
}));

const isExperimentalScrollY = computed(() => {
    if (scrollbarOptions.value?.enabled && props.scrollRowByRow) {
        return true;
    }
    return props.experimental?.scrollY;
});

const rowKeyGenCache = new WeakMap();

// 使用 useSorter hook 管理排序逻辑
const [sortStates, sortCol, onColumnSort, setSorter, resetSorter, getSortColumns, dealDefaultSorter, getColumnSortState, sortData] = useSorter<DT>(
    props,
    emits,
    colKeyGen,
    tableHeaderLast,
    dataSourceCopy,
    initDataSource,
);

const [isSRBRActive] = useScrollRowByRow(props, tableContainerRef);

const [onThDragStart, onThDragOver, onThDrop, isHeaderDraggable] = useThDrag(props, emits, colKeyGen);

const [onTrDragStart, onTrDragEnter, onTrDragOver, onTrDrop, onTrDragEnd] = useTrDrag(props, emits, dataSourceCopy);

const [maxRowSpan, updateMaxRowSpan, getMaxRowSpanValue] = useMaxRowSpan(props, tableHeaderLast, rowKeyGen, dataSourceCopy);

/**
 * mergeCells 结果共享缓存：useVirtualScroll（可视列范围修正）与 useMergeCells
 * （hidden map 构建 / 视口上方占位 / 渲染）共用，同一单元格只调用一次用户回调，
 * 且可跨滚动帧复用（数据/列变化时才清空）。
 */
const mergeCellsCache = createMergeCellsCache();

const [
    virtualScroll,
    virtualScrollX,
    virtual_on,
    virtual_dataSourcePart,
    virtual_offsetBottom,
    virtualX_on,
    virtualX_offsetRight,
    tableHeaderHeight,
    initVirtualScroll,
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX,
    setAutoHeight,
    clearAllAutoHeight,
    clearColWidthCache,
    virtualX_tableHeaders,
    expandRowColspan,
    theadVirtualX,
    virtualX_columnPart,
    virtualX_expandColSegments,
] = useVirtualScroll(
    props,
    tableContainerRef,
    trRef,
    dataSourceCopy,
    tableHeaderLast,
    tableHeaders,
    rowKeyGen,
    maxRowSpan,
    getMaxRowSpanValue,
    scrollbarOptions,
    isExperimentalScrollY,
    mergeCellsCache,
);

/** requestAnimationFrame throttled version of updateVirtualScrollY for smoother wheel scrolling */
const rafUpdateVirtualScrollYForWheel = rafThrottle(updateVirtualScrollY);

const [scrollbar, showScrollbar, onVerticalScrollbarMouseDown, onHorizontalScrollbarMouseDown, updateCustomScrollbar] = useScrollbar(
    props,
    tableContainerRef,
    virtualScroll,
    virtualScrollX,
    updateVirtualScrollY,
    scrollbarOptions,
    isExperimentalScrollY,
);

/**
 * 是否允许把虚拟窗口内的连续空行合并为占位 tr。
 * autoRowHeight 时容器不定义 --row-height 且行高不均匀，不能合并。
 */
const canMergeEmptyRows = computed(() => virtual_on.value && !props.autoRowHeight);

/** 视口上方行数（rowspan/stripe 修正区域）。不允许合并时为 0（上方行走常规行渲染） */
const aboveViewportRowCount = computed(() => {
    if (!canMergeEmptyRows.value) return 0;
    const part = virtual_dataSourcePart.value;
    const { startIndex, viewportStartIndex } = virtualScroll.value;
    return Math.min(part.length, Math.max(0, viewportStartIndex - startIndex));
});

/**
 * 视口下方可合并的占位行数。
 * rowspan 修正会使 endIndex 超出 viewportEndIndex，二者之间的行无可见内容
 * （跨视口的合并单元格由视口内锚点覆盖），此前逐行渲染为空 tr。
 * 这里将其合并为占位 tr（按跨界 rowspan 结束行切段，见 belowPhSegments），
 * 用 `height: calc(var(--row-height) * N)` 保持总高度，
 * 大 rowspan 场景下可显著减少 DOM 节点数。
 * 行高不均匀时（autoRowHeight / 该区域存在展开行）不能按统一行高合并，返回 0。
 */
const belowViewportRowCount = computed(() => {
    if (!canMergeEmptyRows.value) return 0;
    const part = virtual_dataSourcePart.value;
    const { startIndex, viewportEndIndex } = virtualScroll.value;
    // 视口行数（含 rowspan/stripe 修正的越界部分），钳制到实际数据长度
    const viewportCount = Math.min(part.length, Math.max(0, viewportEndIndex - startIndex + 1));
    const count = part.length - viewportCount;
    if (count <= 0) return 0;
    // 展开行有独立行高（--row-height 被行内覆写），不能参与统一行高合并
    for (let i = viewportCount; i < part.length; i++) {
        if (part[i]?.__EXP_R__) return 0;
    }
    return count;
});

const [
    hiddenCellMap,
    mergeCellsWrapper,
    hoverMergedCells,
    updateHoverMergedCells,
    activeMergedCells,
    updateActiveMergedCells,
    aboveViewportColumnMap,
    aboveEmptyBlocks,
    belowPhSegments,
] = useMergeCells(
    rowActiveProp,
    tableHeaderLast,
    rowKeyGen,
    colKeyGen,
    virtual_dataSourcePart,
    virtualScroll,
    virtualX_columnPart,
    dataSourceCopy,
    mergeCellsCache,
    canMergeEmptyRows,
    belowViewportRowCount,
);

const getFixedColPosition = useGetFixedColPosition(tableHeadersForCalc, colKeyGen);

const getFixedStyle = useFixedStyle<DT>(props, isRelativeMode, getFixedColPosition, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight);

const [highlightSteps, setHighlightDimRow, setHighlightDimCell] = useHighlight(props, stkTableId, tableContainerRef);

function getRowIndex(row: DT): number {
    const targetKey = rowKeyGen(row);
    return dataSourceCopy.value.findIndex(item => rowKeyGen(item) === targetKey);
}

function getColumnIndex(column: PrivateStkTableColumn<DT>): number {
    const targetKey = colKeyGen.value(column);
    return tableHeaderLast.value.findIndex(item => colKeyGen.value(item) === targetKey);
}

const {
    config: areaSelectionConfig,
    isSelecting: isAreaSelecting,
    onMD: onSelectionMouseDown,
    // getClass: getAreaSelectionClasses,
    // getRowClass: getAreaSelectionRowClass,
    get: getSelectedArea,
    set: setAreaSelection,
    clear: clearSelectedArea,
    copy: copySelectedArea,
} = ON_DEMAND_FEATURE[useAreaSelectionName](
    props,
    emits,
    tableContainerRef,
    dataSourceCopy,
    tableHeaderLast,
    colKeyGen,
    cellKeyGen,
    scrollTo,
    virtualScroll,
    virtualScrollX,
    getRowIndex,
    getColumnIndex,
);

/** 键盘箭头滚动 */
useKeyboardArrowScroll(tableContainerRef, props, scrollTo, virtualScroll, virtualScrollX, tableHeaders, virtual_on, areaSelectionConfig);

/** 固定列处理 */
const [fixedCols, fixedColClassMap, updateFixedShadow] = useFixedCol(
    props,
    colKeyGen,
    getFixedColPosition,
    tableHeaders,
    tableHeadersForCalc,
    tableContainerRef,
);

if (props.autoResize) {
    useAutoResize(
        tableContainerRef,
        () => {
            initVirtualScroll();
            // 容器宽度变化后，需重新计算固定列状态
            updateFixedShadow();
        },
        props,
        200,
    );
}

const [colResizeOn, isColResizing, onThResizeMouseDown] = useColResize(
    props,
    emits,
    tableContainerRef,
    tableHeaderLast,
    colResizeIndicatorRef,
    colKeyGen,
    fixedCols,
    clearColWidthCache,
);

const [toggleExpandRow, setRowExpand] = useRowExpand(emits, dataSourceCopy, rowKeyGen, onDataSourceChange);

const [toggleTreeNode, setTreeExpand, flatTreeData] = useTree(props, dataSourceCopy, rowKeyGen, emits, onDataSourceChange);

/** style cache */
const paddingTopStyle = computed(() => `height:${virtualScroll.value.offsetTop}px`);
const offsetBottomStyle = computed(() => `height:${virtual_offsetBottom.value}px`);
const SRBRBottomStyle = computed(() => `height:${SRBRBottomHeight.value}px`);

/** tbody 渲染项：数据行 | 视口上方合并占位段 | 视口下方合并占位段 */
type BodyRenderItem =
    | { type: 'row'; row: DT; rowIndex: number; key: UniqKey }
    | { type: 'above-ph'; count: number; key: string }
    | { type: 'below-ph'; count: number; key: string };

/**
 * 视口上方区域（startIndex..viewportStartIndex-1）的有序渲染段。
 * 含 must-render 单元格（rowspan 跨入视口）的锚点行保留独立 tr；
 * 连续「无 td」的空行（aboveEmptyBlocks，>= 2 行）合并为单个占位段，
 * 以 height: calc(var(--row-height) * N) 保持总高度。
 *
 * 注意：占位段在 DOM 中只算 1 行，跨越它的 rowspan 属性已在
 * mergeCellsWrapper 中按合并行数修正，保证单元格不会多跨行。
 * 不允许合并时返回空数组。
 */
const aboveRenderParts = computed<BodyRenderItem[]>(() => {
    const aboveCount = aboveViewportRowCount.value;
    if (aboveCount <= 0) return [];
    const part = virtual_dataSourcePart.value;
    const blocks = aboveEmptyBlocks.value;
    const { startIndex } = virtualScroll.value;

    const items: BodyRenderItem[] = [];
    let i = 0;
    let blockIdx = 0;
    while (i < aboveCount) {
        const block = blocks[blockIdx];
        if (block && block.start === startIndex + i) {
            items.push({ type: 'above-ph', count: block.count, key: `vt-above-ph-${i}` });
            i += block.count;
            blockIdx++;
        } else {
            const row = part[i];
            items.push({ type: 'row', row, rowIndex: i, key: rowKeyGen(row) });
            i++;
        }
    }
    return items;
});

/**
 * tbody 渲染列表（异构）：视口上方段 + 视口行 + 视口下方占位段。
 * 不允许合并时退化为全量数据行列表。
 */
const bodyRenderItems = computed<BodyRenderItem[]>(() => {
    const part = virtual_dataSourcePart.value;
    const items = aboveRenderParts.value.slice();
    const rowEnd = part.length - belowViewportRowCount.value;
    for (let i = aboveViewportRowCount.value; i < rowEnd; i++) {
        const row = part[i];
        items.push({ type: 'row', row, rowIndex: i, key: rowKeyGen(row) });
    }
    // 下方占位按跨界 rowspan 结束行分段输出，保证不同结束行的单元格止于不同 tr
    const belowSegs = belowPhSegments.value;
    for (let i = 0; i < belowSegs.length; i++) {
        items.push({ type: 'below-ph', count: belowSegs[i].count, key: `vt-below-ph-${i}` });
    }
    return items;
});

watch(
    () => props.columns,
    () => {
        handleDealColumns();
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
        handleDealColumns();
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
    () => props.fixedColShadow,
    () => updateFixedShadow(),
);

handleDealColumns();
initDataSource();
updateMaxRowSpan();

onMounted(() => {
    initVirtualScroll();
    updateFixedShadow();
    dealDefaultSorter();
});

async function onDataSourceChange() {
    await nextTick();
    initVirtualScrollY();
    updateCustomScrollbar();
}

function initDataSource(v = props.dataSource, option?: { forceSort?: boolean }) {
    let dataSourceTemp = v.slice(); // shallow copy

    // 排序（tableSort 内部会根据 sortChildren 自动处理树形递归排序）
    if (!props.sortRemote || option?.forceSort) {
        dataSourceTemp = sortData(dataSourceTemp);
    }

    if (isTreeData.value) {
        dataSourceTemp = flatTreeData(dataSourceTemp);
    }
    dataSourceTemp = filterDataSource(dataSourceTemp);
    dataSourceCopy.value = dataSourceTemp;
}

function setFilter(
    status: Record<UniqKey, FilterStatus> | null,
    option?: {
        remote?: boolean;
        silent?: boolean;
    },
) {
    status = status || {};
    filterStatus.value = status;
    if (!option?.remote) {
        initDataSource();
    }
    if (!option?.silent) {
        emits('filter-change', status);
    }
}

function filterDataSource(dataSource: DT[]) {
    const filterKeys = Object.keys(filterStatus.value);
    if (!filterKeys?.length) return dataSource;
    let result = dataSource;
    for (const key of filterKeys) {
        const { value, filter } = filterStatus.value[key];
        if (!value?.length) continue;
        result = result.filter(row => {
            const cellValue = row[key];
            if (filter) {
                return filter({ row, cellValue, filterValues: value });
            }
            return value.some(v => cellValue == v);
        });
    }
    return result;
}

/**
 * Wrapper for dealColumns to pass props.columns
 */
function handleDealColumns() {
    dealColumns(props.columns);
}

function updateDataSource(val: DT[]) {
    if (!Array.isArray(val)) {
        console.warn('invalid dataSource');
        return;
    }

    let needInitVirtualScrollY = false;
    if (/* slots.customBottom || */ dataSourceCopy.value.length !== val.length) {
        needInitVirtualScrollY = true;
    }
    initDataSource(val);
    updateMaxRowSpan();

    // #47
    if (!val.length) {
        clearSelectedArea();
    }

    // if data length is not change, not init virtual scroll
    if (needInitVirtualScrollY) {
        // wait for table render,initVirtualScrollY has get `dom` operation.
        nextTick(() => initVirtualScrollY());
    }
    nextTick(updateCustomScrollbar);
}

/** tr key */
function rowKeyGen(row: DT | null | undefined) {
    if (!row) return row;

    let key = rowKeyGenCache.get(row);
    if (key !== undefined) return key;

    // Check for cached key in row object
    const cachedRowKey = (row as PrivateRowDT).__R_K__;
    if (cachedRowKey !== undefined) {
        rowKeyGenCache.set(row, cachedRowKey);
        return cachedRowKey;
    }

    key = rowKeyGenComputed.value(row);

    if (key === void 0) {
        // key为undefined时，不应该高亮行。因此重新生成key
        key = Math.random().toString(36).slice(2);
    }
    rowKeyGenCache.set(row, key);
    return key;
}

/** td key */
function cellKeyGen(row: DT | null | undefined, col: StkTableColumn<DT>) {
    return rowKeyGen(row) + CELL_KEY_SEPARATE + colKeyGen.value(col);
}

const cellStyleMap = computed(() => {
    const thMap = new Map();
    const tdMap = new Map();
    const tfMap = new Map();
    const { virtualX } = props;
    const headers = tableHeaders.value;
    const colKeyGenValue = colKeyGen.value;

    for (let depth = 0, depthLen = headers.length; depth < depthLen; depth++) {
        const cols = headers[depth];
        for (let i = 0, colsLen = cols.length; i < colsLen; i++) {
            const col = cols[i];
            const width = virtualX ? getCalculatedColWidth(col) + 'px' : transformWidthToStr(col.width);
            const minWidthStr = transformWidthToStr(col.minWidth);
            const maxWidthStr = transformWidthToStr(col.maxWidth);
            // en: Use string instead of object to reduce patchStyle overhead
            let styleStr = '';
            if (width) styleStr += `--cw:${width}`;
            if (minWidthStr) styleStr += `;min-width:${minWidthStr}`;
            if (maxWidthStr) styleStr += `;max-width:${maxWidthStr}`;
            const colKey = colKeyGenValue(col);
            thMap.set(colKey, styleStr + ';' + getFixedStyle(TagType.TH, col, depth));
            tdMap.set(colKey, styleStr + ';' + getFixedStyle(TagType.TD, col, depth));
            tfMap.set(colKey, 'position:sticky;' + styleStr + ';' + getFixedStyle(TagType.TF, col, depth));
        }
    }
    return {
        [TagType.TH]: thMap,
        [TagType.TD]: tdMap,
        [TagType.TF]: tfMap,
    };
});

/**
 * fixed 模式下 colgroup 中单个 col 的样式。
 * 仅取叶子列的 width（与 cellStyleMap 中 --cw 保持一致）；未设置 width 的列不声明宽度，
 * 由 table-layout:fixed 将剩余空间平分，符合“一列固定、其余列平分”的预期。
 */
function getColGroupColStyle(col: PrivateStkTableColumn<DT>) {
    const width = transformWidthToStr(col.width);
    return width ? `width:${width}` : null;
}

function getAbsoluteRowIndex(rowIndex: number) {
    return rowIndex + virtualScroll.value.startIndex;
}

function shouldHideCell(row: PrivateRowDT | null | undefined, col: StkTableColumn<PrivateRowDT>): boolean | undefined {
    if (!hiddenCellMap.value || !row) return;
    return hiddenCellMap.value[rowKeyGen(row)]?.has(colKeyGen.value(col));
}

/**
 * Get the column list for a body row.
 * - Above-viewport rows: returns a modified list with placeholder entries (__VT_PH__) to reduce DOM nodes.
 *   Rows without any must-render cell return [] and consecutive such rows are merged into a single
 *   placeholder tr (see aboveRenderParts).
 * - Below-viewport rows: normally merged into placeholder tr segments split at crossing rowspan
 *   ends (see belowPhSegments); when still rendered individually (fallback), returns []
 *   (tr already has height via CSS, no td needed).
 *
 * 仅在 canMergeEmptyRows（定高虚拟列表）时启用上述剔除：空 tr 依赖 CSS `height: var(--row-height)`
 * 保持高度，autoRowHeight 模式行高靠 td 内容撑开（容器也不定义 --row-height），
 * 剔除 td 会让视口上方行（stripe/rowspan 修正保留的行）塌陷为 0 高，且塌陷高度会被
 * DOM 测量写入行高缓存，导致行高无法正常撑开。
 */
function getBodyColumns(row: PrivateRowDT | null | undefined, rowIndex: number): PrivateStkTableColumn<PrivateRowDT>[] {
    if (!row) return virtualX_columnPart.value;
    if (canMergeEmptyRows.value) {
        const { startIndex, viewportStartIndex, viewportEndIndex } = virtualScroll.value;
        const aboveCount = viewportStartIndex - startIndex;
        if (aboveCount > 0 && rowIndex < aboveCount) {
            return (aboveViewportColumnMap.value.get(rowKeyGen(row)) || virtualX_columnPart.value) as PrivateStkTableColumn<PrivateRowDT>[];
        }
        // Below-viewport rows: no td needed
        if (startIndex + rowIndex > viewportEndIndex) {
            return [];
        }
    }
    const segments = virtualX_expandColSegments.value;
    if (!segments) return virtualX_columnPart.value;
    return buildExpandColumns(row, rowIndex, segments) as PrivateStkTableColumn<PrivateRowDT>[];
}

/**
 * 超长 colspan 优化：收缩修正扩展区域（virtualX_expandColSegments）内的行渲染列列表。
 * - 左扩展区：colspan/rowspan 锚点单元格保留真实渲染（否则行列占位断裂）；
 *   被覆盖单元格照旧不渲染（槽位由跨越它的单元格占用）；其余连续普通单元格
 *   合并为单个 colspan 占位 td（fixed 布局下恰好占用相同列槽位，保持对齐）；
 * - 右扩展区：完全不渲染（均在可视视口外，不影响可视单元格对齐）。
 */
function buildExpandColumns(
    row: PrivateRowDT,
    rowIndex: number,
    segments: {
        prefix: PrivateStkTableColumn<PrivateRowDT>[];
        leftExpand: PrivateStkTableColumn<PrivateRowDT>[];
        viewport: PrivateStkTableColumn<PrivateRowDT>[];
        suffix: PrivateStkTableColumn<PrivateRowDT>[];
        leftExpandStart: number;
    },
) {
    const { prefix, leftExpand, viewport, suffix, leftExpandStart } = segments;
    const result: (PrivateStkTableColumn<PrivateRowDT> | { __VT_PH__: number })[] = prefix.slice();

    if (leftExpand.length) {
        const hiddenSet = hiddenCellMap.value ? hiddenCellMap.value[rowKeyGen(row)] : void 0;
        const colKeyGenValue = colKeyGen.value;
        const absRowIndex = (virtual_on.value ? virtualScroll.value.startIndex : 0) + rowIndex;
        let run = 0;
        for (let i = 0; i < leftExpand.length; i++) {
            const col = leftExpand[i];
            // 被覆盖单元格：不渲染 td（槽位由上方/左侧的跨越单元格占用）
            if (hiddenSet && hiddenSet.has(colKeyGenValue(col))) continue;
            // 锚点单元格（colspan/rowspan > 1）必须真实渲染，不能占位替代
            if (col.mergeCells) {
                const { colspan, rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, col.__LF_S__ ?? leftExpandStart + i);
                if (colspan > 1 || rowspan > 1) {
                    if (run > 0) {
                        result.push({ __VT_PH__: run } as PrivateStkTableColumn<PrivateRowDT>);
                        run = 0;
                    }
                    result.push(col);
                    continue;
                }
            }
            run++;
        }
        if (run > 0) result.push({ __VT_PH__: run } as PrivateStkTableColumn<PrivateRowDT>);
    }

    // 右扩展区不渲染，直接拼接可视区与右侧固定列
    result.push(...viewport, ...suffix);
    return result;
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
    const rowIndex = getAbsoluteRowIndex(index);
    const rowKey = rowKeyGen(row);

    const classList = [props.rowClassName(row, rowIndex), row?.__EXP__ ? 'expanded' : '', row?.__EXP_R__ ? 'expanded-row' : ''];
    // area selection row highlight
    // if (areaSelectionConfig.value.enabled) {
    //     classList.push(...getAreaSelectionRowClass(rowIndex));
    // }
    if (currentRowKey.value === rowKey || row === currentRow.value) {
        classList.push('active');
    }
    if (props.showTrHoverClass && (rowKey === currentHoverRowKey.value || row === currentHoverRow)) {
        classList.push('hover');
    }

    const result: Record<string, number | string | null> = {
        id: stkTableId + '-' + rowKey,
        'data-row-key': rowKey,
        'data-row-i': rowIndex,
        class: classList.filter(Boolean).join(' '),
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
    const sortState = getColumnSortState(colKey);
    const isSorted = !!sortState && sortState.order !== null;

    return {
        'data-col-key': colKey,
        draggable: Boolean(isHeaderDraggable(col)),
        rowspan: col.__R_SP__,
        colspan: col.__C_SP__,
        style: cellStyleMap.value[TagType.TH].get(colKey),
        title: getHeaderTitle(col),
        class: [
            col.sorter ? 'sortable' : '',
            isSorted && 'sorter-' + sortState?.order,
            col.headerClassName,
            fixedColClassMap.value.get(colKey),
            col.headerAlign &&
                (col.headerAlign === 'left' ? 'text-l' : col.headerAlign === 'right' ? 'text-r' : col.headerAlign === 'center' ? 'text-c' : null),
        ],
    };
}

function getTFProps(col: StkTableColumn<DT>) {
    const colKey = colKeyGen.value(col);
    return {
        'data-col-key': colKey,
        style: cellStyleMap.value[TagType.TF].get(colKey),
        class: [
            col.className,
            fixedColClassMap.value.get(colKey),
            col.type === 'seq' ? 'seq-column' : '',
            col.align === 'center' ? 'text-c' : col.align === 'right' ? 'text-r' : '',
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
    // // area selection style
    // if (areaSelectionConfig.value.enabled) {
    //     const absRowIndex = getAbsoluteRowIndex(rowIndex);
    //     classList.push(...getAreaSelectionClasses(cellKey, absRowIndex, colKey));
    // }
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
        ...mergeCellsWrapper(row, col, rowIndex, (col as PrivateStkTableColumn<DT>).__LF_S__ ?? 0),
    };
}

function onRowClick(e: MouseEvent) {
    const rowIndex = getClosestTrIndex(e.target as HTMLElement);
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
    const rowIndex = getClosestTrIndex(e.target as HTMLElement);
    const row = dataSourceCopy.value[rowIndex];
    if (!row) return;
    emits('row-dblclick', e, row, { rowIndex });
}

function onHeaderMenu(e: MouseEvent) {
    emits('header-row-menu', e);
}

function onRowMenu(e: MouseEvent) {
    const rowIndex = getClosestTrIndex(e.target as HTMLElement);
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
    const rowIndex = getClosestTrIndex(e.target as HTMLElement);
    const row = dataSourceCopy.value[rowIndex];
    if (!row) return;
    const colKey = getClosestColKey(e.target as HTMLElement);
    const col = tableHeaderLast.value.find(item => colKeyGen.value(item) === colKey);
    if (!col) return;
    // Delegated triangle/fold icon click
    if ((e.target as HTMLElement)?.closest('.stk-fold-icon')) {
        triangleClick(e, row, col);
        return;
    }
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
    const rowIndex = getClosestTrIndex(e.target as HTMLElement) || 0;
    const row = dataSourceCopy.value[rowIndex];
    const colKey = getClosestColKey(e.target as HTMLElement);
    const col = tableHeaderLast.value.find(item => colKeyGen.value(item) === colKey) as any;
    return { row, col, rowIndex };
}

/** th click */
function onHeaderCellClick(e: MouseEvent, col: StkTableColumn<DT>) {
    onColumnSort(col);
    emits('header-cell-click', e, col);
}

/**
 * Delegated mouseover on tbody: emits cell-mouseover, and simulates cell-mouseenter
 * by checking if relatedTarget is outside the current td.
 */
function onCellMouseOver(e: MouseEvent) {
    const td = getClosestTd(e.target as HTMLElement);
    if (!td) return;
    const { row, col } = getCellEventData(e);
    emits('cell-mouseover', e, row, col);
    // Simulate cell-mouseenter: relatedTarget is outside this td
    const related = e.relatedTarget as Node | null;
    if (!related || !td.contains(related)) {
        emits('cell-mouseenter', e, row, col);
    }
}

/**
 * Delegated mouseout on tbody: handles both cell-mouseleave and tr-mouseleave.
 * - cell-mouseleave: relatedTarget is outside the current td.
 * - tr-mouseleave: relatedTarget is outside the current tr (simulates the old onTrMouseLeave).
 */
function onTbodyMouseOut(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const related = e.relatedTarget as Node | null;

    // Cell mouseleave
    const td = getClosestTd(target);
    if (td && (!related || !td.contains(related))) {
        const { row, col } = getCellEventData(e);
        emits('cell-mouseleave', e, row, col);
    }

    // Tr mouseleave
    const tr = getClosestTr(target);
    if (tr && (!related || !tr.contains(related))) {
        currentHoverRow = null;
        if (props.showTrHoverClass) {
            currentHoverRowKey.value = null;
        }
        if (props.rowHover) {
            updateHoverMergedCells(void 0);
        }
    }
}

/** Delegated drop on tbody: extracts rowIndex from the closest tr and calls onTrDrop. */
function onBodyDrop(e: DragEvent) {
    const trIndex = getClosestTrIndex(e.target as HTMLElement);
    if (trIndex < 0) return;
    onTrDrop(e, getAbsoluteRowIndex(trIndex));
}

function onCellMouseDown(e: MouseEvent) {
    const { row, col, rowIndex } = getCellEventData(e);
    emits('cell-mousedown', e, row, col, { rowIndex });

    if (areaSelectionConfig.value.enabled) {
        onSelectionMouseDown(e);
    }
}

// isWheeling: true when wheel event is triggered, auto reset to false after delay
const [isWheeling, setIsWheeling] = useWheeling();

/**
 * proxy scroll, prevent white screen
 * @param e
 */
function onTableWheel(e: WheelEvent) {
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
        // overflow: hidden mode: manually control scroll, preventDefault to block parent scroll
        const canScrollDown = scrollTop < scrollHeight - containerHeight - 1;
        const canScrollUp = scrollTop > 1;

        if ((deltaY > 0 && canScrollDown) || (deltaY < 0 && canScrollUp)) {
            // Table can still scroll → mark wheeling & prevent parent
            setIsWheeling(true);
            e.preventDefault();
        } else if (isWheeling()) {
            // At boundary but user is still actively wheeling → briefly prevent parent for smooth transition
            e.preventDefault();
        }
        // At boundary + isWheeling expired → no preventDefault → browser scrolls parent naturally

        if (isExperimentalScrollY.value) {
            rafUpdateVirtualScrollYForWheel(scrollTop + deltaY);
            updateCustomScrollbar();
        } else {
            dom.scrollTop += deltaY;
        }
    }
    if (virtualX_on.value) {
        const { containerWidth, scrollLeft, scrollWidth } = virtualScrollX.value;
        let distance = deltaX;
        if (shiftKey && deltaY) {
            distance = deltaY;
        }
        const canScrollRight = scrollLeft < scrollWidth - containerWidth - 1;
        const canScrollLeft = scrollLeft > 1;

        if ((distance > 0 && canScrollRight) || (distance < 0 && canScrollLeft)) {
            setIsWheeling(true);
            e.preventDefault();
        } else if (isWheeling()) {
            e.preventDefault();
        }
        dom.scrollLeft += distance;
    }
}

/** Prevent re-entrant requestAnimationFrame in onTableScroll */
let scrollRAFScheduled = false;

/**
 * @param e scrollEvent
 */
function onTableScroll(e: Event) {
    if (!e?.target || scrollRAFScheduled) return;
    scrollRAFScheduled = true;
    requestAnimationFrame(() => {
        scrollRAFScheduled = false;
        const { scrollTop, scrollLeft } = e.target as HTMLElement;
        const { scrollTop: vScrollTop } = virtualScroll.value;
        const { scrollLeft: vScrollLeft } = virtualScrollX.value;
        // 在 experimental.scrollY 模式下，纵向滚动通过 transform 模拟，DOM scrollTop 始终为 0，
        // 不能用来判断纵向滚动，否则横向滚动时会误触发纵向滚动重置
        const isYScroll = isExperimentalScrollY.value ? false : scrollTop !== vScrollTop;
        const isXScroll = scrollLeft !== vScrollLeft;

        if (isYScroll) {
            updateVirtualScrollY(scrollTop);
        }

        if (isXScroll) {
            if (virtualX_on.value) {
                updateVirtualScrollX(scrollLeft);
            } else {
                // en: Record the scroll position. Used to determine isXScroll
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
    const tr = getClosestTr(e.target as HTMLElement);
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
 * set scroll bar position
 * @param top null to not change
 * @param left null to not change
 */
function scrollTo(top: number | null = 0, left: number | null = 0) {
    if (!tableContainerRef.value) return;
    if (top !== null) {
        if (isExperimentalScrollY.value) {
            updateVirtualScrollY(top);
            updateCustomScrollbar();
        } else {
            tableContainerRef.value.scrollTop = top;
        }
    }
    if (left !== null) tableContainerRef.value.scrollLeft = left;
}

/** get current table data */
function getTableData() {
    return toRaw(dataSourceCopy.value);
}

/**
 * 清空 mergeCells 结果缓存并强制重算合并结果。
 *
 * 缓存以「绝对行索引 + 叶子列索引」为键、行引用同一性校验命中，
 * 仅在 dataSource/列配置变化时自动清空。业务代码原地修改行字段
 * （行对象引用不变，常见于响应式行对象）且 mergeCells 结果依赖这些字段时，
 * 缓存会命中旧结果，需调用本方法显式失效。
 */
function clearMergeCellsCache() {
    mergeCellsCache.clear();
    // 重建 dataSourceCopy（新数组引用）：触发缓存清空 watch 与渲染更新，
    // 使 hiddenCellMap/hoverRowMap 及渲染出的 rowspan/colspan 全部重算
    initDataSource();
    updateMaxRowSpan();
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
     * 清空 mergeCells 结果缓存并强制重算合并结果
     *
     * en: Clear mergeCells result cache and force recomputation
     * @see {@link clearMergeCellsCache}
     */
    clearMergeCellsCache,
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
     * 排序状态数组
     *
     * en: Multi-column sort states array
     */
    sortStates,
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
    getRowIndex,
    getColumnIndex,
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
     * en: Get selected cells info (areaSelection=true)
     * @see {@link getSelectedArea}
     */
    getSelectedArea,
    /**
     * 设置拖选选区
     *
     * en: Set cell selection range (areaSelection=true)
     * @see {@link setAreaSelection}
     */
    setAreaSelection,
    /**
     * 清空拖选选区
     *
     * en: Clear cell selection range (areaSelection=true)
     * @see {@link clearSelectedArea}
     */
    clearSelectedArea,
    /**
     * 复制选区内容到剪贴板
     *
     * en: Copy selected area to clipboard (areaSelection=true)
     * @see {@link copySelectedArea}
     */
    copySelectedArea,
    /**
     * 设置筛选状态(Beta)
     *
     * en: Set filter status(Beta)
     * @see {@link setFilter}
     */
    setFilter,
});
</script>
