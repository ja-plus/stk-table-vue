import type { AgentMessage, AgentMessageKind } from './types';

/** 一轮对话中的一次 Agent 动作 */
type MockStep = {
    kind: Exclude<AgentMessageKind, 'user'>;
    content: string;
    meta?: string;
};

/** 一轮完整对话：用户提问 + 思考/查阅/终端/回复序列 */
type MockRound = {
    prompt: string;
    steps: MockStep[];
};

const mockRounds: MockRound[] = [
    {
        prompt: '帮我看下 5 万行数据时的滚动帧率，固定列那块感觉有点掉帧。',
        steps: [
            {
                kind: 'thinking',
                content:
                    '先在性能基准里分别压纵向和横向滚动。\n如果只有横向掉帧，问题大概率在固定列的 sticky 重排。',
                meta: '思考了 7 秒',
            },
            {
                kind: 'search',
                content:
                    'useVirtualScroll.ts · 12 处匹配\nuseFixedCol.ts · 6 处匹配\nStkTable.vue · 3 处匹配',
                meta: '命中 21 处',
            },
            {
                kind: 'assistant',
                content:
                    '基准结果：纵向 60.1 fps，横向 42.7 fps。\n横向掉帧集中在固定列的 sticky 位置计算。\n我先做一版最小改动，把列的 left 偏移收敛成一次读写。',
            },
            {
                kind: 'terminal',
                content:
                    '$ pnpm perf --rows 50000\n纵向滚动   60.1 fps\n横向滚动   42.7 fps\nsticky 重排 38%',
                meta: '退出码 0',
            },
            {
                kind: 'assistant',
                content:
                    '补丁已经跑通。\n\n核心改动：\n1. 固定列偏移改为一次性读取布局，避免读写交错；\n2. 横向滚动时跳过行高重测；\n3. 固定列单元格加 contain: paint。\n\n复测横向滚动 58.9 fps，纵向基本不变。',
            },
        ],
    },
    {
        prompt: '固定列在虚拟滚动时偶尔错位一格，停下来就恢复正常，怎么回事？',
        steps: [
            {
                kind: 'thinking',
                content:
                    '停下来能恢复，说明不是布局计算错了，而是滚动事件和虚拟列表占位 DOM 更新错开了一帧。',
                meta: '思考了 4 秒',
            },
            {
                kind: 'search',
                content: 'fixed-col.spec.ts · 2 处匹配\nuseVirtualScroll.ts · 5 处匹配',
                meta: '命中 7 处',
            },
            {
                kind: 'assistant',
                content:
                    '是滚动事件先到、占位 DOM 后更新的那一帧里，sticky 偏移还在用旧的滚动位置。\n先补一个回归用例，再调整更新顺序。',
            },
            {
                kind: 'terminal',
                content: '$ pnpm vitest run test/fixed-col.spec.ts\n✓ 14 passed\n✓ 1 skipped',
                meta: '退出码 0',
            },
            {
                kind: 'assistant',
                content:
                    '已修复：滚动回调里先同步虚拟列表的 transform，再更新固定列偏移。\n回归用例覆盖了快速滚动和反向滚动两种路径，CI 已通过。',
            },
        ],
    },
    {
        prompt: '给对话列表加个自动跟随底部吧，用户上滑的时候要暂停。',
        steps: [
            {
                kind: 'assistant',
                content:
                    '可以。判断条件是 scrollHeight - scrollTop - clientHeight <= 8 时视为贴底；上滑后置 followTail = false，点“回到底部”或手动滚到底再恢复。',
            },
            {
                kind: 'assistant',
                content:
                    '已经接好了：\n- 新消息追加后只在贴底状态下滚动；\n- 暂停跟随时显示回到底部按钮；\n- 容器尺寸变化重建虚拟布局后，如果仍在跟随就再滚一次。',
            },
        ],
    },
    {
        prompt:
            '复现步骤：\n1. 打开实时合并单元格示例\n2. 把横向滚动条拖到最右\n3. 快速上下滚动\n合并单元格会短暂盖住固定列。',
        steps: [
            {
                kind: 'thinking',
                content:
                    '合并单元格的占位矩形和固定列分属两个绘制层，滚动时两者的位置更新顺序不一致，应该能稳定复现。',
                meta: '思考了 9 秒',
            },
            {
                kind: 'search',
                content: 'merge-cells.spec.ts · 4 处匹配\nuseMergeCells.ts · 8 处匹配',
                meta: '命中 12 处',
            },
            {
                kind: 'assistant',
                content:
                    '按你给的步骤复现了，问题只在横向滚动最右端出现。\n原因是合并单元格的占位矩形没有跟随 sticky 偏移一起更新。',
            },
            {
                kind: 'terminal',
                content: '$ pnpm vitest run test/merge-cells.spec.ts\n✓ 9 passed',
                meta: '退出码 0',
            },
            {
                kind: 'assistant',
                content:
                    '修复方式是把占位矩形的偏移更新放进同一帧的布局函数里，横纵滚动共用一条更新路径。\n已补测试：合并单元格 + 固定列 + 横向滚动三种组合。',
            },
        ],
    },
    {
        prompt: '把刚才的改动整理成 PR 描述，包含背景、改动点和验证方式。',
        steps: [
            {
                kind: 'thinking',
                content: '汇总本轮涉及的三个提交，按背景、改动、验证三段来写。',
                meta: '思考了 3 秒',
            },
            {
                kind: 'assistant',
                content:
                    'PR 描述草稿：\n\n背景：虚拟滚动期间固定列的 sticky 偏移会在个别帧使用旧位置。\n\n改动：\n- 固定列偏移与虚拟列表 transform 在同一帧更新\n- 合并单元格占位矩形复用同一更新路径\n\n验证：\n- 新增快速滚动回归用例\n- merge-cells 用例覆盖横向滚动组合\n- pnpm test 全量通过',
            },
        ],
    },
    {
        prompt: '这个单测在 CI 里偶发失败，本地跑十次都没问题。',
        steps: [
            {
                kind: 'search',
                content: 'fixed-col.spec.ts · 1 处匹配\nvitest.config.ts · 2 处匹配',
                meta: '命中 3 处',
            },
            {
                kind: 'thinking',
                content:
                    'CI 机器更慢，滚动事件和 requestAnimationFrame 的时序和本地不同，怀疑是用真实计时器等待布局。',
                meta: '思考了 6 秒',
            },
            {
                kind: 'assistant',
                content: '大概率是测试里直接等待 rAF，CI 上两帧之间的间隔不稳定。',
            },
            {
                kind: 'terminal',
                content:
                    '$ pnpm vitest run test/fixed-col.spec.ts --repeat 20\n✓ 19 passed\n✗ 1 failed (retry 1)\nAssertionError: expected 128 to be 120',
                meta: '退出码 1',
            },
            {
                kind: 'assistant',
                content:
                    '确认了，失败断言读到的是上一帧的偏移。\n改成等待 nextTick 后再断言，并用 fake timers 固定 rAF 时序；连跑 50 次稳定通过。',
            },
        ],
    },
    {
        prompt: 'llms.txt 的版本号每次发版都忘改，能自动化吗？',
        steps: [
            {
                kind: 'thinking',
                content:
                    '版本号现在写死在文件头，发版脚本里没有校验，最省事的是在构建前注入。',
                meta: '思考了 5 秒',
            },
            {
                kind: 'assistant',
                content:
                    '可以。构建前用脚本读取 package.json 的 version，改写 llms.txt 的 Version 行；CI 里再加一步 diff 校验，漏改会直接失败。\n脚本放在 scripts/sync-llms-version.mjs，挂到 prepublishOnly。',
            },
            {
                kind: 'assistant',
                content:
                    '脚本已加，本地试跑：\n- 版本一致时不产生 diff；\n- 手动改错版本号后，校验步骤报错退出。',
            },
        ],
    },
    {
        prompt: '继续。',
        steps: [
            {
                kind: 'assistant',
                content:
                    '接着上面的改动，把单元测试补完并跑了全量：\n\n✓ src   118 passed\n✓ docs   12 passed\n\n暂无回归。',
            },
        ],
    },
    {
        prompt: '切换暗色主题时行高会闪一下，哪里出了问题？',
        steps: [
            {
                kind: 'thinking',
                content:
                    '主题切换会改字体和行高相关的 CSS 变量，实测行高缓存没有失效，所以会闪一下。',
                meta: '思考了 4 秒',
            },
            {
                kind: 'search',
                content: 'useAutoHeight.ts · 6 处匹配\ncustom.css · 3 处匹配',
                meta: '命中 9 处',
            },
            {
                kind: 'assistant',
                content:
                    '主题切换改了字体度量，但缓存的实测行高还在用旧值。\n可以在主题变化时清空实测行高并重建虚拟布局，和容器宽度变化的处理一致。',
            },
            {
                kind: 'assistant',
                content: '已接入：主题变化监听触发 clearAllAutoHeight + initVirtualScroll，闪烁消失。',
            },
        ],
    },
    {
        prompt: '帮我把 useVirtualScroll 里重复的边界判断抽成一个函数。',
        steps: [
            {
                kind: 'thinking',
                content: '有三处几乎一样的 start/end 索引收敛逻辑，抽成 getVisibleRange 比较自然。',
                meta: '思考了 3 秒',
            },
            {
                kind: 'assistant',
                content:
                    '抽好了，新增 getVisibleRange(total, offset, viewport)，三处调用都改成走它。\n行为不变，测试全绿。',
            },
            {
                kind: 'terminal',
                content: '$ pnpm test\nTest Files  18 passed (18)\n     Tests  126 passed (126)',
                meta: '退出码 0',
            },
        ],
    },
    {
        prompt: '虚拟列表里 autoRowHeight 的 expectedHeight 应该怎么估？估不准有影响吗？',
        steps: [
            {
                kind: 'assistant',
                content:
                    'expectedHeight 只影响滚动条的初始总高度和未渲染行的占位。\n估小了滚动条会抖动、滚动到底的过程中总高度不断变大；估大了会提前出现空白。\n按行类型给一个接近实测的值就够了，渲染后会自动校正。',
            },
            {
                kind: 'assistant',
                content:
                    '这个示例里我按消息类型估：用户气泡约 25px/行，消息正文 28px/行，终端输出 20px/行，再加固定内边距。',
            },
        ],
    },
    {
        prompt:
            '顺便确认下：\n- 长对话滚动是否只渲染可视行\n- 表格宽度变化后行高会不会重新测量\n- 自定义滚动条拖拽是否跟手',
        steps: [
            {
                kind: 'thinking',
                content:
                    '这三个问题分别对应虚拟滚动、autoResize 和自定义滚动条，逐条验证一下。',
                meta: '思考了 5 秒',
            },
            {
                kind: 'assistant',
                content:
                    '逐条确认：\n\n1. 长对话只渲染可视区域内的行，DOM 节点数保持稳定；\n2. 宽度变化时会清空实测行高并重建虚拟布局；\n3. 自定义滚动条的换算在拖拽开始时冻结，滑块与指针保持 1:1。',
            },
        ],
    },
];

/** 把一天中的分钟数格式化为 HH:mm */
function formatMinute(minuteOfDay: number) {
    const value = ((minuteOfDay % 1440) + 1440) % 1440;
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * 生成一段贴近真实的长对话历史。
 * 时间戳从“当前时刻往前推 total 分钟”开始，保证历史消息不会出现在未来。
 */
export function createMockMessages(total = 240): AgentMessage[] {
    const now = new Date();
    let cursor = now.getHours() * 60 + now.getMinutes() - total;
    const nextTime = () => {
        const time = formatMinute(cursor);
        cursor += 1;
        return time;
    };

    const list: AgentMessage[] = [];
    let id = 0;
    let roundIndex = 0;
    while (list.length < total) {
        const round = mockRounds[roundIndex % mockRounds.length];
        const model = roundIndex % 3 === 2 ? 'Qwen3.6-27B' : 'DeepSeek-V4.1-Flash-1017';

        list.push({
            id: ++id,
            role: 'user',
            kind: 'user',
            content: round.prompt,
            time: nextTime(),
            status: 'done',
        });

        for (const step of round.steps) {
            const isAssistant = step.kind === 'assistant';
            list.push({
                id: ++id,
                role: isAssistant ? 'assistant' : 'tool',
                kind: step.kind,
                content: step.content,
                time: nextTime(),
                status: 'done',
                meta: isAssistant ? model : step.meta,
                model: isAssistant ? model : undefined,
            });
        }
        roundIndex++;
    }
    return list.slice(0, total);
}