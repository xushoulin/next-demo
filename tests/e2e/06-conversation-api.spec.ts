import { expect, test } from "../support/app";
import { mockChat } from "../support/mock-stream";
import { countConversations } from "../support/db";

/**
 * 数据查询与持久化（/api/conversations）
 *
 * 业务事实（来自源码）：
 * - GET /api/conversations?agentId=xxx
 *   未登录 → 401「请先登录。」；agentId 缺失或非法 → 400「未知的对话角色。」
 * - PUT /api/conversations { agentId, messages }
 *   agentId 非法 → 400「未知的对话角色。」；messages 非数组 → 400「对话内容无效。」
 *   保存失败 → 500「保存失败，请确认数据库已连接。」
 * - 前端在消息变化后延迟 1 秒回写数据库，因此持久化断言需要等待
 */
test.describe("会话数据查询与持久化", () => {
  test("未登录查询会话返回 401「请先登录。」", async ({ page }) => {
    // 前置：未登录（全新上下文）
    // 步骤：GET /api/conversations?agentId=knowledge
    // 预期：401 且 error 为「请先登录。」
    const res = await page.request.get("/api/conversations?agentId=knowledge");
    expect(res.status(), "未登录时应返回 401").toBe(401);
    expect((await res.json()).error, "错误文案应为「请先登录。」").toBe("请先登录。");
  });

  test("已登录查询合法角色返回 200 与 messages 数组", async ({ app, page }) => {
    // 前置：已登录
    // 步骤：GET /api/conversations?agentId=knowledge
    // 预期：200，messages 为数组
    await app.login();
    const res = await page.request.get("/api/conversations?agentId=knowledge");

    expect(res.status(), "已登录时应返回 200").toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.messages), "messages 应为数组").toBe(true);
  });

  test("缺失 agentId 查询返回 400「未知的对话角色。」", async ({ app, page }) => {
    // 前置：已登录
    // 步骤：GET /api/conversations（不带 agentId）
    // 预期：400
    await app.login();
    const res = await page.request.get("/api/conversations");

    expect(res.status(), "缺少 agentId 应返回 400").toBe(400);
    expect((await res.json()).error, "应提示未知的对话角色").toBe("未知的对话角色。");
  });

  test("非法 agentId 查询返回 400", async ({ app, page }) => {
    // 前置：已登录
    // 步骤：GET /api/conversations?agentId=not-a-real-agent
    // 预期：400「未知的对话角色。」
    await app.login();
    const res = await page.request.get("/api/conversations?agentId=not-a-real-agent");

    expect(res.status(), "非法 agentId 应返回 400").toBe(400);
    expect((await res.json()).error).toBe("未知的对话角色。");
  });

  test("保存会话时 agentId 非法返回 400", async ({ app, page }) => {
    // 前置：已登录
    // 步骤：PUT /api/conversations 携带非法 agentId
    // 预期：400「未知的对话角色。」
    await app.login();
    const res = await page.request.put("/api/conversations", {
      data: { agentId: "bad-agent", messages: [] },
    });

    expect(res.status(), "非法 agentId 保存应返回 400").toBe(400);
    expect((await res.json()).error).toBe("未知的对话角色。");
  });

  test("保存会话时 messages 非数组返回 400「对话内容无效。」", async ({ app, page }) => {
    // 前置：已登录
    // 步骤：PUT /api/conversations 携带 messages: "not-array"
    // 预期：400「对话内容无效。」
    await app.login();
    const res = await page.request.put("/api/conversations", {
      data: { agentId: "knowledge", messages: "not-an-array" },
    });

    expect(res.status(), "messages 非数组应返回 400").toBe(400);
    expect((await res.json()).error).toBe("对话内容无效。");
  });

  test("对话内容在刷新后仍然存在（数据库持久化）", async ({ app, page }) => {
    // 前置：已登录、数据库可用、/api/chat 已 Mock
    // 步骤：发送一条消息 → 等待回写（防抖 1s）→ 刷新页面
    // 预期：刷新后仍能看到这条用户消息
    await mockChat(app.page, { kind: "ok", reply: "持久化验证回复。" });
    await app.prepareChat();
    await app.selectAgent("study");
    await app.sendMessage("study", "这条消息应该被持久化");
    await app.expectAssistantReply("持久化验证回复。");

    await page.waitForTimeout(2_000);
    await page.reload();
    await expect(page.getByTestId("chat-app"), "刷新后应保持登录").toBeVisible({
      timeout: 15_000,
    });

    await app.selectAgent("study");
    await expect(
      page.getByTestId("chat-panel-study").getByTestId("message-user"),
      "刷新后历史消息应仍在",
    ).toContainText("这条消息应该被持久化");
  });

  test("清空对话会同步清除数据库记录", async ({ app, page }) => {
    // 前置：已登录、已有一次对话并已持久化
    // 步骤：点击「清空对话」→ 等待回写 → 直接查询接口
    // 预期：接口返回的 messages 为空数组
    await mockChat(app.page, { kind: "ok", reply: "待清空的回复。" });
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "先产生一条记录");
    await app.expectAssistantReply("待清空的回复。");
    await page.waitForTimeout(2_000);

    await app.clearChat();
    await page.waitForTimeout(2_000);

    const res = await page.request.get("/api/conversations?agentId=knowledge");
    const data = await res.json();
    expect(
      Array.isArray(data.messages) && data.messages.length === 0,
      "清空后接口应返回空会话",
    ).toBe(true);
  });

  test("数据落库校验：测试账号在数据库中有会话记录", async ({ app }) => {
    // 前置：数据库可用（DATABASE_URL 已配置）
    // 步骤：发一条消息并等待回写 → 直连数据库统计会话行数
    // 预期：至少 1 行；数据库不可用时用例自动跳过
    const before = await countConversations();
    if (before === null) {
      test.skip(true, "未配置或无法连接 DATABASE_URL，跳过数据库落库校验");
      return;
    }

    await mockChat(app.page, { kind: "ok", reply: "落库校验回复。" });
    await app.prepareChat();
    await app.selectAgent("writing");
    await app.sendMessage("writing", "落库校验消息");
    await app.expectAssistantReply("落库校验回复。");
    await app.page.waitForTimeout(2_000);

    const after = await countConversations();
    expect(after, "数据库中应存在该账号的会话记录").not.toBeNull();
    expect(after ?? 0, "会话记录数应大于 0").toBeGreaterThan(0);
  });
});
