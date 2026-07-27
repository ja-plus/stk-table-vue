---
kind: external_dependency
name: VitePress 文档站点框架
slug: vitepress
category: external_dependency
category_hints:
    - framework_behavior
scope:
    - '**'
source_files:
    - docs-src/.vitepress/theme/custom.css
    - docs-src/.vitepress/src/config/zh.ts
    - docs-src/.vitepress/src/config/en.ts
    - docs-src/.vitepress/src/config/ja.ts
    - docs-src/.vitepress/src/config/ko.ts
---

### VitePress
- **主题定制**：通过 custom.css 覆盖品牌色为 Vue Logo 绿色（#42b883），包括亮色和暗色模式的 --vp-c-brand-* 变量
- **导航配置**：在各语言的导航配置中添加跳转到 stk-table-react 页面的按钮，路径为 https://ja-plus.github.io/stk-table-react/
- **页面结构**：支持 hero actions 区域添加跳转按钮，顶部导航栏统一配置跨语言跳转链接
- **部署流程**：通过 pnpm scripts 中的 docs:dev/docs:build/docs:preview 命令管理开发、构建和预览