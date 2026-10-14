"use client";

import { useState } from "react";

const CONTACT_EMAIL = "support@yourdomain.com";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `尚美智宿 AI 助手用户反馈 - ${name || "匿名用户"}`,
    );
    const body = encodeURIComponent(
      `姓名：${name}\n邮箱：${email}\n\n${message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm text-slate-300">
          称呼
        </label>
        <input
          id="name"
          data-testid="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="怎么称呼你"
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400/50"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-slate-300">
          邮箱（方便我们回复）
        </label>
        <input
          id="email"
          data-testid="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400/50"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-slate-300">
          想说的话
        </label>
        <textarea
          id="message"
          data-testid="contact-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="功能建议、使用问题或任何想法都可以告诉我们"
          className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400/50"
        />
      </div>
      <button
        type="submit"
        data-testid="contact-submit"
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      >
        通过邮件发送
      </button>
      {sent && (
        <p className="text-sm text-emerald-300" data-testid="contact-success">
          已为你打开邮件客户端，若未自动弹出，请直接发送至 {CONTACT_EMAIL}。
        </p>
      )}
    </form>
  );
}
