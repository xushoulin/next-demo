"use client";

import { useMemo } from "react";
import type { AgentMeta } from "@/lib/agents";

/**
 * 用确定性伪随机生成粒子，保证服务端与客户端渲染结果一致（避免水合告警）。
 */
function useParticles(count: number, seed: number) {
  return useMemo(() => {
    let state = seed;
    const random = () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };

    return Array.from({ length: count }, (_, id) => ({
      id,
      top: `${(random() * 100).toFixed(2)}%`,
      left: `${(random() * 100).toFixed(2)}%`,
      size: Number((random() * 2 + 1).toFixed(2)),
      delay: Number((random() * 4).toFixed(2)),
      duration: Number((random() * 3 + 2).toFixed(2)),
    }));
  }, [count, seed]);
}

function Mountains() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-1/2 w-full"
      viewBox="0 0 1440 420"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,300 L180,160 L330,250 L500,110 L660,235 L820,140 L980,245 L1140,165 L1300,255 L1440,195 L1440,420 L0,420 Z"
        fill="rgba(16,185,129,0.10)"
      />
      <path
        d="M0,345 L170,255 L310,320 L470,205 L630,310 L790,240 L950,330 L1110,255 L1270,335 L1440,285 L1440,420 L0,420 Z"
        fill="rgba(5,150,105,0.28)"
      />
      <path
        d="M0,390 L210,320 L390,372 L570,300 L750,365 L930,315 L1110,370 L1290,325 L1440,378 L1440,420 L0,420 Z"
        fill="rgba(2,44,34,0.85)"
      />
    </svg>
  );
}

/** 角色主题背景：解梦为星空，风水为远山 */
export default function AmbientBackground({ agent }: { agent: AgentMeta }) {
  const isStars = agent.theme.ambient === "stars";
  const particles = useParticles(isStars ? 70 : 28, isStars ? 20260910 : 31415926);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${agent.theme.backdrop}`} />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`absolute rounded-full animate-twinkle ${agent.theme.particle}`}
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {isStars ? null : <Mountains />}

      <div className="absolute -right-16 top-10 select-none text-[9rem] leading-none opacity-20 animate-float">
        {agent.theme.watermark}
      </div>
    </div>
  );
}
