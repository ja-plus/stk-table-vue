<template>
  <div ref="vScrollTree" class="vtScroll-tree" :style="{ height: height }" @click="$event.stopPropagation()">
    <ul
      v-if="displayList.length"
      :style="{
        height: lineHeight * pageSize + 'px',
        marginTop: offsetTop + 'px',
        marginBottom: offsetBottom > 0 ? offsetBottom + 'px' : 0,
      }"
    >
      <li v-for="item in displayList" :key="item[assignedFields.key]">
        <!-- 20: arrow width -->
        <div
          class="list-item"
          :class="{
            'item-parent': item._vt_isParent,
            'item-current': item[assignedFields.key] === currentItem[assignedFields.key],
            'item-highlight': highlightCurrent && item[assignedFields.key] === currentItem[assignedFields.key],
          }"
          :style="{
            height: lineHeight + 'px',
            paddingLeft: item._vt_isParent
              ? baseIndentWidth + indentWidth * item._vt_level + 'px'
              : baseIndentWidth + indentWidth * (item._vt_level - 1) + 20 + 'px',
          }"
          @click="handleItemClick(item, isClick)"
          @dblclick="onItemDblClick(item)"
          @contextmenu="e => onContextMenu(e, item)"
        >
          <!-- 展开箭头 -->
          <div v-if="item._vt_isParent" class="list-item-expand" @click.stop="changeList(item)">
            <!-- slot 箭头 -->
            <slot name="icon" :isExpand="item._vt_isExpand">
              <div class="list-item-arrow" :class="{ 'list-item-arrow-active': item._vt_isExpand }"></div>
            </slot>
          </div>
          <!-- 多选框 -->
          <div v-if="showCheckbox">
            <input :checked="selectedItems.includes(item)" type="checkbox" @click="onCheckboxClick" @change="onCheckboxChange($event, item)" />
          </div>
          <!-- 文字 -->
          <div class="list-item-title" :title="item[assignedFields.title]">
            <!-- 文字slot -->
            <slot name="text" :text="item[assignedFields.title]">
              <span>{{ item[assignedFields.title] }}</span>
            </slot>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="vtScroll-empty">{{ emptyText }}</div>
  </div>
</template>

<script>
const _defaultFields = {
  key: 'key',
  title: 'title',
  children: 'children',
};
export default {
  name: 'VirtualTree',
  props: {
    /** 树高度 默认auto */
    height: {
      type: String,
      default: 'auto',
    },
    /** 行高 */
    lineHeight: {
      type: Number,
      default: 30,
    },
    /** 基础缩进距离 */
    baseIndentWidth: {
      type: Number,
      default: 4,
    },
    /** 每个层级的缩进距离 */
    indentWidth: {
      type: Number,
      default: 20,
    },
    /** 展示checkbox,可多选 */
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    /**
     * @deprecated
     * 是否支持多选
     * 单选用this.currentItem 高亮行
     * 多选用selectedItems 开启多选框来支持
     */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**
     * 点击一项时，是否设置currentItem。
     * 设置false，一般用于this.setCurrent 手动指定当前选中项
     */
    setCurrentWhenClick: {
      type: Boolean,
      default: true,
    },
    /** 高亮选中行 */
    highlightCurrent: {
      type: Boolean,
      default: true,
    },
    /** 当前行是否可取消 */
    currentCancelable: {
      type: Boolean,
      default: false,
    },
    /** 父节点是否可点击为current（是否可选中） */
    parentSelectable: {
      type: Boolean,
      default: false,
    },
    /** 点击一项也可以展开，而非只能点击箭头*/
    clickItemExpand: {
      type: Boolean,
      default: false,
    },
    /** 无数据时显示的内容 */
    emptyText: {
      type: String,
      default: '暂无数据',
    },
    /** 数据,出于性能考虑，不进行深拷贝复制一份维护 */
    treeData: {
      type: Array,
      default: () => [],
    },
    /** 默认展开的键数组 (区分Number、String类型) */
    defaultExpandedKeys: {
      type: Array,
      default: () => [],
    },
    /** 默认高亮的当前行key */
    defaultCurrentKey: {
      type: String,
      default: '',
    },
    /**
     * 滚动条默认的位置的key
     * 如果有父节点，则父节点必须要展开，否则不会定位
     */
    defaultScrollKey: {
      type: String,
      default: '',
    },
    /** 默认选中的项数组 */
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
    /** 默认展开所有节点 */
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    /** 替换数据title,key,children字段 */
    replaceFields: {
      type: Object,
      default: () => _defaultFields,
    },
  },
  data() {
    return {
      /** window resize debounce */
      resizeTimeout: null,
      // rootEl: null, // 根元素
      /** 展平的一维数组 */
      treeDataFlat: [],
      /** 多选选中*/
      selectedItems: [],
      // var
      /** 点击后高亮的行 */
      currentItem: {},
      // v scroll
      startIndex: 0,
      endIndex: 30,
      offsetTop: 0,
      offsetBottom: 0,
      pageSize: 30,
    };
  },
  computed: {
    /** 合并传入的fields */
    assignedFields() {
      return Object.assign({}, _defaultFields, this.replaceFields);
    },
    /** 实际显示的列表*/
    displayList() {
      return this.treeDataFlat.slice(this.startIndex, this.endIndex);
    },
    /** 总高度 */
    allHeight() {
      return this.treeDataFlat.length * this.lineHeight;
    },
    /** 活动页面高度 */
    mainPageHeight() {
      return this.pageSize * this.lineHeight;
    },
  },
  watch: {
    treeData() {
      // 列表发生改变，重置已选，重置虚拟滚动
      this.init();
      this.setDefaultCurrent(); // 设置默认高亮行
      this.scrollTo(); // 滚动条默认的位置
      this.setDefaultSelected(); // 设置默认选中
    },
  },
  mounted() {
    this.init();
    this.setDefaultCurrent(); // 设置默认高亮行
    this.scrollTo(); // 滚动条默认的位置
    this.setDefaultSelected(); // 设置默认选中
    // event listener
    this.initEvent();
  },
  methods: {
    /**
     * @param {"init"|"resize"} [type="init"]
     */
    init(type = 'init') {
      let containerHeight = this.$el?.clientHeight;
      if (!containerHeight) {
        containerHeight = 1080;
        console.warn("Can't get virtualTree clientHeight");
      }
      if (type === 'init') {
        this.initTreeDataPrivateProp();
      }
      // console.log('Tree containerHeight:', containerHeight);
      this.setTreeDataFlat(type); // 默认展开树，获得总高度 allHeight
      this.pageSize = Math.ceil(containerHeight / this.lineHeight) + 1;
      this.setIndex();

      this.selectedItems = [];
    },
    initEvent() {
      this.$el.addEventListener('scroll', this.setIndex);
      window.addEventListener('resize', () => {
        this.resize();
      });
    },
    /** 向treeData中添加私有属性 */
    initTreeDataPrivateProp() {
      // level 树层级
      (function func(arr, level = 0, parent) {
        arr.forEach(item => {
          item._vt_isParent = Boolean(item[this.assignedFields.children]);
          item._vt_level = level;
          item._vt_parent = parent; // 持有父节点引用
          item._vt_isExpand = false; // 是否展开
          if (item._vt_isParent) {
            func.bind(this)(item[this.assignedFields.children] || [], level + 1, item);
          }
        });
      }.bind(this)(this.treeData, 0, null));
    },

    /** 设置默认高亮当前行 （仅单选）*/
    setDefaultCurrent() {
      this.traverseTreeData(item => {
        if (!this.defaultCurrentKey) return;
        const defaultKey = this.defaultCurrentKey;
        if (item[this.assignedFields.key] === defaultKey) {
          this.currentItem = item;
          return 0;
        }
      });
    },
    /** 设置选中的项 （可多选）*/
    setDefaultSelected() {
      if (!this.defaultSelectedKeys?.length) return;
      this.traverseTreeData(item => {
        if (this.defaultSelectedKeys.includes(item[this.assignedFields.key])) {
          this.selectedItems.push(item);
          if (this.selectedItems.length === this.defaultSelectedKeys.length) return 0;
        }
      });
    },
    /**
     * 设置当前展开数组
     * @param {String} type 'init'
     */
    setTreeDataFlat(type) {
      const treeDataFlat = [];
      // level 树层级
      (function func(arr) {
        arr.forEach(item => {
          treeDataFlat.push(item);
          if (type === 'init') {
            item._vt_isExpand = this.defaultExpandAll ? true : this.defaultExpandedKeys.includes(item[this.assignedFields.key]);
          }
          if (item._vt_isExpand) {
            func.bind(this)(item[this.assignedFields.children] || []);
          }
        });
      }.bind(this)(this.treeData));

      this.treeDataFlat = treeDataFlat;
    },
    /** 展开收起事件回调 */
    changeList(item) {
      this.offsetBottom = 0;
      this.offsetTop = 0;
      // this.$set(item, '_vt_isExpand', !item._vt_isExpand);
      item._vt_isExpand = !item._vt_isExpand;
      // 若当前节点选中,则展开时清空子节点选中
      this.setTreeDataFlat();
      this.offsetTop = this.startIndex * this.lineHeight;
      this.offsetBottom = this.allHeight - (this.displayList.length + this.startIndex) * this.lineHeight;
    },
    /**
     * 根据滚动条位置，设置展示的区间
     * 不传参数则默认获取$el的scrollTop
     * @param {MouseEvent} e default this.$el.scrollTop
     */
    setIndex(e) {
      const top = e ? e.target.scrollTop : this.$el?.scrollTop;
      this.startIndex = Math.floor(top / this.lineHeight);
      const offset = top % this.lineHeight; // 半行偏移量
      this.offsetTop = top - offset;
      this.endIndex = this.startIndex + this.pageSize;

      this.offsetBottom = this.allHeight - this.mainPageHeight - this.offsetTop;
    },
    /** 
     * 点击一项
     * @param {object} item
     * @param {boolean} isClick 是否点击列表触发
     */
    handleItemClick(item, isClick = false) {
      if (this.clickItemExpand && item[this.assignedFields.children]) {
        this.changeList(item); // 展开
      }
      if (!this.parentSelectable) {
        // 父节点不可选中
        if (item[this.assignedFields.children]) return;
      }
      if (this.setCurrentWhenClick) {
        if (this.currentCancelable) {
          this.currentItem = this.currentItem === item ? {} : item;
        } else {
          this.currentItem = item;
        }
      }
      this.$emit('item-click', item, isClick);
      // this.setSelectedItem(item);
    },
    /** 设置选中项 */
    setSelectedItem(item, checked) {
      if (checked) {
        this.selectedItems.push(item);
      } else {
        const i = this.selectedItems.indexOf(item);
        if (i > -1) {
          this.selectedItems.splice(i, 1); // FIXME: 数据量大有性能问题？
        }
      }
      this.$emit('item-select', {
        checked,
        item,
        selectedItems: this.selectedItems,
      });
    },
    /** 双击一项 */
    onItemDblClick(item) {
      // if (item[this.assignedFields.children]) {
      //   // 展开父节点
      //   this.changeList(item);
      // } else {
      //   // 选中节点
      //   // this.setSelectedItem(item);
      //   // item.isCurrent = true; // this.$set(item, 'isCurrent', true);
      // }
      // if (!this.parentSelectable) {
      //   if (item[this.assignedFields.children]) return;
      // }
      this.$emit('item-dblclick', item);
    },
    onContextMenu(e, item) {
      this.$emit('right-click', { event: e, item });
    },
    onCheckboxChange(e, item) {
      this.setSelectedItem(item, e.target.checked);
    },
    onCheckboxClick(e) {
      e.stopPropagation();
      // TODO: if parent checked ,check children
    },

    // ---------- utils
    /**
     * 遍历treeData方法
     * @return 0 跳出循环
     */
    traverseTreeData(callback) {
      (function recursion(arr) {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          const cbRes = callback(item, i);
          if (cbRes === 0) return 0;
          if (item[this.assignedFields.children]) {
            const res = recursion.bind(this)(item[this.assignedFields.children]);
            if (res === 0) return 0;
          }
        }
      }.bind(this)(this.treeData));
    },

    // ------ ref Func------
    /** 清除当前选中的高亮 */
    clearCurrent() {
      this.currentItem = {};
    },
    /**
     * 重新初始化并计算大小
     * @param {number} options.debounce
     */
    resize(options = {}) {
      // debounce
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.init('resize');
        this.resizeTimeout = null;
      }, options.debounce || 200);
    },
    /**
     * 设置当前选中行
     * @param {string | object} key 选中行的唯一键,或者传入一个对象
     * @return {object} currentItem 当前选中的项
     */
    setCurrent(key) {
      if (typeof key !== 'object') {
        this.traverseTreeData(item => {
          if (item[this.assignedFields.key] === key) {
            this.currentItem = item;
            return 0;
          }
        });
      } else {
        this.currentItem = key;
      }
      return this.currentItem;
    },
    /**
     * 展开行
     * @param {string[]} keys
     * @param {boolean} options.expandParent 是否展开其父节点
     * @param {boolean} options.foldOthers 是否折叠其他父节点
     */
    expandItem(keys, options = {}) {
      options = Object.assign({ expandParent: true, foldOthers: false }, options);

      if (!keys?.length) {
        if (Object.keys(this.currentItem).length) {
          keys = [this.currentItem];
        } else {
          throw new Error('vScrollTree.expandItem Error: keys is empty');
        }
      }
      // 需要展开的项的数量
      let itemsLen = 0;
      this.traverseTreeData(item => {
        if (options.foldOthers) {
          item._vt_isExpand = false;
        }
        if (keys.includes(item[this.assignedFields.key])) {
          // 找到该项，设置为展开
          item._vt_isExpand = true;
          if (options.expandParent) {
            // 展开其所有父节点
            while (item._vt_parent) {
              item = item._vt_parent;
              item._vt_isExpand = true;
            }
          }
          if (!options.foldOthers) {
            itemsLen++;
            if (itemsLen >= keys.length) {
              // 已经找到所有，终止遍历
              return 0;
            }
          }
        }
      });

      // 更新展开数组
      this.setTreeDataFlat();
    },
    /**
     * 滚动到某一项,此项必须已经展开可见
     * 默认滚动到defaultScrollKey
     * @param {string} key
     */
    scrollTo(key = this.defaultScrollKey) {
      this.$nextTick(() => {
        this.$el.scrollTop = this.treeDataFlat.findIndex(it => it[this.assignedFields.key] === key) * this.lineHeight;
      });
    },
  },
};
</script>

<style scoped lang="less">
.vtScroll-tree {
  box-sizing: border-box;
  background-color: #fff;
  user-select: none;
  width: 100%;
  height: 100%;
  // min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  overflow: overlay;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 75, 114, 0.4);
    border-radius: 5px;
    &:hover {
      background: rgba(74, 75, 114, 0.6);
    }
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  ul {
    height: 100%;
    padding: 0;
    margin: 0;
    flex: 1;
    // width: max-content;
    width: 100%;
    min-width: max-content;

    li {
      width: 100%;
      min-width: max-content;
      list-style-type: none;
      .list-item {
        box-sizing: border-box; //确保padding-right在min-width: 100%;里
        color: #000;
        min-width: 100%;
        width: max-content;
        display: flex;
        padding-right: 10px;
        cursor: pointer;
        align-items: center;
        &.item-current {
        }
        &.item-highlight {
          color: #fff;
          background-color: #1b63d9;
          .list-item-expand .list-item-arrow {
            border-left: 5px solid #fff;
          }
        }
        &:hover:not(.item-highlight) {
          background-color: #eee;
        }

        // 父节点
        &.item-parent {
          font-weight: bold;
        }
        .list-item-expand {
          height: 16px;
          width: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            opacity: 0.6;
          }
          /*箭头 */
          .list-item-arrow {
            transform-origin: 2px center;
            border-left: 5px solid #757699; // color 继承自祖先元素
            border-top: 4.5px solid transparent;
            border-bottom: 4.5px solid transparent;
            border-right: 0px;
            transition: transform 0.2s ease;
            &.list-item-arrow-active {
              transform: rotate(90deg);
            }
          }
        }
        .list-item-title {
          margin-left: 5px;
          white-space: nowrap;
        }
      }
    }
  }
  .vtScroll-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
