<template>
    <StkTable
        style="max-height: 300px"
        row-key="id"
        bordered
        :columns="columns"
        :data-source="dataSource"
        :tree-config="{ defaultExpandAll: true, showGuide: true }"
    />
    <div class="info-box">
        <h3>{{ t('selected') }}:</h3>
        <div class="selected-items">
            <template v-if="selectedLeaves.length > 0">
                <span v-for="item in selectedLeaves" :key="item.id" class="selected-item">
                    {{ item.name }}
                </span>
            </template>
            <span v-else>{{ t('noSelect') }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/one-component-per-file, vue/require-prop-types */
import { computed, defineComponent, h, ref } from 'vue';
import StkTable from '../../../StkTable.vue';
import { createCheckboxCell, StkTreeIndent, StkTreeFoldIcon } from '../../../../src/StkTable/index';
import { useI18n } from '../../../hooks/useI18n/index';

const { t } = useI18n();

const { CheckboxCell, CheckboxAllCell } = createCheckboxCell({
    field: '_isChecked',
    // 树形数据下开启勾选级联：勾父连带全部子孙、父行半选由子孙推导、表头按叶子行统计
    cascade: true,
    onChange: (checked: any, row: any) => {
        console.log('行选中变更（用户点击的行）:', checked, row.name);
    },
    onSelectAll: (checked: any) => {
        console.log('全选变更:', checked);
    },
});

/** 组件定义只创建一次：放 render 里每次新生成组件类型，勾选后会整格重挂（Vue 按组件类型 diff） */
const checkboxCellComp = CheckboxCell();
const checkboxAllCellComp = CheckboxAllCell();

/**
 * 树列组合单元格：内置缩进（含引导线）+ 内置展开箭头 + 级联勾选 + 名称。
 * checkbox 部分（勾选/半选/级联写）直接复用 CheckboxCell 组件；
 * 缩进与箭头取 StkTable 为树列 customCell 提供的内置插槽，与默认树形渲染一致
 * （箭头自带 data-stk-fold，点击展开切换由表体委托，checkbox 自带 click.stop 不触发展开）。
 */
const TreeCheckCell = defineComponent({
    name: 'TreeCheckCell',
    props: [
        'row',
        'col',
        'cellValue',
        'rowIndex',
        'colIndex',
        'expanded',
        'treeExpanded',
        'level',
        'expandable',
        'treeLoading',
        'showGuide',
    ],
    setup(props: any, { slots }: any) {
        return () =>
            h('div', { class: 'tree-check-cell' }, [
                slots.stkTreeIndent?.() ??
                    h(StkTreeIndent, { level: props.level ?? 0, showGuide: props.showGuide }),
                slots.stkFoldIcon?.() ??
                    h(StkTreeFoldIcon, {
                        expandable: props.expandable,
                        loading: props.treeLoading,
                        expanded: props.treeExpanded,
                    }),
                h(checkboxCellComp, {
                    row: props.row,
                    col: props.col,
                    cellValue: props.cellValue,
                    rowIndex: props.rowIndex,
                    colIndex: props.colIndex,
                    treeExpanded: props.treeExpanded,
                }),
                h('span', { class: 'tree-check-cell__label' }, [props.cellValue ?? '']),
            ]);
    },
});

/** 树列表头：全选/半选 checkbox + 标题；占位格与展开箭头等宽，使表头勾选与树列勾选对齐 */
const TreeCheckHeader = defineComponent({
    name: 'TreeCheckHeader',
    props: ['col', 'colIndex', 'rowIndex'],
    setup(props: any) {
        return () =>
            h('div', { class: 'tree-check-header' }, [
                h('span', { class: 'tree-check-header__spacer' }),
                h(checkboxAllCellComp, {
                    col: props.col,
                    colIndex: props.colIndex,
                    rowIndex: props.rowIndex,
                }),
                h('span', { class: 'tree-check-header__title' }, [props.col?.title ?? '']),
            ]);
    },
});

const columns = [
    {
        type: 'tree-node',
        title: t('area'),
        dataIndex: 'name',
        width: 260,
        customCell: TreeCheckCell,
        customHeaderCell: TreeCheckHeader,
    },
    { title: t('population'), dataIndex: 'population', width: 120, align: 'right' },
    { title: t('gdp'), dataIndex: 'gdp', width: 120, align: 'right' },
];

const dataSource = ref<Record<string, any>[]>([
    {
        id: 'asia',
        name: 'Asia',
        children: [
            { id: 'china', name: 'China', population: 1400000000, gdp: 14100 },
            {
                id: 'japan',
                name: 'Japan',
                population: 126000000,
                gdp: 4200,
                children: [
                    { id: 'tokyo', name: 'Tokyo', population: 37000000, gdp: 1020 },
                    { id: 'osaka', name: 'Osaka', population: 19000000, gdp: 380 },
                ],
            },
        ],
    },
    {
        id: 'europe',
        name: 'Europe',
        children: [
            { id: 'germany', name: 'Germany', population: 83000000, gdp: 4500 },
            { id: 'france', name: 'France', population: 67000000, gdp: 3050 },
        ],
    },
]);

/**
 * 选中叶子行（提交口径）：cascade 下父行勾选态由子孙推导，
 * 业务取选中集时应遍历叶子行，避免父行与子孙重复计数。
 */
const selectedLeaves = computed(() => {
    const result: Record<string, any>[] = [];
    const walk = (list: Record<string, any>[]) => {
        list.forEach(item => {
            if (item.children?.length) {
                walk(item.children);
            } else if (item._isChecked) {
                result.push(item);
            }
        });
    };
    walk(dataSource.value);
    return result;
});
</script>

<style scoped>
.info-box h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
}

.selected-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.selected-item {
    padding: 4px 12px;
    background-color: #1890ff;
    color: white;
    border-radius: 16px;
}
</style>

<style>
/* 树列组合单元格由 defineComponent + h() 渲染，scoped 样式无法命中（参考 FileTree/NameCell 先例），类名加前缀防全局冲突 */
.tree-check-cell {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
}

.tree-check-cell__label {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.tree-check-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* 与树列展开箭头等宽的占位，让表头全选框与树列 checkbox 视觉对齐 */
.tree-check-header__spacer {
    width: var(--tree-indent-width, 16px);
    flex-shrink: 0;
}

.tree-check-header__title {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
