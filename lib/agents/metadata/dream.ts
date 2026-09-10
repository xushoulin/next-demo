import type { AgentMeta } from "../types";

/** AI 周公解梦 —— 客户端可见元数据 */
export const DREAM_AGENT: AgentMeta = {
  id: "dream",
  name: "AI 周公解梦",
  tagline: "传统典籍 × 现代心理学 · 梦境解读",
  icon: "🌙",
  welcomeTitle: "道一句梦境，周公为你解",
  welcomeText:
    "把梦里的画面、人物与情绪讲给我听，我会结合传统典籍与现代心理学，为你梳理梦境的象征、吉凶与启示。",
  disclaimer:
    "解读内容基于传统文化与心理学，仅供参考娱乐，不构成医疗或心理咨询建议。",
  inputPlaceholder: "描述你的梦境，例如：我梦见在雨中奔跑……",
  suggestions: [
    { emoji: "🐍", text: "我梦见被一条大蛇追，怎么也跑不掉" },
    { emoji: "🦷", text: "梦见牙齿一颗颗掉光了，心里很慌" },
    { emoji: "🕊️", text: "梦见自己长出翅膀，在天上自由地飞" },
    { emoji: "🌊", text: "梦见站在一片无边无际的大海前" },
    { emoji: "🏔️", text: "梦见爬一座很高的山，快到山顶时醒了" },
    { emoji: "💍", text: "梦见和喜欢的人一起走进了婚礼殿堂" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.55),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(30,64,175,0.35),_transparent_55%)]",
    avatar: "from-violet-500 to-indigo-600",
    action: "from-violet-600 to-indigo-600",
    actionHover: "hover:from-violet-500 hover:to-indigo-500",
    bubble: "from-violet-600 to-indigo-600",
    title: "text-amber-100",
    tabActive: "border-violet-400/60 bg-violet-400/10 text-violet-100",
    chipHover: "hover:border-violet-400/50",
    particle: "bg-white",
    ambient: "stars",
    watermark: "🌙",
    heading: "font-semibold text-amber-100",
    strong: "text-amber-200",
    code: "text-violet-200",
    bullet: "bg-violet-400",
    quote: "border-violet-400/60 text-violet-100/90",
    ordinal: "text-amber-300",
  },
};
