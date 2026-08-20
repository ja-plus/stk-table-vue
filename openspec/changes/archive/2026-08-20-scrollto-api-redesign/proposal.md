# 提案：重新设计 scrollTo 实例方法（两轴同构 options 重载）

## Why

当前 `scrollTo(top, left)` 只支持像素坐标，无法按行索引 / rowKey / 列索引 / dataIndex 定位；此前对齐 Naive UI Virtual List 的尝试已回退（其 `index` 是一维模型，无法表达二维表格的横向列定位）。项目内部已有 2D 定位能力（`getRowsHeight`、`getColPosition`），需要一个两轴同构、向后兼容的公共 API 将其暴露出来。

## What Changes

- 新增 `scrollTo(options)` 重载，旧数字重载 `scrollTo(top?: number | null, left?: number | null)` 签名与语义**完全不变**（`null` = 不改变该轴，省略 = 0）；
- options 形态：`{ top?: number | ScrollAxisTarget, left?: number | ScrollAxisTarget, behavior?: ScrollBehavior }`；
- `ScrollAxisTarget = { index?: number, key?: string | number, px?: number }`：两轴同构——
  - `top` 轴：`index` 为当前展示顺序（排序/筛选/树展开后）的 0 起始行索引，`key` 按 `props.rowKey` 定位行；
  - `left` 轴：`index` 为叶子列（tableHeaderLast）索引，`key` 按列 `dataIndex` 定位列；
  - `px` 为解析后的附加偏移量；
- 轴对象统一解析为绝对像素坐标后执行滚动，目标不存在（越界 index / 找不到 key）时该轴不滚动；options 形式中省略的轴等价于 `null`（不改变），与旧数字重载的 `null` 语义一致；
- `behavior` 取值同原生 `ScrollToOptions.behavior`（`'auto' | 'instant' | 'smooth'`），默认 `'auto'`；
- 从包根导出公共类型 `ScrollAxisTarget`、`ScrollToOptions`；
- **文档同步范围**（公共 API 变更）：`docs-src/main/api/expose.md` 中文主文档 + `en/ja/ko` 镜像、`CHANGELOG.md`；
- 新增单元测试与类型测试覆盖新重载。

## Capabilities

### New Capabilities

- `scroll-navigation`: 表格程序化滚动定位 API——数字坐标重载、options 重载、两轴（top/left）按 number / index / key / px 定位目标、behavior 平滑滚动、边界与无效目标处理。

### Modified Capabilities

（无。`virtual-scroll` 等现有 spec 的需求不发生变化，本变更是纯增量的公共 API。）

## Impact

- **代码**：`src/StkTable/StkTable.vue`（scrollTo 增加重载分支与目标解析）、`src/StkTable/types/index.ts`（新增 `ScrollAxisTarget` / `ScrollToOptions` 类型并从包根导出）；行高累加与列位置计算为新增工具逻辑（当前 master 无 `getRowsHeight`；等价的列宽累加逻辑仅存在于 `useAreaSelection` 内部的 `getColPosition`，实现时可提取复用）；滚动执行复用现有 `scrollTo(top, left)` 的数字路径（含 experimental scrollY 分支）；
- **公共 API**：`defineExpose` 的 `scrollTo` 新增对象参数重载；新增导出类型；无破坏性变更；
- **文档**：`docs-src/main/api/expose.md` 及 `en/ja/ko` 镜像、`CHANGELOG.md`；
- **测试**：新增 `test/scrollTo.test.js`（或追加用例）与 `type-tests/` 类型用例；
- **依赖**：无新增运行时依赖。
