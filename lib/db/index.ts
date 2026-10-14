import { Pool } from "pg";

/**
 * PostgreSQL 连接池（单例，Neon）。
 * 通过 DATABASE_URL 环境变量连接数据库，无需额外配置。
 * 开发环境下挂在 globalThis 上，避免 Next.js 热重载反复创建连接池。
 */

const globalForDb = globalThis as unknown as { __pgPool?: Pool };

export const pool =
  globalForDb.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgPool = pool;
}

/** 建表语句（幂等，可重复执行） */
const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
     id         SERIAL PRIMARY KEY,
     username   VARCHAR(64) NOT NULL UNIQUE,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   )`,

  `CREATE TABLE IF NOT EXISTS conversations (
     user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     agent_id      VARCHAR(64) NOT NULL,
     messages_json JSONB NOT NULL,
     updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (user_id, agent_id)
   )`,
];

let schemaReady: Promise<void> | null = null;

/** 首次访问数据库时确保表已存在（自建库后即开即用） */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      for (const sql of SCHEMA_STATEMENTS) {
        await pool.query(sql);
      }
    })()
      .then(() => undefined)
      .catch((error) => {
        // 失败后将 Promise 置空，便于下次重试而非永久缓存错误
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}
