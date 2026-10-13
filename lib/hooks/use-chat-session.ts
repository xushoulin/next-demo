"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatAgentMeta } from "@/lib/agents";

const STORAGE_PREFIX = "yanzhi-ai-chat";

/**
 * 单个 Agent 的会话 Hook。
 * 职责：流式对话、按 Agent 隔离的持久化（登录存数据库 / 未登录存本地）、提交/停止/清空。
 */
export function useChatSession(agent: ChatAgentMeta, username: string) {
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
  // 始终持有最新消息，避免异步回调里读到过期闭包
  const messagesRef = useRef<UIMessage[]>(messages);
  messagesRef.current = messages;
  // 是否已从服务端读取过历史：未读取前不回写，避免误清空数据库
  const serverLoadedRef = useRef(false);

  // 恢复历史会话：登录用户从数据库读取，未登录用户从本地存储读取
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (username) {
        try {
          const res = await fetch(
            `/api/conversations?agentId=${encodeURIComponent(agent.id)}`,
          );
          if (res.ok) {
            const data = (await res.json()) as { messages: UIMessage[] };
            if (Array.isArray(data.messages) && !cancelled) {
              setMessages(data.messages);
            }
            // 仅在成功读取到服务端状态后才允许回写，避免数据库抖动时误清空历史
            serverLoadedRef.current = true;
          }
        } catch {
          // 数据库暂不可用时保持 serverLoaded=false：不回写，也不覆盖已有历史
        }
      } else {
        try {
          const raw = localStorage.getItem(storageKey);
          const parsed = raw ? JSON.parse(raw) : null;
          if (Array.isArray(parsed) && !cancelled) {
            setMessages(parsed as UIMessage[]);
          }
        } catch {
          // 本地数据损坏时静默忽略
        }
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [username, agent.id, storageKey, setMessages]);

  // 持久化会话（防抖）：登录存数据库，未登录存本地
  useEffect(() => {
    if (!hydrated) return;

    if (!username) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch {
        // 隐私模式下写入失败可忽略
      }
      return;
    }

    // 尚未从服务端确认状态时，不回写，避免覆盖已有历史
    if (!serverLoadedRef.current) return;

    const timer = setTimeout(() => {
      fetch("/api/conversations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, messages: messagesRef.current }),
      }).catch(() => {
        // 保存失败不影响对话进行
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [messages, hydrated, username, agent.id, storageKey]);

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
    if (username) {
      fetch("/api/conversations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, messages: [] }),
      }).catch(() => {
        // 忽略
      });
    } else {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // 忽略
      }
    }
  }, [stop, setMessages, storageKey, username, agent.id]);

  return { messages, status, error, isBusy, submit, clear, stop };
}
