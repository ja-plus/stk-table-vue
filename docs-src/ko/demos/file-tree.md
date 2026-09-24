# 파일 관리 트리

`tree-node` 열에 `customCell`을 지정해 파일 관리 트리를 구현합니다. 단일 열 + `headless`(헤더 숨김) 탐색기 목록으로, 이름 열은 셀 전체를 직접 그리고(폴더 / 파일 아이콘, 행 내 이름 바꾸기 입력창) 셀 전체가 드래그 핫스팟입니다. 내장 "레벨 들여쓰기 + 가이드선"과 "화살표 / 지연 로딩"은 각각 `stkTreeIndent`, `stkFoldIcon` 슬롯으로 전달됩니다(두 슬롯은 **사용자 셀 컴포넌트**의 슬롯이며 StkTable 최상위 슬롯이 아님에 주의). 렌더링 여부와 배치 위치는 자유롭게 정할 수 있습니다.

<demo vue="demos/FileTree/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/FileTree/index.vue"></demo>

## 파일 관리 기능

첫 번째 표(직접 그린 폴더 / 파일 아이콘)에는 탐색기 방식의 조작을 한 데 모았습니다. 모두 데모 측에서 조립한 것입니다:

- **기본으로는 첫 번째 레벨만 펼치기**: `treeConfig.defaultExpandLevel = 1`. `defaultExpandAll`은 사용하지 않습니다.
- **행 클릭으로 펼치기 / 접기**: `cell-click`을 받아 폴더 행에 맞으면 현재 펼침 상태에 따라 `setTreeExpand(row, { expand })`로 반전합니다. 펼침 컨트롤에 닿은 클릭은 `cell-click`을 발생시키지 않으므로 두 번 전환되지 않습니다. 행 내 이름 바꾸기 입력창 위의 클릭은 직접 제외해야 합니다.
- **우클릭 메뉴**: `row-menu` 이벤트에서 [ja-contextmenu](https://github.com/ja-plus/ja-contextmenu)를 띄웁니다. "새 파일 / 새 폴더"는 폴더 행에만 표시되고, "붙여넣기"는 항상 표시되지만 폴더 행이고 클립보드에 내용이 있을 때만 누를 수 있습니다(파일 행에서는 회색). 복사 / 잘라내기 후 어떤 폴더 행에서나 찾을 수 있습니다.
- **행 내 이름 바꾸기**: 메뉴의 "이름 바꾸기"를 고르면 이름 열 안에 직접 `<input>`을 렌더링합니다(팝업을 새로 열지 않습니다, VSCode 방식). 포커스 시 확장자를 제외한 기본 이름을 선택하며, Enter / 포커스 해제로 확정, Esc로 취소합니다. 빈 값은 취소로 처리하고 동일 형제 이름이 있으면 확정을 막으며, 확정 전 새 행은 취소 시 삭제됩니다.
- **새 파일 / 새 폴더**: 정렬 위치에 삽입하고 곧바로 행 내 이름 바꾸기로 들어갑니다. 확정 전까지는 자리 표시 행입니다.
- **위치는 정렬로만 결정됩니다**(VSCode 방식): 각 레벨의 `children`을 「폴더 우선 + 이름의 `localeCompare`」로 정렬하므로, 같은 폴더 안에서는 드래그로 순서를 바꿀 수 없습니다. 생성 · 이름 바꾸기 · 이동 · 붙여넣기 후 모두 다시 정렬되며, 이름을 바꾸면 행이 새 정렬 위치로 이동합니다.
- **드래그는 폴더를 넘을 때만 가능**: 내장 `dragRow` 핸들 열은 쓰지 않습니다. 이름 셀 전체에 `draggable`을 붙이고 셀에서 네이티브 드래그 이벤트(`dragstart` / `dragover` / `drop`)를 직접 다룹니다. 폴더 행에 드롭하면 해당 폴더로 이동하고, 파일 행에 드롭한 경우 포인터가 칸의 위 / 아래 절반에 있는지에 따라 바로 앞 / 뒤에 삽입합니다. 같은 폴더 안의 드래그에서는 낙점 표시도 나오지 않고 변화도 없습니다. 폴더를 자신의 자손에 드롭하는 것도 막힙니다.
- **1초간 호버하면 자동 펼치기**: 접힌 폴더 위에 드래그 중 1초 이상 호버하면 자동으로 펼칩니다. 다른 행으로 이동하거나 벗어나면 타이머가 취소됩니다.
- **낙점 하이라이트**: 폴더 위에 호버하면 공유 `dropTargetFolder`를 통해 그 폴더 자신과 모든 하위 행의 배경을 하이라이트합니다(폴더 자신은 한 단계 진하게). 파일 행 낙점에는 삽입선을 표시합니다. 드롭하거나 벗어나면 하이라이트가 사라집니다. 편집 중인 행은 입력창의 문자 선택을 위해 임시로 `draggable`을 해제합니다.
- **잘라내기 / 복사 / 붙여넣기**: 클립보드는 행 참조만 보관합니다. 잘라낸 행은 회색으로 표시되며, 붙여넣기 시 잘라내기는 이동, 복사는 깊은 복사(이름에 ` copy` 추가)이고, 이후 모두 다시 정렬됩니다.

두 번째 표는 같은 데이터로 다른 배치 방법을 보여줍니다. 내장 화살표와 가이드선을 유지하고(`stkFoldIcon` 슬롯 렌더링) 폴더 이름에만 레이블을 붙입니다. 두 표는 메뉴와 데이터를 공유하므로 조작은 완전히 동일하며, 행 내 편집 상태는 표별로 분리(`editing.table`)되어 우클릭한 표에만 입력창이 나타납니다.

## 계약

- 셀 루트 요소에는 `height: 100%; display: flex; align-items: center;`가 필요합니다. 가이드선은 들여쓰기 칸 안에 그려지고 행 높이 전체로 늘어나므로, 행 높이를 채우는 flex 행이 아니면 선이 도중에 잘립니다.
- 직접 그린 펼침 컨트롤에는 `data-stk-fold`가 필수이며 셀당 하나만 표시하십시오. 레이블 등에 붙이면 그 영역도 클릭 판정 대상이 됩니다. 펼침 컨트롤에 닿은 클릭은 `cell-click` / `cell-selected`를 발생시키지 않습니다.
- 화살표 모양만 바꾸려면 `<slot name="stkFoldIcon" />`를 렌더링하면 내장 화살표(지연 로딩 자리표시자·펼침 회전 포함)를 그대로 쓸 수 있습니다.
- 아이콘이 기본 16px보다 넓다면 `--tree-indent-width`를 재정의해 들여쓰기 칸·컨트롤 자리·가이드선 간격이 함께 커지도록 하십시오(예시에서는 `20px`).

## 셀 골격

```vue
<script lang="ts" setup>
import type { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

defineProps<CustomCellProps<any>>();
</script>
<template>
    <div class="folder-cell">
        <!-- built-in: per-level indent + guide lines -->
        <slot name="stkTreeIndent" />
        <!-- self-drawn expand control: data-stk-fold is required; open/closed state comes from treeExpanded -->
        <span v-if="expandable" class="folder-cell__icon" data-stk-fold>{{ treeExpanded ? '▾' : '▸' }}</span>
        <span v-else class="folder-cell__icon" />
        <span>{{ cellValue }}</span>
    </div>
</template>
<style>
.folder-cell {
    height: 100%;
    display: flex;
    align-items: center;
}
.folder-cell__icon {
    flex-shrink: 0;
    width: var(--tree-indent-width);
    text-align: center;
    cursor: pointer;
}
</style>
```

::: tip 참고
열 설정은 내장 트리 테이블과 동일합니다. 열은 여전히 `type: 'tree-node'`이고 렌더링만 `customCell`로 옮긴 것입니다:

```ts
const columns = [{ type: 'tree-node', title: 'Name', dataIndex: 'name', customCell: NameCell }];
const treeConfig = { defaultExpandLevel: 1, showGuide: true };
```

기본 사용법과 지연 로딩은 [트리 테이블](/ko/main/table/basic/tree.html)을 참조하세요.
:::
