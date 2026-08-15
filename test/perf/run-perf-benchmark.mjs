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
 */
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, unlinkSync, readdirSync } from 'node:fs';
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
    { name: 'optimize-cell-merge-render', type: 'branch' },
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
    copyFileSync(SOURCE_FILE, TMP_TEST);
    const originalBranch = exec('git branch --show-current') || 'master';
    log(`Original branch: ${originalBranch}`);

    try {
        for (const ver of VERSIONS) {
            if (!toTest.has(ver.name)) continue;

            log(`\n${'='.repeat(60)}`);
            log(`Testing: ${ver.name}`);
            log('='.repeat(60));

            // 重测前先删除旧结果，避免失败时残留过期数据
            if (existsSync(resultFile(ver.name))) unlinkSync(resultFile(ver.name));

            const checkoutCmd = ver.type === 'tag' ? `git switch --detach ${ver.name}` : `git switch ${ver.name}`;
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
                allResults[ver.name] = { status: 'no_data' };
            } else {
                log(`✓ ${validCount} benchmarks collected${hasFailure ? ' (with some failures)' : ''}`);
                allResults[ver.name] = { status: 'ok', scenarios };
                perfLines.forEach(l => log(`  ${l.replace(/.*\[PERF\] /, '')}`));
            }
        }
    } finally {
        // ─── Restore ────────────────────────────────────────────────────────
        log(`\nRestoring branch to ${originalBranch}...`);
        exec(`git switch ${originalBranch}`);
        if (existsSync(TEST_FILE)) unlinkSync(TEST_FILE);
        if (existsSync(TMP_TEST)) unlinkSync(TMP_TEST);

        log('Restoring dependencies...');
        exec('pnpm install --no-frozen-lockfile 2>&1 | tail -3');
    }
}

// ─── Generate JSON Data ─────────────────────────────────────────────────────

log('\nGenerating JSON data...');

// 写入新测版本的单版本 JSON（复用版本的文件保持原样）
for (const ver of VERSIONS) {
    const r = allResults[ver.name];
    if (r?.status !== 'ok' || r.reused) continue;
    const verData = { version: ver.name, type: ver.type, scenarios: r.scenarios };
    writeFileSync(resultFile(ver.name), JSON.stringify(verData, null, 2), 'utf-8');
}

// Build structured data: { versions, scenarios: { [name]: { category, label, data: { [ver]: metrics } } } }
const scenarios = {};
const testedVersions = [];

for (const ver of VERSIONS) {
    const r = allResults[ver.name];
    if (r?.status !== 'ok') continue;
    testedVersions.push(ver.name);

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
};

const dataPath = resolve(RESULTS_DIR, 'data.json');
writeFileSync(dataPath, JSON.stringify(dataJson, null, 2), 'utf-8');
log(`JSON data written to: ${dataPath}`);

// ── Generate Markdown Report ───────────────────────────────────────────────

log('Generating markdown report...');

function fmtMetrics(m) {
    return Object.entries(m).map(([k, v]) => `${k}=${typeof v === 'number' ? +v.toFixed(2) : v}`).join(' | ');
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
