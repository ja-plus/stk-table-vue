# 커스텀 셀

* `StkTableColumn['customCell']`를 통해 **테이블 본문** 셀 콘텐츠를 커스텀할 수 있습니다.
* `StkTableColumn['customHeaderCell']`를 통해 **테이블 헤더** 셀 콘텐츠를 커스텀할 수 있습니다.

`customCell`과 `customHeaderCell`의 사용 방식은 기본적으로 동일하며, 아래에서는 `customCell`을 예제로 설명합니다.

::: warning 권장
* `customCell`에는 외부 요소(div, span 등)로 감싸는 것을 권장합니다. 그렇지 않으면 &lt;td&gt; 하위 노드가 `TextNode`여서 레이아웃 문제가 발생할 수 있습니다.
* `customCell`의 루트 요소에는 **신중하게** `inline`/`inline-block`/`inline-flex` 등의 인라인 요소를 설정하지 마세요. 이 레이아웃은 **가상 리스트**에서 행 높이를撑开할 수 있습니다.
:::

### vue SFC를 사용하여
vue SFC 컴포넌트를 전달하는 것을 지원하며, vue 컴포넌트의 props는 `CustomCellProps` 타입으로 특별히 정의해야 합니다.

::: tip 모범 사례
columns를 별도의 파일에 작성하여 내보내서 사용하세요.
:::

::: code-group
```ts [column.ts]
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
import type { DataType } from './types';
import YieldCell from './YieldCell.vue';
export const columns: StkTableColumn<DataType> = [{
    title: '수익률',
    dataIndex: 'yield',
    customCell: YieldCell
}]
```
```vue [YieldCell.vue]
<script lang="ts" setup>
import { computed } from 'vue';
import { DataType } from './types';
import { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

const props = defineProps<CustomCellProps<DataType>>();
const className = computed(() => {
    let name = '';
    if (props.cellValue > 0) {
        name = 'color-up';
    } else if (props.cellValue < 0) {
        name = 'color-down';
    }
    return name;
});
</script>
<template>
    <span :class="className">{{ props.cellValue > 0 ? '+' : '' }}{{ (props.cellValue * 100).toFixed(4) }}%</span>
</template>
<style>
.color-up {
    color: #2fc87b;
}
.color-down {
    color: #ff2b48;
}
</style>
```
```ts [types.ts]
export type DataType = {
    name: string;
    yield: number;
};

```
:::

<demo vue="advanced/custom-cell/CustomCell/index.vue"></demo>

### 렌더링 함수 h를 사용하여
간단한 수정은 직접 렌더링 함수를 사용하는 것이 더 편리합니다.

예를 들어 수치에 **100을 곱하고** **단위**를 추가합니다.
```ts
import { h } from 'vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
const columns: StkTableColumn<any>[] = [
    {
        title: '수익률',
        dataIndex: 'yield',
        customCell: ({ cellValue }) => h('span', cellValue * 100 + '%'),
    },
]
```

### jsx를 사용하여
jsx를 사용하려면 jsx 환경을 설치해야 합니다.

| 빌드 도구 | 플러그인 |
|---|---|
| vite | @vitejs/plugin-vue-jsx |
| webpack + babel | @vue/babel-plugin-jsx |
| webpack + swc | swc-plugin-vue-jsx |
| rspack | swc-plugin-vue-jsx |

```tsx
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

const columns:StkTableColumn<any>[] = [
    {
        title: '이름',
        dataIndex: 'name',
        customCell: ({ row, col, cellValue }) => {
            return <span style="color: red">{cellValue}</span>;
        },
    },
]
```




## API
| 속성 | props | 기본값 | 설명 |
|---|---|---|---|
| customCell | (props: CustomCellProps) => VNode | - | 커스텀 셀 렌더링 함수 |
| customHeaderCell | (props: CustomHeaderCellProps) => VNode | - | 커스텀 테이블 헤더 렌더링 함수 |

### types
customCell props 타입
```ts
export type CustomCellProps<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    /** row[col.dataIndex]의 값 */
    cellValue: any;
    rowIndex: number;
    /** 
     * 열 인덱스(0부터 시작).
     * 
     * 주의:
     * virtual-x에서, 그렇지 않으면 가상 리스트 내의 열 인덱스를 나타냅니다
     */
    colIndex: number;
    /**
     * 현재 행이 전개되었는지 여부
     * - 미전개: null
     * - 전개됨: 열 설정 반환
     */
    expanded?: StkTableColumn<any>;
    /** 트리 노드 현재 행이 전개되었는지 여부 */
    treeExpanded?: boolean;
};

export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    /** 
     * 열 인덱스(0부터 시작).
     * 
     * 주의:
     * virtual-x에서, 그렇지 않으면 가상 리스트 내의 열 인덱스를 나타냅니다
     */
    colIndex: number;
};
