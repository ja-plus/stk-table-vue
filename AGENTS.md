# AGENTS.md

> 本文件面向 AI 编码助手（Claude Code / CodeBuddy / Cursor 等）与新的贡献者，提供操作本仓库所需的上下文与约定。请先阅读本文再修改代码。

## 项目定位

**Stk Table Vue** 是一个基于 **Vue 3 / Vue 2.7** 的高性能虚拟滚动表格组件库。
目标用户：需要在浏览器中流畅展示**数万行实时数据**的开发者。

核心能力：XY 轴虚拟滚动、CSS sticky 固定列/固定表头、多级表头、树形/展开行、单元格合并（虚拟模式支持）、区域选取（Excel 式键盘操作）、单元格高亮（Web Animations API）、内置自定义单元格（筛选/编辑/多选/数字/涨跌）、列宽调整、表头/行拖拽、主题（暗/亮）、基于原生 `<table>`、**零运行时第三方依赖**。

## 目录结构

```
src/StkTable/                核心源码（唯一的实现）
├── StkTable.vue             主组件（超大文件，按文件头注释的模块分区理解）
├── index.ts                 公共导出入口
├── registerFeature.ts       功能注册机制
├── const.ts                 常量
├── types/                   API 类型定义（唯一权威 API 来源，修改 API 必改这里）
│   └── index.ts             StkTableColumn / Props / Sort / AreaSelection 等全部类型
├── components/              DragHandle / SortIcon / TreeNodeCell / TriangleIcon
├── custom-cells/            内置自定义单元格（Filter / Editable / Checkbox / Number / Change）
├── features/                区域选取等 feature
├── utils/                   工具函数（排序、二分查找等）
└── use*.ts                  按 feature 拆分的组合式逻辑 hook
lib/                         构建产物（勿手改，由 vite build 生成）
docs-src/                    文档站源码（vitepress，中/英/日/韩四语言）
docs-demo/                   文档示例组件（*.vue）
test/                        单元测试（vitest）
llms.txt                     ★面向 AI 的速查手册（随 npm 包发布，版本与本包绑定）
scripts/build-ai-assets.mjs  llms.txt 版本戳 + index.d.ts 入口横幅
```

## 常用命令

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 本地开发（vite） |
| `pnpm build` | 构建组件库产物到 lib/（`postbuild` 会自动打 llms.txt 版本戳 + 注入 index.d.ts 横幅） |
| `pnpm ai:gen` | 仅重跑 AI 资产（llms.txt 版本戳 + 横幅） |
| `pnpm test` | 运行单元测试（vitest） |
| `pnpm docs:dev` | 本地文档站（vitepress） |
| `pnpm docs:build` | 构建文档站（产出站点级 `dist/llms.txt` / `llms-full.txt`，**与包根 llms.txt 不是同一个东西**） |
| `pnpm perf` | 性能基准测试 |

包管理器固定为 `pnpm`（见 `packageManager` 字段）。提交前请运行 `pnpm test` 与 `pnpm docs:build`。

## 代码约定

- **类型优先**：所有对外公开的 API（props / emits / slots / expose / 列配置）必须在 `src/StkTable/types/index.ts` 定义并补充 JSDoc。不要直接在组件里定义散落类型。
- **按 feature 拆 hook**：新逻辑应拆分为 `useXxx.ts`，避免让 `StkTable.vue` 继续膨胀。
- **私有字段命名**：内部私有字段统一以双下划线 `__` 开头（如 `__EXP__`、`__R_K__`、`__LF_S__`），并在类型上标注 `@private`，对外不可见。
- **注释语言**：源码注释与 JSDoc 使用中文。
- **通用类型参数**：`StkTableColumn<T>` / 组件 props 普遍使用泛型 `T extends Record<string, any>`，`T` 代表数据行（dataSource 元素）类型。
- **列唯一键**：默认取 `dataIndex`，可显式指定 `key`。
- **虚拟滚动宽度**：列配置中 `min-width = max-width = width`，保证计算宽度稳定（详见 `虚拟滚动表格开发.md`）。

## 修改指引（改 API 的完整闭环）

1. 修改 `src/StkTable/types/index.ts` 中的类型定义与 JSDoc。
2. 在 `src/StkTable/StkTable.vue` 中接入/实现对应 props/emits/expose。
3. 同步文档 `docs-src/main/api/*.md`（props / emits / slots / expose / stk-table-column）。
4. **同步 `llms.txt`**（面向 AI 与消费方的速查表）。
5. 在 `docs-src/main/table/basic|advanced/` 或 `docs-demo/` 补充示例。
6. 为改动补充测试（`test/`）。
7. 运行 `pnpm test`、`pnpm docs:build` 验证。

## AI 资产（消费方侧）

三个已发布/可发布的“入口指针”，缺一则 AI 很难发现其余：

| 位置 | 作用 | 维护方式 |
|------|------|----------|
| `llms.txt`（包根，已在 `files` 中） | 版本锁定的 API 速查表 + 坑清单 | 手写，版本戳由 `pnpm ai:gen` 写入 |
| `lib/src/StkTable/index.d.ts` 顶部横幅 | AI 从 `import` 跳定义时的唯一天然落点，引流到 llms.txt | 自动生成（`postbuild`），勿手改 |
| `README.md` 的 “For AI assistants” | 人/AI 都会先看 README | 手写 |

注意：`AI-API-REFERENCE.md` 是**仓内开发者向**浓缩手册，与包内 `llms.txt` 定位不同。两者内容重叠，改动 API 后以 `llms.txt` 为准。

## AI 协作建议

- 提问时优先指向具体符号（如"给 `StkTableColumn` 增加 `xxx` 字段"），而非"改一下表格"。
- 需要理解某一能力时，先在 `src/StkTable/use*.ts` 中找对应 hook，再回看 `StkTable.vue` 的接入点。
- 查阅公开 API 优先看 `src/StkTable/types/index.ts` 与浓缩手册 `AI-API-REFERENCE.md`，比读渲染逻辑更快。
- 浓缩手册涵盖：Props / StkTableColumn / Emits / Slots / Expose / 内置单元格 / 导出 / 实现文件索引。
