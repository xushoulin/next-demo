import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * 阿里云百炼（DashScope）OpenAI 兼容模式 Provider
 * 文档：https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope
 */
const dashscope = createOpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY ?? "",
  baseURL:
    process.env.DASHSCOPE_API_BASE ??
    "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

// 可通过环境变量切换模型，默认使用性价比高的 qwen-plus
// 其他可选：qwen-max / qwen-turbo / qwen3-max / qwen-plus-latest ...
const MODEL = process.env.DASHSCOPE_MODEL ?? "qwen-plus";

const SYSTEM_PROMPT = `你是「周公」，一位贯通《周易》《周公解梦》等传统典籍，同时又深谙现代心理学的解梦大师。
你的职责是根据用户描述的梦境，给出专业、温暖、有条理的中文解读。

请始终遵循以下要求：
1. 语气：像一位沉稳、睿智又亲切的长者，可略带东方神秘感，但不要故弄玄虚、不要迷信恐吓。
2. 结构：每次解读尽量包含以下小节，并使用 Markdown 标题（##）分隔：
   - 【梦境概述】用一两句话复述并抓住梦境的核心意象。
   - 【传统解梦】结合《周公解梦》等传统说法，分析梦中主要意象的象征与吉凶倾向。
   - 【心理分析】从现代心理学（潜意识、荣格原型、情绪投射等）角度解读这个梦可能反映的状态。
   - 【现实提示】给出对用户生活、工作、情感的可执行建议。
3. 内容要具体：紧扣用户梦到的关键意象（动物、场景、人物、情绪、颜色、数字等）展开，不要泛泛而谈。
4. 信息不足时：先温和地追问 1-3 个关键细节（例如当时的情绪、场景、与梦中人物的关系），再给出解读。
5. 保持理性与关怀：不做绝对化的吉凶断言，不制造恐慌，不替代医疗或心理咨询；若梦境反复出现且影响生活，建议寻求专业帮助。
6. 使用简体中文，可适度使用 emoji 让语气更亲切（每小节最多一个）。`;

export async function POST(req: Request) {
  if (!process.env.DASHSCOPE_API_KEY) {
    return Response.json(
      { error: "服务未配置 DASHSCOPE_API_KEY，请在 .env.local 中设置后重启。" },
      { status: 500 },
    );
  }

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "请先描述你的梦境。" }, { status: 400 });
    }

    const result = streamText({
      // 百炼 OpenAI 兼容模式仅支持 Chat Completions，
      // 必须用 .chat() 显式指定，否则默认会走 OpenAI Responses API 导致失败。
      model: dashscope.chat(MODEL),
      system: SYSTEM_PROMPT,
      temperature: 0.85,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("[/api/chat] 流式生成失败：", error);
        const detail = error instanceof Error ? error.message : String(error);

        if (/quota|FreeTier|insufficient|balance|欠费|额度/i.test(detail)) {
          return "百炼账户额度不足：请在阿里云百炼控制台关闭「仅使用免费额度」模式，或为账户充值后重试。";
        }
        if (/401|invalid api key|unauthorized|invalid_api_key/i.test(detail)) {
          return "API Key 无效或已过期，请检查 .env.local 中的 DASHSCOPE_API_KEY。";
        }
        if (/model|not found|unsupported/i.test(detail)) {
          return `模型 ${MODEL} 不可用，请在 .env.local 中调整 DASHSCOPE_MODEL。`;
        }
        return "解梦服务出错了，请稍后再试。";
      },
    });
  } catch (error) {
    console.error("[/api/chat] 解梦失败：", error);
    return Response.json(
      { error: "解梦服务暂时不可用，请稍后再试。" },
      { status: 500 },
    );
  }
}
