import { cookies } from "next/headers";
import { upsertUser } from "@/lib/db/queries";
import { buildUsernameCookie } from "@/lib/auth";

export const runtime = "nodejs";

const SET_COOKIE_ERROR = "登录态设置失败，请稍后再试。";
const LOCAL_NOTICE = "数据库未连接，已启用本地模式，数据仅保存在本机浏览器。";

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

  // 优先写入数据库；数据库不可用时降级为「本地模式」，保证用户仍能登录使用
  let loginName = trimmed;
  let storage: "db" | "local" = "db";
  try {
    const user = await upsertUser(trimmed);
    loginName = user.username;
  } catch (error) {
    console.warn("[/api/auth/login] 数据库不可用，降级为本地登录：", error);
    storage = "local";
  }

  try {
    const cookie = buildUsernameCookie(loginName);
    const store = await cookies();
    store.set(cookie.name, cookie.value, cookie.options);
  } catch (error) {
    console.error("[/api/auth/login] 设置登录态失败：", error);
    return Response.json({ error: SET_COOKIE_ERROR }, { status: 500 });
  }

  return Response.json({
    username: loginName,
    storage,
    ...(storage === "local" ? { notice: LOCAL_NOTICE } : {}),
  });
}
