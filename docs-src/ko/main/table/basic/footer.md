# 푸터 요약 행 <Badge type="tip" text="^0.11.0" />

* `props.footerData` 푸터 요약 행 데이터를 설정합니다.
* `props.footerConfig` 푸터 위치와 동작을 설정합니다.

`footerData`는 배열이며, 각 요소는 한 행의 푸터 데이터를 나타냅니다. 데이터 구조는 `dataSource`와 유사하며, 필드 이름은 열의 dataIndex에 대응합니다.

## 기본 사용법

`props.footerData`를 전달하면 됩니다:
```tsx
<script lang="ts" setup>
const footerData = ref<Data[]>([
    { name: '총계', age: 84, salary: 26000, bonus: 7000, },
]);
</script>
<template>
    <StkTable
        row-key="name"
        :columns="columns"
        :data-source="dataSource"
        :footer-data="footerData" //[!code ++]
    ></StkTable>
</template>
```

<demo vue="basic/footer/Footer.vue"></demo>


## 상단에 고정하기

푸터를 테이블 상단에 고정할 수 있습니다:

```tsx
<StkTable
    :footer-data="footerData"
    :footer-config="{ position: 'top' }" //[!code ++]
></StkTable>
```

<demo vue="basic/footer/FooterTop.vue"></demo>

## 다중 헤더 지원

푸터는 다중 헤더 아래에 올바르게 위치할 수 있습니다:

<demo vue="basic/footer/FooterMultiHeader.vue"></demo>

## API

### FooterConfig

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| position | `'bottom'` \| `'top'` | `'bottom'` | 푸터 고정 위치 |

### FooterData

배열이며, 각 요소는 한 행의 푸터 데이터를 나타냅니다. 데이터 구조는 열 정의와 일치해야 합니다.
