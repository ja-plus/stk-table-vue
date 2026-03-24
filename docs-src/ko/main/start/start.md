# 빠른 시작

## 온라인 에디터에서 시도하기

[<span style="font-size: 16px;font-weight: bold;">온라인 편집 예시</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## npm 설치

```sh
$ npm install stk-table-vue
```

## 가져오기

main
```ts
import 'stk-table-vue/lib/style.css';
```

vue SFC를 사용하는 경우 가져오기 (ts 인식에有利)
```vue
<script lang="ts" setup>
import { StkTable } from 'stk-table-vue';
</script>
<template>
    <StkTable></StkTable>
</template>
```

## 간단한 데모
```vue
<script lang="ts" setup>
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import StkTable from '../StkTable.vue';
import { StkTableColumn } from '../../src/StkTable/index';

const stkTableRef = useTemplateRef('stkTableRef'); // vue3.5+
// const stkTableRef = ref<InstanceType<typeof StkTable>>(); //vue3.2

type DataType = {
    id: string;
    name: string;
    age: number;
};
const columns: StkTableColumn<DataType>[] = [
    { title: '이름', dataIndex: 'name', key: 'name' },
    { title: '나이', dataIndex: 'age', key: 'age' },
];
const dataSource: DataType[] = [
    { id: 'k1', name: '김철수', age: 18 },
    { id: 'k2', name: '이영희', age: 19 },
    { id: 'k3', name: '박민수', age: 20 },
];
let interval = 0;
onMounted(() => {
    // 지정한 id의 행 강조
    interval = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimRow(['k1']);
    }, 2000);
});

onBeforeUnmount(() => {
    window.clearInterval(interval);
});
</script>
<template>
    <StkTable ref="stkTableRef" row-key="id" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```

실행 결과
<demo vue="start/Start.vue"></demo>
