# CheckboxCell 체크박스 <Badge type="tip" text="^1.0.0" /> <Badge type="warning" text="Beta" />

CheckboxCell 는 셀 수준에서 전체 선택/부분 선택 기능을 지원하는 내장 체크박스 셀 컴포넌트입니다.

### 기본 사용법

`createCheckboxCell` 팩토리 함수를 통해 `CheckboxCell`과 `CheckboxAllCell` 컴포넌트를 생성하여 각각 `customCell`과 `customHeaderCell`로 사용합니다.

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### 서드파티 컴포넌트 사용

`checkboxComponent`에 UI 라이브러리의 Checkbox 컴포넌트를 전달하여 프로젝트 전체 스타일을 통일할 수 있습니다.

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### createCheckboxCell 옵션

`createCheckboxCell` 팩토리 함수는 설정 객체를 받습니다:

```ts
interface createCheckboxCellOptions<T = any> {
    /** 행 데이터에서 선택 상태를 나타내는 필드명, 기본값 '_isChecked' */
    field?: string;
    /** 커스텀 체크박스 컴포넌트 (Element Plus / Ant Design Vue의 Checkbox 등) */
    checkboxComponent?: any;
    /** 셀 체크박스 상태 변경 콜백 */
    onChange?: (checked: boolean, row: T) => void;
    /** 전체 선택 체크박스 상태 변경 콜백 */
    onSelectAll?: (checked: boolean) => void;
}
```

| 속성 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| field | `string` | `'_isChecked'` | 행 데이터에서 선택 상태를 나타내는 필드명 |
| checkboxComponent | `Component` | - | 커스텀 체크박스 컴포넌트, 미지정 시 네이티브 input[type=checkbox] 사용 |
| onChange | `(checked, row) => void` | - | 셀 체크박스 상태 변경 시 콜백 |
| onSelectAll | `(checked) => void` | - | 전체 선택 체크박스 상태 변경 시 콜백 |
