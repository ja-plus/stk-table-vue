<script lang="ts" setup>
/**
 * support vitepress env
 */
import { useData } from 'vitepress';
import { StkTable as StkTableBase } from '../src/StkTable';
const { isDark } = useData();
</script>
<template>
    <!-- support -->
    <StkTableBase class="vp-raw" :theme="isDark ? 'dark' : 'light'" v-bind="$attrs">
        <!-- 循环注册 父级传递下来的slot -->
        <template v-for="(value, key) in $slots" #[key]="slotProps" :key="key">
            <slot :name="key" v-bind="slotProps"></slot>
        </template>
    </StkTableBase>
</template>
