## Why

当前树形表格（`useTree.ts`）要求 `dataSource` 一次性携带完整 `children` 嵌套数据，`flatTreeData` 全量展平。对"节点子级需按需拉取"的层级数据（组织树、目录树、万级节点）无法工作：要么被迫一次灌全量（首屏慢、内存高），要么由使用方手写展开监听 + 改 `dataSource` + 重算展平（重复造轮子、易错、无加载态）。Element Plus、vxe-table、Ant Design 均把"树形懒加载"列为标配能力，本库缺失。

## What Changes

- 新增树形**懒加载**能力：`treeConfig.lazy` 开启后，展开一个"有子节点但尚未加载"的行时，组件调用 `treeConfig.loadMethod(row, col)`（返回 `Promise<row[]>`），把返回的子节点并入展平数据并展示，全程由组件管理加载态，使用方只提供取数函数。
- 新增**可展开判定**：以数据字段标志区分"未加载的分支"与"叶子节点"（默认字段 `hasChildren`，可经 `treeConfig.hasChildField` 配置）。`TreeNodeCell` 的展开箭头从"仅 `children !== undefined` 显示"改为"`children` 已存在 或 `hasChildren` 为真 即显示"。
- 新增**加载态反馈**：加载中在 tree-node 单元格箭头位置内置 loading 图标，并在行上注入 `@private` 状态字段 `__T_LOADING__` 与整行（`<tr>`）类名 `is-tree-loading`（样式可覆盖）。
- 新增**缓存与刷新语义**：某节点 `loadMethod` 成功后缓存（记 `__T_LOADED__`），再展开/收起不重复请求；新增实例方法 `reloadTreeNode(rowKeyOrRow)` 强制重载单个已加载节点。
- 新增**约束**：`lazy` 为真时，`treeConfig.defaultExpandAll` 与 `setTreeExpand(..., { all: true } / { level })` 遇到未加载分支即停止展开（不隐式链式请求），与 `parents` 模式一致——`parents` 路径经过未加载祖先时按需链式 `await loadMethod` 逐级加载后展开，加载失败则中断并告警。
- 新增对外事件 `@toggle-tree-expand` 复用：懒加载触发前后不新增事件，加载完成/失败通过 `loadMethod` 的 Promise resolve/reject 由使用方感知（可选 `treeConfig.onLoadError`）。
- 文档同步范围（公共 API：`treeConfig` 新字段 + `reloadTreeNode` 实例方法 + 行为约束）：`docs-src/main/api/table-props.md`（treeConfig）、`docs-src/main/api/expose.md`（reloadTreeNode）、`docs-src/main/table/basic/tree.md` 新增"懒加载"小节与示例、`docs-src/en|ja|ko` 对应镜像页、`CHANGELOG.md`、`llms.txt`。

## Capabilities

### New Capabilities
<!-- 无新增独立 capability；懒加载属于 tree-table 既有能力的行为扩展。 -->

### Modified Capabilities
- `tree-table`: 新增"树形子节点懒加载"相关 REQUIREMENT —— 懒加载触发与并表、可展开标志判定、加载态反馈、缓存与单节点刷新、`lazy` 与全展开/`parents` 的交互约束。

## Impact

- 代码：`src/StkTable/types/index.ts`（`TreeConfig` 扩展 `lazy`/`loadMethod`/`hasChildField`/`onLoadError`；行注入 `__T_LOADING__`/`__T_LOADED__` `@private` 字段）、`src/StkTable/useTree.ts`（展开分支：命中未加载子节点走异步加载再展平、缓存与状态维护、`reloadTreeNode`）、`src/StkTable/components/TreeNodeCell.vue`（可展开判定 + loading 图标）、`src/StkTable/StkTable.vue`（`defineExpose` 暴露 `reloadTreeNode`、`getTRProps`/class 注入 `is-tree-loading`）、`src/StkTable/style.less`（loading 图标与状态类样式）。
- 内部状态：展平链路 `flatTreeData`/`expandNode`/`privateSetTreeExpand` 需在展开前完成异步并表，注意 `dataSourceCopy` 引用与虚拟滚动总高度/行高随并表更新。
- 兼容：Vue 3 与 Vue 2.7 双版本；`lazy` 默认关闭，不改变既有"全量 children"树形行为，向后兼容、无破坏性变更。
- 不做（v1）：不做虚拟滚动下的"节点回收/卸载后再加载"（懒加载结果常驻内存）；不引入任何第三方依赖。
- 测试：`test/` 新增懒加载单测（触发、缓存、失败、`parents` 链式、与全展开约束）；`docs-demo/` 新增树形懒加载示例。
- 文档/AI 资产：见上"文档同步范围"，随后 `pnpm ai:check`、`pnpm test`、`pnpm docs:build`。
