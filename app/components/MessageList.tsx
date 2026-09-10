"use client";

import type { UIMessage } from "ai";
import type { AgentMeta } from "@/lib/agents";
import MessageBubble from "./MessageBubble";

type MessageListProps = {
  agent: AgentMeta;
  messages: UIMessage[];
  error?: Error;
};

export default function MessageList({
  agent,
  messages,
  error,
}: MessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} agent={agent} message={message} />
      ))}

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
