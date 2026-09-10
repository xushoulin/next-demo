"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import Markdown from "./Markdown";

const STORAGE_KEY = "zhougong-dream-chat-v1";

const SUGGESTIONS = [
  { emoji: "🐍", text: "我梦见被一条大蛇追赶，怎么也跑不掉" },
  { emoji: "🦷", text: "梦见牙齿一颗颗掉光了，心里很慌" },
  { emoji: "🕊️", text: "梦见自己长出翅膀，在天上自由地飞" },
  { emoji: "🌊", text: "梦见站在一片无边无际的大海前" },
  { emoji: "🏔️", text: "梦见爬一座很高的山，快到山顶时醒了" },
  { emoji: "💍", text: "梦见和喜欢的人一起走进了婚礼殿堂" },
];

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

/** 用确定性随机生成星空，避免服务端/客户端渲染不一致 */
function useStars(count: number) {
  return useMemo(() => {
    let seed = 20260910;
    const random = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    return Array.from({ length: count }, (_, id) => ({
      id,
      top: `${(random() * 100).toFixed(2)}%`,
      left: `${(random() * 100).toFixed(2)}%`,
      size: Number((random() * 2 + 1).toFixed(2)),
      delay: Number((random() * 4).toFixed(2)),
      duration: Number((random() * 3 + 2).toFixed(2)),
    }));
  }, [count]);
}

export default function DreamChat() {
  const [input, setInput] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const stars = useStars(70);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isBusy = status === "submitted" || status === "streaming";

  // 从本地恢复历史对话
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw) as UIMessage[]);
    } catch {
      // 忽略解析失败
    }
    setHydrated(true);
  }, [setMessages]);

  // 持久化对话
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // 忽略写入失败（如隐私模式）
    }
  }, [messages, hydrated]);

  // 自动滚动到底部
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    sendMessage({ text: value });
    setInput("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send(input);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input);
    }
  };

  const clearChat = () => {
    stop();
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 忽略
    }
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* 星空背景 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.55),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(30,64,175,0.35),_transparent_55%)]" />
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
        <div className="absolute -right-16 top-10 text-[9rem] leading-none opacity-20 animate-float select-none">
          🌙
        </div>
      </div>

      {/* 顶部栏 */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl shadow-lg shadow-violet-900/40">
              🌙
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-wide text-amber-100">
                AI 周公解梦
              </h1>
              <p className="text-xs text-slate-400">
                融合《周公解梦》与现代心理学的梦境解读
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              清空对话
            </button>
          )}
        </div>
      </header>

      {/* 对话区域 */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <div className="animate-fade-up">
              <div className="mt-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/20 text-4xl ring-1 ring-white/10 animate-float">
                  🌌
                </div>
                <h2 className="text-2xl font-bold text-amber-100">
                  道一句梦境，周公为你解
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                  把梦里的画面、人物与情绪讲给我听，我会结合传统典籍与现代心理学，
                  为你梳理梦境的象征、吉凶与启示。
                </p>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs font-medium tracking-wider text-slate-500">
                  试试这些常见梦境
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item.text}
                      type="button"
                      onClick={() => send(item.text)}
                      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-violet-400/50 hover:bg-white/10"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-sm text-slate-300 group-hover:text-white">
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => {
                const text = getMessageText(message);
                const isUser = message.role === "user";

                if (isUser) {
                  return (
                    <div key={message.id} className="flex justify-end animate-fade-up">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-3 text-sm leading-relaxed text-white shadow-lg shadow-violet-950/40">
                        {text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={message.id} className="flex gap-3 animate-fade-up">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-lg shadow-md shadow-violet-950/40">
                      🌙
                    </div>
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                      {text ? (
                        <Markdown content={text} />
                      ) : (
                        <div className="flex items-center gap-1.5 py-1">
                          {[0, 1, 2].map((dot) => (
                            <span
                              key={dot}
                              className="h-2 w-2 rounded-full bg-violet-300 animate-bounce"
                              style={{ animationDelay: `${dot * 0.15}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              解梦失败：{error.message || "请检查网络或 API Key 后重试。"}
            </div>
          )}
        </div>
      </div>

      {/* 输入区 */}
      <div className="relative z-10 border-t border-white/10 bg-slate-950/50 backdrop-blur-md">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3 px-4 py-4"
        >
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-violet-400/60">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="描述你的梦境，例如：我梦见在雨中奔跑……（Enter 发送，Shift+Enter 换行）"
              className="max-h-40 w-full resize-none bg-transparent text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>

          {isBusy ? (
            <button
              type="button"
              onClick={() => stop()}
              className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/20"
            >
              停止
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-950/40 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              解梦
            </button>
          )}
        </form>
        <p className="pb-3 text-center text-[11px] text-slate-600">
          解读内容基于传统文化与心理学，仅供参考娱乐，不构成医疗或心理咨询建议。
        </p>
      </div>
    </div>
  );
}
