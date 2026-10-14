import { expect, test } from "../support/app";

/**
 * 导航与跳转
 *
 * 业务事实（来自 SiteHeader / SiteFooter / not-found 源码）：
 * - 顶部导航：/（首页）、/guides（服务指南）、/about（关于我们）、/contact（联系我们）
 * - CTA「开始使用」跳转 /chat
 * - 页脚「隐私政策」跳转 /privacy
 * - 未知路径渲染 not-found，文案「这一页暂时寻不到踪迹」
 */
test.describe("导航与跳转", () => {
  test("首页可访问且标题正确", async ({ page }) => {
    // 前置：无
    // 步骤：访问 /
    // 预期：标题为「首页 · 尚美智宿」，顶部导航可见
    await page.goto("/");
    await expect(page, "首页标题应正确").toHaveTitle(/首页 · 尚美智宿/);
    await expect(page.getByTestId("cta-start"), "首页应有「开始使用」按钮").toBeVisible();
  });

  test("顶部 CTA「开始使用」跳转到 /chat", async ({ page }) => {
    // 前置：首页
    // 步骤：点击「开始使用」
    // 预期：URL 变为 /chat，并展示登录页（未登录）
    await page.goto("/");
    await page.getByTestId("cta-start").click();

    await expect(page, "应跳转到 /chat").toHaveURL(/\/chat$/);
    await expect(page.getByTestId("login-screen"), "未登录时应展示登录页").toBeVisible();
  });

  test("顶部导航「服务指南」跳转到 /guides", async ({ page }) => {
    // 前置：首页
    // 步骤：点击导航「服务指南」
    // 预期：URL 变为 /guides，页面含「服务指南」标题
    await page.goto("/");
    await page.getByTestId("nav-link-/guides").click();

    await expect(page, "应跳转到 /guides").toHaveURL(/\/guides$/);
    await expect(page.getByRole("heading", { name: "服务指南" }), "应展示服务指南").toBeVisible();
  });

  test("顶部导航「关于我们」跳转到 /about", async ({ page }) => {
    // 前置：首页
    // 步骤：点击「关于我们」
    // 预期：URL 变为 /about
    await page.goto("/");
    await page.getByTestId("nav-link-/about").click();

    await expect(page, "应跳转到 /about").toHaveURL(/\/about$/);
  });

  test("顶部导航「联系我们」跳转到 /contact 并展示表单", async ({ page }) => {
    // 前置：首页
    // 步骤：点击「联系我们」
    // 预期：URL 变为 /contact，联系表单可见
    await page.goto("/");
    await page.getByTestId("nav-link-/contact").click();

    await expect(page, "应跳转到 /contact").toHaveURL(/\/contact$/);
    await expect(page.getByTestId("contact-form"), "应展示联系表单").toBeVisible();
  });

  test("页脚「隐私政策」跳转到 /privacy", async ({ page }) => {
    // 前置：首页
    // 步骤：点击页脚「隐私政策」
    // 预期：URL 变为 /privacy
    await page.goto("/");
    await page.getByRole("link", { name: "隐私政策" }).click();

    await expect(page, "应跳转到 /privacy").toHaveURL(/\/privacy$/);
  });

  test("服务指南列表可进入详情页", async ({ page }) => {
    // 前置：/guides
    // 步骤：点击第一篇指南卡片
    // 预期：URL 变为 /guides/<slug>，且详情页标题与列表标题一致
    await page.goto("/guides");
    const first = page.locator('a[href^="/guides/"]').first();
    const title = (await first.innerText()).trim();
    const href = await first.getAttribute("href");
    await first.click();

    await expect(page, `应进入详情页 ${href}`).toHaveURL(new RegExp(`${href}$`));
    await expect(
      page.getByRole("heading", { name: title, level: 1 }),
      "详情页应展示该指南标题",
    ).toBeVisible();
  });

  test("访问不存在的路径展示 404 页并可返回首页", async ({ page }) => {
    // 前置：无
    // 步骤：访问 /this-page-does-not-exist
    // 预期：展示「这一页暂时寻不到踪迹」，点击「返回首页」回到 /
    await page.goto("/this-page-does-not-exist");
    await expect(
      page.getByRole("heading", { name: "这一页暂时寻不到踪迹" }),
      "应展示 404 文案",
    ).toBeVisible();

    await page.getByRole("link", { name: "返回首页" }).click();
    await expect(page, "应回到首页").toHaveURL(/\/$/);
  });

  test("窄屏下汉堡菜单可展开并完成跳转", async ({ page }) => {
    // 前置：视口 375×812（移动端）
    // 步骤：点击汉堡按钮 → 点击移动导航中的「开始使用」
    // 预期：跳转 /chat
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await page.getByRole("button", { name: "展开菜单" }).click();
    const mobileCta = page.getByTestId("mobile-cta-start");
    await expect(mobileCta, "窄屏应展开移动导航").toBeVisible();
    await mobileCta.click();

    await expect(page, "移动导航应能跳转 /chat").toHaveURL(/\/chat$/);
  });
});
