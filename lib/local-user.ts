"use client";

/**
 * 本地登录兜底：数据库连接失败时，把用户名保存在浏览器本地，
 * 使用户仍可正常登录使用（对话也降级为本地存储）。
 */

export const LOCAL_USER_KEY = "yanzhi_local_user";
export const LOCAL_MODE_KEY = "yanzhi_local_mode";

/** 读取本地保存的用户名（无则 null） */
export function readLocalUser(): string | null {
  try {
    return localStorage.getItem(LOCAL_USER_KEY) || null;
  } catch {
    return null;
  }
}

/** 写入本地用户名，并标记当前为「本地模式」 */
export function saveLocalUser(username: string): void {
  try {
    localStorage.setItem(LOCAL_USER_KEY, username);
    localStorage.setItem(LOCAL_MODE_KEY, "1");
  } catch {
    // 隐私模式等场景下写入失败可忽略
  }
}

/** 清除本地用户名与本地模式标记（数据库可用时调用） */
export function clearLocalUser(): void {
  try {
    localStorage.removeItem(LOCAL_USER_KEY);
    localStorage.removeItem(LOCAL_MODE_KEY);
  } catch {
    // 忽略
  }
}

/** 当前是否处于本地模式（数据库不可用） */
export function isLocalMode(): boolean {
  try {
    return localStorage.getItem(LOCAL_MODE_KEY) === "1";
  } catch {
    return false;
  }
}
