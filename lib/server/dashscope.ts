import { createOpenAI } from "@ai-sdk/openai";

/**
 * 阿里云百炼（DashScope）OpenAI 兼容 Provider。
 * 服务端专用：API Key 只存在于服务端环境变量。
 * 文档：https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope
 */

export const DASHSCOPE_BASE_URL =
  process.env.DASHSCOPE_API_BASE ??
  "https://dashscope.aliyuncs.com/compatible-mode/v1";

/** 默认模型，可通过 DASHSCOPE_MODEL 覆盖 */
export const DEFAULT_MODEL = process.env.DASHSCOPE_MODEL ?? "qwen-plus";

/**
 * 采样参数。
 * topP 必须显式设置：通义千问在只设 temperature 时容易出现重复罗列的退化输出。
 * maxOutputTokens 作为兜底，防止异常情况下无限生成。
 */
export const SAMPLING = {
  topP: 0.8,
  maxOutputTokens: 2048,
} as const;

export const dashscope = createOpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY ?? "",
  baseURL: DASHSCOPE_BASE_URL,
});
