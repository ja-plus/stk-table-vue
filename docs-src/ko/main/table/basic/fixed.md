# 고정 열

`StkTableColumn['fixed'] = 'left'` 또는 `'right'`를 설정하여 왼쪽 또는 오른쪽 고정 열 효과를 구현할 수 있습니다.

::: info全新的 고정 열 인터랙션
테이블에서 `sticky`를 사용하여 고정 열을 구현했기 때문에 **열 흡착** 기능을 지원합니다. 임의의 열을 고정 열로 설정할 수 있으며, 열이 가시 영역을 벗어날 때만 고정됩니다.
:::

## 기본

열 설정demo
```typescript{2,6,10}
const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name', fixed: 'left', width: 100 },
    { title: 'Age', dataIndex: 'age', width: 100 }, 
    { title: 'Address', dataIndex: 'address', width: 200 }, 
    // Gender 열 앞의 모든 열은 반드시 열 너비를 지정해야 합니다
    { title: 'Gender', dataIndex: 'gender', width: 50, fixed: 'left' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Company', dataIndex: 'company'  },
    { title: 'Operation', dataIndex: 'operation', fixed: 'right', width: 100 },
];

```
::: warning
고정 열의 흡착 위치를 열 너비로 계산해야 하므로, 왼쪽 고정 열 앞의 모든 열**은 반드시 열 너비를 지정해야 합니다**.

위의 표에서 `Gender` 열 앞의 모든 열은 열 너비를 설정해야 합니다. 오른쪽 고정도 동일합니다.
:::

<demo vue="basic/fixed/Fixed.vue"></demo>

표를 가로로 스크롤할 때 `Gender` 열이 자동으로 왼쪽에 흡착되는 것을 볼 수 있습니다.

::: tip
모든 열을 가장 왼쪽에 놓으려면, 고정 왼쪽 열을 `columns`의 가장 앞에 놓으세요. 마찬가지로 오른쪽 고정 열은 모두 `columns`의 마지막에 놓으세요.
:::

## 고정 열 그림자

기본적으로 고정 열에는 그림자 효과가 없습니다. 그림자 효과를 원하시면 `fixed-col-shadow` 속성을 `true`로 설정하세요.

```html
<StkTable fixed-col-shadow></StkTable>
```

## 가상 리스트 열 고정


<demo vue="basic/fixed/FixedVirtual.vue"></demo>

::: warning
`props.virtual-x` 가로 가상 리스트를 설정하면, 열 너비가 설정되지 않은 열은 모두 100px로 강제 설정됩니다.
:::
