## Context

`package.json` 的 `sideEffects` 字段当前为 `["./src/**"]`，仅覆盖源码目录。构建产物位于 `./lib/`，其中 `style.css` 不匹配该模式，被 webpack tree-shake 移除。详见 proposal.md。

## Goals / Non-Goals

**Goals:**
- 使 `import 'stk-table-vue/lib/style.css'` 在 webpack 生产构建中正常生效。

**Non-Goals:**
- 不调整 `lib/` 下 JS 产物的 sideEffects 声明（当前 JS 入口通过 `main` 字段引用，不受 tree-shake 影响）。
- 不添加 `exports` 字段（参见已有决策记录：`package.json 无 exports 字段的发布约束`）。

## Decisions

**方案：在 `sideEffects` 数组中追加 `"./lib/**/*.css"`**

- 理由：最小改动，精确声明 CSS 产物有副作用，不影响其他文件的 tree-shake 效率。
- 备选方案：
  - 设为 `true`（全部标记为有副作用）：过于宽泛，会禁用所有 tree-shake 优化，不可取。
  - 使用 `"./lib/style.css"` 精确路径：可行但不够灵活，若未来 `lib/` 下出现其他 CSS 文件需再次修改。使用 glob `"./lib/**/*.css"` 更具前瞻性。

## Risks / Trade-offs

- **风险极低**：仅新增一个 glob 模式，不改变现有 `./src/**` 的语义。
- **兼容性**：Rollup / Vite 不依赖 `sideEffects` 做 CSS 处理，此改动对其无影响。
