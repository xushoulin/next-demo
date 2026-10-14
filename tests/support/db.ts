import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { TEST_USER } from "./app";

/** 极简 .env.local 解析（避免为测试额外引入 dotenv 依赖） */
function readEnvLocal(): Record<string, string> {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};
  const result: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    result[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return result;
}

export type CleanupResult =
  | { skipped: true; reason: string }
  | { skipped: false; conversations: number; users: number };

/**
 * 删除固定测试账号及其会话记录。
 * 数据库不可用时静默跳过，不阻塞测试执行。
 */
export async function cleanupTestUser(username: string = TEST_USER): Promise<CleanupResult> {
  const databaseUrl = process.env.DATABASE_URL ?? readEnvLocal().DATABASE_URL;
  if (!databaseUrl) {
    return { skipped: true, reason: "未配置 DATABASE_URL，跳过数据库清理" };
  }

  let pool: pg.Pool | undefined;
  try {
    pool = new pg.Pool({ connectionString: databaseUrl, max: 2 });

    const conv = await pool.query(
      "DELETE FROM conversations WHERE user_id = (SELECT id FROM users WHERE username = $1)",
      [username],
    );
    const users = await pool.query("DELETE FROM users WHERE username = $1", [username]);

    return { skipped: false, conversations: conv.rowCount ?? 0, users: users.rowCount ?? 0 };
  } catch (error) {
    return {
      skipped: true,
      reason: `数据库连接失败，跳过清理：${(error as Error).message}`,
    };
  } finally {
    await pool?.end().catch(() => undefined);
  }
}

/** 读取测试账号在库中的会话条数，用于验证持久化 */
export async function countConversations(username: string = TEST_USER): Promise<number | null> {
  const databaseUrl = process.env.DATABASE_URL ?? readEnvLocal().DATABASE_URL;
  if (!databaseUrl) return null;

  let pool: pg.Pool | undefined;
  try {
    pool = new pg.Pool({ connectionString: databaseUrl, max: 2 });
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS total FROM conversations c JOIN users u ON c.user_id = u.id WHERE u.username = $1",
      [username],
    );
    return Number(rows[0]?.total ?? 0);
  } catch {
    return null;
  } finally {
    await pool?.end().catch(() => undefined);
  }
}
