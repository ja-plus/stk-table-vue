# 커스텀 정렬

`StkTableColumn['sorter']`에 커스텀 정렬 규칙을 전달할 수 있습니다. 이는 이미 [정렬 챕터](/ko/main/table/basic/sort#커스텀-정렬)에서 언급되었습니다.

이번 챕터에서는 컴포넌트가 제공하는 내장 정렬 함수를 소개합니다.

## setSorter 메서드
인스턴스는 `setSorter` 메서드를 제공하여 사용자가 직접 정렬을 트리거할 수 있습니다. 예를 들어 외부 버튼을 클릭하여 테이블 정렬을 트리거합니다.

```ts
stkTableRef.value?.setSorter('rate', 'desc');
```
<demo vue="advanced/custom-sort/CustomSort/index.vue"></demo>

### 매개변수 설명

```ts
/**
 * 테이블 헤더 정렬 상태 설정.
 * @param colKey 열 고유 키 필드. 정렬 상태를 취소하려면 `resetSorter` 사용
 * @param order 오름차순/내림차순 'asc'|'desc'|null
 * @param option.sortOption 정렬 매개변수 지정. StkTableColumn의 정렬 관련 필드와 동일. columns에서 find 권장.
 * @param option.sort 정렬 트리거 여부-기본값true
 * @param option.silent 콜백 트리거禁止여부-기본값true
 * @param option.force 정렬 트리거 여부-기본값true
 * @returns 현재 테이블 데이터 반환
 */
function setSorter(
    colKey: string, 
    order: Order,
    option: { 
        sortOption?: SortOption<DT>; 
        force?: boolean; 
        silent?: boolean; 
        sort?: boolean 
    } = {}
): DT[];
```

* `option.force`가 true이면 `props.sortRemote`가 true라도 정렬을 트리거합니다.
* `option.silent`가 true이면 `@sort-change` 콜백을 트리거하지 않습니다.
* `option.sortOption`의 역할은 전달된 `colKey`가 `columns`에 없을 때 정렬 매개변수를 지정할 수 있습니다.某一 열을 숨겼지만 여전히 해당 열 필드로 정렬해야 하는 경우에有用.
    - 가장 높은 우선순위, 이것을 설정하면 `colKey`로 해당 열을 찾아 정렬하지 않습니다.

## 내장 정렬 함수
소스 코드에서导出하는 정렬 함수를 가져와 테이블 내장 정렬 동작에 맞출 수 있습니다.
```ts
import { tableSort, insertToOrderedArray } from 'stk-table-vue';
```

### tableSort 테이블 정렬
#### 사용 시나리오
더 나은 데이터 업데이트 성능을 위해 `props.sortRemote`를 설정하여 테이블 내장 정렬을 취소할 수 있습니다. 데이터 업데이트 시 아래에서 제공하는 `insertToOrderedArray` 함수를 사용하여 새 데이터를 삽입합니다.

테이블 헤더를 클릭하여 정렬을 트리거할 때도 여전히 내장 정렬을 사용하려면 `@sort-change` 콜백에서 이 함수를 사용하여 정렬할 수 있습니다.

#### 코드 예시
```ts
// @sort-change="handleSortChange"
function handleSortChange(col: StkTableColumn<any>, order: Order, data: any[], sortConfig: SortConfig<any>) {
    // 다른 작업 수행 가능
    dataSource.value = tableSort(col, order, data, sortConfig);
}
```

#### 매개변수 설명
```ts
/**
 * 테이블 정렬 분리
 * 컴포넌트 외부에서 테이블 정렬을 직접 구현할 수 있으며, 컴포넌트에서 remote를 설정하여 테이블이 정렬하지 않도록 할 수 있습니다.
 * 사용자가 @sort-change 이벤트에서 table props 'dataSource'를 직접 변경하여 정렬을 완료합니다.
 *
 * sortConfig.defaultSort은 order가 null일 때生效합니다
 * @param sortOption 열 설정
 * @param order 정렬 방식
 * @param dataSource 정렬할 배열
 */
export function tableSort<T extends Record<string, any>>(
    sortOption: SortOption<T>,
    order: Order,
    dataSource: T[],
    sortConfig: SortConfig<T> = {},
): T[] 
```

### insertToOrderedArray 이분 삽입
실시간 데이터가 지속적으로 업데이트되는 시나리오에서 이분 삽입은 정렬 시간을 효과적으로 줄여 성능을 향상시킬 수 있습니다.

#### 코드 예시
```ts
dataSource.value = insertToOrderedArray(tableSortStore, item, dataSource.value);
```

#### 매개변수 설명
```ts
/**
 * 정렬된 배열에 새 데이터 삽입
 *
 * 주의: 원래 배열을 변경하지 않고 새 배열을 반환합니다
 * @param sortState 정렬 상태
 * @param sortState.dataIndex 정렬 필드
 * @param sortState.order 정렬 순서
 * @param sortState.sortType 정렬 방식
 * @param newItem 삽입할 데이터
 * @param targetArray 테이블 데이터
 * @param sortConfig SortConfig참고 https://github.com/ja-plus/stk-table-vue/blob/master/src/StkTable/types/index.ts
 * @param sortConfig.customCompare 커스텀 비교 규칙
 * @return targetArray의浅拷贝
 */
export function insertToOrderedArray<T extends object>(
    sortState: SortState<T>,
    newItem: T,
    targetArray: T[],
    sortConfig: SortConfig<T> & { customCompare?: (a: T, b: T) => number } = {}
): T[] 

```

### 예시
다음 예시는 `tableSort`와 `insertToOrderedArray`의 사용을 포함합니다. 삽입 버튼을 클릭하여 삽입 정렬 효과를 관찰합니다.

<demo vue="advanced/custom-sort/InsertSort.vue"></demo>
