## Context

动机见 `proposal.md - Why`，对外行为契约见 `specs/tree-table/spec.md`（ADDED Requirements）。此处只记录影响实现方案的现状与约束：

- 树形核心在 [`useTree.ts`](file:///d:/mycode/stk-table-vue/src/StkTable/useTree.ts)：`toggleTreeNode(row, col)` → `privateSetTreeExpand(...)` **同步**地 `dataSourceCopy.value.slice()`、`expandNode`/`foldNode` 增删展平行，末尾赋新数组引用 + `onDataSourceChange()`。`findPath` 依赖原始 `props.dataSource` 的 `children` 递归定位。
- 展平入口 `flatTreeData`/`recursionFlat` 按 `item.__T_EXP__` 递归展开 `item.children`；`defaultExpandAll/Level/Keys` 仅首次渲染（`isFirstLoad`）生效。
- [`TreeNodeCell.vue`](file:///d:/mycode/stk-table-vue/src/StkTable/components/TreeNodeCell.vue) 当前仅 `v-if="row.children !== void 0"` 显示 `TriangleIcon`——懒加载下子节点未加载即 `children` 不存在，箭头不显示，是必须改的判定点。
- 行注入字段约定：`__T_EXP__`（展开态）、`__T_LV__`（层级）；`dataSourceCopy` 为 `shallowRef`，靠"赋新数组引用"驱动重渲染，非深层响应。
- `TreeConfig` 现仅 `defaultExpandAll/defaultExpandKeys/defaultExpandLevel`（[types/index.ts](file:///d:/mycode/stk-table-vue/src/StkTable/types/index.ts#L330-L335)）。
- 需同时支持 Vue 3 与 Vue 2.7。

## Goals / Non-Goals

**Goals:**
- 以最小侵入在既有展平链路上加"展开前异步补 `children`"的一步，不重写 `useTree`。
- 加载态、可展开判定、缓存、单节点刷新的对外行为与 spec 一致，且 `lazy=false` 时零行为变化。

**Non-Goals:**
- 不做"折叠即卸载子树以省内存 / 再次展开重新加载"（懒加载结果常驻，除非 `reloadTreeNode`）。
- 不改树形展平的全量 `onDataSourceChange` 性能模型（增量展平不在 v1）。
- 不引入第三方依赖，不做服务端分页块加载（那是数据源层的事，`loadMethod` 由使用方实现）。

## Decisions

### D1：异步加载收敛到"展开前的补数步骤"，不改整体同步结构
新增内部 `ensureChildrenLoaded(row, col): Promise<boolean>`：命中"未加载分支"（`lazy && !row.children?.length && isExpandable(row) && !row.__T_LOADED__`）时，置 `row.__T_LOADING__ = true`、`await loadMethod(row, col)`，成功则 `row.children = result` 且 `row.__T_LOADED__ = true`、`__T_LOADING__ = false`，返回 true；reject 则清 `__T_LOADING__`、不置 `__T_LOADED__`（可重试）、调用 `onLoadError`、返回 false。`toggleTreeNode` 改为 async：展开分支先 `await ensureChildrenLoaded`，true 才继续走既有 `privateSetTreeExpand` 的 splice 展平。
- 理由：把异步隔离在"是否要加载"这一层，展平/缓存/并表复用现有同步代码，改动面最小。
- 备选：把 `privateSetTreeExpand` 整体改异步——会波及 collapse、批量展开等所有调用点，收益低、风险高，弃用。

### D2：可展开判定统一 helper，默认字段 `hasChildren`
新增 `isExpandable(row)`：`row.children !== undefined || (treeConfig.lazy && Boolean(row[hasChildField]))`，`hasChildField` 默认 `'hasChildren'`（`treeConfig.hasChildField` 可配）。`TreeNodeCell` 显示箭头、`toggleTreeNode`/`ensureChildrenLoaded` 判定均调用它，避免三处口径漂移。
- 理由：与 Element(`hasChildren`)、vxe(`hasChild`) 同构，数据驱动，无需额外接口。

### D3：加载态用行私有字段 `__T_LOADING__` + 整行类名，不用全局 Set
`__T_LOADING__` 挂在行对象上（`@private`，`types` 里补 `PrivateRowDT` 字段），`getTRProps` 对 `row.__T_LOADING__` 的行（`<tr>`）push `is-tree-loading` 类；`TreeNodeCell` 内 `__T_LOADING__` 为真时用 loading 图标（CSS 动画的 spinner）替换 `TriangleIcon`。
- 理由：行字段随 rowKey 稳定、跨虚拟滚动帧天然保持，无需额外 Map 维护与清理；同时暴露类名满足"样式可覆盖"。
- 备选：组件级 `Set<rowKey>` —— 需处理展平/回收时机与内存回收，反而复杂。

### D4：批量展开遇未加载即停，parents 模式按需链式加载
- `recursionFlat`/`expandNode`/`setDescendantsToLevel`：`lazy` 下遇到"未加载分支"（无 `children` 且非 `__T_LOADED__`）即不再深入，MUST NOT 触发 `loadMethod`（保持同步、可预测，对齐 Element"lazy 禁 default-expand-all"）。
- `setTreeExpand(row, { parents: true })`：`findPath` 依赖原始 `children`，未加载祖先不在原始树中。因此 `parents + lazy` 分支改为 async：从根逐层向下，对路径上"未加载祖先" `await ensureChildrenLoaded` 补 `children` 后再定位下一层；任一失败即中断并 `console.warn`。该方法返回值在该分支下为 `Promise<void>`（其余分支保持同步语义不变）。
- 理由：用户已确认 parents 需链式加载；全展开即停避免"点一次展开全部触发 N 个网络请求"的失控。

### D5：`reloadTreeNode` 复用加载路径
expose `reloadTreeNode(rowKeyOrRow)`：定位行 → 清 `__T_LOADED__`/`__T_LOADING__` → 置为未加载 → 走 `ensureChildrenLoaded` + 重算该子树展平（`foldNode` 删除旧子树行，`await` 后 `expandNode` 插回）。展开中则原地刷新，折叠中则仅更新数据不强制展开。

### D6：并表后仍走既有 `onDataSourceChange`
加载成功插入子行后，沿用 `privateSetTreeExpand` 末尾"赋新数组引用 + `onDataSourceChange()`"驱动虚拟滚动总高度/窗口重算，不新建增量通道（Non-Goal）。

## Risks / Trade-offs

- [异步展开竞态：快速连点同一/多个节点] → 同行 `__T_LOADING__` 期间忽略重复触发（`ensureChildrenLoaded` 入口判 `__T_LOADING__` 直接 return false 或复用进行中的 Promise）；`TreeNodeCell` 加载中箭头置为 spinner 不可点。
- [`parents` 分支变 async，调用方未 await] → 行为仍是"尽力展开"，await 与否不影响最终渲染，仅影响调用方何时拿到完成时机；文档标注该分支返回 Promise。
- [Vue 2.7 下给已渲染行对象新增 `children`/`__T_*__` 不触发深层更新] → 依赖"赋新 `dataSourceCopy` 数组引用"整体重渲染驱动，不依赖行对象深层响应；实现首步写最小验证用例（见 tasks 1.x）。
- [懒加载子树仍全量 `onDataSourceChange` O(N)] → 大树反复展开有成本。缓解：沿用既有"树形与虚拟列表兼容"口径——频繁变化大数据树由使用方评估；文档提示单次加载量。
- [原地 mutate 行破坏 `__T_EXP__`/新增 `__T_LOADING__`] → 复用现有"使用方更新行 MUST NOT 改 `__T_*__`"约束并在文档补充。

## Migration Plan

1. 纯新增：`TreeConfig` 加字段、行加 `__T_LOADING__/__T_LOADED__` 私有字段、expose 加 `reloadTreeNode`；`lazy` 默认 false，既有树形路径不变。
2. 实现顺序：types → helper/isExpandable → ensureChildrenLoaded + toggleTreeNode async 化 → TreeNodeCell/loading 样式 → parents 链式 → reloadTreeNode → 文档/示例/测试。
3. 回滚：移除新字段/方法与 `TreeNodeCell` 判定回退即恢复现状，无数据格式迁移。

## Open Questions

- `loadMethod` 返回 `Promise<row[]>`（采用，vxe 风格）还是 `Promise<{children}>`？—— 定为 `row[]`；如后续要支持"同时回填 `hasChildren`"再扩展对象形态，不影响当前 spec。
- 懒加载根层数据由谁提供？—— 定为仍由 `props.dataSource` 提供首层，`loadMethod` 只负责下钻子层；不改 spec。

## 受影响文档（代码改动与文档同一改动）

- `docs-src/main/api/table-props.md`：`treeConfig` 增补 `lazy`/`hasChildField`/`loadMethod`/`onLoadError` 说明与签名。
- `docs-src/main/api/expose.md`：登记 `reloadTreeNode(rowKeyOrRow)`（用途、签名、示例、适用/不适用场景）。
- `docs-src/main/api/emits.md`：`@toggle-tree-expand` 补充懒加载相关时机说明（若异步导致事件触发点变化）。
- `docs-src/main/table/basic/tree.md`：新增"懒加载子节点"小节 + 可运行示例；`docs-demo/` 新增对应 demo 组件。
- 多语言镜像 `docs-src/en|ja|ko/main/...` 对应页面（至少中文主文档优先，能翻译则同步）。
- `CHANGELOG.md` 记录公共 API 新增；`llms.txt` 增补后跑 `pnpm ai:check`。
