"use client";

import type { UIMessage } from "ai";
import type { ChatAgentMeta } from "@/lib/agents";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";

type MessageListProps = {
  agent: ChatAgentMeta;
  messages: UIMessage[];
  /** 是否处于请求等待 / 流式生成中 */
  busy: boolean;
  error?: Error;
};

export default function MessageList({
  agent,
  messages,
  busy,
  error,
}: MessageListProps) {
  const lastMessage = messages[messages.length - 1];
  // 用户已发送、但助手消息尚未创建时，展示等待指示器；
  // 一旦助手消息出现（哪怕内容为空），则由 MessageBubble 接管内联加载态，
  // 两者互斥，避免重复提示。
  const awaitingReply = busy && lastMessage?.role !== "assistant";

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} agent={agent} message={message} />
      ))}

      {awaitingReply && <ThinkingIndicator agent={agent} />}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error.message || "请求失败，请稍后重试。"}
        </div>
      )}
    </div>
  );
}
