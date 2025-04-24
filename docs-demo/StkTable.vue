<script lang="ts" setup>
/**
 * support vitepress env
 */
import { useData } from 'vitepress';
import { StkTable as StkTableBase } from '../src/StkTable';
import { useTemplateRef } from 'vue';
const { isDark } = useData();
const baseStkTableRef = useTemplateRef('stkTableRef');

type BaseStkTableType = InstanceType<typeof StkTableBase>;

defineExpose({
    setHighlightDimCell: (...p: Parameters<BaseStkTableType['setHighlightDimCell']>) =>
        baseStkTableRef.value?.setHighlightDimCell(...p),
    setHighlightDimRow: (...p: Parameters<BaseStkTableType['setHighlightDimRow']>) =>
        baseStkTableRef.value?.setHighlightDimRow(...p),
    setSorter: (...p: Parameters<BaseStkTableType['setSorter']>) =>
        baseStkTableRef.value?.setSorter(...p),
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
