# 다중 선택상자
## 개요

StkTable 컴포넌트는 자체적으로**내장 다중 선택상자 기능이 없습니다**, 그러나 `customCell`과 `customHeaderCell` 설정 항목을 통해 다중 선택상자 기능을 커스텀 구현할 수 있습니다. 이 방식은 매우 유연하여 다양한 비즈니스 요구를 충족시킬 수 있습니다.
## 예시

<demo vue="basic/checkbox/Checkbox.vue" />

## 코드 구현

columns 설정에 다중 선택상자를 표시하는 커스텀 열을 추가합니다:

```javascript
{
    customHeaderCell: () => {
        return h('span', [
            h('input', {
                type: 'checkbox',
                style: 'vertical-align:middle',
                checked: isCheckAll.value,
                indeterminate: isCheckPartial.value,
                onChange: (e: Event) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    dataSource.value.forEach(item => {
                        item._isChecked = checked;
                    });
                },
            }),
        ]);
    },
    customCell: ({ row }) => {
        return h('div', { style: 'display:flex;align-items:center;justify-content:center' }, [
            h('input', {
                type: 'checkbox',
                checked: row._isChecked,
                onChange: (e: Event) => {
                    row._isChecked = (e.target as HTMLInputElement).checked;
                },
            }),
        ]);
    },
}
```
input 요소 외부에 부모 요소를 추가하여垂直居中합니다.

프로젝트에서 사용하는 vue 컴포넌트 라이브러리(Element Plus, Ant Design Vue, Naive UI 등)의 `Checkbox` 컴포넌트로 대체하여 프로젝트 전체 스타일统일을 유지할 수 있습니다.
