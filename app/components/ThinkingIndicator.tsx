"use client";

import { useEffect, useState } from "react";
import type { AgentMeta } from "@/lib/agents";

/**
 * 大模型请求等待态。
 * 与助手气泡同构（头像 + 气泡），配色与动效全部来自角色主题，
 * 保证与既有界面风格一致；桌面端与移动端均自适应。
 */

/** 三个呼吸跳动的圆点，作为最简加载语汇 */
export function ThinkingDots({ dotClass }: { dotClass: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1"
      aria-hidden="true"
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className={`h-1.5 w-1.5 rounded-full animate-dot-wave ${dotClass}`}
          style={{ animationDelay: `${dot * 0.16}s` }}
        />
      ))}
    </span>
  );
}

/** 提示语轮播：多句时按间隔切换，单句时保持不动 */
function useRotatingText(texts: string[], interval = 2600): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % texts.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [texts, interval]);

  return texts[index] ?? texts[0] ?? "正在生成…";
}

export default function ThinkingIndicator({ agent }: { agent: AgentMeta }) {
  const text = useRotatingText(agent.thinkingTexts);

  return (
    <div className="flex gap-3 animate-fade-up" role="status" aria-live="polite">
      {/* 头像：外圈渐变光晕随呼吸脉动 */}
      <div className="relative mt-0.5 h-9 w-9 shrink-0">
        <span
          className={`absolute inset-0 rounded-full bg-gradient-to-br blur-[6px] animate-breathe ${agent.theme.avatar}`}
        />
        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-lg shadow-md shadow-violet-950/40 ${agent.theme.avatar}`}
        >
          <span aria-hidden="true">{agent.icon}</span>
        </span>
      </div>

      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <ThinkingDots dotClass={agent.theme.bullet} />
          <span
            key={text}
            className="min-w-0 text-sm leading-relaxed text-slate-300 animate-fade-in"
          >
            {text}
          </span>
        </div>

        {/* 流式进度微光，暗示请求仍在进行 */}
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full w-1/3 rounded-full bg-gradient-to-r opacity-80 animate-shimmer ${agent.theme.action}`}
          />
        </div>

        <span className="sr-only">正在生成回复，请稍候</span>
      </div>
    </div>
  );
}
