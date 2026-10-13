"use client";

import { useCallback, useRef, useState } from "react";
import { AGENTS, getAgentMeta, type AgentId } from "@/lib/agents";
import AgentTabs from "./AgentTabs";
import AmbientBackground from "./AmbientBackground";
import ChatPanel from "./ChatPanel";

type ChatAppProps = {
  username: string;
  onLogout: () => void;
};

/** 应用外壳：持有角色切换状态、顶部品牌区与背景，各角色会话相互独立 */
export default function ChatApp({ username, onLogout }: ChatAppProps) {
  const [activeId, setActiveId] = useState<AgentId>(AGENTS[0].id);
  const clearHandlers = useRef<Partial<Record<AgentId, () => void>>>({});

  const registerClear = useCallback((id: AgentId, handler: () => void) => {
    clearHandlers.current[id] = handler;
  }, []);

  const agent = getAgentMeta(activeId);

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-slate-950 text-slate-100">
      <AmbientBackground agent={agent} />

      <header className="relative z-20 shrink-0 border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 pt-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg shadow-violet-950/40 ${agent.theme.avatar}`}
              >
                <span aria-hidden="true">{agent.icon}</span>
              </div>
              <div className="min-w-0">
                <h1
                  className={`truncate text-base font-semibold ${agent.theme.title}`}
                >
                  {agent.name}
                </h1>
                <p className="truncate text-xs text-slate-400">
                  {agent.tagline}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {agent.kind === "chat" && (
                <button
                  type="button"
                  onClick={() => clearHandlers.current[activeId]?.()}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/25 hover:text-white"
                >
                  清空对话
                </button>
              )}

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-semibold text-white"
                >
                  {username.slice(0, 1).toUpperCase()}
                </span>
                <span className="max-w-[96px] truncate text-xs text-slate-200">
                  {username}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/25 hover:text-white"
              >
                退出
              </button>
            </div>
          </div>

          <div className="py-3">
            <AgentTabs activeId={activeId} onSelect={setActiveId} />
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-0 flex-1">
        {AGENTS.map((item) => (
          <ChatPanel
            key={item.id}
            agent={item}
            active={item.id === activeId}
            registerClear={registerClear}
            username={username}
          />
        ))}
      </main>
    </div>
  );
}
