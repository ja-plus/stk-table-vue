---
kind: frontend_style
name: StkTable 样式体系与主题设计
category: frontend_style
scope:
    - '**'
source_files:
    - src/StkTable/style.less
    - src/StkTable/custom-cells/ChangeCell/ChangeCell.less
    - src/StkTable/custom-cells/CheckboxCell/CheckboxCell.less
    - src/StkTable/custom-cells/EditableCell/EditableCell.less
    - src/StkTable/custom-cells/FilterCell/Filter.less
    - postcss.config.js
    - docs-src/postcss.config.mjs
---

该仓库的样式系统基于 Less + CSS 自定义属性（CSS Variables）构建，采用组件级样式隔离与全局主题变量相结合的设计模式。核心样式文件位于 src/StkTable/style.less，通过大量 CSS 变量定义表格的外观、交互状态和主题切换能力。

主要技术栈：Less 作为预处理器，CSS 自定义属性作为设计令牌系统，PostCSS 进行样式编译，使用 postcss-preset-env 和 postcss-discard-comments 插件，Vite 原生支持 Less 和 CSS Modules。

样式组织方式：主样式文件 src/StkTable/style.less 包含所有表格核心样式，各自定义单元格组件拥有独立的 .less 文件（如 ChangeCell.less、CheckboxCell.less、EditableCell.less、Filter.less），样式通过 ES Module 按需导入。

主题系统设计：基础颜色变量包括 --border-color、--td-bgc、--th-bgc、--th-color；交互状态变量包括 --td-hover-color、--td-active-color、--tr-hover-bgc、--tr-active-bgc；布局尺寸变量包括 --row-height、--cell-padding-y、--cell-padding-x、--resize-handle-width；特效变量包括 --highlight-color、--highlight-duration、--stripe-bgc。深色模式通过 .stk-table.dark 类名覆盖所有 CSS 变量实现主题切换。

响应式与兼容性：使用 @media (hover: none) and (pointer: coarse) 检测触摸设备，在移动设备上禁用自定义滚动条恢复原生触摸滚动体验，通过 PostCSS Preset Env 自动添加浏览器前缀。

组件样式规范：使用 BEM 风格命名（.stk-table、.table-cell-wrapper、.table-header-sorter），组件级样式（.stk-change-cell、.stk-checkbox-cell、.stk-editable-cell），状态修饰符（.sorter-asc、.sorter-desc、.cell-hover、.cell-active）。通过 data 属性而非 class 应用动态样式避免 Vue 重新渲染时样式丢失。

文档站点使用 VitePress 构建，通过 docs-src/postcss.config.mjs 配置样式隔离确保文档示例的样式不会相互干扰。