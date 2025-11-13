<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useFilter } from '../../../src/StkTable/components/Filter';

// 表格数据
const dataSource = ref(
  Array.from({ length: 20 }, (_, i) => ({
    key: i,
    name: `User ${i}`,
    age: 20 + i % 10,
    gender: i % 2 === 0 ? 'male' : 'female',
    status: ['active', 'inactive', 'pending'][i % 3],
  }))
);

// 表格引用
const stkTableRef = ref<StkTable>();

// 使用筛选功能
const { Filter } = useFilter(stkTableRef, {
  onChange: (filterStatus) => {
    console.log('筛选状态变化:', filterStatus.value);
    // 这里可以处理远程筛选逻辑
  },
  filterRemote: false, // 使用本地筛选
});

// 定义列
const columns: StkTableColumn<any>[] = [
  { 
    title: 'Name', 
    dataIndex: 'name',
    width: 150,
    // 在表头自定义单元格中使用筛选组件
    customHeaderCell: (props) => (
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>{props.col.title}</span>
        <Filter 
          column={props.col} 
          dataSource={dataSource.value}
        />
      </div>
    )
  },
  { 
    title: 'Age', 
    dataIndex: 'age',
    width: 100,
    // 使用自定义筛选选项
    customHeaderCell: (props) => (
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>{props.col.title}</span>
        <Filter 
          column={props.col} 
          dataSource={dataSource.value}
          filterOptions={[
            { label: '20-25岁', value: 20 },
            { label: '26-30岁', value: 26 },
            { label: '30岁以上', value: 30 }
          ]}
        />
      </div>
    )
  },
  { 
    title: 'Gender', 
    dataIndex: 'gender',
    width: 100,
    customHeaderCell: (props) => (
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>{props.col.title}</span>
        <Filter 
          column={props.col} 
          dataSource={dataSource.value}
        />
      </div>
    )
  },
  { 
    title: 'Status', 
    dataIndex: 'status',
    width: 100,
    customHeaderCell: (props) => (
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>{props.col.title}</span>
        <Filter 
          column={props.col} 
          dataSource={dataSource.value}
        />
      </div>
    )
  },
];
</script>

<template>
  <div style="padding: 20px;">
    <h3>筛选功能演示</h3>
    <p>点击表头右侧的「筛选」按钮，可以打开筛选下拉列表进行多选筛选。</p>
    
    <StkTable
      ref="stkTableRef"
      style="max-height: 400px"
      :columns="columns"
      :data-source="dataSource"
    ></StkTable>
  </div>
</template>