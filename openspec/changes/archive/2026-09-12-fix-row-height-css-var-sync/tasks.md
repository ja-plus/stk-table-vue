## 1. 核心修复：行高与虚拟滚动同源

- [x] 1.1 `src/StkTable/useVirtualScroll.ts`：`initVirtualScrollY` 中把已计算的基准行高并入 store patch —— `assignVs(virtualScroll, { rowHeight, containerHeight, pageSize, scrollHeight })`（L605 处，`rowHeight` 即 L586 的 `getRowHeightFn.value()` 局部变量）
- [x] 1.2 `src/StkTable/useVirtualScroll.ts`：给 `VirtualScrollStore.rowHeight` 补中文注释，说明「基准行高，由 `initVirtualScrollY` 随 `props.rowHeight` 同步；变高/展开行的行级高度不写此字段」，避免再次退化为只写字段
- [x] 1.3 `src/StkTable/StkTable.vue`：将 L1217 `watch(() => props.rowHeight, initVirtualScrollY)` 替换为行高类配置的统一 watcher（源为拼接后的原始值，而非返回数组，理由见 1.6）：

      ```ts
      watch(
          () => `${props.rowHeight}|${props.headerRowHeight}|${props.footerRowHeight}|${props.expandConfig?.height}`,
          () => nextTick(initVirtualScrollY),
      );
      ```

      （必须无参调用，杜绝把行高当 `height` 容器高度传入）
- [x] 1.4 确认模板 L34 `'--row-height': props.autoRowHeight ? void 0 : virtualScroll.rowHeight + 'px'` 保持不变（决策 3）：变高模式仍不输出该变量，固定行高模式随 store 自动同步
- [x] 1.5 自查 `SRBRTotalHeight`、`SRBRBottomHeight`（StkTable.vue L876-L887）与 `features/useAreaSelection.ts` L1030 无需改动即可读到新行高；如需更强约束，把这三处的 `virtualScroll.value.rowHeight` 读取点补一行注释指明其随 prop 更新
- [x] 1.6 性能评估（实施后回测）：`initVirtualScrollY` 单次成本与每帧 `updateVirtualScrollY` 未因本次改动变化（50K 行：0.005~0.006ms / 0.004ms，与基线一致）。
      发现并修正 watcher 源写法缺陷——`watch(() => [a, b, c, d], cb)` 返回新数组使身份比较必变，
      父组件以 `:expand-config="{ height: 40 }"` 内联字面量传值时每次父重渲染均空跑，
      展开行/变高大表连带行高树 O(n) 重建（实测 50K 行 13.9~14.4ms vs 基线 2.7~5.4ms）；
      改为拼接原始值后回到 2.5ms，与基线持平。多源 getter 数组在 Vue 3.5 下不误触发但 Vue 2.7 仍会，故不用。

## 2. 回归测试

- [x] 2.1 将复现文件 `test/rowHeightVarSync.repro.test.js` 转正为守卫用例 `test/rowHeightSync.test.js`（删除 `.repro` 文件），保留并扩展用例：
      - CSS 变量层：`rowHeight` 28 → 40 后根元素 inline style 的 `--row-height` 为 `40px`
      - `autoRowHeight: true` 时容器 MUST NOT 输出 `--row-height`
- [x] 2.2 补 `pageSize` 层断言（守住 1.3 的传参缺陷）：mock 容器高度后改 `rowHeight`，断言 `pageSize` 约为 `ceil(容器高 / 新行高) - 表头行数`，且 MUST NOT 为 0/1；内部状态读取方式参照 `test/autoRowHeightVirtualScroll.test.js` 的 `getSetupState`
- [x] 2.3 补表头行高场景：`setProps({ headerRowHeight })` 后断言 `--header-row-height` 与 `pageSize` 同时更新
- [x] 2.4 补展开行场景：含 expand 列的表格 `setProps({ expandConfig: { height } })` 后，断言行级 `--row-height` 与行高树总高（`getRowHeightCacheInfo().total`）按新值变化
- [x] 2.5 补几何一致断言（可选，若 happy-dom 下可稳定测量）：改行高并滚动到中段后，占位 tr 高度 + `offsetTop` + 渲染行数 × 行高 == 总高，无空白带
- [x] 2.6 运行 `pnpm test` 全量套件，确认既有 `autoRowHeight` / stripe / mergeCells / scrollTo 相关用例无回归
- [x] 2.7 补「行高 watcher 触发条件」性能守卫用例（`test/rowHeightSync.test.js`）：以 `containerHeight` 是否被重写为探针，断言 `expandConfig` 同值新对象 MUST NOT 触发重算、`height` 真变化 MUST 触发（已验证改回数组 getter 写法时该用例会失败）

## 3. 文档同步（与代码视为同一改动）

- [x] 3.1 `docs-src/main/table/basic/row-height.md`：补充「行高类配置支持动态修改，修改后自动重算可视区，无需手动调用 `initVirtualScroll`」；如实说明表尾行高不计入虚拟滚动总高公式
- [x] 3.2 `docs-src/main/table/basic/theme.md`：在 CSS 变量示例后加约束说明——覆盖 `--row-height` 只改变视觉行高，固定行高/虚拟模式下 MUST 同步设置 `row-height` prop，否则滚动条总高与定位仍按 prop 计算
- [x] 3.3 `docs-src/main/table/basic/expand-row.md`：如已描述 `expand-config.height`，补一句动态修改后自动重算
- [x] 3.4 `docs-src/main/api/table-props.md`：`rowHeight` / `headerRowHeight` / `footerRowHeight` 条目补「可动态修改，变更后自动重算可视区」（签名不变，无需改类型代码块）
- [x] 3.5 多语言镜像同步：`docs-src/en/main/table/basic/{row-height,theme,expand-row}.md`、`docs-src/ja/...`、`docs-src/ko/...` 与 `docs-src/{en,ja,ko}/main/api/table-props.md`
- [x] 3.6 `CHANGELOG.md`：新增 bugfix 条目（英文），覆盖两点——`--row-height` 不随 `row-height` prop 更新；行高变化时 `pageSize` 误将行高当容器高度
- [x] 3.7 检查 `AI-API-REFERENCE.md` 中行高相关 props 的行为描述，如有需要同步一行说明

## 4. 验证与自查

- [x] 4.1 `pnpm docs:build` 通过（文档站构建含 llms.txt 生成）
- [x] 4.2 `pnpm build` 通过，确认无类型报错（`types/index.ts` 未改签名，若 1.2 仅改注释则无 API 变化）
- [x] 4.3 提交前自查：用关键词 `row-height`、`--row-height`、`rowHeight`、`headerRowHeight`、`expandConfig` 再次搜索 `docs-src/`，确认命中页面均已更新或确认无需更新
- [x] 4.4 手工验证（真实浏览器，已执行）：临时页 `test/RowHeightLiveCheck.vue` + `row-height-check.html`（5000 行虚拟表，验证后已删除），用 CDP 脚本量几何：
      ① 28px 基线顶部/深滚动（scrollTop 56000）：`maxAbsDrift=0`，`scrollHeight=140028` 与 `5000×28+28` 完全相等，上占位 56000 / 下占位 83580 精确；
      ② 深滚动位置下改 `row-height` 28→40：`--row-height=40px`，渲染行高全为 40，`maxAbsDrift=0`，相邻行间隔误差 0，`scrollHeight=200028` 精确；
      ③ 改 `header-row-height` 28→56：`--header-row-height=56px`，thead 实测 56，渲染行由 12 降为 11（pageSize 已重算），表头下无空白带（首行顶边在视口上方 28px 处，属正常越界），底部覆盖 +48px；
      ④ 再跳 `row-height` 40→100：行高全为 100，`drift=0`，`scrollHeight=500056` 精确，上下占位 4600 / 494800 精确；控制台无 error/warn；截图目视确认无空白带与行错位。
- [ ] 4.5 commit message 使用英文（如 `fix(table): sync --row-height css var with rowHeight prop changes`）
