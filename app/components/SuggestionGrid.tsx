"use client";

import type { AgentMeta } from "@/lib/agents";

type SuggestionGridProps = {
  agent: AgentMeta;
  disabled: boolean;
  onPick: (text: string) => void;
};

/** 快捷提问卡片 */
export default function SuggestionGrid({
  agent,
  disabled,
  onPick,
}: SuggestionGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {agent.suggestions.map((suggestion) => (
        <button
          key={suggestion.text}
          type="button"
          disabled={disabled}
          onClick={() => onPick(suggestion.text)}
          className={`group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 ${agent.theme.chipHover}`}
        >
          <span aria-hidden="true" className="text-xl leading-none">
            {suggestion.emoji}
          </span>
          <span className="text-sm text-slate-300 group-hover:text-white">
            {suggestion.text}
          </span>
        </button>
      ))}
    </div>
  );
}
