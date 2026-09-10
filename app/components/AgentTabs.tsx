"use client";

import { AGENTS, type AgentId } from "@/lib/agents";

type AgentTabsProps = {
  activeId: AgentId;
  onSelect: (id: AgentId) => void;
};

/** 角色切换 Tab（遵循 WAI-ARIA Tabs 模式） */
export default function AgentTabs({ activeId, onSelect }: AgentTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="AI 角色切换"
      className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5"
    >
      {AGENTS.map((agent) => {
        const active = agent.id === activeId;

        return (
          <button
            key={agent.id}
            id={`tab-${agent.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`panel-${agent.id}`}
            onClick={() => onSelect(agent.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              active
                ? `${agent.theme.tabActive} shadow-inner`
                : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {agent.icon}
            </span>
            <span>{agent.name}</span>
          </button>
        );
      })}
    </div>
  );
}
