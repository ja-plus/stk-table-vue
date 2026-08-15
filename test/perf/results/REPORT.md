# StkTable 滚动性能测试报告

> 自动生成时间: 2026/8/15 12:38:32
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

| 测试场景 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| 纵向 10K行 | 11.79 | 11.20 | 12.48 | 16.85 | 13.18 | 11.20 | 11.83 |
| 纵向 50K行 | 36.62 | 37.34 | 37.05 | 52.32 | 43.60 | 38.16 | 44.10 |
| 非虚拟 500行 | 333.48 | 253.71 | 225.71 | 243.37 | 185.95 | 182.46 | 183.82 |
| 横向 30列 | 29.45 | 28.93 | 25.41 | 27.36 | 25.22 | 28.95 | 26.80 |
| 横向 50列 | 18.20 | 19.77 | 16.75 | 19.12 | 17.38 | 19.89 | 18.72 |
| 合并 rowspan | 13.39 | 14.13 | 10.69 | 10.13 | 10.35 | 13.55 | 9.02 |
| 合并 colspan | 10.61 | 10.01 | 11.81 | 9.26 | 11.00 | 11.37 | 11.72 |
| 合并 mixed | 7.61 | 11.40 | 8.52 | 7.75 | 7.41 | 7.27 | 6.60 |
| 3层表头 | 7.30 | 7.96 | 16.90 | 9.95 | 6.86 | 7.26 | 6.34 |
| 合并+多级表头 | 10.01 | 17.27 | 13.23 | 8.27 | 8.57 | 6.39 | 6.05 |
| 合并+virtualX | 15.26 | 23.61 | 19.02 | 17.89 | 13.78 | 14.95 | 14.07 |
| 全功能 | 15.47 | 17.94 | 17.08 | 15.35 | 11.31 | 13.79 | 13.20 |

## 总览 — 滚动重算耗时 (scroll, ms)

### 纵向 10K行

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollMid | 0.01 | 0.02 | 0.01 | 0.02 | 0.02 | 0.02 | 0.05 |
| scrollDeep | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.02 | 0.02 |

### 纵向 50K行

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollDeep | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.02 | 0.01 |

### 横向 30列

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollX | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |
| scrollXY | 0.02 | 0.02 | 0.02 | 0.01 | 0.01 | 0.02 | 0.02 |

### 横向 50列

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollX | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |

### 合并 rowspan

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollMid | 0.13 | 0.16 | 0.13 | 0.13 | 0.12 | 0.12 | 0.01 |

### 合并 colspan

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollMid | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |

### 合并 mixed

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollMid | 0.08 | 0.10 | 0.09 | 0.08 | 0.08 | 0.08 | 0.01 |

### 3层表头

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollMid | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |

### 合并+多级表头

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollMid | 0.10 | 0.11 | 0.10 | 0.09 | 0.08 | 0.08 | 0.01 |

### 合并+virtualX

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollXY | 0.05 | 0.07 | 0.13 | 0.11 | 0.09 | 0.10 | 0.01 |

### 全功能

| 指标 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| scrollXY | 0.04 | 0.05 | 0.05 | 0.05 | 0.04 | 0.04 | 0.02 |

## 总览 — DOM 节点数

| 测试场景 | 0.8.14 | 0.9.3 | 0.10.0 | 0.11.15 | 1.0.4 | 1.1.0 | optimize-cell-merge-render |
|------------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| 纵向 10K行 | 66 | 67 | 67 | 67 | 67 | 67 | 67 |
| 纵向 50K行 | 66 | 67 | 67 | 67 | 67 | 67 | 67 |
| 非虚拟 500行 | 5520 | 5521 | 5521 | 5521 | 5521 | 5521 | 5521 |
| 横向 30列 | 43 | 44 | 44 | 55 | 44 | 44 | 44 |
| 横向 50列 | 43 | 44 | 44 | 55 | 44 | 44 | 44 |
| 合并 rowspan | 67 | 68 | 68 | 68 | 68 | 68 | 59 |
| 合并 colspan | 62 | 63 | 63 | 63 | 63 | 63 | 63 |
| 3层表头 | 79 | 80 | 80 | 80 | 80 | 80 | 80 |

## 各版本详细数据

### 0.8.14 (复用已有数据)

```
[PERF] vertical_10k | mount=11.79 | domNodes=66 | renderedRows=4 | scrollMid=0.01 | scrollDeep=0.01
[PERF] vertical_50k | mount=36.62 | domNodes=66 | scrollDeep=0.01
[PERF] non_virtual_500 | mount=333.48 | domNodes=5520 | renderedRows=500
[PERF] virtualX_30cols | mount=29.45 | domNodes=43 | scrollX=0.01 | scrollXY=0.02
[PERF] virtualX_50cols | mount=18.2 | domNodes=43 | scrollX=0.01
[PERF] mergeCells_rowspan | mount=13.39 | domNodes=67 | scrollMid=0.13
[PERF] mergeCells_colspan | mount=10.61 | domNodes=62 | scrollMid=0.01
[PERF] mergeCells_mixed | mount=7.61 | scrollMid=0.08
[PERF] multi_header_3lvl | mount=7.3 | domNodes=79 | scrollMid=0.01
[PERF] merge+multiHeader | mount=10.01 | scrollMid=0.1
[PERF] merge+virtualX | mount=15.26 | scrollXY=0.05
[PERF] all_features | mount=15.47 | scrollXY=0.04
```

### 0.9.3 (复用已有数据)

```
[PERF] vertical_10k | mount=11.2 | domNodes=67 | renderedRows=4 | scrollMid=0.02 | scrollDeep=0.01
[PERF] vertical_50k | mount=37.34 | domNodes=67 | scrollDeep=0.01
[PERF] non_virtual_500 | mount=253.71 | domNodes=5521 | renderedRows=500
[PERF] virtualX_30cols | mount=28.93 | domNodes=44 | scrollX=0.01 | scrollXY=0.02
[PERF] virtualX_50cols | mount=19.77 | domNodes=44 | scrollX=0.01
[PERF] mergeCells_rowspan | mount=14.13 | domNodes=68 | scrollMid=0.16
[PERF] mergeCells_colspan | mount=10.01 | domNodes=63 | scrollMid=0.01
[PERF] mergeCells_mixed | mount=11.4 | scrollMid=0.1
[PERF] multi_header_3lvl | mount=7.96 | domNodes=80 | scrollMid=0.01
[PERF] merge+multiHeader | mount=17.27 | scrollMid=0.11
[PERF] merge+virtualX | mount=23.61 | scrollXY=0.07
[PERF] all_features | mount=17.94 | scrollXY=0.05
```

### 0.10.0 (复用已有数据)

```
[PERF] vertical_10k | mount=12.48 | domNodes=67 | renderedRows=4 | scrollMid=0.01 | scrollDeep=0.01
[PERF] vertical_50k | mount=37.05 | domNodes=67 | scrollDeep=0.01
[PERF] non_virtual_500 | mount=225.71 | domNodes=5521 | renderedRows=500
[PERF] virtualX_30cols | mount=25.41 | domNodes=44 | scrollX=0.01 | scrollXY=0.02
[PERF] virtualX_50cols | mount=16.75 | domNodes=44 | scrollX=0.01
[PERF] mergeCells_rowspan | mount=10.69 | domNodes=68 | scrollMid=0.13
[PERF] mergeCells_colspan | mount=11.81 | domNodes=63 | scrollMid=0.01
[PERF] mergeCells_mixed | mount=8.52 | scrollMid=0.09
[PERF] multi_header_3lvl | mount=16.9 | domNodes=80 | scrollMid=0.01
[PERF] merge+multiHeader | mount=13.23 | scrollMid=0.1
[PERF] merge+virtualX | mount=19.02 | scrollXY=0.13
[PERF] all_features | mount=17.08 | scrollXY=0.05
```

### 0.11.15 (复用已有数据)

```
[PERF] vertical_10k | mount=16.85 | domNodes=67 | renderedRows=4 | scrollMid=0.02 | scrollDeep=0.01
[PERF] vertical_50k | mount=52.32 | domNodes=67 | scrollDeep=0.01
[PERF] non_virtual_500 | mount=243.37 | domNodes=5521 | renderedRows=500
[PERF] virtualX_30cols | mount=27.36 | domNodes=55 | scrollX=0.01 | scrollXY=0.01
[PERF] virtualX_50cols | mount=19.12 | domNodes=55 | scrollX=0.01
[PERF] mergeCells_rowspan | mount=10.13 | domNodes=68 | scrollMid=0.13
[PERF] mergeCells_colspan | mount=9.26 | domNodes=63 | scrollMid=0.01
[PERF] mergeCells_mixed | mount=7.75 | scrollMid=0.08
[PERF] multi_header_3lvl | mount=9.95 | domNodes=80 | scrollMid=0.01
[PERF] merge+multiHeader | mount=8.27 | scrollMid=0.09
[PERF] merge+virtualX | mount=17.89 | scrollXY=0.11
[PERF] all_features | mount=15.35 | scrollXY=0.05
```

### 1.0.4 (复用已有数据)

```
[PERF] vertical_10k | mount=13.18 | domNodes=67 | renderedRows=4 | scrollMid=0.02 | scrollDeep=0.01
[PERF] vertical_50k | mount=43.6 | domNodes=67 | scrollDeep=0.01
[PERF] non_virtual_500 | mount=185.95 | domNodes=5521 | renderedRows=500
[PERF] virtualX_30cols | mount=25.22 | domNodes=44 | scrollX=0.01 | scrollXY=0.01
[PERF] virtualX_50cols | mount=17.38 | domNodes=44 | scrollX=0.01
[PERF] mergeCells_rowspan | mount=10.35 | domNodes=68 | scrollMid=0.12
[PERF] mergeCells_colspan | mount=11 | domNodes=63 | scrollMid=0.01
[PERF] mergeCells_mixed | mount=7.41 | scrollMid=0.08
[PERF] multi_header_3lvl | mount=6.86 | domNodes=80 | scrollMid=0.01
[PERF] merge+multiHeader | mount=8.57 | scrollMid=0.08
[PERF] merge+virtualX | mount=13.78 | scrollXY=0.09
[PERF] all_features | mount=11.31 | scrollXY=0.04
```

### 1.1.0 (复用已有数据)

```
[PERF] vertical_10k | mount=11.2 | domNodes=67 | renderedRows=4 | scrollMid=0.02 | scrollDeep=0.02
[PERF] vertical_50k | mount=38.16 | domNodes=67 | scrollDeep=0.02
[PERF] non_virtual_500 | mount=182.46 | domNodes=5521 | renderedRows=500
[PERF] virtualX_30cols | mount=28.95 | domNodes=44 | scrollX=0.01 | scrollXY=0.02
[PERF] virtualX_50cols | mount=19.89 | domNodes=44 | scrollX=0.01
[PERF] mergeCells_rowspan | mount=13.55 | domNodes=68 | scrollMid=0.12
[PERF] mergeCells_colspan | mount=11.37 | domNodes=63 | scrollMid=0.01
[PERF] mergeCells_mixed | mount=7.27 | scrollMid=0.08
[PERF] multi_header_3lvl | mount=7.26 | domNodes=80 | scrollMid=0.01
[PERF] merge+multiHeader | mount=6.39 | scrollMid=0.08
[PERF] merge+virtualX | mount=14.95 | scrollXY=0.1
[PERF] all_features | mount=13.79 | scrollXY=0.04
```

### optimize-cell-merge-render (复用已有数据)

```
[PERF] vertical_10k | mount=11.83 | domNodes=67 | renderedRows=4 | scrollMid=0.05 | scrollDeep=0.02
[PERF] vertical_50k | mount=44.1 | domNodes=67 | scrollDeep=0.01
[PERF] non_virtual_500 | mount=183.82 | domNodes=5521 | renderedRows=500
[PERF] virtualX_30cols | mount=26.8 | domNodes=44 | scrollX=0.01 | scrollXY=0.02
[PERF] virtualX_50cols | mount=18.72 | domNodes=44 | scrollX=0.01
[PERF] mergeCells_rowspan | mount=9.02 | domNodes=59 | scrollMid=0.01
[PERF] mergeCells_colspan | mount=11.72 | domNodes=63 | scrollMid=0.01
[PERF] mergeCells_mixed | mount=6.6 | scrollMid=0.01
[PERF] multi_header_3lvl | mount=6.34 | domNodes=80 | scrollMid=0.01
[PERF] merge+multiHeader | mount=6.05 | scrollMid=0.01
[PERF] merge+virtualX | mount=14.07 | scrollXY=0.01
[PERF] all_features | mount=13.2 | scrollXY=0.02
```
