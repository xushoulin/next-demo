"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatAgentMeta } from "@/lib/agents";

const STORAGE_PREFIX = "yanzhi-ai-chat";

/**
 * 单个 Agent 的会话 Hook。
 * 职责：流式对话、按 Agent 隔离的持久化、提交/停止/清空。
 *
 * 存储策略（自动降级）：
 * - 未登录：直接存浏览器本地。
 * - 已登录：优先存数据库；若数据库不可用（连接失败 / 接口报错），
 *   自动降级为本地存储，保证对话内容不会丢失。
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
  // 数据库可用性：null=尚未探测，true=可用，false=不可用（降级本地）
  const serverAvailableRef = useRef<boolean | null>(null);

  const loadFromLocal = useCallback((): UIMessage[] | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? (parsed as UIMessage[]) : null;
    } catch {
      // 本地数据损坏时静默忽略
      return null;
    }
  }, [storageKey]);

  const saveToLocal = useCallback(
    (data: UIMessage[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        // 隐私模式下写入失败可忽略
      }
    },
    [storageKey],
  );

  // 恢复历史会话：已登录且数据库可用时读数据库，否则读本地存储
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
            serverAvailableRef.current = true;
            if (!cancelled) setHydrated(true);
            return;
          }
        } catch {
          // 数据库不可用时继续走本地兜底
        }
        // 数据库不可用：标记降级，并从本地恢复历史
        serverAvailableRef.current = false;
        const local = loadFromLocal();
        if (local && !cancelled) setMessages(local);
      } else {
        const local = loadFromLocal();
        if (local && !cancelled) setMessages(local);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [username, agent.id, loadFromLocal, setMessages]);

  // 持久化会话（防抖）：数据库可用时存数据库，否则存本地
  useEffect(() => {
    if (!hydrated) return;

    // 未登录，或已确认数据库不可用 → 存本地
    if (!username || serverAvailableRef.current === false) {
      saveToLocal(messages);
      return;
    }

    // 数据库可用性尚未探测完成时不回写，避免覆盖已有历史
    if (serverAvailableRef.current !== true) return;

    const timer = setTimeout(() => {
      fetch("/api/conversations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, messages: messagesRef.current }),
      })
        .then((res) => {
          if (!res.ok) {
            // 保存失败视为数据库不可用，降级写入本地
            serverAvailableRef.current = false;
            saveToLocal(messagesRef.current);
          }
        })
        .catch(() => {
          serverAvailableRef.current = false;
          saveToLocal(messagesRef.current);
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [messages, hydrated, username, agent.id, saveToLocal]);

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
    // 数据库不可用或未登录时，只清理本地数据
    if (!username || serverAvailableRef.current === false) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // 忽略
      }
      return;
    }
    fetch("/api/conversations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId: agent.id, messages: [] }),
    }).catch(() => {
      // 忽略
    });
  }, [stop, setMessages, storageKey, username, agent.id]);

  return { messages, status, error, isBusy, submit, clear, stop };
}
