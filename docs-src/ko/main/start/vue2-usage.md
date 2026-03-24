# Vue 2에서 사용하기

## Vue 2.7 + TypeScript 환경에서 stk-table-vue 사용

이 프로젝트는 Vue SFC + TS 소스 코드 구조를 채택했습니다. Vue 2.7 이상에서는 Composition API를 지원하므로 `stk-table-vue`를 직접 사용할 수 있습니다.

## 설치

```sh
$ npm install stk-table-vue
```

## 설정

### 1. TypeScript 설정 (tsconfig.json)

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "moduleResolution": "bundler",
    "types": ["vite/client"]
  }
}
```

### 2. Vite 설정 (vite.config.ts)

```ts
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
    ],
    optimizeDeps: {
        include: ['stk-table-vue'],
    },
});
```

### 3. main.ts에서 스타일 가져오기

```ts
import { createApp } from 'vue';
import App from './App.vue';
import 'stk-table-vue/lib/style.css';

const app = createApp(App);
app.mount('#app');
```

## 사용 예시

```vue
<template>
  <StkTable
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable, StkTableColumn } from 'stk-table-vue';

type DataType = {
  id: number;
  name: string;
  age: number;
};

const columns: StkTableColumn<DataType>[] = [
  { title: '이름', dataIndex: 'name', key: 'name' },
  { title: '나이', dataIndex: 'age', key: 'age' },
];

const dataSource: DataType[] = [
  { id: 1, name: '김철수', age: 18 },
  { id: 2, name: '이영희', age: 19 },
];
</script>
```

## 참고 사항

- Vue 2에서는 `useTemplateRef`를 사용할 수 없으므로 `ref`를 사용하여 테이블 참조를 가져와야 합니다.
- 일부 Vue 3 전용 기능 (예: `<script setup>`의 일부 기능)은 Vue 2에서 작동하지 않을 수 있습니다.
- 호환성 문제가 발생하면 [이슈](https://github.com/ja-plus/stk-table-vue/issues)를 작성해 주세요.
