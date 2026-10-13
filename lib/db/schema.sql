-- 砚知 AI 数据库表结构（参考用，MySQL 语法）
-- 应用启动后会在首次访问数据库时自动按下列语句建表（幂等），
-- 因此正常情况下无需手动执行本文件；此处仅作结构说明与手动初始化参考。

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(64) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  user_id       INT NOT NULL,
  agent_id      VARCHAR(64) NOT NULL,
  messages_json JSON NOT NULL,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, agent_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
