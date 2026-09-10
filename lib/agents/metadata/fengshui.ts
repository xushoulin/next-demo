import type { ChatAgentMeta } from "../types";

/** AI 风水先生 —— 客户端可见元数据 */
export const FENGSHUI_AGENT: ChatAgentMeta = {
  id: "fengshui",
  kind: "chat",
  name: "AI 风水先生",
  tagline: "形势 · 理气 · 五行 · 家居办公布局解析",
  icon: "🧭",
  welcomeTitle: "道一处宅第，玄机子为你勘",
  welcomeText:
    "说说房屋朝向、户型格局，或是你想改善的方位，我会从形势、理气、五行三个层面，为你分析格局并给出可落地的调整建议。",
  disclaimer:
    "内容属传统民俗文化与环境心理学范畴；涉及承重、消防、燃气、电路等，请以专业设计与安全规范为准。",
  thinkingTexts: [
    "正在勘察宅第格局…",
    "正在推算方位理气与五行…",
    "正在拟定可落地的调整建议…",
  ],
  inputPlaceholder: "描述户型或问题，例如：大门正对阳台……",
  suggestions: [
    { emoji: "🏠", text: "大门正对阳台，听说叫穿堂煞，怎么化解？" },
    { emoji: "🛏️", text: "床头靠窗户，而且头顶有横梁压着，有影响吗？" },
    { emoji: "🍳", text: "厨房灶台正对着水龙头，水火相冲怎么办？" },
    { emoji: "💰", text: "想催旺家里财运，财位一般怎么找、怎么布置？" },
    { emoji: "📚", text: "孩子明年中考，文昌位怎么找，书桌怎么摆？" },
    { emoji: "🪑", text: "办公室座位背对着门口，事业上有什么说法？" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.22),_transparent_55%),radial-gradient(ellipse_at_top,_rgba(180,83,9,0.20),_transparent_60%)]",
    avatar: "from-amber-500 to-emerald-700",
    action: "from-amber-600 to-emerald-700",
    actionHover: "hover:from-amber-500 hover:to-emerald-600",
    bubble: "from-amber-600 to-emerald-700",
    title: "text-amber-100",
    tabActive: "border-amber-400/60 bg-amber-400/10 text-amber-100",
    chipHover: "hover:border-amber-400/50",
    particle: "bg-amber-200/80",
    ambient: "mountains",
    watermark: "☯",
    heading: "font-semibold text-amber-200",
    strong: "text-amber-200",
    code: "text-emerald-200",
    bullet: "bg-emerald-400",
    quote: "border-emerald-400/60 text-emerald-50/90",
    ordinal: "text-amber-300",
  },
};
