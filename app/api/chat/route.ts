import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";

// 阿里百炼（DashScope）OpenAI 兼容 provider
const dashscope = createOpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL:
    process.env.DASHSCOPE_API_BASE ??
    "https://dashscope.aliyuncs.com/compatible-mode/v1",
});
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "exists" : "missing",
);

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: dashscope("qwen3.5-ocr"),
    system: "你是一个专业、友好的 AI 助手，请用中文回答用户问题。",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
