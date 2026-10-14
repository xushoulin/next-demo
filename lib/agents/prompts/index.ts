import type { ChatAgentId } from "../types";
import { KNOWLEDGE_SYSTEM_PROMPT } from "./knowledge";
import { STUDY_SYSTEM_PROMPT } from "./study";
import { WRITING_SYSTEM_PROMPT } from "./writing";

/**
 * 角色运行时配置（服务端专用，含系统提示词）。
 * 严禁在客户端组件中导入本模块，否则提示词会被打进前端产物。
 */
export type AgentRuntime = {
  systemPrompt: string;
  /** 采样温度：知识类偏低以求准确，创作类偏高以求灵活 */
  temperature: number;
};

/** 仅对话型角色需要运行时提示词 */
export const AGENT_RUNTIME: Record<ChatAgentId, AgentRuntime> = {
  // 知识问答：温度偏低，保证准确、稳定
  knowledge: {
    systemPrompt: KNOWLEDGE_SYSTEM_PROMPT,
    temperature: 0.5,
  },
  // 写作助手：温度适中，兼顾灵活与可控
  writing: {
    systemPrompt: WRITING_SYSTEM_PROMPT,
    temperature: 0.6,
  },
  // 学习方法：温度略高，鼓励多种思路
  study: {
    systemPrompt: STUDY_SYSTEM_PROMPT,
    temperature: 0.65,
  },
};
