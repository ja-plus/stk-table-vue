<template>
  <div class="v-tree-select-wrapper" :class="{ disabled: disabled }">
    <!-- <input type="text" @click="onInputClick($event)" /> -->
    <div class="tree-select-main" :class="{ expand: showDropdown }" @click="onInputClick">
      <div class="tree-select-main-label" :class="{ placeholder: !selectedLabel }" :title="selectedLabel">
        {{ selectedLabel || placeholder }}
      </div>
      <div class="tree-select-main-arrow"></div>
    </div>
    <!-- 下拉框 -->
    <div v-if="vIfLoadComponent" v-show="!disabled && showDropdown" class="dropdown-menu" :style="dropdownMenuStyle">
      <VirtualTree
        ref="virtualTree"
        v-bind="vsTreeProps"
        height="100%"
        :replace-fields="assignedFields"
        :tree-data="treeDataClone"
        @item-click="onTreeItemClick"
      />
    </div>
    <!-- 遮罩：用于点击区域外关闭 -->
    <div
      v-if="!disabled && showDropdown"
      class="dropdown-mask"
      :style="{ zIndex: zIndex }"
      @click="showDropdown = false"
    ></div>
  </div>
</template>
<script>
/** 不支持v-model 只能通过 :value + change事件更新 */
import VirtualTree from './VirtualTree.vue';

const _defaultFields = {
  key: 'key',
  title: 'title',
  children: 'children',
};
export default {
  components: { VirtualTree },
  props: {
    value: {
      type: String,
      default: '',
    },
    /** 下拉框高度 */
    dropdownHeight: {
      type: Number,
      default: 240, // 8行
    },
    /** 下拉框宽度 */
    dropdownWidth: {
      type: Number,
      default: null,
    },
    /** 下拉菜单与下拉框间的距离 */
    dropdownSpace: {
      type: Number,
      default: 2,
    },
    /** 格式化选中展示的label */
    labelFormatter: {
      type: Function,
      default: null,
    },
    /** 下拉框的z-index */
    zIndex: {
      type: Number,
      default: 10,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    treeData: {
      type: Array,
      default: () => [],
    },
    /** 是否禁用 */
    disabled: Boolean,
    /** 替换数据title,key,children字段 */
    replaceFields: {
      type: Object,
      default: () => _defaultFields,
    },
    /** VirtualScrollTree 的prop*/
    vsTreeProps: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dropdownMenuStyle: {},
      showDropdown: false,
      /** 展开下拉框时才加载组件 */
      vIfLoadComponent: false,
      /** 保存的prop value */
      storedValue: null,
      /** 记录下次打开下拉框时，是否需要执行这些操作1.高亮2.展开父节点3.滚动至选中的位置 */
      resetVTree: false,
    };
  },
  computed: {
    treeDataClone() {
      return [...this.treeData];
    },
    /** 合并传入的fields */
    assignedFields() {
      return Object.assign({}, _defaultFields, this.replaceFields);
    },
    selectedLabel() {
      let label = '';
      const item = this.getItemByKey(this.storedValue);
      if (item) {
        if (this.labelFormatter) {
          label = this.labelFormatter(item);
        } else {
          label = item[this.assignedFields.title];
        }
      }
      return label || this.storedValue;
    },
  },
  watch: {
    value(v) {
      this.storedValue = v;
      // this.$refs.virtualTree?.setCurrent(v);
      // this.$refs.virtualTree?.expandItem([v] /* , { foldOthers: true } */);
    },
  },
  mounted() {
    this.storedValue = this.value;
  },
  methods: {
    onInputClick(e) {
      if (this.disabled) return;
      if (!this.vIfLoadComponent || this.resetVTree) {
        this.vIfLoadComponent = true;
        this.resetVTree = false;
        this.$nextTick(() => {
          this.$refs.virtualTree?.setCurrent(this.storedValue);
          this.$refs.virtualTree?.expandItem([this.storedValue] /* , { foldOthers: true } */);
          this.$refs.virtualTree?.scrollTo(this.storedValue); // 滚动至
        });
      }

      this.setDropdownMenuStyle(e);
      this.showDropdown = !this.showDropdown;
      this.$nextTick(() => {
        this.$refs.virtualTree.resize();
      });
    },
    onTreeItemClick(item) {
      this.showDropdown = false;
      this.$emit('change', item);
    },
    // -----------
    /**
     * 设置下拉框从上方弹出还是下方
     */
    setDropdownMenuStyle() {
      /** @type {DOMRect} */
      const rect = this.$el.getBoundingClientRect();
      const bottom = window.innerHeight - rect.top - rect.height;
      const dropdownWidth = this.dropdownWidth ? this.dropdownWidth : rect.width;
      // reset style
      this.dropdownMenuStyle = {
        position: 'absolute',
        width: dropdownWidth + 'px',
        height: this.dropdownHeight + 'px',
        zIndex: this.zIndex + 1,
      };

      if (window.innerWidth - rect.left >= dropdownWidth) {
        // 右边有空间
        this.dropdownMenuStyle.right = null;
      } else if (rect.right >= dropdownWidth) {
        // 左边有空间
        this.dropdownMenuStyle.right = 0;
      } else {
        this.dropdownMenuStyle.width = '96vw';
        this.dropdownMenuStyle.right = -1 * (window.innerWidth - rect.right) + 'px';
      }

      if (bottom >= this.dropdownHeight) {
        // 下方有充足空间
        this.dropdownMenuStyle.top = rect.height + this.dropdownSpace + 'px';
      } else if (rect.top >= this.dropdownHeight) {
        // 上方有充足空间
        this.dropdownMenuStyle.top = -1 * this.dropdownHeight - this.dropdownSpace + 'px';
      } else {
        this.dropdownMenuStyle.top = 0;
        this.dropdownMenuStyle.position = 'fixed';
        this.dropdownMenuStyle.height = window.innerHeight + 'px';
      }
    },
    /** 通过key值查找一项 */
    getItemByKey(key) {
      let result = null;
      (function recursion(dataSource) {
        for (let i = 0; i < dataSource.length; i++) {
          const item = dataSource[i];
          if (item[this.assignedFields.key] === key) {
            result = item;
            return 0;
          }
          if (item[this.assignedFields.children]) {
            const res = recursion.bind(this)(item[this.assignedFields.children] || []);
            if (res === 0) return 0;
          }
        }
      }.bind(this)(this.treeData));
      return result;
    },

    // --------------- ref Func
    /**
     * 设置当前选中的项（高亮）,会触发change事件
     */
    setValue(item) {
      let currentItem = item;
      if (typeof item !== 'object') {
        currentItem = this.getItemByKey(item);
      }
      if (currentItem) {
        this.storedValue = currentItem[this.assignedFields.key];
        this.resetVTree = true; // 下次打开下拉框时是否设置虚拟树
        this.onTreeItemClick(currentItem);
      }
    },
  },
};
</script>
<style lang="less" scoped>
:v-deep(.vtScroll-tree ul li .list-item:hover:not(.item-highlight)) {
  background-color: #f7f7fc;
}

.v-tree-select-wrapper.disabled {
  .tree-select-main {
    border: 1px solid #cbcbe1;
    background-color: rgb(246, 246, 246);
    cursor: not-allowed;
    .tree-select-main-label {
      color: #ccc;
    }
    .tree-select-main-arrow {
      border-top: 5px solid #ccc;
    }
  }
}
.v-tree-select-wrapper {
  position: relative;
  width: 200px;
  height: 25px;
  transition: border 0.3s;
  &.disabled {
    .tree-select-main {
      border: 1px solid #cccccc;
    }
  }
  &:hover:not(.disabled) {
    .tree-select-main {
      border: 1px solid #8f90b5;
    }
  }
  .tree-select-main {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    padding: 0 10px;
    transition: all 0.3s;
    &.expand {
      border: 1px solid #8f90b5;
      .tree-select-main-arrow {
        border-top: 5px solid #4a4b72;
        transform: rotate(180deg);
      }
    }
    .tree-select-main-label {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      &.placeholder {
        color: #7d7d94;
      }
    }
    .tree-select-main-arrow {
      margin-left: 10px;
      align-self: center;
      width: 0;
      height: 0;
      border-top: 5px solid #757699;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 0px;
      transition: transform 0.2s ease;
      &.expand {
        transform: rotate(180deg);
      }
    }
  }
  .dropdown-menu {
    overflow: hidden;
    border: 1px solid #ddd;
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    // min-width: max-content;
    // margin-top: 2px;
    border-radius: 4px;
    outline: none;
    box-shadow: 0 4px 12px rgba(10, 39, 86, 0.15);
    border: 1px solid #ececf7;
    // ::v-deep .vtScroll-tree {
    //   min-width: max-content;
    // }
  }
  /**遮罩 */
  .dropdown-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
  }
}
</style>
