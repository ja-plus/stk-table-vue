<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';

const tableRef = ref<InstanceType<typeof StkTable>>();

const columns = [
    { type: 'tree-node', title: 'Name', dataIndex: 'name' },
    { title: 'Size', dataIndex: 'size' },
    { title: 'Type', dataIndex: 'type' },
];

/** 根层数据由 dataSource 提供，标记 hasChildren 但children 不加载 */
const dataSource = ref([
    { id: '/src', name: 'src', size: '-', type: 'dir', hasChildren: true },
    { id: '/docs', name: 'docs', size: '-', type: 'dir', hasChildren: true },
    { id: '/README.md', name: 'README.md', size: '4.2 KB', type: 'file' },
    { id: '/LICENSE', name: 'LICENSE', size: '1.1 KB', type: 'file' },
]);

/** 模拟远端目录接口：子节点同样只标记 hasChildren，展开时逐层加载 */
const DIR_TREE: Record<string, { name: string; size: string; type: string; hasChildren?: boolean }[]> = {
    '/src': [
        { name: 'components', size: '-', type: 'dir', hasChildren: true },
        { name: 'index.ts', size: '2.0 KB', type: 'file' },
        { name: 'styles.css', size: '8.4 KB', type: 'file' },
    ],
    '/src/components': [
        { name: 'Button.vue', size: '1.6 KB', type: 'file' },
        { name: 'Modal.vue', size: '3.2 KB', type: 'file' },
    ],
    '/docs': [
        { name: 'guide', size: '-', type: 'dir', hasChildren: true },
        { name: 'intro.md', size: '6.0 KB', type: 'file' },
    ],
    '/docs/guide': [{ name: 'start.md', size: '1.9 KB', type: 'file' }],
};

function loadMethod(row: any) {
    const path = row.id || `/${row.name}`;
    return new Promise<any[]>((resolve, reject) => {
        setTimeout(() => {
            const children = DIR_TREE[path];
            if (!children) {
                reject(new Error(`Failed to load: ${path}`));
                return;
            }
            // 返回的子行必须带唯一 id（row-key），供展开/收起定位
            resolve(children.map(c => ({ ...c, id: `${path}/${c.name}` })));
        }, 600);
    });
}

function onLoadError(error: unknown, row: any) {
    console.error('load children failed:', row.name, error);
}

// reloadTreeNode：强制重新拉取某已加载节点的子树（演示用，reload /docs 节点）
function handleReloadDocs() {
    tableRef.value?.reloadTreeNode('/docs');
}
</script>
<template>
    <div style="margin-bottom: 12px">
        <button class="btn" @click="handleReloadDocs">Reload "docs" Children</button>
    </div>
    <StkTable
        ref="tableRef"
        style="max-height: 300px"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :tree-config="{ lazy: true, loadMethod, onLoadError }"
    ></StkTable>
</template>
