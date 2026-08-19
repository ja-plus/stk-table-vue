# Web Component 迁移（stk-table 非 Vue 宿主可用）

## Why

stk-table-vue 目前仅产出 Vue 组件库（`es` 格式、`vue` 外部化），只能在 Vue 3 / Vue 2.7 宿主中使用；React、Angular、原生 JS、jQuery 老系统、微前端与低代码平台均无法直接使用。基于 Vue `defineCustomElement` 新增一份 Web Component 产物，使 `<stk-table>` 可被任意技术栈通过标准 DOM API 使用，扩大组件库的适用面。

## What Changes

- **新增 WC 入口与构建链路**：`src/wc/`（`index.ts` + `StkTableWC.ts`，`defineCustomElement(StkTable)` + 继承包装类 `StkTableElement`，`customElements.define('stk-table')` 幂等守卫）；新增 `vite.config.wc.ts`（`vue` 运行时打进产物、CSS 内联为字符串、输出 `lib-wc/`，不产出 dts）；现有 `vite.config.ts` 与 `npm run build` 行为不变。
- **package.json 发布契约**：新增 `"build:wc"` 脚本、exports 子路径 `"./web-component"`（js + 手写 d.ts）、`files` 增加 `lib-wc`。
- **DOM API 设计**：标量 props 走 attribute（白名单 + kebab-case），数组/对象/函数 props 走 property（camelCase 同名）；Vue emit 映射为 CustomEvent（detail 载荷，事件名保留 kebab-case，POC 实测确认）；`defineExpose` 全部方法/状态在包装类上逐一代理并补齐 TS 类型（`StkTableElement` 接口 + `HTMLElementTagNameMap` 增强）。
- **插槽策略**：`empty` / `footer` 保留原生 `<slot>`；作用域插槽降级处理，不可用则隐藏并在文档说明；自定义单元格工厂 WC 版不提供。
- **样式与主题**：`style.less` 编译产物内联注入 shadow root（不再输出独立 CSS 文件）；CSS 变量（`--stk-*`）穿透 Shadow 边界实现主题定制；为滚动条、边框等增加 `::part()` 导出点。
- **文档与示例**：docs-src 新增「非 Vue 集成」章节（原生 JS 快速开始、React 封装范式、API 差异对照表）；docs-demo 新增 Basic / Sort / VirtualY / ThemeCssVars 四个 WC 示例。
- **测试与发布**：新增 `test/wc/`（元素注册、attribute 同步、事件派发、方法代理）；性能基准跑 WC 产物并与现有库对比留档；README 增加 WC 段落与体积说明。
- **明确不做（本期）**：`VirtualTree` / `VirtualTreeSelect` 的 WC 化（依赖 Teleport）、自定义单元格工厂（`createXxxCell`）的 WC 化、Vue 2.7 兼容（`defineCustomElement` 仅 Vue 3 支持）。

## Capabilities

### New Capabilities

- `web-component`: Web Component 产物的行为契约——`<stk-table>` 元素注册与幂等守卫、attribute/property 属性映射规则、Vue emit → CustomEvent 事件映射、expose 方法/状态代理、Shadow DOM 样式隔离与 `::part()` 导出、插槽能力边界、构建与发布契约（`lib-wc/`、exports 子路径、类型声明）。

### Modified Capabilities

<!-- 现有 Vue 库行为不变，openspec/specs/ 下无既有 capability 需要修改 -->

## Impact

- **代码**：`src/wc/`（新增：`index.ts`、`StkTableWC.ts`、手写 `lib-wc/stk-table-wc.d.ts`）、`vite.config.wc.ts`（新增）、`package.json`（脚本/exports/files）、`src/StkTable/`（如需为 WC 场景做最小适配，如 `useKeyboardArrowScroll` 的焦点判断兼容 `composedPath()`）。
- **公共 API**：现有 Vue 库的 props/emits/expose 全部不变；新增 WC 形态的 DOM API（attributes、CustomEvent、元素实例方法代理），事件载荷结构以 Vue 版 emit 参数为准，需要映射文档。
- **依赖**：`vue` 运行时被打入 WC 产物（体积 +20~30KB gzip，预期代价）；不新增任何外部依赖。
- **测试**：新增 `test/wc/`（happy-dom/jsdom 或浏览器冒烟）；`test/perf` 基准新增 WC 产物对比。
- **文档**（Code-Docs Sync 规则，本期新增大量公共 API 说明）：docs-src 新增「非 Vue 集成」章节（中文主文档 `docs-src/main/`，并同步 `en/ja/ko` 镜像）；`docs-src/main/api/expose.md`（WC 方法代理说明）、emits 事件映射对照；`docs-demo/` 新增 WC 示例组；CHANGELOG.md 登记；README.md 增加 WC 段落。
