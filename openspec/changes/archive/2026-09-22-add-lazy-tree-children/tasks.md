## 1. 类型与私有字段（先行，其他任务依赖）

- [x] 1.1 在 `src/StkTable/types/index.ts` 的 `TreeConfig` 增加 `lazy?: boolean`、`loadMethod?: (row, col) => Promise<row[]>`、`hasChildField?: string`（默认 `'hasChildren'`）、`onLoadError?: (error, row, col) => void`，补中文 JSDoc，并 `npx tsc --noEmit -p tsconfig.json` 通过（EXIT=0）
- [x] 1.2 在行类型（`PrivateRowDT` / 树行相关类型）补 `@private` 字段 `__T_LOADING__?: boolean`、`__T_LOADED__?: boolean`，JSDoc 标注对外不可见，`npx tsc --noEmit` 通过
- [x] 1.3 验证 Vue 2.7 与 Vue 3 双版本类型均无报错（对应 tsconfig/构建入口），确认新增字段不破坏既有树形类型

## 2. 可展开判定 helper

- [x] 2.1 在 `useTree.ts` 新增 `isExpandable(row)`：`row.children !== undefined || (treeConfig.lazy && Boolean(row[hasChildField ?? 'hasChildren']))`，作为唯一口径
- [x] 2.2 `TreeNodeCell.vue` 的箭头显示条件由 `row.children !== void 0` 改为调用 `isExpandable(row)`；补单测覆盖"未加载但 hasChildren=true 显示箭头 / 叶子不显示箭头"两个 scenario

## 3. 异步加载核心 ensureChildrenLoaded + 展开改造

- [x] 3.1 在 `useTree.ts` 新增 `ensureChildrenLoaded(row, col): Promise<boolean>`：命中"未加载分支"（`lazy && !row.children?.length && isExpandable(row) && !row.__T_LOADED__`）时置 `__T_LOADING__=true` → `await loadMethod(row,col)` → 成功写 `row.children`、`__T_LOADED__=true`、清 `__T_LOADING__` 返回 true；reject 清 `__T_LOADING__`、不置 `__T_LOADED__`、调用 `onLoadError`、返回 false
- [x] 3.2 竞态防护：入口若 `row.__T_LOADING__` 为真则复用进行中 Promise 或直接 return，避免快速连点重复请求；补测"加载中重复点击不二次触发"
- [x] 3.3 `toggleTreeNode` 改 async：展开分支先 `await ensureChildrenLoaded`，返回 true 才继续走既有 `privateSetTreeExpand` 的 splice 展平；收起分支保持同步不变
- [x] 3.4 沿用 `privateSetTreeExpand` 末尾"赋新 `dataSourceCopy` 数组引用 + `onDataSourceChange()`"驱动虚拟滚动重算；补测"展开未加载分支 → resolve 后子行紧随父行展示""收起再展开不重复调用 loadMethod"

## 4. 加载态 UI 与样式

- [x] 4.1 `getTRProps`（`StkTable.vue`）对 `row.__T_LOADING__` 的行（`<tr>`）追加 `is-tree-loading` 类名（仅作可覆盖钩子）
- [x] 4.2 `TreeNodeCell.vue` 在 `__T_LOADING__` 为真时以 loading spinner 图标替换 `TriangleIcon`（纯 CSS 动画，零依赖）
- [x] 4.3 `src/StkTable/style.less` 新增 loading spinner 关键帧与 `--tree-loading-color`（暗/亮主题变量适配）；补测"加载中整行带 `is-tree-loading` 类与 loading 图标、settle 后消失"

## 5. 批量展开约束与 parents 链式加载

- [x] 5.1 `recursionFlat`/`expandNode`/`setDescendantsToLevel`：`lazy` 下遇到"未加载分支"即停止向下、不触发 `loadMethod`；补测"全展开遇未加载分支即停（scenario）"
- [x] 5.2 `setTreeExpand(row, { parents: true })` 的 `lazy` 分支改 async：从根逐层 `await ensureChildrenLoaded` 补齐未加载祖先 `children` 后定位下一层；任一失败中断并 `console.warn`；其余分支保持同步语义
- [x] 5.3 补测"parents 链式加载使深层目标行可见""某祖先加载失败在该处中断"两个 scenario

## 6. 单节点强制刷新 reloadTreeNode

- [x] 6.1 在 `useTree.ts` 实现 `reloadTreeNode(rowKeyOrRow)`：定位行 → 清 `__T_LOADED__`/`__T_LOADING__` → `foldNode` 删除旧子树行 → `await ensureChildrenLoaded` → 展开中则 `expandNode` 插回、折叠中仅更新数据；在 `StkTable.vue` `defineExpose` 暴露
- [x] 6.2 补测"对已展开节点调用 reloadTreeNode 用新结果替换子树、展开区更新"

## 7. 文档同步（与代码同一改动，不可省略）

- [x] 7.1 `docs-src/main/api/table-props.md`：`treeConfig` 增补 `lazy`/`hasChildField`/`loadMethod`/`onLoadError` 说明与签名
- [x] 7.2 `docs-src/main/api/expose.md`：登记 `reloadTreeNode(rowKeyOrRow)`（用途、签名、可运行示例、适用/不适用场景）
- [x] 7.3 `docs-src/main/table/basic/tree.md`：新增"懒加载子节点"小节 + 示例；`docs-demo/` 新增树形懒加载 demo 组件（示例代码须与实际 API 签名一致、可直接运行）
- [x] 7.4 多语言镜像 `docs-src/en|ja|ko/main/...` 对应页面同步（中文主文档优先，能翻译则一并更新）
- [x] 7.5 `CHANGELOG.md` 记录公共 API 新增（`treeConfig.lazy/loadMethod/hasChildField/onLoadError` + `reloadTreeNode`）

## 8. 验证与收尾

- [x] 8.1 用改动关键词（`lazy`/`loadMethod`/`reloadTreeNode`/`hasChild`）再次全局搜索 `docs-src/`，确认所有命中页面已更新或确认无需更新
- [x] 8.2 `npx vitest run` 全绿（含新增懒加载用例）
- [x] 8.3 `npx tsc --noEmit -p tsconfig.json` 无错误
- [x] 8.4 `pnpm docs:build` 成功（生成 llms.txt / llms-full.txt）
- [ ] 8.5 手动回归：Vue 3 与 Vue 2.7 下 `lazy=false` 既有树形行为零变化（向后兼容验证）
