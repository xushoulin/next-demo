/**
 * Agent 领域层统一出口（客户端安全）。
 * 系统提示词位于 ./prompts，仅可在服务端导入。
 */
export type {
  AgentId,
  AgentKind,
  AgentMeta,
  AgentTheme,
  AmbientVariant,
  BaziAgentMeta,
  ChatAgentId,
  ChatAgentMeta,
  Suggestion,
  ToolAgentId,
} from "./types";

export {
  AGENTS,
  AGENT_IDS,
  getAgentMeta,
  isAgentId,
  isChatAgentId,
} from "./metadata";
