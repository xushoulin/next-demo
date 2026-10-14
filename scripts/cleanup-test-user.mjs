#!/usr/bin/env node
/**
 * 单独清理自动化测试账号（autotest）及其会话记录。
 * 用例跑完通常已由 global-teardown 自动清理；脚本用于手工兜底。
 *
 * 用法：node scripts/cleanup-test-user.mjs [用户名]
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const username = process.argv[2] ?? process.env.TEST_USERNAME ?? "autotest";

function readEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};
  const result = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    result[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return result;
}

const databaseUrl = process.env.DATABASE_URL ?? readEnvLocal().DATABASE_URL;
if (!databaseUrl) {
  console.log("未配置 DATABASE_URL，无需清理。");
  process.exit(0);
}

const pool = mysql.createPool({ uri: databaseUrl, connectionLimit: 2, charset: "utf8mb4" });
try {
  const [conv] = await pool.execute(
    "DELETE c FROM conversations c JOIN users u ON c.user_id = u.id WHERE u.username = ?",
    [username],
  );
  const [users] = await pool.execute("DELETE FROM users WHERE username = ?", [username]);
  console.log(`已清理账号 ${username}：会话 ${conv.affectedRows} 条 / 用户 ${users.affectedRows} 条`);
} catch (error) {
  console.error("清理失败：", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
