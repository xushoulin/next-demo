import { cookies } from "next/headers";
import { upsertUser } from "@/lib/db/queries";
import { buildUsernameCookie } from "@/lib/auth";

export const runtime = "nodejs";

const GENERIC_ERROR = "登录失败，请确认本地数据库已连接（DATABASE_URL）。";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "请求体格式错误。" }, { status: 400 });
  }

  const username =
    typeof body === "object" && body !== null && "username" in body
      ? String((body as { username: unknown }).username ?? "")
      : "";

  const trimmed = username.trim();
  if (!trimmed) {
    return Response.json({ error: "请输入用户名。" }, { status: 400 });
  }
  if (trimmed.length > 32) {
    return Response.json({ error: "用户名长度不能超过 32 个字符。" }, { status: 400 });
  }

  try {
    const user = await upsertUser(trimmed);
    const cookie = buildUsernameCookie(user.username);
    const store = await cookies();
    store.set(cookie.name, cookie.value, cookie.options);
    return Response.json({ username: user.username });
  } catch (error) {
    console.error("[/api/auth/login] 失败：", error);
    return Response.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
