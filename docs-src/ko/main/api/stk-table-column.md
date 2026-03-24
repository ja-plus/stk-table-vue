# StkTableColumn

열 설정

```vue
<StkTable :columns="columns"></StkTable>
```
::: warning 얕은 감시
컴포넌트는 `columns` 속성을 깊게 감시**하지 않습니다**. 따라서 열 푸시가 효과 없으면 다음과 같이 참조를 업데이트하세요:
:::

```ts
columns.value = columns.value.slice(); // 배열 참조 업데이트
```

### StkTableColumn 설정
``` ts
export type StkTableColumn<T extends Record<string, any>> = {
    /**
     * 열 고유 키 (선택사항). 제공되지 않으면 dataIndex 필드가 기본값으로 열 고유 키로 사용됩니다.
     */
    key?: any;
    /**
     * 열 유형
     * - seq: 시퀀스 열
     * - expand: 확장 가능 열
     * - dragRow: 드래그 가능 행 열 (sktTableRef.getTableData를 사용하여 변경된 순서 가져오기)
     * - tree-node: 트리 노드 열, 앞에 확장/접기 화살표가 붙음
     */
    type?: 'seq' | 'expand' | 'dragRow' | 'tree-node';
    /** 데이터 인덱스 */
    dataIndex: keyof T & string;
    /** 헤더 텍스트 */
    title?: string;
    /** 열 콘텐츠 정렬 */
    align?: 'right' | 'left' | 'center';
    /** 헤더 콘텐츠 정렬 */
    headerAlign?: 'right' | 'left' | 'center';
    /** 정렬 */
    sorter?: Sorter<T>;
    /** 열 너비. 가로 방향 가상 스크롤 시 필수 설정 필요. */
    width?: string | number;
    /** 최소 열 너비. 가로 방향 가상 스크롤 미사용 시 효과적. */
    minWidth?: string | number;
    /** 최대 열 너비. 가로 방향 가상 스크롤 미사용 시 효과적. */
    maxWidth?: string | number;
    /** th 클래스 */
    headerClassName?: string;
    /** td 클래스 */
    className?: string;
    /** 정렬 필드. 기본값: dataIndex */
    sortField?: keyof T;
    /** 정렬 유형. number/string */
    sortType?: 'number' | 'string';
    /** 고정 열 */
    fixed?: 'left' | 'right' | null;
    /** 열 숨김 여부 */
    hidden?: boolean;
    /** 현재 열의 정렬 설정 */
    sortConfig?: Omit<SortConfig<T>, 'defaultSort'>;
    /**
     * 커스텀 td 렌더링 콘텐츠.
     *
     * 컴포넌트 props:
     * @param props.row 행의 레코드.
     * @param props.col 열 설정
     * @param props.cellValue row[col.dataIndex] 값
     * @param props.rowIndex 행 인덱스
     * @param props.colIndex 열 인덱스 (0부터) virtual-x에서는, 그렇지 않으면 가상 리스트 내 인덱스를 나타냄
     */
    customCell?: Component<CustomCellProps<T>> | string;
    /**
     * 커스텀 th 렌더링 콘텐츠
     *
     * 컴포넌트 props:
     * @param props.col 열 설정
     * @param props.rowIndex 행 인덱스
     * @param props.colIndex 열 인덱스 (0부터) virtual-x에서는, 그렇지 않으면 가상 리스트 내 인덱스를 나타냄
     */
    customHeaderCell?: Component<CustomHeaderCellProps<T>> | string;
    /**
     * 커스텀 tfoot td 렌더링 콘텐츠
     *
     * 컴포넌트 props:
     * @param props.row tfoot 행의 레코드.
     * @param props.col 열 설정
     * @param props.cellValue row[col.dataIndex] 값
     * @param props.rowIndex Tfoot 행 인덱스 (0부터 시작)
     * @param props.colIndex 열 인덱스
     */
    customFooterCell?: Component<CustomFooterCellProps<T>> | string;
    /** 중첩 헤더 */
    children?: StkTableColumn<T>[];
     /** 셀 병합 */
    mergeCells?: MergeCellsFn<T>;
};
```

## StkTableColumn.Sorter 
```ts
type Sorter<T> = boolean 
    | ((
        data: T[],
        option: { order: Order; column: any }
    ) => T[]);

```

## StkTableColumn.SortConfig
```ts
/** 정렬 설정 */
export type SortConfig<T extends Record<string, any>> = {
    /** 빈 값은 항상 리스트 하단에 옴 */
    emptyToBottom?: boolean;
    /**
     * 기본 정렬 (1.초기화 시トリ거 2.정렬 방향이 null일 때トリ거)
     * onMounted에서 setSorter를 호출하면 헤더 클릭과类似的行为.
     */
    defaultSort?: {
        dataIndex: keyof T;
        order: Order;
        /** sort-change 이벤트 발생 비활성화 여부. 기본값 false 이벤트 발생 */
        silent?: boolean;
    };
    /**
     * 문자열 정렬에 String.prototype.localCompare 사용 여부
     * 기본값 true ($*$ should be false)
     */
    stringLocaleCompare?: boolean;
    /** 자식 아이템 정렬 여부. 기본값 false (v0.8.8)*/
    sortChildren?: boolean;
};
```

## StkTableColumn.MergeCellsFn

```ts
export type MergeCellsParam<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};

export type MergeCellsFn<T extends Record<string, any>> =
    (data: MergeCellsParam<T>) => 
        { 
            rowspan?: number; 
            colspan?: number 
        } | undefined;
```
