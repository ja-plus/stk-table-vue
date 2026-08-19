# design.md

## Context

本变更是**纯规划/文档类变更**：不修改任何运行时代码，只新增 `openspec/specs/` 基线能力规范（11 个能力）并补充 `openspec/config.yaml` 的项目上下文与规则。规范内容的事实来源是现有实现（`src/StkTable/`）与官方文档（`docs-src/`、README.md）。约束见 proposal.md — Why。

## Goals / Non-Goals

**Goals:**

- 为组件主要功能建立可验证的行为契约基线（每个 Requirement 至少一个可测试 Scenario）。
- 让后续 OpenSpec 变更有明确的 capability 结构可挂载（MODIFIED / ADDED delta 均能找到对应能力路径）。
- 在 `config.yaml` 中沉淀项目上下文与关键开发约定，约束后续 AI 生成的工件。

**Non-Goals:**

- 不描述内部实现细节（hook 划分、数据结构、算法复杂度等），除非它构成对外行为契约（如合并缓存失效语义）。
- 不覆盖纯演示性质/示例级功能（contextmenu、scrollbar 样式、seq、stripe、theme 等基础展示项），后续按需补充。
- 不修改 docs-src/ 站点内容；发现的文档与代码差异仅在规格中标注，不做代码修复。

## Decisions

**D1：能力划分按「功能域」而非「文件/hook」划分。**
11 个能力：`virtual-scroll`、`fixed-columns`、`multi-level-header`、`sorting`、`tree-table`（含行展开）、`merge-cells`、`cell-highlight`、`area-selection`、`column-management`（列宽调整 + 表头拖动）、`row-drag`、`custom-cells`。
理由：capability 是行为契约单位，与文档站的功能页组织一致，便于对照验证；按源码文件划分会把同一行为（如排序散落在 useSorter + StkTable）切碎。
备选：单一 `stk-table` 大规范——被否，单文件过大且无法按功能增量演进。

**D2：行展开（expand）并入 `tree-table` 能力。**
两者同属「行的展开类行为」，且共享展开状态注入与虚拟滚动兼容约束；避免为两个小功能各建一个能力目录。

**D3：列宽调整与表头拖动合并为 `column-management`。**
两者共享 `v-model:columns` 回写契约与禁用函数配置形态，行为耦合度高。

**D4：基线规范以「当前实际行为」为准，文档与代码不一致处以代码为准并在规格中标注。**
已发现差异：`row-order-change` 事件文档类型声明参数为 rowKey，实现（useTrDrag）实际传递行索引；规格中记录该差异并标注后续应统一。
理由：specs 是行为契约基准，必须以可观察的真实行为为准，否则首次验证即失败。

**D5：config.yaml 的 rules 只记录会实际影响工件产出的约定。**
包括：代码改动必须同步 docs-src 文档（含多语言镜像与 CHANGELOG）、commit message 使用英文、specs 与工件用中文书写、公共 API 变更需登记到 docs-src/main/api/expose.md。不放入与 OpenSpec 工件无关的规则。

## Risks / Trade-offs

- [基线规范与实际行为存在遗漏或偏差] → 规范内容均取自 docs-src 与源码核对（如 useTrDrag 事件参数），归档前可用 `openspec validate --strict` 复核；后续变更中若发现矛盾，通过 MODIFIED delta 修正。
- [11 个能力的维护成本] → 每个 spec 保持精简（只写对外契约），新增功能时按能力路径挂 delta，不重写基线。
- [基线规范在归档时才写入 openspec/specs/] → 本变更实现阶段只写 changes/add-project-specs/specs/ 下的 delta；归档（archive）后成为正式基线，中间窗口期 specs/ 仍为空，属预期行为。
