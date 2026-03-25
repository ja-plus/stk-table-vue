# Q&A

## Q: columns 변경이 적용되지 않습니다.
A: 테이블 컴포넌트 내부에서 columns 를 watch 하고 있지만, deep(깊은 감시) 을 추가하지 않았습니다. columns 에 새로운 참조를 다시 할당하면 됩니다. 참고 [열 설정](/main/api/stk-table-column)

## Q: dataSource 변경이 적용되지 않습니다.
A: 위와 동일합니다. `dataSource.value = dataSource.value.slice()` 를 사용하여 참조를 업데이트하면 됩니다.