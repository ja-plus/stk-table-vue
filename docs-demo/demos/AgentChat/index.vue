<script setup lang="ts">
import type { StkTableColumn } from '@/StkTable/index';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import StkTable from '../../StkTable.vue';
import MessageCell from './MessageCell.vue';
import type { AgentMessage } from './types';

type Provider = 'qwen' | 'deepseek' | 'custom';

type ProviderConfig = {
    label: string;
    endpoint: string;
    models: string[];
};

type ModelOption = {
    name: string;
    provider: Provider;
    endpoint: string;
    apiKey: string;
};

const providers: Record<Provider, ProviderConfig> = {
    qwen: {
        label: 'Qwen（匿名免费）',
        endpoint: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1',
        models: ['Qwen3.6-9B', 'Qwen3.5-9B'],
    },
    deepseek: {
        label: 'DeepSeek（匿名免费）',
        endpoint: 'https://api.llm7.io/v1',
        models: ['DeepSeek-V4-Flash-0731'],
    },
    custom: {
        label: '自定义 OpenAI 兼容端点',
        endpoint: 'https://api.deepseek.com/v1',
        models: ['deepseek-chat'],
    },
};

const initialModels: ModelOption[] = (Object.keys(providers) as Provider[]).flatMap(providerKey =>
    providers[providerKey].models.map(name => ({
        name,
        provider: providerKey,
        endpoint: providers[providerKey].endpoint,
        apiKey: '',
    })),
);
const endpoint = ref(initialModels[0].endpoint);
const model = ref(initialModels[0].name);
const apiKey = ref(initialModels[0].apiKey);
const modelOptions = ref<ModelOption[]>(initialModels);
const prompt = ref('请用三句话介绍 StkTable 的虚拟列表。');
const loading = ref(false);
const nextId = ref(1000);
const followTail = ref(true);
const attachMenuOpen = ref(false);
const modelMenuOpen = ref(false);
const thinkingMenuOpen = ref(false);
const thinkingEnabled = ref(true);
const waitingLabel = ref('等待模型返回…');
const modelManagerOpen = ref(false);
const managerModelName = ref('');
const managerProvider = ref<Provider>('custom');
const managerEndpoint = ref(providers.custom.endpoint);
const managerApiKey = ref('');
const managerError = ref('');
const attachments = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement>();
const imageInputRef = ref<HTMLInputElement>();
let waitingTimer: number | undefined;
const tableRef = ref<{
    scrollTo: (options: { top: { index: number } } | number) => void;
    initVirtualScroll: () => void;
    clearAllAutoHeight: () => void;
}>();

function now() {
    return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(
        new Date(),
    );
}

const messages = ref<AgentMessage[]>(
    Array.from({ length: 240 }, (_, index) => {
        const round = Math.floor(index / 6) + 1;
        const kind = ['user', 'thinking', 'search', 'assistant', 'terminal', 'assistant'][
            index % 6
        ] as AgentMessage['kind'];
        const isUser = kind === 'user';
        const isAssistant = kind === 'assistant';
        return {
            id: index + 1,
            role: isUser ? 'user' : isAssistant ? 'assistant' : 'tool',
            kind,
            content: isUser
                ? `请分析第 ${round} 个任务，并给出下一步建议。`
                : kind === 'thinking'
                  ? ''
                  : kind === 'search'
                    ? `${round} 列表，${round} 个文件`
                    : kind === 'terminal'
                      ? `df -h /workspace && mkdir -p /tmp/agent-${round}`
                      : `这是第 ${round} 轮 Agent 回复。长对话仍然只渲染可视区域内的行。`,
            time: '09:30',
            status: 'done',
            meta: kind === 'thinking' ? '持续了几秒' : undefined,
            model: isAssistant ? 'Qwen3.6-9B' : undefined,
        };
    }),
);

const columns: StkTableColumn<AgentMessage>[] = [
    { dataIndex: 'content', title: '', customCell: MessageCell },
];
function expectedHeight(row: AgentMessage) {
    if (row.kind === 'user' || row.kind === 'search') return 76;
    if (row.kind === 'terminal') return 92;
    if (row.kind === 'thinking') return row.status === 'running' ? 86 : 48;
    return 112;
}

function selectModel(option: ModelOption) {
    endpoint.value = option.endpoint;
    model.value = option.name;
    apiKey.value = option.apiKey;
    modelMenuOpen.value = false;
}

function openModelManager() {
    modelMenuOpen.value = false;
    modelManagerOpen.value = true;
    managerModelName.value = '';
    managerProvider.value = 'custom';
    managerEndpoint.value = providers.custom.endpoint;
    managerApiKey.value = '';
    managerError.value = '';
}

function onManagerProviderChange() {
    managerEndpoint.value = providers[managerProvider.value].endpoint;
}

function saveManagedModel() {
    const name = managerModelName.value.trim();
    const nextEndpoint = managerEndpoint.value.trim();
    if (!name || !nextEndpoint) {
        managerError.value = '请填写模型名称和接口地址。';
        return;
    }
    const nextModel: ModelOption = {
        name,
        provider: managerProvider.value,
        endpoint: nextEndpoint,
        apiKey: managerApiKey.value.trim(),
    };
    const existingIndex = modelOptions.value.findIndex(
        option => option.name === name && option.provider === nextModel.provider,
    );
    modelOptions.value =
        existingIndex >= 0
            ? modelOptions.value.map((option, index) => (index === existingIndex ? nextModel : option))
            : [...modelOptions.value, nextModel];
    selectModel(nextModel);
    modelManagerOpen.value = false;
}

function selectThinking(value: boolean) {
    thinkingEnabled.value = value;
    thinkingMenuOpen.value = false;
}

function openAttachmentPicker(type: 'file' | 'image') {
    attachMenuOpen.value = false;
    (type === 'image' ? imageInputRef : fileInputRef).value?.click();
}

function onAttachmentChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) attachments.value = [...attachments.value, ...Array.from(input.files)];
    input.value = '';
}

function removeAttachment(index: number) {
    attachments.value = attachments.value.filter((_, itemIndex) => itemIndex !== index);
}

function appendMessage(message: AgentMessage) {
    messages.value = [...messages.value, message];
}

function updateMessage(id: number, patch: Partial<AgentMessage>) {
    const index = messages.value.findIndex(item => item.id === id);
    if (index < 0) return;
    messages.value[index] = { ...messages.value[index], ...patch };
    messages.value = [...messages.value];
}

function stopWaitingTimer() {
    if (waitingTimer !== undefined) {
        window.clearInterval(waitingTimer);
        waitingTimer = undefined;
    }
}

function startWaitingTimer(messageId: number) {
    stopWaitingTimer();
    const startedAt = Date.now();
    const tick = () => {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        waitingLabel.value = seconds
            ? `等待模型返回 · 已持续 ${seconds} 秒`
            : '等待模型返回…';
        updateMessage(messageId, {
            content: waitingLabel.value,
            meta: seconds ? `持续了 ${seconds} 秒` : '正在连接模型',
        });
        void scrollToBottom();
    };
    tick();
    waitingTimer = window.setInterval(tick, 1000);
}

async function scrollToBottom(force = false) {
    if (force) followTail.value = true;
    await nextTick();
    if ((!force && !followTail.value) || !messages.value.length) return;
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    if (force || followTail.value) {
        tableRef.value?.scrollTo(
            force ? Number.MAX_SAFE_INTEGER : { top: { index: messages.value.length - 1 } },
        );
    }
}

function onTableScroll(event: Event) {
    const element = event.target as HTMLElement | null;
    if (!element) return;
    followTail.value = element.scrollHeight - element.scrollTop - element.clientHeight <= 8;
}

function onTableResize() {
    // 宽度变化会改变消息换行，必须丢弃旧实测行高再重建虚拟滚动几何。
    tableRef.value?.clearAllAutoHeight();
    requestAnimationFrame(() => {
        tableRef.value?.initVirtualScroll();
        if (followTail.value) void scrollToBottom();
    });
}

function closePopovers(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (
        target?.closest(
            '.agent-demo__attach-picker, .agent-demo__model-picker, .agent-demo__thinking-picker',
        )
    ) {
        return;
    }
    attachMenuOpen.value = false;
    modelMenuOpen.value = false;
    thinkingMenuOpen.value = false;
}

async function send() {
    const content = prompt.value.trim();
    if (!content || loading.value) return;

    loading.value = true;
    const userId = nextId.value++;
    const assistantId = nextId.value++;
    appendMessage({ id: userId, role: 'user', kind: 'user', content, time: now(), status: 'done' });
    appendMessage({
        id: assistantId,
        role: thinkingEnabled.value ? 'tool' : 'assistant',
        kind: thinkingEnabled.value ? 'thinking' : 'assistant',
        content: '等待模型返回…',
        time: now(),
        status: 'running',
        meta: '正在连接模型',
        model: model.value,
    });
    prompt.value = '';
    startWaitingTimer(assistantId);
    await scrollToBottom();

    try {
        const conversation = messages.value
            .filter(item => item.role === 'user' || item.role === 'assistant')
            .slice(-20)
            .filter(item => item.status !== 'running')
            .map(item => ({ role: item.role, content: item.content }));
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey.value.trim()) headers.Authorization = `Bearer ${apiKey.value.trim()}`;
        const response = await fetch(`${endpoint.value.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: model.value,
                messages: conversation,
                max_tokens: 500,
                temperature: 0.7,
            }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result?.error?.message || `HTTP ${response.status}`);
        const answer = result?.choices?.[0]?.message?.content;
        if (!answer) throw new Error('接口没有返回 choices[0].message.content');
        updateMessage(assistantId, {
            role: 'assistant',
            kind: 'assistant',
            content: answer,
            status: 'done',
            meta: model.value,
        });
    } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);
        updateMessage(assistantId, {
            role: 'assistant',
            kind: 'assistant',
            content: `请求失败：${message}`,
            status: 'error',
            meta: '请求失败',
        });
    } finally {
        stopWaitingTimer();
        loading.value = false;
        await scrollToBottom();
    }
}

onMounted(() => {
    followTail.value = true;
    void scrollToBottom();
    document.addEventListener('click', closePopovers);
});

onBeforeUnmount(() => {
    stopWaitingTimer();
    document.removeEventListener('click', closePopovers);
});
</script>

<template>
    <section class="agent-demo">
        <p class="agent-demo__hint">
            <span class="agent-demo__follow-state">
                {{ followTail ? '自动跟随底部' : '已暂停跟随，滚动到底部后恢复' }}
            </span>
        </p>
        <div v-if="loading" class="agent-demo__waiting-status" role="status">
            <span class="agent-demo__waiting-icon" aria-hidden="true">♧</span>
            <strong>Agent 正在思考</strong>
            <span>· {{ waitingLabel }}</span>
        </div>

        <div class="agent-demo__conversation">
            <StkTable
                ref="tableRef"
                class="agent-demo__table"
                row-key="id"
                virtual
                headless
                :auto-row-height="{ expectedHeight }"
                :auto-resize="onTableResize"
                :row-active="false"
                :row-hover="false"
                :bordered="false"
                :columns="columns"
                :data-source="messages"
                @scroll="onTableScroll"
            />
            <div v-if="!followTail" class="agent-demo__scroll-bottom">
                <button
                    class="btn btn--icon"
                    type="button"
                    aria-label="滚动到底部"
                    title="滚动到底部"
                    @click="scrollToBottom(true)"
                >
                    ↓
                </button>
            </div>
        </div>

        <form class="agent-demo__composer" @submit.prevent="send">
            <div v-if="attachments.length" class="agent-demo__attachments">
                <span v-for="(file, index) in attachments" :key="`${file.name}-${index}`" class="agent-demo__attachment">
                    <span class="agent-demo__attachment-name" :title="file.name">{{ file.name }}</span>
                    <button
                        class="btn btn--remove"
                        type="button"
                        :aria-label="`移除 ${file.name}`"
                        @click="removeAttachment(index)"
                    >
                        ×
                    </button>
                </span>
            </div>
            <textarea
                v-model="prompt"
                rows="2"
                :disabled="loading"
                placeholder="提出后续修改要求"
            />
            <div class="agent-demo__composer-toolbar">
                <div class="agent-demo__attach-picker">
                    <button
                        class="btn btn--tool"
                        type="button"
                        aria-label="添加附件或图片"
                        :aria-expanded="attachMenuOpen"
                        @click="attachMenuOpen = !attachMenuOpen; modelMenuOpen = false"
                    >
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M10 4v12M4 10h12" />
                        </svg>
                    </button>
                    <div v-if="attachMenuOpen" class="agent-demo__popover">
                        <button class="btn btn--menu-item" type="button" @click="openAttachmentPicker('file')">
                            <svg viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M5.5 3.5h6l3 3v10h-9zM11.5 3.5v3h3" />
                            </svg>
                            添加附件
                        </button>
                        <button class="btn btn--menu-item" type="button" @click="openAttachmentPicker('image')">
                            <svg viewBox="0 0 20 20" aria-hidden="true">
                                <rect x="3" y="4" width="14" height="12" rx="2" />
                                <circle cx="7" cy="8" r="1.2" />
                                <path d="m4.5 14 3.5-3 2.5 2 2-2 3 3" />
                            </svg>
                            添加图片
                        </button>
                    </div>
                    <input ref="fileInputRef" type="file" multiple hidden @change="onAttachmentChange" />
                    <input
                        ref="imageInputRef"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        @change="onAttachmentChange"
                    />
                </div>
                <span class="agent-demo__composer-spacer"></span>
                <span class="agent-demo__connection">
                    <i aria-hidden="true"></i>
                    {{ loading ? '请求中' : '就绪' }}
                </span>
                <div class="agent-demo__model-picker">
                    <button
                        class="btn btn--model"
                        type="button"
                        :aria-expanded="modelMenuOpen"
                        @click="modelMenuOpen = !modelMenuOpen; attachMenuOpen = false"
                    >
                        <span aria-hidden="true">✦</span>
                        <span class="agent-demo__model" :title="model">{{ model }}</span>
                        <svg class="agent-demo__chevron" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="m4 6 4 4 4-4" />
                        </svg>
                    </button>
                    <div v-if="modelMenuOpen" class="agent-demo__popover agent-demo__model-popover">
                        <button
                            v-for="option in modelOptions"
                            :key="`${option.provider}-${option.name}`"
                            class="btn btn--menu-item"
                            :class="{ 'is-selected': option.name === model && option.endpoint === endpoint }"
                            type="button"
                            @click="selectModel(option)"
                        >
                            <span class="agent-demo__model-option-copy">
                                <strong>{{ option.name }}</strong>
                                <small>{{ providers[option.provider].label }}</small>
                            </span>
                            <svg
                                v-if="option.name === model && option.endpoint === endpoint"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                            >
                                <path d="m3 8 3 3 7-7" />
                            </svg>
                        </button>
                        <button class="btn btn--menu-item agent-demo__manage-model" type="button" @click="openModelManager">
                            <span>管理模型</span>
                            <svg viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M10 4v12M4 10h12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="agent-demo__thinking-picker">
                    <button
                        class="btn btn--thinking"
                        type="button"
                        :aria-expanded="thinkingMenuOpen"
                        aria-label="思考模式"
                        @click="thinkingMenuOpen = !thinkingMenuOpen; attachMenuOpen = false; modelMenuOpen = false"
                    >
                        <span aria-hidden="true">♧</span>
                        {{ thinkingEnabled ? '开启' : '关闭' }}
                        <svg class="agent-demo__chevron" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="m4 6 4 4 4-4" />
                        </svg>
                    </button>
                    <div v-if="thinkingMenuOpen" class="agent-demo__popover agent-demo__thinking-popover">
                        <button
                            class="btn btn--menu-item"
                            :class="{ 'is-selected': thinkingEnabled }"
                            type="button"
                            @click="selectThinking(true)"
                        >
                            开启
                            <svg v-if="thinkingEnabled" viewBox="0 0 16 16" aria-hidden="true">
                                <path d="m3 8 3 3 7-7" />
                            </svg>
                        </button>
                        <button
                            class="btn btn--menu-item"
                            :class="{ 'is-selected': !thinkingEnabled }"
                            type="button"
                            @click="selectThinking(false)"
                        >
                            关闭
                            <svg v-if="!thinkingEnabled" viewBox="0 0 16 16" aria-hidden="true">
                                <path d="m3 8 3 3 7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <button
                    class="btn btn--send"
                    type="submit"
                    :disabled="loading || !prompt.trim()"
                    aria-label="发送"
                >
                    {{ loading ? '…' : '↑' }}
                </button>
            </div>
        </form>
        <div v-if="modelManagerOpen" class="agent-demo__modal-backdrop" @click.self="modelManagerOpen = false">
            <form class="agent-demo__modal" @submit.prevent="saveManagedModel">
                <div class="agent-demo__modal-header">
                    <div>
                        <h3>管理模型</h3>
                        <p>配置一个 OpenAI 兼容模型，保存后会出现在模型列表中。</p>
                    </div>
                    <button class="btn btn--remove" type="button" aria-label="关闭" @click="modelManagerOpen = false">
                        ×
                    </button>
                </div>
                <label>
                    模型名称
                    <input v-model="managerModelName" type="text" placeholder="例如：Qwen3.6-9B" autofocus />
                </label>
                <label>
                    Provider
                    <select v-model="managerProvider" @change="onManagerProviderChange">
                        <option v-for="(config, key) in providers" :key="key" :value="key">
                            {{ config.label }}
                        </option>
                    </select>
                </label>
                <label>
                    接口地址
                    <input v-model="managerEndpoint" type="url" placeholder="https://example.com/v1" />
                </label>
                <label>
                    API Key（可选）
                    <input v-model="managerApiKey" type="password" placeholder="匿名端点留空" />
                </label>
                <p v-if="managerError" class="agent-demo__modal-error">{{ managerError }}</p>
                <div class="agent-demo__modal-actions">
                    <button class="btn" type="button" @click="modelManagerOpen = false">取消</button>
                    <button class="btn btn--primary" type="submit">保存模型</button>
                </div>
            </form>
        </div>
    </section>
</template>

<style scoped>
.agent-demo {
    display: grid;
    gap: 12px;
}
.agent-demo label {
    display: grid;
    gap: 4px;
    font-size: 12px;
    color: var(--vp-c-text-2);
}
.agent-demo input,
.agent-demo select,
.agent-demo textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    padding: 7px 8px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    font: inherit;
}
.agent-demo__hint {
    margin: 0;
    font-size: 12px;
    color: var(--vp-c-text-2);
}
.agent-demo__follow-state {
    margin-left: 8px;
    color: var(--vp-c-brand-1);
}
.agent-demo__waiting-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: -2px 0 0;
    color: var(--vp-c-text-2);
    font-size: 13px;
}
.agent-demo__waiting-icon {
    color: #a78bfa;
    font-size: 18px;
}
.agent-demo__waiting-status strong {
    color: var(--vp-c-text-1);
    font-weight: 600;
}
.agent-demo__conversation {
    position: relative;
}
.agent-demo__table {
    min-height: 360px;
    max-height: min(68vh, 640px);
}
.agent-demo__scroll-bottom {
    position: absolute;
    z-index: 2;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
}
.agent-demo__composer {
    display: grid;
    gap: 10px;
    padding: 16px 18px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 22px;
    background: var(--vp-c-bg-soft);
    box-shadow: 0 10px 28px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}
.agent-demo__attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.agent-demo__attachment {
    display: inline-flex;
    align-items: center;
    max-width: 240px;
    gap: 4px;
    padding: 4px 6px 4px 10px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 9px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-2);
    font-size: 12px;
}
.agent-demo__attachment-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.agent-demo__attach-picker,
.agent-demo__model-picker,
.agent-demo__thinking-picker {
    position: relative;
}
.agent-demo__popover {
    position: absolute;
    z-index: 5;
    bottom: calc(100% + 10px);
    left: 0;
    min-width: 138px;
    padding: 6px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg);
    box-shadow: 0 12px 30px color-mix(in srgb, var(--vp-c-text-1) 16%, transparent);
}
.agent-demo__model-popover {
    right: 0;
    left: auto;
    min-width: 230px;
}
.agent-demo__model-option-copy {
    display: grid;
    min-width: 0;
    gap: 2px;
}
.agent-demo__model-option-copy strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}
.agent-demo__model-option-copy small {
    overflow: hidden;
    color: var(--vp-c-text-3);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.agent-demo__manage-model {
    margin-top: 5px !important;
    border-top: 1px solid var(--vp-c-divider) !important;
    border-radius: 0 0 8px 8px !important;
    color: var(--vp-c-brand-1) !important;
}
.agent-demo__popover .btn--menu-item + .btn--menu-item {
    margin-top: 2px;
    margin-left: 0;
}
.agent-demo__popover .btn--menu-item svg {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
}
.agent-demo__modal-backdrop {
    position: fixed;
    z-index: 20;
    inset: 0;
    display: grid;
    padding: 20px;
    place-items: center;
    background: color-mix(in srgb, #000 42%, transparent);
}
.agent-demo__modal {
    display: grid;
    width: min(440px, 100%);
    gap: 13px;
    padding: 22px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 16px;
    background: var(--vp-c-bg);
    box-shadow: 0 22px 60px color-mix(in srgb, #000 28%, transparent);
}
.agent-demo__modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}
.agent-demo__modal-header h3 {
    margin: 0;
    color: var(--vp-c-text-1);
    font-size: 18px;
}
.agent-demo__modal-header p {
    margin: 5px 0 0;
    color: var(--vp-c-text-2);
    font-size: 12px;
    line-height: 1.5;
}
.agent-demo__modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 3px;
}
.agent-demo__modal-actions .btn + .btn {
    margin-left: 0;
}
.agent-demo__modal-error {
    margin: -3px 0 0;
    color: var(--vp-c-danger-1);
    font-size: 12px;
}
.agent-demo__composer textarea {
    min-height: 58px;
    padding: 0 2px;
    border: 0;
    outline: 0;
    resize: none;
    background: transparent;
    font-size: 16px;
    line-height: 1.55;
}
.agent-demo__composer textarea:focus {
    border: 0;
    box-shadow: none;
}
.agent-demo__composer textarea::placeholder {
    color: var(--vp-c-text-3);
}
.agent-demo__composer-toolbar {
    display: flex;
    align-items: center;
    min-height: 36px;
    gap: 14px;
    color: var(--vp-c-text-2);
    font-size: 14px;
}
.agent-demo__composer-spacer {
    flex: 1;
}
.agent-demo__connection,
.agent-demo__model {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
}
.agent-demo__connection i {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 3px solid var(--vp-c-divider);
    border-top-color: var(--vp-c-brand-1);
    border-radius: 50%;
}
.agent-demo__model {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.agent-demo__thinking-picker > .btn--thinking > span:first-child {
    font-size: 18px;
    color: var(--vp-c-text-1);
}
.agent-demo__chevron {
    flex: 0 0 auto;
    width: 14px;
    height: 14px;
}
.agent-demo__chevron path,
.agent-demo__popover svg path,
.agent-demo__popover svg rect,
.agent-demo__popover svg circle,
.agent-demo__composer-toolbar svg path {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.7;
}
@media (max-width: 760px) {
    .agent-demo__connection,
    .agent-demo__thinking-picker {
        display: none;
    }
    .agent-demo__model {
        max-width: 160px;
    }
    .agent-demo__popover {
        left: auto;
        right: 0;
    }
}
</style>
