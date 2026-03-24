# 정렬


## 기본 정렬
열 설정에서 `StkTableColumn['sorter']`를 `true`로 설정하면 정렬이 활성화됩니다.

테이블 헤더를 클릭하면 정렬이 트리거됩니다.
<demo vue="basic/sort/Sort.vue"></demo>

## 커스텀 정렬
열 설정에서 `StkTableColumn['sorter']`를 함수로 설정할 수 있습니다.

`sorter(data, { column, order })`를 통해 커스텀 정렬 규칙을 정의합니다.

이 함수는 정렬 시에 트리거되며, 테이블은 함수의 **반환값**을 사용하여 표시합니다.

| 매개변수 | 타입 | 설명 |
| ---- | ---- | ---- |
| data| DataType[] | 테이블의 데이터. |
| column | StkTableColumn | 현재 정렬 중인 열. |
| order | `'desc'` \| `'asc'` \| `null` | 현재 정렬 순서. |

다음 표에서 `Rate` 열 필드의 커스텀 크기 정렬 규칙을 정의합니다.
<demo vue="basic/sort/CustomSort.vue"></demo>

더 많은 정렬 사용법은 [커스텀 정렬](/ko/main/table/advanced/custom-sort)을 참고하세요.

## sortField 정렬 필드
일부 필드는 독립적인 필드로 정렬될 수 있습니다, 예를 들어 년, 월, 일 필드의 경우.此时可以使用一个排序专用字段，将年、月都转换为最小单位日，便于排序，此时通过 `sortField` 指定该排序字段。

다음 표에서 `period` 열은 `periodNumber`를 정렬 필드로 지정했습니다.
<demo vue="basic/sort/SortField.vue"></demo>

## 빈 필드 정렬 제외
`props.sortConfig.emptyToBottom`를 설정하면 빈 필드가 항상 리스트 하단에 배치됩니다
```vue
<StkTable :sort-config="{emptyToBottom: true}"></StkTable>
```
<demo vue="basic/sort/SortEmptyValue.vue"></demo>

## 기본 정렬 열 지정
`props.sortConfig.defaultSort`를 설정하여 기본 정렬을 제어합니다.
::: warning
기본 정렬을 설정하면, **정렬되지 않은 경우** **기본 정렬** 필드가 정렬됩니다.

아래 표의 `이름` 열을 클릭하여 정렬 동작을 관찰하세요.
:::
<demo vue="basic/sort/DefaultSort.vue"></demo>

## localCompare를 사용한 문자열 정렬
`props.sortConfig.stringLocaleCompare = true`를 설정하면 [`String.prototype.localeCompare`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)를 사용하여 문자열을 정렬합니다.

작용: 중국어는 병음 첫 글자순으로 정렬됩니다.

##服务端정렬

`props.sort-remote`를 `true`로 설정하면 컴포넌트 내부의 정렬 로직이 트리거되지 않습니다.

테이블 헤더를 클릭하면 `@sort-change` 이벤트가 트리거되며, 이벤트에서 ajax 요청을发起하여 `props.dataSource`를 다시 할당하여 정렬을 완료할 수 있습니다.

```vue
<StkTable sort-remote></StkTable>
```
<demo vue="basic/sort/SortRemote.vue"></demo>

## 트리 노드 깊이 정렬
`props.sortConfig.sortChildren = true`를 설정하면 테이블 헤더를 클릭하여 정렬할 때 `children` 하위 노드도 정렬됩니다.

<demo vue="basic/sort/SortChildren.vue"></demo>

## 다중 열 정렬 <Badge type="tip" text="^0.11.2" />

`props.sortConfig.multiSort = true`를 설정하면 다중 열 정렬 모드가 활성화됩니다.

다중 열 정렬 모드에서:
- 다른 열을 클릭하면 여러 정렬 조건이 동시에 유지됩니다
- 먼저 클릭한 열이 더 높은 우선순위를 가집니다 (정렬 시 해당 열 먼저 정렬)
- 동일한 열을 다시 클릭하면 정렬 방향이 전환됩니다 (desc → asc → null)
- 세 번째 클릭하면 해당 열 정렬이 취소됩니다
- `props.sortConfig.multiSortLimit`으로 최대 정렬 열 수를 제한할 수 있습니다 (기본값 3)

<demo vue="basic/sort/MultiSort.vue"></demo>

## API
### StkTableColumn 열 설정

`StkTableColumn` 열 설정에서 정렬 관련 매개변수.

```ts
const columns: StkTableColumn[] = [{
    sorter: true,
    sortField: 'xxx',
    sortType: 'number',
    sortConfig: Omit<SortConfig<T>, 'defaultSort'>;
}]
```

| 매개변수 | 타입 | 기본값 | 설명 |
| ---- | ---- | ---- | ---- |
| sorter | `boolean` \| `((data: T[], option: { order: Order; column: any }) => T[])` | `false` | 정렬 활성화 여부를 지정합니다. `true`이면 기본 정렬이 활성화됩니다; 함수이면 커스텀 정렬 규칙을 사용합니다. |
| sortField | `string` | `dataIndex`와 동일 | 정렬 필드를 지정합니다. 표시 필드와 다른 데이터로 정렬해야 할 때 사용합니다. |
| sortType | `'string'` \| `'number'` | 자동 감지 | 정렬 타입을 지정합니다. 기본적으로 해당 열 첫 번째 행의 데이터 타입을 자동 감지합니다. |
| sortConfig | `Omit<SortConfig<T>, 'defaultSort'>` | - | 현재 열의 정렬 규칙을 설정하며, 전역 `props.sortConfig`보다 우선순위가 높습니다. |

### props.sortConfig

전역 정렬 설정.

```ts
type SortConfig<T extends Record<string, any>> = {
    /**
     * 기본 정렬 (1.초기화 시 트리거 2.정렬 방향이 null일 때 트리거)
     * onMounted 시 setSorter를 호출하면 테이블 헤더를 클릭한 것과类似的行为
     */
    defaultSort?: {
        /** 열 고유 키. props.colKey를 설정했으면 여기서는 열 고유 키 값을 나타냅니다 */
        key?: StkTableColumn<T>['key'];
        /** 정렬 필드 */
        dataIndex: StkTableColumn<T>['dataIndex'];
        /** 정렬 방향 */
        order: Order;
        /** 정렬 필드 지정 */
        sortField?: StkTableColumn<T>['sortField'];
        /** 정렬 타입 */
        sortType?: StkTableColumn<T>['sortType'];
        /** 커스텀 정렬 함수 */
        sorter?: StkTableColumn<T>['sorter'];
        /** sort-change 이벤트 트리거禁止여부, 기본값 false */
        silent?: boolean;
    };
    /** 빈 값은 항상 리스트 하단에 배치 */
    emptyToBottom?: boolean;
    /** 문자열 정렬에 String.prototype.localeCompare 사용, 기본값 false */
    stringLocaleCompare?: boolean;
    /** 하위 노드도 정렬할지 여부, 기본값 false */
    sortChildren?: boolean;
    /** 다중 열 정렬 활성화 여부, 기본값 false */
    multiSort?: boolean;
    /** 다중 열 정렬 시 최대 열 수 제한, 기본값 3 */
    multiSortLimit?: number;
};
```

| 매개변수 | 타입 | 기본값 | 설명 |
| ---- | ---- | ---- | ---- |
| defaultSort | `object` | - | 기본 정렬 설정. 초기화 시와 정렬 방향이 null일 때 트리거됩니다. |
| defaultSort.key | `string` | - | 열 고유 키. |
| defaultSort.dataIndex | `string` | - | 정렬 필드, **필수**. |
| defaultSort.order | `Order` | - | 정렬 방향: `'asc'` \| `'desc'` \| `null`, **필수**. |
| defaultSort.silent | `boolean` | `false` | `sort-change` 이벤트 트리거禁止여부. |
| emptyToBottom | `boolean` | `false` | 빈 값이 항상 리스트 하단에 배치되는지 여부. |
| stringLocaleCompare | `boolean` | `false` | `localeCompare`를 사용하여 문자열 정렬 여부 (중국어 병음 정렬). |
| sortChildren | `boolean` | `false` | 트리 데이터에서 하위 노드도 정렬할지 여부. |
| multiSort | `boolean` | `false` | 다중 열 정렬 모드를 활성화할지 여부. |
| multiSortLimit | `number` | `3` | 다중 열 정렬 시 최대 열 수 제한. |

### @sort-change
defineEmits 타입:
```ts
/**
 * 정렬 변경 시 트리거. defaultSort.dataIndex를 찾을 수 없으면 col은 null을 반환합니다.
 *
 * ```(col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>)```
 */
(
    e: 'sort-change',
    /** 정렬 중인 열 */
    col: StkTableColumn<DT> | null, 
    /** 오름차순/내림차순 */
    order: Order,
    /** 정렬 후 값 */
    data: DT[], 
    sortConfig: SortConfig<DT>
): void;

```

### Expose
```ts
defineExpose({
    /**
     * 테이블 헤더 정렬 상태 설정
     */
    setSorter,
    /**
     * sorter 상태 초기화
     */
    resetSorter,
    /**
     * 테이블 정렬 열 순서
     */
    getSortColumns,
    /**
     * 다중 열 정렬 상태 배열 (다중 열 정렬 모드 시 사용)
     */
    sortStates,
})
```
세부 사항은 [Expose 인스턴스 메서드](/ko/main/api/expose)를 참고하세요.
