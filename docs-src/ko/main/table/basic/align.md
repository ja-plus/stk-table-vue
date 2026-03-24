# 정렬 방식

설정
| 속성명 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| align | `"left"`\|"center"\|"right"` | 'left' | 테이블 본문 정렬 방식 |
| headerAlign | `"left"`\|"center"\|"right"` | 'center' | 테이블 헤더 정렬 방식 |


```ts
const columns:StkTableColumn<any>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'center', // [!code ++]
    headerAlign: 'center', // [!code ++]
  },
]
```

<demo vue="basic/align/Align.vue"></demo>
