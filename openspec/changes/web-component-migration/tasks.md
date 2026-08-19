# Web Component 迁移任务清单

## 1. M0：POC 可行性验证（硬关卡，不通过则回退方案设计）

- [ ] 1.1 建最小 POC（`docs-demo/wc-poc/` 或独立分支）：`defineCustomElement(StkTable)` 渲染，JS 赋值 `columns`/`dataSource`，验证基本渲染 + 虚拟滚动正常
- [ ] 1.2 POC 验证键盘事件与焦点：`useKeyboardArrowScroll`、单元格编辑在 Shadow DOM 内的 activeElement/composedPath 行为，必要时最小适配
- [ ] 1.3 POC 验证样式内联：`style.less` 编译产物以字符串注入 shadow root，不泄漏到外部
- [ ] 1.4 POC 性能对比：`test/perf` 基准跑 WC 产物与现有库，记录对比结果（目标偏差 < 10%）
- [ ] 1.5 POC 实测 `defineCustomElement` 对含连字符事件名的行为，定稿 D2 事件命名方案；产出 POC 结论，决定进入 M1 或回退

## 2. WC 入口与包装类

- [ ] 2.1 新建 `src/wc/index.ts`：仅从 `src/StkTable/index.ts` 引入 `StkTable`（不引入 `custom-cells/*`），`defineCustomElement` 生成基础 CE
- [ ] 2.2 实现 `StkTableElement extends StkTableCE` 继承包装类：静态 `observedAttributes` 白名单（`stripe`、`virtual`、`virtual-x`、`headless`、`theme`、`row-height`、`header-row-height`、`footer-row-height`、`width`、`row-key`、`col-key`、`empty-cell-text`、`show-no-data`、`sort-remote`、`cell-hover`、`cell-active` 等标量项）
- [ ] 2.3 实现属性解析与同步：boolean attribute 存在即 `true`/移除即 `false`、number 字符串解析、string 原样；`attributeChangedCallback` 转发为 camelCase property，property 赋值不回写 attribute
- [ ] 2.4 代理 `defineExpose` 全部方法/状态到元素实例（`initVirtualScroll`/`initVirtualScrollX`/`initVirtualScrollY`/`clearMergeCellsCache`/`setCurrentRow`/`setSelectedCell`/`setHighlightDimCell` 等，状态如排序 `sortCol` 以 property 暴露）
- [ ] 2.5 `customElements.define('stk-table', StkTableElement)` + 幂等守卫（`customElements.get` 判断，重复注册不抛错）

## 3. WC 构建链路

- [ ] 3.1 新建 `vite.config.wc.ts`：lib 模式 `es` 格式、target `chrome84`、**不** external vue、`cssCodeSplit: false`、banner 保留、不用 dts 插件、输出 `lib-wc/stk-table-wc.js`
- [ ] 3.2 样式内联：以 `?inline` 或小型 `vite-plugin-inline-css` 插件将 `style.less` 产物转为字符串传入 `defineCustomElement` 的 `styles` 选项
- [ ] 3.3 `package.json`：新增 `"build:wc": "vite build --config vite.config.wc.ts"` 脚本、`files` 增加 `lib-wc`
- [ ] 3.4 执行 `npm run build:wc`，验证产物自包含（无外部 vue 依赖、样式已内联）且 `npm run build` 现有产物不变

## 4. 类型声明与发布契约

- [ ] 4.1 手写 `lib-wc/stk-table-wc.d.ts`：`StkTableElement` 接口（property 与现有 props 同名、事件 detail 类型、代理方法与状态）
- [ ] 4.2 `HTMLElementTagNameMap` 增强（`'stk-table': StkTableElement`）；`package.json` 新增完整 `exports` map：`"."` 指向现有 lib（types+import）+ `"./web-component"` 指向 `lib-wc`（types+import）

## 5. 样式、主题与插槽

- [ ] 5.1 验证主题双路径：`theme="dark"` attribute 切换 + 宿主 `--stk-*` CSS 变量穿透 Shadow 边界定制
- [ ] 5.2 为滚动条、边框等高频定制元素增加 `::part()` 导出（`part="scrollbar"` 等），同步 `src/StkTable/style.less` 或模板（不改变 Vue 版渲染行为）
- [ ] 5.3 插槽定稿：`empty`/`footer` 原生 slot 静态内容渲染验证；表头作用域插槽可用性验证，不可用则 WC 版不暴露并在文档说明

## 6. 测试

- [ ] 6.1 新增 `test/wc/`：元素注册幂等、attribute 同步（含 boolean 无值/移除）、事件派发 detail 载荷、expose 方法代理（happy-dom/jsdom，环境不支持 CustomElement 则降级浏览器冒烟脚本）
- [ ] 6.2 性能基准：`npm run perf` 跑 WC 产物，结果写入 `test/perf/results/` 并与现有库对比留档
- [ ] 6.3 CI 冒烟：`.github/workflows/deploy.yml` 或独立 workflow 增加 WC 构建 + 冒烟用例（锁定 vue 版本防 R8）

## 7. 文档与示例（Code-Docs Sync 规则）

- [ ] 7.1 `docs-src/main/other/` 新增「非 Vue 集成」章节：原生 JS 快速开始（`<script type="module">`）、React 封装范式（useRef + useEffect + addEventListener）、API 差异对照表（attribute/property/event 映射 + 能力差异表：Tree/TreeSelect、createXxxCell、Vue 2.7 不支持项与替代建议）
- [ ] 7.2 `docs-demo/` 新增 WC 示例组：Basic / Sort / VirtualY / ThemeCssVars 四个最小示例（文档站内 WC 与 Vue 组件共存即"混用无冲突"证明）
- [ ] 7.3 `docs-src/main/api/expose.md` 补充 WC 方法代理说明、`emits.md` 补充事件映射对照（含 `stk-scroll`/`stk-scroll-x` 命名）
- [ ] 7.4 同步 `docs-src/en|ja|ko` 镜像（新章节 + expose/emits 变更）
- [ ] 7.5 `CHANGELOG.md` 登记 WC 产物与 DOM API；`README.md` 增加 WC 段落（体积说明 +20~30KB gzip、非 Vue 宿主定位）

## 8. 发布验证与验收

- [ ] 8.1 `npm pack` 验证：包内包含 `lib-wc`、`exports` 两个入口（`.` 与 `./web-component`）均可解析
- [ ] 8.2 原生 HTML 冒烟：仅 `<script type="module">` 引入 WC 产物，完成渲染 1 万行虚拟滚动表格、排序、行选中、高亮、暗色主题
- [ ] 8.3 React 18 demo（不装桥接库）完成同上操作，事件全部经 `event.detail` 正常取数
- [ ] 8.4 验收核对：样式隔离（宿主全局 `div { border }` 不侵入表格内部、表格样式不外泄）、性能偏差 < 10%、能力差异表齐全
