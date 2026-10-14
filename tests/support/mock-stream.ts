import type { Page, Route } from "@playwright/test";

/**
 * 前端使用 AI SDK v6 的 useChat，/api/chat 返回的是 UI Message Stream（SSE）：
 *   data: {"type":"start","messageId":"..."}\n\n
 *   data: {"type":"text-start","id":"0"}\n\n
 *   data: {"type":"text-delta","id":"0","delta":"..."}\n\n
 *   data: {"type":"text-end","id":"0"}\n\n
 *   data: {"type":"finish"}\n\n
 *   data: [DONE]\n\n
 * 这里按同样协议构造，保证 Mock 与真实响应对前端完全等价。
 */
export const SSE_HEADERS = {
  "content-type": "text/event-stream",
  "cache-control": "no-cache",
  connection: "keep-alive",
  "x-vercel-ai-ui-message-stream": "v1",
};

type StreamOptions = {
  /** 每个 delta 分片的字符数，用于模拟分块到达 */
  chunkSize?: number;
  messageId?: string;
};

/** 把一段文本构造成完整的 UI Message Stream */
export function buildSseStream(text: string, options: StreamOptions = {}): string {
  const { chunkSize = 12, messageId = "mock-message" } = options;
  const id = "0";

  const lines: string[] = [
    JSON.stringify({ type: "start", messageId }),
    JSON.stringify({ type: "start-step" }),
    JSON.stringify({ type: "text-start", id }),
  ];

  for (let i = 0; i < text.length; i += chunkSize) {
    lines.push(
      JSON.stringify({ type: "text-delta", id, delta: text.slice(i, i + chunkSize) }),
    );
  }

  lines.push(
    JSON.stringify({ type: "text-end", id }),
    JSON.stringify({ type: "finish-step" }),
    JSON.stringify({ type: "finish" }),
  );

  return `${lines.map((line) => `data: ${line}\n\n`).join("")}data: [DONE]\n\n`;
}

export type ChatMockScenario =
  /** 正常流式回复；responseDelayMs 用于制造「生成中」状态以测试停止按钮 */
  | { kind: "ok"; reply: string; responseDelayMs?: number }
  /** HTTP 错误码 + JSON 错误体（真实后端会返回 { error: string }） */
  | { kind: "http-error"; status: number; error: string }
  /** 连接中断（模拟服务不可用） */
  | { kind: "network-error" };

/** 拦截 /api/chat，返回指定场景；返回可用于断言的调用记录 */
export function mockChat(page: Page, scenario: ChatMockScenario) {
  const calls: { agentId: unknown; messageCount: number }[] = [];

  const handler = async (route: Route) => {
    let body: { agentId?: unknown; messages?: unknown[] } = {};
    try {
      body = JSON.parse(route.request().postData() ?? "{}");
    } catch {
      // 请求体解析失败不阻塞 mock
    }
    calls.push({
      agentId: body.agentId,
      messageCount: Array.isArray(body.messages) ? body.messages.length : 0,
    });

    if (scenario.kind === "network-error") {
      await route.abort("failed");
      return;
    }

    if (scenario.kind === "http-error") {
      await route.fulfill({
        status: scenario.status,
        contentType: "application/json",
        body: JSON.stringify({ error: scenario.error }),
      });
      return;
    }

    // 延迟下发：让前端停留在「生成中」状态，便于测试停止按钮
    if (scenario.responseDelayMs) {
      await new Promise((resolve) => setTimeout(resolve, scenario.responseDelayMs));
    }

    await route.fulfill({
      status: 200,
      headers: SSE_HEADERS,
      body: buildSseStream(scenario.reply),
    });
  };

  return page.route("**/api/chat", handler).then(() => calls);
}
