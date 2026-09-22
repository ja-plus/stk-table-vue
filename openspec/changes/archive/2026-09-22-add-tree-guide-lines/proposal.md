# 树形层级引导线（Indent Guide Lines）

## Why

当前树形表格仅通过 `padding-left`（每层 16px）缩进体现层级关系，在多层嵌套或大数据场景下，用户难以直观判断某一子行归属于哪个父节点、层级如何对齐。业界常见树组件（VS Code、Ant Design `showLine` 等）都在缩进区域绘制竖向引导线以增强层级可读性，本组件缺失该能力。

## What Changes

- 新增 `treeConfig.showGuide?: boolean`（默认 `false`）：开启后在 `tree-node` 列的缩进区域为每一层级绘制一条竖向引导线，关闭时行为与现状完全一致（无回归）。
- 引导线随虚拟滚动正确渲染：每行独立渲染自身经过的层级引导线段，纵向拼接形成连续视觉线条。
- 引导线颜色/线宽通过 CSS 变量暴露，可被使用方主题覆盖。
- 文档同步范围（公共 API + 行为变更）：
  - `docs-src/main/api/table-props.md`（`treeConfig` 新增 `showGuide` 字段说明）
  - `docs-src/main/table/basic/tree.md`（新增「层级引导线」小节与示例）
  - `docs-src/en|ja|ko/main/` 对应镜像页面
  - `CHANGELOG.md`（记录公共 API 新增）

## Capabilities

### New Capabilities

（无新增能力，归入既有树形能力。）

### Modified Capabilities

- `tree-table`：新增「层级引导线展示」需求——`treeConfig.showGuide` 开启时在 `tree-node` 列缩进区域按层级渲染竖向引导线，关闭时保持既有纯缩进行为。

## Impact

- 类型：`src/StkTable/types/index.ts` 的 `TreeConfig` 增加 `showGuide` 字段。
- 组件：`src/StkTable/components/TreeNodeCell.vue` 增加引导线渲染；`StkTable.vue` 向该单元格传递 `showGuide`。
- 样式：新增引导线相关 CSS 变量与类名（暗/亮主题均可覆盖）。
- 文档站与 CHANGELOG（见上）。
- 无破坏性变更，默认关闭，零第三方依赖不变。
