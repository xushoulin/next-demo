import type { ChatAgentMeta } from "../types";

/** 智能礼宾 —— 客户端可见元数据 */
export const CONCIERGE_AGENT: ChatAgentMeta = {
  id: "concierge",
  kind: "chat",
  name: "智能礼宾",
  tagline: "酒店设施 · 服务时间 · 周边推荐 · 政策解答",
  icon: "🛎️",
  welcomeTitle: "住得舒心，从一次提问开始",
  welcomeText:
    "无论是早餐时段、健身房开放时间、叫车与行李寄存，还是周边吃喝玩乐的推荐，把需求说出来，我会给你准确、可立即行动的答案。",
  disclaimer:
    "回答基于本店公开的服务信息与通用常识整理，具体以酒店现场公示为准；涉及价格与库存等动态信息，请以前台或官方渠道确认为准。",
  thinkingTexts: [
    "正在查询酒店服务信息…",
    "正在为你整理周边推荐…",
    "正在核对服务时间与政策细节…",
  ],
  inputPlaceholder: "输入你的需求，例如：健身房几点开门？附近有推荐的餐厅吗？",
  suggestions: [
    { emoji: "🍳", text: "早餐是几点到几点？在几楼？" },
    { emoji: "🏋️", text: "健身房和泳池的开放时间是什么时候？" },
    { emoji: "🧳", text: "退房后可以寄存行李吗？最长能存多久？" },
    { emoji: "🍜", text: "附近有哪些步行可达的本地餐厅？" },
    { emoji: "🚕", text: "帮忙说明一下叫车去机场的流程" },
    { emoji: "🕐", text: "延迟退房政策是怎样的？" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(217,119,6,0.45),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(146,64,14,0.30),_transparent_55%)]",
    avatar: "from-amber-500 to-orange-600",
    action: "from-amber-600 to-orange-600",
    actionHover: "hover:from-amber-500 hover:to-orange-500",
    bubble: "from-amber-600 to-orange-600",
    title: "text-amber-100",
    tabActive: "border-amber-400/60 bg-amber-400/10 text-amber-100",
    chipHover: "hover:border-amber-400/50",
    particle: "bg-amber-200",
    ambient: "mountains",
    watermark: "🛎️",
    heading: "font-semibold text-amber-100",
    strong: "text-amber-200",
    code: "text-amber-200",
    bullet: "bg-amber-400",
    quote: "border-amber-400/60 text-amber-100/90",
    ordinal: "text-amber-300",
  },
};
