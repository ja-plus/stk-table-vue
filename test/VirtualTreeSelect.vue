<template lang="pug">
div(style="display:flex;justify-content:center;width:100vw;")
    VirtualTreeSelect(
        ref="vsTreeSelect"
        :replaceFields="{key:'id', title:'label'}" 
        :value="selectedId" 
        :treeData="treeData"
        :vsTreeProps="vsTreeProps" 
        @change="onSelectChange"
    )
    VirtualTreeSelect(:replaceFields="{key:'id', title:'label'}" :value="selectedId2" :treeData="treeData" @change="onSelectChange2")
    VirtualTreeSelect(
        ref="vsTreeSelect2"
        :replaceFields="{key:'id', title:'label'}" 
        placeholder="请选择..."
        :treeData="treeData3"
        :vsTreeProps="vsTreeProps3" 
        :dropdownWidth="800"
        @change="onSelectChange3"
    )
br
div selectedId: {{selectedId}}
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
