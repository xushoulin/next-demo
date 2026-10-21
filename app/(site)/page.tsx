import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description:
    "砚知 AI 是一个通识学习与写作辅助助手，提供知识问答、写作助手与学习方法三大模块。无需注册即可体验，所有内容仅供学习参考。",
  alternates: { canonical: "/" },
};

const MODULES = [
  {
    icon: "📚",
    name: "AI 知识问答",
    desc: "把科学、历史、文化或生活常识里的疑问讲清楚，助手会用通俗、可靠的方式解释原理，并注明知识的边界与适用条件。",
    tags: ["通俗讲解", "有据可依", "标注边界"],
    href: "/chat",
  },
  {
    icon: "✍️",
    name: "AI 写作助手",
    desc: "贴入你的草稿，告诉想要的效果，助手帮你润色表达、扩写内容、调整结构或换一种语气，让文字更清楚、更有力。",
    tags: ["润色", "扩写改写", "结构化"],
    href: "/chat",
  },
  {
    icon: "🧠",
    name: "AI 学习方法",
    desc: "想做读书笔记、制定学习计划或梳理思维方法，描述你的目标与现状，助手给出具体、可执行的建议，而不是空泛口号。",
    tags: ["读书笔记", "学习计划", "思维方法"],
    href: "/chat",
  },
];

const STEPS = [
  {
    step: "01",
    title: "选择一个模块",
    text: "进入对话页面后，在顶部 Tab 中切换「知识问答」「写作助手」或「学习方法」，每个模块都有独立的对话上下文。",
  },
  {
    step: "02",
    title: "描述你的需求",
    text: "尽量写清细节：想弄懂什么问题、希望文字达成什么效果，或你当前的学习目标与阻碍。细节越具体，回答越贴合。",
  },
  {
    step: "03",
    title: "获取结构化结果",
    text: "助手会以清晰的小节呈现结果，并在末尾给出可执行的建议或行动清单，你可以继续追问、让结论更具体。",
  },
];

const FAQS = [
  {
    q: "需要付费或注册才能用吗？",
    a: "不需要。你可以直接进入对话开始体验。注册（免密码用户名登录）后，对话会保存到账户，方便跨设备查看与继续。",
  },
  {
    q: "回答的内容准确吗？能当真吗？",
    a: "知识类回答基于公开常识整理，力求准确，但不保证绝对无误；涉及医疗、法律、金融等专业领域，请以权威资料或专业人士为准。",
  },
  {
    q: "可以用它代写作业或考试答案吗？",
    a: "不建议，也不鼓励。写作助手仅作辅助润色与思路梳理，最终内容应由你自己完成并对原创性负责。详见《知识专栏》中的相关文章。",
  },
  {
    q: "我的聊天内容会被泄露吗？",
    a: "未登录时对话仅保存在你自己的浏览器中；登录后写入你绑定的账户。我们不会把聊天内容用于广告投放，详见《隐私政策》。",
  },
];

const PICKS = [
  {
    slug: "active-recall",
    title: "主动回忆比反复阅读更有效",
    desc: "为什么「看懂了」不等于「记住了」，以及四个立刻能用的自测练习。",
    category: "学习方法",
  },
  {
    slug: "spaced-repetition",
    title: "间隔重复：顺着遗忘曲线安排复习",
    desc: "同样一小时，安排在什么时候复习，效果可能差好几倍。",
    category: "学习方法",
  },
  {
    slug: "why-sky-blue",
    title: "天空为什么是蓝色的？",
    desc: "从瑞利散射讲到日落偏红，一个被问了一百年的问题的完整解释。",
    category: "通识科普",
  },
  {
    slug: "writing-clarity",
    title: "写作的第一原则：先让句子站得稳",
    desc: "清楚比好看更重要——让句子更稳的几个具体做法。",
    category: "写作技巧",
  },
  {
    slug: "prompting-basics",
    title: "向 AI 提问的入门功夫",
    desc: "同样的工具，为什么有人问不出东西、有人能问出洞见。",
    category: "学习方法",
  },
  {
    slug: "revise-your-writing",
    title: "好文章是改出来的",
    desc: "一套分四层的修改流程：结构、段落、句子、细节。",
    category: "写作技巧",
  },
];

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.45),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.18),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-amber-100">
            <span aria-hidden="true">📖</span> 通识学习 × 写作辅助
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            把好奇心，变成
            <span className="mt-2 block bg-gradient-to-r from-amber-200 to-violet-300 bg-clip-text text-transparent">
              真正弄懂的东西
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            砚知 AI 把可靠的科普讲解、务实的写作辅助与经过验证的学习方法放在一起，
            用一次自然对话，陪你厘清知识、打磨文字、建立属于自己的学习习惯。
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
              浏览知识专栏
            </Link>
          </div>
        </div>
      </section>

      {/* 三大模块 */}
      <section className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-amber-100">
            三大模块，各有侧重
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
            无论是脑子里的一个疑问、桌上的一篇草稿，还是想养成的学习习惯，都能在这里找到一个对话的入口。
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

      {/* 编辑精选 */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-100">专栏精选</h2>
              <p className="mt-3 max-w-2xl text-slate-400">
                知识专栏中的文章均由人工撰写并经过校对，每篇都给出可操作的步骤，
                并标注知识的适用边界。先读几篇，再带着问题来对话，效果会更好。
              </p>
            </div>
            <Link
              href="/guides"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-violet-300 hover:text-violet-200"
            >
              查看全部文章 →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PICKS.map((p) => (
              <Link
                key={p.slug}
                href={`/guides/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20"
              >
                <span className="w-fit rounded-full bg-white/5 px-3 py-1 text-xs text-amber-100/90 ring-1 ring-white/10">
                  {p.category}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-amber-100">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                  {p.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-300 group-hover:text-violet-200">
                  阅读全文 →
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            我们的内容如何创作与校对，详见
            <Link href="/about#editorial" className="text-violet-300 hover:text-violet-200">
              编辑准则
            </Link>
            。
          </p>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            一个好问题，或一段想改好的文字，都值得认真对待
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            打开对话，把模糊的疑问或草稿交给砚知 AI，让它帮你梳理成可以理解的答案。
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
