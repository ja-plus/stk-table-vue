# StkTable 滚动性能基准测试

跨版本自动化性能测试框架，用于检测 StkTable 从 v0.8.x 到各版本的滚动性能趋势。

## 目录结构

```
test/perf/
── scrollPerf.test.js          # 性能测试用例（12 个场景）
├── run-perf-benchmark.mjs      # 跨版本自动化运行脚本
├── README.md                   # 本文件
└── results/                    # 测试结果输出目录
    ├── REPORT.md               # Markdown 性能报告（含分析总结）
    ├── benchmark.html          # ECharts 可视化页面（浏览器打开）
    └── *.txt                   # 各版本原始测试数据
```

## 测试场景

| 分类 | 场景 | 说明 |
|------|------|------|
| 纵向滚动 | `vertical_10k` | 10,000 行 × 5 列，虚拟滚动 |
| | `vertical_50k` | 50,000 行 × 5 列，虚拟滚动 |
| | `non_virtual_500` | 500 行非虚拟基线对照 |
| 横向滚动 | `virtualX_30cols` | 5,000 行 × 30 列，virtualX |
| | `virtualX_50cols` | 2,000 行 × 50 列，virtualX |
| 单元格合并 | `mergeCells_rowspan` | 5,000 行，rowspan 合并 |
| | `mergeCells_colspan` | 5,000 行，colspan 合并 |
| | `mergeCells_mixed` | 3,000 行，混合合并 |
| 多级表头 | `multi_header_3lvl` | 5,000 行，3 层嵌套表头 |
| 组合场景 | `merge+multiHeader` | 3,000 行，合并 + 多级表头 |
| | `merge+virtualX` | 3,000 行 × 20 列，合并 + virtualX |
| | `all_features` | 2,000 行 × 20 列，全功能叠加 |

## 使用方式

### 运行全量基准测试

```bash
# 在项目根目录下执行
node test/perf/run-perf-benchmark.mjs
```

脚本会自动完成以下流程：

1. 保存当前分支状态
2. 依次 checkout 每个目标版本（tag 或 branch）
3. 对每个版本执行 `pnpm install` 安装依赖
4. 复制测试文件并运行 `vitest`
5. 收集 `[PERF]` 输出，保存到 `results/` 目录
6. 恢复原始分支和依赖
7. 生成 `results/REPORT.md` 报告

### 单独运行测试（当前版本）

```bash
# 仅对当前代码运行性能测试
npx vitest run test/perf/scrollPerf.test.js
```

### 查看可视化报告

用浏览器直接打开 `results/benchmark.html`，包含 9 个 ECharts 图表：

- 纵向/横向/合并/多级表头 mount 耗时柱状图
- 合并单元格滚动性能对比（核心图表，opt-merge 绿色高亮）
- DOM 节点数对比
- 非虚拟基线面积图
- 全场景 mount 耗时热力图

## 测试版本

在 `run-perf-benchmark.mjs` 的 `VERSIONS` 数组中配置：

```js
const VERSIONS = [
    { name: '0.8.14', type: 'tag' },          // git tag
    { name: '0.9.3', type: 'tag' },
    { name: '0.10.0', type: 'tag' },
    { name: '0.11.15', type: 'tag' },
    { name: '1.0.4', type: 'tag' },
    { name: '1.1.0', type: 'tag' },
    { name: 'optimize-cell-merge-render', type: 'branch' },  // git branch
];
```

- `type: 'tag'` — 通过 `git switch --detach <tag>` 检出
- `type: 'branch'` — 通过 `git switch <branch>` 检出

### 添加新版本

1. 在 `VERSIONS` 数组中添加条目
2. 重新运行脚本即可

## 指标说明

| 指标 | 含义 | 单位 |
|------|------|------|
| `mount` | 组件创建 + 初始渲染耗时 | ms |
| `domNodes` | 渲染的 DOM 元素总数 | 个 |
| `renderedRows` | tbody 中实际渲染的 `<tr>` 行数 | 个 |
| `scrollMid` | 滚动到 ~5000 行后虚拟滚动重算耗时 | ms |
| `scrollDeep` | 滚动到 90%+ 深度后重算耗时 | ms |
| `scrollX` | 横向虚拟滚动重算耗时 | ms |
| `scrollXY` | 横向 + 纵向同时滚动重算耗时 | ms |

每个数值为 **5 次运行的中位数**（排除 1 次预热）。

## 注意事项

- 测试环境为 **happy-dom**（无真实浏览器布局），scroll 耗时绝对值偏小，但版本间**相对差异**有效
- 每个版本需重新 `pnpm install`，全量测试约需 **5~10 分钟**
- 如果某版本缺少某功能（如 `registerFeature` 在 0.11.0 之前不存在），对应测试会自动跳过
- 运行过程中请勿手动切换分支
