<template>
    <div style="display: flex; justify-content: center; width: 100vw">
        <VirtualTreeSelect
            ref="vsTreeSelect"
            :replace-fields="{ key: 'id', title: 'label' }"
            :value="selectedId"
            :tree-data="treeData"
            :vs-tree-props="vsTreeProps"
            @change="onSelectChange"
        ></VirtualTreeSelect>
        <VirtualTreeSelect
            :replace-fields="{ key: 'id', title: 'label' }"
            :value="selectedId2"
            :tree-data="treeData"
            @change="onSelectChange2"
        ></VirtualTreeSelect>
        <VirtualTreeSelect
            ref="vsTreeSelect2"
            :replace-fields="{ key: 'id', title: 'label' }"
            placeholder="请选择..."
            :tree-data="treeData3"
            :vs-tree-props="vsTreeProps3"
            :dropdown-width="800"
            @change="onSelectChange3"
        ></VirtualTreeSelect>
    </div>
    <br />
    <div>selectedId: {{ selectedId }}</div>
</template>

<script>
import VirtualTreeSelect from '../src/VirtualTreeSelect.vue';
export default {
    components: { VirtualTreeSelect },
    props: {},
    data() {
        let treeData = [];
        for (let i = 0; i < 20; i++) {
            let children = [];
            for (let j = 0; j < 2; j++) {
                children.push({
                    label: i + '-' + j,
                    id: i + '-' + j,
                    children: [{ label: i + '-' + j + '-' + j + 'longlonglonglong longlonglonglong', id: i + '-' + j + '-' + j }],
                });
            }
            treeData.push({ id: i, label: String(i), children });
        }
        return {
            vsTreeProps: {
                lineHeight: 24,
                clickItemExpand: true,
                // 点击时不设置current，需要手动通过setValue方法设置current以高亮
                // setCurrentWhenClick: false,
            },
            vsTreeProps3: {
                lineHeight: 24,
            },
            selectedId: '0-0',
            selectedId2: '',
            treeData,
            treeData3: structuredClone(treeData),
        };
    },
    methods: {
        onSelectChange(item) {
            this.selectedId = item.id;
        },
        onSelectChange2(item) {
            this.selectedId2 = item.id;
        },
        onSelectChange3(item) {
            // 其他地方更改value时，须手动指定高亮的项
            this.$refs.vsTreeSelect.setValue(item.id);
        },
    },
};
</script>

<style></style>
