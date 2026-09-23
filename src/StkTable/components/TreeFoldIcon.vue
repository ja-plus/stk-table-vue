<template>
    <span v-bind="foldAttr" :class="stateClass"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PrivateStkTableColumn } from '../types';

const props = defineProps<{
    row: any;
    col: PrivateStkTableColumn<any>;
    /** 是否可展开（唯一口径 useTree.isExpandable） */
    expandable?: boolean;
}>();

/**
 * 展开控件位的三态：箭头 / 懒加载 loading / 叶子占位。
 * 三态共用一个元素，箭头态额外带 `data-stk-fold`（点击委托判据，见 StkTable 的 onCellClick）。
 */
const state = computed(() => {
    if (props.col.type === 'tree-node' && props.row?.__T_LOADING__) return 'loading';
    if (props.col.type === 'expand' || (props.col.type === 'tree-node' && props.expandable)) return 'icon';
    return 'holder';
});

const stateClass = computed(() => ({ icon: 'stk-fold-icon', loading: 'stk-tree-loading-icon', holder: 'stk-fold-holder' }[state.value]));

const foldAttr = computed(() => (state.value === 'icon' ? { 'data-stk-fold': '' } : {}));
</script>
