import { AGENT_IDS, AGENT_NAMES, expect, test } from "../support/app";
import { mockChat } from "../support/mock-stream";

/**
 * 对话主流程（正常路径）
 *
 * 业务事实：
 * - 三个对话角色：knowledge（AI 知识问答）、writing（AI 写作助手）、study（AI 学习方法）
 * - 输入框 id=composer-<agentId>，Enter 发送、Shift+Enter 换行，空内容时发送按钮 disabled
 * - 所有面板常驻挂载，切换 Tab 只切换可见性，各角色会话相互独立
 * - 「清空对话」按钮会清空当前角色的会话并回写数据库
 *
 * 说明：本组用例用 Mock 拦截 /api/chat，返回与真实协议一致的 UI Message Stream，
 *      不消耗大模型 token，可无限次重复执行。
 */
test.describe("对话主流程", () => {
  test("三个角色 Tab 均存在且名称正确", async ({ app }) => {
    // 前置：已登录
    // 步骤：进入主界面，查看角色 Tab
    // 预期：三个 Tab 文案与注册顺序一致
    await app.login();

    for (const agentId of AGENT_IDS) {
      await expect(
        app.page.getByTestId(`agent-tab-${agentId}`),
        `应存在「${AGENT_NAMES[agentId]}」Tab`,
      ).toContainText(AGENT_NAMES[agentId]);
    }
  });

  for (const agentId of AGENT_IDS) {
    test(`${AGENT_NAMES[agentId]}：发送消息后收到助手回复`, async ({ app }) => {
      // 前置：已登录、会话已清空、/api/chat 已 Mock
      // 步骤：切换到该角色 → 输入问题 → 点击发送
      // 预期：用户消息上屏，助手流式回复出现且内容包含 Mock 文本
      await mockChat(app.page, { kind: "ok", reply: "这是自动化测试的 Mock 回复内容。" });
      await app.prepareChat();
      await app.selectAgent(agentId);

      await app.sendMessage(agentId, "自动化测试提问");
      await app.expectUserMessage("自动化测试提问");
      await app.expectAssistantReply("Mock 回复内容");
    });
  }

  test("输入框为空时发送按钮不可点击", async ({ app }) => {
    // 前置：已登录
    // 步骤：不输入任何内容，查看发送按钮
    // 预期：发送按钮为 disabled
    await app.prepareChat();
    await app.selectAgent("knowledge");

    await expect(
      app.page.getByTestId("send-button-knowledge"),
      "空输入时发送按钮应禁用",
    ).toBeDisabled();

    await app.page.getByTestId("composer-input-knowledge").fill("有内容了");
    await expect(
      app.page.getByTestId("send-button-knowledge"),
      "有内容后发送按钮应可用",
    ).toBeEnabled();
  });

  test("支持 Enter 键发送消息", async ({ app }) => {
    // 前置：已登录、/api/chat 已 Mock
    // 步骤：输入内容后按 Enter
    // 预期：消息被发送，助手回复出现
    await mockChat(app.page, { kind: "ok", reply: "已收到你的 Enter 消息。" });
    await app.prepareChat();
    await app.selectAgent("knowledge");

    const input = app.page.getByTestId("composer-input-knowledge");
    await input.fill("用回车发送");
    await input.press("Enter");

    await app.expectUserMessage("用回车发送");
    await app.expectAssistantReply("已收到你的 Enter 消息。");
  });

  test("Shift+Enter 不发送消息，仅换行", async ({ app }) => {
    // 前置：已登录、/api/chat 已 Mock
    // 步骤：输入内容后按 Shift+Enter
    // 预期：不产生用户消息，输入框内容保留换行
    await mockChat(app.page, { kind: "ok", reply: "不应收到消息。" });
    await app.prepareChat();
    await app.selectAgent("knowledge");

    const input = app.page.getByTestId("composer-input-knowledge");
    await input.fill("第一行");
    await input.press("Shift+Enter");
    await input.type("第二行");

    await expect(
      app.page.getByTestId("message-user"),
      "Shift+Enter 不应发送消息",
    ).toHaveCount(0);
    await expect(input, "输入框应保留两行内容").toHaveValue("第一行\n第二行");
  });

  test("点击欢迎页推荐问题可直接发起提问", async ({ app }) => {
    // 前置：已登录、空会话、/api/chat 已 Mock
    // 步骤：点击第一张推荐卡片
    // 预期：该问题作为用户消息上屏，并收到助手回复
    await mockChat(app.page, { kind: "ok", reply: "这是推荐问题的 Mock 回答。" });
    await app.prepareChat();
    await app.selectAgent("knowledge");

    const suggestion = app.page.getByTestId("suggestion-item").first();
    const text = (await suggestion.innerText()).trim();
    await suggestion.click();

    await app.expectUserMessage(text.replace(/\s+/g, " ").slice(0, 8));
    await app.expectAssistantReply("Mock 回答");
  });

  test("清空对话后回到欢迎页", async ({ app }) => {
    // 前置：已登录、已有一次对话
    // 步骤：点击「清空对话」
    // 预期：对话消息清空，欢迎页重新出现
    await mockChat(app.page, { kind: "ok", reply: "待清空的消息。" });
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "先发一条");
    await app.expectAssistantReply("待清空的消息。");

    await app.clearChat();

    await expect(app.page.getByTestId("message-user"), "消息应被清空").toHaveCount(0);
    await expect(
      app.page.getByTestId("chat-panel-knowledge").getByTestId("chat-welcome"),
      "应回到欢迎页",
    ).toBeVisible();
  });

  test("角色之间会话相互隔离", async ({ app }) => {
    // 前置：已登录、三个角色会话均为空
    // 步骤：在「AI 知识问答」发消息 → 切换到「AI 写作助手」
    // 预期：写作助手面板中不存在该消息，仍显示欢迎页
    await mockChat(app.page, { kind: "ok", reply: "知识问答的回复。" });
    await app.prepareChat();
    await app.selectAgent("knowledge");
    await app.sendMessage("knowledge", "只在知识问答里出现");
    await app.expectAssistantReply("知识问答的回复。");

    await app.selectAgent("writing");

    const writingPanel = app.page.getByTestId("chat-panel-writing");
    await expect(
      writingPanel.getByTestId("message-user"),
      "写作助手面板不应出现其他角色的消息",
    ).toHaveCount(0);
    await expect(writingPanel.getByTestId("chat-welcome"), "写作助手应仍为欢迎页").toBeVisible();
  });

  test("发送期间可点击「停止」中断生成", async ({ app }) => {
    // 前置：已登录、/api/chat 被 Mock 为延迟 5 秒返回
    // 步骤：发送消息 → 等待按钮变为「停止」→ 点击停止
    // 预期：按钮恢复为「发送」，界面不再处于生成中状态
    await mockChat(app.page, {
      kind: "ok",
      reply: "这段回复应该被打断。",
      responseDelayMs: 5_000,
    });
    await app.prepareChat();
    await app.selectAgent("knowledge");

    await app.sendMessage("knowledge", "发一条会被中断的消息");

    const stop = app.page.getByTestId("stop-button-knowledge");
    await expect(stop, "生成中应显示停止按钮").toBeVisible();
    await stop.click();

    await expect(
      app.page.getByTestId("send-button-knowledge"),
      "停止后应恢复为发送按钮",
    ).toBeVisible({ timeout: 15_000 });
  });
});
