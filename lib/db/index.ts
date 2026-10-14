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

  `CREATE TABLE IF NOT EXISTS room_types (
     id          SERIAL PRIMARY KEY,
     name        VARCHAR(128) NOT NULL,
     bed_type    VARCHAR(64) NOT NULL,
     size_sqm    INTEGER,
     base_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
     amenities   JSONB NOT NULL DEFAULT '[]'::jsonb,
     description TEXT,
     image_url   TEXT,
     is_active   BOOLEAN NOT NULL DEFAULT TRUE
   )`,

  `CREATE TABLE IF NOT EXISTS rooms (
     id           SERIAL PRIMARY KEY,
     room_type_id INTEGER NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
     room_no      VARCHAR(32) NOT NULL UNIQUE,
     floor        INTEGER,
     status       VARCHAR(32) NOT NULL DEFAULT 'available'
   )`,

  `CREATE TABLE IF NOT EXISTS bookings (
     id             SERIAL PRIMARY KEY,
     user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     room_type_id   INTEGER NOT NULL REFERENCES room_types(id),
     guest_name     VARCHAR(64) NOT NULL,
     guest_phone    VARCHAR(32) NOT NULL,
     check_in_date  DATE NOT NULL,
     check_out_date DATE NOT NULL,
     status         VARCHAR(32) NOT NULL DEFAULT 'pending',
     total_price    NUMERIC(10,2) NOT NULL DEFAULT 0,
     created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   )`,

  `CREATE TABLE IF NOT EXISTS members (
     user_id   INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
     phone     VARCHAR(32),
     level     VARCHAR(32) NOT NULL DEFAULT '标准会员',
     points    INTEGER NOT NULL DEFAULT 0,
     joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   )`,
];

/** 示例房型种子数据（仅在 room_types 为空时插入，便于本地/演示环境即开即用） */
const SEED_ROOM_TYPES = [
  {
    name: "高级大床房",
    bed_type: "1.8m 大床",
    size_sqm: 32,
    base_price: 388,
    amenities: JSON.stringify(["免费 Wi-Fi", "智能马桶", "咖啡机", "隔音窗"]),
    description: "位于高楼层，配 1.8 米大床与独立淋浴间，适合商务与情侣出行。",
  },
  {
    name: "豪华双床房",
    bed_type: "1.2m 双床",
    size_sqm: 36,
    base_price: 428,
    amenities: JSON.stringify(["免费 Wi-Fi", "迷你吧", "加湿器", "儿童备品"]),
    description: "两张 1.2 米单人床，可加婴儿床，适合家庭与朋友同行。",
  },
  {
    name: "景观套房",
    bed_type: "2.0m 大床",
    size_sqm: 55,
    base_price: 788,
    amenities: JSON.stringify(["免费 Wi-Fi", "城市景观落地窗", "浴缸", "客厅区"]),
    description: "独立客厅与全景落地窗，高楼层城市景观，适合度假与接待。",
  },
  {
    name: "亲子主题房",
    bed_type: "1.8m 大床 + 儿童床",
    size_sqm: 40,
    base_price: 508,
    amenities: JSON.stringify(["免费 Wi-Fi", "儿童帐篷", "玩具角", "儿童洗漱包"]),
    description: "亲子主题布置，含儿童床与玩具角，家庭出游首选。",
  },
];

async function seedRoomTypes(): Promise<void> {
  const { rows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM room_types",
  );
  if (Number(rows[0]?.count ?? "0") > 0) return;
  for (const room of SEED_ROOM_TYPES) {
    await pool.query(
      `INSERT INTO room_types (name, bed_type, size_sqm, base_price, amenities, description)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
      [room.name, room.bed_type, room.size_sqm, room.base_price, room.amenities, room.description],
    );
  }
}

let schemaReady: Promise<void> | null = null;

/** 首次访问数据库时确保表已存在（自建库后即开即用） */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      for (const sql of SCHEMA_STATEMENTS) {
        await pool.query(sql);
      }
      await seedRoomTypes();
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
