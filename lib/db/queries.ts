import { ensureSchema, pool } from "./index";
import type { UIMessage } from "ai";

/** 用户名 → 用户（不存在则创建），返回 id 与 username */
export async function upsertUser(username: string): Promise<{ id: number; username: string }> {
  await ensureSchema();
  // 已存在时 ON CONFLICT DO NOTHING 不会报错；随后 SELECT 取回 id（含已存在用户）。
  await pool.query(
    "INSERT INTO users (username) VALUES ($1) ON CONFLICT (username) DO NOTHING",
    [username],
  );
  const { rows } = await pool.query(
    "SELECT id, username FROM users WHERE username = $1",
    [username],
  );
  return rows[0] as { id: number; username: string };
}

/** 用户名 → 用户 id（不存在返回 null） */
export async function getUserId(username: string): Promise<number | null> {
  await ensureSchema();
  const { rows } = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
  return (rows as { id: number }[])[0]?.id ?? null;
}

/** 读取某用户在某 Agent 下的对话（无则 null） */
export async function getConversation(
  userId: number,
  agentId: string,
): Promise<UIMessage[] | null> {
  await ensureSchema();
  const { rows } = await pool.query(
    `SELECT messages_json FROM conversations WHERE user_id = $1 AND agent_id = $2`,
    [userId, agentId],
  );
  if (rows.length === 0) return null;
  // JSONB 列由 pg 驱动自动反序列化为 JS 数组
  return (rows[0] as { messages_json: UIMessage[] }).messages_json ?? null;
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
     VALUES ($1, $2, $3::jsonb, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, agent_id)
     DO UPDATE SET messages_json = $3::jsonb, updated_at = CURRENT_TIMESTAMP`,
    [userId, agentId, payload],
  );
}

/* ==================== 酒店业务查询 ==================== */

/** 房型（对外展示字段，价格单位：元） */
export type RoomType = {
  id: number;
  name: string;
  bedType: string;
  sizeSqm: number | null;
  basePrice: number;
  amenities: string[];
  description: string | null;
};

function mapRoomType(row: Record<string, unknown>): RoomType {
  return {
    id: row.id as number,
    name: row.name as string,
    bedType: row.bed_type as string,
    sizeSqm: (row.size_sqm as number | null) ?? null,
    basePrice: Number(row.base_price ?? 0),
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
    description: (row.description as string | null) ?? null,
  };
}

/** 在售房型列表 */
export async function listRoomTypes(): Promise<RoomType[]> {
  await ensureSchema();
  const { rows } = await pool.query(
    "SELECT * FROM room_types WHERE is_active = TRUE ORDER BY base_price ASC",
  );
  return rows.map(mapRoomType);
}

/** 单个房型详情 */
export async function getRoomType(id: number): Promise<RoomType | null> {
  await ensureSchema();
  const { rows } = await pool.query(
    "SELECT * FROM room_types WHERE id = $1 AND is_active = TRUE",
    [id],
  );
  return rows[0] ? mapRoomType(rows[0]) : null;
}

/** 用户预订记录 */
export type Booking = {
  id: number;
  roomTypeName: string;
  guestName: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

export async function listBookingsByUser(userId: number): Promise<Booking[]> {
  await ensureSchema();
  const { rows } = await pool.query(
    `SELECT b.id, rt.name AS room_type_name, b.guest_name, b.guest_phone,
            b.check_in_date::text AS check_in_date, b.check_out_date::text AS check_out_date,
            b.status, b.total_price, b.created_at
     FROM bookings b JOIN room_types rt ON rt.id = b.room_type_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId],
  );
  return rows.map((row) => ({
    id: row.id as number,
    roomTypeName: row.room_type_name as string,
    guestName: row.guest_name as string,
    guestPhone: row.guest_phone as string,
    checkInDate: row.check_in_date as string,
    checkOutDate: row.check_out_date as string,
    status: row.status as string,
    totalPrice: Number(row.total_price ?? 0),
    createdAt: new Date(row.created_at as string).toISOString(),
  }));
}

/** 创建预订（状态默认 pending，价格由服务端按房型基准价计算，禁止前端传价） */
export async function createBooking(input: {
  userId: number;
  roomTypeId: number;
  guestName: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
}): Promise<Booking | null> {
  await ensureSchema();
  const roomType = await getRoomType(input.roomTypeId);
  if (!roomType) return null;

  const nights = Math.max(
    1,
    Math.round(
      (new Date(input.checkOutDate).getTime() - new Date(input.checkInDate).getTime()) / 86400000,
    ),
  );
  const totalPrice = roomType.basePrice * nights;

  const { rows } = await pool.query(
    `INSERT INTO bookings (user_id, room_type_id, guest_name, guest_phone, check_in_date, check_out_date, total_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [input.userId, input.roomTypeId, input.guestName, input.guestPhone, input.checkInDate, input.checkOutDate, totalPrice],
  );
  const bookings = await listBookingsByUser(input.userId);
  return bookings.find((b) => b.id === rows[0].id) ?? null;
}

/** 会员信息（不存在时自动创建默认标准会员档案） */
export type Member = {
  username: string;
  phone: string | null;
  level: string;
  points: number;
  joinedAt: string;
};

export async function getOrCreateMember(username: string): Promise<Member> {
  await ensureSchema();
  const userId = await getUserId(username);
  if (!userId) throw new Error("用户不存在");

  await pool.query(
    "INSERT INTO members (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
    [userId],
  );
  const { rows } = await pool.query(
    `SELECT u.username, m.phone, m.level, m.points, m.joined_at
     FROM members m JOIN users u ON u.id = m.user_id
     WHERE m.user_id = $1`,
    [userId],
  );
  const row = rows[0];
  return {
    username: row.username as string,
    phone: (row.phone as string | null) ?? null,
    level: row.level as string,
    points: row.points as number,
    joinedAt: new Date(row.joined_at as string).toISOString(),
  };
}
