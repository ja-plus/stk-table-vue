<script setup lang="ts">
import { CustomHeaderCellProps } from '../../types';
import { computed } from 'vue';
import { getDropdownIns } from './Dropdown/index';
import { FilterOption } from './types';

const props = defineProps<
    CustomHeaderCellProps<any> & {
        theme?: 'light' | 'dark';
        active?: boolean; // 是否激活筛选
        options: FilterOption[]; // 自定义筛选选项
    }
>();

// 从父组件继承 theme，默认为 'light'
const theme = computed(() => props.theme || 'light');

const emit = defineEmits<{
    (e: 'change', value: FilterOption['value'][]): void;
}>();

function handleIconClick(e: MouseEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // 计算相对于文档的位置（考虑滚动偏移）
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    getDropdownIns().then(ins => {
        if (ins.visible) {
            ins.hide();
            return;
        }
        ins.setTheme(theme.value);
        ins.show(
            {
                x: rect.left + scrollLeft,
                y: rect.bottom + scrollTop,
                height: rect.height,
            },
            props.options,
            handleConfirm,
        );
    });
}

function handleConfirm(value: FilterOption['value'][]) {
    emit('change', value);
}
</script>

<template>
    <div class="stk-filter" :class="[{ 'stk-filter--active': props.active }, `stk-filter--${theme}`]">
        <slot>{{ props.col.title }}</slot>
        <svg class="stk-filter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" @click="handleIconClick">
            <path fill="currentColor" d="M609.508 463.246H414.492l-243.825-292.58h682.666zm0 48.754v212.878L414.492 853.333V512z" />
        </svg>
    </div>
</template>
