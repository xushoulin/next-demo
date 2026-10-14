import { expect, test } from "../support/app";
import { buildSseStream, SSE_HEADERS } from "../support/mock-stream";

/** 临时探针：用于确认 Mock 协议、错误文案、mailto 行为的真实表现 */
test("探针", async ({ app, page }) => {
  const log = (...args: unknown[]) => console.log("[PROBE]", ...args);

  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 200,
      headers: SSE_HEADERS,
      body: buildSseStream("探针回复：你好，这是 Mock。"),
    }),
  );
  await app.prepareChat();
  await app.selectAgent("knowledge");
  await app.sendMessage("knowledge", "探针问题");

  try {
    await page.waitForSelector('[data-testid="message-assistant-text"]', { timeout: 20_000 });
    log("1 MockSSE 助手回复 =", await page.getByTestId("message-assistant-text").last().innerText());
  } catch (error) {
    log("1 MockSSE 失败:", (error as Error).message.split("\n")[0]);
    log("页面文本:", (await page.locator("body").innerText()).slice(0, 600));
  }

  await page.unroute("**/api/chat");
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "服务暂时不可用，请稍后再试。" }),
    }),
  );
  await app.clearChat();
  await page.getByTestId("composer-input-knowledge").fill("触发500");
  await page.getByTestId("send-button-knowledge").click();
  try {
    await page.waitForSelector('[data-testid="chat-error"]', { timeout: 15_000 });
    log("2 500文案 =", await page.getByTestId("chat-error").innerText());
  } catch (error) {
    log("2 未出现 chat-error:", (error as Error).message.split("\n")[0]);
    log("页面文本:", (await page.locator("body").innerText()).slice(0, 800));
  }

  await page.unroute("**/api/chat");
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "未知的角色 ID。" }),
    }),
  );
  await page.getByTestId("composer-input-knowledge").fill("触发400");
  await page.getByTestId("send-button-knowledge").click();
  try {
    await page.waitForSelector('[data-testid="chat-error"]', { timeout: 15_000 });
    log("3 400文案 =", (await page.getByTestId("chat-error").last().innerText()).slice(0, 200));
  } catch (error) {
    log("3 未出现 chat-error:", (error as Error).message.split("\n")[0]);
  }

  await page.unroute("**/api/chat");
  await page.route("**/api/chat", (route) => route.abort("failed"));
  await page.getByTestId("composer-input-knowledge").fill("触发网络错误");
  await page.getByTestId("send-button-knowledge").click();
  try {
    await page.waitForSelector('[data-testid="chat-error"]', { timeout: 15_000 });
    log("4 网络错误文案 =", (await page.getByTestId("chat-error").last().innerText()).slice(0, 200));
  } catch (error) {
    log("4 未出现 chat-error:", (error as Error).message.split("\n")[0]);
  }

  const contact = await page.context().newPage();
  await contact.goto("/contact");
  await contact.getByTestId("contact-message").fill("探针留言");
  await contact.getByTestId("contact-submit").click();
  try {
    await contact.waitForSelector('[data-testid="contact-success"]', { timeout: 8_000 });
    log("5 mailto 成功提示 =", (await contact.getByTestId("contact-success").innerText()).slice(0, 120));
    log("5 mailto 提交后 URL =", contact.url());
  } catch (error) {
    log("5 未出现成功提示:", (error as Error).message.split("\n")[0], "| URL =", contact.url());
    log("页面文本:", (await contact.locator("body").innerText().catch(() => "")).slice(0, 400));
  }

  expect(true).toBe(true);
});
