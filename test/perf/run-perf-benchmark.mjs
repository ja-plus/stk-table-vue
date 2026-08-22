/**
 * StkTable Version Performance Benchmark Runner (Node.js)
 *
 * Iterates through versions, runs scrollPerf.test.js, collects results,
 * and generates JSON data + markdown report, then serves benchmark.html.
 *
 * Usage:
 *   node test/perf/run-perf-benchmark.mjs            # 增量模式：仅测试缺少数据的版本
 *   node test/perf/run-perf-benchmark.mjs 1.1.0      # 强制重测指定版本（可多个，空格分隔）
 *   node test/perf/run-perf-benchmark.mjs all        # 强制重测列表中所有版本
 *   node test/perf/run-perf-benchmark.mjs --no-serve # 结束后不启动本地服务
 *
 * 已有数据（results/{version}.json 合法且非空）的版本默认不重复测试，
 * 聚合数据 data.json 与 REPORT.md 每次都会基于全量结果重新生成。
 *
 * 分支恢复：build/install 会改动被 git 跟踪的 lib/ 构建产物与 pnpm-lock.yaml，
 * 导致切换回原分支失败；脚本结束后会自动清理这些改动并强制切回，无需手动处理。
 */
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, unlinkSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// ─── Configuration ──────────────────────────────────────────────────────────
const VERSIONS = [
    { name: '0.8.14', type: 'tag' },
    { name: '0.9.3', type: 'tag' },
    { name: '0.10.0', type: 'tag' },
    { name: '0.11.15', type: 'tag' },
    { name: '1.0.4', type: 'tag' },
    { name: '1.1.0', type: 'tag' },
    { name: '1.2.0', type: 'tag' },
    { name: 'master', type: 'branch' },
];

const RESULTS_DIR = resolve(ROOT, 'test/perf/results');
const SOURCE_FILE = resolve(__dirname, 'scrollPerf.test.js');
const TEST_FILE = resolve(ROOT, 'test/scrollPerf.test.js');
const TMP_TEST = resolve(__dirname, '.scrollPerf.test.js.bak');
const SERVE_PORT = 4399;

// Scenario metadata — keys MUST match the [PERF] test names printed in scrollPerf.test.js
const SCENARIO_META = {
    vertical_10k:       { category: 'vertical',   label: '纵向 10K行' },
    vertical_50k:       { category: 'vertical',   label: '纵向 50K行' },
    non_virtual_500:    { category: 'vertical',   label: '非虚拟 500行' },
    virtualX_30cols:    { category: 'horizontal', label: '横向 30列' },
    virtualX_50cols:    { category: 'horizontal', label: '横向 50列' },
    mergeCells_rowspan: { category: 'merge',      label: '合并 rowspan' },
    mergeCells_colspan: { category: 'merge',      label: '合并 colspan' },
    mergeCells_mixed:   { category: 'merge',      label: '合并 mixed' },
    multi_header_3lvl:  { category: 'header',     label: '3层表头' },
    'merge+multiHeader':{ category: 'combined',   label: '合并+多级表头' },
    'merge+virtualX':   { category: 'combined',   label: '合并+virtualX' },
    all_features:       { category: 'combined',   label: '全功能' },
    autoRowHeight_10k:       { category: 'autoHeight', label: '变高 10K行' },
    autoRowHeight_50k:       { category: 'autoHeight', label: '变高 50K行' },
    autoRowHeight_setHeight: { category: 'autoHeight', label: '变高 setAutoHeight' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function exec(cmd, opts = {}) {
    try {
        return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 300_000, ...opts }).trim();
    } catch (e) {
        return null;
    }
}

function log(msg) {
    console.log(`[Runner] ${msg}`);
}

/**
 * 恢复指定分支。build/install 会改动被跟踪的 lib/ 产物与 pnpm-lock.yaml，
 * 直接 git switch 会因「本地改动/未跟踪文件将被覆盖」而失败，
 * 此时先丢弃这些改动、删除构建产物，再重试切换。
 */
function restoreBranch(name) {
    if (exec(`git switch ${name}`) !== null) return true;
    log(`✗ git switch ${name} 失败，清理 build/install 产生的文件改动后重试...`);
    // 丢弃 build/install 对跟踪文件（lib 构建产物、lockfile）的改动
    exec('git checkout -- lib pnpm-lock.yaml');
    // 删除构建产生的新产物与脚本临时文件（lib 为可重建产物，results/ 下的数据文件不受影响）
    exec('git clean -fd -- lib test/scrollPerf.test.js test/perf/.scrollPerf.test.js.bak');
    if (exec(`git switch ${name}`) !== null) return true;
    log(`✗ 清理后仍无法切回 ${name}，请执行 git status 检查工作区并手动恢复`);
    return false;
}

function resultFile(name) {
    return resolve(RESULTS_DIR, `${name}.json`);
}

/** 读取已有的单版本结果文件，合法则返回 scenarios 对象，否则返回 null */
function loadExistingResult(name) {
    const file = resultFile(name);
    if (!existsSync(file)) return null;
    try {
        const d = JSON.parse(readFileSync(file, 'utf-8'));
        if (d && d.version === name && d.scenarios && Object.keys(d.scenarios).length > 0) {
            return d.scenarios;
        }
    } catch {
        /* 文件损坏，视为无数据 */
    }
    return null;
}

function parsePerfLine(line) {
    const match = line.match(/\[PERF\]\s+(\S+)\s*\|\s*(.*)/);
    if (!match) return null;
    const testName = match[1];
    const metricsStr = match[2];
    if (/^SKIPPED/.test(metricsStr)) return { testName, metrics: null };
    const metrics = {};
    for (const part of metricsStr.split('|').map(s => s.trim())) {
        const kv = part.match(/^(\w+)=(.+)$/);
        if (kv) {
            const val = parseFloat(kv[2]);
            metrics[kv[1]] = isNaN(val) ? kv[2] : val;
        }
    }
    return { testName, metrics };
}

/** 构建当前检出版本并统计 lib/ 产物体积（原始 + gzip），失败返回 null */
function measureBundleSize() {
    const buildOutput = exec('pnpm build 2>&1 | tail -5');
    if (buildOutput === null) return null;
    const libDir = resolve(ROOT, 'lib');
    if (!existsSync(libDir)) return null;
    const size = { jsRaw: 0, jsGzip: 0, cssRaw: 0, cssGzip: 0, totalRaw: 0, files: [] };
    for (const f of readdirSync(libDir)) {
        const fp = join(libDir, f);
        if (!statSync(fp).isFile()) continue; // 只统计根级产物文件，忽略 src/ test/ 目录
        const buf = readFileSync(fp);
        const gz = gzipSync(buf).length;
        size.totalRaw += buf.length;
        if (f.endsWith('.js')) { size.jsRaw += buf.length; size.jsGzip += gz; }
        if (f.endsWith('.css')) { size.cssRaw += buf.length; size.cssGzip += gz; }
        size.files.push({ name: f, raw: buf.length, gzip: gz });
    }
    return size.files.length ? size : null;
}

function parseCliArgs(argv) {
    const positional = argv.filter(a => !a.startsWith('--'));
    const noServe = argv.includes('--no-serve');
    const forceAll = positional.includes('all');
    const requested = positional.filter(a => a !== 'all');
    const unknown = requested.filter(a => !VERSIONS.some(v => v.name === a));
    if (unknown.length) {
        log(`✗ 未知版本: ${unknown.join(', ')}`);
        log(`  可选版本: ${VERSIONS.map(v => v.name).join(', ')} 或 all`);
        process.exit(1);
    }
    return { forceAll, requested, noServe };
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const { forceAll, requested, noServe } = parseCliArgs(process.argv.slice(2));

mkdirSync(RESULTS_DIR, { recursive: true });

const toTest = new Set();
if (forceAll) {
    VERSIONS.forEach(v => toTest.add(v.name));
} else if (requested.length) {
    requested.forEach(n => toTest.add(n));
} else {
    for (const v of VERSIONS) {
        if (!loadExistingResult(v.name)) toTest.add(v.name);
    }
}

const skipped = VERSIONS.map(v => v.name).filter(n => !toTest.has(n));

log(`版本总数: ${VERSIONS.length}, 待测试: ${toTest.size}, 复用已有数据: ${skipped.length}`);
if (skipped.length) log(`  复用: ${skipped.join(', ')}`);
if (toTest.size) log(`  测试: ${[...toTest].join(', ')}`);

// ─── Main ───────────────────────────────────────────────────────────────────

// allResults[name] = { status: 'ok', scenarios: { [testName]: metrics|null } } | { status: 'error'|'no_data', ... }
const allResults = {};

// 复用已有数据
for (const name of skipped) {
    allResults[name] = { status: 'ok', scenarios: loadExistingResult(name), reused: true };
}

if (toTest.size) {
    // 未提交改动会污染测试结果或阻塞切换分支，直接拒绝运行（lib/ 构建产物由循环内自动清理）
    const blockers = (exec('git status --porcelain --untracked-files=no') || '').split('\n').filter(Boolean);
    if (blockers.length) {
        log(`✗ 工作区存在未提交改动（lib/ 构建产物除外），请先提交或 stash 后重试：`);
        blockers.forEach(l => log(`  ${l}`));
        process.exit(1);
    }

    copyFileSync(SOURCE_FILE, TMP_TEST);
    const originalBranch = exec('git branch --show-current') || 'master';
    log(`Original branch: ${originalBranch}`);

    try {
        for (const ver of VERSIONS) {
            if (!toTest.has(ver.name)) continue;

            // 上一版本 build/install 产生的 lib/、pnpm-lock.yaml 改动会阻塞切换，先清理（产物可重建）
            if ((exec('git status --porcelain -- lib') || '').trim()) {
                exec('git checkout -- lib');
                exec('git clean -fd -- lib');
            }
            exec('git checkout -- pnpm-lock.yaml');

            log(`\n${'='.repeat(60)}`);
            log(`Testing: ${ver.name}`);
            log('='.repeat(60));

            // 重测前先删除旧结果，避免失败时残留过期数据
            if (existsSync(resultFile(ver.name))) unlinkSync(resultFile(ver.name));

            const checkoutCmd = ver.type === 'tag' ? `git checkout ${ver.name}` : `git switch ${ver.name}`;
            const checkoutResult = exec(checkoutCmd);
            if (checkoutResult === null) {
                log(`✗ Failed to checkout ${ver.name}, skipping`);
                allResults[ver.name] = { status: 'error', error: 'checkout failed' };
                continue;
            }

            log('Installing dependencies...');
            const installResult = exec('pnpm install --no-frozen-lockfile 2>&1 | tail -5');
            if (installResult === null) {
                log(`✗ pnpm install failed for ${ver.name}, skipping`);
                allResults[ver.name] = { status: 'error', error: 'install failed' };
                continue;
            }

            log('Building & measuring bundle size...');
            const bundleSize = measureBundleSize();
            if (bundleSize) {
                log(`✓ bundle size: js ${(bundleSize.jsRaw / 1024).toFixed(1)} KB (gzip ${(bundleSize.jsGzip / 1024).toFixed(1)} KB), css ${(bundleSize.cssRaw / 1024).toFixed(1)} KB`);
            } else {
                log('✗ build failed, bundle size skipped');
            }

            copyFileSync(TMP_TEST, TEST_FILE);

            log('Running performance tests...');
            const testOutput = exec('npx vitest run --reporter=verbose test/scrollPerf.test.js 2>&1', { timeout: 300_000 });

            if (existsSync(TEST_FILE)) unlinkSync(TEST_FILE);

            if (testOutput === null) {
                log(`✗ Tests failed/timed out for ${ver.name}`);
                allResults[ver.name] = { status: 'error', error: 'test timeout' };
                continue;
            }

            const perfLines = testOutput.split('\n').filter(l => l.includes('[PERF]')).map(l => l.trim());
            const testResultLine = testOutput.split('\n').find(l => l.includes('Test Files'));
            const hasFailure = testResultLine && testResultLine.includes('failed');

            const scenarios = {};
            for (const line of perfLines) {
                const parsed = parsePerfLine(line);
                if (parsed) scenarios[parsed.testName] = parsed.metrics;
            }
            const validCount = Object.values(scenarios).filter(m => m).length;

            if (validCount === 0) {
                log(`✗ No perf data for ${ver.name}`);
                allResults[ver.name] = { status: 'no_data', bundleSize };
            } else {
                log(`✓ ${validCount} benchmarks collected${hasFailure ? ' (with some failures)' : ''}`);
                allResults[ver.name] = { status: 'ok', scenarios, bundleSize };
                perfLines.forEach(l => log(`  ${l.replace(/.*\[PERF\] /, '')}`));
            }
        }
    } finally {
        // ─── Restore ────────────────────────────────────────────────────────
        log(`\nRestoring branch to ${originalBranch}...`);
        const restored = restoreBranch(originalBranch);
        if (existsSync(TEST_FILE)) unlinkSync(TEST_FILE);
        if (existsSync(TMP_TEST)) unlinkSync(TMP_TEST);

        if (!restored) {
            log('✗ 未能恢复原分支，已终止后续流程（结果文件未写入）');
            process.exit(1);
        }

        log('Restoring dependencies...');
        const restoreInstall = exec('pnpm install --no-frozen-lockfile 2>&1 | tail -3');
        if (restoreInstall === null) log('✗ WARNING: 依赖恢复失败，请手动运行 pnpm install');

        // 最后清理 build 产生的 lib/ 产物改动，保证结束后工作区干净
        log('Cleaning lib/ build artifacts...');
        exec('git checkout -- lib');
        exec('git clean -fd -- lib');
    }
}

// ─── Generate JSON Data ─────────────────────────────────────────────────────

log('\nGenerating JSON data...');

// 确保结果目录存在（旧版本 tag 可能没有 test/perf 目录，切换恢复后需重建）
mkdirSync(RESULTS_DIR, { recursive: true });

// 写入新测版本的单版本 JSON（复用版本的文件保持原样）
for (const ver of VERSIONS) {
    const r = allResults[ver.name];
    if (r?.status !== 'ok' || r.reused) continue;
    // 构建失败时保留该版本已有的体积数据
    const bundleSize = r.bundleSize ?? readBundleSize(ver.name);
    const verData = { version: ver.name, type: ver.type, scenarios: r.scenarios, bundleSize };
    writeFileSync(resultFile(ver.name), JSON.stringify(verData, null, 2), 'utf-8');
}

// Build structured data: { versions, scenarios: { [name]: { category, label, data: { [ver]: metrics } } }, bundleSize }
const scenarios = {};
const bundleSize = {};
const testedVersions = [];

for (const ver of VERSIONS) {
    const r = allResults[ver.name];
    if (r?.status !== 'ok') continue;
    testedVersions.push(ver.name);

    const bs = r.bundleSize ?? readBundleSize(ver.name);
    if (bs) bundleSize[ver.name] = bs;

    for (const [testName, metrics] of Object.entries(r.scenarios)) {
        if (!metrics) continue; // SKIPPED
        if (!scenarios[testName]) {
            const meta = SCENARIO_META[testName] || { category: 'other', label: testName };
            scenarios[testName] = { category: meta.category, label: meta.label, data: {} };
        }
        scenarios[testName].data[ver.name] = metrics;
    }
}

const dataJson = {
    generatedAt: new Date().toISOString(),
    versions: testedVersions,
    scenarios,
    bundleSize,
};

const dataPath = resolve(RESULTS_DIR, 'data.json');
writeFileSync(dataPath, JSON.stringify(dataJson, null, 2), 'utf-8');
log(`JSON data written to: ${dataPath}`);

// ── Generate Markdown Report ───────────────────────────────────────────────

log('Generating markdown report...');

function fmtMetrics(m) {
    return Object.entries(m).map(([k, v]) => `${k}=${typeof v === 'number' ? +v.toFixed(2) : v}`).join(' | ');
}

function fmtKB(bytes) {
    return bytes != null ? `${(bytes / 1024).toFixed(2)} KB` : '-';
}

/** 读取单版本结果文件中已有的 bundleSize 数据 */
function readBundleSize(name) {
    const file = resultFile(name);
    if (!existsSync(file)) return null;
    try {
        const d = JSON.parse(readFileSync(file, 'utf-8'));
        return d?.bundleSize ?? null;
    } catch {
        return null;
    }
}

const report = [];
report.push('# StkTable 滚动性能测试报告');
report.push('');
report.push(`> 自动生成时间: ${new Date().toLocaleString('zh-CN')}`);
report.push('> 测试环境: happy-dom (vitest), 单位: 毫秒(ms)');
report.push('> 每个数值为 5 次运行的中位数 (排除 1 次预热)');
report.push('');
report.push('## 指标说明');
report.push('');
report.push('| 指标 | 说明 |');
report.push('|------|------|');
report.push('| mount | 组件创建 + 初始渲染耗时 |');
report.push('| domNodes | 渲染的 DOM 元素总数 (越少说明虚拟滚动越好) |');
report.push('| renderedRows | tbody 中渲染的 `<tr>` 行数 |');
report.push('| scrollMid | 滚动到中间位置 (~5000行) 后虚拟滚动重算耗时 |');
report.push('| scrollDeep | 滚动到 90%+ 深度后虚拟滚动重算耗时 |');
report.push('| scrollX | 横向虚拟滚动重算耗时 |');
report.push('| scrollXY | 横向 + 纵向同时滚动重算耗时 |');
report.push('');

// Mount table
report.push('## 总览 — 初始渲染耗时 (mount, ms)');
report.push('');
report.push('| 测试场景 | ' + testedVersions.join(' | ') + ' |');
report.push('|' + '-'.repeat(18) + '|' + testedVersions.map(() => '-'.repeat(14)).join('|') + '|');

for (const s of Object.values(scenarios)) {
    let row = `| ${s.label} `;
    for (const v of testedVersions) {
        const m = s.data[v];
        row += m?.mount != null ? `| ${m.mount.toFixed(2)} ` : '| - ';
    }
    row += '|';
    report.push(row);
}
report.push('');

// Scroll table
report.push('## 总览 — 滚动重算耗时 (scroll, ms)');
report.push('');

for (const s of Object.values(scenarios)) {
    const scrollKeys = new Set();
    for (const v of testedVersions) {
        const m = s.data[v];
        if (m) Object.keys(m).filter(k => k.startsWith('scroll')).forEach(k => scrollKeys.add(k));
    }
    if (scrollKeys.size === 0) continue;

    report.push(`### ${s.label}`);
    report.push('');
    report.push('| 指标 | ' + testedVersions.join(' | ') + ' |');
    report.push('|' + '-'.repeat(12) + '|' + testedVersions.map(() => '-'.repeat(14)).join('|') + '|');

    for (const key of scrollKeys) {
        let row = `| ${key} `;
        for (const v of testedVersions) {
            const m = s.data[v];
            row += m?.[key] != null ? `| ${m[key].toFixed(2)} ` : '| - ';
        }
        row += '|';
        report.push(row);
    }
    report.push('');
}

// DOM nodes table
report.push('## 总览 — DOM 节点数');
report.push('');
report.push('| 测试场景 | ' + testedVersions.join(' | ') + ' |');
report.push('|' + '-'.repeat(18) + '|' + testedVersions.map(() => '-'.repeat(14)).join('|') + '|');

for (const s of Object.values(scenarios)) {
    let row = `| ${s.label} `;
    let hasNodes = false;
    for (const v of testedVersions) {
        const m = s.data[v];
        if (m?.domNodes != null) { row += `| ${m.domNodes} `; hasNodes = true; }
        else row += '| - ';
    }
    if (hasNodes) { row += '|'; report.push(row); }
}
report.push('');

// Bundle size table
report.push('## 总览 — 构建产物体积');
report.push('');
report.push('> 统计 `pnpm build` 输出的 `lib/` 根级产物文件（未压缩 ES 构建，vue 为 external）');
report.push('');
report.push('| 指标 | ' + testedVersions.join(' | ') + ' |');
report.push('|' + '-'.repeat(14) + '|' + testedVersions.map(() => '-'.repeat(14)).join('|') + '|');
const bsRows = [
    ['JS 原始体积', bs => fmtKB(bs.jsRaw)],
    ['JS gzip', bs => fmtKB(bs.jsGzip)],
    ['CSS 原始体积', bs => fmtKB(bs.cssRaw)],
    ['CSS gzip', bs => fmtKB(bs.cssGzip)],
    ['产物总计 (原始)', bs => fmtKB(bs.totalRaw)],
];
for (const [label, getter] of bsRows) {
    let row = `| ${label} `;
    for (const v of testedVersions) {
        const bs = allResults[v]?.bundleSize ?? readBundleSize(v);
        row += `| ${bs ? getter(bs) : '-'} `;
    }
    row += '|';
    report.push(row);
}
report.push('');

// Per-version detail
report.push('## 各版本详细数据');
report.push('');
for (const ver of VERSIONS) {
    const r = allResults[ver.name];
    report.push(`### ${ver.name}${r?.reused ? ' (复用已有数据)' : ''}`);
    report.push('');
    if (r?.status === 'ok') {
        report.push('```');
        for (const [name, m] of Object.entries(r.scenarios)) {
            report.push(`[PERF] ${name} | ${m ? fmtMetrics(m) : 'SKIPPED'}`);
        }
        report.push('```');
    } else if (r?.status === 'error') {
        report.push(`> Error: ${r.error}`);
    } else if (r?.status === 'no_data') {
        report.push('> No performance data captured');
    } else {
        report.push('> Skipped');
    }
    report.push('');
}

const reportPath = resolve(RESULTS_DIR, 'REPORT.md');
writeFileSync(reportPath, report.join('\n'), 'utf-8');
log(`Report written to: ${reportPath}`);
log('Done!');

// ─── Serve benchmark.html ───────────────────────────────────────────────────

if (noServe) {
    log('(--no-serve) 跳过本地服务。');
} else {
    const MIME = {
        '.html': 'text/html; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
    };

    const server = createServer((req, res) => {
        let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        if (pathname === '/') pathname = '/benchmark.html';
        const filePath = join(RESULTS_DIR, pathname);
        // 防止路径穿越
        if (!filePath.startsWith(RESULTS_DIR)) {
            res.writeHead(403);
            return res.end('Forbidden');
        }
        if (!existsSync(filePath)) {
            res.writeHead(404);
            return res.end('Not Found');
        }
        res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        res.end(readFileSync(filePath));
    });

    const tryListen = (port) => {
        server.listen(port, () => {
            log(`\nBenchmark server running:`);
            log(`  → http://localhost:${port}/benchmark.html`);
            log('按 Ctrl+C 停止服务。');
        });
    };
    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE' && server.listenPort < SERVE_PORT + 10) {
            server.listenPort += 1;
            return tryListen(server.listenPort);
        }
        log(`✗ 服务启动失败: ${e.message}`);
        log(`  可手动打开: ${resolve(RESULTS_DIR, 'benchmark.html')}（需 http 服务支持 fetch data.json）`);
        process.exit(1);
    });
    server.listenPort = SERVE_PORT;
    tryListen(SERVE_PORT);
}
