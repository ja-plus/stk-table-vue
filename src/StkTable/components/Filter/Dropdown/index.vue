<script setup lang="ts">
import { StkTableColumn } from '@/StkTable/types';
import { h, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import StkTable from '../../../StkTable.vue';
import type { FilterOption } from '../types';

const theme = ref<'light' | 'dark'>('light');
const checkedTempValueSet = reactive<Set<FilterOption['value']>>(new Set());

const columns = ref<StkTableColumn<FilterOption>[]>([
    {
        title: '',
        dataIndex: 'value',
        width: 30,
        className: 'stk-filter-dropdown-checkbox',
        customCell: ({ row }) =>
            h('input', {
                type: 'checkbox',
                checked: checkedTempValueSet.has(row.value),
            }),
    },
    { title: '', dataIndex: 'label', customCell: ({ row }) => h('span', [row.label]) },
]);

const visible = ref(false);
const position = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const options = ref<FilterOption[]>([]);

const dropdownEl = ref<HTMLDivElement>();

const DROPDOWN_DEFAULT_WIDTH = 300; // 默认宽度（用于首次计算）
const DROPDOWN_DEFAULT_HEIGHT = 400; // 默认高度（用于首次计算）
const PADDING = 6; // 与屏幕边缘的安全距离

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

let onConfirmFn: (values: FilterOption['value'][]) => void;

function getDropdownSize() {
    if (!dropdownEl.value) {
        return [DROPDOWN_DEFAULT_WIDTH, DROPDOWN_DEFAULT_HEIGHT] as const;
    }
    const rect = dropdownEl.value.getBoundingClientRect();
    return [rect.width || DROPDOWN_DEFAULT_WIDTH, rect.height || DROPDOWN_DEFAULT_HEIGHT] as const;
}

function calculatePosition(docPos: { x: number; y: number; height?: number }) {
    // docPos 是相对于文档的坐标（已包含滚动偏移）
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    const [dropdownWidth, dropdownHeight] = getDropdownSize();

    let finalX = docPos.x;
    let finalY = docPos.y;

    // 检测是否超出右边界（相对于视口）
    const relativeX = docPos.x - scrollLeft;
    if (relativeX + dropdownWidth > viewportWidth - PADDING) {
        finalX = viewportWidth - dropdownWidth - PADDING + scrollLeft;
    }

    // 检测是否超出下边界（相对于视口）
    const relativeY = docPos.y - scrollTop;
    if (relativeY + dropdownHeight > viewportHeight - PADDING) {
        // 如果下方空间不足，尝试在上方显示
        const triggerHeight = docPos.height || 30;
        if (relativeY - triggerHeight >= dropdownHeight + PADDING) {
            // 上方空间足够，在触发元素上方显示
            finalY = docPos.y - triggerHeight - dropdownHeight - PADDING;
        } else {
            // 上方空间也不足，使用最大可用空间（从视口顶部开始）
            finalY = PADDING + scrollTop;
        }
    }

    // 确保不会超出左边界和上边界
    finalX = Math.max(PADDING + scrollLeft, finalX);
    finalY = Math.max(PADDING + scrollTop, finalY);

    return { x: finalX, y: finalY };
}

async function show(pos: { x: number; y: number; height?: number }, opt: FilterOption[], onConfirm: (values: FilterOption['value'][]) => void) {
    if (dropdownEl.value) {
        dropdownEl.value.style.visibility = 'hidden';
    }
    visible.value = true;
    options.value = opt || [];
    initChecked();
    onConfirmFn = onConfirm;
    await nextTick();
    position.value = calculatePosition(pos);
    if (dropdownEl.value) {
        dropdownEl.value.style.visibility = 'visible';
    }
}

async function handleClickOutside(e: MouseEvent) {
    if (!visible.value || dropdownEl.value?.contains(e.target as Node)) return;
    hide();
}

function initChecked() {
    options.value.forEach(opt => {
        if (opt.selected) {
            checkedTempValueSet.add(opt.value);
        }
    });
}

function updateChecked(checked: boolean, row: FilterOption) {
    if (checked) {
        checkedTempValueSet.add(row.value);
    } else {
        checkedTempValueSet.delete(row.value);
    }
}

function confirm() {
    options.value.forEach(opt => (opt.selected = checkedTempValueSet.has(opt.value)));
    onConfirmFn(Array.from(checkedTempValueSet));
    hide();
}
function hide() {
    visible.value = false;
    options.value = [];
    checkedTempValueSet.clear();
}
function handleRowClick(e: MouseEvent, row: FilterOption) {
    const selected = checkedTempValueSet.has(row.value);
    updateChecked(!selected, row);
}

function setTheme(t: 'light' | 'dark') {
    theme.value = t;
}

function handleClear() {
    checkedTempValueSet.clear();
}

defineExpose({ visible, show, hide, setTheme });
</script>
<template>
    <div
        ref="dropdownEl"
        class="stk-filter-dropdown"
        :class="[`stk-filter-dropdown--${theme}`]"
        :style="{
            top: position.y + 'px',
            left: position.x + 'px',
            display: visible ? void 0 : 'none',
        }"
        @click.stop
    >
        <div style="padding: 4px">Filter (Beta)</div>
        <StkTable
            row-key="id"
            headless
            virtual
            no-data-full
            :theme="theme"
            :row-active="false"
            :row-height="20"
            :bordered="false"
            :columns="columns"
            :data-source="options"
            @row-click="handleRowClick"
        />
        <footer>
            <button @click="handleClear">↺</button>
            <button @click="confirm">✓</button>
        </footer>
    </div>
</template>
