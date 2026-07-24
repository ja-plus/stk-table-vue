# NumberCell 숫자 포맷 셀 <Badge type="tip" text="^1.0.1" />

NumberCell 은 숫자 값을 읽기 쉬운 텍스트로 포맷하는 내장 표시 전용 셀입니다. 소수점 자릿수, 천 단위 구분 기호, 접두사·접미사, 부호 표시, 백분율, 단위 축약(만/억, K/M/B), 빈 값 플레이스홀더를 지원합니다. 시세, 금액, 통계 데이터 표시에 자주 사용됩니다.

### 기본 사용법

`createNumberCell` 팩토리 함수로 NumberCell 컴포넌트를 생성하여 `customCell` 로 사용합니다. 숫자 정렬은 열에 `align: 'right'` 를 설정하는 것을 권장합니다.

<demo vue="advanced/custom-cells/NumberCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/NumberCell/index.vue"></demo>

```ts
const { NumberCell } = createNumberCell({ decimals: 2 });
const NumberCellComp = NumberCell(); // 팩토리는 컴포넌트 생성자를 반환하므로 한 번 호출하여 사용합니다

const columns = [
    { title: '현재가', dataIndex: 'price', align: 'right', customCell: NumberCellComp },
];
```

::: tip 열마다 다른 포맷
`createNumberCell` 은 하나의 포맷을 고정합니다. 열마다 다른 포맷(예: 가격은 소수 2자리, 거래량은 만 단위 축약)이 필요하면 여러 인스턴스를 만들면 됩니다.
:::

### 설정 옵션

`createNumberCell` 은 설정 객체 `CreateNumberCellOptions`(`FormatNumberOptions` 와 동일)를 받습니다:

| 속성 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| decimals | `number` | - | 소수점 자릿수(반올림). 생략하면 소수를 처리하지 않음 |
| thousands | `boolean` | `true` | 천 단위 구분 기호 사용 여부 |
| prefix | `string` | `''` | 접두사(예: `¥`, `$`) |
| suffix | `string` | `''` | 접미사(예: `원`, `주`) |
| showSign | `boolean` | `false` | 양수에 `+` 부호 강제 표시 여부(음수는 항상 `-`) |
| percent | `boolean` | `false` | 백분율 모드: 값 ×100 후 `%` 추가. `abbr` 와 배타적 |
| abbr | `'cn' \| 'en'` | - | 단위 축약: `cn`=만/억, `en`=K/M/B. `percent` 와 배타적 |
| abbrDecimals | `number` | `2` | 축약 후 유지할 소수 자릿수 |
| placeholder | `string` | `'--'` | 빈 값(`null`/`undefined`/`''`) 또는 비숫자일 때의 플레이스홀더 |

### 단위 축약

`abbr` 는 자릿수에 따라 값을 축약하고 단위를 추가합니다:

- `abbr: 'cn'`: 1억 이상은 `억`, 1만 이상은 `만` 으로 표시(예: `12345` → `1.23만`, `123456789` → `1.23억`)
- `abbr: 'en'`: `K`(천) / `M`(백만) / `B`(십억)로 축약(예: `1500` → `1.50K`, `2500000` → `2.50M`)

축약 후 소수 자릿수는 `abbrDecimals`(기본 2)로 제어합니다.

### formatNumber

포맷 로직은 순수 함수 `formatNumber(value, options)` 로 제공되며 함께 내보내집니다. 셀 외부(합계 행, 툴팁 등)에서도 직접 재사용할 수 있습니다:

```ts
import { formatNumber } from 'stk-table-vue';

formatNumber(1234567.891, { decimals: 2 }); // '1,234,567.89'
formatNumber(0.0523, { percent: true, decimals: 2, showSign: true }); // '+5.23%'
```
