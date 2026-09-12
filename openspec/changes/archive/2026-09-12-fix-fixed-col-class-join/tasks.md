## 1. 核心修复

- [x] 1.1 修改 `src/StkTable/useFixedCol.ts` 中 `fixedColClassMap` computed，将 `colMap.set(colKeyFn(col), classList)` 改为 `colMap.set(colKeyFn(col), classList.join(' '))`，使 Map 存储预拼接的空格分隔字符串
- [x] 1.2 验证 `getTHProps`、`getTFProps`、`getTDProps` 三处消费方无需修改（已有的 `.filter(Boolean).join(' ')` 可正确处理字符串值）

## 2. 测试验证

- [x] 2.1 新增回归测试：验证固定列单元格的 `class` 属性包含空格分隔的 `fixed-cell`、`fixed-cell--active` 等类名，而非逗号连接
- [x] 2.2 运行全量测试套件确认无行为回归

## 3. 文档与发布

- [x] 3.1 在 CHANGELOG.md 记录 bugfix 条目
