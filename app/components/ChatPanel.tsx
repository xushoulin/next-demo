"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentId, AgentMeta } from "@/lib/agents";
import { useChatSession } from "@/lib/hooks/use-chat-session";
import Composer from "./Composer";
import MessageList from "./MessageList";
import Welcome from "./Welcome";

type ChatPanelProps = {
  agent: AgentMeta;
  /** 是否为当前展示的面板 */
  active: boolean;
  /** 向父级注册本面板的「清空」实现 */
  registerClear: (id: AgentId, handler: () => void) => void;
};

/**
 * 单个角色的会话面板（消息区 + 输入区）。
 * 所有面板常驻挂载（未激活时用 hidden 隐藏），以保证切换 Tab 时不丢失会话状态。
 */
export default function ChatPanel({
  agent,
  active,
  registerClear,
}: ChatPanelProps) {
  const { messages, error, isBusy, submit, clear, stop } =
    useChatSession(agent);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerClear(agent.id, clear);
  }, [agent.id, clear, registerClear]);

  // 新消息到达，或切回本面板时，滚动到底部
  useEffect(() => {
    if (!active) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, active]);

  const handleSubmit = () => {
    if (!input.trim() || isBusy) return;
    submit(input);
    setInput("");
  };

  const handlePick = (text: string) => {
    if (isBusy) return;
    submit(text);
    setInput("");
  };

  return (
    <section
      id={`panel-${agent.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${agent.id}`}
      aria-hidden={!active}
      className={`absolute inset-0 flex-col ${active ? "flex" : "hidden"}`}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <Welcome agent={agent} disabled={isBusy} onPick={handlePick} />
          ) : (
            <MessageList agent={agent} messages={messages} error={error} />
          )}
        </div>
      </div>

      <Composer
        agent={agent}
        active={active}
        value={input}
        isBusy={isBusy}
        onChange={setInput}
        onSubmit={handleSubmit}
        onStop={stop}
      />
    </section>
  );
}
