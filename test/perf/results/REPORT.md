# StkTable 滚动性能测试报告

> 自动生成时间: 2026/8/15 10:37:40
> 测试环境: happy-dom (vitest), 单位: 毫秒(ms)
> 每个数值为 5 次运行的中位数 (排除 1 次预热)

## 指标说明

| 指标 | 说明 |
|------|------|
| mount | 组件创建 + 初始渲染耗时 |
| domNodes | 渲染的 DOM 元素总数 (越少说明虚拟滚动越好) |
| renderedRows | tbody 中渲染的 `<tr>` 行数 |
| scrollMid | 滚动到中间位置 (~5000行) 后虚拟滚动重算耗时 |
| scrollDeep | 滚动到 90%+ 深度后虚拟滚动重算耗时 |
| scrollX | 横向虚拟滚动重算耗时 |
| scrollXY | 横向 + 纵向同时滚动重算耗时 |

## 总览 — 初始渲染耗时 (mount, ms)

| 测试场景 |  |
|------------------||

## 总览 — 滚动重算耗时 (scroll, ms)

## 总览 — DOM 节点数

| 测试场景 |  |
|------------------||

## 各版本详细数据

### 0.8.14

> Error: checkout failed

### 0.9.3

> Error: checkout failed

### 0.10.0

> Error: checkout failed

### 0.11.15

> Error: checkout failed

### 1.0.4

> Error: checkout failed

### 1.1.0

> Error: checkout failed

### optimize-cell-merge-render

> Error: checkout failed
