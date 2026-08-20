# 任务清单：scrollTo 两轴同构 options 重载

## 1. 类型定义与导出

- [x] 1.1 在 `src/StkTable/types/index.ts` 新增 `ScrollAxisTarget`（`index?` / `key?: string | number` / `px?`）与 `ScrollToOptions`（`top?` / `left?` 均为 `number | ScrollAxisTarget`，`behavior?: ScrollBehavior`），附 JSDoc（见 design.md D7）
- [x] 1.2 从包根导出新类型（对齐现有类型导出位置，如 `src/StkTable/index.ts`），确认 `import type { ScrollAxisTarget, ScrollToOptions } from 'stk-table-vue'` 可用

## 2. 轴目标解析工具

- [x] 2.1 新增行高累加函数 `getRowsHeight(count)`（建议放 `useVirtualScroll.ts` 并从其返回值导出）：固定行高走 `index * rowHeight`；autoRowHeight 按「实测/setAutoHeight 值 → expectedHeight → rowHeight」顺序累加（design.md D3）
- [x] 2.2 新增列位置解析（`StkTable.vue` 内或就近工具）：累加目标列之前各列 `getCalculatedColWidth`，算法与 `useAreaSelection.getColPosition` 一致，但不改动 useAreaSelection（design.md D4/D5）
- [x] 2.3 实现 key → 索引查找：top 轴遍历 `dataSourceCopy` 用 `rowKeyGen` 比对；left 轴在 `tableHeaderLast` 中按 `dataIndex` findIndex
- [x] 2.4 实现通用 `resolveAxis(target, resolvers) → number | null`：number 直返；对象按 index 优先于 key 解析基准，叠加 px；解析失败返回 null（design.md D2）

## 3. scrollTo 重载与滚动执行

- [x] 3.1 `StkTable.vue` 中为 `scrollTo` 增加重载签名（`ScrollToOptions` 分支 + 原数字分支），实现签名改为 `(options?: ScrollToOptions | number | null, leftArg?: number | null)`；首参为对象且非 null 走 options 分支，数字/null/undefined 路径逐字保留（design.md D1）
- [x] 3.2 options 分支：两轴分别 `resolveAxis`，null 轴跳过；解析结果钳制到 [0, maxScrollTop] / [0, maxScrollLeft]（基于理论内容尺寸，见 design.md D7）；复用现有数字滚动路径（含 experimental scrollY 的 `updateVirtualScrollY` + `updateCustomScrollbar`）
- [x] 3.3 实现 `behavior: 'smooth'` 的 rAF 动画（ease-out，约 300ms）：逐帧走与用户滚动相同的路径，末帧精确落点；新调用取消旧动画；容器 `wheel`/`touchstart` 时取消动画；两种滚动模式行为一致（design.md D6）
- [x] 3.4 确认 `defineExpose` 暴露的 `scrollTo` JSDoc 更新为新签名说明

## 4. 测试

- [x] 4.1 新增/补充 `test/scrollTo.test.js`：数字重载回归（双轴坐标、null 不变轴、省略默认 0）
- [x] 4.2 options 数字坐标用例：双轴、单轴省略不变、空对象 no-op
- [x] 4.3 top 轴对象用例：按 index、按 key、px 叠加、仅 px、autoRowHeight 变高解析、越界 index 与缺失 key 静默跳过、index 优先 key
- [x] 4.4 left 轴对象用例：按列 index、按 dataIndex、两轴同时定位、越界静默跳过
- [x] 4.5 边界钳制用例：负 px 钳制为 0、超上界钳制为最大值
- [x] 4.6 behavior 用例：默认/auto 立即跳转；smooth 通过推进 rAF 验证末帧落点（覆盖非 experimental 与 experimental scrollY 两种模式）
- [x] 4.7 新增类型测试（type-tests 或等效 tsc 校验）：`ScrollToOptions` 各合法形态可编译、`scrollTo(20)` / `scrollTo(null, 10)` 旧形态可编译、非法字段（如 `top: 'x'`）报错
- [x] 4.8 运行既有回归测试套件，确认键盘滚动、区域选择等内部调用方不受影响

## 5. 文档同步（Code-Docs Sync，独立任务项）

- [x] 5.1 更新 `docs-src/main/api/expose.md` scrollTo 段落：options 重载签名块、`ScrollAxisTarget`/`ScrollToOptions` 类型块、两轴语义（index/key/px 含义与索引空间）、behavior 说明、示例代码、`::: tip` 说明「options 省略轴 = 不改变」与数字重载「省略 = 0」的差异
- [x] 5.2 同步 `docs-src/en|ja|ko/main/api/expose.md` 镜像
- [x] 5.3 `CHANGELOG.md` 新增 feat 条目（英文）：scrollTo 新增 options 重载与公共类型，数字重载不变

## 6. 验证与提交

- [x] 6.1 全量测试 + 类型检查通过后，用英文 commit message 提交（如 `feat: add options overload to scrollTo with two-axis index/key targeting`）
- [x] 6.2 自查：以 `scrollTo` 关键词全局搜索 `docs-src/`，确认所有命中页面已同步或确认无需更新
