<script lang="ts" setup>
/**
 * support vitepress env
 */
import { useData } from 'vitepress';
import { StkTable as StkTableBase, registerFeature, useAreaSelection, useRowDragSelection } from '../src/StkTable';
import { useTemplateRef } from 'vue';
const { isDark } = useData();
const baseStkTableRef = useTemplateRef('stkTableRef');

registerFeature([useAreaSelection, useRowDragSelection]);

type BaseStkTableType = InstanceType<typeof StkTableBase>;

defineExpose({
    setHighlightDimCell: (...p: Parameters<BaseStkTableType['setHighlightDimCell']>) =>
        baseStkTableRef.value?.setHighlightDimCell(...p),
    setHighlightDimRow: (...p: Parameters<BaseStkTableType['setHighlightDimRow']>) =>
        baseStkTableRef.value?.setHighlightDimRow(...p),
    setSorter: (...p: Parameters<BaseStkTableType['setSorter']>) =>
        baseStkTableRef.value?.setSorter(...p),
    setRowExpand: (...p: Parameters<BaseStkTableType['setRowExpand']>) =>
        baseStkTableRef.value?.setRowExpand(...p),
    setCurrentRow: (...p: Parameters<BaseStkTableType['setCurrentRow']>) =>
        baseStkTableRef.value?.setCurrentRow(...p),
    setSelectedCell: (...p: Parameters<BaseStkTableType['setSelectedCell']>) =>
        baseStkTableRef.value?.setSelectedCell(...p),
    getSelectedRows: (...p: Parameters<BaseStkTableType['getSelectedRows']>) =>
        baseStkTableRef.value?.getSelectedRows(...p),
    setSelectedRows: (...p: Parameters<BaseStkTableType['setSelectedRows']>) =>
        baseStkTableRef.value?.setSelectedRows(...p),
    clearSelectedRows: (...p: Parameters<BaseStkTableType['clearSelectedRows']>) =>
        baseStkTableRef.value?.clearSelectedRows(...p),
    getSortColumns: (...p: Parameters<BaseStkTableType['getSortColumns']>) =>
        baseStkTableRef.value?.getSortColumns(...p),
    sortStates: typeof baseStkTableRef.value?.sortStates,
    resetSorter: (...p: Parameters<BaseStkTableType['resetSorter']>) =>
        baseStkTableRef.value?.resetSorter(...p),
});
</script>
<template>
    <!-- support -->
    <StkTableBase
        ref="stkTableRef"
        class="vp-raw"
        :theme="isDark ? 'dark' : 'light'"
        v-bind="$attrs"
    >
        <!-- 循环注册 父级传递下来的slot -->
        <template v-for="(value, key) in $slots" #[key]="slotProps" :key="key">
            <slot :name="key" v-bind="slotProps"></slot>
        </template>
    </StkTableBase>
</template>
