## Why

commit `fdfe64c`（fix #88, and perf）为降低 vnode diff 与 GC 开销，将 `getTHProps` / `getTFProps` / `getTDProps` 中的 `class` 从 Vue 数组绑定改为 `.filter(Boolean).join(' ')` 预拼接字符串。然而 `fixedColClassMap.value.get(colKey)` 返回的是一个**数组**（如 `['fixed-cell--active', 'fixed-cell', 'fixed-cell--left']`），放入外层数组后 `.join(' ')` 时，JavaScript 的 `Array.prototype.toString()` 会用**逗号**连接内部元素，生成 `"fixed-cell--active,fixed-cell,fixed-cell--left"` 这样的无效 CSS 类名，导致 `position: sticky` 的 `fixed-cell--active` 类无法生效，固定列完全不吸附。

## What Changes

- 修复 `getTHProps`、`getTFProps`、`getTDProps` 中 `fixedColClassMap` 返回值（数组）被 `.join(' ')` 错误序列化的问题，确保固定列 class 以空格分隔正确输出
- 此修复不涉及公共 API 变化，无需文档同步

## Capabilities

### New Capabilities

（无新增能力）

### Modified Capabilities

- `fixed-columns`: 修复固定列 class 拼接 bug，恢复固定列吸附行为（此行为本应存在但因序列化错误失效）

## Impact

- **受影响代码**：`src/StkTable/StkTable.vue`（`getTHProps` / `getTFProps` / `getTDProps` 的 class 拼接逻辑），可能同时修改 `src/StkTable/useFixedCol.ts`（`fixedColClassMap` 的存储格式）
- **公共 API**：无变化
- **文档**：无需同步（内部 bug 修复，行为恢复而非新增）
- **CHANGELOG.md**：记录 bugfix 条目
