import { expect, TEST_USER, test } from "../support/app";

/**
 * 登录模块
 *
 * 业务事实（来自源码，非臆造）：
 * - 无注册、无密码，输入用户名即登录（POST /api/auth/login）
 * - 用户名规则：不能为空、trim 后长度 ≤ 32（服务端二次校验）
 * - 输入框有 maxLength=32，前端先行截断
 * - 登录态为 HMAC 签名的 Cookie（yanzhi_user），有效期 30 天
 */
test.describe("登录", () => {
  test("正常登录：输入用户名后进入主界面并显示用户名", async ({ app, page }) => {
    // 前置：未登录状态访问 /chat
    // 步骤：输入 autotest → 点击「进入」
    // 预期：进入主界面，右上角展示用户名，URL 仍为 /chat
    await app.openLogin();
    await app.fillLogin(TEST_USER);
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("chat-app"), "登录后应进入主界面").toBeVisible({
      timeout: 15_000,
    });
    await expect(app.userBadge, "右上角应展示登录用户名").toContainText(TEST_USER);
    expect(new URL(page.url()).pathname, "登录后停留 /chat").toBe("/chat");
  });

  test("异常：用户名为空时提交，提示「请输入用户名」且不跳转", async ({ app, page }) => {
    // 前置：登录页，输入框为空
    // 步骤：直接点击「进入」
    // 预期：出现 role=alert 的错误提示，仍停留在登录页
    await app.openLogin();
    await page.getByTestId("login-submit").click();

    await expect(
      page.getByTestId("login-error"),
      "空用户名提交应提示「请输入用户名」",
    ).toHaveText("请输入用户名");
    await expect(page.getByTestId("login-screen"), "不应跳转到主界面").toBeVisible();
  });

  test("异常：用户名仅含空格，trim 后判空并提示", async ({ app, page }) => {
    // 前置：登录页
    // 步骤：输入 3 个空格 → 提交
    // 预期：提示「请输入用户名」（空格被 trim）
    await app.openLogin();
    await app.fillLogin("   ");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error"), "纯空格应被判空").toHaveText(
      "请输入用户名",
    );
  });

  test("边界：用户名含首尾空格时被 trim，登录成功", async ({ app, page }) => {
    // 前置：登录页
    // 步骤：输入 "  autotest  " → 提交
    // 预期：登录成功，展示的用户名不带空格
    await app.openLogin();
    await app.fillLogin(`  ${TEST_USER}  `);
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("chat-app"), "trim 后应登录成功").toBeVisible({
      timeout: 15_000,
    });
    await expect(app.userBadge, "用户名不应包含首尾空格").toContainText(TEST_USER);
  });

  test("边界：用户名正好 32 个字符可登录成功", async ({ app, page }) => {
    // 前置：登录页
    // 步骤：输入 32 字符用户名 → 提交
    // 预期：登录成功（服务端上限为 32）
    const name32 = "a".repeat(32);
    await app.openLogin();
    await app.fillLogin(name32);
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("chat-app"), "32 字符用户名应登录成功").toBeVisible({
      timeout: 15_000,
    });
  });

  test("异常：输入框 maxLength 生效，超长输入被前端截断到 32 字符", async ({ app, page }) => {
    // 前置：登录页
    // 步骤：尝试填入 40 字符
    // 预期：实际值长度被限制为 32（前端第一道防线）
    await app.openLogin();
    const input = page.getByTestId("login-username");
    await input.fill("b".repeat(40));

    await expect(input, "maxLength 应将输入截断到 32 字符").toHaveValue("b".repeat(32));
  });

  test("异常：服务端返回 400（超长用户名）时展示服务端文案", async ({ app, page }) => {
    // 前置：登录页
    // 步骤：拦截 /api/auth/login 返回 400 → 提交
    // 预期：展示服务端错误「用户名长度不能超过 32 个字符。」
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "用户名长度不能超过 32 个字符。" }),
      }),
    );

    await app.openLogin();
    await app.fillLogin("c".repeat(33));
    await page.getByTestId("login-submit").click();

    await expect(
      page.getByTestId("login-error"),
      "应展示服务端返回的 400 文案",
    ).toContainText("用户名长度不能超过 32 个字符。");
  });

  test("异常：登录接口 500 时展示「登录态设置失败」", async ({ app, page }) => {
    // 前置：登录页
    // 步骤：拦截 /api/auth/login 返回 500（服务端 Cookie 写入失败场景）→ 提交
    // 预期：展示「登录态设置失败，请稍后再试。」且不进入主界面
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "登录态设置失败，请稍后再试。" }),
      }),
    );

    await app.openLogin();
    await app.fillLogin(TEST_USER);
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error"), "应展示 500 对应文案").toContainText(
      "登录态设置失败，请稍后再试。",
    );
    await expect(page.getByTestId("login-screen"), "不应进入主界面").toBeVisible();
  });

  test("异常：登录请求网络中断时提示「网络错误，请确认服务已启动」", async ({ app, page }) => {
    // 前置：登录页
    // 步骤：拦截 /api/auth/login 并中断连接 → 提交
    // 预期：展示网络错误提示
    await page.route("**/api/auth/login", (route) => route.abort("failed"));

    await app.openLogin();
    await app.fillLogin(TEST_USER);
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error"), "应提示网络错误").toContainText(
      "网络错误，请确认服务已启动",
    );
  });

  test("登录态保持：刷新页面后仍处于登录状态", async ({ app, page }) => {
    // 前置：已登录
    // 步骤：刷新页面
    // 预期：不回到登录页，主界面仍然可见（Cookie 生效）
    await app.login();
    await page.reload();

    await expect(page.getByTestId("chat-app"), "刷新后应保持登录").toBeVisible({
      timeout: 15_000,
    });
    await expect(app.userBadge, "刷新后用户名仍应展示").toContainText(TEST_USER);
  });

  test("退出登录：回到登录页且服务端登录态被清除", async ({ app, page }) => {
    // 前置：已登录
    // 步骤：点击「退出」
    // 预期：回到登录页；再次查询 /api/auth/me 返回 username=null
    await app.login();
    await app.logout();

    const me = await page.request.get("/api/auth/me");
    expect(me.status(), "/api/auth/me 应正常响应").toBe(200);
    expect((await me.json()).username, "退出后服务端不应再返回用户名").toBeNull();
  });

  test("未登录访问 /chat 时展示登录页而非主界面", async ({ page }) => {
    // 前置：全新上下文，无 Cookie
    // 步骤：直接访问 /chat
    // 预期：渲染登录页
    await page.goto("/chat");
    await expect(page.getByTestId("login-screen"), "未登录应看到登录页").toBeVisible();
    await expect(page.getByTestId("chat-app"), "不应渲染主界面").toBeHidden();
  });
});
