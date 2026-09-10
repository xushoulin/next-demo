/**
 * Agent（AI 角色）领域模型 —— 纯类型定义，不包含任何实现，可被前后端共享。
 *
 * 角色分两类，以 `kind` 作可辨识字段：
 * - chat：对话型角色（解梦、风水），渲染 ChatPanel；
 * - bazi：工具型角色（八字排盘），无对话，渲染专属面板。
 */

/** 对话型角色 ID */
export type ChatAgentId = "dream" | "fengshui";

/** 工具型角色 ID */
export type ToolAgentId = "bazi";

/** 已注册的 AI 角色 ID */
export type AgentId = ChatAgentId | ToolAgentId;

/** 角色形态 */
export type AgentKind = "chat" | "bazi";

/** 背景装饰变体 */
export type AmbientVariant = "stars" | "mountains";

/**
 * 角色主题：以 Tailwind 原子类字符串描述，
 * 保证主题集中配置、组件零硬编码。
 */
export type AgentTheme = {
  /** 页面背景径向渐变 */
  backdrop: string;
  /** 头像 / 品牌图标渐变 */
  avatar: string;
  /** 主操作按钮渐变 */
  action: string;
  /** 主操作按钮 hover 渐变 */
  actionHover: string;
  /** 用户气泡渐变 */
  bubble: string;
  /** 标题文字颜色 */
  title: string;
  /** 选中态 Tab 样式 */
  tabActive: string;
  /** 建议卡 hover 边框 */
  chipHover: string;
  /** 背景粒子颜色 */
  particle: string;
  /** 背景装饰变体 */
  ambient: AmbientVariant;
  /** 背景水印字符 */
  watermark: string;
  /** Markdown 标题 */
  heading: string;
  /** Markdown 加粗 */
  strong: string;
  /** Markdown 行内代码 */
  code: string;
  /** Markdown 列表圆点 */
  bullet: string;
  /** Markdown 引用块 */
  quote: string;
  /** Markdown 有序列表序号 */
  ordinal: string;
};

/** 快捷提问 */
export type Suggestion = {
  emoji: string;
  text: string;
};

/** 所有角色共享的基础信息 */
type AgentBase = {
  name: string;
  /** 一句话定位 */
  tagline: string;
  /** 角色图标 */
  icon: string;
  /** 欢迎页主标题 */
  welcomeTitle: string;
  /** 欢迎页描述 */
  welcomeText: string;
  /** 免责声明 */
  disclaimer: string;
  theme: AgentTheme;
};

/**
 * 对话型角色元数据。
 * 注意：不得包含 systemPrompt 等需保密的内容。
 */
export type ChatAgentMeta = AgentBase & {
  id: ChatAgentId;
  kind: "chat";
  /** 等待大模型回复时轮播展示的提示语 */
  thinkingTexts: string[];
  /** 输入框占位文案 */
  inputPlaceholder: string;
  /** 快捷提问 */
  suggestions: Suggestion[];
};

/**
 * 工具型角色元数据（无对话）。
 * 注意：不得包含 systemPrompt 等需保密的内容。
 */
export type BaziAgentMeta = AgentBase & {
  id: ToolAgentId;
  kind: "bazi";
};

/** 客户端可见的全部角色元数据 */
export type AgentMeta = ChatAgentMeta | BaziAgentMeta;
