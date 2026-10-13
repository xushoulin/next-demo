import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description:
    "玄机 AI 是一个融合传统典籍与现代心理学的智能助手，提供周公解梦、风水布局与八字排盘三大模块。无需注册即可体验，所有解读仅供娱乐与自我觉察参考。",
  alternates: { canonical: "/" },
};

const MODULES = [
  {
    icon: "🌙",
    name: "AI 周公解梦",
    desc: "把梦里的画面、人物与情绪讲出来，助手会结合《周公解梦》传统典故与现代心理学，从梦境概述、传统解读、心理分析到现实提示，为你梳理梦的来龙去脉。",
    tags: ["梦境概述", "传统典故", "心理分析"],
    href: "/chat",
  },
  {
    icon: "🧭",
    name: "AI 风水先生",
    desc: "描述房屋朝向、户型格局，或你想改善的方位，助手从形势、理气、五行三个层面分析格局，并给出分层、可落地的调整建议，连改动成本都帮你算清楚。",
    tags: ["形势理气", "五行调和", "布局建议"],
    href: "/chat",
  },
  {
    icon: "🧮",
    name: "AI 八字排盘",
    desc: "输入公历出生年、月、日、时，即可排出四柱八字，查看天干地支、五行分布与十神关系，作为认识自身性格倾向的文化参考。",
    tags: ["四柱八字", "五行分布", "十神关系"],
    href: "/chat",
  },
];

const STEPS = [
  {
    step: "01",
    title: "选择一个模块",
    text: "进入对话页面后，在顶部 Tab 中切换「周公解梦」「风水先生」或「八字排盘」，每个模块都有独立的对话上下文。",
  },
  {
    step: "02",
    title: "描述你的疑问",
    text: "尽量写清细节：梦境讲了什么、情绪如何；或房屋的朝向、户型、想改善的方位。细节越具体，解读越贴合。",
  },
  {
    step: "03",
    title: "获取结构化解读",
    text: "助手会以清晰的小节呈现结果，并在末尾给出可供参考的现实提示或调整建议，你可以继续追问、让结论更具体。",
  },
];

const FAQS = [
  {
    q: "需要付费或注册才能用吗？",
    a: "不需要。你可以直接进入对话开始体验。注册（免密码用户名登录）后，对话会保存到账户，方便跨设备查看与继续。",
  },
  {
    q: "解读结果准确吗？能当真吗？",
    a: "解梦与风水都属于传统文化与心理学范畴，结果因人而异，仅供娱乐与自我觉察参考，不应作为医疗、法律或重大决策的依据。",
  },
  {
    q: "我的聊天内容会被泄露吗？",
    a: "未登录时对话仅保存在你自己的浏览器中；登录后写入你绑定的账户。我们不会把聊天内容用于广告投放，详见《隐私政策》。",
  },
  {
    q: "可以多问几次、换着问吗？",
    a: "当然。每个模块都支持连续对话，你可以就同一个梦的不同片段追问，或从多个角度请风水先生重新评估同一处格局。",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.45),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.18),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-amber-100">
            <span aria-hidden="true">🌙</span> 融合传统典籍与现代心理学
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            读懂梦境、打理环境、认识自我
            <span className="mt-2 block bg-gradient-to-r from-amber-200 to-violet-300 bg-clip-text text-transparent">
              一个会聊玄学的智能助手
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            玄机 AI 把《周公解梦》的古老智慧、传统风水的环境观与现代心理学放在一起，
            用自然对话的方式，陪你梳理梦里的线索、改善居住与办公的格局、了解自己的性格倾向。
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/chat"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              免费开始对话 →
            </Link>
            <Link
              href="/guides"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
            >
              查看使用指南
            </Link>
          </div>
        </div>
      </section>

      {/* 三大模块 */}
      <section className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-amber-100">
            三大模块，各司其职
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            无论是夜里的梦、眼前的居所，还是自己的生辰，都能在这里找到一个对话的入口。
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MODULES.map((m) => (
              <div
                key={m.name}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  <span aria-hidden="true">{m.icon}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {m.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                  {m.desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs text-amber-100/90 ring-1 ring-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href={m.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-300 hover:text-violet-200"
                >
                  去体验 {m.name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 如何使用 */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-amber-100">
            三步上手，无需门槛
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="text-3xl font-bold text-amber-400/40">
                  {s.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-amber-100">
            常见问题
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-slate-100">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="ml-4 text-amber-300 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            今晚的梦，或眼前的房间，都值得好好聊一聊
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            打开对话，把模糊的感觉交给玄机 AI，让它帮你梳理成可以理解的线索。
          </p>
          <Link
            href="/chat"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            立即开始 →
          </Link>
        </div>
      </section>
    </>
  );
}
