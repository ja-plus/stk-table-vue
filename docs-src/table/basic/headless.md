# 无头

去除表头

## 配置

`props.headless` 控制是否展示表头。默认true。


## 示例
### 垂直表格示例
<demo vue="../../../docs-demo/basic/headless/Headless.vue"></demo>

### 虚拟单列表
* `props.bordered=false` 去除表格的边框。
* `StkTableColumn['customCell']` 自定义单元格内容与样式，实现虚拟单列表效果。

<demo vue="../../../docs-demo/basic/headless/HeadlessSingle/index.vue"></demo>






