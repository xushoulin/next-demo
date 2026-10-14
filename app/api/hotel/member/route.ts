import { getCurrentUsername } from "@/lib/auth";
import { fetchMember } from "@/lib/server/adapters/pms";

export const runtime = "nodejs";

/** GET /api/hotel/member —— 当前用户会员档案 */
export async function GET() {
  const username = await getCurrentUsername();
  if (!username) {
    return Response.json({ error: "请先登录。" }, { status: 401 });
  }
  try {
    const member = await fetchMember(username);
    if (!member) {
      return Response.json({ error: "会员信息不存在。" }, { status: 404 });
    }
    return Response.json({ member });
  } catch (error) {
    console.error("[/api/hotel/member] 查询失败：", error);
    return Response.json({ error: "会员信息查询失败，请稍后再试。" }, { status: 500 });
  }
}
