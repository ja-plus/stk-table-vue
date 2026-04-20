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
 * @param option.keyframe 커스텀 키프레임 설정 시 highlightConfig.fps는失效됩니다. Keyframe: https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats 
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
 * @param option.keyframe 커스텀 키프레임 설정 시 highlightConfig.fps는失效됩니다. Keyframe: https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration 애니메이션 시간. method='css' 상태에서 class 제거용, className 전달 시 커스텀 애니메이션 시간과 일치해야 합니다.
 */
function setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {})
```

### sortCol
테이블 정렬 열 dataIndex

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
지정 위치로 스크롤

```ts
/**
 * 스크롤바 위치 설정
 * @param top null 설정 시 위치 변경 안함 
 * @param left null 설정 시 위치 변경 안함
 */
function scrollTo(top: number | null = 0, left: number | null = 0) 
```

### getTableData
테이블 데이터 가져오기, 현재 테이블 정렬 순서의 배열 반환

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

### clearAllAutoHeight
모든 auto-row-height 저장 높이 지우기

### setTreeExpand
트리 구조 확장 행 설정
```ts
/**
 * @param row rowKey or row or row
 * @param option.expand 전달 안 하면 현재 상태 반전
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean })
```

### getSelectedArea 
선택된 셀 정보 가져오기

```ts
function getSelectedArea(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    range: AreaSelectionRange
}
```

### clearSelectedArea
선택된 셀 지우기

### copySelectedArea
선택 영역 내용을 클립보드에 복사. 복사된 텍스트 내용 반환 (TSV 형식).

```ts
function copySelectedArea(): string
```

### getSelectedRows
행 드래그 선택으로 선택된 행 정보를 가져옵니다

```ts
function getSelectedRows(): {
    rows: DT[];
    range: RowDragSelectionRange | null;
}
```

### clearSelectedRows
행 드래그 선택으로 선택된 행을 비웁니다
