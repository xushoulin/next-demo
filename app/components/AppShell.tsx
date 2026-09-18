"use client";

import { useEffect, useState } from "react";
import ChatApp from "./ChatApp";
import LoginScreen from "./LoginScreen";

/**
 * 应用外壳：按登录态决定渲染登录页还是主应用。
 * 登录态由服务端 Cookie 决定，客户端通过 /api/auth/me 探测。
 */
export default function AppShell() {
  const [username, setUsername] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { username: string | null }) => {
        if (active) setUsername(data.username ?? null);
      })
      .catch(() => {
        /* 探测失败时当作未登录，不影响进入登录页 */
      })
      .finally(() => {
        if (active) setChecked(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsername(null);
  };

  if (!checked) {
    // 登录态探测期间保持深色背景，避免白屏闪烁
    return <div className="min-h-dvh w-full bg-slate-950" />;
  }

  if (!username) {
    return <LoginScreen onLogin={setUsername} />;
  }

  return <ChatApp username={username} onLogout={handleLogout} />;
}
