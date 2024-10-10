<script lang="ts" setup>
import { h, ref } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { StkTableColumn } from '../src/StkTable/types';
import { shallowRef } from 'vue';

const virtual = ref(false);

let sourceIndex: number | null = null;

const columns = ref<StkTableColumn<any>[]>([
    {
        dataIndex: '',
        width: 100,
        title: 'custom drag cell',
        align: 'center',
        fixed: 'left',
        customCell: props => {
            const { rowIndex } = props;
            return h(
                'div',
                {
                    draggable: 'true',
                    class: 'custom-drag-handle',
                    onDragstart: e => handleDragStart(e, rowIndex),
                    onDragover: e => handleDragOver(e, rowIndex),
                    onDragleave: e => handleDragLeave(e),
                    onDragend: e => handleDragEnd(e),
                    onDrop: e => handleDrop(e, rowIndex),
                },
                [
                    h('div', { class: 'group' }, [h('div', { class: 'point' }), h('div', { class: 'point' }), h('div', { class: 'point' })]),
                    h('div', { class: 'group' }, [h('div', { class: 'point' }), h('div', { class: 'point' }), h('div', { class: 'point' })]),
                ],
            );
        },
    },
    {
        key: 'dragRow',
        type: 'dragRow',
        width: 50,
        title: 'type dragRow',
        dataIndex: 'id',
        align: 'center',
    },
    { dataIndex: 'id', title: 'id(100px)', width: '100px' },
    { dataIndex: 'address', title: 'address' },
    { dataIndex: 'email', title: 'email' },
    { dataIndex: 'phone', title: 'phone' },
]);

const data = shallowRef(
    new Array(100).fill(0).map((it, index) => {
        return {
            id: index,
            name: 'name' + index,
            address: 'sss',
            email: 'email' + index + '@example.com',
            phone: '123-456-7890',
        };
    }),
);

function handleDragStart(e: DragEvent, startIndex: number) {
    sourceIndex = startIndex;
    const target = e.target as HTMLElement;
    const tr = target.closest('tr');
    // tr ?.classList.add('dragging');
    if (tr) {
        e.dataTransfer?.setDragImage(tr, 50, 10);
        tr.style.opacity = '0.5';
    }
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
    }
}

function handleDragEnd(e: DragEvent) {
    const target = e.target as HTMLElement;
    const tr = target.closest('tr');
    if (tr) {
        tr.style.opacity = '1';
    }
}
function handleDragOver(e: DragEvent, endIndex: number) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const tr = target.closest('tr');

    if (tr) {
        tr.style.boxShadow = 'inset 0 -2px 0 0 #1d63d9';
    }
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
    }
}

function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('drag-handle')) {
        const tr = target.closest('tr');
        if (tr) {
            tr.style.removeProperty('box-shadow');
        }
    }
}

function handleDrop(e: DragEvent, endIndex: number) {
    console.log('🚀 ~ handleDrop ~ switch index:', sourceIndex, endIndex);
    const target = e.target as HTMLElement;
    const tr = target.closest('tr');
    if (tr) {
        tr.style.removeProperty('box-shadow');
    }
    if (sourceIndex === null) return;
    const d = [...data.value];
    const sourceData = d[sourceIndex];
    d.splice(sourceIndex, 1);
    d.splice(endIndex, 0, sourceData);
    data.value = d;
}
</script>
<template>
    <div>
        <h2>Drag Row</h2>
        <div>
            <label><input v-model="virtual" type="checkbox" /> virtual (fix expand row height)</label>
        </div>
        <StkTable
            row-key="id"
            :col-key="col => col.key || col.dataIndex"
            style="height: 300px"
            :virtual="virtual"
            :columns="columns"
            :data-source="data"
        >
            <template #expand="{ row, col }">
                <div>trigger: {{ col.title || '--' }}</div>
                <p>id: {{ row.id }}, phone: {{ row.phone }}</p>
                <p>name: {{ row.name }}</p>
                <p>website: {{ row.website }}</p>
            </template>
        </StkTable>
    </div>
</template>
<style lang="less" scoped>
:deep(.stk-table) {
    .custom-drag-handle {
        display: flex;
        justify-content: center;
        height: 16px;
        padding: 2px;
        cursor: grab;
        border-radius: 4px;
        &:hover {
            background-color: #ddd;
        }
        .group {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .point {
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background-color: #888;
            }
        }
        .group + .group {
            margin-left: 2px;
        }
    }
}
</style>
