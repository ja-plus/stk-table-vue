# Web Component 迁移设计

## Context

现有构建链路（见 `vite.config.ts`）：Vite lib 模式、`es` 单格式、`vue` 外部化、`cssCodeSplit: true` 产出独立 `style.css`、target `chrome84`、production 时启用 `vite-plugin-dts`。库入口 `src/StkTable/index.ts` 同时导出 `StkTable` 组件、5 个自定义单元格工厂与工具函数，并 `import './style.less'`。`defineExpose`（StkTable.vue L1964 起）暴露约 25 个方法/状态。`package.json` 目前**没有** `exports` 字段（`main` + `types` 顶层字段），这是新增子路径时的关键约束。方案动机见 proposal.md - Why。

本设计面向的规格要求见 `specs/web-component/spec.md`（注册/属性映射/事件映射/方法代理/样式隔离/插槽/类型/构建发布/能力边界）。

## Goals / Non-Goals

**Goals:**
- 新增独立 WC 产物与构建链路，现有 Vue 库产物字节级不变。
- WC 产物自包含（vue 运行时打入），任何宿主零依赖使用。
- 稳定的 DOM API 契约：attribute/property/事件/方法，全部有 TS 类型。
- 样式经 Shadow DOM 隔离，主题经 CSS 变量穿透。

**Non-Goals:**
- 不修改现有 Vue 组件内部渲染逻辑（WC 只是包装层；仅当 POC 证明 `composedPath()` 等最小适配必需时才动 `useKeyboardArrowScroll` 等文件）。
- 不做 Tree / TreeSelect / 自定义单元格工厂的 WC 化（见 proposal - 明确不做）。
- 不产出 WC 的 dts（手写声明文件替代，避免 dts 插件对 `defineCustomElement` 包装类推断不可靠）。
- 不做 Vue 2.7 兼容。

## Decisions

### D1：包装结构 = `defineCustomElement` + 继承包装类

`src/wc/index.ts` 入口只从 `src/StkTable/index.ts` 引 `StkTable` 组件；`defineCustomElement(StkTable, { styles, configureApp })` 生成基础 CE 类，再继承为 `StkTableElement`：

- 包装类承担三件事：静态 `observedAttributes`（白名单 attribute → `attributeChangedCallback` 转发为 prop 更新）、expose 方法/状态的实例代理（方法与元素方法同名，状态为 getter/setter）、TS 类型承载。
- `customElements.define('stk-table', StkTableElement)` 包一层幂等守卫（先 `customElements.get('stk-table')` 判断，存在则直接复用）。

**备选**：直接用 `defineCustomElement` 返回的类注册。放弃原因：无法声明 `observedAttributes`（attribute 同步是硬需求）、无法提供类型化代理方法。

**关于 `configureApp`**：Vue 3.4+ 支持，用于注入插件（如 i18n）。本期不启用任何插件，保留参数位供后续扩展，不对外暴露。

### D2：事件命名 = 保留 kebab-case + `stk-` 前缀规避原生事件冲突

采纳方案文档的方案 A（推荐项）：`sort-change`、`row-click`、`cell-selected` 等事件名与 Vue 版 emit 一一对应，宿主 `el.addEventListener('sort-change', ...)` 即可，与 Vue 文档零映射成本。仅 `scroll` / `scroll-x`（与原生事件重名，Vue 版本身靠 emit 区分、CE 下可能冒泡混淆）改名为 `stk-scroll` / `stk-scroll-x`。

**备选**：方案 B 全部去连字符（`sortchange`）。放弃原因：破坏与 Vue 版文档的映射一致性，且对部分框架连字符事件的兼容问题在 POC 中被证明可控时没有收益。

### D3：样式注入 = 构建期把 `style.less` 产物转为字符串

WC 构建中组件样式必须以字符串形式传入 `defineCustomElement` 的 `styles` 选项。做法：`vite.config.wc.ts` 中 `cssCodeSplit: false` + 一个小的 `vite-plugin-inline-css`（`generateBundle` 阶段读取产出的 CSS asset 转为 `export default "..."` 字符串模块注入入口，或直接在入口用 `?inline` 引入）。`src/wc/index.ts` **不** `import '../StkTable/style.less'`（避免走独立 CSS 产物路径），而是引用内联模块。

**备选**：运行时 fetch CSS 文件。放弃原因：破坏单文件自包含、增加网络往返。

### D4：构建 = 独立 `vite.config.wc.ts`，与现有配置并行

- `build.lib.entry: src/wc/index.ts`、`formats: ['es']`、`target: ['chrome84']`（与现有产物一致）、`outDir: 'lib-wc'`、文件名 `stk-table-wc.js`。
- **不** `external: ['vue']`（vue 运行时打入，这是 WC 自包含的前提）；`vue` 相关依赖（`@vue/runtime-dom` 等）一并打入。
- 不用 dts 插件（手写 d.ts）；banner 插件保留（保持产物头注释一致）。
- `minify: false` 与现有构建保持一致。

### D5：发布契约 = 补齐完整 `exports` map（注意现有无 exports 字段）

`package.json` 目前只有 `main`/`types` 顶层字段。**新增 `exports` 时必须包含 `"."` 入口**，否则定义 exports 后顶层字段会被忽略、现有消费方断链：

```json
"exports": {
  ".": { "types": "./lib/src/StkTable/index.d.ts", "import": "./lib/stk-table-vue.js" },
  "./web-component": { "types": "./lib-wc/stk-table-wc.d.ts", "import": "./lib-wc/stk-table-wc.js" }
}
```

`files` 增加 `lib-wc`；新增脚本 `"build:wc": "vite build --config vite.config.wc.ts"`。类型声明为手写 `lib-wc/stk-table-wc.d.ts`：`StkTableElement` 接口（property 与现有 props 同名、事件 detail 类型、代理方法与状态）+ `interface HTMLElementTagNameMap { 'stk-table': StkTableElement }` 增强。

### D6：attribute 白名单与同步机制

- 白名单：方案文档列出的纯标量项（`stripe`、`virtual`、`virtual-x`、`headless`、`theme`、`row-height`、`header-row-height`、`footer-row-height`、`width`、`row-key`、`col-key`、`empty-cell-text`、`show-no-data`、`sort-remote`、`cell-hover`、`cell-active` 等），kebab-case 命名。
- 解析规则：boolean 存在即 `true`（含无值 `setAttribute('stripe', '')`）、移除即 `false`；number 字符串解析为数字；string 原样。
- `attributeChangedCallback` → 写对应 camelCase property → CE 内部 prop 响应式更新。property 赋值（含复杂值）不回流写 attribute（避免字符串化脏数据）。

### D7：焦点/键盘事件的 Shadow DOM 适配（对应 R4）

`useKeyboardArrowScroll` 等以 `document.activeElement` 或事件 target 判断焦点归属的逻辑，在 Shadow DOM 内事件 retarget 后 target 变为宿主元素。适配策略：优先在 POC 阶段用 `event.composedPath()` 取真实来源（若判定逻辑允许）；若需要改 `src/StkTable/` 源码，改动面控制在最小、且不改变 Vue 版行为（如仅在 `composedPath` 可用时走新路径）。

### D8：插槽与主题

- 插槽：`empty`、`footer` 保留为原生 `<slot>`（CE 下静态插槽内容可渲染）；表头作用域插槽验证可用性，不可用则在 WC 入口不暴露对应 props 能力并在文档能力差异表说明。
- 主题：CSS 变量 `--stk-*` 定义在 `:host`，天然穿透 Shadow 边界，宿主设置变量即可定制；`theme="dark"` 走 attribute 正常切换。
- `::part()`：给滚动条、边框等高频定制元素加 `part` 属性（如 `part="scrollbar"`），需要时同步到 `src/StkTable/style.less` 或模板（改动受控、不改变 Vue 版渲染）。

## Risks / Trade-offs

- [R1 自定义单元格工厂不可用（高）] → 本期明确排除，能力差异表 + React/原生文档给出替代范式（配置式单元格远期立项）。
- [R4 Shadow DOM 焦点重定向影响键盘导航（中）] → POC 阶段用 `composedPath()` 实测；失败则回退设计（非 shadow 轻量包装），在 tasks 中 POC 是硬关卡。
- [R5 vue 运行时打入产物 +20~30KB gzip] → 定位为"非 Vue 宿主专用"，README 与文档明示体积与定位；Vue 宿主继续用 ES 库。
- [R7 事件名/scroll 与原生事件冲突、框架桥接差异] → D2 统一命名规范；React 示例封装为受控范式。
- [R8 Vue 对 `defineCustomElement` 行为调整] → 锁定 vue 版本构建；CI 加 WC 冒烟用例。
- [happy-dom/jsdom 对 CustomElement 支持不足] → `test/wc/` 若环境不支持则降级为浏览器冒烟脚本（`test/wc/browser-smoke`），并保留 vitest 可测部分。
- [新增 `exports` 字段破坏现有消费方] → D5 含 `"."` 入口，发布前用 `npm pack` 验证两种入口均可解析。
- [Vite `?inline` 对 less 的支持或 cssCodeSplit 组合行为差异] → 用最小验证用例先行确认，POC 覆盖。

## Migration Plan

阶段推进（里程碑见方案文档 §6）：

1. **M0 POC**（先行、可放弃）：`docs-demo/wc-poc/` 或独立分支验证四件事——CE 渲染+虚拟滚动、键盘/焦点、性能对比（`test/perf`）、样式内联。**POC 不通过则回退方案设计，不进入 M1。**
2. **M1**：`src/wc/` 入口 + 包装类 + `vite.config.wc.ts` + `build:wc` 脚本 + 手写 d.ts + `test/wc/` 基础用例。
3. **M2**：样式内联收尾、CSS 变量验证、`::part()` 导出。
4. **M3**：docs-src「非 Vue 集成」章节 + docs-demo WC 示例组 + 能力差异表 + CHANGELOG + README + `npm pack` 发布验证。

**回滚策略**：本改动全程为"增量并行"——现有 `lib/` 构建链路、`src/StkTable/`（除受控最小适配）与 Vue 用法不受影响。任一阶段回滚 = 删除 `src/wc/`、`vite.config.wc.ts`、`lib-wc/` 及 package.json 中新增条目，无迁移负担。

**受影响的文档页面**（Code-Docs Sync 规则）：`docs-src/main/other/`（新增「非 Vue 集成」章节，含原生 JS 快速开始、React 封装范式、API 差异对照表/能力差异表）；`docs-src/main/api/expose.md`（WC 方法代理说明）；`docs-src/main/api/emits.md`（事件映射对照）；`docs-demo/`（新增 wc 示例组）；`en/ja/ko` 镜像同步；`CHANGELOG.md`；`README.md`。
