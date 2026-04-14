# 지연 로딩 구현

매우 큰 데이터셋(예: 수백만 건)을 다룰 때 모든 데이터를 한 번에 렌더링하면 성능 문제가 발생할 수 있습니다. `StkTable`에는 가상 스크롤 최적화 기능이 내장되어 있지만, 모든 데이터를 한 번에 메모리에 로드하면 여전히 많은 리소스를 소비합니다.

테이블의 `scroll` 이벤트를 리스닝하면 현재 표시 영역의 `startIndex`와 `endIndex`를 얻을 수 있어, 필요에 따라 데이터를 로드하는 지연 로딩 솔루션을 구현할 수 있습니다.

## 구현 접근 방식

1. 큰 플레이스홀더 배열을 생성하여 `dataSource`에 전달
2. `scroll` 이벤트를 리스닝하여 `startIndex`와 `endIndex` 획득
3. 스크롤 위치를 기준으로 로드해야 할 데이터 페이지 계산
4. API에서 온디맨드로 데이터를 가져와 해당 위치에 채우기

<demo vue="demos/LazyLoad/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/LazyLoad/index.vue"></demo>

## 구현 세부 사항

### 핵심 로직

```typescript
// 총 데이터가 100,000건, 페이지당 100건이라고 가정
const totalCount = 100000;
const pageSize = 100;

// 플레이스홀더 배열 생성
const tableData = ref<Array<Record<string, any>>>(
  Array(totalCount).fill(null).map((_, i) => ({ id: i + 1, __placeholder: true }))
);

// 스크롤 이벤트 리스닝
function onScroll(ev: Event, data: { startIndex: number; endIndex: number }) {
  const { startIndex, endIndex } = data;
  
  // 로드할 페이지 범위 계산
  const startPage = Math.floor(startIndex / pageSize);
  const endPage = Math.floor(endIndex / pageSize);
  
  // 범위 내의 데이터 페이지 로드
  for (let page = startPage; page <= endPage; page++) {
    loadDataPage(page);
  }
}

// 특정 페이지의 데이터 로드
async function loadDataPage(page: number) {
  // 이미 로드되었는지 확인
  const startIndex = page * pageSize;
  if (!tableData.value[startIndex]?.__placeholder) return;
  
  // API에서 데이터 가져오기
  const response = await fetchData(page, pageSize);
  
  // 해당 위치에 채우기
  response.forEach((item, index) => {
    tableData.value[startIndex + index] = item;
  });
}
```

::: tip 경계 케이스 처리
스크롤 위치가 정확히 두 페이지 사이에 있는 경우(예: `startIndex=95, endIndex=105`), 두 페이지를 동시에 로드해야 합니다(페이지 0과 페이지 1). 이렇게 하면 표시 영역内の 데이터가 완전히 표시됩니다.
:::

::: warning 주의 사항
1. 가상 스크롤이 스크롤 높이를 올바르게 계산할 수 있도록 플레이스홀더 배열을 미리 할당해야 합니다
2. 로드된 데이터는 적절히 캐시하여 중복 요청을 피하세요
3. 사용자 경험을 향상시키기 위해 로딩 상태 표시기를 추가하는 것을 고려하세요
:::
