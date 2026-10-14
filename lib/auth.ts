import { cookies } from "next/headers";
import { createHmac } from "node:crypto";

/**
 * 用户名免密登录：仅用 Cookie 标识当前用户（无密码校验）。
 * 为避免 Cookie 被随意篡改冒充，值以 HMAC 签名。
 */

export const AUTH_COOKIE = "shangmei_user";

const SECRET = process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

/** 读取当前登录用户名（Cookie 校验失败 / 缺失时返回 null） */
export async function getCurrentUsername(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(AUTH_COOKIE)?.value;
  if (!raw) return null;
  const sep = raw.lastIndexOf(".");
  if (sep < 0) return null;
  const payload = raw.slice(0, sep);
  const signature = raw.slice(sep + 1);
  if (sign(payload) !== signature) return null;
  try {
    return decodeURIComponent(payload);
  } catch {
    return null;
  }
}

/** 生成用于「设置登录 Cookie」的 { name, value, options } */
export function buildUsernameCookie(username: string) {
  const payload = encodeURIComponent(username);
  const value = `${payload}.${sign(payload)}`;
  return {
    name: AUTH_COOKIE,
    value,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    },
  };
}
