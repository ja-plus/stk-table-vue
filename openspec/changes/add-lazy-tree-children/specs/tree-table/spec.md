## ADDED Requirements

### Requirement: 树形子节点懒加载

`props.treeConfig.lazy` 为 `true` 时，展开一个"标记有子节点但子节点尚未加载"的行，组件 SHALL 调用 `treeConfig.loadMethod(row, col)` 获取子节点；`loadMethod` SHALL 返回一个 resolve 为子行数组的 Promise，组件在 resolve 后将该数组挂到该行的 `children` 并并入展平数据展示。`lazy` 默认 `false`，关闭时既有"数据自带完整 children"的树形行为 MUST 保持不变。

#### Scenario: 展开未加载分支触发取数并展示

- **WHEN** `treeConfig.lazy = true`，某行标记有子节点但 `children` 未加载，用户点击其展开按钮
- **THEN** 组件调用 `loadMethod(row, col)`，Promise resolve 后子节点行紧随父行展示

#### Scenario: 收起再展开不重复调用

- **WHEN** 某节点已成功加载子节点后被关闭，再次展开
- **THEN** 组件直接展示已缓存的子节点，MUST NOT 再次调用 `loadMethod`

### Requirement: 可展开标志判定

懒加载模式下，组件 SHALL 依据数据字段判定某行是否"有子节点"（可展开），默认字段名 `hasChildren`，可经 `treeConfig.hasChildField` 配置。当行的 `children` 已存在 **或** 该可展开字段为真时，tree-node 单元格 SHALL 显示展开箭头；两者皆无 SHALL 视为叶子节点不显示箭头。

#### Scenario: 未加载但标记有子节点显示箭头

- **WHEN** 一行 `children` 为空/未定义但 `hasChildren = true` 且 `lazy` 开启
- **THEN** 该行 tree-node 单元格显示展开箭头，允许被点击展开

#### Scenario: 叶子节点不显示箭头

- **WHEN** 一行 `children` 未定义且 `hasChildren` 为假
- **THEN** 该行不显示展开箭头

### Requirement: 懒加载加载态反馈

懒加载取数期间，组件 SHALL 给出加载中标识：在行上注入 `@private` 状态字段 `__T_LOADING__`（对外不可见）并为该行（`<tr>`）追加 `is-tree-loading` 类名，同时在 tree-node 单元格以内置 loading 图标替换展开箭头；加载完成或失败后加载态 MUST 消失。

#### Scenario: 加载中显示 loading 态

- **WHEN** `loadMethod` 已调用且 Promise 尚未 settle
- **THEN** 该行 `__T_LOADING__` 为真、整行(`<tr>`)带 `is-tree-loading` 类并显示 loading 图标

#### Scenario: 加载结束恢复

- **WHEN** `loadMethod` 的 Promise resolve 或 reject 完成
- **THEN** `__T_LOADING__` 清除，loading 图标消失，恢复展开箭头

### Requirement: 懒加载失败处理

`loadMethod` 返回的 Promise 被 reject 时，组件 SHALL 中止该次展开（该行保持折叠、不并入任何子节点），清除其加载态，MUST NOT 将失败节点标记为"已加载"（以便下次展开可重试）；若配置了 `treeConfig.onLoadError(error, row, col)` 组件 SHALL 调用之。

#### Scenario: 取数失败保持折叠可重试

- **WHEN** `loadMethod` 的 Promise reject
- **THEN** 该行保持折叠且未标记已加载，下次展开会重新触发 `loadMethod`

### Requirement: 单节点强制刷新

组件 SHALL expose 实例方法 `reloadTreeNode(rowKeyOrRow)`：对该已展开或已加载的节点强制重新调用 `loadMethod` 拉取子节点并替换其现有子树（含其后代展平行的重算）。

#### Scenario: 重载替换子树

- **WHEN** 对一个已加载并展开的节点调用 `reloadTreeNode(row)`
- **THEN** 组件重新调用 `loadMethod` 并用新结果替换该节点的子节点，展开区随之更新

### Requirement: lazy 与批量展开及 parents 定位的交互约束

`treeConfig.lazy` 为 `true` 时：`treeConfig.defaultExpandAll` / `defaultExpandLevel` 与 `setTreeExpand(..., { all: true })` / `{ level }` 在遇到"未加载的分支节点"时 SHALL 停止向下展开，MUST NOT 隐式发起链式加载。`setTreeExpand(row, { parents: true })` 的路径经过未加载祖先时 SHALL 依次 `await loadMethod` 链式加载这些祖先后再展开目标路径；任一祖先加载失败时 MUST 在该处中断并告警。

#### Scenario: 全展开遇未加载分支即停

- **WHEN** `lazy` 开启且调用 `setTreeExpand(root, { expand: true, all: true })`，某后代分支尚未加载
- **THEN** 已加载部分正常展开，遇到首个未加载分支即停止，不触发该分支的 `loadMethod`

#### Scenario: parents 链式加载定位深层行

- **WHEN** `lazy` 开启，对某深层子节点调用 `setTreeExpand(rowKey, { expand: true, parents: true })`，其祖先链存在未加载节点
- **THEN** 组件按从根到目标顺序链式调用 `loadMethod` 加载这些祖先并展开，使目标行可见
