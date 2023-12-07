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
    <table class="stk-table-main" :style="{ width: tableWidth, minWidth, maxWidth }">
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
            :data-col-key="col.dataIndex"
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
              <div
                v-if="colResizable"
                class="table-header-resizer right"
                @mousedown="e => onThResizeMouseDown(e, col)"
              ></div>
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
        <tr v-if="virtual_on" :style="{ height: `${virtualScroll.offsetTop}px` }"></tr>
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
            :class="[col.className, showOverflow ? 'text-overflow' : '', col.fixed ? 'fixed-cell' : '']"
            :style="getCellStyle(2, col)"
            @click="e => onCellClick(e, row, col)"
          >
            <component :is="col.customCell" v-if="col.customCell" :col="col" :row="row" />
            <div v-else class="table-cell-wrapper" :title="row[col.dataIndex]">
              {{ row[col.dataIndex] ?? emptyCellText }}
            </div>
          </td>
        </tr>
        <tr v-if="virtual_on" :style="{ height: `${virtual_offsetBottom}px` }"></tr>
      </tbody>
    </table>
    <div
      v-if="(!dataSourceCopy || !dataSourceCopy.length) && showNoData"
      class="stk-table-no-data"
      :class="{ 'no-data-full': noDataFull }"
    >
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
import { SortOption, StkProps, StkTableColumn } from '@/StkTable/types/index';
import { CSSProperties, computed, onMounted, ref, shallowRef, toRaw, watch } from 'vue';
import { Default_Col_Width, Highlight_Color_Change_Freq, Is_Legacy_Mode } from './const';
import { useColResize } from './useColResize';
import { useHighlight } from './useHighlight';
import { useThDrag } from './useThDrag';
import { useVirtualScroll } from './useVirtualScroll';
import { howDeepTheColumn, tableSort } from './utils';

const props = withDefaults(defineProps<StkProps>(), {
  width: '',
  minWidth: 'min-content',
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
const sortSwitchOrder = [null, 'desc', 'asc'];

/** 表头.内容是 props.columns 的引用集合 */
const tableHeaders = ref<StkTableColumn<any>[][]>([]);
/** 若有多级表头时，最后一行的tableHeaders.内容是 props.columns 的引用集合  */
const tableHeaderLast = ref<StkTableColumn<any>[]>([]);

const dataSourceCopy = shallowRef([...props.dataSource]);

/**高亮帧间隔 
const highlightStepDuration = Highlight_Color_Change_Freq / 1000 + 's';*/

/** rowKey缓存 */
const rowKeyGenStore = new WeakMap();

const tableWidth = computed(() => {
  return props.colResizable ? 'fit-content' : props.width;
});

const fixedColumnsPositionStore = computed(() => {
  const store: Record<string, number> = {};
  const cols = [...tableHeaderLast.value];
  let left = 0;
  for (let i = 0; i < cols.length; i++) {
    const item = cols[i];
    if (item.fixed === 'left') {
      store[item.dataIndex] = left;
      left += parseInt(item.width || Default_Col_Width);
    }
  }
  let right = 0;
  for (let i = cols.length - 1; i >= 0; i--) {
    const item = cols[i];
    if (item.fixed === 'right') {
      store[item.dataIndex] = right;
      right += parseInt(item.width || Default_Col_Width);
    }
  }

  return store;
});

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
  initVirtualScrollY,
  initVirtualScrollX,
  updateVirtualScrollY,
  updateVirtualScrollX,
} = useVirtualScroll({ tableContainer, props, dataSourceCopy, tableHeaderLast });

/**
 * 高亮行，高亮单元格
 */
const { setHighlightDimCell, setHighlightDimRow } = useHighlight({ props, tableContainer, rowKeyGen });

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
 * 初始化虚拟滚动参数
 * @param {number} [height] 虚拟滚动的高度
 */
function initVirtualScroll(height?: number) {
  initVirtualScrollY(height);
  initVirtualScrollX();
}

/**
 * 固定列的style
 * @param {1|2} tagType 1-th 2-td
 * @param {StkTableColumn} col
 */
function getFixedStyle(tagType: 1 | 2, col: StkTableColumn<any>): CSSProperties {
  const style: CSSProperties = {};
  if (Is_Legacy_Mode) {
    if (tagType === 1) {
      style.position = 'relative';
      style.top = virtualScroll.value.scrollTop + 'px';
    }
  }
  const { fixed, dataIndex } = col;
  if (fixed === 'left' || fixed === 'right') {
    const isFixedLeft = fixed === 'left';
    if (Is_Legacy_Mode) {
      /**
       * ----------浏览器兼容--------------
       */
      style.position = 'relative'; // 固定列方案替换为relative。原因:transform 在chrome84浏览器，列变动会导致横向滚动条计算出问题。
      if (isFixedLeft) {
        if (virtualX_on.value) style.left = virtualScrollX.value.scrollLeft - virtualScrollX.value.offsetLeft + 'px';
        else style.left = virtualScrollX.value.scrollLeft + 'px';
      } else {
        // TODO:计算右侧距离
        style.right = `${virtualX_offsetRight.value}px`;
      }
      if (tagType === 1) {
        style.top = virtualScroll.value.scrollTop + 'px';
        style.zIndex = isFixedLeft ? '4' : '3'; // 保证固定列高于其他单元格
      } else {
        style.zIndex = isFixedLeft ? '3' : '2';
      }
    } else {
      /**
       * -------------高版本浏览器----------------
       */
      style.position = 'sticky';
      if (isFixedLeft) {
        style.left = fixedColumnsPositionStore.value[dataIndex] + 'px';
      } else {
        style.right = fixedColumnsPositionStore.value[dataIndex] + 'px';
      }
      if (tagType === 1) {
        style.top = '0';
        style.zIndex = isFixedLeft ? '4' : '3'; // 保证固定列高于其他单元格
      } else {
        style.zIndex = isFixedLeft ? '3' : '2';
      }
    }
  }

  return style;
}

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
 * @param {StkTableColumn} col
 */
function colKeyGen(col: StkTableColumn<any>) {
  return typeof props.colKey === 'function' ? props.colKey(col) : (col as any)[props.colKey];
}

/**
 * 性能优化，缓存style行内样式
 *
 * FIXME: col变化时仍从缓存拿style。watch col?
 * @param {1|2} tagType 1-th 2-td
 * @param {StkTableColumn} col
 */
function getCellStyle(tagType: 1 | 2, col: StkTableColumn<any>): CSSProperties {
  const fixedStyle = getFixedStyle(tagType, col);
  const style: CSSProperties = {
    width: col.width,
    minWidth: props.colResizable ? col.width : col.minWidth || col.width,
    maxWidth: props.colResizable ? col.width : col.maxWidth || col.width,
    ...fixedStyle,
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
function setSorter(
  dataIndex: string,
  order: null | 'asc' | 'desc',
  option: { sortOption?: SortOption; silent?: boolean; sort?: boolean } = {},
) {
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

/** 滚动 */
function scrollTo(top = 0, left = 0) {
  if (!tableContainer.value) return;
  if (top !== null) tableContainer.value.scrollTop = top;
  if (left !== null) tableContainer.value.scrollLeft = left;
}

/** 获取当前状态的表格数据 */
function getTableData() {
  return toRaw(dataSourceCopy.value);
}

defineExpose({
  setCurrentRow,
  setHighlightDimCell,
  setHighlightDimRow,
  setSorter,
  resetSorter,
  scrollTo,
  getTableData,
});
</script>

<style lang="less" scoped>
.stk-table {
  // contain: strict;
  --row-height: 28px;
  --cell-padding-x: 8px;
  --resize-handle-width: 4px;
  --border-color: #e8eaec;
  --border-width: 1px;
  --td-bgc: #fff;
  --th-bgc: #f8f8f9;
  --tr-active-bgc: rgb(230, 247, 255);
  --tr-hover-bgc: rgba(230, 247, 255, 0.7);
  --bg-border-top: linear-gradient(180deg, var(--border-color) var(--border-width), transparent var(--border-width));
  --bg-border-right: linear-gradient(270deg, var(--border-color) var(--border-width), transparent var(--border-width));
  --bg-border-bottom: linear-gradient(0deg, var(--border-color) var(--border-width), transparent var(--border-width));
  --bg-border-left: linear-gradient(90deg, var(--border-color) var(--border-width), transparent var(--border-width));
  --highlight-color: #71a2fd;

  --sort-arrow-color: #5d5f69;
  --sort-arrow-hover-color: #8f90b5;
  --sort-arrow-active-color: #1b63d9;
  --sort-arrow-active-sub-color: #cbcbe1;
  /** 列宽拖动指示器颜色 */
  --col-resize-indicator-color: #cbcbe1;

  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;

  /**深色模式 */
  &.dark {
    --th-bgc: #181c21;
    --td-bgc: #181c21;
    --border-color: #26292e;
    --tr-active-bgc: #283f63;
    --tr-hover-bgc: #1a2b46;
    --table-bgc: #181c21;
    --highlight-color: #1e4c99; // 不能用rgba，因为固定列时，会变成半透明

    --sort-arrow-color: #5d6064;
    --sort-arrow-hover-color: #727782;
    --sort-arrow-active-color: #d0d1d2;
    --sort-arrow-active-sub-color: #5d6064;

    --col-resize-indicator-color: #5d6064;

    // background-color: var(--table-bgc); // ⭐这里加background-color会导致表格出滚动白屏
    color: #d0d1d2;
  }

  // .stk-table-fixed-left-col-box-shadow {
  //   position: sticky;
  //   left: 0;
  //   top: 0;
  //   height: 100%;
  //   box-shadow: 0 0 10px;
  //   z-index: 1;
  //   pointer-events: none;
  // }
  &.headless {
    border-top: 1px solid var(--border-color);
  }

  /** 调整列宽的时候不要触发th事件。否则会导致触发表头点击排序 */
  &.is-col-resizing th {
    pointer-events: none;
  }

  /** 列宽调整指示器 */
  .column-resize-indicator {
    width: 0;
    height: 100%;
    border-left: 1px dashed var(--col-resize-indicator-color);
    position: absolute;
    z-index: 10;
    display: none;
    pointer-events: none;
  }

  .stk-table-main {
    border-spacing: 0;
    border-collapse: separate;

    th,
    td {
      z-index: 1;
      height: var(--row-height);
      font-size: 14px;
      box-sizing: border-box;
      padding: 0 var(--cell-padding-x);
      background-image: var(--bg-border-right), var(--bg-border-bottom);
    }

    thead {
      tr {
        &:first-child th {
          position: sticky;
          top: 0;
          // border-top: 1px solid var(--border-color);
          background-image: var(--bg-border-top), var(--bg-border-right), var(--bg-border-bottom);

          &:first-child {
            background-image: var(--bg-border-top), var(--bg-border-right), var(--bg-border-bottom),
              var(--bg-border-left);
          }
        }

        th {
          background-color: var(--th-bgc);

          &.sortable {
            cursor: pointer;
          }

          &:first-child {
            // border-left: 1px solid var(--border-color);
            background-image: var(--bg-border-right), var(--bg-border-bottom), var(--bg-border-left);
            // padding-left: 12px;
          }

          // &:last-child {
          //   padding-right: 12px;
          // }
          &.text-overflow {
            .table-header-cell-wrapper {
              white-space: nowrap;
              overflow: hidden;

              .table-header-title {
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }

          &:not(.sorter-desc):not(.sorter-asc):hover .table-header-cell-wrapper .table-header-sorter {
            #arrow-up {
              fill: var(--sort-arrow-hover-color);
            }

            #arrow-down {
              fill: var(--sort-arrow-hover-color);
            }
          }

          &.sorter-desc .table-header-cell-wrapper .table-header-sorter {
            // display:initial;
            #arrow-up {
              fill: var(--sort-arrow-active-sub-color);
            }

            #arrow-down {
              fill: var(--sort-arrow-active-color);
            }
          }

          &.sorter-asc .table-header-cell-wrapper .table-header-sorter {
            // display:initial;
            #arrow-up {
              fill: var(--sort-arrow-active-color);
            }

            #arrow-down {
              fill: var(--sort-arrow-active-sub-color);
            }
          }

          .table-header-cell-wrapper {
            max-width: 100%; //最大宽度不超过列宽
            display: inline-flex;
            align-items: center;

            .table-header-title {
              overflow: hidden;
              align-self: flex-start;
            }

            .table-header-sorter {
              flex-shrink: 0;
              margin-left: 4px;
              width: 16px;
              height: 16px;

              // display:none;
              #arrow-up,
              #arrow-down {
                fill: var(--sort-arrow-color);
              }
            }

            .table-header-resizer {
              position: absolute;
              top: 0;
              bottom: 0;
              cursor: col-resize;
              width: var(--resize-handle-width);

              &.left {
                left: 0;
              }

              &.right {
                right: 0;
              }
            }
          }
        }
      }
    }

    tbody {
      /**高亮渐暗 */
      @keyframes dim {
        from {
          background-color: var(--highlight-color);
        }
      }

      tr {
        background-color: var(--td-bgc); // td inherit tr bgc

        &.highlight-row {
          animation: dim 2s linear;
        }

        // &.highlight-row-transition {
        //   transition: background-color v-bind(highlightStepDuration) linear;
        // }

        &.hover,
        &:hover {
          background-color: var(--tr-hover-bgc);
        }

        &.active {
          background-color: var(--tr-active-bgc);
        }

        td {
          &.fixed-cell {
            background-color: inherit; // 防止横向滚动后透明
          }

          &:first-child {
            background-image: var(--bg-border-right), var(--bg-border-bottom), var(--bg-border-left);
          }

          &.highlight-cell {
            animation: dim 2s linear;
          }

          &.text-overflow {
            .table-cell-wrapper {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          //   &.perch-td {
          //     padding: 0;
          //     height: 0;
          //     &.top {
          //       background-image: repeating-linear-gradient(
          //           180deg,
          //           transparent 0,
          //           transparent var(--row-height),
          //           var(--border-color) var(--row-height),
          //           var(--border-color) calc(var(--row-height) + 1px)
          //         ),
          //         var(--bg-border-right);
          //     }
          //     &.bottom {
          //       background-image: repeating-linear-gradient(
          //           0deg,
          //           transparent 0,
          //           transparent var(--row-height),
          //           var(--border-color) var(--row-height),
          //           var(--border-color) calc(var(--row-height) + 1px)
          //         ),
          //         var(--bg-border-right);
          //     }
          //   }
        }
      }

      // 斑马纹
      // tr:nth-child(2n) td {
      //   background-color: #fafafc;
      // }
      // tr:hover {
      //   background-color: #ebf3ff;
      // }
    }
  }

  .stk-table-no-data {
    background-color: var(--table-bgc);
    line-height: var(--row-height);
    text-align: center;
    font-size: 14px;
    position: sticky;
    left: 0px;
    border-left: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
    border-bottom: var(--border-width) solid var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.no-data-full {
      flex: 1;
    }
  }

  /**虚拟滚动模式 */
  &.virtual {
    .stk-table-main {
      thead {
        tr {
          th {
            // 为不影响布局，表头行高要定死
            .table-header-cell-wrapper {
              overflow: hidden;
              max-height: var(--row-height);
            }
          }
        }
      }

      tbody {
        position: relative;

        tr {
          td {
            height: var(--row-height);
            line-height: 1;

            .table-cell-wrapper {
              max-height: var(--row-height);
              overflow: hidden;
            }
          }
        }
      }
    }
  }

  &.virtual-x {
    .stk-table-main {
      .virtual-x-left {
        padding: 0;
      }

      thead tr:first-child .virtual-x-left + th {
        // 横向虚拟滚动时，左侧第一个单元格加上border-left
        background-image: var(--bg-border-top), var(--bg-border-right), var(--bg-border-bottom), var(--bg-border-left);
      }

      tr .virtual-x-left + th {
        background-image: var(--bg-border-right), var(--bg-border-bottom), var(--bg-border-left);
      }
    }
  }
}
</style>
