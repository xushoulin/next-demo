import { getCurrentUsername } from "@/lib/auth";
import { fetchBookings, submitBooking } from "@/lib/server/adapters/pms";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** GET /api/hotel/bookings —— 当前用户的预订列表 */
export async function GET() {
  const username = await getCurrentUsername();
  if (!username) {
    return jsonError("请先登录。", 401);
  }
  try {
    const bookings = await fetchBookings(username);
    return Response.json({ bookings });
  } catch (error) {
    console.error("[/api/hotel/bookings] 查询失败：", error);
    return jsonError("预订查询失败，请稍后再试。", 500);
  }
}

type BookingBody = {
  roomTypeId?: unknown;
  guestName?: unknown;
  guestPhone?: unknown;
  checkInDate?: unknown;
  checkOutDate?: unknown;
};

/** POST /api/hotel/bookings —— 创建预订 */
export async function POST(req: Request) {
  const username = await getCurrentUsername();
  if (!username) {
    return jsonError("请先登录。", 401);
  }

  let body: BookingBody;
  try {
    body = (await req.json()) as BookingBody;
  } catch {
    return jsonError("请求体格式错误。", 400);
  }

  const roomTypeId = Number(body.roomTypeId);
  const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";
  const guestPhone = typeof body.guestPhone === "string" ? body.guestPhone.trim() : "";
  const checkInDate = typeof body.checkInDate === "string" ? body.checkInDate : "";
  const checkOutDate = typeof body.checkOutDate === "string" ? body.checkOutDate : "";

  if (!Number.isInteger(roomTypeId) || roomTypeId <= 0) {
    return jsonError("请选择有效的房型。", 400);
  }
  if (!guestName || guestName.length > 64) {
    return jsonError("请填写入住人姓名。", 400);
  }
  if (!/^1\d{10}$/.test(guestPhone)) {
    return jsonError("请填写 11 位大陆手机号。", 400);
  }
  if (!DATE_RE.test(checkInDate) || !DATE_RE.test(checkOutDate)) {
    return jsonError("入住与离店日期格式应为 YYYY-MM-DD。", 400);
  }
  if (checkOutDate <= checkInDate) {
    return jsonError("离店日期必须晚于入住日期。", 400);
  }

  try {
    const booking = await submitBooking({
      username,
      roomTypeId,
      guestName,
      guestPhone,
      checkInDate,
      checkOutDate,
    });
    if (!booking) {
      return jsonError("创建预订失败，请确认房型后重试。", 400);
    }
    return Response.json({ booking });
  } catch (error) {
    console.error("[/api/hotel/bookings] 创建失败：", error);
    return jsonError("创建预订失败，请稍后再试。", 500);
  }
}
