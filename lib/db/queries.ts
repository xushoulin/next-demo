import { ensureSchema, pool } from "./index";
import type { BaziChart } from "@/lib/bazi";
import type { BaziRecord } from "./types";
import type { UIMessage } from "ai";

/** 用户名 → 用户（不存在则创建），返回 id 与 username */
export async function upsertUser(username: string): Promise<{ id: number; username: string }> {
  await ensureSchema();
  // 已存在时 INSERT IGNORE 不会报错；随后 SELECT 取回 id（含已存在用户）。
  await pool.query("INSERT IGNORE INTO users (username) VALUES (?)", [username]);
  const [rows] = await pool.query(
    "SELECT id, username FROM users WHERE username = ?",
    [username],
  );
  return (rows as { id: number; username: string }[])[0];
}

/** 用户名 → 用户 id（不存在返回 null） */
export async function getUserId(username: string): Promise<number | null> {
  await ensureSchema();
  const [rows] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
  return (rows as { id: number }[])[0]?.id ?? null;
}

/** 列出某用户的全部八字排盘记录（按时间倒序） */
export async function listBaziRecords(userId: number): Promise<BaziRecord[]> {
  await ensureSchema();
  const [rows] = await pool.query(
    `SELECT id, year, month, day, hour, chart_json, created_at
       FROM bazi_records
      WHERE user_id = ?
      ORDER BY created_at DESC`,
    [userId],
  );
  return (rows as Array<{
    id: number;
    year: number;
    month: number;
    day: number;
    hour: number;
    chart_json: BaziChart;
    created_at: Date;
  }>).map((row) => ({
    id: row.id,
    year: row.year,
    month: row.month,
    day: row.day,
    hour: row.hour,
    // mysql2 会把 JSON 列自动解析为对象
    chart: row.chart_json as BaziChart,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}

/** 保存一条八字排盘记录 */
export async function saveBaziRecord(
  userId: number,
  input: { year: number; month: number; day: number; hour: number },
  chart: BaziChart,
): Promise<void> {
  await ensureSchema();
  await pool.query(
    `INSERT INTO bazi_records (user_id, year, month, day, hour, chart_json)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, input.year, input.month, input.day, input.hour, JSON.stringify(chart)],
  );
}

/** 读取某用户在某 Agent 下的对话（无则 null） */
export async function getConversation(
  userId: number,
  agentId: string,
): Promise<UIMessage[] | null> {
  await ensureSchema();
  const [rows] = await pool.query(
    `SELECT messages_json FROM conversations WHERE user_id = ? AND agent_id = ?`,
    [userId, agentId],
  );
  if ((rows as unknown[]).length === 0) return null;
  return (rows as { messages_json: UIMessage[] }[])[0].messages_json ?? null;
}

/** 保存（或覆盖）某用户在某 Agent 下的对话 */
export async function saveConversation(
  userId: number,
  agentId: string,
  messages: UIMessage[],
): Promise<void> {
  await ensureSchema();
  const payload = JSON.stringify(messages);
  await pool.query(
    `INSERT INTO conversations (user_id, agent_id, messages_json, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE messages_json = ?, updated_at = CURRENT_TIMESTAMP`,
    [userId, agentId, payload, payload],
  );
}
