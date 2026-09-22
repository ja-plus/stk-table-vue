## 1. 前置验证（spike）

- [ ] 1.1 验证 Vue 2.7 下 `shallowRef` + `triggerRef` 能否可靠驱动可视窗口重渲染（写最小 demo/单测，通过则确认 D2 落地方式，不通过则记录"2.7 回退赋新引用"结论）
- [ ] 1.2 确认自适应行高结构是否支持尾部 O(新增行数) 入（阅读行高/Fenwick 相关实现，输出结论决定 D4 走增量还是回退，不改对外契约）

## 2. 类型与 API 定义

- [ ] 2.1 在 `src/StkTable/types/index.ts` 定义 `appendDataSource` 签名与 `options`（`{ sorted?: boolean; silent?: boolean }`）及 JSDoc（含 `sorted` 前置条件、适用/不适用场景），验证：类型编译通过、`pnpm ai:check` 漂移自检可识别新方法
- [ ] 2.2 约定对外语义：追加不回写传入的 `props.dataSource` 原数组，验证：类型/注释描述与后续实现一致

## 3. 核心实现

- [ ] 3.1 新增 `src/StkTable/useAppendDataSource.ts`，实现 `canFastAppend` 布尔门（无排序或 `sorted` / 非树 / 无跨行合并 / 筛选处理），命中走增量、否则委托 `updateDataSource`，验证：单元分支覆盖命中与四类回退
- [ ] 3.2 实现增量路径：对 `dataSourceCopy` 同一数组 `push` 新行 + `triggerRef`，不清 `mergeCellsCache`/`rowKeyGenCache`，验证：追加后既有行键与合并缓存未被清空
- [ ] 3.3 实现虚拟滚动/行高增量扩展（统一行高 O(1) 扩展总高度；自适应行高按 1.2 结论走增量或回退），验证：滚动条比例与总高度随追加更新
- [ ] 3.4 保证追加不跳视口、不清当前选中/区域选区，验证：滚动中途追加后 `startIndex` 与选中态不变
- [ ] 3.5 在 `StkTable.vue` 中 `defineExpose` 暴露 `appendDataSource`，验证：可通过组件 ref 调用并渲染新行

## 4. 单元测试

- [ ] 4.1 覆盖"尾部追加即时可见 / 空表首次追加 / 与整体替换结果等价"，验证：`pnpm test` 相关用例通过
- [ ] 4.2 覆盖回退分支：本地排序未声明 sorted / 树形 / 跨行动态合并 / 筛选生效，验证：结果与全量链路一致
- [ ] 4.3 覆盖 `sorted:true` 跳过重排与误用（乱序传入）行为，验证：声明有序保持末尾、dev 抽查告警
- [ ] 4.4 覆盖状态一致性：行唯一键稳定、跨新旧边界合并正确重算、选中/视口保持，验证：`pnpm test` 通过

## 5. 性能验收

- [ ] 5.1 在 `test/perf` 新增流式追加对照场景（增量 vs 整体替换；1万→5万行；无排序 & 单调有序），验证：输出单次追加耗时不随总行数线性增长、灌满总耗时显著下降
- [ ] 5.2 运行 `test/perf` 既有 12 场景，验证：回退场景各指标不劣于基线 10%

## 6. 文档与 AI 资产同步（与代码同一改动）

- [ ] 6.1 `docs-src/main/api/expose.md` 登记 `appendDataSource`（用途、签名代码块、示例、适用/不适用场景），验证：签名与实现一致、示例可运行
- [ ] 6.2 新增/更新流式追加示例页（`docs-src/main/table/advanced/` 或 `docs-demo/`），验证：demo 可运行且展示增量与回退边界
- [ ] 6.3 同步多语言镜像 `docs-src/en|ja/ko/` 对应页面（至少中文主文档优先），验证：镜像页与中文描述一致
- [ ] 6.4 `CHANGELOG.md` 记录公共 API 新增，验证：条目存在
- [ ] 6.5 更新 `llms.txt`（新增方法 + `sorted` 前置条件 + 合并/树回退坑），验证：`pnpm ai:check` 无漂移告警

## 7. 集成校验

- [ ] 7.1 运行 `pnpm test`、`pnpm ai:check`、`pnpm docs:build`，验证：三者全部通过
- [ ] 7.2 按项目规则用改动关键词复查 `docs-src/`，验证：所有命中页面已更新或确认无需更新
