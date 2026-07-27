---
kind: dependency_management
name: pnpm 依赖管理与锁定策略
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - pnpm-lock.yaml
---

该仓库使用 pnpm 作为包管理器，通过 `package.json` 声明依赖版本，并通过 `pnpm-lock.yaml` 锁定精确依赖树。核心特征如下：

1. **包管理器与版本锁定**
   - `packageManager` 字段固定为 `pnpm@10.7.0`，确保团队与 CI 环境使用一致版本。
   - `pnpm-lock.yaml` 采用 lockfileVersion 9.0，记录所有依赖的精确版本、完整性校验（integrity）及 peerDependencies 解析结果。

2. **依赖分类与范围**
   - 运行时依赖：仅 `vue` 作为唯一运行时依赖（^3.5.39），库本身不引入业务 UI 框架。
   - 开发依赖：涵盖构建（vite、postcss、less）、类型（typescript、@types/*）、测试（vitest、happy-dom、@vue/test-utils）、文档（vitepress、vitepress-demo-plugin）、代码质量（eslint、prettier）等。
   - 演示/对比依赖：同时安装 ant-design-vue、element-plus、naive-ui、@arco-design/web-vue 等多个 UI 框架用于示例对比。

3. **版本策略**
   - 主要依赖使用 `^` 语义化版本范围，允许小版本升级。
   - 部分工具依赖使用精确版本（如 vite-plugin-dts: 3.9.1）以保证构建稳定性。
   - 存在自引用依赖 `stk-table-vue: ^0.11.15`，用于在开发环境中引用已发布的旧版本进行对比或兼容测试。

4. **无 vendoring 策略**
   - 未使用 node_modules 之外的 vendoring（如 vendor/ 目录），依赖通过 pnpm 的硬链接机制管理。
   - 未配置私有 npm registry 或 .npmrc，默认使用公共 npm 源。

5. **构建产物中的依赖**
   - 发布包位于 `lib/` 目录，包含编译后的 JS 和 CSS 文件，依赖在消费者项目中通过 npm/yarn/pnpm 安装。
   - `files` 字段仅包含 `lib` 和 `src`，确保源码和构建产物随包发布。

6. **CI/CD 集成**
   - `.github/workflows/deploy.yml` 负责文档站点部署，依赖安装由 pnpm 自动处理（基于 packageManager 字段）。