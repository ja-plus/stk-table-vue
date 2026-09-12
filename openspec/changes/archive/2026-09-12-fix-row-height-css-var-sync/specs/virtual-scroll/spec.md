## ADDED Requirements

### Requirement: 行高类配置动态变化时视觉与几何同步重算

`props.rowHeight`、`props.headerRowHeight`、`props.footerRowHeight`、`props.expandConfig.height` 在组件挂载后发生变化时，组件 SHALL 使新的行高同时生效于**实际渲染高度**与**虚拟滚动几何计算**（可视区窗口 `startIndex`/`endIndex`、`pageSize`、总高 `scrollHeight`、占位/偏移高度），MUST NOT 出现「样式已更新而滚动计算仍用旧行高」或反之的半更新状态。

固定行高模式下，表体行高由容器内联 CSS 变量 `--row-height` 决定（`tbody tr` / `tbody td` 高度、视口上下占位 tr 的 `calc(var(--row-height) * N)`、无数据提示行 `line-height` 均消费该变量），该变量 MUST 随 `props.rowHeight` 响应式更新；`props.autoRowHeight` 为真时容器 MUST NOT 输出 `--row-height`（行高由单元格内容与实测高度决定）。

#### Scenario: 动态修改 row-height 后 CSS 变量同步

- **WHEN** 表格以 `rowHeight: 28` 渲染后，将 `rowHeight` 改为 `40`
- **THEN** 容器内联样式的 `--row-height` MUST 变为 `40px`，表体行实际高度随之变为 40px

#### Scenario: 动态修改 row-height 后滚动几何一致

- **WHEN** 虚拟滚动表格的 `rowHeight` 从 28 改为 40 且数据行数超过可视区容量
- **THEN** 可视区行数按新行高重算，滚动条总高、上下占位高度与实际渲染行高三者一致，滚动到任意位置不出现空白带或行错位

#### Scenario: 依赖行高的派生高度同步

- **WHEN** `rowHeight` 动态变化且启用 `scrollRowByRow` 或区域选取
- **THEN** 按行滚动的总高计算与区域选取键盘滚动的目标行定位 MUST 使用新行高，不得使用挂载时的旧值

#### Scenario: 动态修改 header-row-height 后重算可视区

- **WHEN** 多级或单级表头表格的 `headerRowHeight` 在挂载后被修改
- **THEN** 表头实际行高与 `pageSize`（表头占用的表体行数）同时更新，表头不再遮挡首行且首行不被裁切，无需用户手动调用 `initVirtualScroll`

#### Scenario: 动态修改展开行高后重算行高累计

- **WHEN** 存在展开行列且 `expandConfig.height` 在挂载后被修改
- **THEN** 展开行实际高度与行高累计（总高、`offsetTop`）按新值重算，展开/收起后不残留旧行高造成的偏移误差

#### Scenario: 变高模式不输出统一行高变量

- **WHEN** `autoRowHeight` 为真且 `rowHeight` 被动态修改
- **THEN** 容器 MUST NOT 输出 `--row-height`，`rowHeight` 仅作为期望行高参与计算，已实测的行高不被其覆盖

### Requirement: 行高重算仅在值真正变化时发生

行高类配置的重算入口 MUST NOT 因「配置值未变但对象引用变了」而触发。尤其 `expandConfig` 常以模板内联对象字面量传入（如 `:expand-config="{ height: 40 }"`），父组件每次重渲染都会生成新对象，此时行高类 watcher MUST 保持静默，MUST NOT 调用 `initVirtualScrollY`。固定行高模式下每帧滚动的重算（`updateVirtualScrollY`）MUST NOT 因此次修复而新增写入字段之外的开销。

#### Scenario: 父组件重渲染不引发行高重算

- **WHEN** 存在展开行列、以 `:expand-config="{ height: 40 }"` 内联写法传入配置，父组件因无关响应式状态重渲染（`height` 值不变）
- **THEN** 虚拟滚动几何 MUST NOT 重算，行高 Fenwick 树 MUST NOT 重建（避免 50K 行量级下每次父重渲染多出 ~10ms 的空跑开销）

#### Scenario: 真值变化时正常触发重算

- **WHEN** `expandConfig.height` 从 40 改为 80
- **THEN** 重算正常发生，展开行高度与行高累计按新值生效

#### Scenario: 滚动热路径开销不变

- **WHEN** 50K 行固定行高表格连续滚动
- **THEN** 每帧 `updateVirtualScrollY` 的开销量级与修复前一致（本改动不向每帧 patch 增加字段），行高仅在 `initVirtualScrollY` 时写入 store，值未变时不触发重渲染
