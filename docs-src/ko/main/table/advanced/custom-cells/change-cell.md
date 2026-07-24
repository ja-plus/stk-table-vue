# ChangeCell 등락 셀 <Badge type="tip" text="^1.0.1" />

ChangeCell 은 NumberCell 의 포맷 기능 위에 등락 색상과 화살표를 더합니다. 셀 값의 부호에 따라 상승 / 하락 / 보합 색상을 자동으로 적용하고, A주 방식(상승=빨강, 하락=초록)과 국제 방식(상승=초록, 하락=빨강)을 전환할 수 있으며 ▲/▼ 화살표도 표시할 수 있습니다. 색상은 테이블의 라이트 / 다크 테마에 자동으로 적응합니다.

### 기본 사용법

`createChangeCell` 팩토리 함수로 ChangeCell 컴포넌트를 생성하여 `customCell` 로 사용합니다. 숫자 정렬은 열에 `align: 'right'` 를 설정하는 것을 권장합니다.

<demo vue="advanced/custom-cells/ChangeCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/ChangeCell/index.vue"></demo>

```ts
const { ChangeCell } = createChangeCell({ decimals: 2, showSign: true, arrow: true });
const ChangeCellComp = ChangeCell(); // 팩토리는 컴포넌트 생성자를 반환하므로 한 번 호출하여 사용합니다

const columns = [
    { title: '등락액', dataIndex: 'change', align: 'right', customCell: ChangeCellComp },
];
```

### 설정 옵션

설정 객체 `CreateChangeCellOptions` 는 [NumberCell 의 포맷 옵션](./number-cell#설정-옵션)을 모두 상속하며, 추가로 색상과 화살표 관련 설정을 제공합니다:

| 속성 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| colorReverse | `boolean` | `false` | 등락 색상 반전: `false`=A주(상승 빨강, 하락 초록), `true`=국제(상승 초록, 하락 빨강) |
| arrow | `boolean` | `false` | 등락 화살표 표시 여부(양수 ▲ / 음수 ▼ / 보합·빈 값은 숨김) |
| riseColor | `string` | - | 상승 색상 사용자 지정(지정 시 `colorReverse` 의 영향을 받지 않음) |
| fallColor | `string` | - | 하락 색상 사용자 지정 |
| flatColor | `string` | - | 보합 색상 사용자 지정 |

나머지 포맷 옵션(`decimals`, `showSign`, `percent`, `prefix` 등)은 NumberCell 과 완전히 동일합니다. 예를 들어 등락률 열에는 `{ percent: true, showSign: true, arrow: true }` 를 자주 사용합니다.

### 등락 색상

색상은 **셀 값의 부호**에 따릅니다: `> 0` 은 상승, `< 0` 은 하락, `= 0`(및 빈 값)은 보합입니다.

- 기본값 `colorReverse: false` 는 A주 관습: 상승=빨강, 하락=초록
- `colorReverse: true` 로 설정하면 국제 관습으로 전환: 상승=초록, 하락=빨강

기본 색상은 CSS 변수로 정의되며 다크 테마(`.stk-table.dark`)에서 자동으로 밝게 조정됩니다. 완전히 사용자 지정하려면 `riseColor` / `fallColor` / `flatColor` 를 전달하세요. 이 경우 `colorReverse` 보다 우선합니다.
