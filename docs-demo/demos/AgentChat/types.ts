export type AgentRole = 'user' | 'assistant' | 'tool';
export type AgentStatus = 'done' | 'running' | 'error';
export type AgentMessageKind = 'user' | 'assistant' | 'thinking' | 'search' | 'terminal';

export type AgentMessage = {
    id: number;
    role: AgentRole;
    kind: AgentMessageKind;
    content: string;
    time: string;
    status: AgentStatus;
    label?: string;
    meta?: string;
    model?: string;
};
