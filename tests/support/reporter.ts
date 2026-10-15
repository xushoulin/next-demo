import fs from "node:fs";
import path from "node:path";
import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

type Row = {
  title: string;
  filePath: string;
  line: number;
  status: TestResult["status"];
  duration: number;
  retry: number;
  error?: string;
  failedStep?: string;
  attachments: string[];
};

const OUTPUT_DIR = path.join(process.cwd(), "test-results");

/** 根据错误信息给出可执行的修复建议（避免只抛错不给方向） */
function suggestFix(error: string, title: string): string {
  const text = `${error}\n${title}`;

  if (text.includes("net::ERR_CONNECTION_REFUSED") || text.includes("ECONNREFUSED")) {
    return "开发服务器未启动：在项目根目录执行 `npm run dev`，确认 http://localhost:3000 可访问后再跑测试。";
  }
  if (text.includes("Timed out") && text.includes("waiting for")) {
    return "元素在超时时间内未出现：确认对应 data-testid 仍在源码中（grep data-testid），或是否依赖了后端/大模型响应（对话类用例默认走 Mock，需确认 mockChat 已生效）。";
  }
  if (text.includes("to contain text") || text.includes("toHaveText")) {
    return "页面文案与预期不符：多为产品文案调整。确认是断言过期（更新用例预期）还是真实缺陷（修页面）。";
  }
  if (text.includes("401") || text.includes("请先登录")) {
    return "登录态缺失或已失效：检查 /api/auth/login 是否正确写入 yanzhi_user Cookie，以及测试开始前是否有清理操作清掉了 Cookie。";
  }
  if (text.includes("400")) {
    return "请求参数被服务端拒绝：核对接口契约（用户名长度 ≤32、agentId 必须是 knowledge/writing/study 之一）。";
  }
  if (text.includes("500") || text.includes("服务未配置")) {
    return "服务端异常：查看 `npm run dev` 终端日志；若为 DASHSCOPE 相关，确认 .env.local 中的 DASHSCOPE_API_KEY 是否有效。";
  }
  if (text.includes("数据库") || text.includes("保存失败")) {
    return "PostgreSQL（Neon）不可用：确认 .env.local 的 DATABASE_URL 正确、Neon 项目未暂停；数据库不可用时应用会降级本地模式，持久化类断言会失败。";
  }
  return "查看附件中的失败截图与「失败现场」JSON（含 URL、控制台错误、页面文本）定位具体步骤。";
}

class MarkdownReporter implements Reporter {
  private rows: Row[] = [];
  private startedAt = Date.now();

  onBegin(_config: FullConfig): void {
    this.rows = [];
    this.startedAt = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const raw = result.error?.message ?? "";
    const firstLine = raw.split("\n").find((line) => line.trim().length > 0) ?? "";

    this.rows.push({
      title: test.title,
      filePath: path.relative(process.cwd(), test.location.file),
      line: test.location.line,
      status: result.status,
      duration: result.duration,
      retry: result.retry,
      error: raw || undefined,
      failedStep: result.steps.find((step) => step.error)?.title ?? firstLine,
      attachments: result.attachments.map((a) => a.path ?? a.name).filter(Boolean) as string[],
    });
  }

  onEnd(fullResult: FullResult): void {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const passed = this.rows.filter((r) => r.status === "passed");
    const failed = this.rows.filter((r) => r.status === "failed");
    const skipped = this.rows.filter((r) => r.status === "skipped");
    const total = this.rows.length;
    const rate = total === 0 ? 0 : Math.round((passed.length / total) * 100);
    const seconds = ((Date.now() - this.startedAt) / 1000).toFixed(1);

    const lines: string[] = [];
    lines.push("# 砚知 AI 浏览器自动化测试报告");
    lines.push("");
    lines.push(`- 运行时间：${new Date().toLocaleString("zh-CN", { hour12: false })}`);
    lines.push(`- 总耗时：${seconds}s`);
    lines.push(`- 目标站点：${process.env.BASE_URL ?? "http://localhost:3000"}`);
    lines.push(`- 测试账号：${process.env.TEST_USERNAME ?? "autotest"}（免密用户名登录）`);
    lines.push(
      `- 结果：**${passed.length} 通过 / ${failed.length} 失败 / ${skipped.length} 跳过**，通过率 ${rate}%`,
    );
    lines.push(`- 整体状态：${fullResult.status}`);
    lines.push("");

    if (failed.length > 0) {
      lines.push("## 失败用例");
      lines.push("");
      lines.push("| 用例 | 位置 | 失败步骤 | 修复建议 |");
      lines.push("| --- | --- | --- | --- |");
      for (const row of failed) {
        lines.push(
          `| ${row.title} | \`${row.filePath}:${row.line}\` | ${(row.failedStep ?? "-").slice(0, 60)} | ${suggestFix(row.error ?? "", row.title)} |`,
        );
      }
      lines.push("");

      for (const row of failed) {
        lines.push(`### ${row.title}`);
        lines.push("");
        lines.push(`- 位置：\`${row.filePath}:${row.line}\``);
        lines.push(`- 重试次数：${row.retry}`);
        if (row.failedStep) lines.push(`- 失败步骤：${row.failedStep}`);
        if (row.attachments.length > 0) {
          lines.push(
            `- 证据：${row.attachments.map((a) => `\`${path.relative(process.cwd(), a)}\``).join("、")}`,
          );
        }
        lines.push("");
        lines.push("```");
        lines.push((row.error ?? "(无错误信息)").split("\n").slice(0, 25).join("\n"));
        lines.push("```");
        lines.push("");
        lines.push(`**修复建议**：${suggestFix(row.error ?? "", row.title)}`);
        lines.push("");
      }
    }

    lines.push("## 全部用例");
    lines.push("");
    lines.push("| 状态 | 用例 | 位置 | 耗时 |");
    lines.push("| --- | --- | --- | --- |");
    const icon: Record<string, string> = { passed: "通过", failed: "失败", skipped: "跳过" };
    for (const row of this.rows) {
      lines.push(
        `| ${icon[row.status] ?? row.status} | ${row.title} | \`${row.filePath}:${row.line}\` | ${(row.duration / 1000).toFixed(1)}s |`,
      );
    }
    lines.push("");

    const file = path.join(OUTPUT_DIR, "report.md");
    fs.writeFileSync(file, lines.join("\n"), "utf8");
    console.log(`\n测试报告已生成：${file}`);
  }
}

export default MarkdownReporter;
