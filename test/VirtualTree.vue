<template>
    <div style="display: flex; align-items: flex-start">
        <div style="width: 200px">
            <div>allHeight:{{ vScrollTree.allHeight }}</div>
            <div>mainPageHeight:{{ vScrollTree.mainPageHeight }}</div>
            <div>offsetTop:{{ vScrollTree.offsetTop }}</div>
            <div>offsetBottom:{{ vScrollTree.offsetBottom }}</div>
            <div>startIndex:{{ vScrollTree.startIndex }}</div>
            <div>endIndex:{{ vScrollTree.endIndex }}</div>
            <div>pageSize:{{ vScrollTree.pageSize }}</div>
            <hr />
        </div>
        <div style="width: 200px; border: 1px solid #ddd">
            <VirtualTree
                ref="vScrollTree"
                v-bind="vScrollTreeProps"
                :tree-data="treeData"
                @item-click="itemClick"
                @item-select="itemSelect"
                @item-dblclick="itemDblClick"
                @right-click="itemRightClick"
            ></VirtualTree>
        </div>
    </div>
</template>

<script>
import VirtualTree from '../src/VirtualTree.vue';
export default {
    components: {
        VirtualTree,
    },
    props: {},
    data() {
        let treeData = [];
        for (let i = 0; i < 20; i++) {
            let children = [];
            for (let j = 0; j < 2; j++) {
                children.push({
                    title: i + '-' + j,
                    key: i + '-' + j,
                    children: [{ title: i + '-' + j + '-' + j + 'longlonglonglong longlonglonglong', key: i + '-' + j + '-' + j }],
                });
            }
            treeData.push({ key: i, title: String(i), children });
        }
        return {
            treeData,
            vScrollTree: {},
            vScrollTreeProps: {
                height: '300px',
                // lineHeight: 20,
                // multiple: true,
                // baseIndentWidth: 8,
                // indentWidth: 10,
                // highlightCurrent: false,
                // currentCancelable: true,
                showCheckbox: true,
                // parentSelectable: true,
                clickItemExpand: true,
                // emptyText: 'no Data',
                // defaultExpandAll: true,
                defaultExpandedKeys: [10, '10-0'],
                defaultCurrentKey: '10-0-0',
                defaultScrollKey: '10-0-0',
                defaultSelectedKeys: ['0-1-1'],
            },
        };
    },
    computed: {},
    created() {},
    mounted() {
        this.vScrollTree = this.$refs.vScrollTree;
    },
    methods: {
        itemClick(item) {
            console.log('itemClick', item);
        },
        itemSelect(option) {
            console.log('itemSelect', option);
        },
        itemDblClick(item) {
            console.log('itemDblClick', item);
        },
        itemRightClick(item) {
            console.log('itemRightClick', item);
        },
    },
};
</script>

<style>
body {
    height: 100vh;
    margin: 0;
    display: flex;
    /* flex-direction: column; */
    /* align-items: center; */
    /* justify-content: center; */
}
</style>
