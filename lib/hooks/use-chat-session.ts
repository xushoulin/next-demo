"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatAgentMeta } from "@/lib/agents";

const STORAGE_PREFIX = "xuanji-ai-chat";

/**
 * 单个 Agent 的会话 Hook。
 * 职责：流式对话、按 Agent 隔离的本地持久化、提交/停止/清空。
 */
export function useChatSession(agent: ChatAgentMeta) {
  const storageKey = `${STORAGE_PREFIX}:${agent.id}`;

  // agentId 随请求体下发，由服务端角色注册表决定使用哪个提示词
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { agentId: agent.id },
      }),
    [agent.id],
  );

  const { messages, sendMessage, status, error, setMessages, stop } = useChat({
    transport,
  });

  const [hydrated, setHydrated] = useState(false);

  // 恢复历史会话
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        setMessages(parsed as UIMessage[]);
      }
    } catch {
      // 本地数据损坏时静默忽略，不影响使用
    }
    setHydrated(true);
  }, [storageKey, setMessages]);

  // 持久化会话
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // 隐私模式下写入失败可忽略
    }
  }, [messages, hydrated, storageKey]);

  const isBusy = status === "submitted" || status === "streaming";

  const submit = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || isBusy) return;
      sendMessage({ text: value });
    },
    [isBusy, sendMessage],
  );

  const clear = useCallback(() => {
    stop();
    setMessages([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // 忽略
    }
  }, [stop, setMessages, storageKey]);

  return { messages, status, error, isBusy, submit, clear, stop };
}
