## Context

commit `fdfe64c` 将 `getTHProps` / `getTFProps` / `getTDProps` 的 `class` 从 Vue 数组绑定改为 `.filter(Boolean).join(' ')` 预拼接字符串以优化性能。但 `fixedColClassMap.value.get(colKey)` 返回的是数组（`string[]`），嵌套在外层数组中 `.join(' ')` 时，JS 的 `Array.prototype.toString()` 用逗号连接内部元素，导致固定列 class 失效。

## Goals / Non-Goals

**Goals:**
- 修复固定列 class 序列化 bug，恢复 `position: sticky` 吸附行为
- 保留 `.filter(Boolean).join(' ')` 字符串拼接的性能优化

**Non-Goals:**
- 不改变 `fixedColClassMap` 的其他消费方（如 `useFixedCol` 内部的 `includes` 判断）
- 不修改公共 API

## Decisions

**方案：将 `fixedColClassMap` 的存储值从 `string[]` 改为预拼接 `string`**

在 `useFixedCol.ts` 的 `fixedColClassMap` computed 中，将 `colMap.set(colKeyFn(col), classList)` 改为 `colMap.set(colKeyFn(col), classList.join(' '))`，使 Map 直接存储空格拼接的字符串。

**理由**：
- 改动最小（仅一行），且从源头解决嵌套数组序列化问题
- `getTHProps` / `getTFProps` / `getTDProps` 三处消费方无需任何修改，继续 `.filter(Boolean).join(' ')` 即可
- 性能更优：class 拼接只在 `fixedColClassMap` 重算时执行一次，而非每个 props 函数调用时都参与 join

**备选方案**：
- 在消费方展开数组（`...fixedColClassMap.value.get(colKey) || []`）：需改三处，且每次 props 调用都展开数组，性能略差
- 使用 `.flat()` 展平：需改三处，且 `.flat()` 有额外开销

## Risks / Trade-offs

- [风险] `fixedColClassMap` 值类型从 `string[]` 变为 `string`，如有外部消费方（测试/插件）依赖数组类型可能不兼容 → 经排查 `fixedColClassMap` 仅在 `StkTable.vue` 内部消费，无外部暴露
- [风险] 空数组 `.join(' ')` 产生空字符串 → 与之前行为一致（空字符串被 `.filter(Boolean)` 过滤），无影响

## 文档影响

此修复为内部 bug 修复，不涉及公共 API 或行为约束变化，无需同步 docs-src 文档。仅需在 CHANGELOG.md 记录 bugfix 条目。
