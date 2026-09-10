/**
 * 上游大模型错误的统一归类。
 * 目标：服务端记录完整错误，客户端只拿到可行动的中文提示。
 */

const RULES: { pattern: RegExp; message: string }[] = [
  {
    pattern: /quota|FreeTier|insufficient|balance|欠费|额度/i,
    message:
      "百炼账户额度不足：请在阿里云百炼控制台关闭「仅使用免费额度」模式，或为账户充值后重试。",
  },
  {
    pattern: /401|invalid api key|unauthorized|invalid_api_key/i,
    message: "API Key 无效或已过期，请检查服务端的 DASHSCOPE_API_KEY 配置。",
  },
  {
    pattern: /model|not found|unsupported/i,
    message: "当前模型不可用，请在服务端调整 DASHSCOPE_MODEL 配置。",
  },
  {
    pattern: /timeout|ETIMEDOUT|ECONNRESET/i,
    message: "请求大模型超时，请稍后重试。",
  },
];

/** 将任意上游错误转换为面向用户的中文提示 */
export function toUserFacingError(error: unknown, fallback: string): string {
  const detail = error instanceof Error ? error.message : String(error);
  return RULES.find((rule) => rule.pattern.test(detail))?.message ?? fallback;
}
