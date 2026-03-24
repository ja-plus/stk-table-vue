# 실험적 기능

이것은 실험적 기능이며 향후 버전에서 변경될 수 있습니다.

## experimental.scrollY <Badge type="tip" text="^0.10.0" />

Transform 기반 세로 스크롤 시뮬레이션.

브라우저 DOM 요소 높이 제한으로 인해 매우 큰 데이터셋을 표시할 때 문제가 발생할 수 있습니다. transform을 사용하여 스크롤을 시뮬레이션하면 이 문제가 해결됩니다.

### 사용 방법

```js
<template>
  <StkTable
    virtual
    scroll-row-by-row
    :experimental="{ scrollY: true }" //[!code ++]
    :data-source="dataSource"
    :columns="columns"
  />
</template>
```
