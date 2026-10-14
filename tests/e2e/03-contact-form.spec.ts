import { expect, test } from "../support/app";

/**
 * 联系我们表单
 *
 * 业务事实（来自 ContactForm 源码）：
 * - 字段：称呼 #name（非必填）、邮箱 #email（type=email，非必填）、想说的话 #message（required）
 * - 提交行为：非真实接口，而是拼接 mailto: 链接跳转，并把 sent 置为 true
 * - 成功提示：「已为你打开邮件客户端，若未自动弹出，请直接发送至 support@yourdomain.com。」
 * - 校验：message 为空时受 HTML5 required 约束；邮箱格式非法时受 type=email 约束
 */
test.describe("联系我们表单", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByTestId("contact-form"), "表单应已渲染").toBeVisible();
  });

  test("正常提交：填全三项后展示成功提示", async ({ page }) => {
    // 前置：/contact 表单页
    // 步骤：填写称呼/邮箱/留言 → 点击「通过邮件发送」
    // 预期：出现成功提示，且提示中包含收件邮箱
    await page.getByTestId("contact-name").fill("自动化测试");
    await page.getByTestId("contact-email").fill("tester@example.com");
    await page.getByTestId("contact-message").fill("这是一条来自自动化测试的留言。");
    await page.getByTestId("contact-submit").click();

    await expect(
      page.getByTestId("contact-success"),
      "提交后应展示成功提示",
    ).toContainText("已为你打开邮件客户端");
    await expect(
      page.getByTestId("contact-success"),
      "提示中应包含收件邮箱",
    ).toContainText("support@yourdomain.com");
  });

  test("异常：留言为空时提交被 HTML5 required 拦截", async ({ page }) => {
    // 前置：/contact 表单页，message 留空
    // 步骤：填写称呼与邮箱，留言留空 → 点击提交
    // 预期：不出现成功提示，留言字段存在 valueMissing 校验失败
    await page.getByTestId("contact-name").fill("自动化测试");
    await page.getByTestId("contact-email").fill("tester@example.com");
    await page.getByTestId("contact-message").fill("");
    await page.getByTestId("contact-submit").click();

    await expect(page.getByTestId("contact-success"), "空留言不应提交成功").toHaveCount(0);

    const invalid = await page
      .getByTestId("contact-message")
      .evaluate((el: HTMLTextAreaElement) => ({
        valueMissing: el.validity.valueMissing,
        message: el.validationMessage,
      }));
    expect(invalid.valueMissing, "留言字段应触发 required 校验").toBe(true);
  });

  test("异常：邮箱格式非法时提交被拦截", async ({ page }) => {
    // 前置：/contact 表单页
    // 步骤：邮箱填 "not-an-email" → 点击提交
    // 预期：不出现成功提示，邮箱字段触发 typeMismatch 校验
    await page.getByTestId("contact-name").fill("自动化测试");
    await page.getByTestId("contact-email").fill("not-an-email");
    await page.getByTestId("contact-message").fill("留言内容");
    await page.getByTestId("contact-submit").click();

    await expect(page.getByTestId("contact-success"), "非法邮箱不应提交成功").toHaveCount(0);

    const invalid = await page
      .getByTestId("contact-email")
      .evaluate((el: HTMLInputElement) => ({
        typeMismatch: el.validity.typeMismatch,
        message: el.validationMessage,
      }));
    expect(invalid.typeMismatch, "邮箱字段应触发格式校验").toBe(true);
  });

  test("边界：称呼与邮箱可留空，仅填留言即可提交", async ({ page }) => {
    // 前置：/contact 表单页
    // 步骤：只填写留言 → 点击提交
    // 预期：提交成功（称呼/邮箱为非必填项）
    await page.getByTestId("contact-message").fill("只填留言也应能提交");
    await page.getByTestId("contact-submit").click();

    await expect(
      page.getByTestId("contact-success"),
      "仅填留言应允许提交",
    ).toContainText("已为你打开邮件客户端");
  });

  test("超长留言可正常提交（无长度限制）", async ({ page }) => {
    // 前置：/contact 表单页
    // 步骤：填写 2000 字留言 → 提交
    // 预期：提交成功（源码未对留言长度做限制）
    await page.getByTestId("contact-message").fill("长".repeat(2000));
    await page.getByTestId("contact-submit").click();

    await expect(
      page.getByTestId("contact-success"),
      "超长留言不应被前端拦截",
    ).toBeVisible();
  });
});
