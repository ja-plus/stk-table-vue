<template>
    <span v-bind="foldAttr" :class="stateClass" :aria-expanded="state === 'icon' ? String(Boolean(expanded)) : undefined"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
    /** 是否可展开 */
    expandable?: boolean;
    /** 是否正在懒加载 */
    loading?: boolean;
    /** 是否处于展开状态 */
    expanded?: boolean;
}>();

/**
 * 展开控件位的三态：箭头 / 懒加载 loading / 叶子占位。
 * 三态共用一个元素，箭头态额外带 `data-stk-fold`（点击委托判据，见 StkTable 的 onCellClick）。
 */
const state = computed(() => {
    if (props.loading) return 'loading';
    if (props.expandable) return 'icon';
    return 'holder';
});

const stateClass = computed(
    () =>
        ({
            icon: ['stk-fold-icon', { 'is-expanded': props.expanded }],
            loading: 'stk-tree-loading-icon',
            holder: 'stk-fold-holder',
        })[state.value],
);

const foldAttr = computed(() => (state.value === 'icon' ? { 'data-stk-fold': '' } : {}));
</script>
