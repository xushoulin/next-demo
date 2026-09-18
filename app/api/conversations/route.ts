import { getCurrentUsername } from "@/lib/auth";
import { getConversation, getUserId, saveConversation } from "@/lib/db/queries";
import { isChatAgentId } from "@/lib/agents";
import type { UIMessage } from "ai";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

/** GET /api/conversations?agentId=xxx —— 读取当前用户在某 Agent 下的对话 */
export async function GET(req: Request) {
  const username = await getCurrentUsername();
  if (!username) {
    return jsonError("请先登录。", 401);
  }
  const userId = await getUserId(username);
  if (!userId) {
    return jsonError("用户不存在。", 401);
  }

  const agentId = new URL(req.url).searchParams.get("agentId");
  if (!agentId || !isChatAgentId(agentId)) {
    return jsonError("未知的对话角色。", 400);
  }

  const messages = await getConversation(userId, agentId);
  return Response.json({ messages: messages ?? [] });
}

/** PUT /api/conversations —— 保存（覆盖）某 Agent 下的对话 */
export async function PUT(req: Request) {
  const username = await getCurrentUsername();
  if (!username) {
    return jsonError("请先登录。", 401);
  }
  const userId = await getUserId(username);
  if (!userId) {
    return jsonError("用户不存在。", 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("请求体格式错误。", 400);
  }

  const { agentId, messages } = (body ?? {}) as {
    agentId?: unknown;
    messages?: unknown;
  };

  if (!isChatAgentId(agentId)) {
    return jsonError("未知的对话角色。", 400);
  }
  if (!Array.isArray(messages)) {
    return jsonError("对话内容无效。", 400);
  }

  try {
    await saveConversation(userId, agentId, messages as UIMessage[]);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[/api/conversations] 保存失败：", error);
    return jsonError("保存失败，请确认数据库已连接。", 500);
  }
}
