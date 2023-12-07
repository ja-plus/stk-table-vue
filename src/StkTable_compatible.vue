<template>
  <div class="stk-table-wrapper dark" @scroll="onTableScroll">
    <table
      v-for="tp in ['main', 'fl']"
      :key="tp"
      :ref="tp === 'fl' && 'fixedLeftTable'"
      class="stk-table"
      :class="{ 'fixed-left': tp === 'fl' }"
      :style="tp === 'main' && { minWidth: minWidth }"
    >
      <thead>
        <tr v-for="(row, index) in tableHeaders" :key="index">
          <template v-for="(col, i) in row">
            <th
              v-if="tp === 'main' || (tp === 'fl' && col.fixed === 'left')"
              :key="i"
              :rowspan="col.rowSpan"
              :colspan="col.colSpan"
              :style="{
                textAlign: col.headerAlign,
                width: col.width || 'auto',
                minWidth: col.fixed ? col.width : col.minWidth,
                maxWidth: col.fixed ? col.width : col.maxWidth,
                zIndex: 1,
              }"
              :class="{ sortable: col.sorter }"
              @click="onColumnSort(col)"
            >
              <div class="table-header-cell-wrapper">
                <component :is="col.customHeaderCell(col)" v-if="col.customHeaderCell" />
                <template v-else>
                  <slot name="table-header" :column="col">
                    <span class="table-header-title">{{ col.title }}</span>
                  </slot>
                </template>

                <!-- 排序图图标 -->
                <span
                  v-if="col.sorter"
                  class="table-header-sorter"
                  :class="col.dataIndex === sortCol && 'sorter-' + sortSwitchOrder[sortOrderIndex]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16">
                    <g id="sort-btn" fill-rule="nonzero">
                      <rect id="rect" opacity="0" x="0" y="0" width="16" height="16"></rect>
                      <polygon
                        id="arrow-up"
                        fill="#757699"
                        points="7.99693049 2.00077299 4.79705419 6.00077299 11.1722317 6.00077299"
                      ></polygon>
                      <polygon
                        id="arrow-down"
                        fill="#757699"
                        transform="translate(7.984643, 11.999227) scale(-1, 1) rotate(-180.000000) translate(-7.984643, -11.999227) "
                        points="7.99693049 9.999227 4.79705419 13.999227 11.1722317 13.999227"
                      ></polygon>
                    </g>
                  </svg>
                </span>
              </div>
            </th>
          </template>
        </tr>
      </thead>

      <tbody>
        <template v-if="dataSourceCopy && dataSourceCopy.length">
          <tr
            v-for="(item, i) in dataSourceCopy"
            :key="rowKey ? item[rowKey] : i"
            :data-row-key="rowKey ? item[rowKey] : i"
            :class="{
              active: rowKey ? item[rowKey] === (currentItem && currentItem[rowKey]) : item === currentItem,
              'row-hover': currentHoverItem === item,
            }"
            @click="onRowClick(item)"
            @dblclick="onRowDblclick(item)"
            @mouseover="currentHoverItem = item"
            @mouseleave="currentHoverItem = null"
          >
            <template v-for="col in tableProps">
              <td
                v-if="tp === 'main' || (tp === 'fl' && col.fixed === 'left')"
                :key="col.dataIndex"
                :data-index="col.dataIndex"
                :style="{
                  textAlign: col.align,
                  maxWidth: col.fixed ? col.width : col.maxWidth,
                  textOverflow: col.textOverflow && 'ellipsis',
                  overflow: col.textOverflow && 'hidden',
                }"
                :title="col.textOverflow === 'title' ? item[col.dataIndex] : undefined"
              >
                <template v-if="(tp === 'main' && !col.fixed) || tp === 'fl'">
                  <component :is="col.customCell(col, item)" v-if="col.customCell" />
                  <span v-else> {{ item[col.dataIndex] ?? emptyCellText }} </span>
                </template>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <div
      v-if="!dataSourceCopy || !dataSourceCopy.length"
      class="stk-table-no-data"
      :class="{ 'no-data-full': noDataFull }"
    >
      <slot name="no-data">暂无数据</slot>
    </div>
  </div>
</template>

<script>
/**
 * 此版本用于兼容低版本，左侧固定列问题。
 * 存在的问题：column.dataIndex 作为唯一键，不能重复
 *          改变fixedTable左侧距离方案，可能导致抖动。考虑使用fixed
 * 可优化：没有固定列，可不渲染固定表格
 *
 */
function _howDeepTheColumn(arr, level = 1) {
  let levels = [level];
  arr.forEach(item => {
    if (item.children?.length) {
      levels.push(_howDeepTheColumn(item.children, level + 1));
    }
  });
  return Math.max(...levels);
}

export default {
  props: {
    minWidth: {
      type: String,
      default: '100%',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: '',
    },
    emptyCellText: {
      type: String,
      default: '--',
    },
    /** 暂无数据兜底高度是否撑满 */
    noDataFull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /** 是否展示横向滚动固定列的阴影 */
      showFixedLeftShadow: false,

      /** 当前选中的一行*/
      currentItem: {},
      /** 当前hover的行 */
      currentHoverItem: null,
      /** 排序的列*/
      sortCol: null,
      sortOrderIndex: 0,
      /** 排序切换顺序 */
      sortSwitchOrder: [null, 'desc', 'asc'],
      tableHeaders: [],
      /** 若有多级表头时，的tableHeaders */
      tableProps: [],
      dataSourceCopy: [],
      /** 高亮后渐暗的单元格 */
      // highlightDimCells: {},
      /** 高亮后渐暗的行定时器 */
      highlightDimRowsTimeout: new Map(),
    };
  },
  computed: {},
  watch: {
    columns: {
      handler(val) {
        this.dealColumns(val);
      },
      deep: true,
    },
    /** 监听表格数据变化 */
    dataSource(val) {
      // this.dealColumns(val);
      this.dataSourceCopy = [...val];
      if (this.sortCol) {
        // 排序
        const column = this.columns.find(it => it.dataIndex === this.sortCol);
        this.onColumnSort(column, false);
      }
    },
  },
  created() {
    this.dealColumns();
    this.dataSourceCopy = [...this.dataSource];
  },
  mounted() {},
  methods: {
    dealColumns() {
      // reset
      this.tableHeaders = [];
      this.tableProps = [];
      let copyColumn = this.columns;
      let deep = _howDeepTheColumn(copyColumn);
      const tmpHeader = [];
      const tmpProps = [];
      // 展开columns
      (function flat(arr, level = 0) {
        let colArr = [];
        let childrenArr = [];
        arr.forEach(col => {
          col.rowSpan = col.children ? false : deep - level;
          col.colSpan = col.children?.length;
          colArr.push(col);
          if (col.children) {
            childrenArr.push(...col.children);
          } else {
            tmpProps.push(col); // 没有children的组合作为colgroup
          }
        });
        tmpHeader.push(colArr);
        if (childrenArr.length) flat(childrenArr, level + 1);
      })(copyColumn);
      this.tableHeaders = tmpHeader;
      this.tableProps = tmpProps;
    },
    /** 表头点击排序 */
    onColumnSort(col, click = true) {
      if (!col.sorter) return;
      if (this.sortCol !== col.dataIndex) {
        // 改变排序的列时，重置排序
        this.sortCol = col.dataIndex;
        this.sortOrderIndex = 0;
      }
      if (click) {
        this.sortOrderIndex++;
      }
      if (this.sortOrderIndex > 2) this.sortOrderIndex = 0;
      const order = this.sortSwitchOrder[this.sortOrderIndex];
      if (typeof col.sorter === 'function') {
        const customSorterData = col.sorter([...this.dataSource], { order, column: col });
        if (customSorterData) this.dataSourceCopy = customSorterData;
        else this.dataSourceCopy = [...this.dataSource]; // 还原数组
      } else if (order) {
        if (col.sortType === 'number') {
          // 按数字类型排序
          const nanArr = []; // 非数字
          const numArr = []; // 数字
          // 非数字不进入排序，一直排在最后
          for (let i = 0; i < this.dataSourceCopy.length; i++) {
            const row = this.dataSourceCopy[i];
            if (
              row[col.dataIndex] === null ||
              row[col.dataIndex] === '' ||
              typeof row[col.dataIndex] === 'boolean' ||
              Number.isNaN(+row[col.dataIndex])
            ) {
              nanArr.push(row);
            } else {
              numArr.push(row);
            }
          }
          if (order === 'asc') {
            numArr.sort((a, b) => +a[col.dataIndex] - +b[col.dataIndex]);
          } else {
            numArr.sort((a, b) => +b[col.dataIndex] - +a[col.dataIndex]);
          }
          this.dataSourceCopy = [...numArr, ...nanArr];
        } else {
          // 按string 排序
          if (order === 'asc') {
            this.dataSourceCopy.sort((a, b) => (a[col.dataIndex] < b[col.dataIndex] ? -1 : 1));
          } else {
            this.dataSourceCopy.sort((a, b) => (a[col.dataIndex] > b[col.dataIndex] ? -1 : 1));
          }
        }
      } else {
        this.dataSourceCopy = [...this.dataSource];
      }
    },
    onRowClick(row) {
      this.currentItem = row;
      this.$emit('current-change', row);
    },
    onRowDblclick(row) {
      this.$emit('row-dblclick', row);
    },
    onTableScroll(e) {
      this.$refs.fixedLeftTable[0].style.left = e.target.scrollLeft + 'px';
    },
    // ---- ref function-----
    /**
     * 选中一行，
     * @param {string} rowKey
     * @param {boolean} option.silent 是否触发回调
     */
    setCurrentRow(rowKey, option = { silent: false }) {
      if (!this.dataSourceCopy.length) return;
      this.currentItem = this.dataSourceCopy.find(it => it[this.rowKey] === rowKey);
      if (!option.silent) {
        this.$emit('current-change', this.currentItem);
      }
    },
    /** 高亮一个单元格 */
    setHighlightDimCell(rowKeyValue, dataIndex) {
      const cellEls = this.$el.querySelectorAll(`[data-row-key="${rowKeyValue}"]>[data-index="${dataIndex}"]`);
      if (!cellEls?.length) return;
      cellEls.forEach(cellEl => {
        cellEl.classList.remove('highlight-cell');
        void cellEl.offsetHeight;
        cellEl.classList.add('highlight-cell');
      });
    },
    /** 高亮一行 */
    setHighlightDimRow(rowKeyValue) {
      // 固定列的表格也要高亮
      const rowEls = this.$el.querySelectorAll(`[data-row-key="${rowKeyValue}"]`);
      if (!rowEls?.length) return;
      rowEls.forEach(rowEl => {
        rowEl.classList.remove('highlight-row');
        void rowEl.offsetWidth;
        rowEl.classList.add('highlight-row');
        // 动画结束移除class
        window.clearTimeout(this.highlightDimRowsTimeout.get(rowKeyValue));
        this.highlightDimRowsTimeout.set(
          rowKeyValue,
          window.setTimeout(() => {
            rowEl.classList.remove('highlight-row');
            this.highlightDimRowsTimeout.delete(rowKeyValue); // 回收内存
          }, 2000),
        );
      });
    },
    /**
     * 设置排序
     * @param {string} dataIndex
     * @param {'asc'|'desc'|null} order
     */
    setSorter(dataIndex, order) {
      this.sortCol = dataIndex;
      this.sortOrderIndex = this.sortSwitchOrder.findIndex(it => it == order);
      if (this.dataSourceCopy?.length) {
        // 如果表格有数据，则进行排序
        const column = this.columns.find(it => it.dataIndex === this.sortCol);
        this.onColumnSort(column, false);
      }
    },
    /** 重置排序 */
    resetSorter() {
      this.sortCol = null;
      this.sortOrderIndex = 0;
      this.dataSourceCopy = [...this.dataSource];
    },
  },
};
</script>

<style lang="less" scoped>
.stk-table-wrapper {
  --row-height: 30px;
  --border-color: #e8eaec;
  // --border: 1px #ececf7 solid;
  --td-bg-color: #fff;
  --th-bg-color: #f8f8f9;
  --td-padding: 8px;
  --tr-active-bg-color: rgb(230, 247, 255);
  --bg-border-top: linear-gradient(180deg, var(--border-color) 1px, transparent 1px);
  --bg-border-right: linear-gradient(270deg, var(--border-color) 1px, transparent 1px);
  --bg-border-bottom: linear-gradient(0deg, var(--border-color) 1px, transparent 1px);
  --bg-border-left: linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  --highlight-color: rgba(113, 162, 253, 1);
  // --highlight-color-to: rgba(113, 162, 253, 0);
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .stk-table {
    border-spacing: 0;
    table-layout: fixed;
    th,
    td {
      height: var(--row-height);
      font-size: 14px;
      box-sizing: border-box;
      padding: 2px 5px;
      padding: 0 var(--td-padding);
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
          background-color: var(--th-bg-color);
          &.sortable {
            cursor: pointer;
          }
          &:first-child {
            // border-left: 1px solid var(--border-color);
            background-image: var(--bg-border-top), var(--bg-border-right), var(--bg-border-bottom),
              var(--bg-border-left);
            padding-left: 12px;
          }
          &:last-child {
            padding-right: 12px;
          }
          .table-header-cell-wrapper {
            display: inline-flex;
            align-items: center;
            .table-header-title {
            }
            .table-header-sorter {
              margin-left: 4px;
              width: 16px;
              height: 16px;
              &:not(.sorter-desc):not(.sorter-asc):hover {
                #arrow-up {
                  fill: #8f90b5;
                }
                #arrow-down {
                  fill: #8f90b5;
                }
              }
              &.sorter-desc {
                #arrow-up {
                  fill: #cbcbe1;
                }
                #arrow-down {
                  fill: #1b63d9;
                }
              }
              &.sorter-asc {
                #arrow-up {
                  fill: #1b63d9;
                }
                #arrow-down {
                  fill: #cbcbe1;
                }
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
        &.highlight-row td:not(.highlight-cell) {
          animation: dim 2s linear;
        }
        &.active {
          td {
            background-color: var(--tr-active-bg-color);
          }
        }
        td {
          background-color: var(--td-bg-color);
          &:first-child {
            // border-left: 1px solid var(--border-color);
            background-image: var(--bg-border-right), var(--bg-border-bottom), var(--bg-border-left);
            padding-left: 12px;
          }
          &:last-child {
            padding-right: 12px;
          }

          &.highlight-cell {
            animation: dim 2s linear;
          }
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
  .stk-table.fixed-left {
    position: absolute;
    left: 0;
    top: 0;
    thead tr th:last-child {
      padding-right: var(--td-padding);
    }
    tbody tr td:last-child {
      padding-right: var(--td-padding);
    }
  }
  .stk-table-no-data {
    line-height: var(--row-height);
    text-align: center;
    font-size: 14px;
    position: sticky;
    width: 100%;
    left: 0px;
    background: var(--bg-border-left), var(--bg-border-bottom), var(--bg-border-right);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.no-data-full {
      flex: 1;
    }
  }

  /**深色模式 */
  &.dark {
    // --th-bg-color: #26272c;
    --th-bg-color: #181c21;
    --td-bg-color: #181c21;
    --border-color: #2e2e33;
    --tr-active-bg-color: #1a2b46;
    --highlight-color: rgba(19, 55, 125, 1);
    // --highlight-color-to: rgba(19, 55, 125, 0);
    background-color: var(--th-bg-color);
    color: #d0d1d2;
    .stk-table {
      thead {
        tr {
          th {
            .table-header-cell-wrapper {
              .table-header-sorter {
                #arrow-up,
                #arrow-down {
                  fill: #5d5f69;
                }
                &:not(.sorter-desc):not(.sorter-asc):hover {
                  #arrow-up {
                    fill: #727782;
                  }
                  #arrow-down {
                    fill: #727782;
                  }
                }
                &.sorter-desc {
                  #arrow-up {
                    fill: #5d5f69;
                  }
                  #arrow-down {
                    fill: #4f8df4;
                  }
                }
                &.sorter-asc {
                  #arrow-up {
                    fill: #4f8df4;
                  }
                  #arrow-down {
                    fill: #5d5f69;
                  }
                }
              }
            }
          }
        }
      }
    }
    tbody {
      tr.row-hover td {
        box-shadow: 0px -1px 0 #1b63d9 inset;
      }
    }
  }
}
</style>
