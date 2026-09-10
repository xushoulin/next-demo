import type { ChatAgentId } from "../types";
import { DREAM_SYSTEM_PROMPT } from "./dream";
import { FENGSHUI_SYSTEM_PROMPT } from "./fengshui";

/**
 * 角色运行时配置（服务端专用，含系统提示词）。
 * 严禁在客户端组件中导入本模块，否则提示词会被打进前端产物。
 */
export type AgentRuntime = {
  systemPrompt: string;
  /** 采样温度：创意解读偏高，专业分析偏低 */
  temperature: number;
};

/** 仅对话型角色需要运行时提示词 */
export const AGENT_RUNTIME: Record<ChatAgentId, AgentRuntime> = {
  // 温度过低会诱发重复罗列的退化循环，配合 topP=0.8 使用 0.7~0.75
  dream: {
    systemPrompt: DREAM_SYSTEM_PROMPT,
    temperature: 0.75,
  },
  fengshui: {
    systemPrompt: FENGSHUI_SYSTEM_PROMPT,
    temperature: 0.7,
  },
};
