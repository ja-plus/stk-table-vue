<script setup lang="ts">
import { StkTreeFoldIcon, StkTreeIndent } from '../../../../src/StkTable/index';
import type { CustomCellProps } from '../../../../src/StkTable/types/index';

type Row = Record<string, any>;

const props = defineProps<CustomCellProps<Row> & { showGuide?: boolean }>();
</script>

<template>
    <div class="public-tree-cell">
        <StkTreeIndent :level="props.level ?? 0" :show-guide="props.showGuide" />
        <StkTreeFoldIcon
            :expandable="props.expandable"
            :loading="props.treeLoading"
            :expanded="props.treeExpanded"
        />
        <span>{{ props.cellValue }}</span>
    </div>
</template>

<style>
.public-tree-cell {
    height: 100%;
    display: flex;
    align-items: center;
}
</style>
