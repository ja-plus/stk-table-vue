/**
 * StkTable Version Performance Benchmark Runner (Node.js)
 *
 * Iterates through versions, runs scrollPerf.test.js, collects results,
 * and generates JSON data + markdown report.
 *
 * Usage: node test/perf/run-perf-benchmark.mjs
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, unlinkSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
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

// Scenario metadata — labels used in charts
const SCENARIO_META = {
    vertical_10k:      { category: 'vertical',   label: '纵向 10K行' },
    vertical_50k:      { category: 'vertical',   label: '纵向 50K行' },
    non_virtual_500:   { category: 'vertical',   label: '非虚拟 500行' },
    virtualX_30cols:   { category: 'horizontal', label: '横向 30列' },
    virtualX_50cols:   { category: 'horizontal', label: '横向 50列' },
    mergeCells_rowspan:{ category: 'merge',      label: '合并 rowspan' },
    mergeCells_colspan:{ category: 'merge',      label: '合并 colspan' },
    mergeCells_mixed:  { category: 'merge',      label: '合并 mixed' },
    multi_header_3lvl: { category: 'header',     label: '3层表头' },
    merge_multiHeader: { category: 'combined',   label: '合并+多级表头' },
    merge_virtualX:    { category: 'combined',   label: '合并+virtualX' },
    all_features:      { category: 'combined',   label: '全功能' },
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

function parsePerfLine(line) {
    const match = line.match(/\[PERF\]\s+(\S+)\s*\|\s*(.*)/);
    if (!match) return null;
    const testName = match[1];
    const metricsStr = match[2];
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

// ─── Main ───────────────────────────────────────────────────────────────────

copyFileSync(SOURCE_FILE, TMP_TEST);
const originalBranch = exec('git branch --show-current') || 'perf-test';
log(`Original branch: ${originalBranch}`);

mkdirSync(RESULTS_DIR, { recursive: true });

// Clean old result files
for (const f of readdirSync(RESULTS_DIR)) {
    if (f.endsWith('.json') || f.endsWith('.txt')) {
        unlinkSync(resolve(RESULTS_DIR, f));
    }
}

const allResults = {};

for (const ver of VERSIONS) {
    log(`\n${'='.repeat(60)}`);
    log(`Testing: ${ver.name}`);
    log('='.repeat(60));

    let checkoutCmd = ver.type === 'tag' ? `git switch --detach ${ver.name}` : `git switch ${ver.name}`;
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

    if (testOutput === null) {
        log(`✗ Tests failed/timed out for ${ver.name}`);
        allResults[ver.name] = { status: 'error', error: 'test timeout' };
        unlinkSync(TEST_FILE);
        continue;
    }

    const perfLines = testOutput.split('\n').filter(l => l.includes('[PERF]')).map(l => l.trim());
    const testResultLine = testOutput.split('\n').find(l => l.includes('Test Files'));
    const hasFailure = testResultLine && testResultLine.includes('failed');

    if (perfLines.length === 0) {
        log(`✗ No perf data for ${ver.name}`);
        allResults[ver.name] = { status: 'no_data', output: testOutput };
    } else {
        log(`✓ ${perfLines.length} benchmarks collected${hasFailure ? ' (with some failures)' : ''}`);
        allResults[ver.name] = { status: 'ok', perfLines, testResultLine };
        perfLines.forEach(l => log(`  ${l.replace(/.*\[PERF\] /, '')}`));
    }

    unlinkSync(TEST_FILE);
}

// ─── Restore ───────────────────────────────────────────────────────────────

log(`\nRestoring branch to ${originalBranch}...`);
exec(`git switch ${originalBranch}`);
copyFileSync(TMP_TEST, TEST_FILE);
unlinkSync(TMP_TEST);

log('Restoring dependencies...');
exec('pnpm install --no-frozen-lockfile 2>&1 | tail -3');

// ─── Generate JSON Data ─────────────────────────────────────────────────────

log('\nGenerating JSON data...');

// Build structured data: { versions, scenarios: { [name]: { category, label, data: { [ver]: metrics } } } }
const scenarios = {};
const testedVersions = [];

for (const ver of VERSIONS) {
    const r = allResults[ver.name];
    if (r?.status !== 'ok') continue;
    testedVersions.push(ver.name);

    for (const line of r.perfLines) {
        const parsed = parsePerfLine(line);
        if (!parsed) continue;
        const { testName, metrics } = parsed;
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

// Also save per-version JSON for reference
for (const ver of VERSIONS) {
    const r = allResults[ver.name];
    if (r?.status !== 'ok') continue;
    const verData = { version: ver.name, type: ver.type, scenarios: {} };
    for (const line of r.perfLines) {
        const parsed = parsePerfLine(line);
        if (parsed) verData.scenarios[parsed.testName] = parsed.metrics;
    }
    writeFileSync(resolve(RESULTS_DIR, `${ver.name}.json`), JSON.stringify(verData, null, 2), 'utf-8');
}
log(`Per-version JSON files written to: ${RESULTS_DIR}`);

// ── Generate Markdown Report ───────────────────────────────────────────────

log('Generating markdown report...');

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
report.push('| 测试场景 | ' + testedVersions.map(v => v).join(' | ') + ' |');
report.push('|' + '-'.repeat(18) + '|' + testedVersions.map(() => '-'.repeat(14)).join('|') + '|');

for (const [name, s] of Object.entries(scenarios)) {
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

for (const [name, s] of Object.entries(scenarios)) {
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

for (const [name, s] of Object.entries(scenarios)) {
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
    report.push(`### ${ver.name}`);
    report.push('');
    if (r?.status === 'ok') {
        report.push('```');
        r.perfLines.forEach(l => report.push(l));
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
