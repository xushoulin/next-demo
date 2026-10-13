"use client";

import { useEffect, useState } from "react";
import { clearLocalUser, isLocalMode, readLocalUser } from "@/lib/local-user";
import ChatApp from "./ChatApp";
import LoginScreen from "./LoginScreen";

/**
 * 应用外壳：按登录态决定渲染登录页还是主应用。
 * 登录态优先由服务端 Cookie 决定；若 Cookie 失效或数据库不可用，
 * 则回退到浏览器本地保存的用户名（本地模式）。
 */
export default function AppShell() {
  const [username, setUsername] = useState<string | null>(null);
  const [localMode, setLocalMode] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    const fallbackToLocal = () => {
      if (!active) return;
      const local = readLocalUser();
      if (local) {
        setUsername(local);
        setLocalMode(true);
      }
    };

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { username: string | null }) => {
        if (!active) return;
        if (data.username) {
          setUsername(data.username);
          // Cookie 有效时，是否本地模式取决于本地标记
          setLocalMode(isLocalMode());
        } else {
          fallbackToLocal();
        }
      })
      .catch(() => {
        fallbackToLocal();
      })
      .finally(() => {
        if (active) setChecked(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
    setLocalMode(isLocalMode());
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearLocalUser();
    setUsername(null);
    setLocalMode(false);
  };

  if (!checked) {
    // 登录态探测期间保持深色背景，避免白屏闪烁
    return <div className="min-h-dvh w-full bg-slate-950" />;
  }

  if (!username) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ChatApp
      username={username}
      localMode={localMode}
      onLogout={handleLogout}
    />
  );
}
