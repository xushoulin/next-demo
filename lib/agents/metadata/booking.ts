import type { ChatAgentMeta } from "../types";

/** 智能预订助手 —— 客户端可见元数据 */
export const BOOKING_AGENT: ChatAgentMeta = {
  id: "booking",
  kind: "chat",
  name: "智能预订助手",
  tagline: "房型推荐 · 价格咨询 · 预订引导 · 入住办理指引",
  icon: "🛏️",
  welcomeTitle: "选对房间，旅程就成功了一半",
  welcomeText:
    "告诉我入住人数、日期和偏好（安静楼层、大床、景观……），我会为你推荐合适的房型，讲清价格构成与预订流程，并列出入住办理需要的材料。",
  disclaimer:
    "房型与价格信息仅供参考，实际以预订系统实时数据为准；订单创建与取消规则请以官方渠道展示的条款为准。",
  thinkingTexts: [
    "正在为你匹配合适的房型…",
    "正在梳理价格与预订规则…",
    "正在整理入住办理清单…",
  ],
  inputPlaceholder: "描述你的入住需求，例如：下周六住一晚，两位，想要安静的大床房",
  suggestions: [
    { emoji: "🛏️", text: "两位入住，推荐一间安静的大床房" },
    { emoji: "👨‍👩‍👧", text: "带孩子出行，哪种房型最合适？" },
    { emoji: "💰", text: "房费一般包含哪些？有其他服务费吗？" },
    { emoji: "📋", text: "入住办理需要带哪些证件和材料？" },
    { emoji: "📅", text: "预订后想改期或取消，流程是怎样的？" },
    { emoji: "🌅", text: "想要高楼层景观好的房间，怎么选？" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.45),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(30,58,138,0.32),_transparent_55%)]",
    avatar: "from-blue-500 to-indigo-600",
    action: "from-blue-600 to-indigo-600",
    actionHover: "hover:from-blue-500 hover:to-indigo-500",
    bubble: "from-blue-600 to-indigo-600",
    title: "text-blue-100",
    tabActive: "border-blue-400/60 bg-blue-400/10 text-blue-100",
    chipHover: "hover:border-blue-400/50",
    particle: "bg-white",
    ambient: "stars",
    watermark: "🛏️",
    heading: "font-semibold text-blue-100",
    strong: "text-blue-200",
    code: "text-blue-200",
    bullet: "bg-blue-400",
    quote: "border-blue-400/60 text-blue-100/90",
    ordinal: "text-blue-300",
  },
};
