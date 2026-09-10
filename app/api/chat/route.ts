import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { isAgentId, isChatAgentId } from "@/lib/agents";
import { AGENT_RUNTIME } from "@/lib/agents/prompts";
import { DEFAULT_MODEL, SAMPLING, dashscope } from "@/lib/server/dashscope";
import { toUserFacingError } from "@/lib/server/errors";

export const runtime = "nodejs";
export const maxDuration = 60;

const GENERIC_ERROR = "服务暂时不可用，请稍后再试。";

type ChatRequestBody = {
  agentId?: unknown;
  messages?: UIMessage[];
};

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request) {
  if (!process.env.DASHSCOPE_API_KEY) {
    return jsonError(
      "服务未配置 DASHSCOPE_API_KEY，请在 .env.local 中设置后重启。",
      500,
    );
  }

  let payload: ChatRequestBody;
  try {
    payload = (await req.json()) as ChatRequestBody;
  } catch {
    return jsonError("请求体格式错误。", 400);
  }

  const { agentId, messages } = payload;

  if (!isAgentId(agentId)) {
    return jsonError("未知的角色 ID。", 400);
  }

  // 工具型角色（如八字排盘）不走大模型对话
  if (!isChatAgentId(agentId)) {
    return jsonError("该模块不支持对话。", 400);
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonError("消息不能为空。", 400);
  }

  const runtime = AGENT_RUNTIME[agentId];

  try {
    const result = streamText({
      // 百炼 OpenAI 兼容模式仅支持 Chat Completions，
      // 必须显式使用 .chat()，否则默认会走 OpenAI Responses API 导致失败。
      model: dashscope.chat(DEFAULT_MODEL),
      system: runtime.systemPrompt,
      temperature: runtime.temperature,
      // 通义千问官方推荐 top_p=0.8：只设 temperature 而不设 top_p 时，
      // 采样空间过大易出现「词语反复罗列」的退化循环。
      topP: SAMPLING.topP,
      // 兜底上限，避免异常情况下无限生成
      maxOutputTokens: SAMPLING.maxOutputTokens,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error(`[/api/chat] agent=${agentId} 流式生成失败：`, error);
        return toUserFacingError(error, GENERIC_ERROR);
      },
    });
  } catch (error) {
    console.error(`[/api/chat] agent=${agentId} 请求失败：`, error);
    return jsonError(toUserFacingError(error, GENERIC_ERROR), 500);
  }
}
