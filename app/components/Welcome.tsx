"use client";

import type { AgentMeta } from "@/lib/agents";
import SuggestionGrid from "./SuggestionGrid";

type WelcomeProps = {
  agent: AgentMeta;
  disabled: boolean;
  onPick: (text: string) => void;
};

/** 空会话时的欢迎页 */
export default function Welcome({ agent, disabled, onPick }: WelcomeProps) {
  return (
    <div className="animate-fade-up">
      <div className="mt-6 text-center">
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-4xl ring-1 ring-white/10 animate-float ${agent.theme.avatar}`}
        >
          <span aria-hidden="true">{agent.icon}</span>
        </div>
        <h2 className={`text-2xl font-bold ${agent.theme.title}`}>
          {agent.welcomeTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          {agent.welcomeText}
        </p>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-medium tracking-wider text-slate-500">
          试试这些常见问题
        </p>
        <SuggestionGrid agent={agent} disabled={disabled} onPick={onPick} />
      </div>
    </div>
  );
}
