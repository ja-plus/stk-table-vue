# 열 너비 조정

## 설정
* `props.colResizable`를 설정하면 열 너비 조정이 활성화됩니다.
* `props.columns`를 `v-model`修飾符로 변경해야 하며, 열 너비가 수정되면 직접 `StkTableColumn['width']` 값이 변경됩니다.
* `columns`는 반응형을 지원하려면 `ref`로 감싸야 합니다.

```js
<StkTable
    col-resizable // [!code ++]
    :columns="columns" // [!code --]
    v-model:columns="columns" // [!code ++]
></StkTable>
```

::: warning
열 너비 조정을 활성화하면, 열 너비가 기본적으로 컨테이너를 채우지 않습니다.
:::

<demo vue="advanced/column-resize/ColResizable.vue"></demo>


## 이벤트를 통해 열 너비 변경
```ts
/**
 * 열 너비 변경 시 트리거
 *
 *  ```(col: StkTableColumn<DT>)```
 */
(e: 'col-resize', col: StkTableColumn<DT>): void;
```

이렇게 하면 `columns` 앞에 `v-model`修飾符를 추가할 필요 없이,手動更新 `StkTableColumn['width']` 값만 하면 됩니다.

## 열 너비 컨테이너 채우기 hack 방식
열 너비가 컨테이너를 채우길 원하시면 CSS로 `.stk-table-main`을 `flex: 1`로 설정하면 테이블이 컨테이너를 채웁니다.

그런 다음某一 열의 `width`를 `minWidth`로替换하면 이 열이 자동으로 나머지 너비를 차지하고, 다른 열은 여전히 설정된 너비가 됩니다.

`props.colResizable.disabled`로最后一열의 드래그 열 너비 조정을禁用합니다.

아래 demo은 마지막 열의 minWidth를 설정했습니다.
<demo vue="advanced/column-resize/ColResizableFullHack.vue"></demo>


## API
### props.colResizable:
| type | 설명 |
| --- | --- | 
| boolean | 열 너비 조정 활성화 여부  |
| ColResizableConfig | 설정 |

### ColResizableConfig
| 속성 | 타입 | 기본값| 설명 |
| --- | --- | ---- | --- |
| disabled | `(col:StkTableColumn) => boolean` | -- | 열 너비 조정 활성화 여부 |
