<template>
  <div ref="stkTableC" class="stk-table-compatible" @mouseleave="clearHover">
    <StkTable
      v-if="fixedLeftColumns.length"
      ref="stkTableFixedLeft"
      class="stk-table-fixed-left"
      v-bind="$attrs"
      show-tr-hover-class
      :show-no-data="false"
      :data-source="dataSourceCopy"
      :columns="fixedLeftColumns"
      :style="{ height: dataSourceCopy.length ? fixedTableHeight + 'px' : 'auto' }"
      @sort-change="(col, order) => handleSorterChange(col, order, 'l')"
      @scroll="handleFixedLeftTableScroll"
      @th-drag-start="i => onThDragStart('l', i)"
      @th-drop="i => onThDrop('l', i)"
    ></StkTable>
    <StkTable
      ref="stkTableMain"
      v-bind="$attrs"
      show-tr-hover-class
      :data-source="dataSourceCopy"
      :columns="mainTableColumns"
      @sort-change="(col, order) => handleSorterChange(col, order, 'm')"
      @scroll="handleMainTableScroll"
      @th-drag-start="i => onThDragStart('m', i)"
      @th-drop="i => onThDrop('m', i)"
    ></StkTable>
  </div>
</template>
<script>
import { h } from 'vue';
import StkTable from '../StkTable.vue';
import store from './store';
export default {
  name: 'StkTableC',
  components: { StkTable },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['col-order-change', 'th-drag-start', 'th-drop', 'sort-change', 'current-change'],
  data() {
    return {
      sharedState: store.state,
      fixedTableHeight: 0,
      dataSourceCopy: [],
      dragStartIndex: null,
    };
  },
  computed: {
    mainTableColumns() {
      return this.columns.map(col => {
        return {
          ...col,
          ...(col.fixed
            ? {
                minWidth: col.width,
                maxWidth: col.width,
                fixed: null,
                customCell: h('span', ''),
              }
            : {}),
        };
      });
    },
    /** 过滤得到所有固定列 */
    fixedLeftColumns() {
      return this.columns
        .filter(it => it.fixed === 'left')
        .map(col => {
          return { ...col, ...{ fixed: null, minWidth: col.width, maxWidth: col.width } };
        });
    },
  },
  watch: {
    dataSource(val) {
      if (val) this.dataSourceCopy = val;
      if (this.fixedLeftColumns?.length) {
        // 重新计算虚拟滚动高度，因为为了展示暂无数据兜底，左侧固定列的高度开始为0
        this.$nextTick(() => {
          this.$refs.stkTableFixedLeft.initVirtualScroll();
        });
      }
    },
  },
  mounted() {
    this.initStkTableData();
    this.fixedTableHeight = this.$refs.stkTableMain.$el.clientHeight - 1; // -1px border
    this.$refs.stkTableFixedLeft?.initVirtualScroll(this.fixedTableHeight);
  },
  methods: {
    /** 初始化表格共享data */
    initStkTableData() {
      if (this.fixedLeftColumns.length) {
        this.$refs.stkTableFixedLeft.currentHover = store.state.currentHover;
        this.$refs.stkTableFixedLeft.currentItem = store.state.currentItem;
      }
      this.$refs.stkTableMain.currentHover = store.state.currentHover;
      this.$refs.stkTableMain.currentItem = store.state.currentItem;
    },
    /**
     * @param {Event} e
     */
    handleMainTableScroll(e) {
      // console.log(e.target.scrollTop);
      if (this.fixedLeftColumns.length) {
        this.$refs.stkTableFixedLeft.$el.scrollTop = e.target.scrollTop;
      }
    },
    /**
     * @param {Event} e
     */
    handleFixedLeftTableScroll(e) {
      this.$refs.stkTableMain.$el.scrollTop = e.target.scrollTop;
    },
    handleSorterChange(col, order, type) {
      if (type === 'l') {
        this.$refs.stkTableMain.resetSorter();
        this.dataSourceCopy = this.$refs.stkTableFixedLeft?.dataSourceCopy;
      } else if (type === 'm') {
        this.$refs.stkTableFixedLeft?.resetSorter();
        this.dataSourceCopy = this.$refs.stkTableMain.dataSourceCopy;
      }
      this.$emit('sort-change', col, order);
    },
    setHighlightDimRow(key) {
      this.$refs.stkTableFixedLeft?.setHighlightDimRow(key);
      this.$refs.stkTableMain.setHighlightDimRow(key);
    },
    // onColOrderChange(type, sourceIndex, targetIndex) {
    //   console.log(type, sourceIndex, targetIndex, 'sdfsdf');
    // },
    onThDragStart(type, startIndex) {
      this.dragStartIndex = startIndex;
      this.$emit('th-drag-start', startIndex);
    },
    onThDrop(type, endIndex) {
      if (this.dragStartIndex !== endIndex) {
        this.$emit('col-order-change', this.dragStartIndex, endIndex);
      }
      this.$emit('th-drop', endIndex);
    },
    clearHover() {
      this.sharedState.currentHover.value = null;
      // store.state.currentHover.value = null; // 不生效
    },
    // ref
    initVirtualScroll() {
      this.$nextTick(() => {
        this.$refs.stkTableFixedLeft?.initVirtualScroll();
        this.$refs.stkTableMain?.initVirtualScroll();
      });
    },
    scrollTo(top = 0) {
      this.$refs.stkTableFixedLeft?.scrollTo(top);
      this.$refs.stkTableMain.scrollTo(top);
    },
    setCurrentRow(rowKey, option = { silent: false }) {
      if (!this.dataSourceCopy.length) return;
      store.state.currentItem.value = this.dataSourceCopy.find(it => this.$refs.stkTableMain.rowKeyGen(it) === rowKey);
      if (!option.silent) {
        this.$emit('current-change', store.state.currentItem);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.stk-table-compatible {
  position: relative;
  .stk-table-fixed-left {
    z-index: 3;
    position: absolute;
    left: 0;
    top: 0;
    &::-webkit-scrollbar {
      // 隐藏表格滚动条，使其鼠标悬浮在上方时可触发scroll事件 (仅chrome支持)
      width: 0;
      height: 0;
    }
  }
  .stk-table-wrapper {
    height: 100%;
  }
}
</style>
