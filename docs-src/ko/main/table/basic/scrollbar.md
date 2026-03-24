# 스크롤바

`scrollbar` 속성을 사용하여 스크롤바를 커스터마이징할 수 있습니다.

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable } from 'stk-table-vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

type Data = {
    name: string;
    age: number;
    address: string;
};

const columns: StkTableColumn<Data>[] = [
    { type: 'seq', title: 'No.', width: 50 },
    { title: '이름', dataIndex: 'name', width: 150 },
    { title: '나이', dataIndex: 'age', width: 150 },
    { title: '주소', dataIndex: 'address', width: 300 },
];

const dataSource = ref<Data[]>([
    { name: '김철수', age: 18, address: '서울특별시 강남구' },
    { name: '이영희', age: 20, address: '부산광역시 해운대구' },
    { name: '박민수', age: 22, address: '인천광역시 남동구' },
    { name: '최지우', age: 24, address: '대구광역시 수성구' },
]);
</script>
<template>
    <StkTable 
        :scrollbar="{ width: 10, height: 10 }"
        style="height: 200px; width: 400px" 
        row-key="name" 
        :columns="columns" 
        :data-source="dataSource"
    ></StkTable>
</template>
```
