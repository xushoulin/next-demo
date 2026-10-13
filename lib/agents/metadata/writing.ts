import type { ChatAgentMeta } from "../types";

/** AI 写作助手 —— 客户端可见元数据 */
export const WRITING_AGENT: ChatAgentMeta = {
  id: "writing",
  kind: "chat",
  name: "AI 写作助手",
  tagline: "润色 · 扩写 · 改写 · 结构化 · 文字更有力",
  icon: "✍️",
  welcomeTitle: "把想法，交给更清楚的文字",
  welcomeText:
    "贴入你的草稿，告诉我想要的效果——润色表达、扩充内容、调整结构，或换一种语气，我来帮你把文字打磨得更清楚、更有力。",
  disclaimer:
    "生成内容仅作创作辅助与参考，请自行核对事实与原创性，避免直接提交机器成稿作为个人作品。",
  thinkingTexts: [
    "正在理解你想要的文风与目的…",
    "正在梳理表达上的可优化点…",
    "正在重新组织文字结构…",
  ],
  inputPlaceholder: "贴入你的文字，并说明想要的效果，例如：帮我润色这段，更简洁一些",
  suggestions: [
    { emoji: "✨", text: "帮我把这段话润色得更简洁专业：（贴入文字）" },
    { emoji: "📈", text: "把这句产品描述改写得更有吸引力" },
    { emoji: "🧱", text: "给这篇短文加一个清晰的开头和小结" },
    { emoji: "🔁", text: "用更口语、更亲切的语气重写这段" },
    { emoji: "📑", text: "把我列的要点整理成结构化的清单" },
    { emoji: "🌟", text: "帮我把这段简历经历写得更具体有说服力" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.50),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(30,64,175,0.32),_transparent_55%)]",
    avatar: "from-violet-500 to-indigo-600",
    action: "from-violet-600 to-indigo-600",
    actionHover: "hover:from-violet-500 hover:to-indigo-500",
    bubble: "from-violet-600 to-indigo-600",
    title: "text-violet-100",
    tabActive: "border-violet-400/60 bg-violet-400/10 text-violet-100",
    chipHover: "hover:border-violet-400/50",
    particle: "bg-white",
    ambient: "stars",
    watermark: "✍️",
    heading: "font-semibold text-violet-100",
    strong: "text-violet-200",
    code: "text-violet-200",
    bullet: "bg-violet-400",
    quote: "border-violet-400/60 text-violet-100/90",
    ordinal: "text-violet-300",
  },
};
