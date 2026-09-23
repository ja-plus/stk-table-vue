# 文件管理树

用 `tree-node` 列配 `customCell` 实现一个文件管理树：单列 + `headless`（隐藏表头）的资源管理器列表，名称列整格自绘（文件夹 / 文件图标、行内重命名输入框），整格即拖拽热区。内置的「按层级缩进 + 引导线」与「箭头 / 懒加载 loading」分别经 `stkTreeIndent`、`stkFoldIcon` 两个插槽透传回来（注意它们是**你的单元格组件**的插槽，不是 StkTable 顶层插槽），由你决定渲染与否、摆在何处。

<demo vue="demos/FileTree/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/FileTree/index.vue"></demo>

## 文件管理能力

第一张表（自绘文件夹 / 文件图标）配齐了一套资源管理器式的交互，全部由 demo 自行拼装：

- **默认只展开第一层**：`treeConfig.defaultExpandLevel = 1`，不用 `defaultExpandAll` 全展开。
- **单击行展开 / 折叠**：监听 `cell-click`，命中文件夹行时按当前展开态调 `setTreeExpand(row, { expand })` 取反。命中展开控件的点击不会触发 `cell-click`，因此不会切换两次；行内重命名输入框上的点击要自行排除。
- **右键菜单**：在 `row-menu` 事件里弹出 [ja-contextmenu](https://github.com/ja-plus/ja-contextmenu)，文件夹行额外提供「新建文件 / 新建文件夹」，有剪贴板时文件夹行才出现「粘贴」。
- **行内重命名**：菜单点「重命名」后名称格内直接渲染 `<input>`，不新开弹窗（参考 VSCode）；聚焦后选中主文件名、不含扩展名，Enter / 失焦提交，Esc 取消；空名视为取消，与同级同名则阻止提交，新建未提交的行取消即删除。
- **新建文件 / 文件夹**：追加到目录末尾并立即进入行内重命名，提交前就是一个占位行。
- **拖动移动位置**：不用内置 `dragRow` 把手列——整个名称格自带 `draggable`，由单元格自己派发原生拖拽事件（`dragstart` / `dragover` / `drop`）。拖到文件夹行上移入该文件夹，拖到文件行上时按指针落在格子的上半区 / 下半区插到其前 / 后，落点有高亮或插入线提示；把文件夹拖进自己的子孙会被阻止，编辑中的行临时关掉 `draggable` 以免输入框无法选字。
- **剪切 / 复制 / 粘贴**：剪贴板只记行引用。剪切的行置灰；粘贴时剪切为移动、复制为深拷贝（名字加 ` copy`）。

第二张表用同一份数据演示另一种摆法：保留内置箭头与引导线（渲染 `stkFoldIcon` 插槽），只给目录名加了个标签；它只作渲染对比，文件管理交互以第一张表为准。

## 契约

- 单元格根元素需 `height: 100%; display: flex; align-items: center;`：引导线画在缩进格内并撑满整行高，根元素若不是撑满行高的 flex 行，线会被截断。
- 自绘的展开控件必须带 `data-stk-fold`，每格只标记一个：标签等其它区域带上它也会变成点击热区。命中展开控件的点击不会再触发 `cell-click` / `cell-selected`。
- 只想换箭头外观时，渲染 `<slot name="stkFoldIcon" />` 即可拿回内置箭头（含懒加载 loading 占位与展开态旋转），无需自行判断展开状态。
- 图标宽于默认 16px 时覆盖 `--tree-indent-width`，让缩进格、控件占位格与引导线步长同步变化（示例取 `20px`）。

## 单元格骨架

```vue
<script lang="ts" setup>
import type { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

defineProps<CustomCellProps<any>>();
</script>
<template>
    <div class="folder-cell">
        <!-- 内置：按层级缩进 + 引导线 -->
        <slot name="stkTreeIndent" />
        <!-- 自绘展开控件：必须带 data-stk-fold，开合两态由 treeExpanded 决定 -->
        <span v-if="expandable" class="folder-cell__icon" data-stk-fold>{{ treeExpanded ? '▾' : '▸' }}</span>
        <span v-else class="folder-cell__icon" />
        <span>{{ cellValue }}</span>
    </div>
</template>
<style>
.folder-cell {
    height: 100%;
    display: flex;
    align-items: center;
}
.folder-cell__icon {
    flex-shrink: 0;
    width: var(--tree-indent-width);
    text-align: center;
    cursor: pointer;
}
</style>
```

::: tip 提示
列配置与内置树表一致，仍需 `type: 'tree-node'`，只是渲染交给 `customCell`：

```ts
const columns = [{ type: 'tree-node', title: 'Name', dataIndex: 'name', customCell: NameCell }];
const treeConfig = { defaultExpandLevel: 1, showGuide: true };
```

树形基础用法与懒加载见[树形表格](/main/table/basic/tree.html)。
:::
