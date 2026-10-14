import { expect, test } from "../support/app";
import { mockChat } from "../support/mock-stream";

/**
 * 对话异常路径
 *
 * 业务事实（来自 /api/chat 源码）：
 * - 未配置 DASHSCOPE_API_KEY → 500「服务未配置 DASHSCOPE_API_KEY，请在 .env.local 中设置后重启。」
 * - agentId 非法 → 400「未知的角色 ID。」
 * - messages 为空 → 400「消息不能为空。」
 * - 生成失败统一兜底文案「服务暂时不可用，请稍后再试。」
 * - 前端错误由 MessageList 的 role=alert 区块展示
 */
test.describe("对话异常路径", () => {
  test("接口 500：展示「服务暂时不可用，请稍后再试。」", async ({ app }) => {
    // 前置：已登录，/api/chat 被 Mock 为 500（服务端兜底文案）
    // 步骤：发送消息
    // 预期：对话区出现 role=alert 的错误提示，且文案与服务端一致
    await mockChat(app.page, {
      kind: "http-error",
      status: 500,
      error: "服务暂时不可用，请稍后再试。",
    });
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "触发 500");

    await app.expectChatError("服务暂时不可用，请稍后再试。");
    await expect(
      app.page.getByTestId("send-button-knowledge"),
      "出错后应恢复可发送状态",
    ).toBeVisible();
  });

  test("接口 400：展示「未知的角色 ID。」", async ({ app }) => {
    // 前置：已登录，/api/chat 被 Mock 为 400
    // 步骤：发送消息
    // 预期：展示「未知的角色 ID。」
    await mockChat(app.page, {
      kind: "http-error",
      status: 400,
      error: "未知的角色 ID。",
    });
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "触发 400");

    await app.expectChatError("未知的角色 ID。");
  });

  test("接口 500（未配置模型密钥）：展示密钥缺失提示", async ({ app }) => {
    // 前置：已登录，/api/chat 被 Mock 为密钥未配置的 500
    // 步骤：发送消息
    // 预期：展示「服务未配置 DASHSCOPE_API_KEY」
    await mockChat(app.page, {
      kind: "http-error",
      status: 500,
      error: "服务未配置 DASHSCOPE_API_KEY，请在 .env.local 中设置后重启。",
    });
    await app.prepareChat();
    await app.selectAgent("writing");
    await app.sendMessage("writing", "触发密钥缺失");

    await app.expectChatError("服务未配置 DASHSCOPE_API_KEY");
  });

  test("网络中断：展示错误提示而不是白屏", async ({ app }) => {
    // 前置：已登录，/api/chat 连接被中断
    // 步骤：发送消息
    // 预期：对话区出现错误提示（AI SDK 的 fetch 失败提示）
    await mockChat(app.page, { kind: "network-error" });
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "触发网络中断");

    await expect(
      app.page.getByTestId("chat-error"),
      "网络中断时应在对话区展示错误",
    ).toBeVisible({ timeout: 20_000 });
  });

  test("接口异常后恢复：再次发送可正常收到回复", async ({ app }) => {
    // 前置：已登录，先 Mock 500，再 Mock 正常回复
    // 步骤：发送一次触发错误 → 切换为正常 Mock → 再次发送
    // 预期：第二次能正常收到助手回复（错误不会卡死输入）
    const calls = await mockChat(app.page, {
      kind: "http-error",
      status: 500,
      error: "服务暂时不可用，请稍后再试。",
    });
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "第一次失败");
    await app.expectChatError("服务暂时不可用，请稍后再试。");

    await app.page.unroute("**/api/chat");
    await mockChat(app.page, { kind: "ok", reply: "第二次成功了。" });
    await app.sendMessage("knowledge", "第二次重试");

    await app.expectAssistantReply("第二次成功了。");
    expect(calls.length, "应记录到至少一次对话请求").toBeGreaterThanOrEqual(1);
  });

  test("会话接口不可用时降级本地模式并显示「本地」标记", async ({ app }) => {
    // 前置：已登录，/api/conversations 被 Mock 为 500（等价于数据库不可用）
    // 步骤：重新加载页面
    // 预期：右上角出现「本地」标记（源码：localMode 为真时展示）
    await app.login();
    await app.page.route("**/api/conversations", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "保存失败，请确认数据库已连接。" }),
      }),
    );
    await app.page.reload();

    await expect(app.page.getByTestId("chat-app"), "应仍能进入主界面").toBeVisible({
      timeout: 15_000,
    });
    await expect(
      app.page.getByTestId("local-mode-badge"),
      "数据库不可用时应展示「本地」标记",
    ).toBeVisible({ timeout: 15_000 });
  });
});
