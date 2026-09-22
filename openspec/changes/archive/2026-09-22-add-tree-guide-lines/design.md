## Context

动机见 [proposal.md](./proposal.md)，行为契约见 [specs/tree-table/spec.md](./specs/tree-table/spec.md)。

当前状态与约束：

- 树形层级由展平数据的行字段 `__T_LV__`（0 表示根）表达，`TreeNodeCell.vue` 用 `padding-left: __T_LV__ * 16px` 做缩进；行上并无"是否父节点的最后子节点""祖先链"等结构信息（`useTree.ts` 中 `__T_P_K__` 相关逻辑已注释、未启用）。
- 单元格处于 `<table>` 原生结构中，纵向虚拟滚动下每行 DOM 随可见区间动态创建/销毁，引导线必须能逐行独立渲染，不能依赖跨行 DOM。
- 每层缩进宽度固定 16px（与展开箭头 `stk-fold-icon` 宽度一致）。

## Goals / Non-Goals

**Goals:**
- 以最小改动、零新增依赖，在 tree-node 列缩进区域按层级渲染竖向引导线。
- 默认关闭、关闭零回归；随虚拟滚动逐行正确渲染。
- 颜色/线宽走 CSS 变量，主题可覆盖。

**Non-Goals:**
- 不做 VS Code/AntD `showLine` 那种"最后一个子节点处竖线截断 + T 型横连接"的精确树连接线（需要额外的父子/末子追踪，成本高、收益低，本次排除）。
- 不改动 `type: 'expand'` 行展开、懒加载取数逻辑。
- 不引入 `treeConfig` 之外的新顶层 prop。

## Decisions

### 决策 1：引导线用「每行独立竖向线段」而非「精确树连接线」

在 `TreeNodeCell.vue` 内，根据 `row.__T_LV__` 渲染 `level` 条竖向线段（第 0 层 0 条）。每条线段是一个占据对应 16px 缩进列、高度撑满单元格（`position:absolute; top:0; bottom:0;` 或 `100%`）的元素，纵向跨行拼接后视觉上呈现连续引导线。

- 为何不用精确截断（last-child 断线 / T 型）：需要为每行计算其祖先是否为该层最后一个可见兄弟，依赖跨行/父子上下文，与虚拟滚动"只见局部行"冲突，需在展平阶段额外注入字段（如 `__T_P_K__`/`__T_LAST__`），复杂度与回归面显著上升。用户选择的"竖向缩进引导线"风格本身即为每层一根贯穿竖线，无需截断。
- 备选：纯 CSS `repeating-linear-gradient` 背景画线——省去 DOM 节点，但需精确对齐 padding 区域并处理箭头/文本遮挡，跨浏览器细节多；少量 `div` 线段更直观可控。最终选择线段元素方案，实现时若验证背景方案更简洁可替换（不影响对外行为与规格）。

### 决策 2：开关经 `treeConfig.showGuide` 逐层传递

`TreeConfig` 增加 `showGuide?: boolean`（默认 `false`）。`StkTable.vue` 渲染 `col.type === 'tree-node'` 时向 `TreeNodeCell` 传 `:show-guide="props.treeConfig?.showGuide"`；`showGuide` 为假时 `TreeNodeCell` 走既有分支（仅 `padding-left`），不额外渲染线段。

- 为何放 `treeConfig` 而非顶层 props / 常开 CSS：与既有 `lazy`/`hasChildField` 等树配置同处，符合项目风格；常开方案无法表达"关闭零回归"，且强制所有使用方承担 DOM 成本。

### 决策 3：样式变量与主题

新增 CSS 变量（命名对齐既有 `--row-height` 等风格），如：
- `--stk-tree-guide-color`（默认取现有边框/分割线灰，暗色主题下给出对应可见值）
- `--stk-tree-guide-width`（默认 `1px`）

引导线元素类名以 `stk-tree-guide` 前缀（线段用 `stk-tree-guide-line`），遵循既有 `stk-` 命名前缀。样式写入组件样式（`StkTable.vue` 的 style 区，随构建进 `lib/style.css`）。

### 受影响文档页面

- `docs-src/main/api/table-props.md`：`treeConfig` 字段表新增 `showGuide`（含 en 说明、`@version`）。
- `docs-src/main/table/basic/tree.md`：新增「层级引导线」小节 + demo。
- `docs-demo/basic/tree/`：新增示例 `.vue`（在既有 Tree 示例基础上开启 `showGuide`）。
- `docs-src/en|ja|ko/main/table/basic/tree.md` 与 `.../api/table-props.md`：镜像同步。
- `CHANGELOG.md`：记录 `treeConfig.showGuide` 新增。
- 类型 `src/StkTable/types/index.ts` JSDoc（中文 + en）为权威来源。

## Risks / Trade-offs

- [每行线段在视觉上连续但逻辑独立，若行高不一致（auto row height）可能出现线段在行间微小错位] → 线段以单元格为定位上下文撑满整格高度，行与行天然相接；在自动行高 demo 中验证。
- [不做 last-child 截断，深层树的引导线不如 AntD 精确] → 属既定 Non-Goal，规格已限定为"竖向缩进引导线"风格，文档明确说明。
- [新增 DOM 线段增加每行节点数，超深层级放大] → 仅 `tree-node` 列、且需显式开启；层级深度通常有限，影响可控；提供关闭默认值。
