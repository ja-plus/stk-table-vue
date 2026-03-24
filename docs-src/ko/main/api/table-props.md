# Table Props 테이블 설정
```ts
<StkTable
  ...[props]
/>
```
## API

### width

테이블 너비

```ts
width?: string;
```

### minWidth

최소 테이블 너비 @deprecated 0.9.1 CSS 선택자 `.stk-table-main`로 설정

```ts
minWidth?: string;
```

### maxWidth

테이블 최대 너비 @deprecated 0.9.1 CSS 선택자 `.stk-table-main`로 설정

```ts
maxWidth?: string;
```

### stripe

얼룩말 줄무늬

```ts
stripe?: boolean;
```

### fixedMode

table-layout:fixed 사용 여부

```ts
fixedMode?: boolean;
```

### headless

헤더 숨김 여부

```ts
headless?: boolean;
```

### theme

테마, 라이트/다크

```ts
theme?: 'light' | 'dark';
```

### rowHeight

행 높이
- `props.autoRowHeight`가 `true`일 때,期望行高로 사용됩니다. 실제 행 높이에 영향을 주지 않습니다.

```ts
rowHeight?: number;
```

### autoRowHeight

가변 행 높이 여부
- `true`로 설정하면, `props.rowHeight`는期望行高로 사용됩니다. 실제 행 높이에 영향을 주지 않습니다.

```ts
autoRowHeight?: boolean | {
  /** 예상 행 높이(rowHeight보다 높은 우선순위) */
  expectedHeight?: number | ((row: DT) => number);
};
```

### rowHover

마우스 호버 시 행 강조 여부

```ts
rowHover?: boolean;
```

### rowActive

선택된 행 강조 여부

```ts
rowActive?: boolean | {
  /** 행 선택 기능 활성화 여부 기본값: true */
  enabled?: boolean;
  /** 행 선택 비활성화 기본값: () => false */
  disabled?: (row: DT) => boolean;
  /** 선택 취소 가능 여부 기본값: true */
  revokable?: boolean;
};
```

### headerRowHeight

헤더 행 높이. 기본값 = rowHeight

```ts
headerRowHeight?: number | null;
```

### footerRowHeight

푸터 행 높이. 기본값 = rowHeight

```ts
footerRowHeight?: number | string | null;
```

### virtual

가상 스크롤

```ts
virtual?: boolean;
```

### virtualX

x축 가상 스크롤 (열 너비 설정 필요)

```ts
virtualX?: boolean;
```

### columns

테이블 열 설정

얕은 감시, 변경 시 참조를 수정하세요

```ts
columns?: StkTableColumn<any>[];
```

### dataSource

데이터 소스

얕은 감시, 변경 시 참조를 수정하세요

```ts
dataSource?: any[];
```

### rowKey

행 고유 키 (행 고유 값은 undefined일 수 없음)

```ts
rowKey?: UniqKeyProp;
```

### colKey

열 고유 키. 기본값 `dataIndex`

```ts
colKey?: UniqKeyProp;
```

### emptyCellText

빈 값 표시 텍스트

```ts
emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string);
```

### noDataFull

데이터 없음 높이 꽉 채우기 여부

```ts
noDataFull?: boolean;
```

### showNoData

데이터 없음 표시 여부

```ts
showNoData?: boolean;
```

### sortRemote

서버 측 정렬 여부, true면 데이터 정렬 안함

```ts
sortRemote?: boolean;
```

### showHeaderOverflow

헤더溢出 표시 여부

```ts
showHeaderOverflow?: boolean;
```

### showOverflow

본문 overflow 시 ... 표시 여부

```ts
showOverflow?: boolean;
```

### showTrHoverClass

행 호버 class 추가 여부

```ts
showTrHoverClass?: boolean;
```

### cellHover

마우스 호버 시 셀 강조 여부

```ts
cellHover?: boolean;
```

### cellActive

선택된 셀 강조 여부

```ts
cellActive?: boolean;
```

### selectedCellRevokable

셀 다시 클릭 시 선택 취소 가능 여부 (cellActive=true)

```ts
selectedCellRevokable?: boolean;
```

### areaSelection

셀 범위 선택 활성화 여부 (드래그 선택 영역)

```ts
areaSelection?: boolean | {
  /**
   * 복사 시 셀 텍스트 포맷 콜백.
   * customCell 커스텀 렌더링을 사용한다면, 복사 내용과 표시 내용 일치 여부를 보장하기 위해 이 콜백을 제공해야 합니다.
   * @param row 행 데이터
   * @param col 열 설정
   * @param rawValue row[col.dataIndex]의 원본 값
   * @returns 클립보드에 복사할 텍스트
   */
  formatCellForClipboard?: (row: DT, col: StkTableColumn<DT>, rawValue: any) => string;
  /**
   * 키보드 제어 선택 영역 이동 활성화 여부.
   * 활성화하면, 방향키/Tab/Shift+Tab로 선택 영역 이동 제어 가능, Excel 동작과 유사.
   * 이 기능 활성화 시, 기존 키보드 스크롤 동작은无效됩니다.
   * @default false
   */
  keyboard?: boolean;
};
```

### headerDrag

헤더 드래그 가능 여부. 콜백 함수 지원.

```ts
headerDrag?:
  | boolean
  | {
      /**
       * 열 교환 모드
       * - none - 아무것도 안함
       * - insert - 삽입 (기본값)
       * - swap - 교환
       */
      mode?: 'none' | 'insert' | 'swap';
      /** 드래그 비활성화 열 */
      disabled?: (col: StkTableColumn<DT>) => boolean;
    };
```

### rowClassName

행에 className 추가

```ts
rowClassName?: (row: any, i: number) => string;
```

### colResizable

열 너비 드래그 가능 여부 (v-model:columns 설정 필요)
**설정하지 마세요** 열 minWidth, **반드시** width 설정 필요
열 너비 드래그 시, 각 열에는 width가 반드시 필요하며 minWidth/maxWidth는无效됩니다. 테이블 너비는 "fit-content"가 됩니다.
- props.columns의 width 속성을 자동으로 업데이트합니다

```ts
colResizable?: boolean | {
  /** 드래그 비활성화 열 */
  disabled?: (col: StkTableColumn<DT>) => boolean;
};
```

### colMinWidth

드래그 가능한 최소 열 너비

```ts
colMinWidth?: number;
```

### bordered

셀分隔线.
기본값 가로 세로 모두 있음
"h" - 가로선만 표시
"v" - 세로선만 표시
"body-v" - 본문만 세로선 표시
"body-h" - 본문만 가로선 표시

```ts
bordered?: boolean | 'h' | 'v' | 'body-v' | 'body-h';
```

### autoResize

가상 스크롤 높이/너비 자동 재계산. 기본값 true
[非반응형]
메서드 전달 시 resize 후 콜백 의미

```ts
autoResize?: boolean | (() => void);
```

### fixedColShadow

고정 열 그림자 표시 여부. 성능 절약 위해 기본값 false.

```ts
fixedColShadow?: boolean;
```

### optimizeVue2Scroll

vue2 스크롤 최적화

```ts
optimizeVue2Scroll?: boolean;
```

### sortConfig

정렬 설정

```ts
sortConfig?: {
  /** 빈 값 하단 정렬 여부 */
  emptyToBottom: boolean,
  /** 기본 정렬 (1.초기화 시トリ거 2.정렬 방향이 null일 때トリ거) */
  defaultSort?: {
      dataIndex: keyof T;
      order: Order;
  };
  /**
   * string 정렬 시 String.prototype.localCompare 사용 여부
   * 기본값 true (이전 설계 문제, 호환성을 위해 기본값 true)
   */
  stringLocaleCompare?: boolean;
},
```

### hideHeaderTitle

헤더 마우스 호버 title 숨김. dataIndex 배열 전달 가능

```ts
hideHeaderTitle?: boolean | string[];
```

### highlightConfig

강조 설정

```ts
highlightConfig?: {
  /** 강조 지속 시간(s) */
  duration?: number;
  /** 강조 프레임레이트*/
  fps?: number;
};
```

### seqConfig

순번 열 설정

```ts
seqConfig?: {
  /** 순번 열 시작 인덱스 페이지네이션适配용 */
  startIndex?: number;
};
```

### expandConfig

확장 행 설정

```ts
expandConfig?: {
  height?: number;
};
```

### dragRowConfig

행 드래그 설정

```ts
dragRowConfig?: {
  mode?: 'none' | 'insert' | 'swap';
};
```

### cellFixedMode

고정 헤더, 고정 열 구현 방식.
[非반응형]
relative: 고정 열은 props.columns 양쪽에만 배치 가능.
- 열 너비가 변경되면 주의해서 사용.
- 멀티 레벨 헤더 고정 열 주의

낮은 버전 브라우저는只能是'relative',

```ts
cellFixedMode?: 'sticky' | 'relative';
```

### smoothScroll

부드러운 스크롤 여부
- 기본값: chrome < 85 || chrome > 120 ? true : false
- false: wheel 이벤트 스크롤 사용. 스크롤 너무 빠를 때 白屏 방지.
- true: wheel 이벤트 스크롤 미사용. 마우스휠 스크롤 시 더 부드러움. 스크롤太快时会出现白屏.

```ts
smoothScroll?: boolean;
```

### scrollRowByRow

정수 행 단위 세로 스크롤
- scrollbar: 스크롤바만 드래그 시生效, 드래그 白屏 문제 처리可用(v0.7.2)

```ts
scrollRowByRow?: boolean | 'scrollbar';
```

### scrollbar

커스텀 스크롤바 설정
- false: 커스텀 스크롤바 비활성화
- true: 기본 설정의 커스텀 스크롤바 활성화
- ScrollbarOptions: 커스텀 스크롤바 활성화 및 설정

```ts
scrollbar?: boolean | {
  /** 스크롤바 활성화 여부 */
  enabled?: boolean;
  /** 세로 스크롤바 너비 기본값: 8 */
  width?: number;
  /** 가로 스크롤바 높이 기본값: 8 */
  height?: number;
  /** 스크롤바 썸 최소 너비 기본값: 20 */
  minWidth?: number;
  /** 스크롤바 썸 최소 높이 기본값: 20 */
  minHeight?: number;
};
```

### treeConfig

트리 설정

```ts
treeConfig?: {
  /** 기본값 모든 트리 노드 확장 */
  defaultExpandAll?: boolean;
  /** 기본값 확장할 노드키 */
  defaultExpandKeys?: UniqKey[];
  /** 기본값 확장할 레벨 */
  defaultExpandLevel?: number;
};
```

### experimental

실험적 기능 설정

```ts
experimental?: {
  /** transform 사용하여 스크롤 시뮬레이션 */
  scrollY?: boolean;
};
```

### footerData

테이블 하단 합계 행 데이터

```ts
footerData?: DT[];
```
