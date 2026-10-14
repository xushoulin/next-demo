import { test as base, expect, type Locator, type Page, type TestInfo } from "@playwright/test";

/** 固定测试账号（免密登录，仅用户名） */
export const TEST_USER = process.env.TEST_USERNAME ?? "autotest";

/** 三个对话角色，与 lib/agents 注册顺序一致 */
export const AGENT_IDS = ["concierge", "booking", "member"] as const;
export type AgentId = (typeof AGENT_IDS)[number];

export const AGENT_NAMES: Record<AgentId, string> = {
  concierge: "智能礼宾",
  booking: "智能预订助手",
  member: "会员服务助手",
};

/**
 * 页面操作封装：把「元素定位 + 等待」集中到一处，
 * 用例里只描述业务动作，元素变了只需改这里。
 */
export class AppPage {
  constructor(public readonly page: Page) {}

  /** 打开登录页（/chat 在未登录时渲染登录屏） */
  async openLogin(): Promise<void> {
    await this.page.goto("/chat");
    await expect(
      this.page.getByTestId("login-screen"),
      "应显示登录页（未登录访问 /chat 时）",
    ).toBeVisible();
  }

  /** 用户名登录，并等待主界面出现 */
  async login(username: string = TEST_USER): Promise<void> {
    await this.page.goto("/chat");
    await this.fillLogin(username);
    await this.page.getByTestId("login-submit").click();
    await expect(
      this.page.getByTestId("chat-app"),
      `用户名「${username}」登录后应进入主界面`,
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      this.userBadge,
      "右上角应展示当前登录用户名",
    ).toContainText(username.slice(0, 1).toUpperCase());
  }

  async fillLogin(username: string): Promise<void> {
    const input = this.page.getByTestId("login-username");
    await expect(input, "登录页应有用户名输入框").toBeVisible();
    await input.fill(username);
  }

  get userBadge(): Locator {
    return this.page.getByTestId("user-badge");
  }

  /** 清空三个角色的服务端会话，保证用例之间互不干扰 */
  async resetConversations(): Promise<void> {
    for (const agentId of AGENT_IDS) {
      await this.page.request.put("/api/conversations", {
        data: { agentId, messages: [] },
      });
    }
  }

  /**
   * 对话类用例的统一前置：登录 + 清空三个角色的历史会话 + 重新加载，
   * 保证每个用例都从空会话开始（用例独立可重跑的关键）。
   */
  async prepareChat(): Promise<void> {
    await this.login();
    await this.resetConversations();
    await this.page.reload();
    await expect(
      this.page.getByTestId("chat-app"),
      "重新加载后应仍处于登录态",
    ).toBeVisible({ timeout: 15_000 });
    // 三个面板常驻挂载、各有一个欢迎页，必须限定面板后再断言，否则命中严格模式
    await expect(
      this.page.getByTestId("chat-panel-knowledge").getByTestId("chat-welcome"),
      "清空历史后默认角色应回到欢迎页",
    ).toBeVisible();
  }

  async selectAgent(agentId: AgentId): Promise<void> {
    await this.page.getByTestId(`agent-tab-${agentId}`).click();
    await expect(
      this.page.getByTestId(`chat-panel-${agentId}`),
      `切换到「${AGENT_NAMES[agentId]}」后该面板应可见`,
    ).toBeVisible();
  }

  async sendMessage(agentId: AgentId, text: string): Promise<void> {
    const input = this.page.getByTestId(`composer-input-${agentId}`);
    await input.fill(text);
    await this.page.getByTestId(`send-button-${agentId}`).click();
  }

  /** 断言用户消息已上屏 */
  async expectUserMessage(text: string): Promise<void> {
    await expect(
      this.page.getByTestId("message-user").last(),
      `用户消息「${text}」应出现在对话区`,
    ).toContainText(text);
  }

  /** 等待助手回复出现且内容非空 */
  async expectAssistantReply(keyword?: string): Promise<string> {
    const bubble = this.page.getByTestId("message-assistant-text").last();
    await expect(bubble, "助手应返回一条回复").toBeVisible({ timeout: 30_000 });
    if (keyword) {
      await expect(bubble, `助手回复应包含「${keyword}」`).toContainText(keyword);
    }
    return (await bubble.innerText()).trim();
  }

  async expectChatError(message: string): Promise<void> {
    await expect(
      this.page.getByTestId("chat-error").first(),
      "对话区应展示错误提示",
    ).toContainText(message);
  }

  async clearChat(): Promise<void> {
    await this.page.getByTestId("clear-chat-button").click();
  }

  async logout(): Promise<void> {
    await this.page.getByTestId("logout-button").click();
    await expect(
      this.page.getByTestId("login-screen"),
      "退出后应回到登录页",
    ).toBeVisible();
  }
}

/** 失败时收集「现场证据」：URL + 控制台错误 + 可见文本 + 整页截图 */
export async function attachFailureContext(
  page: Page,
  testInfo: TestInfo,
  consoleErrors: string[],
): Promise<void> {
  let url = "(不可读)";
  let visibleText = "(不可读)";
  try {
    url = page.url();
    visibleText = (await page.locator("body").innerText({ timeout: 3_000 }))
      .replace(/\n{3,}/g, "\n\n")
      .slice(0, 3_000);
  } catch {
    // 页面已关闭时忽略
  }

  await testInfo.attach("失败现场", {
    contentType: "application/json",
    body: JSON.stringify({ url, consoleErrors, visibleText }, null, 2),
  });

  try {
    const shot = await page.screenshot({ fullPage: true, timeout: 5_000 });
    await testInfo.attach("失败截图-整页", { body: shot, contentType: "image/png" });
  } catch {
    // 页面已关闭时忽略
  }
}

/**
 * 统一测试入口：自动收集控制台错误，失败时自动留下现场证据。
 * 用例只需 `test("...", async ({ app }) => {...})`。
 */
export const test = base.extend<{ app: AppPage }>({
  app: async ({ page }, use, testInfo) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`[console] ${msg.text()}`);
    });
    page.on("pageerror", (error) => consoleErrors.push(`[pageerror] ${error.message}`));

    await use(new AppPage(page));

    const status = testInfo.status;
    if (status && status !== "passed" && status !== "skipped") {
      await attachFailureContext(page, testInfo, consoleErrors);
    }
  },
});

export { expect };
