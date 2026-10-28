<script setup lang="ts">
import type { CustomCellProps } from '@/StkTable/types';
import { computed } from 'vue';
import type { AgentMessage } from './types';

const props = defineProps<CustomCellProps<AgentMessage>>();
const message = computed(() => props.row);
const event = computed(() => {
    const values = {
        thinking: { icon: '♧', label: '思考' },
        search: { icon: '⌕', label: '查阅' },
        terminal: { icon: '›_', label: '终端' },
        assistant: { icon: '✦', label: 'Agent' },
    } as const;
    return values[message.value.kind as keyof typeof values] || values.assistant;
});
</script>

<template>
    <article class="message" :class="`message--${message.kind}`">
        <div v-if="message.kind === 'user'" class="message__user-bubble">
            {{ message.content }}
        </div>
        <template v-else>
            <header class="message__header">
                <span class="message__icon" aria-hidden="true">{{ event.icon }}</span>
                <strong>{{ message.label || event.label }}</strong>
                <span class="message__dot">·</span>
                <span>{{
                    message.meta || (message.status === 'running' ? '进行中' : '已完成')
                }}</span>
                <time>{{ message.time }}</time>
            </header>
            <p v-if="message.content" class="message__content">{{ message.content }}</p>
        </template>
    </article>
</template>

<style scoped>
.message {
    box-sizing: border-box;
    margin: 0;
    padding: 11px 16px;
    color: var(--vp-c-text-1);
}
.message--user {
    display: flex;
    justify-content: flex-end;
    padding: 12px 16px 20px;
}
.message__user-bubble {
    max-width: min(86%, 760px);
    padding: 12px 16px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    background: var(--vp-c-bg-soft);
    line-height: 1.55;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
.message__header {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: 28px;
    color: var(--vp-c-text-2);
    font-size: 14px;
}
.message__header strong {
    color: var(--vp-c-text-2);
    font-weight: 600;
}
.message__icon {
    display: inline-flex;
    width: 20px;
    justify-content: center;
    color: var(--vp-c-text-3);
    font-size: 20px;
    line-height: 1;
}
.message__dot {
    color: var(--vp-c-text-3);
}
.message__header time {
    margin-left: auto;
    color: var(--vp-c-text-3);
    font-size: 12px;
}
.message__content {
    max-width: 900px;
    margin: 11px 0 4px 29px;
    line-height: 1.75;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
.message--assistant .message__header {
    color: var(--vp-c-text-2);
}
.message--assistant .message__icon {
    color: var(--vp-c-brand-1);
}
.message--thinking .message__header,
.message--search .message__header,
.message--terminal .message__header {
    opacity: 0.7;
}
.message--thinking .message__icon {
    color: #a78bfa;
}
.message--search .message__icon {
    color: #60a5fa;
}
.message--terminal .message__icon {
    color: #94a3b8;
}
.message--terminal .message__content {
    margin-top: 8px;
    padding: 12px 18px;
    border: 0;
    border-radius: 10px;
    background: color-mix(in srgb, var(--vp-c-bg-soft) 70%, #000);
    color: var(--vp-c-text-2);
    font-family: var(--vp-font-family-mono);
    font-size: 13px;
    line-height: 1.55;
}
</style>
