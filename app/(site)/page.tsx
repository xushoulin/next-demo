import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description:
    "尚美智宿是酒店智能服务助手，提供智能礼宾、预订指引与会员服务三大模块。无需注册即可体验，回答内容仅供参考，价格与房态以官方渠道为准。",
  alternates: { canonical: "/" },
};

const MODULES = [
  {
    icon: "🛎️",
    name: "智能礼宾",
    desc: "早餐时段、健身房开放时间、行李寄存、周边餐厅与出行指引，一句话提问，拿到可直接行动的答案。",
    tags: ["设施服务", "周边推荐", "政策解答"],
    href: "/chat",
  },
  {
    icon: "🛏️",
    name: "智能预订助手",
    desc: "说出入住人数、日期与偏好，帮你推荐合适房型、讲清价格构成与预订流程，并列出入住办理清单。",
    tags: ["房型推荐", "价格说明", "入住指引"],
    href: "/chat",
  },
  {
    icon: "💳",
    name: "会员服务助手",
    desc: "会员权益、积分累计与使用、房型升级申请、发票与售后流程，一次问清，按步骤办理。",
    tags: ["权益解答", "积分规则", "办理指引"],
    href: "/chat",
  },
];

const STEPS = [
  {
    step: "01",
    title: "选择一个模块",
    text: "进入对话页面后，在顶部 Tab 中切换「智能礼宾」「智能预订助手」或「会员服务助手」，每个模块都有独立的对话上下文。",
  },
  {
    step: "02",
    title: "描述你的需求",
    text: "尽量写清细节：入住日期与人数、想用的设施、或要办理的会员业务。细节越具体，回答越贴合你的行程。",
  },
  {
    step: "03",
    title: "按指引行动",
    text: "助手会以清晰的小节呈现结果，并在末尾给出办理路径与注意事项；涉及价格与房态，请以官方渠道确认为准。",
  },
];

const FAQS = [
  {
    q: "需要付费或注册才能用吗？",
    a: "不需要。你可以直接进入对话开始咨询。登录（免密码用户名登录）后，对话会保存到账户，方便跨设备查看与继续。",
  },
  {
    q: "可以直接帮我下单预订吗？",
    a: "助手会讲清房型、价格构成与预订流程，但不代替你执行下单与支付；真实预订请通过官方渠道或前台完成。",
  },
  {
    q: "回答的价格和房态是实时的吗？",
    a: "不是。回答中的价格与房态信息仅供参考，实际以预订系统实时展示与酒店前台确认为准。",
  },
  {
    q: "我的聊天内容会被泄露吗？",
    a: "未登录时对话仅保存在你自己的浏览器中；登录后写入你绑定的账户。我们不会把聊天内容用于广告投放，详见《隐私政策》。",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(180,83,9,0.45),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(30,58,138,0.25),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-amber-100">
            <span aria-hidden="true">🏨</span> 智能礼宾 × 预订指引 × 会员服务
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            从预订到退房，
            <span className="mt-2 block bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-transparent">
              都有人帮你把细节想好
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            尚美智宿把酒店服务信息、预订指引与会员权益放进同一个对话框，
            一次提问就能拿到可直接行动的答案，让每一次入住更省心。
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/chat"
              className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              免费开始咨询 →
            </Link>
            <Link
              href="/guides"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
            >
              浏览服务指南
            </Link>
          </div>
        </div>
      </section>

      {/* 三大模块 */}
      <section className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-amber-100">
            三大模块，覆盖住前住中住后
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            无论是挑选房型、安排行程，还是用足会员权益，都能在这里找到一个对话的入口。
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
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-amber-300 hover:text-amber-200"
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
            一个需求，或一次行程，都值得被安排妥帖
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            打开对话，把你的入住需求交给尚美智宿，让它帮你把细节理成一份可以照做的清单。
          </p>
          <Link
            href="/chat"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            立即开始 →
          </Link>
        </div>
      </section>
    </>
  );
}
