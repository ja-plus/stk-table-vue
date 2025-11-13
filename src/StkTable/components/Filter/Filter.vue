<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { FilterProps, FilterOption } from './types';

const props = defineProps<FilterProps>();

// 筛选面板的位置样式
const panelStyle = ref({});

// 计算当前是否全选
const isAllSelected = computed(() => {
  if (!props.filterStatus.value.options || !props.filterStatus.value.value) {
    return false;
  }
  const totalOptions = props.filterStatus.value.options.length;
  const selectedCount = props.filterStatus.value.value.length;
  return totalOptions > 0 && selectedCount === totalOptions;
});

// 计算当前是否部分选中
const isPartialSelected = computed(() => {
  if (!props.filterStatus.value.options || !props.filterStatus.value.value) {
    return false;
  }
  const selectedCount = props.filterStatus.value.value.length;
  const totalOptions = props.filterStatus.value.options.length;
  return selectedCount > 0 && selectedCount < totalOptions;
});

// 处理筛选图标点击事件
const handleIconClick = (event: MouseEvent) => {
  event.stopPropagation(); // 防止事件冒泡
  
  // 切换筛选面板显示状态
  props.filterStatus.value.isOpen = !props.filterStatus.value.isOpen;
  
  if (props.filterStatus.value.isOpen) {
    // 计算并设置筛选面板位置
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    panelStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + window.scrollY + 5}px`,
      left: `${rect.left + window.scrollX}px`,
      zIndex: '1000'
    };
  }
};

// 处理选项点击
const handleOptionClick = (option: FilterOption) => {
  const currentValues = [...props.filterStatus.value.value];
  const valueIndex = currentValues.indexOf(option.value);
  
  if (valueIndex > -1) {
    // 取消选中
    currentValues.splice(valueIndex, 1);
  } else {
    // 选中
    currentValues.push(option.value);
  }
  
  // 更新筛选值
  props.filterStatus.value.value = currentValues;
  // 触发筛选变更
  props.onChange(props.filterStatus);
};

// 处理全选/取消全选
const handleSelectAll = () => {
  if (isAllSelected.value) {
    // 取消全选
    props.filterStatus.value.value = [];
  } else {
    // 全选
    props.filterStatus.value.value = props.filterStatus.value.options?.map(opt => opt.value) || [];
  }
  // 触发筛选变更
  props.onChange(props.filterStatus);
};

// 处理反选
const handleInvertSelection = () => {
  if (!props.filterStatus.value.options) return;
  
  const allValues = props.filterStatus.value.options.map(opt => opt.value);
  const currentValues = new Set(props.filterStatus.value.value);
  
  // 反选逻辑
  const invertedValues = allValues.filter(value => !currentValues.has(value));
  
  // 更新筛选值
  props.filterStatus.value.value = invertedValues;
  // 触发筛选变更
  props.onChange(props.filterStatus);
};

// 关闭筛选面板
const closeFilter = () => {
  props.filterStatus.value.isOpen = false;
};

// 点击外部关闭筛选面板
const handleClickOutside = (event: MouseEvent) => {
  const filterPanel = document.querySelector('.stk-filter-panel');
  const filterIcon = document.querySelector('.stk-filter .icon-filter');
  
  if (filterPanel && !filterPanel.contains(event.target as Node) && 
      filterIcon && !filterIcon.contains(event.target as Node)) {
    closeFilter();
  }
};

// 监听点击外部事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="stk-filter">
    <!-- 筛选图标 -->
    <i class="icon-filter" @click="handleIconClick">筛选</i>
    
    <!-- 筛选面板 -->
    <div 
      v-if="filterStatus.value.isOpen && filterStatus.value.options && filterStatus.value.options.length > 0"
      class="stk-filter-panel"
      :style="panelStyle"
    >
      <div class="filter-panel-header">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            :checked="isAllSelected"
            :indeterminate="isPartialSelected"
            @click="handleSelectAll"
          />
          <span>全选</span>
        </label>
        <button class="invert-btn" @click="handleInvertSelection">反选</button>
      </div>
      
      <div class="filter-options">
        <label 
          v-for="option in filterStatus.value.options" 
          :key="option.value"
          class="option-item"
        >
          <input 
            type="checkbox" 
            :checked="filterStatus.value.value.includes(option.value)"
            @click="handleOptionClick(option)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stk-filter {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-filter {
  font-size: 16px;
  color: #666;
  transition: color 0.3s;
}

.icon-filter:hover {
  color: #1890ff;
}

/* 筛选面板样式 */
.stk-filter-panel {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 200px;
  max-height: 300px;
  overflow: hidden;
}

.filter-panel-header {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
}

.invert-btn {
  padding: 2px 8px;
  font-size: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.invert-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.filter-options {
  padding: 8px 12px;
  max-height: 250px;
  overflow-y: auto;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
  cursor: pointer;
  font-size: 14px;
}

.option-item input[type="checkbox"] {
  margin-right: 8px;
}

.option-item:hover {
  background: #f5f5f5;
}
</style>