"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { GuideArticle } from "@/lib/content/guides";

/** 专栏分类浏览器：按分类筛选文章 */
export default function GuidesExplorer({ guides }: { guides: GuideArticle[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const g of guides) {
      counts.set(g.category, (counts.get(g.category) ?? 0) + 1);
    }
    return [
      { name: "全部", count: guides.length },
      ...[...counts.entries()].map(([name, count]) => ({ name, count })),
    ];
  }, [guides]);

  const [active, setActive] = useState("全部");

  const visible = useMemo(
    () => (active === "全部" ? guides : guides.filter((g) => g.category === active)),
    [guides, active],
  );

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="文章分类"
      >
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            role="tab"
            aria-selected={active === c.name}
            onClick={() => setActive(c.name)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              active === c.name
                ? "bg-amber-100/90 font-medium text-slate-900"
                : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
            }`}
          >
            {c.name}
            <span className="ml-1.5 text-xs opacity-70">{c.count}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        共 {guides.length} 篇 · 当前显示 {visible.length} 篇
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {visible.map((g) => (
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
    </>
  );
}
