import { expect, test } from "../support/app";

/**
 * 真实大模型调用（默认跳过）
 *
 * 说明：本组用例会真实调用百炼接口，产生 token 消耗且耗时 10–60 秒，
 *      结果具有不确定性，因此默认 skip。需要验证真实链路时执行：
 *
 *   RUN_REAL_MODEL=1 npx playwright test --grep "真实模型"
 *
 * 前置条件：.env.local 中配置了有效的 DASHSCOPE_API_KEY，且服务已重启加载配置。
 */
const runReal = process.env.RUN_REAL_MODEL === "1";

test.describe("真实模型调用", () => {
  test("知识问答：真实调用应返回非空回复", async ({ app }) => {
    test.skip(!runReal, "默认跳过：设置 RUN_REAL_MODEL=1 后启用");

    // 前置：已登录、DASHSCOPE_API_KEY 有效
    // 步骤：发送一个简单问题
    // 预期：60 秒内收到非空助手回复
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "用一句话说明为什么天空是蓝色的。");

    const reply = await app.expectAssistantReply();
    expect(reply.length, "真实模型回复不应为空").toBeGreaterThan(0);
  });

  test("写作助手：真实调用应返回非空回复", async ({ app }) => {
    test.skip(!runReal, "默认跳过：设置 RUN_REAL_MODEL=1 后启用");

    await app.prepareChat();
    await app.selectAgent("writing");
    await app.sendMessage("writing", "帮我把「今天天气很好」改写得更有文采。");

    const reply = await app.expectAssistantReply();
    expect(reply.length, "真实模型回复不应为空").toBeGreaterThan(0);
  });
});
