# 행 드래그 순서 변경

행을 드래그하여 테이블에서의 순서를 변경합니다.

## 예시
내장된 드래그 `StkTableColumn['type']="dragRow"` 사용

::: warning
 `dragRow` 열 설정에는 `dataIndex`가 작성되지 않았습니다. 이는 `props.colKey`가 유일한 키를 재정의했고, `StkTableColumn['key']` 필드가 우선적으로 取られる 때문입니다.
:::

<demo vue="advanced/row-drag/RowDrag.vue"></demo>

또한 네이티브 draggable API를 사용하여实现할 수도 있으며, 아래는 参考입니다:

<demo vue="advanced/row-drag/RowDragCustom.vue"></demo>

## API

### emits
```ts
/**
 * 행 드래그 이벤트
 *
 * ```(dragStartKey: string, targetRowKey: string)```
 */
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
```
