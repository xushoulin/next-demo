import type { ChatAgentMeta } from "../types";

/** 会员服务助手 —— 客户端可见元数据 */
export const MEMBER_AGENT: ChatAgentMeta = {
  id: "member",
  kind: "chat",
  name: "会员服务助手",
  tagline: "会员权益 · 积分规则 · 升级路径 · 售后指引",
  icon: "💳",
  welcomeTitle: "会员权益，一项都别浪费",
  welcomeText:
    "想了解当前会员等级的权益、积分怎么累计与使用、房型升级怎么申请，或发票与售后流程？把问题说清楚，我会给出具体、可操作的办理指引。",
  disclaimer:
    "会员权益与积分规则以酒店会员体系官方公示为准；涉及账户操作（如积分兑换、退款）请通过官方渠道或前台办理。",
  thinkingTexts: [
    "正在核对会员权益说明…",
    "正在整理积分与升级规则…",
    "正在生成办理步骤清单…",
  ],
  inputPlaceholder: "描述你的问题，例如：积分怎么兑换房型升级？",
  suggestions: [
    { emoji: "🎁", text: "当前会员等级都有哪些权益？" },
    { emoji: "⭐", text: "积分是怎么累计的？怎么查询余额？" },
    { emoji: "🛗", text: "如何用积分兑换房型升级？" },
    { emoji: "🧾", text: "入住后怎么开发票？" },
    { emoji: "📈", text: "怎么升级到更高等级的会员？" },
    { emoji: "🔄", text: "订单退款一般多久到账？" },
  ],
  theme: {
    backdrop:
      "bg-[radial-gradient(ellipse_at_top,_rgba(5,150,105,0.42),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(6,95,70,0.32),_transparent_55%)]",
    avatar: "from-emerald-500 to-teal-600",
    action: "from-emerald-600 to-teal-600",
    actionHover: "hover:from-emerald-500 hover:to-teal-500",
    bubble: "from-emerald-600 to-teal-600",
    title: "text-emerald-100",
    tabActive: "border-emerald-400/60 bg-emerald-400/10 text-emerald-100",
    chipHover: "hover:border-emerald-400/50",
    particle: "bg-white",
    ambient: "stars",
    watermark: "💳",
    heading: "font-semibold text-emerald-100",
    strong: "text-emerald-200",
    code: "text-emerald-200",
    bullet: "bg-emerald-400",
    quote: "border-emerald-400/60 text-emerald-100/90",
    ordinal: "text-emerald-300",
  },
};
