import type { AgentId, AgentMeta, ChatAgentId } from "../types";
import { BAZI_AGENT } from "./bazi";
import { DREAM_AGENT } from "./dream";
import { FENGSHUI_AGENT } from "./fengshui";

/**
 * 角色注册表（客户端安全）。
 * 新增角色的步骤：
 *   1. 在 ../types.ts 的 AgentId 中加入新 ID，并归入 chat / tool 之一
 *   2. 新建 metadata/<id>.ts 定义元数据
 *   3. 对话型角色需新建 ../prompts/<id>.ts 定义系统提示词
 *   4. 在本数组与 ../prompts/index.ts 中完成注册
 */
export const AGENTS: readonly AgentMeta[] = [
  DREAM_AGENT,
  FENGSHUI_AGENT,
  BAZI_AGENT,
];

/** 所有已注册的角色 ID */
export const AGENT_IDS: readonly AgentId[] = AGENTS.map((agent) => agent.id);

/** 类型守卫：校验请求体中的 agentId 是否合法 */
export function isAgentId(value: unknown): value is AgentId {
  return typeof value === "string" && AGENT_IDS.includes(value as AgentId);
}

/** 类型守卫：校验是否为「支持对话」的角色 */
export function isChatAgentId(value: unknown): value is ChatAgentId {
  return isAgentId(value) && getAgentMeta(value).kind === "chat";
}

/** 按 ID 获取角色元数据，未注册时抛出 */
export function getAgentMeta(id: AgentId): AgentMeta {
  const meta = AGENTS.find((agent) => agent.id === id);
  if (!meta) {
    throw new Error(`未注册的 Agent: ${id}`);
  }
  return meta;
}
