---
kind: external_dependency
name: ja-contextmenu 右键菜单组件
slug: ja-contextmenu
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
source_files:
    - docs-demo/demos/RealtimeMergeCells/index.vue
    - docs-demo/other/contextmenu/ContextMenu.vue
---

### ja-contextmenu
- **角色**：项目中使用 ja-contextmenu 库实现表格的右键上下文菜单功能，替代了之前手写的 Teleport 菜单实现
- **使用模式**：支持函数形式的 `label` / `disabled` 属性，菜单弹出时动态求值（i18n 文本 + 选区状态判断）
- **验证方式**：可通过 `pnpm docs:dev` 在文档站中验证该 demo 的右键菜单功能