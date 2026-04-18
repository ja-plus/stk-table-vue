<script lang="ts" setup>
import { ref, computed, h, watch } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useData } from 'vitepress';

const { isDark } = useData();

const lightDefaults = {
    '--row-height': '28px',
    '--header-row-height': 'var(--row-height)',
    '--footer-row-height': 'var(--row-height)',
    '--cell-padding-y': '0',
    '--cell-padding-x': '8px',
    '--resize-handle-width': '4px',
    '--border-color': '#e8e8f4',
    '--border-width': '1px',
    '--td-bgc': '#ffffff',
    '--td-hover-color': 'hsl(207, 90%, 70%)',
    '--td-active-color': 'hsl(207, 90%, 54%)',
    '--th-bgc': '#f1f1f9',
    '--tf-bgc': '#f1f1f9',
    '--th-color': '#272841',
    '--tr-active-bgc': 'rgb(230, 247, 255)',
    '--tr-hover-bgc': '#e6f7ff',
    '--stripe-bgc': '#fafafc',
    '--sort-arrow-color': '#757699',
    '--sort-arrow-hover-color': '#8f90b5',
    '--sort-arrow-active-color': '#1b63d9',
    '--sort-arrow-active-sub-color': '#cbcbe1',
    '--fold-icon-color': '#757699',
    '--fold-icon-hover-color': '#8f90b5',
    '--col-resize-indicator-color': '#87879c',
    '--fixed-col-shadow-color-from': 'rgba(0, 0, 0, 0.1)',
    '--fixed-col-shadow-color-to': 'rgba(0, 0, 0, 0)',
    '--drag-handle-hover-color': '#d0d1e0',
    '--sb-thumb-color': '#c1c1d7',
    '--sb-thumb-hover-color': '#a8a8c1',
    '--cs-bgc': '#d3eafd',
    '--cs-bc': '#2196f3',
};

const darkDefaults = {
    '--row-height': '28px',
    '--header-row-height': 'var(--row-height)',
    '--footer-row-height': 'var(--row-height)',
    '--cell-padding-y': '0',
    '--cell-padding-x': '8px',
    '--resize-handle-width': '4px',
    '--border-color': '#292933',
    '--border-width': '1px',
    '--td-bgc': '#1b1b24',
    '--td-hover-color': 'hsl(219, 59%, 60%)',
    '--td-active-color': 'hsl(219, 59%, 51%)',
    '--th-bgc': '#202029',
    '--tf-bgc': '#202029',
    '--th-color': '#c0c0d1',
    '--tr-active-bgc': '#283f63',
    '--tr-hover-bgc': '#1a2b46',
    '--stripe-bgc': '#202029',
    '--sort-arrow-color': '#5d6064',
    '--sort-arrow-hover-color': '#727782',
    '--sort-arrow-active-color': '#d0d1d2',
    '--sort-arrow-active-sub-color': '#5d6064',
    '--fold-icon-color': '#5d6064',
    '--fold-icon-hover-color': '#727782',
    '--col-resize-indicator-color': '#5d6064',
    '--fixed-col-shadow-color-from': 'rgba(135, 135, 156, 0.1)',
    '--fixed-col-shadow-color-to': 'rgba(135, 135, 156, 0)',
    '--drag-handle-hover-color': '#5d6064',
    '--sb-thumb-color': 'rgba(93, 96, 100, 0.9)',
    '--sb-thumb-hover-color': 'rgb(114, 119, 130)',
    '--cs-bgc': '#2a3f6b',
    '--cs-bc': '#386ccc',
};

const cssVars = ref({ ...lightDefaults });

const resetToDefaults = () => {
    cssVars.value = { ...(isDark.value ? darkDefaults : lightDefaults) };
};

watch(
    isDark,
    newVal => {
        cssVars.value = { ...(newVal ? darkDefaults : lightDefaults) };
    },
    { immediate: true },
);

const tableStyle = computed(() => {
    const style: Record<string, string> = {};
    for (const [key, value] of Object.entries(cssVars.value)) {
        style[key] = value;
    }
    return style;
});

const varList = ref([
    {
        label: '尺寸',
        key: '1',
        children: [
            { label: '行高', key: '--row-height', type: 'number', unit: 'px' },
            { label: '表头行高', key: '--header-row-height', type: 'text' },
            { label: '表尾行高', key: '--footer-row-height', type: 'text' },
            { label: '单元格垂直内边距', key: '--cell-padding-y', type: 'number', unit: 'px' },
            { label: '单元格水平内边距', key: '--cell-padding-x', type: 'number', unit: 'px' },
            { label: '列宽调整手柄宽度', key: '--resize-handle-width', type: 'number', unit: 'px' },
        ],
    },
    {
        label: '边框',
        key: '2',
        children: [
            { label: '边框颜色', key: '--border-color', type: 'color' },
            { label: '边框宽度', key: '--border-width', type: 'number', unit: 'px' },
        ],
    },
    {
        label: '单元格',
        key: '3',
        children: [
            { label: '单元格背景色', key: '--td-bgc', type: 'color' },
            { label: '单元格悬停色', key: '--td-hover-color', type: 'color' },
            { label: '单元格激活色', key: '--td-active-color', type: 'color' },
        ],
    },
    {
        label: '表头/表尾',
        key: '4',
        children: [
            { label: '表头背景色', key: '--th-bgc', type: 'color' },
            { label: '表尾背景色', key: '--tf-bgc', type: 'color' },
            { label: '表头文字色', key: '--th-color', type: 'color' },
        ],
    },
    {
        label: '行状态',
        key: '5',
        children: [
            { label: '行悬停背景色', key: '--tr-hover-bgc', type: 'color' },
            { label: '行激活背景色', key: '--tr-active-bgc', type: 'color' },
            { label: '斑马纹背景色', key: '--stripe-bgc', type: 'color' },
        ],
    },
    {
        label: '排序',
        key: '6',
        children: [
            { label: '排序箭头颜色', key: '--sort-arrow-color', type: 'color' },
            { label: '排序箭头悬停色', key: '--sort-arrow-hover-color', type: 'color' },
            { label: '排序箭头激活色', key: '--sort-arrow-active-color', type: 'color' },
            { label: '排序箭头激活次要颜色', key: '--sort-arrow-active-sub-color', type: 'color' },
        ],
    },
    {
        label: '图标',
        key: '7',
        children: [
            { label: '折叠图标颜色', key: '--fold-icon-color', type: 'color' },
            { label: '折叠图标悬停色', key: '--fold-icon-hover-color', type: 'color' },
        ],
    },
    {
        label: '列宽调整',
        key: '8',
        children: [
            { label: '列宽调整指示器颜色', key: '--col-resize-indicator-color', type: 'color' },
        ],
    },
    {
        label: '固定列',
        key: '9',
        children: [
            { label: '固定列阴影起始颜色', key: '--fixed-col-shadow-color-from', type: 'color' },
            { label: '固定列阴影结束颜色', key: '--fixed-col-shadow-color-to', type: 'color' },
        ],
    },
    {
        label: '拖拽行',
        key: '10',
        children: [{ label: '拖拽手柄悬停颜色', key: '--drag-handle-hover-color', type: 'color' }],
    },
    {
        label: '滚动条',
        key: '11',
        children: [
            { label: '滚动条颜色', key: '--sb-thumb-color', type: 'color' },
            { label: '滚动条悬停色', key: '--sb-thumb-hover-color', type: 'color' },
        ],
    },
    {
        label: '选区',
        key: '12',
        children: [
            { label: '选区背景色', key: '--cs-bgc', type: 'color' },
            { label: '选区边框色', key: '--cs-bc', type: 'color' },
        ],
    },
]);

const controlColumns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: '说明', dataIndex: 'label', sorter: true },
    { title: 'CSS Var', dataIndex: 'key', sorter: true },
    {
        title: 'Value',
        dataIndex: 'value',
        align: 'right',
        width: 150,
        customCell: ({ row }) => {
            const children = [];
            if (row.type === 'color') {
                children.push(
                    h('input', {
                        type: 'color',
                        value: cssVars.value[row.key as keyof typeof cssVars.value],
                        class: 'color-input',
                        onChange: (e: Event) => {
                            const target = e.target as HTMLInputElement;
                            cssVars.value[row.key as keyof typeof cssVars.value] = target.value;
                        },
                    }),
                );
            } else if (row.type === 'number') {
                const val = cssVars.value[row.key as keyof typeof cssVars.value] as string;
                const match = val?.match(/^([\d.]+)/);
                const numVal = match ? parseFloat(match[1]) : 0;
                children.push(
                    h('input', {
                        type: 'number',
                        value: numVal,
                        class: 'number-input',
                        onChange: (e: Event) => {
                            const target = e.target as HTMLInputElement;
                            cssVars.value[row.key as keyof typeof cssVars.value] =
                                `${target.value}${row.unit}`;
                        },
                    }),
                    h('span', { class: 'unit-label' }, ' ' + row.unit),
                );
            } else {
                children.push(
                    h('input', {
                        type: 'text',
                        value: cssVars.value[row.key as keyof typeof cssVars.value],
                        class: 'text-input',
                        onChange: (e: Event) => {
                            const target = e.target as HTMLInputElement;
                            cssVars.value[row.key as keyof typeof cssVars.value] = target.value;
                        },
                    }),
                );
            }
            return h('div', { class: 'control-cell' }, children);
        },
    },
];
</script>

<template>
    <div class="css-vars-demo">
        <div class="demo-header">
            <button class="reset-btn" @click="resetToDefaults">Reset</button>
        </div>
        <StkTable
            ref="stkTableRef"
            row-key="key"
            class="control-table"
            style="height: 500px"
            :style="tableStyle"
            virtual
            stripe
            bordered
            cell-active
            cell-hover
            scrollbar
            :columns="controlColumns"
            :data-source="varList"
        />
    </div>
</template>

<style scoped>
.css-vars-demo {
    border-radius: 8px;
    overflow: hidden;
}

.demo-header {
    display: flex;
    justify-content: flex-end;
    padding: 8px 12px;
}

.reset-btn {
    padding: 3px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    background: var(--vp-button-alt-bg);
    color: var(--vp-button-alt-text);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
}

.reset-btn:hover {
    background: var(--vp-button-alt-hover-bg);
    color: var(--vp-button-alt-hover-text);
    border-color: var(--vp-c-divider);
}

.control-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
}

:deep(.number-input) {
    width: 50px;
    height: 24px;
    padding: 2px 6px;
    border: 1px solid var(--border-color, #e8e8f4);
    border-radius: 3px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    text-align: right;
    -moz-appearance: textfield;
}

:deep(.number-input)::-webkit-outer-spin-button,
:deep(.number-input)::-webkit-inner-spin-button {
    -webkit-appearance: inner-spin-button;
    margin: 0;
}

:deep(.number-input):focus {
    outline: none;
    border-color: var(--vp-c-brand);
}

:deep(.unit-label) {
    font-size: 12px;
    color: var(--vp-c-text-2);
    font-family: 'Courier New', monospace;
}

.var-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.var-key {
    font-family: 'Courier New', monospace;
    color: var(--vp-c-brand);
    font-size: 12px;
    white-space: nowrap;
}

.var-label {
    color: var(--vp-c-text-2);
    font-size: 12px;
}

:deep(.color-input) {
    width: 60px;
    height: 24px;
    cursor: pointer;
}

.css-vars-demo :deep(.text-input) {
    width: 100%;
    height: 24px;
    padding: 2px 6px;
    border: 1px solid var(--border-color, #e8e8f4);
    border-radius: 3px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    text-align: right;
}

.css-vars-demo :deep(.text-input):focus {
    outline: none;
    border-color: var(--vp-c-brand);
}
</style>
