import { getCurrentUsername } from "@/lib/auth";
import { getUserId, listBaziRecords, saveBaziRecord } from "@/lib/db/queries";
import type { BaziChart } from "@/lib/bazi";
import type { BaziRecord } from "@/lib/db/types";

export const runtime = "nodejs";

function isBaziInput(value: unknown): value is {
  year: number;
  month: number;
  day: number;
  hour: number;
} {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.year === "number" &&
    typeof v.month === "number" &&
    typeof v.day === "number" &&
    typeof v.hour === "number"
  );
}

/** GET /api/bazi —— 列出当前用户的八字排盘记录 */
export async function GET() {
  const username = await getCurrentUsername();
  if (!username) {
    return Response.json({ error: "请先登录。" }, { status: 401 });
  }
  const userId = await getUserId(username);
  if (!userId) {
    return Response.json({ error: "用户不存在。" }, { status: 401 });
  }
  const records: BaziRecord[] = await listBaziRecords(userId);
  return Response.json({ records });
}

/** POST /api/bazi —— 保存一条八字排盘记录 */
export async function POST(req: Request) {
  const username = await getCurrentUsername();
  if (!username) {
    return Response.json({ error: "请先登录。" }, { status: 401 });
  }
  const userId = await getUserId(username);
  if (!userId) {
    return Response.json({ error: "用户不存在。" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "请求体格式错误。" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !isBaziInput((body as { input?: unknown }).input) ||
    typeof (body as { chart?: unknown }).chart !== "object"
  ) {
    return Response.json({ error: "排盘数据无效。" }, { status: 400 });
  }

  const { input, chart } = body as { input: BaziInput; chart: BaziChart };

  try {
    await saveBaziRecord(userId, input, chart);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[/api/bazi] 保存失败：", error);
    return Response.json({ error: "保存失败，请确认数据库已连接。" }, { status: 500 });
  }
}

type BaziInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
};
