# StkTable 滚动性能基准测试

跨版本自动化性能测试框架，用于检测 StkTable 从 v0.8.x 到各版本的滚动性能趋势。

## 目录结构

```
test/perf/
├── scrollPerf.test.js          # 性能测试用例（15 个场景）
├── run-perf-benchmark.mjs      # 跨版本自动化运行脚本
├── README.md                   # 本文件
└── results/                    # 测试结果输出目录（生成产物，已 gitignore，不入库）
    ├── REPORT.md               # Markdown 性能报告（含分析总结）
    ├── benchmark.html          # ECharts 可视化页面（通过内置 http 服务打开）
    ├── data.json               # 聚合数据（benchmark.html 动态加载）
    └── {version}.json          # 各版本单版本结果（增量测试的判断依据）
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
| 变高滚动 | `autoRowHeight_10k` | 10,000 行变高（expectedHeight），虚拟滚动 |
| | `autoRowHeight_50k` | 50,000 行变高，深滚 90% |
| | `autoRowHeight_setHeight` | 10,000 行变高，批量 setAutoHeight 生效耗时 |

## 使用方式

```bash
# 在项目根目录下执行

# 增量模式（默认）：仅测试缺少数据的版本，已有 results/{version}.json 的版本直接复用
pnpm perf

# 强制重测指定版本（可传多个，空格分隔），其余版本复用已有数据
pnpm perf 1.1.0
pnpm perf 1.0.4 optimize-cell-merge-render

# 强制重测列表中的所有版本
pnpm perf all

# 结束后不启动本地服务
pnpm perf --no-serve
```

脚本会自动完成以下流程：

1. 确定待测版本（已有合法结果文件的版本默认跳过）
2. 依次 checkout 每个待测版本（tag 或 branch）
3. 对每个版本执行 `pnpm install` 安装依赖
4. 执行 `pnpm build` 并统计 `lib/` 产物体积（原始 + gzip），写入结果的 `bundleSize` 字段
5. 复制测试文件并运行 `vitest`，收集 `[PERF]` 输出写入 `results/{version}.json`
6. 恢复原始分支和依赖
7. 聚合全量数据生成 `results/data.json` 与 `results/REPORT.md`
8. 启动内置 http 服务（默认端口 4399，被占用时自动顺延），浏览器打开输出的 `benchmark.html` 地址即可查看图表

> 提示：删除某个版本的 `results/{version}.json` 后重新运行，即可只补测该版本。

### 单独运行测试（当前版本）

```bash
# 仅对当前代码运行性能测试
npx vitest run test/perf/scrollPerf.test.js
```

### 查看可视化报告

脚本结束后会自动启动 http 服务并输出地址（如 `http://localhost:4399/benchmark.html`）。也可手动在 `results/` 目录下启动任意静态服务器。页面包含：

- 纵向/横向/合并/多级表头 mount 耗时柱状图
- 合并单元格滚动性能对比（核心图表，opt-merge 绿色高亮）
- DOM 节点数对比
- 构建产物体积对比（JS 原始/gzip、CSS）
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

## 构建产物体积

每个待测版本会额外执行 `pnpm build`，统计 `lib/` 根级产物文件（忽略 `src/`、`test/` 子目录）：

| 字段 | 含义 | 单位 |
|------|------|------|
| `jsRaw` / `jsGzip` | JS 产物原始 / gzip 体积 | bytes |
| `cssRaw` / `cssGzip` | CSS 产物原始 / gzip 体积 | bytes |
| `totalRaw` | 全部产物文件原始体积合计 | bytes |
| `files` | 各产物文件的明细列表 | - |

体积数据保存在 `results/{version}.json` 的 `bundleSize` 字段，并聚合到 `data.json`；`REPORT.md` 与 `benchmark.html` 均有对应表格/图表。构建失败的版本无体积数据，重测时若构建再次失败则保留旧值。

> 注：本项目构建配置为未压缩 ES 产物（`minify: false`，vue 为 external），gzip 值更接近实际分发体积。

## 注意事项

- 测试环境为 **happy-dom**（无真实浏览器布局），scroll 耗时绝对值偏小，但版本间**相对差异**有效
- 每个版本需重新 `pnpm install`，全量测试约需 **5~10 分钟**
- 如果某版本缺少某功能（如 `registerFeature` 在 0.11.0 之前不存在），对应测试会自动跳过
- 运行过程中请勿手动切换分支
- `lib/` 构建产物与 `pnpm-lock.yaml` 被 git 跟踪：build/install 会改动它们，导致切回原分支时 git 报错。脚本结束后会自动清理这些改动并强制切回原分支；若仍恢复失败，脚本会终止并提示，此时请手动执行 `git status` 查看冲突文件
- 脚本运行前会自动丢弃 `lib/` 的未提交改动（产物可随时通过 `pnpm build` 重建）；除此之外工作区若有未提交改动（如源码、`pnpm-lock.yaml`），脚本会拒绝运行，请先提交或 stash
- `results/` 目录为脚本生成产物，已加入 `.gitignore`，不会污染 git 工作区
- 旧版本 tag（如 0.8.14）没有 `test/perf` 目录，脚本会在写结果前自动重建，无需手动创建
