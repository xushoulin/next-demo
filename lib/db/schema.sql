-- 尚美智宿 AI 助手 数据库表结构（参考用，PostgreSQL 语法）
-- 应用启动后会在首次访问数据库时自动按 lib/db/index.ts 中的语句建表（幂等），
-- 并在 room_types 为空时写入示例房型；本文件仅作结构说明与手动初始化参考。

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id      VARCHAR(64) NOT NULL,          -- concierge / booking / member
  messages_json JSONB NOT NULL,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, agent_id)
);

-- ========== 酒店业务表 ==========

CREATE TABLE IF NOT EXISTS room_types (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(128) NOT NULL,
  bed_type    VARCHAR(64) NOT NULL,
  size_sqm    INTEGER,
  base_price  NUMERIC(10,2) NOT NULL DEFAULT 0,   -- 基准价（元/晚），展示用
  amenities   JSONB NOT NULL DEFAULT '[]'::jsonb,  -- 设施清单
  description TEXT,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS rooms (
  id           SERIAL PRIMARY KEY,
  room_type_id INTEGER NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  room_no      VARCHAR(32) NOT NULL UNIQUE,
  floor        INTEGER,
  status       VARCHAR(32) NOT NULL DEFAULT 'available'  -- available / occupied / maintenance
);

CREATE TABLE IF NOT EXISTS bookings (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_type_id   INTEGER NOT NULL REFERENCES room_types(id),
  guest_name     VARCHAR(64) NOT NULL,
  guest_phone    VARCHAR(32) NOT NULL,
  check_in_date  DATE NOT NULL,
  check_out_date DATE NOT NULL,
  status         VARCHAR(32) NOT NULL DEFAULT 'pending',   -- pending / confirmed / checked_in / cancelled
  total_price    NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  user_id   INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone     VARCHAR(32),
  level     VARCHAR(32) NOT NULL DEFAULT '标准会员',
  points    INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
