import type { ChatAgentId } from "../types";
import { CONCIERGE_SYSTEM_PROMPT } from "./concierge";
import { BOOKING_SYSTEM_PROMPT } from "./booking";
import { MEMBER_SYSTEM_PROMPT } from "./member";

/**
 * 角色运行时配置（服务端专用，含系统提示词）。
 * 严禁在客户端组件中导入本模块，否则提示词会被打进前端产物。
 */
export type AgentRuntime = {
  systemPrompt: string;
  /** 采样温度：规则与政策类偏低求稳，周边推荐类适中求灵活 */
  temperature: number;
};

/** 仅对话型角色需要运行时提示词 */
export const AGENT_RUNTIME: Record<ChatAgentId, AgentRuntime> = {
  // 智能礼宾：服务信息求准，周边推荐留一点灵活度
  concierge: {
    systemPrompt: CONCIERGE_SYSTEM_PROMPT,
    temperature: 0.5,
  },
  // 智能预订助手：涉及价格与规则，温度最低求稳
  booking: {
    systemPrompt: BOOKING_SYSTEM_PROMPT,
    temperature: 0.3,
  },
  // 会员服务助手：权益解答求稳，办理指引适度灵活
  member: {
    systemPrompt: MEMBER_SYSTEM_PROMPT,
    temperature: 0.5,
  },
};
