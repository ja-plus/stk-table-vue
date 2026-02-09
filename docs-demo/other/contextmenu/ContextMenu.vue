<script lang="ts" setup>
import ContextMenu from 'ja-contextmenu';
import { MenuOption } from 'ja-contextmenu/lib/types/MenuOption';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
import { shallowRef, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
// import { useData } from 'vitepress';

// const { isDark } = useData();

type Data = {
    id: number;
    name: string;
    age: number;
    department: string;
};

const stkTableRef = useTemplateRef('stkTableRef');

const columns: StkTableColumn<Data>[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', width: 120 },
    { title: 'Age', dataIndex: 'age', width: 80 },
    { title: 'Department', dataIndex: 'department', width: 120 },
];

const dataSource = shallowRef<Data[]>([
    { id: 1, name: 'Zhang San', age: 18, department: 'Technical Department' },
    { id: 2, name: 'Li Si', age: 20, department: 'Marketing Department' },
    { id: 3, name: 'Wang Wu', age: 22, department: 'Technical Department' },
    { id: 4, name: 'Zhao Liu', age: 24, department: 'Finance Department' },
    { id: 5, name: 'Qian Qi', age: 26, department: 'Technical Department' },
]);

const contextMenu = new ContextMenu();
const menuOption: MenuOption<any> = {
    items: [
        {
            label: 'View Details',
            onclick: (e: Event, payload: Data) => {
                alert(`View details of ${payload.name}`);
            },
        },
        {
            label: (payload: Data) => `Delete ${payload.name}`,
            onclick: (e: Event, payload: Data) => {
                if (confirm(`Are you sure to delete the record of ${payload.name}?`)) {
                    dataSource.value = dataSource.value.filter(item => item.id !== payload.id);
                }
            },
        },
    ],
};
const menu = contextMenu.create(menuOption);

function onRowMenu(event: MouseEvent, row: Data) {
    stkTableRef.value?.setCurrentRow(row);
    menu.show(event, row);
}
</script>
<template>
    <StkTable
        ref="stkTableRef"
        style="height: 200px"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        @row-menu="onRowMenu"
    ></StkTable>
</template>

<style scoped>
/* Custom styles */
/* .ja-contextmenu {
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ja-contextmenu__item {
    padding: 10px 16px;
}

.ja-contextmenu__item:hover {
    background-color: #f0f9ff;
    color: #1890ff;
} */
</style>
