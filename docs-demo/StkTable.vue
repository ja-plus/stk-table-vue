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
    <StkTableBase class="vp-raw" :theme="isDark ? 'dark' : 'light'" v-bind="$attrs"></StkTableBase>
</template>
