## 1. 点击契约显式化

- [x] 1.1 内置展开控件带上 `data-stk-fold` 属性（保留既有 `stk-fold-icon` 类），验证：内置树表与展开列的点击展开行为不变
- [x] 1.2 `StkTable.vue` 的 `onCellClick` 委托判据由 `closest('.stk-fold-icon')` 改为 `closest('[data-stk-fold], .stk-fold-icon')`，验证：新增单测覆盖「标了 `data-stk-fold` 的自绘节点可切换展开」与「旧类名仍生效」两条路径
- [x] 1.3 补委托的单测：命中展开控件时 MUST NOT 再触发 `cell-selected` / `cell-click`；点击标签文本不触发展开，验证：`test/` 对应用例通过
  - 实现期补记：`#stkFoldIcon` 插槽内容原先自带 `@click`，与表体委托叠加导致**一次点击切换两次**；已去掉直接绑定，`test/treeFoldContract.test.ts` 覆盖「一次点击只切一次」

## 2. 内置装饰件与插槽透传

- [x] 2.1 新增 `src/StkTable/components/TreeIndent.vue`：承载按层级缩进与引导线覆盖层，`showGuide` 关闭时只留缩进，验证：`test/treeCellParts.test.ts` 覆盖开启/关闭与根层无引导线
- [x] 2.2 把 `TreeNodeCell.vue` 中「箭头 / loading 圈 / 叶子占位」的取舍收敛为内置件 `TreeFoldIcon.vue`（三态共用一个元素以保持单根模板），`TreeNodeCell` 改为组合 `TreeIndent` + `TreeFoldIcon`，`TriangleIcon.vue` 下线，验证：`pnpm test` 全绿（`test/treeGuideLine.test.ts` 的宽度断言按 3.3 的新表达改为格数/结构断言，格数语义未弱化）
- [x] 2.3 `StkTable.vue` 的 customCell 分支增传 `#stkTreeIndent` 插槽内容，验证：配了 customCell 的 `tree-node` 列渲染该插槽时缩进与引导线正确，不渲染时无任何残留 DOM 节点
- [x] 2.4 `type:'expand'` 列同受 1.x/2.3 覆盖，验证：customCell 接管展开列时自绘 `data-stk-fold` 控件可切换行展开，未接管时行为不变（`test/treeFoldContract.test.ts` 展开列两用例）

## 3. 类型与主题变量

- [x] 3.1 `src/StkTable/types/index.ts` 的 `CustomCellProps` 增加 `level` / `expandable` / `treeLoading`（均可选，中文 JSDoc 注明只对 `tree-node` 列有实义），并在 `StkTable.vue` 的 customCell 分支注入实际值，验证：`tsc --noEmit` 通过；单测断言懒加载「标记有子节点未加载」行给出 `expandable=true, treeLoading=false`，加载中行给出 `treeLoading=true`
- [x] 3.2 普通（无 `type`）列的 customCell 不注入树相关值且既有 props 不变，验证：单测覆盖「普通列不受影响」场景
- [x] 3.3 `style.less` 引入 `--tree-indent-width`（默认 `16px`）作为缩进格、控件占位格与引导线步长的唯一像素来源，验证：文档站实测默认步进 16px、覆盖为 20px 后缩进与引导线同步
  - 实现期修正一：内置件只输出**格数**（`--stk-tree-indent-cells`），宽度算式收在样式表——内联 `calc(var(...) * N)` 会被 happy-dom 的 CSSOM 整条丢弃，无法断言；同时取消 `--stk-tree-guide-cells`
  - 实现期修正二：引导线只覆盖祖先各格（0..level-1），叶子行自身控件格不再画线；引导线的定位上下文收进内置缩进格，使用方根元素不再被要求提供 `position: relative`

## 4. 示例与集成验证

- [x] 4.1 示例落位：新建 Demos 页 `docs-src/demos/custom-tree-cell.md`（en/ja/ko 同路径），demo 目录 `docs-demo/demos/CustomTreeCell/`（`index.vue` + 同目录 `FolderCell.vue` / `TagCell.vue` / `fileTreeData.ts`），同页并排两张表——① 自绘文件夹开 / 合图标作展开控件（带 `data-stk-fold`，并覆盖 `--tree-indent-width: 20px`）② 消费 `stkTreeIndent` + `stkFoldIcon` 两个插槽、只自定义标签；`tree.md`（4 语言）自定义小节改为链接到该 Demos 页，`slots.md` / `custom-cell.md` / `table-props.md` 的示例链接同步指向它；Demos 导航在「实时合并单元格」之后插入新条目（4 语言 config）；`llms.txt` 的 Demo 页清单同步。验证：浏览器实测两表各 13 行、单击折叠 13→6 再点回 13、`--tree-indent-width` 只作用于第一张表（20px / 16px 互不串味）

- [x] 4.2 回归与实测：`pnpm test`（199 用例，含 `test/perf/scrollPerf.test.js`）全绿；浏览器实测树页样例——单击即切换、`data-stk-fold` 与旧类名两条委托路径均可用、内置箭头展开态 `rotate(90deg)` 生效、引导线高度撑满整行（28/28）且右沿恰与控件格相接（无线穿过图标）、`--tree-indent-width` 覆盖后缩进与引导线同步
  - 固定列场景：引导线现定位在内置缩进格内，包含块由组件自身提供，原「`td` 为 sticky 抢走包含块」的风险结构性消失，未再单独做像素复验

## 5. 文档同步（与代码视为同一改动）

- [x] 5.1 `docs-src/main/api/slots.md` 新增「customCell 侧插槽」小节，登记 `stkFoldIcon`（补文档）、`stkTreeIndent`、`stkDragIcon`，写明「这是 customCell 组件的插槽，不是 StkTable 顶层插槽」+ 摆放契约；en/ja/ko 同步
- [x] 5.2 `docs-src/main/table/advanced/custom-cell.md`：`CustomCellProps` 类型转抄补 `level` / `expandable` / `treeLoading`，并加「树节点列 / 展开列」提示块指向树形页配方；en/ja/ko 同步
- [x] 5.3 `docs-src/main/table/basic/tree.md` 新增「用 customCell 自定义树节点（替换展开图标）」小节（两条示例 + 契约 tip）；`table-props.md` 的 `showGuide` tip 与 `stk-table-column.md` 的 `customCell` JSDoc 补接管语义与上下文说明；四语言同步
- [x] 5.4 `docs-src/en|ja|ko/` 同路径页面同步（5.1–5.3 共 4 语言 × 5 页），并同步 `showGuide` 的「只画祖先各格」新语义
- [x] 5.5 更新 `llms.txt`（§3.2 props、§5.1 customCell 侧插槽、坑 #15、`--tree-indent-width`）与 `CHANGELOG.md`（Unreleased：新增能力 + customCell 双切换 bugfix，无 BREAKING），验证：`pnpm ai:gen` 后包根 `llms.txt` 版本戳正确

## 6. 收尾验证

- [x] 6.1 运行 `pnpm test` 与 `pnpm docs:build` 全绿；用改动关键词（`data-stk-fold`、`stkTreeIndent`、`stkFoldIcon`、`expandable`、`treeLoading`、`--tree-indent-width`、`--stk-tree-indent-cells`）再次全局搜索 `docs-src/`、`llms.txt` 与 `src/`，确认命中页面均已更新或确认无需更新，验证：命令退出码为 0 且自查清单无遗漏
