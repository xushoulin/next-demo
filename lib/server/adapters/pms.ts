import {
  createBooking,
  getOrCreateMember,
  getRoomType,
  getUserId,
  listBookingsByUser,
  listRoomTypes,
  type Booking,
  type Member,
  type RoomType,
} from "@/lib/db/queries";

/**
 * PMS（Property Management System）适配层。
 *
 * 当前实现：直接读写本地数据库（演示模式）。
 *
 * ★ 对接尚美数智内部系统的唯一替换点 ★
 * 拿到内部 PMS / CRM 的接口文档与测试环境后，仅需将下列函数的实现
 * 替换为对内部服务的调用（保持入参与返回类型不变），上层路由与前端零改动。
 */

export async function fetchRoomTypes(): Promise<RoomType[]> {
  // TODO(尚美对接): 替换为 PMS 房型/价格接口
  return listRoomTypes();
}

export async function fetchRoomType(id: number): Promise<RoomType | null> {
  return getRoomType(id);
}

export async function fetchBookings(username: string): Promise<Booking[]> {
  const userId = await getUserId(username);
  if (!userId) return [];
  // TODO(尚美对接): 替换为 PMS 订单查询接口（按会员号查询）
  return listBookingsByUser(userId);
}

export async function submitBooking(input: {
  username: string;
  roomTypeId: number;
  guestName: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
}): Promise<Booking | null> {
  const userId = await getUserId(input.username);
  if (!userId) return null;
  // TODO(尚美对接): 替换为 PMS 下单接口（校验房态后创建订单）
  return createBooking({
    userId,
    roomTypeId: input.roomTypeId,
    guestName: input.guestName,
    guestPhone: input.guestPhone,
    checkInDate: input.checkInDate,
    checkOutDate: input.checkOutDate,
  });
}

export async function fetchMember(username: string): Promise<Member | null> {
  try {
    // TODO(尚美对接): 替换为 CRM 会员信息接口
    return await getOrCreateMember(username);
  } catch {
    return null;
  }
}
