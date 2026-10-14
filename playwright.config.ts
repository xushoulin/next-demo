import { defineConfig, devices } from "@playwright/test";

/**
 * 砚知 AI · 浏览器自动化回归测试配置
 *
 * 设计原则：
 * - 用例彼此独立：每个用例自己完成「登录 → 操作 → 断言 → 清理」闭环，可单独重跑
 * - 串行执行（workers=1）：全部用例共用固定测试账号 autotest 与同一数据库，
 *   并行会让会话持久化类断言互相污染
 * - 失败留证：截图 + 录屏 + trace + 关键页面文本全部落盘，便于定位
 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  // 固定账号 + 共享数据库，串行最稳
  fullyParallel: false,
  workers: 1,
  retries: CI ? 2 : 1,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  outputDir: "./test-results/raw",

  reporter: [
    ["list"],
    ["html", { outputFolder: "./test-results/html", open: "never" }],
    ["json", { outputFile: "./test-results/result.json" }],
    ["./tests/support/reporter.ts"],
  ],

  use: {
    baseURL: BASE_URL,
    // 失败时自动截图，成功不留文件
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
    testIdAttribute: "data-testid",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],

  globalSetup: "./tests/support/global-setup.ts",
  globalTeardown: "./tests/support/global-teardown.ts",

  // 服务已在跑时直接复用；没跑则自动拉起 dev server
  // 注意：命令前置 `NODE_OPTIONS=` 是为了清空宿主环境注入的 Node 参数，
  // 否则某些文件代理层会让 Next 无法写入构建目录。正常终端里跑测试时不受影响。
  webServer: {
    command: "NODE_OPTIONS= npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
