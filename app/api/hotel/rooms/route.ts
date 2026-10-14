import { fetchRoomTypes } from "@/lib/server/adapters/pms";

export const runtime = "nodejs";

/** GET /api/hotel/rooms —— 在售房型列表 */
export async function GET() {
  try {
    const rooms = await fetchRoomTypes();
    return Response.json({ rooms });
  } catch (error) {
    console.error("[/api/hotel/rooms] 查询失败：", error);
    return Response.json({ error: "房型查询失败，请稍后再试。" }, { status: 500 });
  }
}
