# web-component Specification

## Purpose

定义 stk-table-vue 的 Web Component 产物行为契约：使 `<stk-table>` 自定义元素可在任意技术栈（React、Angular、原生 JS、微前端）宿主中通过标准 DOM API（attribute / property / CustomEvent / 实例方法）使用核心表格能力，并保证 Shadow DOM 样式隔离与类型化 API 声明。

## Requirements

### Requirement: `<stk-table>` 自定义元素注册与幂等守卫

引入 Web Component 产物后，SHALL 在全局注册名为 `stk-table` 的自定义元素，且无需宿主框架配合即可直接使用 `<stk-table>` 标签；注册过程 SHALL 具备幂等守卫，重复注册不抛错、不影响已挂载元素。

#### Scenario: 原生 HTML 页面直接使用

- **WHEN** 原生 HTML 页面通过 `<script type="module">` 引入 WC 产物后，在 DOM 中放置 `<stk-table></stk-table>` 标签并为其赋值 `columns` / `dataSource` property
- **THEN** 表格正常渲染，且纵向虚拟滚动（`virtual` 开启时）在滚动时行为正常

#### Scenario: 重复注册不抛错

- **WHEN** 同一页面中 WC 产物被多次加载并重复触发 `customElements.define('stk-table', ...)`
- **THEN** 后续重复注册被忽略且不抛异常，已存在的元素实例继续正常工作

### Requirement: attribute 与 property 属性映射

WC 产物 SHALL 支持两种属性传递方式：白名单内的标量 props 可通过 kebab-case attribute 设置，其中 boolean 类型 attribute 存在即为 `true`（无值也可）、number 类型 attribute 按字符串解析；数组/对象/函数类型 props（如 `columns`、`dataSource`、`rowClassName`、`emptyCellText`）SHALL 通过 property 赋值，property 名与现有 Vue props 的 camelCase 名一致。

#### Scenario: 标量 attribute 生效

- **WHEN** 宿主设置 `<stk-table stripe virtual row-height="30" theme="dark">`
- **THEN** 表格表现为斑马纹、纵向虚拟滚动开启、行高为 30px、主题为 dark

#### Scenario: 复杂值 property 赋值

- **WHEN** 宿主执行 `el.columns = [...]; el.dataSource = [...]; el.rowClassName = (row, index) => ...`
- **THEN** 表格按赋值的列与数据渲染，且 `rowClassName` 函数在渲染行时被调用

#### Scenario: attribute 变化同步到组件

- **WHEN** 元素已挂载后，宿主修改白名单内 attribute（如 `el.setAttribute('stripe', '')` 或移除）
- **THEN** 对应 prop 变化并触发表格行为更新，无需重建元素

### Requirement: Vue emit 映射为 CustomEvent

组件内部的所有 Vue emit SHALL 以 CustomEvent 形式从元素上派发，事件载荷放置于 `event.detail`，detail 字段与 Vue 版 emit 参数一一对应（如 `sort-change` 的 `{ col, order, data, sortConfig }`）；事件名 SHALL 保留 kebab-case（与 Vue 版事件名一致），`scroll` / `scroll-x` 等与原生事件重名的 SHALL 以 `stk-` 前缀命名（`stk-scroll` / `stk-scroll-x`）避免与原生事件混淆。

#### Scenario: 排序事件可取 detail 载荷

- **WHEN** 宿主监听 `el.addEventListener('sort-change', handler)` 且用户触发列排序
- **THEN** handler 收到 CustomEvent，`event.detail` 包含 `col`、`order`、`data`、`sortConfig` 字段且值与 Vue 版一致

#### Scenario: 滚动事件不与原生 scroll 混淆

- **WHEN** 宿主分别监听 `scroll` 与 `stk-scroll` 事件并滚动表格
- **THEN** 表格虚拟滚动的视口变化信息仅通过 `stk-scroll` 派发，且原生 `scroll` 事件不受表格自定义载荷污染

### Requirement: expose 方法与状态代理

`defineExpose` 暴露的全部实例方法与状态 SHALL 在 `stk-table` 元素实例上以同名方式代理：方法作为元素方法调用（如 `initVirtualScroll`、`setCurrentRow`、`setSelectedCell`、`setHighlightDimCell` 等），状态作为 property 读取（如排序状态 `sortCol` 等），行为与 Vue 版实例方法一致。

#### Scenario: 调用元素实例方法

- **WHEN** 宿主执行 `el.setCurrentRow(row)` 或 `el.initVirtualScroll()`
- **THEN** 表格产生与 Vue 版调用相同的行为（当前行高亮 / 虚拟滚动初始化重算）

#### Scenario: 读取状态 property

- **WHEN** 宿主读取 `el.sortCol` 等已代理的状态 property
- **THEN** 返回值与 Vue 版实例上的对应状态一致

### Requirement: Shadow DOM 样式隔离

WC 产物 SHALL 以 Shadow DOM 承载表格，组件样式（由 `style.less` 编译而来）内联注入 shadow root，不输出独立 CSS 文件；表格内部样式 SHALL 不泄漏到宿主页面，宿主页面的全局样式（如 `div { border }`）SHALL 不影响表格内部渲染。

#### Scenario: 宿主样式不侵入表格

- **WHEN** 宿主页面定义全局 `div { border: 1px solid red }` 并渲染 `<stk-table>`
- **THEN** 表格内部单元格不出现宿主样式定义的红色边框

#### Scenario: 表格样式不外泄

- **WHEN** 渲染 `<stk-table>` 后检查宿主页面其他元素
- **THEN** 表格注入的样式类名规则不作用于表格 shadow root 之外的任何元素

### Requirement: 主题定制与开放定制点

宿主 SHALL 通过 CSS 变量（`--stk-*`）穿透 Shadow 边界定制主题，与现有 CSS 变量体系一致；高频定制目标（滚动条、边框等）SHALL 通过 `::part()` 导出命名 part，宿主可用 `::part()` 选择器定制其外观。

#### Scenario: CSS 变量定制主题

- **WHEN** 宿主在 `stk-table` 元素或其祖先上设置 `--stk-primary-color` 等变量（或设置 `theme="dark"`）
- **THEN** 表格内部对应颜色随之变化

#### Scenario: ::part 定制滚动条

- **WHEN** 宿主使用 `stk-table::part(scrollbar) { ... }` 编写样式
- **THEN** 表格滚动条按宿主样式渲染

### Requirement: 插槽能力边界

WC 产物 SHALL 保留 `empty`、`footer` 等静态插槽为原生 `<slot>`，静态内容可正常渲染；表头等作用域插槽若在 CE 模式下不可用，SHALL 在 WC 版中不暴露该能力，且文档能力差异表 SHALL 说明其不可用原因与替代方式。

#### Scenario: 静态插槽内容渲染

- **WHEN** 宿主在 `<stk-table>` 中放置 `empty` / `footer` 插槽内容（数据为空 / 表尾区域）
- **THEN** 对应区域渲染插槽内静态内容

### Requirement: 类型声明

WC 产物 SHALL 附带手写 TypeScript 声明（`lib-wc/stk-table-wc.d.ts`），定义 `StkTableElement` 接口（含 attribute/property、事件 detail 类型、代理方法与状态）、增强 `HTMLElementTagNameMap`，使 TS 与 React 用户无需桥接库即可获得类型提示。

#### Scenario: TS 环境下类型可用

- **WHEN** TS 项目引入 `stk-table-vue/web-component` 并执行 `document.createElement('stk-table')` 或 JSX `<stk-table />`
- **THEN** 类型推导为 `StkTableElement`，可访问 `columns`、`dataSource`、`initVirtualScroll` 等成员且无类型错误

### Requirement: 构建产物与发布契约

项目 SHALL 提供独立的 WC 构建命令 `npm run build:wc`，产出位于 `lib-wc/` 的 ES 模块 JS 文件与手写 d.ts（无独立 CSS 文件，样式已内联）；`vue` 运行时 SHALL 打入 WC 产物（不 external）；包发布 SHALL 通过 exports 子路径 `"./web-component"` 暴露 WC 产物，且 `files` 包含 `lib-wc`；现有 `npm run build` 与 ES 库产物 SHALL 保持行为不变。

#### Scenario: build:wc 产出完整

- **WHEN** 执行 `npm run build:wc`
- **THEN** `lib-wc/` 下生成 JS 与 d.ts 文件，JS 文件可直接在浏览器 `<script type="module">` 中加载且无需宿主提供 Vue

#### Scenario: 现有构建不受影响

- **WHEN** 执行 `npm run build`
- **THEN** `lib/` 产物与改动前一致（vue 仍外部化、产出 style.css），`docs-demo` 与既有 Vue 用法不受影响

#### Scenario: 包子路径可导入

- **WHEN** 消费者通过 `import 'stk-table-vue/web-component'` 引入
- **THEN** 解析到 `lib-wc` 下的 WC 产物，且 `vue` 无需作为消费者的依赖

### Requirement: WC 产物能力边界

WC 产物 SHALL NOT 导出或提供以下能力：`VirtualTree` / `VirtualTreeSelect` 组件（依赖 Teleport 跨 Shadow 边界）、自定义单元格工厂（`createFilterCell` / `createEditableCell` / `createCheckboxCell` / `createNumberCell` / `createChangeCell`）、Vue 2.7 兼容；文档能力差异表 SHALL 明确列出不支持项、原因与建议替代方案。

#### Scenario: 能力差异表覆盖不支持项

- **WHEN** 用户查阅「非 Vue 集成」章节的能力差异表
- **THEN** 表中列出 Tree / TreeSelect / 自定义单元格工厂 / Vue 2.7 的不支持状态、原因与替代建议
