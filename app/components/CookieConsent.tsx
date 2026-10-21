"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "yanzhi-cookie-consent";

/**
 * 轻量 Cookie 提示：首次访问时展示，用户确认后写入 localStorage 不再显示。
 * 说明第三方广告 Cookie 的用途，并链接到隐私政策。
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // 隐私模式等场景下 localStorage 不可用时静默跳过
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // 忽略写入失败
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie 使用提示"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
          本站使用 Cookie 维持登录状态，并通过 Google AdSense 与 Adsterra 展示广告，
          广告商可能依据你的浏览兴趣投放个性化广告。你可以随时在
          <Link href="/privacy" className="text-violet-300 underline underline-offset-2 hover:text-violet-200">
            《隐私政策》
          </Link>
          中了解详情并管理广告偏好。
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          我明白了
        </button>
      </div>
    </div>
  );
}
