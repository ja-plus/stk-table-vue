<script lang="ts" setup>
import { h, ref, shallowRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/types';
import CheckItem from '../../components/CheckItem.vue';

const p = ref({
    virtual: false,
});

const columns = ref<StkTableColumn<any>[]>([
    { dataIndex: 'id', title: 'id' },
    {
        dataIndex: '',
        width: 200,
        title: 'Custom',
        align: 'center',
        customCell: props => {
            const { rowIndex } = props;
            return h(
                'div',
                {
                    draggable: 'true',
                    class: 'custom-drag-handle',
                    onDragstart: e => handleDragStart(e, rowIndex),
                    onDragover: e => handleDragOver(e),
                    onDragleave: e => handleDragLeave(e),
                    onDragenter: e => handleDragEnter(e),
                    onDragend: e => handleDragEnd(e),
                    onDrop: e => handleDrop(e, rowIndex),
                },
                [
                    h('div', { class: 'point-wrapper' }, [
                        h('div', { class: 'point' }),
                        h('div', { class: 'point' }),
                        h('div', { class: 'point' }),
                        h('div', { class: 'point' }),
                    ]),
                ],
            );
        },
    },
    { dataIndex: 'email', title: 'email' },
    { dataIndex: 'phone', title: 'phone' },
]);

const data = shallowRef(
    new Array(100).fill(0).map((it, index) => {
        return {
            id: index,
            name: 'name' + index,
            email: 'email' + index + '@example.com',
            phone: '123-456-7890',
        };
    }),
);

function handleDragStart(e: DragEvent, startIndex: number) {
    const target = e.target as HTMLElement;
    const tr = target.closest('tr');
    if (tr) {
        e.dataTransfer?.setDragImage(tr, 50, 10);
        tr.style.opacity = '0.5';
    }
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('sourceIndex', String(startIndex)); // 保存拖动开始的位置
    }
}

function handleDragEnd(e: DragEvent) {
    const target = e.target as HTMLElement;
    const tr = target.closest('tr');
    if (tr) {
        tr.style.opacity = '1';
    }
}
function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
    }
}
function handleDragEnter(e: DragEvent) {
    addHoverStyle(e.target as HTMLElement);
}

function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('custom-drag-handle')) {
        removeHoverStyle(target);
    }
}

function handleDrop(e: DragEvent, endIndex: number) {
    removeHoverStyle(e.target as HTMLElement);
    const sourceIndex = Number(e.dataTransfer?.getData('sourceIndex'));
    if (isNaN(sourceIndex) || sourceIndex === endIndex) return;
    const d = data.value.slice();
    const sourceData = d[sourceIndex];
    d.splice(sourceIndex, 1);
    d.splice(endIndex, 0, sourceData);
    data.value = d;
}

function addHoverStyle(target: HTMLElement) {
    const tr = target.closest('tr');
    if (tr) {
        tr.style.boxShadow = 'inset 0 -2px 0 0 #1d63d9';
    }
}
function removeHoverStyle(target: HTMLElement) {
    const tr = target.closest('tr');
    if (tr) {
        tr.style.removeProperty('box-shadow');
    }
}
</script>
<template>
    <div>
        <CheckItem v-model="p.virtual" text="virtual"></CheckItem>
        <StkTable
            v-model:columns="columns"
            style="height: 300px"
            row-key="id"
            :virtual="p.virtual"
            :data-source="data"
        >
        </StkTable>
    </div>
</template>
<style lang="less" scoped>
:deep(.stk-table) {
    .custom-drag-handle {
        padding: 2px;
        cursor: grab;
        border-radius: 4px;
        display: flex;
        justify-content: center;

        &:hover {
            background-color: var(--vp-c-border);
        }

        .point-wrapper {
            height: 14px;
            width: 16px;
            position: relative;
            pointer-events: none;
        }

        .point {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #888;
            position: absolute;

            &:nth-child(2) {
                left: 8px;
            }

            &:nth-child(3) {
                top: 8px;
            }

            &:nth-child(4) {
                left: 8px;
                top: 8px;
            }
        }
    }
}
</style>
