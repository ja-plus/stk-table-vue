---
kind: build_system
name: 构建与发布系统（Vite + VitePress + Vitest + GitHub Actions）
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - vite.config.ts
    - .github/workflows/deploy.yml
    - vitest.workspace.ts
    - docs-src/.vitepress/config.ts
    - postcss.config.js
    - .eslintrc.cjs
    - tsconfig.json
---

本项目采用以 pnpm 为包管理器、Vite 为核心构建工具的多模块工程，统一编排组件库打包、文档站点生成、单元测试与 CI 发布。

**1. 构建系统与工具链**
- 包管理器：pnpm@10.7.0（通过 package.json 的 `packageManager` 字段锁定版本）
- 核心构建器：Vite 8，用于组件库开发与打包
- 文档站点：VitePress 1，支持中/英/日/韩四语，配合 vitepress-demo-plugin 将 docs-demo 下的 Vue 示例嵌入文档
- 测试框架：Vitest 4，基于 happy-dom 运行浏览器环境测试
- 类型生成：vite-plugin-dts 在 production 模式下自动生成 .d.ts 声明文件
- CSS 处理：Less + PostCSS（postcss-preset-env 与 postcss-discard-comments）
- 代码规范：ESLint + Prettier + TypeScript ESLint，规则集中在 .eslintrc.cjs

**2. 关键配置文件与脚本**
- `package.json`：定义 dev/build/test/docs:* 等 npm scripts，指定 main/types/files 发布入口
- `vite.config.ts`：组件库构建配置，输出 ES 模块到 lib/，外部化 vue，禁用压缩，固定产物名为 style.css
- `vitest.workspace.ts`：工作区配置，包含 packages/* 与自定义测试环境（happy-dom）
- `.github/workflows/deploy.yml`：GitHub Actions 流水线，push 到 docs 分支时自动构建 VitePress 并部署到 GitHub Pages
- `docs-src/.vitepress/config.ts`：VitePress 多语言站点配置，集成 demo 插件与 LLMs 文本生成
- `postcss.config.js`、`.eslintrc.cjs`、`tsconfig.json`：分别管理 CSS 后处理、代码规范与 TypeScript 编译选项

**3. 架构与约定**
- 组件库源码位于 `src/StkTable/`，入口为 `src/StkTable/index.ts`，构建产物输出至 `lib/`（stk-table-vue.js + style.css + .d.ts）
- 文档与演示分离：`docs-src/` 存放 VitePress 站点源码，`docs-demo/` 存放可运行的 Vue 示例组件，通过 vitepress-demo-plugin 关联
- 测试用例集中于 `test/` 目录，按功能分文件组织，使用 Vitest workspace 统一管理
- 多语言文档通过 VitePress locales 配置实现，每个语言对应独立 config 文件（zh/en/ja/ko）
- 构建目标浏览器为 chrome84，TypeScript 目标为 esnext，moduleResolution 使用 bundler 模式

**4. 约束与规范**
- 包管理器版本由 package.json 锁定，确保团队一致性
- 组件库仅输出 ES 模块格式，vue 作为 external 依赖不打包
- 生产构建启用 d.ts 生成，开发模式关闭以提升速度
- CSS 资产统一命名为 style.css，避免哈希影响引用
- ESLint 强制使用 ===、禁止 any、空函数等规则，Prettier 统一格式化
- CI 仅在 docs 分支触发 Pages 部署，支持手动触发 workflow_dispatch