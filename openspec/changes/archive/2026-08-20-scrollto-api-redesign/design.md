# 设计：scrollTo 两轴同构 options 重载

## Context

当前 `scrollTo(top: number | null = 0, left: number | null = 0)`（`StkTable.vue`）仅支持像素坐标：非 experimental 模式直接写容器 `scrollTop`/`scrollLeft`，experimental scrollY 模式纵向走 `updateVirtualScrollY`。此前对齐 Naive UI 的实现已整体回退（备份于 tag `backup/scrollto-naive-ui`，可参考其 smooth 动画与行高累加思路）。现状约束：

- 当前 master **没有**行高累加函数（`getRowsHeight` 是 Naive 时期新增的，已随回退移除）；
- 列位置累加逻辑仅存在于 `useAreaSelection.ts` 内部私有函数 `getColPosition`（依赖 `tableHeaderLast` + `getCalculatedColWidth`），未对外；
- 数字重载被键盘滚动（`useKeyboardArrowScroll`）等内部调用方使用，签名不可动。

动机与范围见 proposal.md；行为契约见 `specs/scroll-navigation/spec.md`。

## Goals / Non-Goals

**Goals:**

- 新增 options 重载：`{ top?, left?, behavior? }`，两轴均可传 `number` 或 `{ index?, key?, px? }`，对象目标统一解析为绝对像素坐标后走既有滚动路径；
- 数字重载零改动（含 `null` 语义与默认值）；
- `behavior: 'smooth'` 在非 experimental 与 experimental scrollY 两种模式下均可用。

**Non-Goals:**

- 不提供"最小距离滚动/可见性判断"（旧 Naive 版 `debounce` 语义），对象目标一律解析为绝对坐标；
- 不提供 `position: 'top' | 'bottom'` 边界快捷方式（可用 `index: 0` / 末行索引或 px 表达）；
- 不重构 `useAreaSelection` 内部的 `getColPosition`（本期不合并两份列宽累加逻辑，见决策 D5）；
- 不引入行高 Fenwick 树加速（用户触发的单次解析，O(n) 可接受）。

## Decisions

### D1 重载判别：首参为对象即走 options 分支

`typeof arg === 'object' && arg !== null` → options 分支；`number | null | undefined` → 原数字路径逐字保留。实现签名：

```ts
function scrollTo(options?: ScrollToOptions | number | null, leftArg?: number | null): void
```

备选：独立新方法（如 `scrollToTarget`）——被否，用户明确要求重载形式，且对象/数字天然可判别。

### D2 轴目标解析为绝对坐标，解析失败该轴跳过

每个轴独立执行 `resolveAxis(target) → number | null`（null = 该轴不滚动）：

- `number` → 原值；
- 对象：基准值 = `index !== undefined` 时按 index 解析（**index 优先于 key**）；否则 `key !== undefined` 时按 key 解析；否则基准为 0。index/key 解析失败（越界/不存在）→ 返回 null；最终值 = 基准 + (`px` ?? 0)。

解析后统一钳制：top ∈ [0, maxScrollTop]，left ∈ [0, maxScrollLeft]。上下界基于**理论内容尺寸**计算（top：全部行高之和 - containerHeight；left：全部列宽之和 - containerWidth），而非 store 中的 `scrollHeight`/`scrollWidth`——后者来自 DOM 测量（`container.scrollHeight`），在初始化早期或无布局环境（如 happy-dom）下为 0，会导致钳制结果错误。

备选：key 优先或同时给出时报错——被否：index 优先是确定性最强、实现最简的规则，文档明确即可。

### D3 top 轴行高解析

- 固定行高：`index * rowHeight`；
- autoRowHeight：累加目标行之前各行高度，取值顺序 = 实测/autoHeight 提供值 → `autoRowHeight.expectedHeight` → `rowHeight`。新增工具函数（建议放 `useVirtualScroll.ts`，与其行高数据源就近），命名 `getRowsHeight(count)`。
- key → 行索引：遍历 `dataSourceCopy` 用 `rowKeyGen` 比对，O(n) 单次可接受。

### D4 left 轴列宽解析

累加目标列之前各列的 `getCalculatedColWidth`（与 `useAreaSelection.getColPosition` 相同算法）。key → 列索引：`tableHeaderLast` 中按 `dataIndex` findIndex。

### D5 列宽累加逻辑暂不合并

本期在 `StkTable.vue`（或 `useVirtualScroll.ts`）新写列位置解析，不改动 `useAreaSelection.ts` 的私有 `getColPosition`。理由：区域选择功能稳定，重构其闭包依赖（`getCalculatedColWidth`、`getFixedColWidths` 注入关系）风险大于收益；两份逻辑均为 O(cols) 简单累加，重复成本极低。后续若引入列宽缓存/Fenwick 优化再统一。

### D6 behavior 实现

- `'auto'`（默认）/ `'instant'`：走既有赋值路径（含 experimental scrollY 的 `updateVirtualScrollY`）。
- `'smooth'`：新增轻量 rAF 动画（ease-out，时长约 300ms，常量可后调）。每帧以与用户滚动相同的路径推进（experimental 模式纵向逐帧 `updateVirtualScrollY`，横向写 `scrollLeft`），保证虚拟窗口、自定义滚动条、`scroll` 事件同步更新；末帧精确落到目标值。新的 `scrollTo` 调用取消上一次未完成动画。非 experimental 模式**不**使用原生 `element.scrollTo({ behavior: 'smooth' })`，因为 experimental/非 experimental 两模式行为需一致且末帧可控、可测试。
- 测试环境（happy-dom）无真实动画：smooth 用例通过推进 rAF（或 mock）验证末帧落点。

### D7 类型与导出

`src/StkTable/types/index.ts` 新增并从包根导出：

```ts
export interface ScrollAxisTarget {
    index?: number;
    key?: string | number;
    px?: number;
}
export interface ScrollToOptions {
    top?: number | ScrollAxisTarget;
    left?: number | ScrollAxisTarget;
    behavior?: ScrollBehavior;
}
```

`key` 取 `string | number`（rowKey 值可能为数字），比用户草案的 `string` 略宽，属兼容性放宽。

### D8 options 省略轴 = 不改变（与数字重载省略 = 0 的差异）

数字重载「省略默认 0」是历史行为，必须保留；options 是新 API，「省略 = 不改变」与 `null` 语义一致、更符合定位场景直觉。该不对称在四语言 expose.md 中明确说明。

## Risks / Trade-offs

- [autoRowHeight 下 `getRowsHeight` 为 O(n)，数万行单次解析约毫秒级] → 用户触发的一次性操作，非滚动热路径，可接受；若 `optimize-virtual-scroll-perf`（Fenwick）落地后切换复用。
- [smooth 动画与用户滚轮并发冲突] → 新调用覆盖旧动画；动画期间用户滚轮产生的 scroll 事件会按常规路径处理，末帧目标值可能与之竞争——动画内检测容器 `wheel`/`touchstart` 事件则取消动画（简单守卫）。
- [experimental scrollY 的 smooth 是自定义代码路径] → 逻辑集中在一个动画函数内，两种模式共用，单测覆盖两种模式末帧落点。
- [index 优先 key 的静默行为可能掩盖调用方笔误] → 文档明确该规则；不做运行时告警以保持 API 安静。

## Migration Plan

纯增量 API，无迁移；发布时在 CHANGELOG 记录 feat 条目。回滚 = 移除 options 分支与新增类型，数字重载不受影响。

## 受影响文档（Code-Docs Sync）

- `docs-src/main/api/expose.md` scrollTo 段落：新增 options 重载签名、`ScrollAxisTarget`/`ScrollToOptions` 类型块、两轴语义与示例、`::: tip` 说明省略轴差异；
- `docs-src/en|ja|ko/main/api/expose.md` 同步翻译；
- `CHANGELOG.md` 记录 feat。

## Open Questions

- smooth 动画时长与缓动曲线具体参数（不影响规格，实现时定）。
