import type { ChatAgentMeta } from "../types";

/** AI 学习方法 —— 客户端可见元数据 */
export const STUDY_AGENT: ChatAgentMeta = {
  id: "study",
  kind: "chat",
  name: "AI 学习方法",
  tagline: "读书笔记 · 计划制定 · 思维方法 · 学得更好",
  icon: "🧠",
  welcomeTitle: "把学习目标，变成可落地的习惯",
  welcomeText:
    "想做读书笔记、制定学习计划，或梳理一套适合自己的思维方法？描述你的目标与现状，我会给出具体、可执行的建议。",
  disclaimer:
    "建议为通用学习经验整理，效果因人而异；请结合自身情况调整，必要时参考教育专业人士意见。",
  thinkingTexts: [
    "正在梳理你的目标与现状…",
    "正在匹配适合你的学习方法…",
    "正在把建议拆成可执行的步骤…",
  ],
  inputPlaceholder: "描述你的学习目标和现状，例如：我想每月读完一本书但总坚持不下来",
  suggestions: [
    { emoji: "📓", text: "推荐一套适合新手的读书笔记方法" },
    { emoji: "🗓️", text: "帮我制定一个每周能坚持的学习计划" },
    { emoji: "🔁", text: "我总是学了就忘，怎么记得更牢？" },
    { emoji: "🧩", text: "如何把一个复杂Topic拆成可学的小块？" },
    { emoji: "🎯", text: "备考时间紧，怎么优先安排复习？" },
    { emoji: "💡", text: "费曼技巧具体怎么用？给我一个例子" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.42),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(6,95,70,0.32),_transparent_55%)]",
    avatar: "from-emerald-500 to-teal-600",
    action: "from-emerald-600 to-teal-600",
    actionHover: "hover:from-emerald-500 hover:to-teal-500",
    bubble: "from-emerald-600 to-teal-600",
    title: "text-emerald-100",
    tabActive: "border-emerald-400/60 bg-emerald-400/10 text-emerald-100",
    chipHover: "hover:border-emerald-400/50",
    particle: "bg-white",
    ambient: "stars",
    watermark: "🧠",
    heading: "font-semibold text-emerald-100",
    strong: "text-emerald-200",
    code: "text-emerald-200",
    bullet: "bg-emerald-400",
    quote: "border-emerald-400/60 text-emerald-100/90",
    ordinal: "text-emerald-300",
  },
};
