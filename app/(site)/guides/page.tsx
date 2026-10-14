import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/content/guides";

export const metadata: Metadata = {
  title: "知识专栏",
  description:
    "尚美智宿 知识专栏：从房型选择、入住办理到会员积分，帮助你把住留的每个环节安排得更妥帖。",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header>
        <p className="text-sm font-medium text-amber-300/80">使用指南</p>
        <h1 className="mt-2 text-3xl font-bold text-white">把住留安排得更妥帖</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            这里收录了一些入门级的参考文章，帮你建立学习方法、通识科普与写作的基础框架，
            也分享一些和尚美智宿 对话的小技巧。内容持续更新中。
          </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-white/5 px-3 py-1 text-amber-100/90 ring-1 ring-white/10">
                {g.category}
              </span>
              <span className="text-slate-500">{g.readingTime}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white group-hover:text-amber-100">
              {g.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
              {g.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-300 group-hover:text-violet-200">
              阅读全文 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
