/**
 * Agent（AI 角色）领域模型 —— 纯类型定义，不包含任何实现，可被前后端共享。
 */

/** 已注册的 AI 角色 ID */
export type AgentId = "dream" | "fengshui";

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

/**
 * 客户端可见的角色元数据。
 * 注意：不得包含 systemPrompt 等需保密的内容。
 */
export type AgentMeta = {
  id: AgentId;
  /** 角色名称 */
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
  /** 输入框占位文案 */
  inputPlaceholder: string;
  /** 快捷提问 */
  suggestions: Suggestion[];
  theme: AgentTheme;
};
