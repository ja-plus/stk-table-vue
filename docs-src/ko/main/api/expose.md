# Expose 인스턴스 메서드
## API
### initVirtualScroll
가상 리스트 가시 영역의 행 수와 열 수를 초기화합니다. `initVirtualScrollX`와 `initVirtualScrollY`를 동시에 호출하는 것과 동일합니다.

테이블의 `props.autoResize`는 기본값이 `true`이므로, 크기 변경 시 이 함수가 자동으로 호출됩니다.

사용자가 수동으로 크기 조절 시, 마우스 업 이벤트 후 이 함수를 호출하여 가상 리스트 가시 영역을 다시 계산할 수 있습니다.

매개변수 height를 전달하지 않으면 테이블 컨테이너 높이가 기본값으로 사용됩니다. 더 많은 행을 렌더링하려면 컨테이너 높이를 가져온 후 몇 행 높이를 더하면 됩니다.


```ts
/**
 * 가상 스크롤 매개변수 초기화
 * @param {number} [height] 가상 스크롤 높이
 */
initVirtualScroll(height?: number)
```

### initVirtualScrollX
가로 방향 가상 스크롤 열 수를 초기화합니다.

```ts
/**
 * 가로 방향 가상 스크롤 매개변수 초기화
 */
initVirtualScrollX()
```

### initVirtualScrollY
세로 방향 가상 스크롤 행 수를 초기화합니다.

```ts
/**
 * 세로 방향 가상 스크롤 매개변수 초기화
 * @param {number} [height] 가상 스크롤 높이
 */
initVirtualScrollY(height?: number)
```

### clearMergeCellsCache
`mergeCells` 결과 캐시를 비우고 병합 결과 재계산을 강제합니다.

병합 결과 캐시는 `dataSource` / `columns`가 변경될 때만 자동으로 비워집니다. 행 필드를 **제자리에서 수정**한 경우(행 객체 참조가 변하지 않은 경우, 예: 반응형 행 객체를 직접 수정)이고 `mergeCells`의 반환값이 해당 필드에 의존한다면, 수정 후 이 메서드를 호출해야 합니다. 그렇지 않으면 rowspan/colspan은 여전히 오래된 캐시 결과를 사용합니다.

```ts
/**
 * mergeCells 결과 캐시를 비우고 병합 결과 재계산을 강제합니다
 */
clearMergeCellsCache()
```

```ts
// 행 필드를 제자리에서 수정한 후 병합 캐시를 수동으로 무효화
row.rowspan = { continent: 3 };
nextTick(() => {
    tableRef.value.clearMergeCellsCache();
});
```

::: tip
`dataSource`를 교체하는 방식(새 배열 전달)으로 데이터를 갱신하는 경우 캐시가 자동으로 비워지므로 이 메서드를 호출할 필요가 없습니다.
:::

### setCurrentRow
현재 선택된 행을 설정합니다.

```ts
/**
 * 한 행 선택
 * @param {string} rowKeyOrRow 선택된 rowKey, undefined는 선택 취소
 * @param {boolean} option.silent true로 설정하면 `@current-change` 트리거 안함. 기본값:false
 * @param {boolean} option.deep true로 설정하면 하위 행 재귀적으로 선택. 기본값:false
 */
function setCurrentRow(rowKeyOrRow: string | undefined | DT, option = { silent: false, deep: false })
```

### setSelectedCell
현재 선택된 셀을 설정합니다 (props.cellActive=true 시生效).

```ts
/**
 * 현재 선택된 셀 설정 (props.cellActive=true)
 * @param row  강조 셀 설정, undefined는 선택 취소
 * @param col 열 객체
 * @param option.silent true로 설정하면 `@current-change` 트리거 안함. 기본값:false
 */
function setSelectedCell(row?: DT, col?: StkTableColumn<DT>, option = { silent: false })
```

### setHighlightDimCell

강조 흐림 셀을 설정합니다.

```ts
/**
 * 하나의 셀 강조. 가상 스크롤 강조 상태 기억은 아직 미지원.
 * @param rowKeyValue 행의 키
 * @param colKeyValue 열 키
 * @param options.method css-css 렌더링 사용, animation-animation API 사용. 기본값 animation;
 * @param option.className 커스텀 CSS 애니메이션 클래스.
 * @param option.keyframe 커스텀 키프레임 설정 시 highlightConfig.fps는失效됩니다. Keyframe: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration 애니메이션 시간. method='css' 상태에서 class 제거용, className 전달 시 커스텀 애니메이션 시간과 일치해야 합니다.
 */
function setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {})
```

### setHighlightDimRow
강조 흐림 행을 설정합니다.

```ts
/**
 * 한 행 강조
 * @param rowKeyValues 행 고유 키 배열
 * @param option.method css-css 렌더링 사용, animation-animation API 사용, js-js 색상 계산. 기본값 animation
 * @param option.className 커스텀 CSS 애니메이션 클래스.
 * @param option.keyframe 커스텀 키프레임 설정 시 highlightConfig.fps는失效됩니다. Keyframe: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration 애니메이션 시간. method='css' 상태에서 class 제거용, className 전달 시 커스텀 애니메이션 시간과 일치해야 합니다.
 */
function setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {})
```

### sortCol
테이블 정렬 열 dataIndex

### sortStates
다중 열 정렬 상태 배열.

```ts
/**
 * 정렬 상태 배열
 * @see SortState[]
 */
sortStates: SortState[];
```

### getSortColumns
정렬 열 정보 가져오기 `{key:string,order:Order}[]`

### setSorter
```ts
/**
 * 헤더 정렬 상태 설정.
 * @param colKey 열 고유 키 필드. 정렬 상태를 취소하려면 `resetSorter` 사용
 * @param order 오름차순 내림차순 'asc'|'desc'|null
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

* `option.force`가 true이면 `props.sortRemote`가 true라도 정렬 트리거.
* `option.silent`가 true이면 `@sort-change` 콜백 트리거 안함.
* `option.sortOption`의 역할은 전달된 `colKey`가 `columns`에 없을 때 정렬 매개변수를 지정할 수 있습니다.某一 열을 숨겼지만 여전히 해당 열 필드로 정렬해야 하는 경우에有用.
    - 가장 높은 우선순위, 이것을 설정하면 `colKey`로 해당 열을 찾아 정렬하지 않습니다.

### resetSorter
정렬 상태 초기화

### scrollTo
지정 위치로 스크롤. 숫자 오버로드(하위 호환)와 options 오버로드(행/열 지정 지원) 두 가지 호출 형태를 지원.

```ts
/**
 * 스크롤바 위치 설정
 * - 숫자 오버로드: top/left는 픽셀 좌표, null은 해당 축 변경 안 함, 생략 시 기본값 0
 * - options 오버로드: 각 축에 픽셀 숫자 또는 { index, key, px } 타겟 지정 가능, 생략한 축은 위치 변경 안 함
 */
function scrollTo(top?: number | null, left?: number | null): void;
function scrollTo(options: ScrollToOptions): void;

interface ScrollToOptions {
    /** 세로 방향 타겟: 픽셀 좌표 또는 행 타겟 */
    top?: number | ScrollAxisTarget;
    /** 가로 방향 타겟: 픽셀 좌표 또는 열 타겟 */
    left?: number | ScrollAxisTarget;
    /** 스크롤 동작, 네이티브 ScrollToOptions.behavior와 동일, 기본값 'auto'(즉시 이동) */
    behavior?: ScrollBehavior;
}

interface ScrollAxisTarget {
    /** 타겟 인덱스(0부터 시작), key와 함께 지정 시 index 우선 */
    index?: number;
    /** 타겟 키: top 축은 rowKey에 해당하는 행 키, left 축은 열의 dataIndex */
    key?: string | number;
    /** 기준 오프셋에 추가하는 픽셀 오프셋, 음수 가능. px만 전달 시 기준은 0 */
    px?: number;
}
```

* 인덱스 공간: `top` 축의 `index`는 현재 표시 순서(정렬/필터/트리 확장 후)의 행 인덱스, `left` 축의 `index`는 리프 열(최심층 헤더) 인덱스.
* 타겟을 해석할 수 없는 경우(index 범위 초과 / key 없음) 해당 축은 조용히 건너뛰며 위치가 변경되지 않음.
* `behavior: 'smooth'` 지정 시 애니메이션으로 스크롤. 애니메이션 중 새로운 `scrollTo` 호출은 이전 애니메이션을 취소하며, 휠/터치 조작으로도 취소됨.

::: tip
두 오버로드의 「생략」 의미가 다름:
* options 오버로드: 생략한 축은 현재 위치 **유지**, `scrollTo({})`는 아무 스크롤도 하지 않음;
* 숫자 오버로드: 생략한 인수는 기본값 **0**, `scrollTo()`는 왼쪽 위 모서리로 스크롤.
:::

```js
// 숫자 오버로드(하위 호환)
stkTableRef.value.scrollTo(100, 200);
stkTableRef.value.scrollTo(null, 200); // 가로 방향만 변경

// options 오버로드: 픽셀 좌표
stkTableRef.value.scrollTo({ top: 100, left: 200 });

// 5번째 행으로 스크롤(0부터 시작)
stkTableRef.value.scrollTo({ top: { index: 5 } });

// rowKey가 'row-42'인 행으로 스크롤
stkTableRef.value.scrollTo({ top: { key: 'row-42' } });

// 5번째 행 + 10px 오프셋으로 스크롤
stkTableRef.value.scrollTo({ top: { index: 5, px: 10 } });

// 행열 동시 지정, 부드럽게 스크롤(열은 dataIndex으로 지정)
stkTableRef.value.scrollTo({ top: { index: 5 }, left: { key: 'name' }, behavior: 'smooth' });
```

### getTableData
테이블 데이터 가져오기, 현재 테이블 정렬 순서의 배열 반환

### getRowIndex
rowKey를 기반으로 행 인덱스 가져오기

```ts
/**
 * 행 인덱스 가져오기
 * @param row rowKey 또는 행 데이터
 * @returns 행 인덱스, 찾지 못하면 -1 반환
 */
function getRowIndex(row: UniqKey | DT): number
```

### getColumnIndex
colKey를 기반으로 열 인덱스 가져오기

```ts
/**
 * 열 인덱스 가져오기
 * @param col colKey 또는 열 객체
 * @returns 열 인덱스, 찾지 못하면 -1 반환
 */
function getColumnIndex(col: string | StkTableColumn<DT>): number
```

### setRowExpand
확장 행 설정

```ts
/**
 *
 * @param rowKeyOrRow rowKey or row
 * @param expand 확장 여부
 * @param data { col?: StkTableColumn<DT> }
 * @param data.silent true 설정 시 `@toggle-row-expand` 트리거 안함. 기본값:false
 */
function setRowExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: { col?: StkTableColumn<DT>; silent?: boolean })
```

### setAutoHeight
가변 행 높이 가상 리스트에서, 지정 행의 auto-row-height 저장 높이를 설정. 행 높이가 변경되면 이 메서드를 호출하여 행 높이 지우기 또는 변경 가능
```ts
function setAutoHeight(rowKey: UniqKey, height?: number | null)
```

::: tip 타이밍 의미
즉시 반영됩니다: 설정한 행 높이는 즉시 스크롤 위치 판정과 콘텐츠 전체 높이(scrollHeight) 계산에 참여하며, 다음 렌더링 실측을 기다릴 필요가 없습니다. 행 키가 현재 데이터에 없으면 높이만 저장되며, 현재 위치 판정과 전체 높이에는 영향을 주지 않습니다.
:::

### clearAllAutoHeight
모든 auto-row-height 저장 높이 지우기. 지운 후 행 높이는 추정값(`expectedHeight` / `rowHeight`)으로 돌아가며, 콘텐츠 전체 높이도 그에 따라 재계산됩니다.

### setTreeExpand
트리 구조 확장 행 설정
```ts
/**
 * @param row rowKey / row / 또는 그들의 배열
 * @param option.expand 확장 여부, 미지정 시 현재 상태에 따라 토글
 * @param option.all 모든 하위 노드를 확장할지 여부, 기본값 false
 * @param option.level n번째 레벨까지 확장
 * @param option.parents 전달된 row를 대상 자식 노드로 간주하여 그 모든 부모 노드를 확장/축소한다. 확장 시 대상 행 자체가 자식 노드를 가지면 함께 확장된다. 단일 rowKey / row만 지원
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean; all?: boolean; level?: number; parents?: boolean })
```
::: tip
`option.parents`가 `true`이면 깊은 자식 노드의 rowKey를 전달하는 것만으로 그 모든 부모 노드가 자동으로 확장되어 해당 행이 표시되며, 해당 행 자체가 자식 노드를 가지면 함께 확장됩니다(행 위치 지정 등). 필터에 의해 어떤 부모 노드가 제외된 경우, 확장은 거기서 중단됩니다.
:::

- `option.all` <Badge type="tip" text="^1.0.4" />
- `option.level` <Badge type="tip" text="^1.0.4" />
- `option.parents` <Badge type="tip" text="^1.1.0" />

### getSelectedArea
선택된 셀 정보 가져오기

```ts
function getSelectedArea(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    ranges: AreaSelectionRange[]
}
```

### setAreaSelection
드래그 선택 영역 설정

```ts
/**
 * 드래그 선택 영역 설정
 * @param ranges 선택 영역 배열
 * @param option.silent true 설정 시 `@select-area-change` 트리거 안함. 기본값:false
 * @param option.scrollToView true 설정 시 선택 영역으로 자동 스크롤. 기본값:false
 */
function setAreaSelection(ranges: AreaSelectionRange[], option?: { silent?: boolean; scrollToView?: boolean })
```

### clearSelectedArea
선택된 셀 지우기

### copySelectedArea
선택 영역 내용을 클립보드에 복사. 복사된 텍스트 내용 반환 (TSV 형식).

```ts
function copySelectedArea(): string
```

### setFilter(Beta)
필터 상태 설정(Beta). 설정 후 `filter-change` 이벤트가 트리거됩니다.

```ts
/**
 * 필터 상태 설정
 * @param status 필터 상태 객체, null 전달 시 모든 필터 해제
 * @param option.remote true 설정 시 자동 데이터 필터링을 건너뜁니다. 원격 필터링에 적합
 * @param option.silent true 설정 시 `filter-change` 이벤트를 트리거하지 않습니다, 기본값 false
 */
function setFilter(status: Record<UniqKey, FilterStatus> | null, option?: { remote?: boolean; silent?: boolean })
```

