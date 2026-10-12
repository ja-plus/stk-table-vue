# CheckboxCell 체크박스 <Badge type="tip" text="^1.0.0" />

CheckboxCell 는 셀 수준에서 전체 선택/부분 선택 기능을 지원하는 내장 체크박스 셀 컴포넌트입니다.

### 기본 사용법

`createCheckboxCell` 팩토리 함수를 통해 `CheckboxCell`과 `CheckboxAllCell` 컴포넌트를 생성하여 각각 `customCell`과 `customHeaderCell`로 사용합니다.

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### 서드파티 컴포넌트 사용

`checkboxComponent`에 UI 라이브러리의 Checkbox 컴포넌트를 전달하여 프로젝트 전체 스타일을 통일할 수 있습니다.

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### 트리 체크박스 연동 <Badge type="tip" text="^1.2.8" />

트리 데이터(`children`)에서 `cascade: true`를 설정하면 체크박스 연동(부모-자식 연동 + 반선택)이 활성화됩니다:

- 부모 행을 체크하면 모든 자손 행이 재귀적으로 체크/해제됩니다;
- 부모 행의 체크 상태는 자손에서 도출됩니다: 모든 자손이 체크된 경우에만 체크로 간주되며, 일부만 체크된 경우 부모 행은 반선택 상태로 표시됩니다;
- 헤더 전체선택/반선택은 리프 행(`children`이 없는 행)만 집계하며 부모 행이 이중 계산되지 않습니다. 지연 로드(`treeConfig.lazy`)되지 않은 행은 리프로 간주됩니다.

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue"></demo>

::: tip
- `cascade`는 기본적으로 비활성화되어 있으며 각 행의 체크 상태는 서로 독립적입니다(하위 호환).
- `onChange`에는 사용자가 실제로 클릭한 행이 전달됩니다. 연동 쓰기는 개별 콜백을 발생시키지 않습니다.
- 연동 상태는 컴포넌트가 행 데이터(`field`)에 기록합니다. `row[field]`를 직접 수정하면 부모 도출이 수행되지 않으므로 체크 상호작용을 통해 상태를 유지하세요.
:::

### createCheckboxCell 옵션

`createCheckboxCell` 팩토리 함수는 설정 객체를 받습니다:

```ts
interface createCheckboxCellOptions<T = any> {
    /** 행 데이터에서 선택 상태를 나타내는 필드명, 기본값 '_isChecked' */
    field?: string;
    /** 커스텀 체크박스 컴포넌트 (Element Plus / Ant Design Vue의 Checkbox 등) */
    checkboxComponent?: any;
    /** 트리 데이터(children)에서 체크박스 연동(부모-자식 연동 + 반선택) 활성화, 기본값 false */
    cascade?: boolean;
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
| cascade | `boolean` | `false` | 트리 데이터에서 체크박스 연동(부모-자식 연동 + 반선택) 활성화, [트리 체크박스 연동](#트리-체크박스-연동) 참고 |
| onChange | `(checked, row) => void` | - | 셀 체크박스 상태 변경 시 콜백 |
| onSelectAll | `(checked) => void` | - | 전체 선택 체크박스 상태 변경 시 콜백 |
