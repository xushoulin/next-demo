import { createPool, type Pool } from "mysql2/promise";

/**
 * MySQL 连接池（单例）。
 * 通过 DATABASE_URL 环境变量连接本地数据库，无需额外配置。
 * 开发环境下挂在 globalThis 上，避免 Next.js 热重载反复创建连接池。
 */

const globalForDb = globalThis as unknown as { __mysqlPool?: Pool };

export const pool =
  globalForDb.__mysqlPool ??
  createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mysqlPool = pool;
}

/** 建表语句（幂等，可重复执行） */
const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
     id         INT AUTO_INCREMENT PRIMARY KEY,
     username   VARCHAR(64) NOT NULL UNIQUE,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   )`,

  `CREATE TABLE IF NOT EXISTS bazi_records (
     id         INT AUTO_INCREMENT PRIMARY KEY,
     user_id    INT NOT NULL,
     year       INT NOT NULL,
     month      INT NOT NULL,
     day        INT NOT NULL,
     hour       INT NOT NULL,
     chart_json JSON NOT NULL,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   )`,

  `CREATE TABLE IF NOT EXISTS conversations (
     user_id       INT NOT NULL,
     agent_id      VARCHAR(64) NOT NULL,
     messages_json JSON NOT NULL,
     updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (user_id, agent_id),
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
