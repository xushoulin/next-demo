"use client";

import { useState } from "react";
import { clearLocalUser, saveLocalUser } from "@/lib/local-user";

type LoginScreenProps = {
  onLogin: (username: string) => void;
};

const AVATAR = "from-amber-400 to-purple-700";

/** 用户名登录页：输入用户名即登录（免密码，仅用于本地演示） */
export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = username.trim();
    if (!name) {
      setError("请输入用户名");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      const data = (await res.json()) as {
        username?: string;
        storage?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "登录失败，请稍后再试");
        return;
      }
      const loggedIn = data.username || name;
      // 数据库可用时清除本地兜底数据；不可用时把用户名保存到浏览器本地
      if (data.storage === "local") {
        saveLocalUser(loggedIn);
      } else {
        clearLocalUser();
      }
      onLogin(loggedIn);
    } catch {
      setError("网络错误，请确认服务已启动");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(180,83,9,0.28),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(76,29,149,0.38),_transparent_55%)]" />

      <form
        onSubmit={handleSubmit}
        data-testid="login-form"
        className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8"
      >
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-lg shadow-violet-950/40 ${AVATAR}`}
          aria-hidden="true"
        >
          📖
        </div>

        <h1 className="text-center text-xl font-bold text-amber-100">
          砚知 AI
        </h1>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-slate-400">
          输入用户名即可登录，开启你的专属学习空间
        </p>

        <label htmlFor="login-username" className="mt-6 block text-xs text-slate-400">
          用户名
        </label>
        <input
          id="login-username"
          data-testid="login-username"
          autoFocus
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          maxLength={32}
          placeholder="例如：小知"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-400/60 focus:bg-slate-950/80"
        />

        {error && (
          <p
            className="mt-2 text-xs text-rose-300"
            role="alert"
            data-testid="login-error"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          data-testid="login-submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-gradient-to-br from-amber-500 to-purple-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-950/40 transition hover:from-amber-400 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "登录中…" : "进入"}
        </button>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
          免密码登录仅为本地演示；对话将保存到本地数据库，可与同用户名设备共享。
        </p>
      </form>
    </div>
  );
}
