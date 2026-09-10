"use client";

import type { UIMessage } from "ai";
import type { ChatAgentMeta } from "@/lib/agents";
import { getMessageText } from "@/lib/utils";
import Markdown from "./Markdown";
import { ThinkingDots } from "./ThinkingIndicator";

type MessageBubbleProps = {
  agent: ChatAgentMeta;
  message: UIMessage;
};

export default function MessageBubble({ agent, message }: MessageBubbleProps) {
  const text = getMessageText(message);

  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-up">
        <div
          className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-gradient-to-br px-4 py-3 text-sm leading-relaxed text-white shadow-lg shadow-violet-950/40 ${agent.theme.bubble}`}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fade-up">
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg shadow-md shadow-violet-950/40 ${agent.theme.avatar}`}
      >
        <span aria-hidden="true">{agent.icon}</span>
      </div>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
        {text ? (
          <Markdown content={text} theme={agent.theme} />
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 py-0.5"
          >
            <ThinkingDots dotClass={agent.theme.bullet} />
            <span className="text-sm leading-relaxed text-slate-400">
              正在生成…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
