import type { ChatAgentMeta } from "../types";

/** AI 知识问答 —— 客户端可见元数据 */
export const KNOWLEDGE_AGENT: ChatAgentMeta = {
  id: "knowledge",
  kind: "chat",
  name: "AI 知识问答",
  tagline: "科学 · 历史 · 文化 · 生活常识 · 通俗解答",
  icon: "📚",
  welcomeTitle: "有问题？我们一起把它弄明白",
  welcomeText:
    "无论是科学原理、历史脉络、文化习俗还是生活常识，把问题说清楚，我会用通俗、可靠的方式为你讲明白，并注明知识的边界。",
  disclaimer:
    "回答基于公开知识与通用常识整理，仅供学习参考；涉及医疗、法律、金融等专业领域，请以权威资料或专业人士意见为准。",
  thinkingTexts: [
    "正在检索可靠的讲解路径…",
    "正在把复杂概念拆成易懂的层次…",
    "正在核对知识的边界与适用条件…",
  ],
  inputPlaceholder: "输入你的问题，例如：为什么天空是蓝色的？",
  suggestions: [
    { emoji: "🌌", text: "为什么天空在白天是蓝色，日落时又变红？" },
    { emoji: "🌐", text: "从输入网址到网页显示，中间到底发生了什么？" },
    { emoji: "🧠", text: "睡觉到底是怎么帮我们记住东西的？" },
    { emoji: "💡", text: "通货膨胀到底是什么，为什么钱会「变薄」？" },
    { emoji: "🏛️", text: "古代没有钟表，人们是怎么准确计时的？" },
    { emoji: "🔭", text: "光速为什么是宇宙里的速度上限？" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.45),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(30,64,175,0.32),_transparent_55%)]",
    avatar: "from-sky-500 to-blue-600",
    action: "from-sky-600 to-blue-600",
    actionHover: "hover:from-sky-500 hover:to-blue-500",
    bubble: "from-sky-600 to-blue-600",
    title: "text-sky-100",
    tabActive: "border-sky-400/60 bg-sky-400/10 text-sky-100",
    chipHover: "hover:border-sky-400/50",
    particle: "bg-white",
    ambient: "stars",
    watermark: "📚",
    heading: "font-semibold text-sky-100",
    strong: "text-sky-200",
    code: "text-sky-200",
    bullet: "bg-sky-400",
    quote: "border-sky-400/60 text-sky-100/90",
    ordinal: "text-sky-300",
  },
};
