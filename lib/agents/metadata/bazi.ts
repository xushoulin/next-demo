import type { BaziAgentMeta } from "../types";

/** AI 八字排盘 —— 工具型角色元数据（无对话） */
export const BAZI_AGENT: BaziAgentMeta = {
  id: "bazi",
  kind: "bazi",
  name: "AI 八字排盘",
  tagline: "四柱 · 五行 · 十神 · 传统干支历法排盘",
  icon: "🧮",
  welcomeTitle: "道一生辰，为你排盘",
  welcomeText:
    "输入出生年、月、日、时（公历），即可排出四柱八字，并查看天干地支、五行分布与十神关系。",
  disclaimer:
    "排盘依传统干支历法推算，立春为岁首、节气定月、子时换日，结果仅供文化研究与自我认识参考，不作宿命论断。",
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(180,83,9,0.28),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(76,29,149,0.38),_transparent_55%)]",
    avatar: "from-amber-400 to-purple-700",
    action: "from-amber-500 to-purple-700",
    actionHover: "hover:from-amber-400 hover:to-purple-600",
    bubble: "from-amber-600 to-purple-700",
    title: "text-amber-100",
    tabActive: "border-amber-400/60 bg-amber-400/10 text-amber-100",
    chipHover: "hover:border-amber-400/50",
    particle: "bg-amber-200/80",
    ambient: "stars",
    watermark: "☰",
    heading: "font-semibold text-amber-100",
    strong: "text-amber-200",
    code: "text-amber-200",
    bullet: "bg-amber-400",
    quote: "border-amber-400/60 text-amber-100/90",
    ordinal: "text-amber-300",
  },
};
