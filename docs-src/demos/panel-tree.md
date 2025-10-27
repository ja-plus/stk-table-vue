# 面板树
## Demo
<demo vue="demos/PanelTree/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/PanelTree/index.vue"></demo>

## 几个要点
### 展开行禁用选中
通过配置`row-active`的`disabled`函数，当行有子项时，禁用选中。
### 展开行去除悬浮样式
1. 配置`row-class-name`，当行有子项时，添加`panel-header-row`类名。
2. 配置`panel-header-row` -> `--tr-hover-bgc: var(--th-bgc);` 保持与表头的背景颜色一致。
### 展开行去除'--'
配置`empty-cell-text`，当行有子项时，返回空字符串。
### 展开行文字超长
通过css 去除默认的文字超长样式。
```css
:deep(.panel-header-row .table-cell-wrapper) {
    overflow: initial;
}
```