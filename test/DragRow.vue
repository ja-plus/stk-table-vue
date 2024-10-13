<script lang="ts" setup>
import { h, ref } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { StkTableColumn } from '../src/StkTable/types';
import { shallowRef } from 'vue';

const p = ref({
    virtual: false,
    theme: 'light',
});

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
                    h('div', { class: 'point' }),
                    h('div', { class: 'point' }),
                    h('div', { class: 'point' }),
                    h('div', { class: 'point' }),
                    h('div', { class: 'point' }),
                    h('div', { class: 'point' }),
                ],
            );
        },
    },
    {
        key: 'dragRow',
        type: 'dragRow', // type dragRow
        width: 150,
        title: 'type="dragRow"',
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
    if (target.classList.contains('custom-drag-handle')) {
        const tr = target.closest('tr');
        if (tr) {
            tr.style.removeProperty('box-shadow');
        }
    }
}

function handleDrop(e: DragEvent, endIndex: number) {
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
            <label><input v-model="p.virtual" type="checkbox" /> virtual (fix expand row height)</label>
            <label><input v-model="p.theme" name="theme" type="radio" value="light" /> light</label>
            <label><input v-model="p.theme" name="theme" type="radio" value="dark" /> dark</label>
        </div>
        <StkTable
            v-model:columns="columns"
            :theme="p.theme"
            row-key="id"
            style="height: 300px"
            header-drag
            :col-key="col => col.key || col.dataIndex"
            :virtual="p.virtual"
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
        height: 16px;
        padding: 2px;
        cursor: grab;
        border-radius: 4px;
        position: relative;
        &:hover {
            background-color: #ddd;
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
            &:nth-child(5) {
                top: 14px;
            }
            &:nth-child(6) {
                top: 14px;
                left: 8px;
            }
        }
    }
}
</style>
