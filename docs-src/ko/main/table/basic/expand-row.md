# 행 전개

열 설정에 `type: 'expand'`을 추가하면 열을 내장 전개 가능 셀로 설정할 수 있습니다.
그런 다음 slot `#expand="{row, col}"`을 설정하여 전개 콘텐츠를 설정합니다.

::: warning
현재 전개 행을 설정하면, 가상 리스트의 상단 거리 계산 방식은 첫 번째 데이터부터 행 높이를累加하여實現하며, 데이터량이 많으면 성능 문제가 있을 수 있습니다.
:::

## 예시

### 기본 전개
<demo vue="basic/expand-row/ExpandRow.vue"></demo>

### 커스텀 전개 셀
<demo vue="basic/expand-row/CustomExpandRow.vue"></demo>

## API
### StkTableColumn설정
`StkTableColumn['type'] = 'expand'`은 이 열을 전개 가능으로 설정합니다.

```ts
const columns = [
    { type: 'expand', dataIndex: '', title: '' }
]

```

### slot 
`#expand="{row, col}"`는 전개 행의 콘텐츠를 설정합니다.

```html
<StkTable>
    <template #expand="{ row, col }">
        {{ row[col.dataIndex]}}
    </template>
</StkTable>
```

| slot-prop | 설명 |
| ---- | ---- |
| row | 전개 행의 데이터 |
| col | 클릭하여 전개 행의 열 |

### props
`props.expandConfig`
| 속성 | 타입 | 기본값 | 설명 |
| ---- | ---- | ---- | ---- |
| height | number | 테이블 행 높이 | 전개 행의 행 높이 |

### expose
인스턴스 메서드를 호출하여 전개/접기 행을 트리거할 수 있습니다
```ts
/**
 * 전개하거나 접기 행
 * @param rowKeyOrRow 행 고유 키 또는 행 객체
 * @param expand 전개 여부
 * @param data.col 열 설정
 * @param data.silent true로 설정하면 `@toggle-row-expand`를 트리거하지 않음, 기본값:false
 */
setRowExpand(
    rowKeyOrRow: string | undefined | DT,
    expand?: boolean,
    data?: { 
        col?: StkTableColumn<DT>; 
        silent?: boolean 
    }
):void
```
